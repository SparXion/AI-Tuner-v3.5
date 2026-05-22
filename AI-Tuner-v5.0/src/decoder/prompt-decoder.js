/**
 * AITuner v5.0 - Prompt Decoder
 * 
 * Orchestrates the decoder flow: paste → map → display results
 */

class PromptDecoder {
    constructor(engine) {
        this.engine = engine;
        this.decodedPrompt = null;
    }
    
    /**
     * Decode a pasted prompt
     */
    decode(rawInput) {
        if (!rawInput || !rawInput.trim()) {
            return null;
        }
        
        // Map prompt to levers
        const mappingResult = mapPromptToLevers(rawInput);
        
        // Create DECODED_PROMPT entity
        this.decodedPrompt = {
            id: this.generateUUID(),
            user_id: this.engine.user.id,
            raw_input: rawInput,
            unmapped_instructions: mappingResult.unmappedInstructions.join('\n'),
            created_at: new Date().toISOString(),
            lever_values: mappingResult.leverValues,
            confidence: mappingResult.confidence
        };
        
        // Store ephemerally (24h TTL)
        this.storeDecoded();
        
        return this.decodedPrompt;
    }
    
    /**
     * Store decoded prompt (ephemeral, 24h TTL)
     */
    storeDecoded() {
        if (this.decodedPrompt) {
            localStorage.setItem('aituner_decoded', JSON.stringify({
                ...this.decodedPrompt,
                expires_at: Date.now() + (24 * 60 * 60 * 1000)  // 24 hours
            }));
        }
    }
    
    /**
     * Load decoded prompt from storage
     */
    loadDecoded() {
        const stored = localStorage.getItem('aituner_decoded');
        if (!stored) return null;
        
        try {
            const decoded = JSON.parse(stored);
            
            // Check expiration
            if (decoded.expires_at && Date.now() > decoded.expires_at) {
                localStorage.removeItem('aituner_decoded');
                return null;
            }
            
            this.decodedPrompt = decoded;
            return decoded;
        } catch (error) {
            console.error('PromptDecoder: Error loading decoded prompt', error);
            return null;
        }
    }
    
    /**
     * Use decoded configuration - creates CONFIG from decoded values
     */
    useConfiguration(modelId) {
        if (!this.decodedPrompt || !modelId) {
            return null;
        }
        
        // Select model
        this.engine.selectModel(modelId);
        
        // Apply decoded lever values
        Object.keys(this.decodedPrompt.lever_values).forEach(leverKey => {
            const value = this.decodedPrompt.lever_values[leverKey];
            // Only apply if not neutral (5) - keep model defaults for neutral
            if (value !== 5) {
                this.engine.adjustLever(leverKey, value);
            }
        });
        
        // Create CONFIG with source "decoded"
        const config = this.engine.saveConfig('Decoded Configuration');
        if (config) {
            config.source = 'decoded';
            config.decoded_from = this.decodedPrompt.raw_input.substring(0, 50) + '...';
        }
        
        return config;
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

// Export
if (typeof window !== 'undefined') {
    window.PromptDecoder = PromptDecoder;
}
