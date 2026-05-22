/**
 * AITuner v5.0 - Lever Slider Controls
 * 
 * Creates and manages slider UI for lever adjustments
 */

class SliderControls {
    constructor(engine, containerId) {
        this.engine = engine;
        this.container = document.getElementById(containerId);
        this.sliders = {};
        this.tier1Levers = ['initiative', 'assertiveness', 'conciseness', 'formality', 'emotionalWarmth'];
    }
    
    /**
     * Render sliders for specified levers
     */
    render(leverKeys, tier = 2) {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        
        leverKeys.forEach(leverKey => {
            const lever = window.LEVERS_V5[leverKey];
            if (!lever) return;
            
            // Check tier access
            if (tier === 1 && !this.tier1Levers.includes(leverKey)) {
                return;  // Skip non-Tier 1 levers
            }
            
            const slider = this.createSlider(leverKey, lever);
            this.container.appendChild(slider);
            this.sliders[leverKey] = slider;
        });
    }
    
    /**
     * Create a single slider element
     */
    createSlider(leverKey, lever) {
        const wrapper = document.createElement('div');
        wrapper.className = 'lever-slider-wrapper';
        wrapper.setAttribute('data-lever', leverKey);
        
        const currentValue = this.engine.leverValues[leverKey] || 5;
        
        wrapper.innerHTML = `
            <div class="lever-header">
                <label class="lever-name">${lever.name}</label>
                <span class="lever-value">${currentValue}</span>
            </div>
            <div class="lever-description">${lever.description}</div>
            <div class="lever-labels">
                <span class="lever-low">${lever.low}</span>
                <span class="lever-high">${lever.high}</span>
            </div>
            <input 
                type="range" 
                class="lever-slider" 
                min="0" 
                max="10" 
                value="${currentValue}"
                data-lever="${leverKey}"
            />
        `;
        
        // Add event listener
        const sliderInput = wrapper.querySelector('.lever-slider');
        sliderInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.updateSlider(leverKey, value);
        });
        
        return wrapper;
    }
    
    /**
     * Update slider value
     */
    updateSlider(leverKey, value) {
        // Update display
        const wrapper = this.sliders[leverKey];
        if (wrapper) {
            wrapper.querySelector('.lever-value').textContent = value;
        }
        
        // Update engine
        this.engine.adjustLever(leverKey, value);
    }
    
    /**
     * Update all sliders from engine state
     */
    syncFromEngine() {
        Object.keys(this.sliders).forEach(leverKey => {
            const value = this.engine.leverValues[leverKey] || 5;
            const slider = this.sliders[leverKey];
            if (slider) {
                const sliderInput = slider.querySelector('.lever-slider');
                const valueDisplay = slider.querySelector('.lever-value');
                if (sliderInput) sliderInput.value = value;
                if (valueDisplay) valueDisplay.textContent = value;
            }
        });
    }
}

// Export
if (typeof window !== 'undefined') {
    window.SliderControls = SliderControls;
}
