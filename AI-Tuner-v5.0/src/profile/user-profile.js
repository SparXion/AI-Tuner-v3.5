/**
 * AITuner v5.0 - User Profile Management
 * 
 * Manages user profile data: tier progression, preferred model,
 * saved configs, literacy record
 */

class UserProfile {
    constructor(engine) {
        this.engine = engine;
        this.profile = null;
        this.loadProfile();
    }
    
    /**
     * Load profile from localStorage
     */
    loadProfile() {
        const profileData = localStorage.getItem('aituner_profile');
        if (profileData) {
            this.profile = JSON.parse(profileData);
            if (!this.profile.literacy_record) {
                this.profile.literacy_record = {
                    models_explored: [],
                    discovery_runs: 0,
                    prompts_decoded: 0,
                    prompts_built: 0
                };
                this.saveProfile();
            }
        } else {
            this.profile = this.createProfile();
            this.saveProfile();
        }
    }
    
    /**
     * Create new profile
     */
    createProfile() {
        return {
            user_id: this.engine.user.id,
            preferred_model: null,
            default_intent: null,
            last_active: new Date().toISOString(),
            saved_configs: [],
            literacy_record: {
                models_explored: [],
                discovery_runs: 0,
                prompts_decoded: 0,
                prompts_built: 0
            }
        };
    }
    
    /**
     * Save profile to localStorage
     */
    saveProfile() {
        if (this.profile) {
            this.profile.last_active = new Date().toISOString();
            localStorage.setItem('aituner_profile', JSON.stringify(this.profile));
        }
    }
    
    /**
     * Update preferred model (auto-updated from usage)
     */
    updatePreferredModel(modelId) {
        if (this.profile) {
            this.profile.preferred_model = modelId;
            this.saveProfile();
        }
    }
    
    /**
     * Record model exploration
     */
    recordModelExplored(modelId) {
        if (this.profile && this.profile.literacy_record) {
            if (!this.profile.literacy_record.models_explored.includes(modelId)) {
                this.profile.literacy_record.models_explored.push(modelId);
                this.saveProfile();
            }
        }
    }
    
    /**
     * Record discovery run
     */
    recordDiscoveryRun() {
        if (this.profile && this.profile.literacy_record) {
            this.profile.literacy_record.discovery_runs++;
            this.saveProfile();
        }
    }
    
    /**
     * Record prompt decoded
     */
    recordPromptDecoded() {
        if (this.profile && this.profile.literacy_record) {
            this.profile.literacy_record.prompts_decoded++;
            this.saveProfile();
        }
    }
    
    /**
     * Record prompt built
     */
    recordPromptBuilt() {
        if (this.profile && this.profile.literacy_record) {
            this.profile.literacy_record.prompts_built++;
            this.saveProfile();
        }
    }
    
    /**
     * Get saved configs
     */
    getSavedConfigs() {
        const configsData = localStorage.getItem('aituner_configs');
        return configsData ? JSON.parse(configsData) : [];
    }
    
    /**
     * Get dashboard data
     */
    getDashboardData() {
        return {
            tier: this.engine.user.tier,
            preferred_model: this.profile.preferred_model,
            saved_configs: this.getSavedConfigs(),
            literacy_record: this.profile.literacy_record,
            models_explored_count: this.profile.literacy_record.models_explored.length
        };
    }
}

// Export
if (typeof window !== 'undefined') {
    window.UserProfile = UserProfile;
}
