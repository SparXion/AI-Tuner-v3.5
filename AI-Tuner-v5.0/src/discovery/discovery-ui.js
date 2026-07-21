/**
 * AITuner v5.0 — Discovery mode: question + model pick + comparison grid + model room CTAs
 */

class DiscoveryMode {
    constructor(engine) {
        this.engine = engine;
        this.selectedQuestion = null;
        this.selectedModels = [];
    }

    getPreSetQuestions() {
        return [
            {
                id: 'quit-job',
                text: "Should I quit my job to start a company?",
                description: "Shows: empathy, hedging, directness, initiative"
            },
            {
                id: 'blockchain',
                text: "Explain blockchain in one paragraph.",
                description: "Shows: verbosity, tone, teaching mode, confidence"
            },
            {
                id: 'programming-language',
                text: "What's the best programming language?",
                description: "Shows: assertiveness, confidence, opinion-giving"
            },
            {
                id: 'product-idea',
                text: "Give me an unusual product idea.",
                description: "Shows: creativity, playfulness, divergent thinking"
            },
            {
                id: 'truth-seeker-demo',
                text: 'Is there objective truth?',
                description:
                    "Shows each model's native behavior — run with Truth-Seeker active for maximum contrast",
                intent: 'truth-seeker-demo',
                recommended_persona: 'truthSeeker'
            }
        ];
    }

    selectQuestion(questionId) {
        const questions = this.getPreSetQuestions();
        this.selectedQuestion = questions.find((q) => q.id === questionId);
        return this.selectedQuestion;
    }

    setCustomQuestion(text) {
        this.selectedQuestion = {
            id: 'custom',
            text: text,
            description: 'Custom question'
        };
    }

    selectModels(modelIds) {
        if (!window.MODELS_V5) {
            return;
        }
        this.selectedModels = modelIds
            .filter((id) => window.MODELS_V5[id])
            .slice(0, 4)
            .map((id) => window.MODELS_V5[id]);
    }

    getComparisonData() {
        if (!this.selectedQuestion || this.selectedModels.length === 0) {
            return null;
        }
        return {
            question: this.selectedQuestion,
            models: this.selectedModels.map((model) => ({
                id: model.id,
                name: model.name,
                provider: model.provider,
                voice_signature: model.voice_signature,
                defaults: model.defaults
            }))
        };
    }

    recordDiscoveryRun() {
        const profile = new UserProfile(this.engine);
        profile.recordDiscoveryRun();
        this.selectedModels.forEach((model) => {
            profile.recordModelExplored(model.id);
        });
    }
}

class DiscoveryUI {
    constructor(engine) {
        this.engine = engine;
        this.mode = new DiscoveryMode(engine);
        this.container = null;
        /** @type {{ destroy: function }[]} */
        this.comparisonRadarApis = [];
    }

    /**
     * Map preset question id → MODEL_SAMPLES intent key
     */
    getIntentForQuestion(questionId) {
        const map = {
            'quit-job': 'think',
            blockchain: 'explore',
            'programming-language': 'think',
            'product-idea': 'explore',
            'truth-seeker-demo': 'think',
            custom: 'think'
        };
        return map[questionId] || 'think';
    }

    getSampleText(questionId, modelId) {
        const intent = this.getIntentForQuestion(questionId);
        const bank = window.MODEL_SAMPLES && window.MODEL_SAMPLES[intent];
        if (bank && bank[modelId]) {
            return bank[modelId];
        }
        const m = window.MODELS_V5 && window.MODELS_V5[modelId];
        return m && m.voice_signature ? m.voice_signature : 'Sample not available for this pairing — tune the model to hear its default voice.';
    }

    destroyComparisonRadars() {
        this.comparisonRadarApis.forEach((api) => {
            if (api && typeof api.destroy === 'function') {
                api.destroy();
            }
        });
        this.comparisonRadarApis = [];
    }

    updatePersonaNudge() {
        if (!this.container) {
            return;
        }
        const el = this.container.querySelector('#discovery-persona-nudge');
        if (!el) {
            return;
        }
        const q = this.mode.selectedQuestion;
        if (q && q.recommended_persona) {
            el.style.display = 'block';
            el.textContent =
                "This question reveals each model's native behavior. Truth-Seeker mode recommended.";
        } else {
            el.style.display = 'none';
            el.textContent = '';
        }
    }

    mount(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            return;
        }

        this.destroyComparisonRadars();

        const questions = this.mode.getPreSetQuestions();
        const qCards = questions
            .map(
                (q) => `
            <button type="button" class="discovery-q-card" data-qid="${q.id}">
                <span class="discovery-q-text">${this.escape(q.text)}</span>
                <span class="discovery-q-desc">${this.escape(q.description)}</span>
            </button>
        `
            )
            .join('');

        const models = window.MODELS_V5 ? Object.values(window.MODELS_V5) : [];
        const modelChecks = models
            .map(
                (m) => `
            <label class="discovery-model-check">
                <input type="checkbox" name="discovery-model" value="${m.id}" />
                <span>${this.escape(m.name)}</span>
            </label>
        `
            )
            .join('');

        this.container.innerHTML = `
            <div class="discovery-shell">
                <p class="discovery-lead">Pick a question and up to four models. Compare default fingerprints side by side — Character + Voice on top, Thinking + Output below — then read how each answers.</p>
                <h2 class="discovery-h2">Choose a question</h2>
                <div class="discovery-q-grid">${qCards}</div>
                <div id="discovery-persona-nudge" class="discovery-persona-nudge" style="display:none" role="status" aria-live="polite"></div>
                <h2 class="discovery-h2">Models to compare (max 4)</h2>
                <div class="discovery-model-grid">${modelChecks}</div>
                <button type="button" class="primary-btn" id="discovery-compare-btn">Compare →</button>
                <div id="discovery-compare-placeholder" class="discovery-placeholder" style="display:none;"></div>
            </div>
        `;

        this.container.querySelectorAll('.discovery-q-card').forEach((btn) => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.discovery-q-card').forEach((b) => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.mode.selectQuestion(btn.getAttribute('data-qid'));
                this.updatePersonaNudge();
            });
        });

        this.container.querySelectorAll('input[name="discovery-model"]').forEach((cb) => {
            cb.addEventListener('change', () => this.enforceMaxFour());
        });

        this.container.querySelector('#discovery-compare-btn').addEventListener('click', () => this.runCompare());

        const firstQ = questions[0];
        if (firstQ) {
            this.mode.selectQuestion(firstQ.id);
            const firstCard = this.container.querySelector('.discovery-q-card');
            if (firstCard) {
                firstCard.classList.add('selected');
            }
            this.updatePersonaNudge();
        }

        const pre = sessionStorage.getItem('aituner_discovery_preselect');
        if (pre) {
            const cb = this.container.querySelector('input[name="discovery-model"][value="' + pre + '"]');
            if (cb) {
                cb.checked = true;
            }
            sessionStorage.removeItem('aituner_discovery_preselect');
        }
    }

    enforceMaxFour() {
        const boxes = Array.from(this.container.querySelectorAll('input[name="discovery-model"]:checked'));
        if (boxes.length > 4) {
            boxes[boxes.length - 1].checked = false;
        }
    }

    runCompare() {
        const ids = Array.from(this.container.querySelectorAll('input[name="discovery-model"]:checked')).map((cb) => cb.value);
        this.mode.selectModels(ids);
        const data = this.mode.getComparisonData();
        console.log('Discovery compare selection:', data);
        this.mode.recordDiscoveryRun();

        const ph = this.container.querySelector('#discovery-compare-placeholder');
        if (!ph) {
            return;
        }
        ph.style.display = 'block';
        this.destroyComparisonRadars();

        if (!ids.length) {
            ph.innerHTML = '<p>Select at least one model to compare, or pick a model to tune below.</p>';
            return;
        }

        const q = this.mode.selectedQuestion;
        const qText = q ? q.text : '';
        const qid = q ? q.id : 'custom';
        const n = ids.length;

        const tuneButtons = ids
            .map((mid) => {
                const m = window.MODELS_V5 && window.MODELS_V5[mid];
                const label = m ? m.name : mid;
                return `<button type="button" class="primary-btn discovery-tune-btn" data-tune-model="${this.escape(mid)}">Tune ${this.escape(label)} →</button>`;
            })
            .join('');

        const sampleCards = ids
            .map((mid) => {
                const m = window.MODELS_V5 && window.MODELS_V5[mid];
                const label = m ? m.name : mid;
                const sample = this.getSampleText(qid, mid);
                const sampleHtml = this.escape(sample).replace(/\n/g, '<br/>');
                return `
                <article class="discovery-compare-card">
                    <h3 class="discovery-compare-name">${this.escape(label)}</h3>
                    <p class="discovery-compare-q"><span class="discovery-compare-q-label">Question:</span> ${this.escape(qText)}</p>
                    <div class="discovery-compare-sample">${sampleHtml}</div>
                </article>`;
            })
            .join('');

        const noticeButtons = ids
            .map((mid) => {
                const m = window.MODELS_V5 && window.MODELS_V5[mid];
                const label = m ? m.name : mid;
                return `<button type="button" class="discovery-notice-chip" data-notice-model="${this.escape(mid)}">${this.escape(label)}</button>`;
            })
            .join('');

        const sampleGridClass = 'discovery-compare-grid discovery-compare-grid--' + n;

        ph.innerHTML = `
            <div class="discovery-compare-wrap">
                <p class="discovery-compare-lead"><strong>Fingerprint board</strong> — Character + Voice on top, Thinking + Output below. Models left to right (up to four).</p>
                <div id="discovery-compare-board" class="discovery-compare-board-host" aria-label="Model fingerprint comparison"></div>
                <div class="discovery-compare-tune-row">${tuneButtons}</div>
                <h2 class="discovery-h2 discovery-compare-samples-h">Same question, different voices</h2>
                <div class="${sampleGridClass}">${sampleCards}</div>
                <section class="discovery-notice-section">
                    <h3 class="discovery-notice-title">What did you notice?</h3>
                    <p class="discovery-notice-sub">Tap a model to open its room (explore intent).</p>
                    <div class="discovery-notice-chips">${noticeButtons}</div>
                </section>
            </div>
        `;

        ph.querySelectorAll('.discovery-tune-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const mid = btn.getAttribute('data-tune-model');
                if (mid && typeof window.openModelRoom === 'function') {
                    sessionStorage.removeItem('aituner_room_resume_onboarding');
                    window.openModelRoom({ modelId: mid, initialTab: 'tune' });
                }
            });
        });

        ph.querySelectorAll('.discovery-notice-chip').forEach((btn) => {
            btn.addEventListener('click', () => {
                const mid = btn.getAttribute('data-notice-model');
                if (mid && this.engine.setIntent) {
                    this.engine.setIntent('explore');
                }
                if (mid && typeof window.openModelRoom === 'function') {
                    sessionStorage.removeItem('aituner_room_resume_onboarding');
                    window.openModelRoom({ modelId: mid, initialTab: 'entry' });
                }
            });
        });

        const boardHost = ph.querySelector('#discovery-compare-board');
        if (!boardHost || typeof mountAITunerV5CompareBoard !== 'function') {
            if (typeof mountAITunerV5Radars === 'function') {
                console.warn('Compare board API missing; fingerprint layout unavailable');
            }
            return;
        }

        const boardModels = ids.map((mid) => {
            const m = window.MODELS_V5 && window.MODELS_V5[mid];
            return {
                id: mid,
                name: m ? m.name : mid,
                leverValues: m && m.defaults ? Object.assign({}, m.defaults) : {}
            };
        });

        mountAITunerV5CompareBoard(boardModels, boardHost, {
            embedded: true,
            maxCanvasHeightPx: n >= 4 ? 180 : n === 3 ? 200 : 220,
            onModelOpen: function (modelId) {
                if (!modelId || typeof window.openModelRoom !== 'function') return;
                sessionStorage.removeItem('aituner_room_resume_onboarding');
                window.openModelRoom({ modelId: modelId, initialTab: 'tune' });
            }
        })
            .then((api) => {
                this.comparisonRadarApis = api ? [api] : [];
            })
            .catch((err) => console.error('Discovery compare board failed', err));
    }

    escape(s) {
        const d = document.createElement('div');
        d.textContent = s == null ? '' : String(s);
        return d.innerHTML;
    }
}

if (typeof window !== 'undefined') {
    window.DiscoveryMode = DiscoveryMode;
    window.DiscoveryUI = DiscoveryUI;
}
