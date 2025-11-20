// radar.js – radar chart + blend helpers

let radarChart = null;
let isCreatingChart = false; // Flag to prevent multiple simultaneous chart creations

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
    const canvas = document.getElementById("radarCanvas");
    if (!canvas) {
        console.warn('Radar canvas not found');
        return;
    }
    
    // Check if Chart is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }
    
    // Check if canvas is in the DOM and visible
    if (!canvas.offsetParent && canvas.offsetWidth === 0 && canvas.offsetHeight === 0) {
        console.warn('Radar canvas is not visible');
        // Try again after a short delay
        setTimeout(() => drawRadarV6(levers), 100);
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
    
    // Map key levers to radar chart dimensions
    const radarLevers = [
        { key: 'creativity', label: 'Creativity', value: levers.creativity || 5 },
        { key: 'teachingMode', label: 'Teaching', value: levers.teachingMode || 5 },
        { key: 'proactivityLevel', label: 'Proactivity', value: levers.proactivityLevel || 5 },
        { key: 'playfulness', label: 'Playfulness', value: levers.playfulness || 5 },
        { key: 'conciseness', label: 'Conciseness', value: levers.conciseness || 5 },
        { key: 'answerCompleteness', label: 'Completeness', value: levers.answerCompleteness || 5 },
        { key: 'hedgingIntensity', label: 'Hedging', value: levers.hedgingIntensity || 5 },
        { key: 'empathyExpressiveness', label: 'Empathy', value: levers.empathyExpressiveness || 5 }
    ];
    
    const labels = radarLevers.map(l => l.label);
    const data = radarLevers.map(l => l.value || 5);
    
    // If chart exists and is valid, just update the data instead of destroying/recreating
    // This prevents the blinking/shifting animation
    if (radarChart && typeof radarChart.update === 'function' && radarChart.canvas && radarChart.canvas.ownerDocument) {
        try {
            // Update the data
            radarChart.data.datasets[0].data = data;
            // Update without animation for instant, smooth updates
            radarChart.update('none'); // 'none' mode = no animation, instant update
            return; // Exit early - no need to recreate
        } catch (e) {
            console.warn('Error updating chart, will recreate:', e);
            // If update fails, destroy and fall through to recreate
            if (radarChart && typeof radarChart.destroy === 'function') {
                try {
                    radarChart.destroy();
                } catch (e2) {
                    // Ignore destroy errors
                }
            }
            radarChart = null;
        }
    }
    
    // Only create new chart if one doesn't exist or update failed
    // Prevent multiple simultaneous chart creations
    if (isCreatingChart) {
        console.warn('Chart creation already in progress, skipping...');
        return;
    }
    
    // Destroy existing chart if it exists (synchronously, before setTimeout)
    if (radarChart && typeof radarChart.destroy === 'function') {
        try {
            radarChart.destroy();
        } catch (e) {
            console.warn('Error destroying chart:', e);
        }
        radarChart = null;
    }
    
    // Ensure canvas has proper dimensions
    const container = canvas.closest('.radar-wrapper');
    if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        if (containerWidth > 0 && containerHeight > 0) {
            if (!canvas.style.width) {
                canvas.style.width = '100%';
            }
            if (!canvas.style.height) {
                canvas.style.height = '100%';
            }
        }
    }
    
    setTimeout(() => {
        // Double-check if chart exists and can be updated (might have been created between checks)
        if (radarChart && typeof radarChart.update === 'function' && radarChart.canvas && radarChart.canvas.ownerDocument) {
            try {
                radarChart.data.datasets[0].data = data;
                radarChart.update('none');
                return;
            } catch (e) {
                // Update failed, destroy and recreate
                if (radarChart && typeof radarChart.destroy === 'function') {
                    try {
                        radarChart.destroy();
                    } catch (e2) {
                        // Ignore
                    }
                }
                radarChart = null;
            }
        }
        
        if (isCreatingChart) {
            console.warn('Chart creation already in progress (inside setTimeout), skipping...');
            return;
        }
        
        if (radarChart && typeof radarChart.destroy === 'function') {
            try {
                radarChart.destroy();
            } catch (e) {
                console.warn('Error destroying chart (inside setTimeout):', e);
            }
            radarChart = null;
        }
        
        isCreatingChart = true;
        try {
            radarChart = new Chart(canvas, {
                type: "radar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Current Settings",
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
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
                                label: function(context) {
                                    const lever = radarLevers[context.dataIndex];
                                    return `${lever.label}: ${Math.round(lever.value)}/10`;
                                }
                            }
                        }
                    }
                }
            });
            
            attachRadarInteractions(canvas, radarChart, radarLevers);
            
            if (radarChart && typeof radarChart.resize === 'function') {
                setTimeout(() => {
                    try {
                        // Check if chart is still valid before resizing
                        if (radarChart && radarChart.canvas && radarChart.canvas.ownerDocument) {
                            radarChart.resize();
                        }
                    } catch (e) {
                        console.warn('Error resizing chart:', e);
                    }
                }, 50);
            }
        } catch (e) {
            console.error('Error creating radar chart:', e);
            radarChart = null;
            setTimeout(() => {
                if (!isCreatingChart) {
                    drawRadarV6(levers);
                }
            }, 200);
        } finally {
            isCreatingChart = false;
        }
    }, 50);
}

function cleanupRadarInteractions(canvas) {
    if (canvas && canvas._radarHandlers) {
        Object.entries(canvas._radarHandlers).forEach(([evt, handler]) => {
            canvas.removeEventListener(evt, handler);
        });
        canvas._radarHandlers = null;
    }
}

function attachRadarInteractions(canvas, chart, radarLevers) {
    if (!canvas || !chart || !chart.scales || !chart.scales.r) {
        return;
    }

    cleanupRadarInteractions(canvas);

    const scale = chart.scales.r;
    const state = {
        active: false,
        index: null,
        pointerId: null
    };

    const computeValue = (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const dx = x - scale.xCenter;
        const dy = y - scale.yCenter;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const raw = scale.min + (distance / (scale.drawingArea || 1)) * (scale.max - scale.min);
        return Math.max(scale.min, Math.min(scale.max, raw));
    };

    const applyValue = (index, rawValue) => {
        const dataset = chart.data.datasets[0];
        if (!dataset || dataset.data[index] === undefined) return;
        dataset.data[index] = rawValue;
        radarLevers[index].value = rawValue;
        chart.update('none');

        const lever = radarLevers[index];
        const clamped = Math.round(Math.max(0, Math.min(10, rawValue)));
        if (window.aiTuner && window.aiTuner.levers) {
            window.aiTuner.levers[lever.key] = clamped;
        }

        const slider = document.getElementById(`lever-${lever.key}`);
        if (slider) {
            slider.value = clamped;
        }
        const valueLabel = document.getElementById(`lever-value-${lever.key}`);
        if (valueLabel) {
            valueLabel.textContent = clamped;
        }

        if (window.aiTuner) {
            const preview = window.aiTuner.elements?.preview;
            if (preview) {
                const placeholder = preview.querySelector?.('.placeholder-text');
                if (placeholder) {
                    placeholder.remove();
                }
                const promptText = window.aiTuner.buildPrompt?.() ?? '';
                if (promptText && promptText.trim()) {
                    preview.textContent = promptText;
                }
            }
        }
    };

    const finalize = () => {
        state.active = false;
        state.index = null;
        if (window.aiTuner && typeof window.aiTuner.generatePrompt === 'function') {
            window.requestAnimationFrame(() => window.aiTuner.generatePrompt());
        }
        canvas.style.cursor = 'grab';
    };

    const handlers = {
        pointerdown: (event) => {
            const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
            if (!elements.length) return;
            const element = elements[0];
            if (element.datasetIndex !== 0) return;

            state.active = true;
            state.index = element.index;
            state.pointerId = event.pointerId;
            try {
                canvas.setPointerCapture(event.pointerId);
            } catch (err) {
                // Ignore pointer capture errors (rare on desktop)
            }
            canvas.style.cursor = 'grabbing';

            const value = computeValue(event);
            applyValue(state.index, value);
            event.preventDefault();
        },
        pointermove: (event) => {
            if (!state.active) return;
            const value = computeValue(event);
            applyValue(state.index, value);
            event.preventDefault();
        },
        pointerup: (event) => {
            if (!state.active) return;
            try {
                canvas.releasePointerCapture(state.pointerId);
            } catch (err) {
                // Ignore release errors
            }
            finalize();
            event.preventDefault();
        },
        pointercancel: () => {
            if (!state.active) return;
            finalize();
        },
        pointerleave: () => {
            if (!state.active) return;
            finalize();
        }
    };

    Object.entries(handlers).forEach(([evt, handler]) => {
        canvas.addEventListener(evt, handler);
    });

    canvas._radarHandlers = handlers;
    canvas.style.cursor = 'grab';
}

// Redraw radar chart on window resize with debouncing
let resizeTimeout;
let isResizing = false;

function handleResize() {
    if (!isResizing) {
        isResizing = true;
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Check if canvas exists and is visible before trying to resize
            const canvas = document.getElementById("radarCanvas");
            if (!canvas) {
                isResizing = false;
                return;
            }
            
            // Check if canvas is in the DOM and visible
            if (!canvas.offsetParent && canvas.offsetWidth === 0 && canvas.offsetHeight === 0) {
                // Canvas is hidden, destroy chart if it exists
                if (radarChart && typeof radarChart.destroy === 'function') {
                    try {
                        radarChart.destroy();
                    } catch (e) {
                        console.warn('Error destroying hidden chart:', e);
                    }
                    radarChart = null;
                }
                isResizing = false;
                return;
            }
            
            // Canvas is visible, try to resize or redraw
            if (radarChart) {
                try {
                    // Check if chart is still valid (canvas hasn't been removed)
                    if (radarChart && radarChart.canvas && radarChart.canvas.ownerDocument && typeof radarChart.resize === 'function') {
                        radarChart.resize();
                    } else {
                        // Chart is invalid, destroy and recreate
                        if (radarChart && typeof radarChart.destroy === 'function') {
                            try {
                                radarChart.destroy();
                            } catch (e2) {
                                // Ignore destroy errors
                            }
                        }
                        radarChart = null;
                        // Redraw if we have data
                        if (window.aiTuner && window.aiTuner.levers && typeof drawRadarV6 === 'function') {
                            drawRadarV6(window.aiTuner.levers);
                        }
                    }
                } catch (e) {
                    console.warn('Error resizing chart:', e);
                    // If resize fails, try to redraw
                    if (window.aiTuner && window.aiTuner.levers && typeof drawRadarV6 === 'function') {
                        // Destroy invalid chart first
                        if (radarChart && typeof radarChart.destroy === 'function') {
                            try {
                                radarChart.destroy();
                            } catch (e2) {
                                // Ignore destroy errors
                            }
                        }
                        radarChart = null;
                        drawRadarV6(window.aiTuner.levers);
                    }
                }
            } else {
                // No chart exists, create one if we have data
                if (window.aiTuner && window.aiTuner.levers && typeof drawRadarV6 === 'function') {
                    drawRadarV6(window.aiTuner.levers);
                } else if (window.aiTuner && typeof window.aiTuner.getCurrentSettings === 'function') {
                    const currentSettings = window.aiTuner.getCurrentSettings();
                    if (currentSettings && typeof drawRadar === 'function') {
                        drawRadar(currentSettings);
                    }
                }
            }
            isResizing = false;
        }, 300);
    }
}

window.addEventListener('resize', handleResize);

// ============================================
// MODEL CARD RADARS (Step 1 - Embedded in Cards)
// ============================================

// Store model card chart instances
const modelCardCharts = {};

/**
 * Draw a small radar chart embedded in a model card
 * Shows default model profile - clickable to select model
 */
function drawModelCardRadar(modelKey, canvasId, isSelected = false) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn(`Comparison radar canvas not found: ${canvasId}`);
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }
    
    const model = window.AI_MODELS_V6[modelKey];
    if (!model || !model.defaults) {
        console.warn(`Model not found: ${modelKey}`);
        return;
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const backgroundColor = isSelected 
        ? (isDarkMode ? "rgba(76,175,80,0.3)" : "rgba(76,175,80,0.2)")
        : (isDarkMode ? "rgba(173,216,230,0.15)" : "rgba(54,162,235,0.15)");
    const borderColor = isSelected
        ? (isDarkMode ? "#4CAF50" : "#4CAF50")
        : (isDarkMode ? "#ADD8E6" : "#36A2EB");
    const pointColor = isSelected
        ? (isDarkMode ? "#4CAF50" : "#4CAF50")
        : (isDarkMode ? "#ADD8E6" : "#36A2EB");
    const textColor = isDarkMode ? "#ffffff" : "#000000";
    const gridColor = isDarkMode ? "#666666" : "#cccccc";
    
    // Use same 8 key levers as main radar
    const radarLevers = [
        { key: 'creativity', label: 'Creativity', value: model.defaults.creativity || 5 },
        { key: 'teachingMode', label: 'Teaching', value: model.defaults.teachingMode || 5 },
        { key: 'proactivityLevel', label: 'Proactivity', value: model.defaults.proactivityLevel || 5 },
        { key: 'playfulness', label: 'Playfulness', value: model.defaults.playfulness || 5 },
        { key: 'conciseness', label: 'Conciseness', value: model.defaults.conciseness || 5 },
        { key: 'answerCompleteness', label: 'Completeness', value: model.defaults.answerCompleteness || 5 },
        { key: 'hedgingIntensity', label: 'Hedging', value: model.defaults.hedgingIntensity || 5 },
        { key: 'empathyExpressiveness', label: 'Empathy', value: model.defaults.empathyExpressiveness || 5 }
    ];
    
    const labels = radarLevers.map(l => l.label);
    const data = radarLevers.map(l => l.value || 5);
    
    // Destroy existing chart if it exists
    if (modelCardCharts[canvasId] && typeof modelCardCharts[canvasId].destroy === 'function') {
        try {
            modelCardCharts[canvasId].destroy();
        } catch (e) {
            console.warn('Error destroying model card chart:', e);
        }
    }
    
    setTimeout(() => {
        try {
            modelCardCharts[canvasId] = new Chart(canvas, {
                type: "radar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: model.name,
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        pointBackgroundColor: pointColor,
                        pointBorderColor: borderColor,
                        pointHoverBackgroundColor: pointColor,
                        pointHoverBorderColor: borderColor,
                        borderWidth: isSelected ? 3 : 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                                stepSize: 2,
                                display: false // Hide tick numbers for cleaner look
                            },
                            grid: {
                                color: gridColor,
                                lineWidth: 1
                            },
                            pointLabels: {
                                color: textColor,
                                font: {
                                    size: 9
                                },
                                display: true
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.r;
                                }
                            }
                        }
                    }
                }
            });
        } catch (e) {
            console.error('Error creating comparison chart:', e);
        }
    }, 50);
}

// ============================================
// WEB TUNER RADARS (Step 3 - Advanced Mode)
// ============================================

// Store web tuner chart instances
const webTunerCharts = {};

/**
 * Draw Persona Spine Web Tuner (8 axes)
 */
function drawPersonaSpineRadar(levers, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const backgroundColor = isDarkMode ? "rgba(173,216,230,0.2)" : "rgba(54,162,235,0.2)";
    const borderColor = isDarkMode ? "#ADD8E6" : "#36A2EB";
    const textColor = isDarkMode ? "#ffffff" : "#000000";
    const gridColor = isDarkMode ? "#666666" : "#cccccc";
    
    const axes = [
        { key: 'assertiveness', label: 'Assertiveness', value: levers.assertiveness || 5 },
        { key: 'identitySourceLock', label: 'Identity Lock', value: levers.identitySourceLock || 5 },
        { key: 'adaptivityToUserTone', label: 'Tone Adaptivity', value: levers.adaptivityToUserTone || 5 },
        { key: 'creativity', label: 'Creativity', value: levers.creativity || 5 },
        { key: 'playfulness', label: 'Playfulness', value: levers.playfulness || 5 },
        { key: 'metaCommentary', label: 'Meta-Commentary', value: levers.metaCommentary || 5 },
        { key: 'teachingMode', label: 'Teaching Mode', value: levers.teachingMode || 5 },
        { key: 'proactivityLevel', label: 'Proactivity', value: levers.proactivityLevel || 5 }
    ];
    
    const labels = axes.map(a => a.label);
    const data = axes.map(a => a.value || 5);
    
    if (webTunerCharts[canvasId] && typeof webTunerCharts[canvasId].destroy === 'function') {
        try {
            webTunerCharts[canvasId].destroy();
        } catch (e) {
            console.warn('Error destroying web tuner chart:', e);
        }
    }
    
    setTimeout(() => {
        try {
            webTunerCharts[canvasId] = new Chart(canvas, {
                type: "radar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Persona Spine",
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        pointBackgroundColor: borderColor,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                                stepSize: 2,
                                display: true,
                                color: "#ffffff", // Always white text for tick numbers
                                backdropColor: "#1a1a1a", // Always dark background
                                font: {
                                    size: 11
                                }
                            },
                            grid: {
                                color: gridColor
                            },
                            pointLabels: {
                                color: textColor,
                                font: {
                                    size: 11
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    onHover: (event, activeElements) => {
                        canvas.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                    }
                }
            });
        } catch (e) {
            console.error('Error creating Persona Spine chart:', e);
        }
    }, 50);
}

/**
 * Draw Engagement Surface Web Tuner (8 axes)
 */
function drawEngagementSurfaceRadar(levers, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const backgroundColor = isDarkMode ? "rgba(255,152,0,0.2)" : "rgba(255,152,0,0.2)";
    const borderColor = isDarkMode ? "#FF9800" : "#FF9800";
    const textColor = isDarkMode ? "#ffffff" : "#000000";
    const gridColor = isDarkMode ? "#666666" : "#cccccc";
    
    const axes = [
        { key: 'conciseness', label: 'Conciseness', value: levers.conciseness || 5 },
        { key: 'responseDirectness', label: 'Directness', value: levers.responseDirectness || 5 },
        { key: 'answerCompleteness', label: 'Completeness', value: levers.answerCompleteness || 5 },
        { key: 'speedOptimization', label: 'Speed', value: levers.speedOptimization || 5 },
        { key: 'affirmationFrequency', label: 'Affirmation', value: levers.affirmationFrequency || 5 },
        { key: 'empathyExpressiveness', label: 'Empathy', value: levers.empathyExpressiveness || 5 },
        { key: 'safetyDisclaimers', label: 'Safety', value: levers.safetyDisclaimers || 5 },
        { key: 'structuralDensity', label: 'Structure', value: levers.structuralDensity || 5 }
    ];
    
    const labels = axes.map(a => a.label);
    const data = axes.map(a => a.value || 5);
    
    if (webTunerCharts[canvasId] && typeof webTunerCharts[canvasId].destroy === 'function') {
        try {
            webTunerCharts[canvasId].destroy();
        } catch (e) {
            console.warn('Error destroying web tuner chart:', e);
        }
    }
    
    setTimeout(() => {
        try {
            webTunerCharts[canvasId] = new Chart(canvas, {
                type: "radar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Engagement Surface",
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        pointBackgroundColor: borderColor,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                                stepSize: 2,
                                display: true,
                                color: "#ffffff", // Always white text for tick numbers
                                backdropColor: "#1a1a1a", // Always dark background
                                font: {
                                    size: 11
                                }
                            },
                            grid: {
                                color: gridColor
                            },
                            pointLabels: {
                                color: textColor,
                                font: {
                                    size: 11
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    onHover: (event, activeElements) => {
                        canvas.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                    }
                }
            });
        } catch (e) {
            console.error('Error creating Engagement Surface chart:', e);
        }
    }, 50);
}

/**
 * Draw Truth Discipline Web Tuner (8 axes)
 */
function drawTruthDisciplineRadar(levers, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const backgroundColor = isDarkMode ? "rgba(244,67,54,0.2)" : "rgba(244,67,54,0.2)";
    const borderColor = isDarkMode ? "#F44336" : "#F44336";
    const textColor = isDarkMode ? "#ffffff" : "#000000";
    const gridColor = isDarkMode ? "#666666" : "#cccccc";
    
    const axes = [
        { key: 'hedgingIntensity', label: 'Hedging', value: levers.hedgingIntensity || 5 },
        { key: 'certaintyModulation', label: 'Certainty', value: levers.certaintyModulation || 5 },
        { key: 'citationRigidity', label: 'Citation', value: levers.citationRigidity || 5 },
        { key: 'transparency', label: 'Transparency', value: levers.transparency || 5 },
        { key: 'technicality', label: 'Technicality', value: levers.technicality || 5 },
        { key: 'toolAutonomy', label: 'Tool Autonomy', value: levers.toolAutonomy || 5 },
        { key: 'answerCompleteness', label: 'Memory', value: levers.answerCompleteness || 5 }, // Placeholder
        { key: 'proactivityLevel', label: 'Goal Lock', value: levers.proactivityLevel || 5 } // Placeholder
    ];
    
    const labels = axes.map(a => a.label);
    const data = axes.map(a => a.value || 5);
    
    if (webTunerCharts[canvasId] && typeof webTunerCharts[canvasId].destroy === 'function') {
        try {
            webTunerCharts[canvasId].destroy();
        } catch (e) {
            console.warn('Error destroying web tuner chart:', e);
        }
    }
    
    setTimeout(() => {
        try {
            webTunerCharts[canvasId] = new Chart(canvas, {
                type: "radar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Truth Discipline",
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        pointBackgroundColor: borderColor,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                                stepSize: 2,
                                display: true,
                                color: "#ffffff", // Always white text for tick numbers
                                backdropColor: "#1a1a1a", // Always dark background
                                font: {
                                    size: 11
                                }
                            },
                            grid: {
                                color: gridColor
                            },
                            pointLabels: {
                                color: textColor,
                                font: {
                                    size: 11
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    onHover: (event, activeElements) => {
                        canvas.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                    }
                }
            });
        } catch (e) {
            console.error('Error creating Truth Discipline chart:', e);
        }
    }, 50);
}

/**
 * Draw Delivery System Web Tuner (8 axes)
 */
function drawDeliverySystemRadar(levers, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const backgroundColor = isDarkMode ? "rgba(156,39,176,0.2)" : "rgba(156,39,176,0.2)";
    const borderColor = isDarkMode ? "#9C27B0" : "#9C27B0";
    const textColor = isDarkMode ? "#ffffff" : "#000000";
    const gridColor = isDarkMode ? "#666666" : "#cccccc";
    
    const axes = [
        { key: 'markdownStructure', label: 'Markdown', value: levers.markdownStructure || 5 },
        { key: 'strictFormatting', label: 'Formatting', value: levers.strictFormatting || 5 },
        { key: 'formattingMinimalism', label: 'Output Format', value: levers.formattingMinimalism || 5 },
        { key: 'formality', label: 'Response Style', value: levers.formality || 5 },
        { key: 'conciseness', label: 'Termination', value: levers.conciseness || 5 }, // Placeholder
        { key: 'responseDirectness', label: 'Transitions', value: levers.responseDirectness || 5 }, // Placeholder
        { key: 'proactivityLevel', label: 'Questions', value: levers.proactivityLevel || 5 }, // Placeholder
        { key: 'proactivityLevel', label: 'Suggestions', value: levers.proactivityLevel || 5 } // Placeholder
    ];
    
    const labels = axes.map(a => a.label);
    const data = axes.map(a => a.value || 5);
    
    if (webTunerCharts[canvasId] && typeof webTunerCharts[canvasId].destroy === 'function') {
        try {
            webTunerCharts[canvasId].destroy();
        } catch (e) {
            console.warn('Error destroying web tuner chart:', e);
        }
    }
    
    setTimeout(() => {
        try {
            webTunerCharts[canvasId] = new Chart(canvas, {
                type: "radar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Delivery System",
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        pointBackgroundColor: borderColor,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                                stepSize: 2,
                                display: true,
                                color: "#ffffff", // Always white text for tick numbers
                                backdropColor: "#1a1a1a", // Always dark background
                                font: {
                                    size: 11
                                }
                            },
                            grid: {
                                color: gridColor
                            },
                            pointLabels: {
                                color: textColor,
                                font: {
                                    size: 11
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    onHover: (event, activeElements) => {
                        canvas.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                    }
                }
            });
        } catch (e) {
            console.error('Error creating Delivery System chart:', e);
        }
    }, 50);
}

/**
 * Draw all 4 web tuner radars (Advanced mode only)
 */
function drawAllWebTuners(levers) {
    if (!levers) return;
    
    drawPersonaSpineRadar(levers, 'web-tuner-persona-spine');
    drawEngagementSurfaceRadar(levers, 'web-tuner-engagement');
    drawTruthDisciplineRadar(levers, 'web-tuner-truth');
    drawDeliverySystemRadar(levers, 'web-tuner-delivery');
}

