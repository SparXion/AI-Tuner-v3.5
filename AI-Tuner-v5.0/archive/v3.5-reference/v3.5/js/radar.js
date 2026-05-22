// radar.js – radar chart + blend helpers

const WEB_TUNER_CONFIG = {
    persona: {
        title: 'Persona Spine',
        subtitle: 'Identity & attitude tuning',
        canvasId: 'personaRadarCanvas',
        applyButtonId: 'apply-persona-settings',
        indicatorId: 'persona-pending-indicator',
        leverKeys: [
            'assertiveness',
            'identitySourceLock',
            'adaptivityToUserTone',
            'creativity',
            'playfulness',
            'metaCommentary',
            'teachingMode',
            'proactivityLevel'
        ],
        labels: [
            'Assertiveness',
            'Identity Lock',
            'Tone Adaptivity',
            'Creativity',
            'Playfulness',
            'Meta Commentary',
            'Teaching Mode',
            'Proactivity'
        ]
    },
    engagement: {
        title: 'Engagement Surface',
        subtitle: 'Communication & pacing',
        canvasId: 'engagementRadarCanvas',
        applyButtonId: 'apply-engagement-settings',
        indicatorId: 'engagement-pending-indicator',
        leverKeys: [
            'conciseness',
            'responseDirectness',
            'answerCompleteness',
            'speedOptimization',
            'affirmationFrequency',
            'empathyExpressiveness',
            'safetyDisclaimers',
            'suggestionFrequency'
        ],
        labels: [
            'Conciseness',
            'Directness',
            'Completeness',
            'Speed',
            'Affirmation',
            'Empathy',
            'Safety',
            'Suggestions'
        ]
    },
    truth: {
        title: 'Truth Discipline',
        subtitle: 'Reasoning & validation',
        canvasId: 'truthRadarCanvas',
        applyButtonId: 'apply-truth-settings',
        indicatorId: 'truth-pending-indicator',
        leverKeys: [
            'hedgingIntensity',
            'certaintyModulation',
            'citationRigidity',
            'transparency',
            'technicality',
            'toolAutonomy',
            'memoryAnchoring',
            'goalAdherence'
        ],
        labels: [
            'Hedging',
            'Certainty',
            'Citation',
            'Transparency',
            'Technicality',
            'Tool Autonomy',
            'Memory',
            'Goal Lock'
        ]
    },
    delivery: {
        title: 'Delivery System',
        subtitle: 'Presentation & formatting',
        canvasId: 'deliveryRadarCanvas',
        applyButtonId: 'apply-delivery-settings',
        indicatorId: 'delivery-pending-indicator',
        leverKeys: [
            'markdownStructure',
            'strictFormatting',
            'formattingMinimalism',
            'terminationControl',
            'transitionSmoothness',
            'questionCadence',
            'suggestionFrequency',
            'structuralDensity'
        ],
        labels: [
            'Markdown',
            'Formatting',
            'Output Minimalism',
            'Termination',
            'Transitions',
            'Questions',
            'Suggestions',
            'Structure'
        ]
    }
};

window.WEB_TUNER_CONFIG = WEB_TUNER_CONFIG;

const radarCharts = {};

function updateLeverUI(leverKey, value) {
    if (!leverKey) return;
    const slider = document.getElementById(`lever-${leverKey}`);
    if (slider) {
        slider.value = value;
    }
    const labelEl = document.getElementById(`lever-value-${leverKey}`);
    if (labelEl) {
        labelEl.textContent = value;
    }
}

function cleanupRadarInteractions(canvas) {
    if (canvas && canvas._radarHandlers) {
        Object.entries(canvas._radarHandlers).forEach(([eventName, handler]) => {
            canvas.removeEventListener(eventName, handler);
        });
        canvas._radarHandlers = null;
    }
}

function attachRadarInteractions(canvas, chart, radarLevers, tunerKey) {
    if (!canvas || !chart || !Array.isArray(radarLevers)) {
        return;
    }

    cleanupRadarInteractions(canvas);

    const scale = chart.scales?.r;
    if (!scale) {
        return;
    }

    const state = {
        active: false,
        datasetIndex: null,
        index: null,
        pointerId: null,
        lastValue: null
    };

    const getRelativePosition = (event) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    const computeValueFromEvent = (event) => {
        const { x, y } = getRelativePosition(event);
        const centerX = scale.xCenter;
        const centerY = scale.yCenter;
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxRadius = scale.drawingArea || 1;
        const raw = scale.min + (distance / maxRadius) * (scale.max - scale.min);
        return Math.max(scale.min, Math.min(scale.max, raw));
    };

    const setTooltip = (event) => {
        if (!chart.tooltip || typeof chart.tooltip.setActiveElements !== 'function') {
            return;
        }
        const rel = getRelativePosition(event);
        chart.tooltip.setActiveElements(
            [{ datasetIndex: state.datasetIndex, index: state.index }],
            { x: rel.x, y: rel.y }
        );
    };

    const clearTooltip = () => {
        if (chart.tooltip && typeof chart.tooltip.setActiveElements === 'function') {
            chart.tooltip.setActiveElements([], { x: 0, y: 0 });
        }
    };

    const finalizeDrag = (event) => {
        if (!state.active) return;

        let value = computeValueFromEvent(event);
        if (!Number.isFinite(value)) {
            value = state.lastValue ?? scale.min;
        }
        const rounded = Math.round(value);
        const dataset = chart.data.datasets[state.datasetIndex];
        if (dataset && dataset.data && dataset.data[state.index] !== undefined) {
            dataset.data[state.index] = rounded;
        }

        const lever = radarLevers[state.index];
        if (lever) {
            lever.value = rounded;
            updateLeverUI(lever.key, rounded);
            if (window.aiTuner && typeof window.aiTuner.queueLeverFromRadar === 'function') {
                window.aiTuner.queueLeverFromRadar(tunerKey, lever.key, rounded);
            } else if (window.aiTuner) {
                window.aiTuner.levers[lever.key] = rounded;
            }
        }

        clearTooltip();
        chart.update();

        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
        }

        if (state.pointerId !== null && typeof canvas.releasePointerCapture === 'function') {
            try {
                canvas.releasePointerCapture(state.pointerId);
            } catch (err) {
                // ignore
            }
        }

        canvas.classList.remove('radar-dragging');
        canvas.style.cursor = 'grab';

        state.active = false;
        state.datasetIndex = null;
        state.index = null;
        state.pointerId = null;
        state.lastValue = null;
    };

    const handlers = {
        pointerdown: (event) => {
            if (!chart) return;
            const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
            if (!elements.length) return;
            const element = elements[0];
            if (element.datasetIndex !== 0) return;

            state.active = true;
            state.datasetIndex = element.datasetIndex;
            state.index = element.index;
            state.pointerId = event.pointerId;

            if (typeof canvas.setPointerCapture === 'function') {
                try {
                    canvas.setPointerCapture(event.pointerId);
                } catch (err) {
                    // ignore
                }
            }

            canvas.classList.add('radar-dragging');
            canvas.style.cursor = 'grabbing';

            const value = computeValueFromEvent(event);
            const dataset = chart.data.datasets[element.datasetIndex];
            if (dataset && dataset.data && dataset.data[element.index] !== undefined) {
                dataset.data[element.index] = value;
            }

            const lever = radarLevers[element.index];
            if (lever) {
                const rounded = Math.round(value);
                lever.value = value;
                updateLeverUI(lever.key, rounded);
            }

            state.lastValue = value;
            setTooltip(event);
            chart.update('none');
            event.preventDefault();
        },
        pointermove: (event) => {
            if (!state.active) return;

            const value = computeValueFromEvent(event);
            const dataset = chart.data.datasets[state.datasetIndex];
            if (dataset && dataset.data && dataset.data[state.index] !== undefined) {
                dataset.data[state.index] = value;
            }

            const lever = radarLevers[state.index];
            if (lever) {
                const rounded = Math.round(value);
                lever.value = value;
                updateLeverUI(lever.key, rounded);
            }

            state.lastValue = value;
            setTooltip(event);
            chart.update('none');
            event.preventDefault();
        },
        pointerup: (event) => {
            if (!state.active) return;
            finalizeDrag(event);
            event.preventDefault();
        },
        pointerleave: (event) => {
            if (!state.active) return;
            finalizeDrag(event);
        },
        pointercancel: (event) => {
            if (!state.active) return;
            finalizeDrag(event);
        }
    };

    Object.entries(handlers).forEach(([eventName, handler]) => {
        canvas.addEventListener(eventName, handler);
    });

    canvas._radarHandlers = handlers;
    canvas.style.cursor = 'grab';
}

function valueToNum(v) {
    if (v === null || v === undefined || v === '') return 0;
    
    // Convert to string and lowercase for consistent mapping
    const normalized = String(v).toLowerCase();
    
    const map = {
        // Bluntness
        low: 0, medium: 1, high: 2, absolute: 3,
        // Cognitive Tier / Targeting
        surface: 0, deep: 1,
        // Termination
        natural: 0, abrupt: 1,
        // Sentiment Boost / Sentiment Boosting
        disabled: 0, selective: 1, enabled: 2,
        // Tool Invocation
        prohibited: 0, 'on-request': 1, 'onrequest': 1, proactive: 2,
        // Element Elimination
        none: 0, minimal: 1, moderate: 2, strict: 3,
        // Tone Neutrality
        full: 0, partial: 1, off: 2,
        // Assumption Strength
        weak: 0, strong: 2,
        // Continuation Bias
        suppressed: 0, allowed: 1,
        // Self Sufficiency
        collaborative: 0, independent: 1, obsolescence: 2,
        // Cosmic Perspective
        disabled: 0, subtle: 1, overt: 2,
        // Uncertainty Admission
        required: 2,
        // Truth Prioritization
        'comfort-first': 0, 'comfortfirst': 0, balanced: 1, 'truth-first': 2, 'truthfirst': 2, absolute: 3,
        // Self Referential Humor
        // (already covered by disabled/selective/enabled)
        // Absurdism Injection
        // (already covered by disabled/selective/enabled)
        // Real-Time Data Bias
        'static-cutoff': 1, 'staticcutoff': 1
    };
    
    return map[normalized] ?? 0;
}

function numToValue(n, fieldType) {
    // Map numbers back to values based on field type
    const revMaps = {
        bluntness: { 0: 'low', 1: 'medium', 2: 'high', 3: 'absolute' },
        cognitiveTier: { 0: 'surface', 1: 'deep' },
        termination: { 0: 'natural', 1: 'abrupt' },
        sentimentBoost: { 0: 'disabled', 1: 'selective', 2: 'enabled' },
        toolInvocation: { 0: 'prohibited', 1: 'on-request', 2: 'proactive' },
        elementElimination: { 0: 'none', 1: 'minimal', 2: 'moderate', 3: 'strict' },
        toneNeutrality: { 0: 'full', 1: 'partial', 2: 'off' },
        assumptionStrength: { 0: 'weak', 1: 'medium', 2: 'strong' },
        continuationBias: { 0: 'suppressed', 1: 'allowed' },
        selfSufficiency: { 0: 'collaborative', 1: 'independent', 2: 'obsolescence' },
        cosmicPerspective: { 0: 'disabled', 1: 'subtle', 2: 'overt' },
        truthPrioritization: { 0: 'comfort-first', 1: 'balanced', 2: 'truth-first', 3: 'absolute' },
        mirrorAvoidance: { 0: 'strict', 1: 'selective', 2: 'allowed' },
        transitions: { 0: 'prohibited', 1: 'minimal', 2: 'allowed' },
        callToAction: { 0: 'prohibited', 1: 'minimal', 2: 'allowed' },
        questions: { 0: 'prohibited', 1: 'selective', 2: 'allowed' },
        suggestions: { 0: 'prohibited', 1: 'minimal', 2: 'allowed' },
        motivational: { 0: 'prohibited', 1: 'minimal', 2: 'allowed' },
        sourceTransparency: { 0: 'disabled', 1: 'selective', 2: 'enabled' },
        uncertaintyAdmission: { 0: 'prohibited', 1: 'allowed', 2: 'required' },
        selfReferentialHumor: { 0: 'disabled', 1: 'selective', 2: 'allowed' },
        absurdismInjection: { 0: 'disabled', 1: 'selective', 2: 'enabled' },
        realTimeDataBias: { 0: 'disabled', 1: 'static-cutoff', 2: 'enabled' },
        structuralFormatting: { 0: 'none', 1: 'minimal', 2: 'rich' }
    };
    
    const map = revMaps[fieldType] || { 0: 'low', 1: 'medium', 2: 'high', 3: 'absolute' };
    const rounded = Math.round(n);
    return map[rounded] ?? map[1] ?? 'medium';
}

function blendPresets(p1, p2, ratio) {
    const result = {};
    const allKeys = new Set([...Object.keys(p1), ...Object.keys(p2)]);
    
    allKeys.forEach(k => {
        const v1 = p1[k];
        const v2 = p2[k];
        
        if (v1 === undefined) {
            result[k] = v2;
        } else if (v2 === undefined) {
            result[k] = v1;
        } else {
            const n1 = valueToNum(v1);
            const n2 = valueToNum(v2);
            const blended = n1 * ratio + n2 * (1 - ratio);
            result[k] = numToValue(blended, k);
        }
    });
    
    return result;
}

function drawRadar(preset) {
    const canvas = document.getElementById("radarCanvas");
    if (!canvas) return;
    
    // Check if Chart is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }
    
    // Check if dark mode is active
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Choose colors based on dark mode
    const backgroundColor = isDarkMode ? "rgba(173,216,230,0.2)" : "rgba(54,162,235,0.2)";
    const borderColor = isDarkMode ? "#ADD8E6" : "#36A2EB";
    const pointColor = isDarkMode ? "#ADD8E6" : "#36A2EB";
    const textColor = isDarkMode ? "#ffffff" : "#000000";
    const gridColor = isDarkMode ? "#666666" : "#cccccc";
    
    // Normalize field names to handle Grok's variations (targeting→cognitiveTier, sentimentBoosting→sentimentBoost, etc.)
    const normalizedPreset = {
        bluntness: preset.bluntness || 'medium',
        cognitiveTier: preset.cognitiveTier || preset.targeting || 'surface',
        sentimentBoost: preset.sentimentBoost || preset.sentimentBoosting || 'selective',
        truthPrioritization: preset.truthPrioritization || 'balanced',
        selfReferentialHumor: preset.selfReferentialHumor || 'disabled',
        cosmicPerspective: preset.cosmicPerspective || 'disabled'
    };
    
    // Normalize values to lowercase for consistent mapping
    const normalizeValue = (val) => {
        if (!val || val === null || val === undefined) return '';
        if (typeof val !== 'string') return String(val).toLowerCase();
        return val.toLowerCase();
    };
    
    // Use fallback values for optional fields
    const data = [
        valueToNum(normalizeValue(normalizedPreset.bluntness) || 'medium'),
        valueToNum(normalizeValue(normalizedPreset.cognitiveTier) || 'surface'),
        valueToNum(normalizeValue(normalizedPreset.sentimentBoost) || 'selective'),
        valueToNum(normalizeValue(normalizedPreset.truthPrioritization) || 'balanced'),
        valueToNum(normalizeValue(normalizedPreset.selfReferentialHumor) || 'disabled'),
        valueToNum(normalizeValue(normalizedPreset.cosmicPerspective) || 'disabled')
    ];
    
    if (radarChart) {
        radarChart.destroy();
    }
    
    radarChart = new Chart(canvas, {
        type: "radar",
        data: {
            labels: ["Bluntness", "Depth", "Positivity", "Truth", "Self-Humor", "Cosmic"],
            datasets: [{
                label: "Current",
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                pointBackgroundColor: pointColor
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            resizeDelay: 100,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 3,
                    ticks: {
                        stepSize: 1,
                        color: textColor,
                        backdropColor: isDarkMode ? "#000000" : "#ffffff"
                    },
                    grid: {
                        color: gridColor
                    },
                    pointLabels: {
                        color: textColor
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// v6.0 Radar Chart - works with 0-10 numeric lever values
function drawRadarV6(levers) {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }

    const leverSnapshot = levers || (window.aiTuner ? window.aiTuner.levers : {}) || {};
    Object.keys(WEB_TUNER_CONFIG).forEach(tunerKey => {
        renderTunerRadar(tunerKey, leverSnapshot);
    });
}

function renderTunerRadar(tunerKey, leverSnapshot) {
    const config = WEB_TUNER_CONFIG[tunerKey];
    if (!config) return;

    const canvas = document.getElementById(config.canvasId);
    if (!canvas) return;

    if (!canvas.offsetParent && canvas.offsetWidth === 0 && canvas.offsetHeight === 0) {
        return;
    }

    const isDarkMode = document.body.classList.contains('dark-mode');
    const backgroundColor = isDarkMode ? "rgba(173,216,230,0.18)" : "rgba(54,162,235,0.18)";
    const borderColor = isDarkMode ? "#ADD8E6" : "#36A2EB";
    const pointColor = isDarkMode ? "#ADD8E6" : "#36A2EB";
    const textColor = isDarkMode ? "#ffffff" : "#000000";
    const gridColor = isDarkMode ? "#5f6775" : "#d0d7e3";

    cleanupRadarInteractions(canvas);

    if (radarCharts[tunerKey]) {
        try {
            radarCharts[tunerKey].destroy();
        } catch (e) {
            console.warn(`Error destroying ${tunerKey} radar:`, e);
        }
        radarCharts[tunerKey] = null;
    }

    const radarLevers = config.leverKeys.map((leverKey, index) => {
        const label =
            (config.labels && config.labels[index]) ||
            (window.LEVERS_V6 && window.LEVERS_V6[leverKey] && window.LEVERS_V6[leverKey].name) ||
            leverKey;

        let value = 5;
        if (window.aiTuner && typeof window.aiTuner.getLeverValueForRadar === 'function') {
            value = window.aiTuner.getLeverValueForRadar(tunerKey, leverKey, 5);
        } else if (leverSnapshot && leverSnapshot[leverKey] !== undefined) {
            value = leverSnapshot[leverKey];
        }

        const numeric = Number(value);
        return {
            key: leverKey,
            label,
            value: Number.isFinite(numeric) ? numeric : 5
        };
    });

    const labels = radarLevers.map(l => l.label);
    const data = radarLevers.map(l => l.value);

    const chart = new Chart(canvas, {
        type: "radar",
        data: {
            labels,
            datasets: [{
                label: "Current Settings",
                data,
                backgroundColor,
                borderColor,
                pointBackgroundColor: pointColor,
                pointBorderColor: borderColor,
                pointHoverBackgroundColor: pointColor,
                pointHoverBorderColor: textColor,
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            resizeDelay: 100,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        color: textColor,
                        backdropColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: gridColor,
                        lineWidth: 1
                    },
                    pointLabels: {
                        color: textColor,
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        padding: 5
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const lever = radarLevers[context.dataIndex];
                            const val = Math.round(lever?.value ?? context.raw ?? 0);
                            return `${lever.label}: ${val}/10`;
                        }
                    }
                }
            }
        }
    });

    radarCharts[tunerKey] = chart;

    if (typeof chart.resize === 'function') {
        setTimeout(() => {
            try {
                chart.resize();
            } catch (e) {
                console.warn(`Error resizing ${tunerKey} radar:`, e);
            }
        }, 50);
    }

    attachRadarInteractions(canvas, chart, radarLevers, tunerKey);
}

let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.aiTuner && typeof drawRadarV6 === 'function') {
            drawRadarV6(window.aiTuner.levers || {});
        }
    }, 200);
}

window.addEventListener('resize', handleResize);

