/**
 * AITuner v5.0 — pillar radars (Chart.js)
 *
 * Reads PILLAR_CONFIG + LEVERS_V5 from v5-levers.js; values from AITunerV5.leverValues.
 * Two combined radars: Character+Voice and Thinking+Output (8 axes each).
 * Tier 1: Character+Voice live + emphasis on TIER1_LEVER axes; Thinking+Output grayed/locked.
 * Tier ≥2: both radars active and draggable (slider ↔ radar stay in sync).
 */

(function () {
    'use strict';

    const CHART_JS_URL = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';

    /** Combined radar groups shown on all pages (replaces four single-pillar charts). */
    const RADAR_GROUPS = [
        {
            id: 'CHARACTER_VOICE',
            label: 'Character + Voice',
            pillarKeys: ['CHARACTER', 'VOICE']
        },
        {
            id: 'THINKING_OUTPUT',
            label: 'Thinking + Output',
            pillarKeys: ['THINKING', 'OUTPUT']
        }
    ];

    /** Monochrome pillar radars — same stroke/fill for all groups; locked tiers use subdued grey */
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

    function groupLocked(group, tier) {
        if (!group || !group.pillarKeys) {
            return false;
        }
        return group.pillarKeys.every((pk) => pillarLocked(pk, tier));
    }

    function pillarDragEnabled(pillarKey, tier) {
        if (tier < 2) {
            return false;
        }
        return true;
    }

    function groupDragEnabled(group, tier) {
        if (tier < 2 || !group || !group.pillarKeys) {
            return false;
        }
        return group.pillarKeys.every((pk) => pillarDragEnabled(pk, tier));
    }

    function leverKeysForGroup(group, pc) {
        if (!group || !pc) {
            return [];
        }
        const keys = [];
        group.pillarKeys.forEach((pk) => {
            const cfg = pc[pk];
            if (cfg && Array.isArray(cfg.leverKeys)) {
                cfg.leverKeys.forEach((k) => keys.push(k));
            }
        });
        return keys;
    }

    function radarGroupForLever(leverKey, pc) {
        if (!leverKey || !pc) {
            return null;
        }
        for (let i = 0; i < RADAR_GROUPS.length; i++) {
            const group = RADAR_GROUPS[i];
            const keys = leverKeysForGroup(group, pc);
            if (keys.indexOf(leverKey) !== -1) {
                return group;
            }
        }
        return null;
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

    function radarScaleReady(chart) {
        const scale = chart && chart.scales && chart.scales.r;
        return !!(scale && Number.isFinite(scale.drawingArea) && scale.drawingArea > 0);
    }

    function findRadarElementAtEvent(chart, canvas, event, leverCount) {
        const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: false }, true);
        if (elements.length && elements[0].datasetIndex === 0) {
            return elements[0];
        }
        const scale = chart.scales && chart.scales.r;
        if (!scale || !leverCount) {
            return null;
        }
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const dx = x - scale.xCenter;
        const dy = y - scale.yCenter;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > scale.drawingArea + 16 || distance < 2) {
            return null;
        }
        let angle = Math.atan2(dy, dx);
        const startAngleDeg =
            (chart.options &&
                chart.options.scales &&
                chart.options.scales.r &&
                Number(chart.options.scales.r.startAngle)) ||
            0;
        /* Chart.js: 0° = top; positive startAngle rotates clockwise. */
        const start = -Math.PI / 2 + (startAngleDeg * Math.PI) / 180;
        let a = angle - start;
        while (a < 0) {
            a += Math.PI * 2;
        }
        while (a >= Math.PI * 2) {
            a -= Math.PI * 2;
        }
        const step = (Math.PI * 2) / leverCount;
        const index = Math.round(a / step) % leverCount;
        return { datasetIndex: 0, index };
    }

    /**
     * Half-sector rotation so the polygon sits flat-top / flat-bottom
     * (vertex-up → edge-up). For 8 axes: 22.5°.
     */
    function flatTopStartAngleDeg(leverCount) {
        const n = Number(leverCount);
        if (!Number.isFinite(n) || n < 3) {
            return 22.5;
        }
        return 180 / n;
    }

    function ensureFlatTopTicksPlugin() {
        if (typeof Chart === 'undefined' || Chart._aitunerFlatTopTicksPlugin) {
            return;
        }
        Chart.register({
            id: 'aitunerFlatTopRadarTicks',
            afterDatasetsDraw(chart) {
                const cfg =
                    chart.options &&
                    chart.options.plugins &&
                    chart.options.plugins.aitunerFlatTopRadarTicks;
                if (!cfg || cfg.display === false) {
                    return;
                }
                const scale = chart.scales && chart.scales.r;
                if (!scale || !Array.isArray(scale.ticks)) {
                    return;
                }
                const ctx = chart.ctx;
                const color = cfg.color || '#f3f4f6';
                const backdrop = cfg.backdropColor;
                const fontSize = cfg.fontSize != null ? cfg.fontSize : 9;
                const axisCount =
                    (chart.data && chart.data.labels && chart.data.labels.length) || 8;

                ctx.save();
                ctx.font = `${fontSize}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = color;

                const yForTickValue = (value) => {
                    /* Prefer Chart.js geometry so labels sit on the flat grid edge. */
                    if (typeof scale.getPointPositionForValue === 'function' && axisCount >= 2) {
                        const a = scale.getPointPositionForValue(0, value);
                        const b = scale.getPointPositionForValue(axisCount - 1, value);
                        if (a && b && Number.isFinite(a.y) && Number.isFinite(b.y)) {
                            return (a.y + b.y) / 2;
                        }
                    }
                    const vertexDist = scale.getDistanceFromCenterForValue(value);
                    if (!Number.isFinite(vertexDist) || vertexDist <= 0) {
                        return null;
                    }
                    return scale.yCenter - vertexDist * Math.cos(Math.PI / Math.max(3, axisCount));
                };

                const maxValue = scale.max;

                scale.ticks.forEach((tick) => {
                    const value = tick && tick.value;
                    if (!Number.isFinite(value) || value <= 0) {
                        return;
                    }
                    /* Skip outermost "10" — it collides with the flat edge / axis labels. */
                    if (value >= maxValue) {
                        return;
                    }
                    const y = yForTickValue(value);
                    if (!Number.isFinite(y)) {
                        return;
                    }
                    const x = scale.xCenter;
                    const label = String(Math.round(value));
                    if (backdrop) {
                        const metrics = ctx.measureText(label);
                        const padX = 3;
                        const padY = 2;
                        const w = metrics.width + padX * 2;
                        const h = fontSize + padY * 2;
                        ctx.fillStyle = backdrop;
                        ctx.fillRect(x - w / 2, y - h / 2, w, h);
                        ctx.fillStyle = color;
                    }
                    ctx.fillText(label, x, y);
                });
                ctx.restore();
            }
        });
        Chart._aitunerFlatTopTicksPlugin = true;
    }

    function applyRadarChartPadding(chart, hidePointLabels) {
        if (!chart || !chart.options) {
            return;
        }
        const top = hidePointLabels === true ? 18 : 26;
        chart.options.layout = {
            autoPadding: hidePointLabels !== true,
            padding: { top: top, bottom: 12, left: 12, right: 12 }
        };
        try {
            if (typeof chart.resize === 'function') {
                chart.resize();
            }
            chart.update('none');
        } catch (e) {
            /* ignore */
        }
    }

    function tryAttachRadarInteractions(canvas, chart, leverKeys, engine) {
        if (!canvas || !chart || !Array.isArray(leverKeys) || !engine) {
            return false;
        }
        if (!radarScaleReady(chart)) {
            return false;
        }
        attachRadarInteractions(canvas, chart, leverKeys, engine);
        return !!(canvas._radarHandlers);
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
            if (chart._radarSuppressTooltip) {
                return;
            }
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
                const element = findRadarElementAtEvent(chart, canvas, event, leverKeys.length);
                if (!element) {
                    return;
                }
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

    function buildChartOptions({ textColor, gridColor, leverKeys, groupId, tier, highlightIndex, pointLabelSize, suppressTooltip, hidePointLabels }) {
        const tier1 = getTier1Levers();
        const muted = isDarkMode() ? 'rgba(180,180,185,0.5)' : 'rgba(85,85,92,0.45)';
        const plSize = pointLabelSize != null ? pointLabelSize : 10;
        const backdrop = isDarkMode() ? '#1a1a1a' : '#f0f0f0';
        const n = Array.isArray(leverKeys) ? leverKeys.length : 8;

        return {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            animation: false,
            /* Room above the outer flat edge so "10" isn't clipped. */
            layout: {
                autoPadding: hidePointLabels !== true,
                padding:
                    hidePointLabels === true
                        ? { top: 22, bottom: 10, left: 10, right: 10 }
                        : { top: 14, bottom: 8, left: 8, right: 8 }
            },
            transitions: {
                active: { animation: { duration: 0 } },
                resize: { animation: { duration: 0 } }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    min: 0,
                    /* Half-sector offset → flat edge on top/bottom (8 axes → 22.5°). */
                    startAngle: flatTopStartAngleDeg(n),
                    ticks: {
                        stepSize: 2,
                        /* Built-in tick labels follow the first spoke; we draw them vertically via plugin. */
                        display: false,
                        color: textColor,
                        backdropColor: backdrop,
                        font: { size: 9 }
                    },
                    grid: {
                        color: gridColor,
                        lineWidth: 1
                    },
                    pointLabels: {
                        display: hidePointLabels !== true,
                        font: { size: plSize, weight: '500' },
                        padding: 6,
                        color: (ctx) => {
                            if (highlightIndex !== null && highlightIndex !== undefined && highlightIndex >= 0) {
                                return ctx.index === highlightIndex ? textColor : muted;
                            }
                            if (tier === 1 && groupId === 'CHARACTER_VOICE') {
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
                    enabled: suppressTooltip !== true,
                    callbacks: {
                        label: (ctx) => {
                            const key = leverKeys[ctx.dataIndex];
                            const meta = getLeversV5() && getLeversV5()[key];
                            const name = meta && meta.name ? meta.name : key;
                            const val = Math.round(Number(ctx.raw) || 0);
                            return `${name}: ${val}/10`;
                        }
                    }
                },
                aitunerFlatTopRadarTicks: {
                    display: true,
                    color: textColor,
                    backdropColor: backdrop,
                    fontSize: 9
                }
            }
        };
    }

    function syncChartDataset(chart, leverKeys, engine) {
        const ds = chart.data.datasets[0];
        if (!ds) {
            return;
        }
        const values = leverKeys.map((k) => leverValue(engine, k));
        if (!Array.isArray(ds.data) || ds.data.length !== values.length) {
            ds.data = values.slice();
            return;
        }
        for (let i = 0; i < values.length; i++) {
            ds.data[i] = values[i];
        }
    }

    function relayoutChart(chart) {
        if (!chart) {
            return;
        }
        try {
            if (typeof chart.resize === 'function') {
                chart.resize();
            }
        } catch (e) {
            /* ignore */
        }
        // Radar point positions go stale with update('none') after bulk data changes.
        chart.update();
    }

    function updateChartsForState(st) {
        if (!st) {
            return;
        }

        if (Array.isArray(st.chartEntries) && st.chartEntries.length) {
            st.chartEntries.forEach((entry) => {
                if (!entry || !entry.chart || !entry.engine || !entry.leverKeys) {
                    return;
                }
                syncChartDataset(entry.chart, entry.leverKeys, entry.engine);
                relayoutChart(entry.chart);
            });
            return;
        }

        const { engine, chartsByPillar } = st;

        Object.keys(chartsByPillar || {}).forEach((groupId) => {
            const chart = chartsByPillar[groupId];
            if (!chart) {
                return;
            }
            const leverKeys =
                (chart.canvas && chart.canvas._radarLeverKeys) ||
                (st.leverKeysByGroup && st.leverKeysByGroup[groupId]);
            if (!leverKeys || !leverKeys.length) {
                return;
            }
            syncChartDataset(chart, leverKeys, engine);
            relayoutChart(chart);
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
        const { chartsByPillar, engine, prevOnLeverChange, onResize, chartEntries } = st;

        if (engine && prevOnLeverChange !== undefined) {
            engine.onLeverChange = prevOnLeverChange;
        }

        if (onResize) {
            window.removeEventListener('resize', onResize);
        }

        const charts = [];
        if (Array.isArray(chartEntries)) {
            chartEntries.forEach((entry) => {
                if (entry && entry.chart) {
                    charts.push(entry.chart);
                }
            });
        }
        Object.keys(chartsByPillar || {}).forEach((pk) => {
            const chart = chartsByPillar[pk];
            if (chart) {
                charts.push(chart);
            }
        });

        const seen = new Set();
        charts.forEach((chart) => {
            if (!chart || seen.has(chart)) {
                return;
            }
            seen.add(chart);
            const canvas = chart.canvas;
            if (canvas) {
                cleanupRadarInteractions(canvas);
            }
            try {
                chart.destroy();
            } catch (e) {
                console.warn('AITunerV5 radar: destroy', e);
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
     * Mount combined pillar radars into #containerId (or HTMLElement).
     * Two charts: Character+Voice and Thinking+Output (8 axes each).
     * @param {AITunerV5} engine
     * @param {string|HTMLElement} containerIdOrEl
     * @param {{ tier?: number, highlightLeverKey?: string, interactive?: boolean, embedded?: boolean, maxCanvasHeightPx?: number, layout?: 'grid' | 'stack' | 'room' }} [options] — layout: 'stack' = one radar per row; default side-by-side for 2 combined radars
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
                ensureFlatTopTicksPlugin();
            })
            .then(() => {
            container.innerHTML = '';

            const grid = document.createElement('div');
            const layoutStack = options && options.layout === 'stack';
            const layoutRoom = options && options.layout === 'room';
            grid.className =
                'aituner-v5-radar-grid' +
                (layoutStack ? ' aituner-v5-radar-grid--stack' : '') +
                (layoutRoom ? ' aituner-v5-radar-grid--room' : '');
            grid.style.display = 'grid';
            grid.style.alignItems = 'stretch';
            grid.style.gap = embedded ? '8px' : layoutStack || layoutRoom ? '20px' : '16px';

            const tier = resolveTier(engine, options && options.tier);
            const interactive =
                options && Object.prototype.hasOwnProperty.call(options, 'interactive')
                    ? options.interactive !== false
                    : true;
            const textColor = isDarkMode() ? '#f3f4f6' : '#1f2937';
            const gridColor = isDarkMode() ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.18)';
            const highlightLeverKey = options && options.highlightLeverKey;
            const highlightGroup = highlightLeverKey ? radarGroupForLever(highlightLeverKey, pc) : null;
            const groupsToShow = highlightGroup ? [highlightGroup] : RADAR_GROUPS.slice();
            if (groupsToShow.length === 1) {
                grid.style.gridTemplateColumns = '1fr';
                grid.style.maxWidth = layoutStack ? '100%' : '420px';
                grid.style.margin = layoutStack ? '0' : '0 auto';
            } else if (layoutRoom) {
                grid.style.gridTemplateColumns = 'repeat(2, minmax(280px, 1fr))';
                grid.style.maxWidth = '100%';
                grid.style.margin = '0';
            } else if (layoutStack) {
                grid.style.gridTemplateColumns = '1fr';
                grid.style.maxWidth = '100%';
                grid.style.margin = '0';
            } else {
                grid.style.gridTemplateColumns = 'repeat(2, minmax(160px, 1fr))';
            }

            const chartsByPillar = {};
            const leverKeysByGroup = {};

            groupsToShow.forEach((group) => {
                const groupId = group.id;
                const leverKeys = leverKeysForGroup(group, pc);
                const locked = groupLocked(group, tier);
                const card = document.createElement('div');
                card.className = 'aituner-v5-radar-card';
                card.style.border = `2px solid ${isDarkMode() ? '#ffffff' : '#000000'}`;
                card.style.borderRadius = '4px';
                card.style.padding = '12px';
                card.style.background = isDarkMode() ? '#1a1a1a' : '#eaeaea';

                const title = document.createElement('div');
                title.textContent = group.label || groupId;
                title.style.fontSize = (layoutStack || layoutRoom) && !embedded ? '14px' : '13px';
                title.style.fontWeight = '600';
                title.style.marginBottom = (layoutStack || layoutRoom) && !embedded ? '10px' : '8px';
                title.style.color = locked ? (isDarkMode() ? '#9ca3af' : '#6b7280') : textColor;
                if (locked) {
                    title.textContent += ' (locked)';
                }

                const canvas = document.createElement('canvas');
                canvas.id = `aituner-v5-radar-${groupId}${idSuffix}`;
                canvas.setAttribute('aria-label', `${group.label} radar`);
                canvas.style.width = '100%';
                const defaultMaxH =
                    layoutStack && !embedded ? 340 : layoutRoom && !embedded ? 400 : 240;
                const maxH = options && options.maxCanvasHeightPx != null ? options.maxCanvasHeightPx : defaultMaxH;
                canvas.style.maxHeight = typeof maxH === 'number' ? `${maxH}px` : String(maxH);

                card.appendChild(title);
                card.appendChild(canvas);
                grid.appendChild(card);

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

                const dragEnabled =
                    interactive && groupDragEnabled(group, tier) && highlightIndex === null;

                const chart = new Chart(canvas, {
                    type: 'radar',
                    data: {
                        labels,
                        datasets: [
                            {
                                label: group.label || groupId,
                                data,
                                backgroundColor: fillColor,
                                borderColor,
                                borderWidth: 2,
                                pointBackgroundColor,
                                pointBorderColor: borderColor,
                                pointHoverBackgroundColor: pointBg,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                                pointHitRadius: 16
                            }
                        ]
                    },
                    options: buildChartOptions({
                        textColor,
                        gridColor,
                        leverKeys,
                        groupId,
                        tier,
                        highlightIndex: highlightIndex !== null ? highlightIndex : undefined,
                        pointLabelSize: (layoutStack || layoutRoom) && !embedded ? 11 : undefined,
                        suppressTooltip: dragEnabled
                    })
                });
                chart._radarSuppressTooltip = dragEnabled;
                applyRadarChartPadding(chart, false);

                chartsByPillar[groupId] = chart;
                leverKeysByGroup[groupId] = leverKeys;

                canvas._radarDragEnabled = dragEnabled;
                canvas._radarLeverKeys = leverKeys;

                const scheduleAttach = () => {
                    if (!dragEnabled) {
                        cleanupRadarInteractions(canvas);
                        canvas.style.cursor = 'default';
                        return;
                    }
                    if (!tryAttachRadarInteractions(canvas, chart, leverKeys, engine)) {
                        requestAnimationFrame(scheduleAttach);
                    }
                };
                scheduleAttach();
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
                leverKeysByGroup,
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

            requestAnimationFrame(() => {
                Object.keys(localState.chartsByPillar).forEach((pk) => {
                    const c = localState.chartsByPillar[pk];
                    relayoutChart(c);
                    const canvas = c && c.canvas;
                    if (canvas && canvas._radarDragEnabled && canvas._radarLeverKeys) {
                        tryAttachRadarInteractions(canvas, c, canvas._radarLeverKeys, engine);
                    }
                });
                updateChartsForState(localState);
            });

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
                destroy: () => {
                    if (mountState === localState) {
                        mountState = null;
                    }
                    destroyMountState(localState);
                },
                refresh: refreshLocal,
                getChartsByPillar: () => localState.chartsByPillar || {}
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

    /**
     * Multi-model fingerprint board for Compare Models.
     * Layout: model headers across the top; Character+Voice row; Thinking+Output row.
     * Up to 4 models → up to 8 radars (2 rows × N columns).
     *
     * @param {Array<{ id: string, name?: string, leverValues: Record<string, number> }>} models
     * @param {string|HTMLElement} containerIdOrEl
     * @param {{ maxCanvasHeightPx?: number, embedded?: boolean }} [options]
     * @returns {Promise<{ destroy: function, refresh: function }>}
     */
    function mountAITunerV5CompareBoard(models, containerIdOrEl, options) {
        const list = Array.isArray(models) ? models.filter(Boolean).slice(0, 4) : [];
        if (!list.length) {
            return Promise.reject(new Error('mountAITunerV5CompareBoard: models required (1–4)'));
        }

        const container =
            typeof containerIdOrEl === 'string'
                ? document.getElementById(containerIdOrEl)
                : containerIdOrEl;

        if (!container) {
            return Promise.reject(new Error('mountAITunerV5CompareBoard: container not found'));
        }

        const pc = getPillarConfig();
        const levers = getLeversV5();
        if (!pc || !levers) {
            return Promise.reject(new Error('mountAITunerV5CompareBoard: PILLAR_CONFIG / LEVERS_V5 missing'));
        }

        const embedded = !options || options.embedded !== false;
        if (!embedded) {
            destroyPrimaryAndEmbedded();
        }

        const idSuffix =
            typeof Math !== 'undefined' && Math.random
                ? '-' + Math.random().toString(36).slice(2, 10)
                : '';

        const maxH =
            options && options.maxCanvasHeightPx != null ? options.maxCanvasHeightPx : 200;

        return loadChartJs()
            .then(() => {
                if (typeof Chart === 'undefined') {
                    throw new Error('Chart.js unavailable');
                }
                ensureFlatTopTicksPlugin();
            })
            .then(() => {
                container.innerHTML = '';

                const board = document.createElement('div');
                board.className = 'aituner-v5-compare-board';
                board.style.setProperty('--compare-cols', String(list.length));
                board.setAttribute('data-cols', String(list.length));

                const textColor = isDarkMode() ? '#f3f4f6' : '#1f2937';
                const gridColor = isDarkMode() ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.18)';
                const tier = 2;
                const chartEntries = [];
                const chartsByPillar = {};

                list.forEach((model) => {
                    const head = document.createElement('div');
                    head.className = 'aituner-v5-compare-model-head';
                    head.textContent = model.name || model.id || 'Model';
                    board.appendChild(head);
                });

                const makeStubEngine = (model) => ({
                    leverValues: Object.assign({}, model.leverValues || {}),
                    user: { tier: 2 },
                    selectedModel: model,
                    adjustLever: function () {},
                    onLeverChange: null,
                    onPromptChange: null,
                    onTierChange: null
                });

                const stubEngines = list.map(makeStubEngine);
                const pendingCanvases = [];

                RADAR_GROUPS.forEach((group) => {
                    const rowLabel = document.createElement('div');
                    rowLabel.className = 'aituner-v5-compare-row-label';
                    rowLabel.textContent = group.label;
                    board.appendChild(rowLabel);

                    const leverKeys = leverKeysForGroup(group, pc);
                    const labels = leverKeys.map((k) => (levers[k] && levers[k].name) || k);

                    stubEngines.forEach((engine, idx) => {
                        const model = list[idx];
                        const card = document.createElement('div');
                        card.className = 'aituner-v5-radar-card aituner-v5-compare-cell';
                        card.style.border = `2px solid ${isDarkMode() ? '#ffffff' : '#000000'}`;
                        card.style.borderRadius = '4px';
                        card.style.padding = '14px 10px 10px';
                        card.style.background = isDarkMode() ? '#1a1a1a' : '#eaeaea';

                        const canvas = document.createElement('canvas');
                        const chartKey = `${group.id}__${model.id || idx}`;
                        canvas.id = `aituner-v5-radar-${chartKey}${idSuffix}`;
                        canvas.setAttribute(
                            'aria-label',
                            `${model.name || model.id} ${group.label} radar`
                        );
                        canvas.style.width = '100%';
                        canvas.style.maxHeight = typeof maxH === 'number' ? `${maxH}px` : String(maxH);

                        card.appendChild(canvas);
                        board.appendChild(card);

                        pendingCanvases.push({
                            canvas,
                            chartKey,
                            engine,
                            leverKeys,
                            labels,
                            group
                        });
                    });
                });

                /* Attach before Chart init so responsive sizing sees real layout width. */
                container.appendChild(board);

                const hidePointLabels = list.length > 1;

                pendingCanvases.forEach((item) => {
                    const { canvas, chartKey, engine, leverKeys, labels, group } = item;
                    const data = leverKeys.map((k) => leverValue(engine, k));
                    const borderColor = RADAR_ACTIVE_STROKE;
                    const fillColor = RADAR_ACTIVE_FILL;

                    const chart = new Chart(canvas, {
                        type: 'radar',
                        data: {
                            labels,
                            datasets: [
                                {
                                    label: group.label,
                                    data,
                                    backgroundColor: fillColor,
                                    borderColor,
                                    borderWidth: 2,
                                    pointBackgroundColor: leverKeys.map(() => borderColor),
                                    pointBorderColor: borderColor,
                                    pointHoverBackgroundColor: borderColor,
                                    pointRadius: hidePointLabels ? 4 : 3,
                                    pointHoverRadius: hidePointLabels ? 7 : 5,
                                    pointHitRadius: hidePointLabels ? 18 : 12
                                }
                            ]
                        },
                        options: buildChartOptions({
                            textColor,
                            gridColor,
                            leverKeys,
                            groupId: group.id,
                            tier,
                            highlightIndex: undefined,
                            pointLabelSize: 9,
                            suppressTooltip: false,
                            hidePointLabels
                        })
                    });

                    canvas._radarDragEnabled = false;
                    canvas._radarLeverKeys = leverKeys;
                    canvas.style.cursor = 'default';
                    applyRadarChartPadding(chart, hidePointLabels);

                    chartsByPillar[chartKey] = chart;
                    chartEntries.push({ chart, engine, leverKeys, key: chartKey });
                });

                let resizeTimeout;
                const forceCompareLayout = () => {
                    chartEntries.forEach((entry) => {
                        const c = entry && entry.chart;
                        if (!c) {
                            return;
                        }
                        const canvas = c.canvas;
                        if (canvas) {
                            canvas.style.width = '100%';
                            canvas.style.height = '';
                        }
                        relayoutChart(c);
                    });
                };

                const onResize = () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(() => {
                        forceCompareLayout();
                    }, 200);
                };
                window.addEventListener('resize', onResize);

                const localState = {
                    engine: null,
                    chartsByPillar,
                    chartEntries,
                    container,
                    tier,
                    prevOnLeverChange: undefined,
                    onResize
                };

                embeddedRadarMounts.push(localState);

                const refreshLocal = () => updateChartsForState(localState);
                updateChartsForState(localState);

                requestAnimationFrame(() => {
                    forceCompareLayout();
                    requestAnimationFrame(forceCompareLayout);
                });

                return {
                    destroy: () => {
                        const i = embeddedRadarMounts.indexOf(localState);
                        if (i >= 0) {
                            embeddedRadarMounts.splice(i, 1);
                        }
                        destroyMountState(localState);
                        container.innerHTML = '';
                    },
                    refresh: refreshLocal,
                    getChartsByPillar: () => localState.chartsByPillar || {}
                };
            })
            .catch((err) => {
                console.warn('AITunerV5 compare board: charts unavailable', err);
                container.innerHTML =
                    '<p class="aituner-chart-fallback" role="status">Behavior charts could not load (check your connection or blockers).</p>';
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
        window.mountAITunerV5CompareBoard = mountAITunerV5CompareBoard;

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
