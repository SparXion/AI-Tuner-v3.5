/**
 * AITuner v5.0 — pillar radars (Chart.js)
 *
 * Reads PILLAR_CONFIG + LEVERS_V5 from v5-levers.js; values from AITunerV5.leverValues.
 * Tier 1: CHARACTER + VOICE radars live + emphasis on TIER1_LEVER axes; THINKING + OUTPUT grayed/locked.
 * Tier ≥2: all four pillars active and draggable (slider ↔ radar stay in sync).
 */

(function () {
    'use strict';

    const CHART_JS_URL = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    const PILLAR_ORDER = ['CHARACTER', 'VOICE', 'THINKING', 'OUTPUT'];

    /** Monochrome pillar radars — same stroke/fill for all pillars; locked tiers use subdued grey */
    const RADAR_ACTIVE_STROKE = 'rgba(243, 244, 246, 0.95)';
    const RADAR_ACTIVE_FILL = 'rgba(255, 255, 255, 0.09)';
    const RADAR_LOCKED_STROKE = 'rgba(110, 110, 115, 0.55)';
    const RADAR_LOCKED_FILL = 'rgba(120, 120, 125, 0.08)';

    let chartJsPromise = null;
    let mountState = null;

    function loadChartJs() {
        if (typeof Chart !== 'undefined') {
            return Promise.resolve();
        }
        if (chartJsPromise) {
            return chartJsPromise;
        }
        const existing = document.querySelector('script[data-aituner-chartjs="1"]');
        if (existing) {
            chartJsPromise = new Promise((resolve, reject) => {
                const done = () => {
                    if (typeof Chart !== 'undefined') {
                        resolve();
                    } else {
                        reject(new Error('Chart.js missing after load'));
                    }
                };
                if (typeof Chart !== 'undefined') {
                    resolve();
                    return;
                }
                existing.addEventListener('load', done);
                existing.addEventListener('error', () => reject(new Error('Chart.js load error')));
            });
            return chartJsPromise;
        }
        chartJsPromise = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = CHART_JS_URL;
            s.async = true;
            s.dataset.aitunerChartjs = '1';
            s.onload = () => {
                if (typeof Chart !== 'undefined') {
                    resolve();
                } else {
                    reject(new Error('Chart.js global not defined'));
                }
            };
            s.onerror = () => reject(new Error('Chart.js failed to load'));
            document.head.appendChild(s);
        });
        return chartJsPromise;
    }

    function getPillarConfig() {
        return typeof window !== 'undefined' ? window.PILLAR_CONFIG : null;
    }

    function getLeversV5() {
        return typeof window !== 'undefined' ? window.LEVERS_V5 : null;
    }

    function getTier1Levers() {
        return Array.isArray(window.TIER1_LEVERS) ? window.TIER1_LEVERS : [];
    }

    function resolveTier(engine, optionsTier) {
        if (optionsTier !== undefined && optionsTier !== null) {
            return Number(optionsTier);
        }
        if (engine && engine.user && typeof engine.user.tier === 'number') {
            return engine.user.tier;
        }
        return 2;
    }

    function leverValue(engine, key) {
        const raw = engine.leverValues[key];
        const n = Number(raw);
        if (!Number.isFinite(n)) {
            return 5;
        }
        return Math.max(0, Math.min(10, n));
    }

    function pillarLocked(pillarKey, tier) {
        if (tier !== 1) {
            return false;
        }
        return pillarKey === 'THINKING' || pillarKey === 'OUTPUT';
    }

    function pillarDragEnabled(pillarKey, tier) {
        if (tier < 2) {
            return false;
        }
        return true;
    }

    function isDarkMode() {
        if (!document.body) {
            return true;
        }
        return !document.body.classList.contains('aituner-light');
    }

    function syncSliderFromRadar(leverKey, value) {
        const input = document.querySelector(`input.lever-slider[data-lever="${leverKey}"]`);
        if (input) {
            input.value = String(value);
        }
        const wrapper = document.querySelector(`.lever-slider-wrapper[data-lever="${leverKey}"]`);
        if (wrapper) {
            const span = wrapper.querySelector('.lever-value');
            if (span) {
                span.textContent = String(value);
            }
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

    function attachRadarInteractions(canvas, chart, leverKeys, engine) {
        if (!canvas || !chart || !Array.isArray(leverKeys) || !engine) {
            return;
        }

        cleanupRadarInteractions(canvas);

        const scale = chart.scales && chart.scales.r;
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
            if (!state.active) {
                return;
            }

            let value = computeValueFromEvent(event);
            if (!Number.isFinite(value)) {
                value = state.lastValue ?? scale.min;
            }
            const rounded = Math.round(value);
            const dataset = chart.data.datasets[state.datasetIndex];
            if (dataset && dataset.data && dataset.data[state.index] !== undefined) {
                dataset.data[state.index] = rounded;
            }

            const key = leverKeys[state.index];
            if (key && typeof engine.adjustLever === 'function') {
                engine.adjustLever(key, rounded);
            }
            syncSliderFromRadar(key, rounded);

            clearTooltip();
            chart.update();

            if (event && typeof event.preventDefault === 'function') {
                event.preventDefault();
            }

            if (state.pointerId !== null && typeof canvas.releasePointerCapture === 'function') {
                try {
                    canvas.releasePointerCapture(state.pointerId);
                } catch (err) {
                    /* ignore */
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
                if (!chart) {
                    return;
                }
                const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
                if (!elements.length) {
                    return;
                }
                const element = elements[0];
                if (element.datasetIndex !== 0) {
                    return;
                }

                state.active = true;
                state.datasetIndex = element.datasetIndex;
                state.index = element.index;
                state.pointerId = event.pointerId;

                if (typeof canvas.setPointerCapture === 'function') {
                    try {
                        canvas.setPointerCapture(event.pointerId);
                    } catch (err) {
                        /* ignore */
                    }
                }

                canvas.classList.add('radar-dragging');
                canvas.style.cursor = 'grabbing';

                const value = computeValueFromEvent(event);
                const ds = chart.data.datasets[element.datasetIndex];
                if (ds && ds.data && ds.data[element.index] !== undefined) {
                    ds.data[element.index] = value;
                }

                const key = leverKeys[element.index];
                if (key) {
                    const rounded = Math.round(value);
                    if (typeof engine.adjustLever === 'function') {
                        engine.adjustLever(key, rounded);
                    }
                    syncSliderFromRadar(key, rounded);
                }

                state.lastValue = value;
                setTooltip(event);
                chart.update('none');
                event.preventDefault();
            },
            pointermove: (event) => {
                if (!state.active) {
                    return;
                }

                const value = computeValueFromEvent(event);
                const dataset = chart.data.datasets[state.datasetIndex];
                if (dataset && dataset.data && dataset.data[state.index] !== undefined) {
                    dataset.data[state.index] = value;
                }

                const key = leverKeys[state.index];
                if (key) {
                    const rounded = Math.round(value);
                    if (typeof engine.adjustLever === 'function') {
                        engine.adjustLever(key, rounded);
                    }
                    syncSliderFromRadar(key, rounded);
                }

                state.lastValue = value;
                setTooltip(event);
                chart.update('none');
                event.preventDefault();
            },
            pointerup: (event) => {
                if (!state.active) {
                    return;
                }
                finalizeDrag(event);
                event.preventDefault();
            },
            pointerleave: (event) => {
                if (!state.active) {
                    return;
                }
                finalizeDrag(event);
            },
            pointercancel: (event) => {
                if (!state.active) {
                    return;
                }
                finalizeDrag(event);
            }
        };

        Object.entries(handlers).forEach(([eventName, handler]) => {
            canvas.addEventListener(eventName, handler);
        });

        canvas._radarHandlers = handlers;
        canvas.style.cursor = 'grab';
    }

    function pillarKeyForLever(leverKey, pc) {
        if (!pc || !leverKey) {
            return null;
        }
        for (let i = 0; i < PILLAR_ORDER.length; i++) {
            const pk = PILLAR_ORDER[i];
            if (pc[pk] && pc[pk].leverKeys && pc[pk].leverKeys.indexOf(leverKey) !== -1) {
                return pk;
            }
        }
        return null;
    }

    function buildChartOptions({ textColor, gridColor, leverKeys, pillarKey, tier, highlightIndex, pointLabelSize }) {
        const tier1 = getTier1Levers();
        const muted = isDarkMode() ? 'rgba(180,180,185,0.5)' : 'rgba(85,85,92,0.45)';
        const plSize = pointLabelSize != null ? pointLabelSize : 11;

        return {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    min: 0,
                    ticks: {
                        stepSize: 2,
                        color: textColor,
                        backdropColor: isDarkMode() ? '#1a1a1a' : '#f0f0f0',
                        font: { size: 10 }
                    },
                    grid: {
                        color: gridColor,
                        lineWidth: 1
                    },
                    pointLabels: {
                        font: { size: plSize, weight: '500' },
                        padding: 8,
                        color: (ctx) => {
                            if (highlightIndex !== null && highlightIndex !== undefined && highlightIndex >= 0) {
                                return ctx.index === highlightIndex ? textColor : muted;
                            }
                            if (tier === 1 && (pillarKey === 'CHARACTER' || pillarKey === 'VOICE')) {
                                const key = leverKeys[ctx.index];
                                return tier1.includes(key) ? textColor : muted;
                            }
                            return textColor;
                        }
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const key = leverKeys[ctx.dataIndex];
                            const meta = getLeversV5() && getLeversV5()[key];
                            const name = meta && meta.name ? meta.name : key;
                            const val = Math.round(Number(ctx.raw) || 0);
                            return `${name}: ${val}/10`;
                        }
                    }
                }
            }
        };
    }

    function updateChartsForState(st) {
        if (!st) {
            return;
        }
        const { engine, chartsByPillar } = st;
        const pc = getPillarConfig();
        if (!pc) {
            return;
        }

        Object.keys(chartsByPillar).forEach((pillarKey) => {
            const chart = chartsByPillar[pillarKey];
            const cfg = pc[pillarKey];
            if (!chart || !cfg) {
                return;
            }
            const data = cfg.leverKeys.map((k) => leverValue(engine, k));
            const ds = chart.data.datasets[0];
            if (ds) {
                ds.data = data;
            }
            chart.update('none');
        });
    }

    function updateChartsFromEngine() {
        updateChartsForState(mountState);
    }

    function chainCallback(engine, prop, fn) {
        const prev = engine[prop];
        engine[prop] = function wrapped() {
            if (typeof prev === 'function') {
                prev.apply(engine, arguments);
            }
            fn.apply(null, arguments);
        };
        return prev;
    }

    /** @type {object[]} */
    const embeddedRadarMounts = [];

    function destroyMountState(st) {
        if (!st) {
            return;
        }
        const { chartsByPillar, engine, prevOnLeverChange, onResize } = st;

        if (engine) {
            engine.onLeverChange = prevOnLeverChange;
        }

        if (onResize) {
            window.removeEventListener('resize', onResize);
        }

        Object.keys(chartsByPillar).forEach((pk) => {
            const chart = chartsByPillar[pk];
            const canvas = chart && chart.canvas;
            if (canvas) {
                cleanupRadarInteractions(canvas);
            }
            if (chart) {
                try {
                    chart.destroy();
                } catch (e) {
                    console.warn('AITunerV5 radar: destroy', e);
                }
            }
        });
    }

    function destroyEmbeddedMounts() {
        while (embeddedRadarMounts.length) {
            const st = embeddedRadarMounts.pop();
            destroyMountState(st);
        }
    }

    function destroyMount() {
        if (!mountState) {
            return;
        }
        destroyMountState(mountState);
        mountState = null;
    }

    function destroyPrimaryAndEmbedded() {
        destroyMount();
        destroyEmbeddedMounts();
    }

    /**
     * Mount four pillar radars into #containerId (or HTMLElement).
     * @param {AITunerV5} engine
     * @param {string|HTMLElement} containerIdOrEl
     * @param {{ tier?: number, highlightLeverKey?: string, interactive?: boolean, embedded?: boolean, maxCanvasHeightPx?: number, layout?: 'grid' | 'stack' }} [options] — layout: 'stack' = one pillar per row (full width); default 2×2 grid for 4 pillars
     * @returns {Promise<{ destroy: function, refresh: function }>}
     */
    function mountAITunerV5Radars(engine, containerIdOrEl, options) {
        if (!engine) {
            return Promise.reject(new Error('mountAITunerV5Radars: engine required'));
        }

        const container =
            typeof containerIdOrEl === 'string'
                ? document.getElementById(containerIdOrEl)
                : containerIdOrEl;

        if (!container) {
            return Promise.reject(new Error('mountAITunerV5Radars: container not found'));
        }

        const pc = getPillarConfig();
        const levers = getLeversV5();
        if (!pc || !levers) {
            return Promise.reject(new Error('mountAITunerV5Radars: PILLAR_CONFIG / LEVERS_V5 missing'));
        }

        const embedded = options && options.embedded === true;
        if (embedded) {
            /* keep other embedded + primary until a non-embedded mount runs */
        } else {
            destroyPrimaryAndEmbedded();
        }

        const idSuffix =
            embedded && typeof Math !== 'undefined' && Math.random
                ? '-' + Math.random().toString(36).slice(2, 10)
                : '';

        return loadChartJs()
            .then(() => {
                if (typeof Chart === 'undefined') {
                    throw new Error('Chart.js unavailable');
                }
            })
            .then(() => {
            container.innerHTML = '';

            const grid = document.createElement('div');
            const layoutStack = options && options.layout === 'stack';
            grid.className = 'aituner-v5-radar-grid' + (layoutStack ? ' aituner-v5-radar-grid--stack' : '');
            grid.style.display = 'grid';
            grid.style.alignItems = 'stretch';
            grid.style.gap = embedded ? '8px' : layoutStack ? '20px' : '16px';

            const tier = resolveTier(engine, options && options.tier);
            const interactive =
                options && Object.prototype.hasOwnProperty.call(options, 'interactive')
                    ? options.interactive !== false
                    : true;
            const textColor = isDarkMode() ? '#f3f4f6' : '#1f2937';
            const gridColor = isDarkMode() ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.18)';
            const highlightLeverKey = options && options.highlightLeverKey;
            const highlightPillar = highlightLeverKey ? pillarKeyForLever(highlightLeverKey, pc) : null;
            const pillarsToShow = highlightPillar ? [highlightPillar] : PILLAR_ORDER;
            if (pillarsToShow.length === 1) {
                grid.style.gridTemplateColumns = '1fr';
                grid.style.maxWidth = layoutStack ? '100%' : '320px';
                grid.style.margin = layoutStack ? '0' : '0 auto';
            } else if (layoutStack) {
                grid.style.gridTemplateColumns = '1fr';
                grid.style.maxWidth = '100%';
                grid.style.margin = '0';
            } else {
                grid.style.gridTemplateColumns = 'repeat(2, minmax(140px, 1fr))';
            }

            const chartsByPillar = {};

            pillarsToShow.forEach((pillarKey) => {
                const cfg = pc[pillarKey];
                const locked = pillarLocked(pillarKey, tier);
                const card = document.createElement('div');
                card.className = 'aituner-v5-radar-card';
                card.style.border = `2px solid ${isDarkMode() ? '#ffffff' : '#000000'}`;
                card.style.borderRadius = '4px';
                card.style.padding = '12px';
                card.style.background = isDarkMode() ? '#1a1a1a' : '#eaeaea';

                const title = document.createElement('div');
                title.textContent = cfg.label || pillarKey;
                title.style.fontSize = layoutStack && !embedded ? '14px' : '13px';
                title.style.fontWeight = '600';
                title.style.marginBottom = layoutStack && !embedded ? '10px' : '8px';
                title.style.color = locked ? (isDarkMode() ? '#9ca3af' : '#6b7280') : textColor;
                if (locked) {
                    title.textContent += ' (locked)';
                }

                const canvas = document.createElement('canvas');
                canvas.id = `aituner-v5-radar-${pillarKey}${idSuffix}`;
                canvas.setAttribute('aria-label', `${cfg.label} radar`);
                canvas.style.width = '100%';
                const defaultMaxH = layoutStack && !embedded ? 300 : 220;
                const maxH = options && options.maxCanvasHeightPx != null ? options.maxCanvasHeightPx : defaultMaxH;
                canvas.style.maxHeight = typeof maxH === 'number' ? `${maxH}px` : String(maxH);

                card.appendChild(title);
                card.appendChild(canvas);
                grid.appendChild(card);

                const leverKeys = cfg.leverKeys;
                const labels = leverKeys.map((k) => (levers[k] && levers[k].name) || k);
                const data = leverKeys.map((k) => leverValue(engine, k));

                let borderColor = locked ? RADAR_LOCKED_STROKE : RADAR_ACTIVE_STROKE;
                let fillColor = locked ? RADAR_LOCKED_FILL : RADAR_ACTIVE_FILL;
                let pointBg = borderColor;

                const highlightIndex =
                    highlightLeverKey && leverKeys.indexOf(highlightLeverKey) >= 0
                        ? leverKeys.indexOf(highlightLeverKey)
                        : null;
                const dimPoint =
                    highlightIndex !== null
                        ? isDarkMode()
                            ? 'rgba(120,120,130,0.25)'
                            : 'rgba(180,180,190,0.35)'
                        : null;
                const pointBackgroundColor =
                    dimPoint !== null
                        ? leverKeys.map((_, i) => (i === highlightIndex ? pointBg : dimPoint))
                        : leverKeys.map(() => pointBg);

                const chart = new Chart(canvas, {
                    type: 'radar',
                    data: {
                        labels,
                        datasets: [
                            {
                                label: cfg.label || pillarKey,
                                data,
                                backgroundColor: fillColor,
                                borderColor,
                                borderWidth: 2,
                                pointBackgroundColor,
                                pointBorderColor: borderColor,
                                pointHoverBackgroundColor: pointBg,
                                pointRadius: 4,
                                pointHoverRadius: 6
                            }
                        ]
                    },
                    options: buildChartOptions({
                        textColor,
                        gridColor,
                        leverKeys,
                        pillarKey,
                        tier,
                        highlightIndex: highlightIndex !== null ? highlightIndex : undefined,
                        pointLabelSize: layoutStack && !embedded ? 12 : undefined
                    })
                });

                chartsByPillar[pillarKey] = chart;

                if (interactive && pillarDragEnabled(pillarKey, tier) && highlightIndex === null) {
                    attachRadarInteractions(canvas, chart, leverKeys, engine);
                } else {
                    cleanupRadarInteractions(canvas);
                    canvas.style.cursor = 'default';
                }
            });

            container.appendChild(grid);

            const prevOnLeverChange = chainCallback(engine, 'onLeverChange', () => {
                updateChartsFromEngine();
            });

            let resizeTimeout;
            const onResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    Object.keys(chartsByPillar).forEach((pk) => {
                        const c = chartsByPillar[pk];
                        if (c && typeof c.resize === 'function') {
                            try {
                                c.resize();
                            } catch (e) {
                                /* ignore */
                            }
                        }
                    });
                }, 200);
            };
            window.addEventListener('resize', onResize);

            const localState = {
                engine,
                chartsByPillar,
                container,
                tier,
                prevOnLeverChange,
                onResize
            };

            if (embedded) {
                embeddedRadarMounts.push(localState);
            } else {
                mountState = localState;
            }

            updateChartsForState(localState);

            const refreshLocal = () => updateChartsForState(localState);

            if (embedded) {
                return {
                    destroy: () => {
                        const i = embeddedRadarMounts.indexOf(localState);
                        if (i >= 0) {
                            embeddedRadarMounts.splice(i, 1);
                        }
                        destroyMountState(localState);
                    },
                    refresh: refreshLocal,
                    getChartsByPillar: () => localState.chartsByPillar || {}
                };
            }

            return {
                destroy: destroyMount,
                refresh: updateChartsFromEngine,
                getChartsByPillar: () => (mountState ? mountState.chartsByPillar : {})
            };
        })
            .catch((err) => {
                console.warn('AITunerV5 radar: charts unavailable', err);
                container.innerHTML =
                    '<p class="aituner-chart-fallback" role="status">Behavior charts could not load (check your connection or blockers). Sliders, prompts, and the decoder still work.</p>';
                return {
                    destroy: () => {
                        container.innerHTML = '';
                    },
                    refresh: () => {},
                    getChartsByPillar: () => ({})
                };
            });
    }

    /* Global API */
    if (typeof window !== 'undefined') {
        window.mountAITunerV5Radars = mountAITunerV5Radars;

        /**
         * @deprecated v3.5 / v6 hook — refreshes v5 mount if present
         */
        window.drawRadarV6 = function () {
            if (mountState && typeof updateChartsFromEngine === 'function') {
                updateChartsFromEngine();
            }
        };
    }

    let legacyResizeTimeout;
    function legacyHandleResize() {
        clearTimeout(legacyResizeTimeout);
        legacyResizeTimeout = setTimeout(() => {
            if (typeof window.drawRadarV6 === 'function') {
                window.drawRadarV6();
            }
        }, 200);
    }
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', legacyHandleResize);
    }
})();
