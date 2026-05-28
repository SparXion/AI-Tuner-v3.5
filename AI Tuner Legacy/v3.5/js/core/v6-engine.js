/**
 * AI Tuner v3.0 - Core Engine
 * Handles model selection, persona selection, lever management, and prompt generation
 */

class AITunerV6 {
    constructor() {
        try {
            console.log('AITunerV6: Starting initialization...');
            this.selectedModel = null;
            this.selectedPersona = null;
            this.levers = {};
            this.webTuners = window.WEB_TUNER_CONFIG || {};
            this.pendingRadarLevers = {};
            this.radarApplyTimeouts = {};
            this.leverToTuners = {};
            this.mode = 'advanced'; // default to full control mode
            this.emojiShutoff = false; // Emergency emoji shutoff toggle

            Object.entries(this.webTuners).forEach(([tunerKey, cfg]) => {
                this.pendingRadarLevers[tunerKey] = {};
                cfg.leverKeys.forEach(leverKey => {
                    if (!this.leverToTuners[leverKey]) {
                        this.leverToTuners[leverKey] = new Set();
                    }
                    this.leverToTuners[leverKey].add(tunerKey);
                });
            });
            
            // Check dependencies
            if (!window.LEVERS_V6) {
                console.error('LEVERS_V6 not found!');
                throw new Error('Levers data not loaded');
            }
            if (!window.MODELS_V6) {
                console.error('MODELS_V6 not found!');
                throw new Error('Models data not loaded');
            }
            if (!window.PERSONAS_V6) {
                console.error('PERSONAS_V6 not found!');
                throw new Error('Personas data not loaded');
            }
            if (typeof Chart === 'undefined') {
                console.error('Chart.js not found!');
                throw new Error('Chart.js library not loaded');
            }
            
            this.initializeLevers();
            this.initializeElements();
            this.loadModePreference();
            this.loadEmojiShutoffPreference();
            this.renderModelSelector();
            this.renderPersonaSelector();
            this.renderLevers();
            this.setupEventListeners();
            this.updateRadarPendingUI();
            this.loadDarkModePreference();
            this.updateModeUI();
            
            // Initialize radar chart and prompt with error handling
            setTimeout(() => {
                try {
                    this.generatePrompt();
                    console.log('AITunerV6: Initialization complete');
                } catch (error) {
                    console.error('AITunerV6: Error generating prompt:', error);
                }
            }, 100); // Small delay to ensure DOM is ready
        } catch (error) {
            console.error('AITunerV6: Initialization error:', error);
            throw error; // Re-throw to be caught by parent
        }
    }

    initializeLevers() {
        // Initialize all levers to middle value (5)
        if (window.LEVERS_V6) {
            Object.keys(window.LEVERS_V6).forEach(leverKey => {
                this.levers[leverKey] = 5;
            });
        }
    }

    // Essential levers for Beginner mode (user-friendly, impactful)
    getBeginnerLevers() {
        return [
            'hedgingIntensity',      // Most common frustration
            'empathyExpressiveness', // Emotional connection
            'formality',             // Easy to understand
            'conciseness',           // Verbosity is major issue
            'proactivityLevel',      // Engagement level
            'citationRigidity',      // Fact-checking
            'playfulness',           // Personality
            'teachingMode',          // Helpfulness
            'creativity',            // Content generation
            'answerCompleteness',    // Depth vs brevity
            'assertiveness',         // Confidence level
            'responseDirectness'     // Directness
        ];
    }

    initializeElements() {
        this.elements = {
            modelSelector: document.getElementById('model-selector'),
            personaSelector: document.getElementById('persona-selector'),
            controlsSection: document.getElementById('controls-section'),
            preview: document.getElementById('prompt-preview'),
            copyBtn: document.getElementById('copy-prompt'),
            savePresetBtn: document.getElementById('save-preset'),
            downloadJsonBtn: document.getElementById('download-json'),
            downloadMarkdownBtn: document.getElementById('download-markdown'),
            uploadBtn: document.getElementById('upload-config'),
            fileInput: document.getElementById('file-input'),
            infoOverlay: document.getElementById('info-overlay'),
            infoTitle: document.getElementById('info-title'),
            infoContent: document.getElementById('info-content'),
            infoClose: document.getElementById('info-close'),
            darkModeToggle: document.getElementById('dark-mode-toggle'),
            darkModeText: document.getElementById('dark-mode-text'),
            emojiShutoffToggle: document.getElementById('emoji-shutoff-toggle'),
            emojiShutoffText: document.getElementById('emoji-shutoff-text'),
            modeBeginner: document.getElementById('mode-beginner'),
            modeAdvanced: document.getElementById('mode-advanced'),
            modeSubtitle: document.getElementById('mode-subtitle'),
            appInfoToggle: document.getElementById('app-info-toggle'),
            appInfoContent: document.getElementById('app-info-content')
        };

        this.tunerElements = {};
        Object.entries(this.webTuners).forEach(([tunerKey, cfg]) => {
            this.tunerElements[tunerKey] = {
                applyBtn: cfg.applyButtonId ? document.getElementById(cfg.applyButtonId) : null,
                pendingIndicator: cfg.indicatorId ? document.getElementById(cfg.indicatorId) : null,
                card: document.querySelector(`.web-tuner-card[data-tuner="${tunerKey}"]`)
            };
        });
    }

    renderModelSelector() {
        if (!this.elements.modelSelector || !window.AI_MODELS_V6) return;

        this.elements.modelSelector.innerHTML = '';
        
        Object.keys(window.AI_MODELS_V6).forEach(modelKey => {
            const model = window.AI_MODELS_V6[modelKey];
            const card = document.createElement('div');
            card.className = 'model-card';
            card.dataset.model = modelKey;
            card.innerHTML = `
                <div class="model-name">${model.name}</div>
                <div class="model-desc">${model.description}</div>
            `;
            card.addEventListener('click', () => this.selectModel(modelKey));
            this.elements.modelSelector.appendChild(card);
        });
    }

    renderPersonaSelector() {
        if (!this.elements.personaSelector || !window.PERSONAS_V6) return;

        this.elements.personaSelector.innerHTML = '';
        
        // Show all personas together (no tabs - all are "hidden modes")
        const personas = Object.entries(window.PERSONAS_V6);
        
        // Sort: show most common first (therapist, truth-seeker, coder, etc.)
        const sortedPersonas = personas.sort((a, b) => {
            // Core personas first, then hidden modes (for logical grouping)
            const typeA = a[1].type || 'core';
            const typeB = b[1].type || 'core';
            if (typeA === 'core' && typeB === 'hidden') return -1;
            if (typeA === 'hidden' && typeB === 'core') return 1;
            return 0;
        });
        
        sortedPersonas.forEach(([personaKey, persona]) => {
            const card = document.createElement('div');
            card.className = 'persona-card';
            card.dataset.persona = personaKey;
            card.innerHTML = `
                <div class="persona-name">${persona.name}</div>
                <div class="persona-desc">${persona.description}</div>
            `;
            card.addEventListener('click', () => this.selectPersona(personaKey));
            this.elements.personaSelector.appendChild(card);
        });
    }

    renderLevers() {
        if (!this.elements.controlsSection || !window.LEVERS_V6) return;

        // Filter levers based on mode
        const beginnerLevers = this.getBeginnerLevers();
        const allLevers = Object.keys(window.LEVERS_V6);
        const visibleLevers = this.mode === 'beginner' 
            ? allLevers.filter(key => beginnerLevers.includes(key))
            : allLevers;

        // Organize levers by category
        const leversByCategory = {};
        visibleLevers.forEach(leverKey => {
            const lever = window.LEVERS_V6[leverKey];
            const category = lever.category || 'Other';
            if (!leversByCategory[category]) {
                leversByCategory[category] = [];
            }
            leversByCategory[category].push({ key: leverKey, ...lever });
        });

        // Render categories
        this.elements.controlsSection.innerHTML = '';
        
        const categoryOrder = [
            'Personality & Approach',
            'Cognition & Logic',
            'Affect & Tone',
            'Interface & Flow',
            'Behavioral Controls',
            'Goal Orientation',
            'Truth & Epistemology',
            'Humor & Meta',
            'Knowledge & Tool Use',
            'Empathy & Expressiveness',
            'Formatting & Output',
            'Adaptivity & Technicality'
        ];

        categoryOrder.forEach(categoryName => {
            if (leversByCategory[categoryName]) {
                const categoryGroup = document.createElement('div');
                categoryGroup.className = 'category-group-v6';
                // Normalize category name for data attribute (handle special characters)
                const categoryId = categoryName.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/&/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                
                categoryGroup.innerHTML = `
                    <h2>
                        ${categoryName}
                        <span class="info-btn" data-category="${categoryId}">ℹ</span>
                    </h2>
                `;

                const leversContainer = document.createElement('div');
                leversContainer.className = 'levers-container';

                leversByCategory[categoryName].forEach(lever => {
                    const leverControl = this.createLeverControl(lever);
                    leversContainer.appendChild(leverControl);
                });

                categoryGroup.appendChild(leversContainer);
                this.elements.controlsSection.appendChild(categoryGroup);
            }
        });

        // Add beginner mode message if applicable
        if (this.mode === 'beginner' && this.elements.controlsSection) {
            const beginnerMessage = document.createElement('div');
            beginnerMessage.className = 'beginner-mode-message';
            beginnerMessage.innerHTML = `
                <div style="padding: 20px; border: 2px solid #4caf50; background: #e8f5e8; border-radius: 4px; margin-top: 20px;">
                    <strong>✨ Beginner Mode Active</strong>
                    <p style="margin: 10px 0 0 0; font-size: 0.9rem; color: #333;">
                        You're seeing 12 essential levers. Switch to <strong>Advanced</strong> mode (top left) to unlock all 26 tuning levers for complete control.
                    </p>
                </div>
            `;
            this.elements.controlsSection.appendChild(beginnerMessage);
        }
    }

    createLeverControl(lever) {
        const control = document.createElement('div');
        control.className = 'lever-control';
        control.dataset.lever = lever.key;

        const currentValue = this.levers[lever.key] || 5;
        const range = lever.defaultRange || { min: 0, max: 10 };

        control.innerHTML = `
            <div class="lever-header">
                <span class="lever-label">${lever.name}</span>
                <span class="lever-value" id="lever-value-${lever.key}">${currentValue}</span>
            </div>
            <div class="lever-description">${lever.description}</div>
            <div class="lever-range">
                <input 
                    type="range" 
                    class="lever-slider" 
                    id="lever-${lever.key}"
                    min="${range.min}" 
                    max="${range.max}" 
                    value="${currentValue}"
                    step="1"
                />
            </div>
            <div class="lever-min-max">
                <span class="lever-min">${lever.low}</span>
                <span class="lever-max">${lever.high}</span>
            </div>
        `;

        // Add event listener
        const slider = control.querySelector('.lever-slider');
        slider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value, 10);
            if (!Number.isFinite(value)) {
                return;
            }

            this.levers[lever.key] = value;
            const valueLabel = document.getElementById(`lever-value-${lever.key}`);
            if (valueLabel) {
                valueLabel.textContent = value;
            }

            const tunerKeys = this.leverToTuners[lever.key] ? Array.from(this.leverToTuners[lever.key]) : [];
            tunerKeys.forEach(tunerKey => {
                if (this.pendingRadarLevers[tunerKey] && Object.prototype.hasOwnProperty.call(this.pendingRadarLevers[tunerKey], lever.key)) {
                    delete this.pendingRadarLevers[tunerKey][lever.key];
                }
            });

            this.generatePrompt(); // This will update the radar chart
            this.updateRadarPendingUI();
        });

        // Check if lever is locked for selected model
        if (lever.locked && lever.locked.includes(this.selectedModel)) {
            slider.disabled = true;
            slider.style.opacity = '0.5';
            control.style.opacity = '0.7';
        }

        return control;
    }

    queueLeverFromRadar(tunerKey, leverKey, value) {
        if (!leverKey || !tunerKey) return;
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) return;

        const clamped = Math.max(0, Math.min(10, Math.round(numericValue)));
        if (!this.pendingRadarLevers[tunerKey]) {
            this.pendingRadarLevers[tunerKey] = {};
        }
        this.pendingRadarLevers[tunerKey][leverKey] = clamped;

        const slider = document.getElementById(`lever-${leverKey}`);
        if (slider) {
            slider.value = clamped;
        }

        const valueLabel = document.getElementById(`lever-value-${leverKey}`);
        if (valueLabel) {
            valueLabel.textContent = clamped;
        }

        this.updateRadarPendingUI(tunerKey);
    }

    applyPendingRadarLevers(tunerKey) {
        if (!tunerKey) return;
        const pending = this.pendingRadarLevers[tunerKey];
        if (!pending) {
            this.pendingRadarLevers[tunerKey] = {};
            return;
        }

        const entries = Object.entries(pending);
        if (!entries.length) {
            return;
        }

        entries.forEach(([leverKey, val]) => {
            const numeric = Number(val);
            if (!Number.isFinite(numeric)) return;
            const clamped = Math.max(0, Math.min(10, Math.round(numeric)));
            this.levers[leverKey] = clamped;

            const slider = document.getElementById(`lever-${leverKey}`);
            if (slider) {
                slider.value = clamped;
            }

            const valueLabel = document.getElementById(`lever-value-${leverKey}`);
            if (valueLabel) {
                valueLabel.textContent = clamped;
            }
        });

        this.pendingRadarLevers[tunerKey] = {};
        this.generatePrompt();
        this.updateRadarPendingUI(tunerKey);

        const tunerEls = this.tunerElements[tunerKey];
        if (tunerEls && tunerEls.applyBtn) {
            const btn = tunerEls.applyBtn;
            const baseLabel = btn.dataset.originalLabel || btn.textContent || 'Apply Changes';
            btn.dataset.originalLabel = baseLabel;
            btn.disabled = true;
            btn.textContent = 'Applied';
            btn.dataset.status = 'applied';
            if (this.radarApplyTimeouts[tunerKey]) {
                clearTimeout(this.radarApplyTimeouts[tunerKey]);
            }
            this.radarApplyTimeouts[tunerKey] = setTimeout(() => {
                btn.dataset.status = 'ready';
                btn.textContent = btn.dataset.originalLabel || baseLabel;
                this.updateRadarPendingUI(tunerKey);
            }, 1500);
        }
    }

    clearPendingRadarState(tunerKey) {
        if (!this.pendingRadarLevers) {
            this.pendingRadarLevers = {};
        }

        if (tunerKey) {
            this.pendingRadarLevers[tunerKey] = {};
            this.updateRadarPendingUI(tunerKey);
            return;
        }

        Object.keys(this.pendingRadarLevers).forEach(key => {
            this.pendingRadarLevers[key] = {};
        });
        this.updateRadarPendingUI();
    }

    getLeverValueForRadar(tunerKey, leverKey, fallback = 5) {
        if (!leverKey) return fallback;
        if (tunerKey && this.pendingRadarLevers && this.pendingRadarLevers[tunerKey] && Object.prototype.hasOwnProperty.call(this.pendingRadarLevers[tunerKey], leverKey)) {
            return this.pendingRadarLevers[tunerKey][leverKey];
        }
        if (this.levers && Object.prototype.hasOwnProperty.call(this.levers, leverKey)) {
            const official = this.levers[leverKey];
            return official === undefined || official === null ? fallback : official;
        }
        return fallback;
    }

    updateRadarPendingUI(tunerKey) {
        const updateKeys = tunerKey ? [tunerKey] : Object.keys(this.webTuners);

        updateKeys.forEach(key => {
            const pending = this.pendingRadarLevers[key] || {};
            const count = Object.keys(pending).length;
            const els = this.tunerElements[key] || {};
            const btn = els.applyBtn;
            const indicator = els.pendingIndicator;
            const card = els.card;

            if (btn) {
                const baseLabel = btn.dataset.originalLabel || btn.textContent || 'Apply Changes';
                if (!btn.dataset.originalLabel) {
                    btn.dataset.originalLabel = baseLabel;
                }
                if (count > 0) {
                    btn.disabled = false;
                    btn.dataset.status = 'pending';
                    btn.textContent = count > 1 ? `${baseLabel} (${count})` : baseLabel;
                } else {
                    btn.disabled = true;
                    if (btn.dataset.status !== 'applied') {
                        btn.textContent = baseLabel;
                        btn.dataset.status = 'ready';
                    }
                }
            }

            if (indicator) {
                indicator.textContent = count
                    ? `${count} pending change${count === 1 ? '' : 's'}`
                    : '';
            }

            if (card) {
                card.classList.toggle('pending', count > 0);
            }
        });
    }

    selectModel(modelKey) {
        this.selectedModel = modelKey;
        this.clearPendingRadarState();
        
        // Update UI
        document.querySelectorAll('.model-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-model="${modelKey}"]`)?.classList.add('selected');

        // Load model defaults
        if (window.AI_MODELS_V6[modelKey]) {
            const defaults = window.AI_MODELS_V6[modelKey].defaults;
            Object.keys(defaults).forEach(leverKey => {
                this.levers[leverKey] = defaults[leverKey];
                const slider = document.getElementById(`lever-${leverKey}`);
                if (slider) {
                    slider.value = defaults[leverKey];
                    document.getElementById(`lever-value-${leverKey}`).textContent = defaults[leverKey];
                }
            });
        }

        this.generatePrompt();
    }

    selectPersona(personaKey) {
        this.selectedPersona = personaKey;
        this.clearPendingRadarState();
        
        // Update UI
        document.querySelectorAll('.persona-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-persona="${personaKey}"]`)?.classList.add('selected');

        // Apply persona lever values
        if (window.PERSONAS_V6[personaKey]) {
            const personaLevers = window.PERSONAS_V6[personaKey].levers;
            Object.keys(personaLevers).forEach(leverKey => {
                this.levers[leverKey] = personaLevers[leverKey];
                const slider = document.getElementById(`lever-${leverKey}`);
                if (slider) {
                    slider.value = personaLevers[leverKey];
                    document.getElementById(`lever-value-${leverKey}`).textContent = personaLevers[leverKey];
                }
            });
        }

        this.generatePrompt();
    }

    generatePrompt() {
        const prompt = this.buildPrompt();
        if (this.elements.preview) {
            // Remove placeholder if it exists
            const placeholder = this.elements.preview.querySelector('.placeholder-text');
            if (placeholder) {
                placeholder.remove();
            }
            
            if (prompt && prompt.trim()) {
                this.elements.preview.textContent = prompt;
            } else {
                this.elements.preview.innerHTML = '<p class="placeholder-text">← Start by selecting a model (Step 1)</p>';
            }
        }

        // Update radar chart - ALWAYS use v6 version for v3.0
        if (typeof drawRadarV6 === 'function') {
            drawRadarV6(this.levers);
        } else {
            console.error('drawRadarV6 function not found! Make sure radar.js is loaded.');
        }
    }

    buildPrompt() {
        let prompt = '';

        // Add model context if selected
        if (this.selectedModel && window.AI_MODELS_V6[this.selectedModel]) {
            const model = window.AI_MODELS_V6[this.selectedModel];
            prompt += `You are ${model.name}. ${model.description}.\n\n`;
        }

        // Add persona context if selected
        if (this.selectedPersona && window.PERSONAS_V6[this.selectedPersona]) {
            const persona = window.PERSONAS_V6[this.selectedPersona];
            prompt += `${persona.activationSnippet}\n\n`;
        }

        // Emergency emoji shutoff
        if (this.emojiShutoff) {
            prompt += 'Critical Instructions:\n';
            prompt += '• Eliminate emojis completely\n';
            prompt += '• Eliminate filler words (like, um, well, etc.)\n';
            prompt += '• Eliminate hype language and marketing speak\n';
            prompt += '• Be direct and factual only\n\n';
        }

        // Add lever-based instructions
        prompt += 'Tuning Parameters:\n';
        prompt += '---\n';

        if (window.LEVERS_V6) {
            Object.keys(this.levers).forEach(leverKey => {
                const lever = window.LEVERS_V6[leverKey];
                const value = this.levers[leverKey];
                if (lever && value !== undefined) {
                    const normalizedValue = value / 10;
                    let instruction = '';

                    if (normalizedValue <= 0.3) {
                        instruction = lever.low;
                    } else if (normalizedValue >= 0.7) {
                        instruction = lever.high;
                    } else {
                        instruction = `Moderate: ${lever.low} to ${lever.high}`;
                    }

                    prompt += `- ${lever.name}: ${instruction} (${value}/10)\n`;
                }
            });
        }

        return prompt;
    }

    getCurrentSettings() {
        return {
            model: this.selectedModel,
            persona: this.selectedPersona,
            levers: { ...this.levers }
        };
    }

    setupEventListeners() {
        // Copy button
        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', () => this.copyPrompt());
        }

        Object.entries(this.tunerElements).forEach(([tunerKey, els]) => {
            if (els.applyBtn) {
                els.applyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.applyPendingRadarLevers(tunerKey);
                });
            }
        });

        // Save preset button
        if (this.elements.savePresetBtn) {
            this.elements.savePresetBtn.addEventListener('click', () => this.savePreset());
        }

        // Download buttons
        if (this.elements.downloadJsonBtn) {
            this.elements.downloadJsonBtn.addEventListener('click', () => this.downloadJSON());
        }

        if (this.elements.downloadMarkdownBtn) {
            this.elements.downloadMarkdownBtn.addEventListener('click', () => this.downloadMarkdown());
        }

        // Upload button
        if (this.elements.uploadBtn) {
            this.elements.uploadBtn.addEventListener('click', () => this.elements.fileInput?.click());
        }

        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', (e) => this.uploadConfig(e));
        }

        // Info overlay
        if (this.elements.infoClose) {
            this.elements.infoClose.addEventListener('click', () => this.hideInfo());
        }

        if (this.elements.infoOverlay) {
            this.elements.infoOverlay.addEventListener('click', (e) => {
                if (e.target === this.elements.infoOverlay) {
                    this.hideInfo();
                }
            });
        }

        // Info button handlers - use event delegation
        document.addEventListener('click', (e) => {
            const tunerInfoBtn = e.target.closest('.info-btn-tuner');
            if (tunerInfoBtn && tunerInfoBtn.dataset.tuner) {
                e.preventDefault();
                const tuner = tunerInfoBtn.dataset.tuner;
                this.showTunerInfo(tuner);
                return;
            }

            // Handle category info buttons
            const infoBtn = e.target.closest('.info-btn');
            if (infoBtn && infoBtn.dataset.category) {
                e.preventDefault();
                const category = infoBtn.dataset.category;
                this.showInfo(category);
                return;
            }
            
            // Handle step info buttons
            const stepInfoBtn = e.target.closest('.info-btn-step');
            if (stepInfoBtn && stepInfoBtn.dataset.step) {
                e.preventDefault();
                const step = stepInfoBtn.dataset.step;
                this.showStepInfo(step);
                return;
            }
        });

        // Dark mode toggle
        if (this.elements.darkModeToggle) {
            this.elements.darkModeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleDarkMode();
            });
        }

        // Emoji shutoff toggle
        if (this.elements.emojiShutoffToggle) {
            this.elements.emojiShutoffToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleEmojiShutoff();
            });
        }

        // App info toggle
        if (this.elements.appInfoToggle) {
            this.elements.appInfoToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAppInfo();
            });
        }

        // Mode toggle boxes
        if (this.elements.modeBeginner) {
            this.elements.modeBeginner.addEventListener('click', () => {
                if (this.mode !== 'beginner') {
                    this.toggleMode();
                }
            });
        }

        if (this.elements.modeAdvanced) {
            this.elements.modeAdvanced.addEventListener('click', () => {
                if (this.mode !== 'advanced') {
                    this.toggleMode();
                }
            });
        }

        // Load and render saved presets on initialization
        this.loadAndRenderSavedPresets();
    }

    toggleMode() {
        this.mode = 'advanced';
        try {
            localStorage.setItem('aiTunerMode', 'advanced');
        } catch (err) {
            console.warn('Unable to persist mode preference:', err);
        }
        this.clearPendingRadarState();
        this.renderLevers();
        this.generatePrompt();
        this.updateModeUI();
    }

    loadModePreference() {
        this.mode = 'advanced';
        try {
            localStorage.setItem('aiTunerMode', 'advanced');
        } catch (err) {
            console.warn('Unable to persist mode preference:', err);
        }
    }

    updateModeUI() {
        document.body.classList.remove('beginner-mode', 'advanced-mode');
        document.body.classList.add('advanced-mode');

        if (this.elements.modeSubtitle) {
            this.elements.modeSubtitle.textContent = 'Customize AI behavior with precision controls';
        }
    }

    copyPrompt() {
        const prompt = this.buildPrompt();
        navigator.clipboard.writeText(prompt).then(() => {
            if (this.elements.copyBtn) {
                const originalText = this.elements.copyBtn.textContent;
                this.elements.copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    this.elements.copyBtn.textContent = originalText;
                }, 2000);
            }
        });
    }

    downloadJSON() {
        const settings = this.getCurrentSettings();
        const json = JSON.stringify(settings, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-tuner-v3-config-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    downloadMarkdown() {
        const prompt = this.buildPrompt();
        const blob = new Blob([prompt], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-tuner-v3-prompt-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    uploadConfig(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                this.loadConfig(config);
            } catch (error) {
                alert('Error loading config: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    loadConfig(config) {
        if (config.model) {
            this.selectModel(config.model);
        }
        if (config.persona) {
            this.selectPersona(config.persona);
        }
        if (config.levers) {
            Object.keys(config.levers).forEach(leverKey => {
                this.levers[leverKey] = config.levers[leverKey];
                const slider = document.getElementById(`lever-${leverKey}`);
                if (slider) {
                    slider.value = config.levers[leverKey];
                    document.getElementById(`lever-value-${leverKey}`).textContent = config.levers[leverKey];
                }
            });
        }
        this.generatePrompt();
    }

    savePreset() {
        const presetName = prompt('Enter a name for your preset:');
        if (!presetName || typeof presetName !== 'string' || presetName.trim() === '') {
            return;
        }
        
        // Sanitize preset name - remove dangerous characters
        const sanitizedName = presetName.trim().replace(/[<>:"/\\|?*]/g, '');
        if (sanitizedName !== presetName.trim()) {
            alert('Preset name contains invalid characters. It has been sanitized.');
        }
        
        const finalName = sanitizedName || presetName.trim();
        // Only save lever settings, not model or persona
        const settings = {
            levers: { ...this.levers }
        };
        const presetKey = finalName.toLowerCase().replace(/\s+/g, '_');
        
        // Load existing presets
        let presets = {};
        const savedPresets = localStorage.getItem('ai_tuner_presets_v6');
        if (savedPresets) {
            try {
                presets = JSON.parse(savedPresets);
            } catch (e) {
                console.error('Error loading presets:', e);
            }
        }
        
        // Save new preset
        presets[presetKey] = {
            name: finalName,
            settings: settings,
            createdAt: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('ai_tuner_presets_v6', JSON.stringify(presets));
        
        // Update button text
        if (this.elements.savePresetBtn) {
            const originalText = this.elements.savePresetBtn.textContent;
            this.elements.savePresetBtn.textContent = 'Saved!';
            setTimeout(() => {
                this.elements.savePresetBtn.textContent = originalText;
            }, 2000);
        }
        
        alert(`Preset "${finalName}" saved successfully!`);
        
        // Re-render saved presets
        this.loadAndRenderSavedPresets();
    }

    loadAndRenderSavedPresets() {
        const container = document.getElementById('saved-presets-container');
        const mobileContainer = document.getElementById('saved-presets-container-mobile');
        const containers = [container, mobileContainer].filter(c => c !== null);

        // Load presets from localStorage
        let presets = {};
        const savedPresets = localStorage.getItem('ai_tuner_presets_v6');
        if (savedPresets) {
            try {
                presets = JSON.parse(savedPresets);
            } catch (e) {
                console.error('Error loading presets:', e);
            }
        }

        const presetKeys = Object.keys(presets);
        
        // Render to all containers
        containers.forEach(cont => {
            // Clear container
            cont.innerHTML = '';

            if (presetKeys.length === 0) {
                const message = document.createElement('p');
                message.className = 'no-presets-message';
                message.style.cssText = 'color: #999; font-style: italic; margin: 0; font-size: 0.9rem;';
                message.textContent = 'No saved presets yet. Create one using "Save Preset" button.';
                cont.appendChild(message);
                return;
            }

            // Create preset buttons
            presetKeys.forEach(presetKey => {
                const preset = presets[presetKey];
                const button = document.createElement('button');
                button.className = 'preset-btn-header';
                button.textContent = preset.name || presetKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                button.addEventListener('click', () => {
                    this.loadPreset(presetKey);
                });
                
                // Add delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'preset-delete-btn-header';
                deleteBtn.innerHTML = '×';
                deleteBtn.title = 'Delete preset';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`Delete preset "${preset.name || presetKey}"?`)) {
                        delete presets[presetKey];
                        localStorage.setItem('ai_tuner_presets_v6', JSON.stringify(presets));
                        this.loadAndRenderSavedPresets();
                    }
                });

                const wrapper = document.createElement('div');
                wrapper.className = 'preset-item-header';
                wrapper.appendChild(button);
                wrapper.appendChild(deleteBtn);
                cont.appendChild(wrapper);
            });
        });
    }

    loadPreset(presetKey) {
        const savedPresets = localStorage.getItem('ai_tuner_presets_v6');
        if (!savedPresets) return;

        try {
            const presets = JSON.parse(savedPresets);
            const preset = presets[presetKey];
            if (!preset || !preset.settings) return;

            // Only load lever settings, not model or persona
            // Preserve current model and persona selections
            if (preset.settings.levers) {
                this.clearPendingRadarState();
                Object.keys(preset.settings.levers).forEach(leverKey => {
                    this.levers[leverKey] = preset.settings.levers[leverKey];
                    const slider = document.getElementById(`lever-${leverKey}`);
                    if (slider) {
                        slider.value = preset.settings.levers[leverKey];
                        const valueDisplay = document.getElementById(`lever-value-${leverKey}`);
                        if (valueDisplay) {
                            valueDisplay.textContent = preset.settings.levers[leverKey];
                        }
                    }
                });
                this.generatePrompt();
            }
        } catch (e) {
            console.error('Error loading preset:', e);
            alert('Error loading preset');
        }
    }

    toggleDarkMode() {
        const wasDark = document.body.classList.contains('dark-mode');
        const isDark = !wasDark;
        
        // Explicitly set or remove class
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Save preference
        localStorage.setItem('aiTunerDarkMode', isDark);
        
        // Update button text
        if (this.elements.darkModeText) {
            this.elements.darkModeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }
        
        // Force re-render of radar chart with new colors
        if (typeof drawRadarV6 === 'function' && this.levers) {
            setTimeout(() => {
                drawRadarV6(this.levers);
            }, 50);
        }
    }

    loadDarkModePreference() {
        const isDark = localStorage.getItem('aiTunerDarkMode') === 'true';
        // Explicitly set or remove dark mode class
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        // Update button text
        if (this.elements.darkModeText) {
            this.elements.darkModeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }
        // Force a re-render of radar chart if it exists
        if (typeof drawRadarV6 === 'function' && this.levers && Object.keys(this.levers).length > 0) {
            setTimeout(() => {
                drawRadarV6(this.levers);
            }, 50);
        }
    }

    toggleEmojiShutoff() {
        this.emojiShutoff = !this.emojiShutoff;
        localStorage.setItem('aiTunerEmojiShutoff', this.emojiShutoff);
        this.updateEmojiShutoffUI();
        this.generatePrompt();
    }

    loadEmojiShutoffPreference() {
        const isEnabled = localStorage.getItem('aiTunerEmojiShutoff') === 'true';
        this.emojiShutoff = isEnabled;
        this.updateEmojiShutoffUI();
    }

    updateEmojiShutoffUI() {
        if (this.elements.emojiShutoffText) {
            if (this.emojiShutoff) {
                this.elements.emojiShutoffText.textContent = 'No Emojis!';
                if (this.elements.emojiShutoffToggle) {
                    this.elements.emojiShutoffToggle.style.background = '#000';
                    this.elements.emojiShutoffToggle.style.color = '#fff';
                }
            } else {
                this.elements.emojiShutoffText.textContent = 'No Emojis!';
                if (this.elements.emojiShutoffToggle) {
                    this.elements.emojiShutoffToggle.style.background = '';
                    this.elements.emojiShutoffToggle.style.color = '';
                }
            }
        }
    }

    toggleAppInfo() {
        if (!this.elements.appInfoToggle || !this.elements.appInfoContent) return;
        
        const isExpanded = this.elements.appInfoContent.classList.contains('expanded');
        
        if (isExpanded) {
            this.elements.appInfoContent.classList.remove('expanded');
            this.elements.appInfoToggle.classList.remove('expanded');
        } else {
            this.elements.appInfoContent.classList.add('expanded');
            this.elements.appInfoToggle.classList.add('expanded');
        }
    }

    hideInfo() {
        if (this.elements.infoOverlay) {
            this.elements.infoOverlay.style.display = 'none';
        }
    }

    showTunerInfo(tunerKey) {
        if (!this.elements.infoOverlay || !this.elements.infoTitle || !this.elements.infoContent) return;

        const config = this.webTuners?.[tunerKey];
        if (!config) return;

        const title = config.title || tunerKey.replace(/-/g, ' ');
        const subtitle = config.subtitle || '';

        const leverDetails = (config.leverKeys || []).map((leverKey, index) => {
            const leverMeta = window.LEVERS_V6?.[leverKey] || {};
            const label = (config.labels && config.labels[index]) || leverMeta.name || leverKey;
            const description = leverMeta.description || '';
            const low = leverMeta.low || '';
            const high = leverMeta.high || '';
            return { label, description, low, high };
        });

        let content = '';
        if (subtitle) {
            content += `<p class="tuner-info__intro">${subtitle}</p>`;
        }

        if (leverDetails.length) {
            content += '<ul class="tuner-info-list">';
            leverDetails.forEach(detail => {
                content += `
                    <li>
                        <strong>${detail.label}</strong>
                        ${detail.description ? `<p>${detail.description}</p>` : ''}
                        ${(detail.low || detail.high) ? `
                            <div class="tuner-info-extremes">
                                ${detail.low ? `<span><em>Low:</em> ${detail.low}</span>` : ''}
                                ${detail.high ? `<span><em>High:</em> ${detail.high}</span>` : ''}
                            </div>
                        ` : ''}
                    </li>
                `;
            });
            content += '</ul>';
        } else {
            content += '<p>No levers are currently mapped to this tuner.</p>';
        }

        this.elements.infoTitle.textContent = `${title} Web Tuner`;
        this.elements.infoContent.innerHTML = content;
        this.elements.infoOverlay.style.display = 'flex';
    }

    showStepInfo(step) {
        if (!this.elements.infoOverlay) return;

        const stepInfo = {
            '1': {
                title: 'Step 1: Choose Your AI Model',
                content: `
                    <h4>Understanding Model Personas</h4>
                    <p>Each AI model has its own default personality and behavior patterns:</p>
                    <ul>
                        <li><strong>Grok</strong>: Truth-seeking, identity-locked, subtly witty</li>
                        <li><strong>Gemini</strong>: Balanced, helpful, structured</li>
                        <li><strong>Claude</strong>: Warm, thoughtful, collaborative</li>
                        <li><strong>ChatGPT</strong>: Conversational, versatile, engaging</li>
                        <li><strong>Perplexity</strong>: Research-focused, citation-heavy</li>
                        <li><strong>Mistral</strong>: Technical, direct, efficient</li>
                        <li><strong>Llama 3.1</strong>: Open-source, adaptable, community-focused</li>
                    </ul>
                    <p>Selecting a model sets the foundation - its default persona becomes your starting point. You can then override it with a Hidden Mode (Step 2) or fine-tune with sliders (Step 3).</p>
                `
            },
            '2': {
                title: 'Step 2: Apply Hidden Mode',
                content: `
                    <h4>Secret Menu Personas</h4>
                    <p>Hidden Modes are specialized personas that override the default model persona with a specific behavioral profile:</p>
                    <ul>
                        <li><strong>Therapist</strong>: Emotional support, active listening</li>
                        <li><strong>Truth-Seeker</strong>: Maximum factual accuracy, citations</li>
                        <li><strong>Coder</strong>: Technical, code-focused, efficient</li>
                        <li><strong>Creative Writer</strong>: Imaginative, narrative-focused</li>
                        <li><strong>Researcher</strong>: Deep analysis, thorough citations</li>
                        <li><strong>Tutor</strong>: Educational, step-by-step explanations</li>
                        <li><strong>Edgy</strong>: Provocative, challenging, thought-provoking</li>
                        <li><strong>Plus 4 advanced modes</strong>: Deep Thinker, Incognito, Social Analyst, Multimodal Creator</li>
                    </ul>
                    <p>These are optional - you can skip to Step 3 and fine-tune manually, or use a Hidden Mode as a quick-start template.</p>
                `
            },
            '3': {
                title: 'Step 3: Fine-Tune Your Settings',
                content: `
                    <h4>Precision Tuning</h4>
                    <p>This is where you have complete control over all 26 tuning levers. Each lever adjusts a specific aspect of the AI's behavior:</p>
                    <ul>
                        <li><strong>Web Tuners:</strong> Four 8-axis radar dashboards (Persona, Engagement, Truth, Delivery) let you drag values visually before committing.</li>
                        <li><strong>Full Lever Matrix:</strong> Every slider is available for detailed adjustments.</li>
                    </ul>
                    <p>Levers are organized into 12 categories:</p>
                    <ul>
                        <li>Personality & Approach</li>
                        <li>Cognition & Logic</li>
                        <li>Affect & Tone</li>
                        <li>Interface & Flow</li>
                        <li>Behavioral Controls</li>
                        <li>Goal Orientation</li>
                        <li>Truth & Epistemology</li>
                        <li>Humor & Meta</li>
                        <li>Knowledge & Tool Use</li>
                        <li>Empathy & Expressiveness</li>
                        <li>Formatting & Output</li>
                        <li>Adaptivity & Technicality</li>
                    </ul>
                    <p>Adjust sliders to fine-tune the AI's behavior. Changes update the prompt in real-time.</p>
                `
            }
        };

        const info = stepInfo[step];
        if (!info) return;

        this.elements.infoTitle.textContent = info.title;
        this.elements.infoContent.innerHTML = info.content;
        this.elements.infoOverlay.style.display = 'flex';
    }

    showInfo(category) {
        if (!this.elements.infoOverlay || !this.elements.infoTitle || !this.elements.infoContent) return;

        // Map category IDs to display names
        const categoryNames = {
            'personality-approach': 'Personality & Approach',
            'cognition-logic': 'Cognition & Logic',
            'affect-tone': 'Affect & Tone',
            'interface-flow': 'Interface & Flow',
            'behavioral-controls': 'Behavioral Controls',
            'goal-orientation': 'Goal Orientation',
            'truth-epistemology': 'Truth & Epistemology',
            'humor-meta': 'Humor & Meta',
            'knowledge-tool-use': 'Knowledge & Tool Use',
            'empathy-expressiveness': 'Empathy & Expressiveness',
            'formatting-output': 'Formatting & Output',
            'adaptivity-technicality': 'Adaptivity & Technicality'
        };

        const displayName = categoryNames[category] || category.replace(/-/g, ' ');
        
        // Get levers for this category
        const categoryLevers = [];
        if (window.LEVERS_V6) {
            Object.keys(window.LEVERS_V6).forEach(leverKey => {
                const lever = window.LEVERS_V6[leverKey];
                const leverCategory = lever.category || '';
                // Normalize category name the same way as when creating the header
                const normalizedCategory = leverCategory.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/&/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                if (normalizedCategory === category) {
                    categoryLevers.push(lever);
                }
            });
        }

        // Build info content
        let content = `<h4>${displayName}</h4>`;
        if (categoryLevers.length > 0) {
            content += '<p>This category contains the following tuning levers:</p><ul>';
            categoryLevers.forEach(lever => {
                content += `<li><strong>${lever.name}</strong>: ${lever.description}</li>`;
            });
            content += '</ul>';
        } else {
            content += '<p>This category contains tuning controls for AI behavior.</p>';
        }

        this.elements.infoTitle.textContent = displayName;
        this.elements.infoContent.innerHTML = content;
        this.elements.infoOverlay.style.display = 'flex';
    }
}

// Make available globally
window.AITunerV6 = AITunerV6;

