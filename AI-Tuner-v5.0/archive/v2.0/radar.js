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
    // Select representative levers that show different aspects of AI behavior
    // Chart.js places labels clockwise starting from top (12 o'clock)
    // Order: left (9 o'clock) -> clockwise around the chart
    // For 8 labels: Left=6, Bottom=4, Right=2, Top=0
    const radarLevers = [
        { key: 'creativity', label: 'Creativity', value: levers.creativity || 5 },                 // 10 chars - top (12 o'clock)
        { key: 'teachingMode', label: 'Teaching', value: levers.teachingMode || 5 },              // 8 chars - top-right (1:30)
        { key: 'proactivityLevel', label: 'Proactivity', value: levers.proactivityLevel || 5 },   // 11 chars - right (3 o'clock)
        { key: 'playfulness', label: 'Playfulness', value: levers.playfulness || 5 },              // 11 chars - bottom-right (4:30)
        { key: 'conciseness', label: 'Conciseness', value: levers.conciseness || 5 },              // 11 chars - bottom (6 o'clock)
        { key: 'answerCompleteness', label: 'Completeness', value: levers.answerCompleteness || 5 }, // 12 chars - bottom-left (7:30)
        { key: 'hedgingIntensity', label: 'Hedging', value: levers.hedgingIntensity || 5 },      // 7 chars - left (9 o'clock) ← SHORTEST
        { key: 'empathyExpressiveness', label: 'Empathy', value: levers.empathyExpressiveness || 5 } // 7 chars - top-left (10:30)
    ];
    
    const labels = radarLevers.map(l => l.label);
    const data = radarLevers.map(l => l.value || 5);
    
    // Prevent multiple simultaneous chart creations
    if (isCreatingChart) {
        console.warn('Chart creation already in progress, skipping...');
        return;
    }
    
    // Destroy existing chart if it exists (synchronously, before setTimeout)
    if (radarChart) {
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
            // Set explicit dimensions if needed
            if (!canvas.style.width) {
                canvas.style.width = '100%';
            }
            if (!canvas.style.height) {
                canvas.style.height = '100%';
            }
        }
    }
    
    // Small delay to ensure DOM is stable (especially after DOM moves)
    setTimeout(() => {
        // Double-check we're not already creating a chart
        if (isCreatingChart) {
            console.warn('Chart creation already in progress (inside setTimeout), skipping...');
            return;
        }
        
        // Destroy again inside setTimeout in case another chart was created
        if (radarChart) {
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
            responsive: false, // Disable automatic responsive - we handle it manually
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
                            return `${lever.label}: ${lever.value}/10`;
                        }
                    }
                }
            }
        }
            });
            
            // Force resize after creation (helps with mobile rendering)
            if (radarChart && typeof radarChart.resize === 'function') {
                setTimeout(() => {
                    try {
                        radarChart.resize();
                    } catch (e) {
                        console.warn('Error resizing chart:', e);
                    }
                }, 50);
            }
        } catch (e) {
            console.error('Error creating radar chart:', e);
            radarChart = null;
            // Retry after a delay if there was an error (but only if not already retrying)
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
                if (radarChart) {
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
                    if (radarChart.canvas && radarChart.canvas.ownerDocument) {
                        radarChart.resize();
                    } else {
                        // Chart is invalid, destroy and recreate
                        radarChart.destroy();
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
                        if (radarChart) {
                            try {
                                radarChart.destroy();
                            } catch (e2) {
                                // Ignore destroy errors
                            }
                            radarChart = null;
                        }
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

