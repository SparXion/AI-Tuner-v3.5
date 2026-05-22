/**
 * AITuner v5.0 - Session Restore
 * 
 * Handles session restoration on app launch (7-day TTL)
 */

class SessionRestore {
    constructor(engine) {
        this.engine = engine;
    }
    
    /**
     * Check if session can be restored
     */
    canRestore() {
        let sessionData = null;
        try {
            sessionData = localStorage.getItem('aituner_session');
        } catch (e) {
            return false;
        }
        if (!sessionData) return false;
        
        try {
            const session = JSON.parse(sessionData);
            const sessionAge = Date.now() - new Date(session.created_at).getTime();
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            
            return sessionAge < sevenDays;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Get restore prompt message
     */
    getRestorePrompt() {
        let sessionData = null;
        try {
            sessionData = localStorage.getItem('aituner_session');
        } catch (e) {
            return null;
        }
        if (!sessionData) return null;
        
        try {
            const session = JSON.parse(sessionData);
            const modelName = session.model_id && window.MODELS_V5 && window.MODELS_V5[session.model_id]
                ? window.MODELS_V5[session.model_id].name
                : 'a model';
            
            const intentLabels = {
                think: 'reflecting on a decision',
                write: 'writing',
                build: 'building',
                explore: 'exploring',
                compare: 'comparing models'
            };
            const intentName = session.intent
                ? intentLabels[session.intent] || session.intent
                : 'your task';
            
            return {
                message: `Welcome back. Last time you were tuning ${modelName} for ${intentName}.`,
                session: session
            };
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Restore session
     */
    restore() {
        if (!this.canRestore()) {
            return false;
        }
        
        // Engine handles restoration in initialize()
        // This is just a helper to check and prompt
        return true;
    }
    
    /**
     * Show restore prompt UI
     */
    showRestorePrompt(onContinue, onStartFresh) {
        const prompt = this.getRestorePrompt();
        if (!prompt) {
            onStartFresh();
            return;
        }
        
        // Create modal
        const overlay = document.createElement('div');
        overlay.className = 'restore-modal-overlay';
        overlay.innerHTML = `
            <div class="restore-modal">
                <h2>Welcome Back</h2>
                <p>${prompt.message}</p>
                <div class="restore-actions">
                    <button class="restore-continue">Continue where you left off</button>
                    <button class="restore-fresh">Start fresh</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add listeners
        overlay.querySelector('.restore-continue').addEventListener('click', () => {
            document.body.removeChild(overlay);
            onContinue();
        });
        
        overlay.querySelector('.restore-fresh').addEventListener('click', () => {
            document.body.removeChild(overlay);
            // Clear session
            localStorage.removeItem('aituner_session');
            onStartFresh();
        });
    }
}

// Export
if (typeof window !== 'undefined') {
    window.SessionRestore = SessionRestore;
}
