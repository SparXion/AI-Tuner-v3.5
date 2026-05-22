/**
 * AITuner v5.0 - Onboarding State Machine
 * 
 * Manages tier progression: Tier 0 (Starter) → Tier 1 (Tuner) → Tier 2 (Architect)
 * 
 * Tier unlock conditions:
 * - Tier 0 → Tier 1: User copies first prompt
 * - Tier 1 → Tier 2: User adjusts any slider
 * 
 * State stored in USER entity (localStorage: 'aituner_user')
 */

class OnboardingState {
    constructor(engine) {
        this.engine = engine;
        this.currentTier = 0;
        this.hasCopied = false;
        this.hasTuned = false;
        this.skipOnboarding = false;
        
        // Load state from engine
        this.loadState();
    }
    
    /**
     * Load state from USER entity
     */
    loadState() {
        if (this.engine && this.engine.user) {
            this.currentTier = this.engine.user.tier || 0;
            this.hasCopied = this.engine.user.has_copied || false;
            this.hasTuned = this.engine.user.has_tuned || false;
            this.skipOnboarding = this.engine.user.skip_onboarding || false;
        }
    }
    
    /**
     * Human-readable tier label for Progress (profile panel), not for the global badge.
     */
    getTierName() {
        if (this.skipOnboarding) {
            return "I've got this";
        }

        switch (this.currentTier) {
            case 0:
                return 'Getting started';
            case 1:
                return 'Finding my settings';
            case 2:
                return "I've got this";
            default:
                return 'Getting started';
        }
    }

    /**
     * Tier badge button label — always the same so the control reads as "open profile,"
     * not a tier status. Tier details live in the profile panel Progress section.
     */
    getBadgeLabel() {
        return 'My Profile';
    }

    /**
     * Get tier badge display (button text is fixed; use {@link #getTierName} for tier copy in-app)
     */
    getTierBadge() {
        return {
            tier: this.currentTier,
            name: this.getBadgeLabel(),
            skipOnboarding: this.skipOnboarding
        };
    }
    
    /**
     * Check if user can access a feature based on tier
     */
    canAccess(feature) {
        if (this.skipOnboarding) {
            return true;  // Skip onboarding bypasses all checks
        }
        
        switch (feature) {
            case 'radar':
                return this.currentTier >= 1;
            case 'sliders':
                return this.currentTier >= 1;
            case 'all_levers':
                return this.currentTier >= 2;
            case 'all_radars':
                return this.currentTier >= 2;
            default:
                return false;
        }
    }
    
    /**
     * Handle prompt copy - triggers Tier 1 unlock
     */
    handlePromptCopy() {
        if (this.currentTier === 0 && !this.hasCopied) {
            this.hasCopied = true;
            this.currentTier = 1;
            this.saveState();
            return true;  // Unlocked Tier 1
        }
        return false;
    }
    
    /**
     * Handle slider adjustment - triggers Tier 2 unlock
     */
    handleSliderAdjust() {
        if (this.currentTier === 1 && !this.hasTuned) {
            this.hasTuned = true;
            this.currentTier = 2;
            this.saveState();
            return true;  // Unlocked Tier 2
        }
        return false;
    }
    
    /**
     * Skip onboarding - sets skip_onboarding flag
     */
    skipToFullControls() {
        this.skipOnboarding = true;
        this.saveState();
    }
    
    /**
     * Save state to USER entity
     */
    saveState() {
        if (this.engine && this.engine.user) {
            this.engine.user.tier = this.currentTier;
            this.engine.user.has_copied = this.hasCopied;
            this.engine.user.has_tuned = this.hasTuned;
            this.engine.user.skip_onboarding = this.skipOnboarding;
            this.engine.saveUser();
        }
    }
    
    /**
     * Get what unlocks next
     */
    getNextUnlock() {
        if (this.skipOnboarding) {
            return null;
        }
        
        switch (this.currentTier) {
            case 0:
                return {
                    action: 'Copy your first prompt',
                    unlocks: 'Tuner mode — 5 sliders + live radar'
                };
            case 1:
                return {
                    action: 'Adjust any slider',
                    unlocks: 'Architect mode — all 16 levers + 4 radars'
                };
            case 2:
                return null;  // Fully unlocked
            default:
                return null;
        }
    }
    
    /**
     * Get Tier 1 levers (5 of 16)
     */
    getTier1Levers() {
        // From v5-levers.js: TIER1_LEVERS
        if (window.TIER1_LEVERS) {
            return window.TIER1_LEVERS;
        }
        // Fallback
        return ['initiative', 'assertiveness', 'conciseness', 'formality', 'emotionalWarmth'];
    }
}

// Export
if (typeof window !== 'undefined') {
    window.OnboardingState = OnboardingState;
}
