/**
 * AITuner v5.0 - Core Engine
 * 
 * Implements the 15-entity domain model:
 * USER, PROFILE, SESSION, CONFIG, LEVER_VALUES, MODEL, LEVER, PILLAR,
 * PERSONA, PROMPT, INTENT, DECODED_PROMPT, DECODED_LEVER_VALUE,
 * CALIBRATION_RUN, ELICITATION_RESPONSE
 * 
 * Key rules:
 * - Lever precedence: model defaults < persona overrides < manual adjustments
 * - Persona partial override: snapshot before apply, restore on remove
 * - Prompt always live: regenerate on every lever change
 * - Session → Config: snapshot at save, doesn't retroactively update
 */

class AITunerV5 {
    constructor() {
        // Domain model entities
        this.user = null;           // USER
        this.profile = null;       // PROFILE
        this.session = null;       // SESSION (ephemeral)
        this.currentPrompt = null;  // PROMPT (current, always live)
        
        // State tracking
        this.prePersonaSnapshot = null;  // For persona partial override restore
        this.selectedModel = null;        // MODEL reference
        this.selectedPersona = null;      // PERSONA reference
        this.selectedIntent = null;        // INTENT reference
        
        // Lever state (in SESSION, not persisted until save)
        this.leverValues = {};  // All 16 levers, 0-10
        
        // Callbacks for UI updates
        this.onPromptChange = null;
        this.onLeverChange = null;
        this.onTierChange = null;

        /** v4 emergency emoji shutoff (localStorage aiTunerEmojiShutoff) */
        this.emojiShutoff = false;
        
        // Initialize
        this.initialize();
        this.loadEmojiShutoffPreference();
    }

    loadEmojiShutoffPreference() {
        try {
            this.emojiShutoff = localStorage.getItem('aiTunerEmojiShutoff') === 'true';
        } catch (e) {
            this.emojiShutoff = false;
        }
    }

    setEmojiShutoff(enabled) {
        this.emojiShutoff = !!enabled;
        try {
            localStorage.setItem('aiTunerEmojiShutoff', this.emojiShutoff ? 'true' : 'false');
        } catch (e) {
            /* ignore */
        }
        this.generatePrompt();
    }

    appendEmojiShutoffBlock(text) {
        if (!this.emojiShutoff || !text) {
            return text;
        }
        return (
            text +
            '\n\nCritical Instructions:\n' +
            '• Eliminate emojis completely\n' +
            '• Eliminate filler words (like, um, well, etc.)\n' +
            '• Eliminate hype language and marketing speak\n' +
            '• Be direct and factual only'
        );
    }
    
    /**
     * Initialize: Load or create USER + PROFILE, restore or create SESSION
     */
    initialize() {
        try {
            // Load or create USER
            const userData = localStorage.getItem('aituner_user');
            if (userData) {
                this.user = JSON.parse(userData);
            } else {
                this.user = this.createUser();
                this.saveUser();
            }
            
            // Load or create PROFILE
            const profileData = localStorage.getItem('aituner_profile');
            if (profileData) {
                this.profile = JSON.parse(profileData);
            } else {
                this.profile = this.createProfile();
                this.saveProfile();
            }
            
            // Initialize lever values to neutral (5) for all 16 levers
            this.initializeLevers();
            
            // Try to restore last session
            this.restoreSession();
            
            console.log('AITunerV5: Initialized', {
                userId: this.user.id,
                tier: this.user.tier,
                hasSession: !!this.session
            });
        } catch (error) {
            console.error('AITunerV5: Initialization error', error);
            throw error;
        }
    }
    
    /**
     * Create USER entity (first launch)
     */
    createUser() {
        return {
            id: this.generateUUID(),
            tier: 0,
            has_copied: false,
            has_tuned: false,
            skip_onboarding: false
        };
    }
    
    /**
     * Create PROFILE entity (first launch)
     */
    createProfile() {
        return {
            user_id: this.user.id,
            preferred_model: null,
            default_intent: null,
            last_active: new Date().toISOString()
        };
    }
    
    /**
     * Initialize all 16 levers to neutral (5)
     */
    initializeLevers() {
        if (!window.LEVERS_V5) {
            console.error('LEVERS_V5 not found!');
            return;
        }
        
        Object.keys(window.LEVERS_V5).forEach(leverKey => {
            this.leverValues[leverKey] = 5;
        });
    }
    
    /**
     * Restore last session if < 7 days old
     */
    restoreSession() {
        const sessionData = localStorage.getItem('aituner_session');
        if (!sessionData) return;
        
        try {
            const session = JSON.parse(sessionData);
            const sessionAge = Date.now() - new Date(session.created_at).getTime();
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            
            if (sessionAge < sevenDays) {
                this.session = session;
                this.loadSessionIntoState();
            } else {
                // Session too old, create new one
                this.createNewSession();
            }
        } catch (error) {
            console.error('AITunerV5: Error restoring session', error);
            this.createNewSession();
        }
    }
    
    /**
     * Create new SESSION
     */
    createNewSession(entryPoint = 'guided') {
        this.session = {
            id: this.generateUUID(),
            user_id: this.user.id,
            model_id: null,
            intent: null,
            entry_point: entryPoint,
            created_at: new Date().toISOString()
        };
        
        // Reset lever values to neutral
        this.initializeLevers();
        this.selectedModel = null;
        this.selectedPersona = null;
        this.selectedIntent = null;
        this.prePersonaSnapshot = null;
    }
    
    /**
     * Load SESSION state into engine
     */
    loadSessionIntoState() {
        if (!this.session) return;
        
        // Restore model selection
        if (this.session.model_id && window.MODELS_V5) {
            this.selectedModel = window.MODELS_V5[this.session.model_id];
            if (this.selectedModel) {
                this.loadModelDefaults();
            }
        }
        
        // Restore intent
        this.selectedIntent = this.session.intent;
        
        // Restore lever values from session (if saved)
        if (this.session.lever_values) {
            Object.assign(this.leverValues, this.session.lever_values);
        }
        
        // Restore persona (if saved)
        if (this.session.persona_id && window.PERSONAS_V5) {
            this.selectedPersona = window.PERSONAS_V5[this.session.persona_id];
        }
        
        // Regenerate prompt
        this.generatePrompt();
    }
    
    /**
     * Select MODEL - loads defaults into SESSION lever state
     */
    selectModel(modelId) {
        if (!window.MODELS_V5 || !window.MODELS_V5[modelId]) {
            console.error('AITunerV5: Model not found', modelId);
            return;
        }
        
        this.selectedModel = window.MODELS_V5[modelId];
        
        // Update session
        if (this.session) {
            this.session.model_id = modelId;
        } else {
            this.createNewSession();
            this.session.model_id = modelId;
        }
        
        // Load model defaults (Rule 3: model defaults < persona < manual)
        this.loadModelDefaults();
        
        // Update profile preferred_model if this is most-used
        this.updatePreferredModel(modelId);
        
        // Regenerate prompt
        this.generatePrompt();
    }
    
    /**
     * Load MODEL defaults into lever values
     * Only overwrites if no manual adjustment exists
     */
    loadModelDefaults() {
        if (!this.selectedModel || !this.selectedModel.defaults) return;
        
        // Apply model defaults (but don't overwrite manual adjustments)
        Object.keys(this.selectedModel.defaults).forEach(leverKey => {
            // Only set if no manual adjustment (or if persona was removed)
            // In practice, we always load defaults first, then persona overlays, then manual
            this.leverValues[leverKey] = this.selectedModel.defaults[leverKey];
        });
    }
    
    /**
     * Apply PERSONA - overlays specified levers, snapshots pre-persona state
     */
    applyPersona(personaId) {
        if (!window.PERSONAS_V5 || !window.PERSONAS_V5[personaId]) {
            console.error('AITunerV5: Persona not found', personaId);
            return;
        }
        
        const persona = window.PERSONAS_V5[personaId];
        
        // Rule 2: Snapshot current state before applying
        this.prePersonaSnapshot = { ...this.leverValues };
        
        // Rule 3: Overlay persona's specified levers only
        if (persona.lever_values) {
            Object.keys(persona.lever_values).forEach(leverKey => {
                this.leverValues[leverKey] = persona.lever_values[leverKey];
            });
        }
        
        this.selectedPersona = persona;
        
        // Update session
        if (this.session) {
            this.session.persona_id = personaId;
        }
        
        // Regenerate prompt (includes activation snippet)
        this.generatePrompt();
    }
    
    /**
     * Remove PERSONA - restores pre-persona snapshot
     */
    removePersona() {
        if (!this.prePersonaSnapshot) {
            console.warn('AITunerV5: No persona snapshot to restore');
            return;
        }
        
        // Rule 2: Restore snapshot
        this.leverValues = { ...this.prePersonaSnapshot };
        this.prePersonaSnapshot = null;
        this.selectedPersona = null;
        
        // Update session
        if (this.session) {
            this.session.persona_id = null;
        }
        
        // Regenerate prompt
        this.generatePrompt();
    }
    
    /**
     * Adjust lever manually - overwrites model/persona values
     */
    adjustLever(leverKey, value) {
        // Validate
        if (!window.LEVERS_V5 || !window.LEVERS_V5[leverKey]) {
            console.error('AITunerV5: Lever not found', leverKey);
            return;
        }
        
        // Clamp to 0-10
        value = Math.max(0, Math.min(10, Math.round(value)));
        
        // Rule 3: Manual adjustment overwrites everything
        this.leverValues[leverKey] = value;
        
        // Update session lever values
        if (this.session) {
            if (!this.session.lever_values) {
                this.session.lever_values = {};
            }
            this.session.lever_values[leverKey] = value;
        }
        
        // Rule 8: Always regenerate prompt on lever change
        this.generatePrompt();
        
        // Trigger tier unlock check (Tier 1 → Tier 2 on first slider adjustment)
        this.checkTierUnlock();
        
        // Notify UI
        if (this.onLeverChange) {
            this.onLeverChange(leverKey, value);
        }
    }
    
    /**
     * Generate PROMPT from current lever state (clustering + source map — Stop 9).
     * Rule 8: Always live, never cached
     */
    generatePrompt() {
        if (
            !this.selectedModel &&
            this.session &&
            this.session.model_id &&
            window.MODELS_V5 &&
            window.MODELS_V5[this.session.model_id]
        ) {
            this.selectedModel = window.MODELS_V5[this.session.model_id];
        }

        if (!this.selectedModel) {
            this.currentPrompt = null;
            if (this.onPromptChange) {
                this.onPromptChange(null);
            }
            return;
        }

        let pack = null;
        if (
            typeof window.PROMPT_SYNTHESIS_V9 !== 'undefined' &&
            typeof window.PROMPT_SYNTHESIS_V9.compose === 'function'
        ) {
            pack = window.PROMPT_SYNTHESIS_V9.compose(this);
        }

        if (!pack || typeof pack.generated_text !== 'string') {
            const modelLabel = this.selectedModel.name || this.selectedModel.id || 'this model';
            pack = {
                generated_text:
                    `Tuning for ${modelLabel}: synthesis module unavailable. Reload with prompt-synthesis-v9.js loaded before this file.`,
                sourceMap: [],
                neutralLevers: [],
                hierarchy: 'Output → Character → Voice → Thinking',
                wordCount: 0
            };
        }

        const generatedText = this.appendEmojiShutoffBlock(pack.generated_text);

        const wc = generatedText.trim().split(/\s+/).filter(Boolean).length;

        this.currentPrompt = {
            id: this.generateUUID(),
            config_id: null,
            model_id: this.selectedModel.id,
            generated_text: generatedText,
            sourceMap: pack.sourceMap || [],
            neutralLevers: pack.neutralLevers || [],
            hierarchy: pack.hierarchy || '',
            wordCount: wc,
            created_at: new Date().toISOString()
        };

        if (this.onPromptChange) {
            this.onPromptChange(this.currentPrompt);
        }
    }
    
    /**
     * Save CONFIG from current SESSION state
     * Rule 4: Snapshot at save, doesn't retroactively update
     */
    saveConfig(name) {
        if (!this.session || !this.session.model_id) {
            console.error('AITunerV5: Cannot save config without model');
            return null;
        }
        
        // Create CONFIG entity
        const config = {
            id: this.generateUUID(),
            user_id: this.user.id,
            model_id: this.session.model_id,
            name: name,
            source: this.session.entry_point || 'manual',
            persona_id: this.session.persona_id || null,
            created_at: new Date().toISOString()
        };
        
        // Create LEVER_VALUES for this CONFIG
        const leverValues = {};
        Object.keys(this.leverValues).forEach(leverKey => {
            leverValues[leverKey] = this.leverValues[leverKey];
        });
        
        // Load saved configs
        const configsData = localStorage.getItem('aituner_configs');
        let configs = configsData ? JSON.parse(configsData) : [];
        
        // Add new config
        configs.push({
            ...config,
            lever_values: leverValues
        });
        
        // Save
        localStorage.setItem('aituner_configs', JSON.stringify(configs));
        
        console.log('AITunerV5: Config saved', config.id);
        return config;
    }
    
    /**
     * Load CONFIG into active SESSION
     */
    loadConfig(configId) {
        const configsData = localStorage.getItem('aituner_configs');
        if (!configsData) return null;
        
        const configs = JSON.parse(configsData);
        const config = configs.find(c => c.id === configId);
        if (!config) return null;
        
        // Load model
        if (config.model_id) {
            this.selectModel(config.model_id);
        }
        
        // Load lever values
        if (config.lever_values) {
            Object.keys(config.lever_values).forEach(leverKey => {
                this.leverValues[leverKey] = config.lever_values[leverKey];
            });
        }
        
        // Load persona
        if (config.persona_id) {
            this.applyPersona(config.persona_id);
        } else {
            this.removePersona();
        }
        
        // Regenerate prompt
        this.generatePrompt();
        
        return config;
    }
    
    /**
     * Copy prompt to clipboard - triggers Tier 1 unlock
     */
    copyPrompt() {
        if (!this.currentPrompt) return;
        
        navigator.clipboard.writeText(this.currentPrompt.generated_text).then(() => {
            console.log('AITunerV5: Prompt copied');
            
            // Rule: Copying triggers Tier 1 unlock if tier === 0
            if (this.user.tier === 0 && !this.user.has_copied) {
                this.user.has_copied = true;
                this.user.tier = 1;
                this.saveUser();
                
                if (this.onTierChange) {
                    this.onTierChange(1);
                }
            }
        }).catch(err => {
            console.error('AITunerV5: Copy failed', err);
        });
    }
    
    /**
     * Check for Tier 2 unlock (first slider adjustment)
     */
    checkTierUnlock() {
        if (this.user.tier === 1 && !this.user.has_tuned) {
            this.user.has_tuned = true;
            this.user.tier = 2;
            this.saveUser();
            
            if (this.onTierChange) {
                this.onTierChange(2);
            }
        }
    }
    
    /**
     * Persist session before page unload
     */
    setupPersistence() {
        // Persist on page unload
        window.addEventListener('beforeunload', () => {
            this.persistSession();
        });
        
        // Also persist periodically
        setInterval(() => {
            this.persistSession();
        }, 30000);  // Every 30 seconds
    }
    
    /**
     * Set entry point (immutable per session)
     * Rule 10: Set once, never changes
     */
    setEntryPoint(entryPoint) {
        if (!this.session) {
            this.createNewSession(entryPoint);
        } else {
            // Only set if not already set
            if (!this.session.entry_point) {
                this.session.entry_point = entryPoint;
            }
        }
    }
    
    /**
     * Set intent
     */
    setIntent(intentId) {
        this.selectedIntent = intentId;
        if (this.session) {
            this.session.intent = intentId;
        }
        if (this.profile) {
            this.profile.default_intent = intentId;
            this.saveProfile();
        }
    }
    
    /**
     * Update preferred model based on usage
     */
    updatePreferredModel(modelId) {
        if (this.profile) {
            this.profile.preferred_model = modelId;
            this.saveProfile();
        }
    }
    
    /**
     * Persist SESSION to localStorage (for restore)
     */
    persistSession() {
        if (this.session) {
            // Include current lever values
            this.session.lever_values = { ...this.leverValues };
            this.session.persona_id = this.selectedPersona ? this.selectedPersona.id : null;
            
            localStorage.setItem('aituner_session', JSON.stringify(this.session));
            
            // Update profile last_active
            if (this.profile) {
                this.profile.last_active = new Date().toISOString();
                this.saveProfile();
            }
        }
    }
    
    /**
     * Save USER to localStorage
     */
    saveUser() {
        localStorage.setItem('aituner_user', JSON.stringify(this.user));
    }
    
    /**
     * Save PROFILE to localStorage
     */
    saveProfile() {
        localStorage.setItem('aituner_profile', JSON.stringify(this.profile));
    }
    
    /**
     * Generate UUID
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.AITunerV5 = AITunerV5;
}
