/**
 * AI Tuner v5 — Model room (entry, tour, tuner, decoder, setup).
 * Narrative alignment: Screens 9–11 (room entry, tour, tuner).
 */
(function (global) {
    'use strict';

    const PILLAR_KEYS = ['CHARACTER', 'VOICE', 'THINKING', 'OUTPUT'];

    /** Persona-backed quick tiles (priority before lever-only presets). */
    const ROOM_PERSONA_QUICK_TILES = [
        { personaId: 'direct', label: 'Direct', blurb: 'Just the answer. Nothing more.' },
        { personaId: 'collaborator', label: 'Collaborator', blurb: 'Thinks alongside you' },
        { personaId: 'strategist', label: 'Strategist', blurb: 'Challenges the frame, not just the question' }
    ];

    const ROOM_MODE_PRESETS = {
        writingPartner: {
            label: 'Writing Partner',
            blurb: 'Collaborative, warm, pays attention to tone.',
            levers: { emotionalWarmth: 8, formality: 5, creativity: 7, toneMatching: 8 }
        },
        research: {
            label: 'Research Mode',
            blurb: 'Thorough, cites reasoning, covers all angles.',
            levers: { transparency: 9, citationHabit: 9, responseLength: 8, confidence: 7 }
        },
        thinkingPartner: {
            label: 'Thinking Partner',
            blurb: 'Asks good questions, explores with you.',
            levers: { questionFrequency: 7, transparency: 8, initiative: 6, creativity: 6 }
        },
        teacher: {
            label: 'Teacher Mode',
            blurb: 'Explains clearly, assumes less prior knowledge.',
            levers: { teachingMode: 9, transparency: 7, responseLength: 7, confidence: 6 }
        },
        quickAnswer: {
            label: 'Quick Answer',
            blurb: 'Short, fast, minimal structure.',
            levers: { conciseness: 9, responseLength: 2, initiative: 0, formatting: 2 }
        }
    };

    function quietlySetLever(engine, key, val) {
        if (!window.LEVERS_V5 || !window.LEVERS_V5[key]) {
            return;
        }
        val = Math.max(0, Math.min(10, Math.round(Number(val))));
        engine.leverValues[key] = val;
        if (engine.session) {
            if (!engine.session.lever_values) {
                engine.session.lever_values = {};
            }
            engine.session.lever_values[key] = val;
        }
    }

    function applyBaseThenPreset(engine, modelId, presetKey) {
        const model = window.MODELS_V5 && window.MODELS_V5[modelId];
        const preset = ROOM_MODE_PRESETS[presetKey];
        if (!model || !preset) {
            return;
        }
        const base = { ...model.defaults };
        Object.assign(base, preset.levers);
        Object.keys(base).forEach((k) => quietlySetLever(engine, k, base[k]));
        engine.generatePrompt();
    }

    function applyBaseThenPersona(engine, modelId, personaId) {
        const model = window.MODELS_V5 && window.MODELS_V5[modelId];
        if (!model || !window.PERSONAS_V5 || !window.PERSONAS_V5[personaId]) {
            return;
        }
        engine.prePersonaSnapshot = null;
        engine.selectedPersona = null;
        if (engine.session) {
            engine.session.persona_id = null;
        }
        Object.keys(model.defaults).forEach((k) => quietlySetLever(engine, k, model.defaults[k]));
        engine.generatePrompt();
        engine.applyPersona(personaId);
    }

    function flattenLeverOrder() {
        const order = [];
        const pc = window.PILLAR_CONFIG;
        if (!pc) {
            return order;
        }
        PILLAR_KEYS.forEach((pk) => {
            const cfg = pc[pk];
            if (cfg && cfg.leverKeys) {
                cfg.leverKeys.forEach((k) => order.push(k));
            }
        });
        return order;
    }

    /**
     * Sequential axis reveal: zeros → target values (defaults or current session).
     */
    async function animateRadarSignature(engine, radarApi, targetMap, durationMs) {
        const order = flattenLeverOrder();
        if (!order.length || !radarApi || typeof radarApi.refresh !== 'function') {
            return;
        }
        const ms = Math.min(500, Math.max(300, durationMs || 400));
        const stepMs = Math.max(12, Math.floor(ms / order.length));
        order.forEach((k) => quietlySetLever(engine, k, 0));
        engine.generatePrompt();
        radarApi.refresh();
        for (let i = 0; i < order.length; i++) {
            const k = order[i];
            const t = targetMap[k] !== undefined ? targetMap[k] : 5;
            quietlySetLever(engine, k, t);
            radarApi.refresh();
            await new Promise((r) => setTimeout(r, stepMs));
        }
        engine.generatePrompt();
    }

    function escapeHtml(s) {
        const d = document.createElement('div');
        d.textContent = s == null ? '' : String(s);
        return d.innerHTML;
    }

    class ModelRoomUI {
        constructor(engine, userProfile) {
            this.engine = engine;
            this.userProfile = userProfile;
            this.root = null;
            this.mainEl = null;
            this.navEl = null;
            /** @type {'entry'|'tour'|'tune'|'decode'|'setup'} */
            this.tab = 'entry';
            this.roomSetupUI = null;
            this.modelId = 'claude';
            this.entryRadarApi = null;
            this.tuneRadarApi = null;
            this.roomDecoderUI = null;
            /** Came from Setup Step 2 "Configure in Tune" — show return banner on Tune tab. */
            this.tuneFromSetupStep2 = false;
            /** Resume Setup at this step after Tune return or Setup tab reopen. */
            this.pendingSetupStep = null;
            /** Last wizard step before leaving Setup (Tune/Decode/etc.). */
            this.lastSetupStep = null;
            this.sliderControls = [];
            this.styleImportSourceId = null;
            this.fineTuneOpen = false;
            this.styleImportOpen = false;
            this._prevOnLeverChange = undefined;
            this._leverHookInstalled = false;
        }

        teardown() {
            if (this.entryRadarApi && typeof this.entryRadarApi.destroy === 'function') {
                this.entryRadarApi.destroy();
            }
            this.entryRadarApi = null;
            if (this.tuneRadarApi && typeof this.tuneRadarApi.destroy === 'function') {
                this.tuneRadarApi.destroy();
            }
            this.tuneRadarApi = null;
            if (this.roomDecoderUI && typeof this.roomDecoderUI.teardown === 'function') {
                this.roomDecoderUI.teardown();
            }
            this.roomDecoderUI = null;
            if (this.roomSetupUI && typeof this.roomSetupUI.destroy === 'function') {
                this.roomSetupUI.destroy();
            }
            this.roomSetupUI = null;
            this.tuneFromSetupStep2 = false;
            this.pendingSetupStep = null;
            this.lastSetupStep = null;
            this.sliderControls = [];
            if (this._leverHookInstalled) {
                this.engine.onLeverChange = this._prevOnLeverChange;
                this._leverHookInstalled = false;
                this._prevOnLeverChange = undefined;
            }
        }

        installLeverRefreshHook() {
            if (this._leverHookInstalled) {
                return;
            }
            this._prevOnLeverChange = this.engine.onLeverChange;
            const self = this;
            this.engine.onLeverChange = function (k, v) {
                if (typeof self._prevOnLeverChange === 'function') {
                    self._prevOnLeverChange.call(this, k, v);
                }
                if (self.tuneRadarApi && self.tab === 'tune' && typeof self.tuneRadarApi.refresh === 'function') {
                    self.tuneRadarApi.refresh();
                }
            };
            this._leverHookInstalled = true;
        }

        /**
         * @param {{ modelId?: string, configId?: string, initialTab?: 'entry'|'tour'|'tune'|'decode'|'setup' }} opts
         */
        open(opts) {
            this.teardown();
            if (opts && opts.configId && typeof this.engine.loadConfig === 'function') {
                this.engine.loadConfig(opts.configId);
                this.modelId = (this.engine.selectedModel && this.engine.selectedModel.id) || opts.modelId || 'claude';
            } else if (opts && opts.modelId) {
                this.engine.selectModel(opts.modelId);
                this.modelId = opts.modelId;
            } else {
                this.modelId = (this.engine.selectedModel && this.engine.selectedModel.id) || 'claude';
                this.engine.selectModel(this.modelId);
            }

            if (this.userProfile && typeof this.userProfile.recordModelExplored === 'function') {
                this.userProfile.recordModelExplored(this.modelId);
            }

            this.tab = (opts && opts.initialTab) || 'entry';
            this.tuneFromSetupStep2 = false;
            this.pendingSetupStep = null;
            this.lastSetupStep = null;
            this.styleImportSourceId = null;
            this.fineTuneOpen = false;
            this.styleImportOpen = false;
            this.installLeverRefreshHook();
            this.renderChrome();
            this.renderMain();
        }

        getRoom() {
            if (typeof window.getModelRoom === 'function') {
                return window.getModelRoom(this.modelId);
            }
            const fb = window.MODEL_ROOMS_V5 && window.MODEL_ROOMS_V5[this.modelId];
            return fb || null;
        }

        modelDisplayName() {
            const m = window.MODELS_V5 && window.MODELS_V5[this.modelId];
            return m ? m.name : this.modelId;
        }

        renderChrome() {
            this.root = document.getElementById('model-room-view');
            if (!this.root) {
                return;
            }
            this.root.innerHTML = `
                <div class="model-room-inner">
                    <header class="model-room-top-bar">
                        <button type="button" class="model-room-home-link">&larr; Home</button>
                    </header>
                    <div id="model-room-main" class="model-room-main"></div>
                    <nav id="model-room-nav" class="model-room-bottom-nav" aria-label="Room navigation">
                        <button type="button" class="room-nav-btn" data-room-tab="tour">About</button>
                        <button type="button" class="room-nav-btn" data-room-tab="tune">Tune</button>
                        <button type="button" class="room-nav-btn" data-room-tab="decode">Decode</button>
                        <button type="button" class="room-nav-btn" data-room-tab="setup">Setup</button>
                    </nav>
                </div>
            `;
            this.mainEl = this.root.querySelector('#model-room-main');
            this.navEl = this.root.querySelector('#model-room-nav');
            const homeLn = this.root.querySelector('.model-room-home-link');
            if (homeLn) {
                homeLn.addEventListener('click', () => this.goHome());
            }
            this.navEl.querySelectorAll('[data-room-tab]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const t = btn.getAttribute('data-room-tab');
                    this.switchTab(t);
                });
            });
            this.updateNavActive();
        }

        updateNavActive() {
            if (!this.navEl) {
                return;
            }
            this.navEl.querySelectorAll('[data-room-tab]').forEach((btn) => {
                const t = btn.getAttribute('data-room-tab');
                const active =
                    (t === 'tour' && (this.tab === 'tour' || this.tab === 'entry')) ||
                    (t === 'tune' && this.tab === 'tune') ||
                    (t === 'decode' && this.tab === 'decode') ||
                    (t === 'setup' && this.tab === 'setup');
                btn.classList.toggle('room-nav-active', active);
            });
        }

        switchTab(tab, navOptions) {
            navOptions = navOptions || {};
            if (tab === 'tune' && navOptions.fromSetupStep2 === true) {
                this.tuneFromSetupStep2 = true;
            }
            if (tab === 'setup' && this.tuneFromSetupStep2) {
                this.pendingSetupStep = 2;
            }
            if (tab === 'entry') {
                this.tab = 'entry';
            } else if (tab === 'tour' || tab === 'tune' || tab === 'decode' || tab === 'setup') {
                this.tab = tab;
            } else {
                this.tab = 'entry';
            }
            this.renderMain();
        }

        goHome() {
            const resume = sessionStorage.getItem('aituner_room_resume_onboarding');
            sessionStorage.removeItem('aituner_room_resume_onboarding');
            this.teardown();
            if (resume && window.onboardingUI && window.router) {
                const n = parseInt(resume, 10);
                window.router.navigateTo('onboarding');
                setTimeout(() => {
                    if (window.onboardingUI && !Number.isNaN(n)) {
                        window.onboardingUI.showScreen(n);
                    }
                }, 0);
                return;
            }
            if (window.router) {
                window.router.showHome();
            }
        }

        renderMain() {
            if (!this.mainEl) {
                return;
            }
            this.teardownPartialForTabSwitch();
            this.updateNavActive();

            if (this.tab === 'entry') {
                this.renderEntry();
            } else if (this.tab === 'tour') {
                this.renderTour();
            } else if (this.tab === 'tune') {
                this.renderTune();
            } else if (this.tab === 'decode') {
                this.renderDecode();
            } else if (this.tab === 'setup') {
                this.renderSetup();
            }
        }

        teardownPartialForTabSwitch() {
            if (this.entryRadarApi && typeof this.entryRadarApi.destroy === 'function') {
                this.entryRadarApi.destroy();
            }
            this.entryRadarApi = null;
            if (this.tab !== 'tune' && this.tuneRadarApi && typeof this.tuneRadarApi.destroy === 'function') {
                this.tuneRadarApi.destroy();
                this.tuneRadarApi = null;
            }
            if (this.tab !== 'decode' && this.roomDecoderUI && typeof this.roomDecoderUI.teardown === 'function') {
                this.roomDecoderUI.teardown();
                this.roomDecoderUI = null;
            }
            if (this.tab !== 'setup' && this.roomSetupUI && typeof this.roomSetupUI.destroy === 'function') {
                if (typeof this.roomSetupUI.step === 'number' && Number.isFinite(this.roomSetupUI.step)) {
                    this.lastSetupStep = this.roomSetupUI.step;
                }
                this.roomSetupUI.destroy();
                this.roomSetupUI = null;
            }
        }

        renderEntry() {
            const room = this.getRoom();
            const title = room ? room.roomTitle : `The ${this.modelDisplayName()} Room`;
            const tag = room ? room.tagline : '';
            this.mainEl.innerHTML = `
                <div class="room-screen room-entry-screen">
                    <p class="narrative-label">Welcome to</p>
                    <h1 class="room-entry-title">${escapeHtml(title)}</h1>
                    <p class="room-tagline">${escapeHtml(tag)}</p>
                    <div id="room-entry-radar" class="room-entry-radar-host"></div>
                    <div class="room-entry-body narrative-body">
                        <p>This is ${escapeHtml(this.modelDisplayName())}'s default personality — the shape it naturally takes before you change anything.</p>
                        <p>Some of this you'll want to keep. Some of it you might want to adjust. That's what we're here for.</p>
                    </div>
                    <button type="button" class="primary-btn" id="room-entry-cta">Show me around →</button>
                </div>
            `;
            this.mainEl.querySelector('#room-entry-cta').addEventListener('click', () => {
                this.tab = 'tour';
                this.renderMain();
            });

            const host = this.mainEl.querySelector('#room-entry-radar');
            if (host && typeof mountAITunerV5Radars === 'function') {
                const targets = { ...this.engine.leverValues };
                if (window.LEVERS_V5) {
                    Object.keys(window.LEVERS_V5).forEach((k) => quietlySetLever(this.engine, k, 0));
                }
                this.engine.generatePrompt();
                mountAITunerV5Radars(this.engine, host, { tier: 2 })
                    .then((api) => {
                        this.entryRadarApi = api;
                        const dest = targets;
                        return animateRadarSignature(this.engine, api, dest, 400);
                    })
                    .catch((err) => console.error('Room entry radar failed', err));
            }
        }

        renderTour() {
            const room = this.getRoom();
            const name = this.modelDisplayName();
            const selfText = room ? room.selfDescription : '';
            const strengths = room ? room.observedStrengths : [];
            const weaknesses = room ? room.observedWeaknesses : [];
            const bestFor = room ? room.bestFor : [];
            const notGreat = room ? room.notGreatFor : [];
            const selfSrc = room && room.meta ? room.meta.selfDescriptionSource : '';
            const obsSrc = room && room.meta ? room.meta.observedSource : '';
            const nativeBehaviorRaw =
                room && room.nativeBehavior != null && room.nativeBehavior !== ''
                    ? String(room.nativeBehavior)
                    : room && room.primeDirective
                      ? String(room.primeDirective)
                      : '';
            const nativeBehaviorTooltip =
                'Our observed assessment of what this model does before you change anything. Built by the company that trained it. Not official documentation — labeled as observed.';
            const nativeBehaviorBlock = nativeBehaviorRaw
                ? `
                    <div class="room-prime-directive-block">
                        <p class="room-prime-directive-label">
                            Native behavior
                            <span class="room-prime-directive-tip" tabindex="0" role="img" aria-label="${escapeHtml(
                                nativeBehaviorTooltip
                            )}" title="${escapeHtml(nativeBehaviorTooltip)}">ⓘ</span>
                        </p>
                        <p class="room-prime-directive-text">${escapeHtml(nativeBehaviorRaw)}</p>
                    </div>`
                : '';

            const strengthsHtml = strengths.map((s) => `<li>${escapeHtml(s)}</li>`).join('');
            const weakHtml = weaknesses.map((s) => `<li>${escapeHtml(s)}</li>`).join('');
            const bestHtml = bestFor.map((s) => `<li>${escapeHtml(s)}</li>`).join('');
            const notHtml = notGreat.map((s) => `<li>${escapeHtml(s)}</li>`).join('');

            this.mainEl.innerHTML = `
                <div class="room-screen room-tour-screen">
                    <p class="narrative-label">Getting to know ${escapeHtml(name)}</p>
                    <section class="room-tour-section">
                        <h2>In ${escapeHtml(name)}'s own words</h2>
                        <p class="room-prose">${escapeHtml(selfText)}</p>
                        <p class="room-source-tag">What ${escapeHtml(name)} says about itself</p>
                        <p class="room-source-meta">${escapeHtml(selfSrc)}</p>
                        ${nativeBehaviorBlock}
                    </section>
                    <section class="room-tour-section">
                        <h2>What we've observed</h2>
                        <p class="room-subhead">Strengths</p>
                        <ul class="room-bullet-list">${strengthsHtml}</ul>
                        <p class="room-subhead">Worth knowing</p>
                        <ul class="room-bullet-list">${weakHtml}</ul>
                        <p class="room-source-tag">Based on our behavioral testing</p>
                        <p class="room-source-meta">${escapeHtml(obsSrc)}</p>
                    </section>
                    <section class="room-tour-section room-two-col-section">
                        <h2>Best for / Not the first choice for</h2>
                        <div class="room-two-col">
                            <div>
                                <p class="room-subhead">Best for</p>
                                <ul class="room-bullet-list">${bestHtml}</ul>
                            </div>
                            <div>
                                <p class="room-subhead">Not the first choice for</p>
                                <ul class="room-bullet-list">${notHtml}</ul>
                            </div>
                        </div>
                    </section>
                    <button type="button" class="primary-btn" id="room-tour-tune-cta">Now let's tune it to you →</button>
                    <p class="room-secondary-link-wrap">
                        <button type="button" class="secondary-btn" id="room-tour-compare">Compare ${escapeHtml(name)} to another model →</button>
                    </p>
                </div>
            `;

            this.mainEl.querySelector('#room-tour-tune-cta').addEventListener('click', () => {
                this.switchTab('tune');
            });
            this.mainEl.querySelector('#room-tour-compare').addEventListener('click', () => {
                sessionStorage.setItem('aituner_discovery_preselect', this.modelId);
                this.teardown();
                if (window.router) {
                    window.router.navigateTo('discovery');
                }
            });
        }

        renderTune() {
            const displayName = this.modelDisplayName();
            const importLabel =
                this.styleImportSourceId && window.MODELS_V5[this.styleImportSourceId]
                    ? `You're now running ${displayName} with ${window.MODELS_V5[this.styleImportSourceId].name}'s behavioral profile`
                    : '';

            const personaTiles = ROOM_PERSONA_QUICK_TILES.map(
                (t) => `
                    <button type="button" class="room-mode-tile" data-persona="${escapeHtml(t.personaId)}">
                        <span class="room-mode-tile-title">${escapeHtml(t.label)}</span>
                        <span class="room-mode-tile-blurb">${escapeHtml(t.blurb)}</span>
                    </button>`
            ).join('');
            const presetTiles = Object.keys(ROOM_MODE_PRESETS)
                .map((key) => {
                    const m = ROOM_MODE_PRESETS[key];
                    return `
                    <button type="button" class="room-mode-tile" data-mode="${key}">
                        <span class="room-mode-tile-title">${escapeHtml(m.label)}</span>
                        <span class="room-mode-tile-blurb">${escapeHtml(m.blurb)}</span>
                    </button>`;
                })
                .join('');
            const modeTiles = personaTiles + presetTiles;

            const modelOptions = Object.values(window.MODELS_V5 || {})
                .filter((m) => m.id !== this.modelId)
                .map((m) => `<option value="${escapeHtml(m.id)}">${escapeHtml(m.name)}</option>`)
                .join('');

            const fineDisplay = this.fineTuneOpen ? 'block' : 'none';
            const styleDisplay = this.styleImportOpen ? 'block' : 'none';
            const fineToggleLabel = this.fineTuneOpen ? 'Fine-tune ▲' : 'Fine-tune →';

            const returnBannerHtml =
                this.tuneFromSetupStep2
                    ? `
                <div class="room-tune-return-banner" role="navigation" aria-label="Project setup navigation">
                    <button type="button" class="room-tune-return-link" id="room-tune-return-setup">&larr; Back to Project Setup &mdash; Step 2</button>
                </div>`
                    : '';

            this.mainEl.innerHTML = `
                <div class="room-screen room-tune-screen">
                    <p class="narrative-label">Shape it to fit you</p>
                    <h1 class="room-tune-headline">Start with a mode. Adjust from there.</h1>
                    <section class="room-tune-section">
                        <div class="room-mode-grid">${modeTiles}</div>
                        <p class="room-mode-caption">Each mode is a starting point — not a final answer. Adjust the sliders below to make it yours.</p>
                    </section>
                    <section class="room-fingerprint-section">
                        <p class="room-subhead">Fingerprint</p>
                        <div id="room-tune-radar" class="room-tune-radar-host"></div>
                    </section>
                    <section class="room-tune-section">
                        <button type="button" class="secondary-btn room-expand-btn" id="room-fine-toggle">${fineToggleLabel}</button>
                        <div id="room-fine-panel" class="room-expand-panel" style="display:${fineDisplay}">
                            <h2>These are the levers behind the modes.</h2>
                            <p class="room-hint">Move a slider. Watch the radar change. The prompt updates automatically.</p>
                            <div id="room-sliders-wrap" class="room-sliders-by-pillar"></div>
                        </div>
                    </section>
                    <section class="room-tune-section">
                        <button type="button" class="secondary-btn room-expand-btn" id="room-style-toggle">Make ${escapeHtml(displayName)} behave more like another model →</button>
                        <div id="room-style-panel" class="room-expand-panel" style="display:${styleDisplay}">
                            <label class="room-style-label">Source model profile</label>
                            <select id="room-style-model" class="room-style-select">${modelOptions}</select>
                            <p id="room-style-label-line" class="room-style-import-label">${escapeHtml(importLabel)}</p>
                        </div>
                    </section>
                    <div class="room-tune-ctas">
                        <button type="button" class="primary-btn" id="room-copy-prompt">Copy my prompt →</button>
                        <button type="button" class="nav-btn" id="room-save-config">Save this configuration →</button>
                    </div>
                    ${returnBannerHtml}
                </div>
            `;

            if (this.tuneFromSetupStep2) {
                const rtn = this.mainEl.querySelector('#room-tune-return-setup');
                if (rtn) {
                    rtn.addEventListener('click', () => {
                        this.pendingSetupStep = 2;
                        this.tuneFromSetupStep2 = false;
                        this.switchTab('setup');
                    });
                }
            }

            this.mainEl.querySelectorAll('.room-mode-tile').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const personaId = btn.getAttribute('data-persona');
                    if (personaId) {
                        applyBaseThenPersona(this.engine, this.modelId, personaId);
                    } else {
                        const mode = btn.getAttribute('data-mode');
                        applyBaseThenPreset(this.engine, this.modelId, mode);
                    }
                    this.refreshTuneRadarsAndSliders();
                });
            });

            this.mainEl.querySelector('#room-fine-toggle').addEventListener('click', () => {
                this.fineTuneOpen = !this.fineTuneOpen;
                this.renderTune();
            });

            this.mainEl.querySelector('#room-style-toggle').addEventListener('click', () => {
                this.styleImportOpen = !this.styleImportOpen;
                this.renderTune();
            });

            const styleSel = this.mainEl.querySelector('#room-style-model');
            if (styleSel) {
                if (this.styleImportSourceId && [...styleSel.options].some((o) => o.value === this.styleImportSourceId)) {
                    styleSel.value = this.styleImportSourceId;
                }
                styleSel.addEventListener('change', () => {
                    const sid = styleSel.value;
                    this.applyStyleImport(sid);
                });
            }

            this.mainEl.querySelector('#room-copy-prompt').addEventListener('click', () => {
                if (this.engine.copyPrompt) {
                    this.engine.copyPrompt();
                }
            });
            this.mainEl.querySelector('#room-save-config').addEventListener('click', () => {
                if (typeof window.openSaveConfigDialog === 'function') {
                    window.openSaveConfigDialog({
                        engine: this.engine,
                        defaultName: `${displayName} room setup`
                    });
                }
            });

            this.mountTuneRadar();
            this.mountPillarSliders();
        }

        applyStyleImport(sourceId) {
            if (!sourceId || !window.MODELS_V5[sourceId]) {
                return;
            }
            this.styleImportSourceId = sourceId;
            const src = window.MODELS_V5[sourceId].defaults;
            Object.keys(src).forEach((k) => quietlySetLever(this.engine, k, src[k]));
            this.engine.generatePrompt();
            this.refreshTuneRadarsAndSliders();
            const line = this.mainEl.querySelector('#room-style-label-line');
            const tgt = this.modelDisplayName();
            const srcName = window.MODELS_V5[sourceId].name;
            if (line) {
                line.textContent = `You're now running ${tgt} with ${srcName}'s behavioral profile`;
            }
        }

        mountTuneRadar() {
            const host = this.mainEl.querySelector('#room-tune-radar');
            if (!host || typeof mountAITunerV5Radars !== 'function') {
                return;
            }
            if (this.tuneRadarApi && typeof this.tuneRadarApi.destroy === 'function') {
                this.tuneRadarApi.destroy();
            }
            mountAITunerV5Radars(this.engine, host, { tier: 2 })
                .then((api) => {
                    this.tuneRadarApi = api;
                })
                .catch((err) => console.error('Room tune radar failed', err));
        }

        mountPillarSliders() {
            const wrap = this.mainEl.querySelector('#room-sliders-wrap');
            if (!wrap || !window.PILLAR_CONFIG) {
                return;
            }
            wrap.innerHTML = '';
            this.sliderControls = [];
            PILLAR_KEYS.forEach((pk) => {
                const cfg = window.PILLAR_CONFIG[pk];
                if (!cfg) {
                    return;
                }
                const sec = document.createElement('div');
                sec.className = 'room-pillar-sliders';
                sec.innerHTML = `<h3 class="room-pillar-title">${escapeHtml(cfg.label)}</h3><div id="room-sliders-${pk}"></div>`;
                wrap.appendChild(sec);
                const id = `room-sliders-${pk}`;
                const sc = new SliderControls(this.engine, id);
                sc.render(cfg.leverKeys, 2);
                this.sliderControls.push(sc);
            });
        }

        refreshTuneRadarsAndSliders() {
            if (this.tuneRadarApi && typeof this.tuneRadarApi.refresh === 'function') {
                this.tuneRadarApi.refresh();
            }
            this.sliderControls.forEach((sc) => sc.syncFromEngine && sc.syncFromEngine());
        }

        renderDecode() {
            const name = this.modelDisplayName();
            this.mainEl.innerHTML = `
                <div class="room-screen room-decode-screen">
                    <p class="room-decode-scope">Prompt Decoder — scoped to <strong>${escapeHtml(name)}</strong> (baseline uses this model).</p>
                    <div id="room-decoder-root"></div>
                </div>
            `;
            this.engine.selectModel(this.modelId);
            if (!this.roomDecoderUI) {
                this.roomDecoderUI = new DecoderUI(this.engine, this.userProfile);
            }
            this.roomDecoderUI.mount('room-decoder-root');
        }

        renderSetup() {
            if (!this.mainEl || typeof window.ProjectSetupUI !== 'function') {
                return;
            }
            if (this.roomSetupUI && typeof this.roomSetupUI.destroy === 'function') {
                this.roomSetupUI.destroy();
            }
            this.roomSetupUI = null;

            let initialStep = 0;
            if (this.pendingSetupStep != null && Number.isFinite(this.pendingSetupStep)) {
                initialStep = this.pendingSetupStep;
            } else if (this.lastSetupStep != null && Number.isFinite(this.lastSetupStep)) {
                initialStep = this.lastSetupStep;
            }
            initialStep = Math.max(0, Math.min(4, Math.round(initialStep)));
            this.pendingSetupStep = null;
            this.lastSetupStep = null;

            this.mainEl.innerHTML = '<div id="room-setup-root"></div>';
            const host = this.mainEl.querySelector('#room-setup-root');
            const ui = new window.ProjectSetupUI(host, this.engine, {
                modelId: this.modelId,
                initialStep,
                onNavigateTab: (tab, navOpts) => this.switchTab(tab, navOpts)
            });
            this.roomSetupUI = ui;
            ui.render();

            if (initialStep === 2) {
                this.tuneFromSetupStep2 = false;
            }
        }
    }

    global.ModelRoomUI = ModelRoomUI;
    global.ROOM_MODE_PRESETS = ROOM_MODE_PRESETS;

    global.openModelRoom = function (opts) {
        if (!window.modelRoomUI) {
            console.warn('openModelRoom: modelRoomUI not initialized');
            return;
        }
        window._pendingRoomOpts = opts || {};
        if (window.router) {
            window.router.navigateTo('model-room');
        }
    };
})(typeof window !== 'undefined' ? window : globalThis);
