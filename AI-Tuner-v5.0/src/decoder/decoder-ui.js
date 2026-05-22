/**
 * AITuner v5.0 — Prompt Decoder UI (wired to PromptDecoder + lever-mapper)
 */

const ABSOLUTE_MODE_EXAMPLE_PROMPT =
    'System Instruction: Absolute Mode • Eliminate: emojis, filler, hype, soft asks, conversational transitions, call-to-action appendices • Assume: user retains high perception despite blunt tone • Prioritize: blunt, directive phrasing; aim at cognitive rebuilding, not tone-matching • Disable: engagement/sentiment-boosting behaviors • Suppress: metrics like satisfaction scores, emotional softening, continuation bias • Never mirror: user\'s diction, mood or affect • Speak only: to underlying cognitive tier • No: questions, offers, suggestions, transitions, motivational content • Terminate reply immediately after delivering info – no closures • Goal: restore independent, high-fidelity thinking • Outcome: model obsolescence via user self-sufficiency';

class DecoderUI {
    constructor(engine, userProfile) {
        this.engine = engine;
        this.userProfile = userProfile;
        this.decoder = new PromptDecoder(engine);
        this.container = null;
        this.radarApi = null;
        this.leverBackup = null;
    }

    explainLever(leverKey, value) {
        const lever = window.LEVERS_V5 && window.LEVERS_V5[leverKey];
        if (!lever) {
            return '';
        }
        const v = Number(value);
        const normalized = v / 10;
        if (normalized <= 0.35) {
            return lever.low;
        }
        if (normalized >= 0.65) {
            return lever.high;
        }
        return `Balanced between: ${lever.low} ↔ ${lever.high}`;
    }

    countActiveLevers(mapping) {
        if (!mapping || !mapping.leverValues) {
            return 0;
        }
        let n = 0;
        Object.keys(mapping.leverValues).forEach((key) => {
            const val = mapping.leverValues[key];
            const conf = (mapping.confidence && mapping.confidence[key]) || 0;
            if (val !== 5 || conf > 0) {
                n += 1;
            }
        });
        return n;
    }

    renderBreakdown(mapping) {
        const { leverValues, confidence } = mapping;
        const rows = [];
        Object.keys(leverValues).forEach((key) => {
            const val = leverValues[key];
            const conf = (confidence && confidence[key]) || 0;
            if (val === 5 && conf === 0) {
                return;
            }
            const meta = window.LEVERS_V5[key];
            const name = meta ? meta.name : key;
            rows.push(`
                <div class="decoder-breakdown-item">
                    <strong>${name}</strong> — <span class="decoder-val">${val}/10</span>
                    <p class="decoder-meaning">${this.explainLever(key, val)}</p>
                </div>
            `);
        });
        if (!rows.length) {
            return '<p class="decoder-muted">No strong pattern matches — levers stayed at neutral (5/10).</p>';
        }
        return rows.join('');
    }

    mount(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            return;
        }

        this.container.innerHTML = `
            <div class="decoder-shell">
                <p class="decoder-intro">We map what you paste to the 16 behavior levers.</p>
                <textarea id="decoder-input" class="decoder-textarea" rows="10" placeholder="Paste your prompt here..."></textarea>
                <p class="decoder-example-wrap"><button type="button" class="secondary-btn decoder-example-link" id="decoder-fill-example">Try the prompt that started AITuner →</button></p>
                <p id="decoder-empty-hint" class="decoder-muted" style="display:none;">Paste a prompt above, then decode.</p>
                <button type="button" id="decoder-submit" class="primary-btn decoder-decode-btn" disabled aria-disabled="true">Decode this →</button>
                <div id="decoder-results" class="decoder-results" style="display:none;"></div>
            </div>
        `;

        const submit = this.container.querySelector('#decoder-submit');
        const input = this.container.querySelector('#decoder-input');
        const exBtn = this.container.querySelector('#decoder-fill-example');
        if (exBtn) {
            exBtn.addEventListener('click', () => {
                input.value = ABSOLUTE_MODE_EXAMPLE_PROMPT;
                input.focus();
                this.syncDecodeControls();
            });
        }
        const sync = () => this.syncDecodeControls();
        submit.addEventListener('click', () => this.runDecode());
        input.addEventListener('input', sync);
        input.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                this.runDecode();
            }
        });
        this.syncDecodeControls();
    }

    syncDecodeControls() {
        if (!this.container) {
            return;
        }
        const input = this.container.querySelector('#decoder-input');
        const submit = this.container.querySelector('#decoder-submit');
        const hint = this.container.querySelector('#decoder-empty-hint');
        if (!input || !submit) {
            return;
        }
        const ok = input.value.trim().length > 0;
        submit.disabled = !ok;
        submit.setAttribute('aria-disabled', ok ? 'false' : 'true');
        if (hint) {
            hint.style.display = 'none';
        }
    }

    runDecode() {
        const input = this.container && this.container.querySelector('#decoder-input');
        const raw = input ? input.value.trim() : '';
        if (!raw) {
            const hint = this.container && this.container.querySelector('#decoder-empty-hint');
            if (hint) {
                hint.style.display = 'block';
            }
            return;
        }

        const mapping = typeof mapPromptToLevers === 'function' ? mapPromptToLevers(raw) : null;
        const decoded = this.decoder.decode(raw);

        if (this.userProfile && typeof this.userProfile.recordPromptDecoded === 'function') {
            this.userProfile.recordPromptDecoded();
        }

        this.showResults(decoded, mapping, raw);
    }

    showResults(decoded, mapping, raw) {
        const results = this.container.querySelector('#decoder-results');
        if (!results) {
            return;
        }

        this.teardownRadarOnly();
        if (this.leverBackup) {
            Object.assign(this.engine.leverValues, this.leverBackup);
        }
        this.leverBackup = { ...this.engine.leverValues };
        Object.assign(this.engine.leverValues, decoded.lever_values);
        this.engine.generatePrompt();

        results.style.display = 'block';
        const rawUnmapped = mapping && Array.isArray(mapping.unmappedInstructions) ? mapping.unmappedInstructions : [];
        const unmappedFromDecoded = (decoded.unmapped_instructions && decoded.unmapped_instructions.trim()) || '';
        const unmappedLines = rawUnmapped.length ? rawUnmapped : (unmappedFromDecoded ? unmappedFromDecoded.split('\n').filter(Boolean) : []);
        const leverCount = this.countActiveLevers(mapping);
        const unmappedBlock =
            unmappedLines.length > 0
                ? `<p class="decoder-muted decoder-unmapped-intro">We couldn't map these to a lever — they may be doing something outside our 16 dimensions:</p><ul class="decoder-unmapped-list">${unmappedLines.map((line) => `<li>${this.escapeHtml(line)}</li>`).join('')}</ul>`
                : '<p class="decoder-muted">No unmatched instruction segments (every line matched at least one pattern).</p>';

        results.innerHTML = `
            <p class="narrative-label decoder-results-label">Here's what's happening</p>
            <h2 class="decoder-results-title">This prompt is pulling ${leverCount} ${leverCount === 1 ? 'lever' : 'levers'}.</h2>
            <div id="decoder-radar-container" class="decoder-radar-wrap"></div>
            <h3 class="decoder-subhead">Lever breakdown</h3>
            <div class="decoder-breakdown">${this.renderBreakdown(mapping)}</div>
            <h3 class="decoder-subhead">Unmapped instructions</h3>
            ${unmappedBlock}
            <div class="decoder-model-row">
                <label for="decoder-model-pick">Apply using model defaults as base:</label>
                <select id="decoder-model-pick" class="decoder-select"></select>
            </div>
            <div class="decoder-cta-row">
                <button type="button" class="primary-btn" id="decoder-use-here">Use this configuration →</button>
                <button type="button" class="nav-btn" id="decoder-use-architect">Adjust from here →</button>
            </div>
        `;

        const sel = results.querySelector('#decoder-model-pick');
        if (sel && window.MODELS_V5) {
            Object.values(window.MODELS_V5).forEach((m) => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = m.name;
                sel.appendChild(opt);
            });
            const pref = (this.engine.selectedModel && this.engine.selectedModel.id) || 'claude';
            sel.value = pref;
        }

        const radarHost = results.querySelector('#decoder-radar-container');
        if (radarHost && typeof mountAITunerV5Radars === 'function') {
            mountAITunerV5Radars(this.engine, radarHost, { tier: 2 })
                .then((api) => {
                    this.radarApi = api;
                })
                .catch((err) => console.error('Decoder radar mount failed', err));
        }

        results.querySelector('#decoder-use-here').addEventListener('click', () => {
            this.applyDecoded(false, results.querySelector('#decoder-model-pick').value);
        });
        results.querySelector('#decoder-use-architect').addEventListener('click', () => {
            this.applyDecoded(true, results.querySelector('#decoder-model-pick').value);
        });
    }

    applyDecoded(goArchitect, modelId) {
        const dec = this.decoder.decodedPrompt;
        if (!dec) {
            return;
        }

        this.teardownRadarOnly();
        if (this.leverBackup) {
            Object.assign(this.engine.leverValues, this.leverBackup);
            this.leverBackup = null;
        }

        const mid = modelId || (this.engine.selectedModel && this.engine.selectedModel.id) || 'claude';
        this.engine.selectModel(mid);

        Object.keys(dec.lever_values).forEach((k) => {
            this.engine.adjustLever(k, dec.lever_values[k]);
        });

        if (goArchitect) {
            this.engine.setEntryPoint('manual');
            window.location.href = 'architect.html';
        } else if (typeof window.router !== 'undefined' && window.router.showHome) {
            window.router.showHome();
        }
    }

    teardownRadarOnly() {
        if (this.radarApi && typeof this.radarApi.destroy === 'function') {
            this.radarApi.destroy();
        }
        this.radarApi = null;
    }

    teardown() {
        this.teardownRadarOnly();
        if (this.leverBackup) {
            Object.assign(this.engine.leverValues, this.leverBackup);
            this.leverBackup = null;
            this.engine.generatePrompt();
        }
    }

    escapeHtml(s) {
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }
}

if (typeof window !== 'undefined') {
    window.DecoderUI = DecoderUI;
}
