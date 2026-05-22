/**
 * AITuner v5.0 - Persona Selector Component
 * 
 * Quick-pick persona selector (tag-based, one-tap apply)
 */

class PersonaSelector {
    constructor(engine, containerId) {
        this.engine = engine;
        this.container = document.getElementById(containerId);
        this.selectedPersona = null;
    }
    
    /**
     * Render persona selector
     */
    render() {
        if (!this.container || !window.PERSONAS_V5) return;
        
        this.container.innerHTML = `
            <div class="persona-selector-header">
                <h4>Personas</h4>
                <p class="persona-hint">Quick presets to shape your AI's behavior</p>
            </div>
            <div class="persona-tags" id="persona-tags"></div>
        `;
        
        const tagsContainer = this.container.querySelector('#persona-tags');
        if (!tagsContainer) return;
        
        // Render all core personas
        Object.values(window.PERSONAS_V5).forEach(persona => {
            if (persona.type === 'core') {
                const tag = this.createPersonaTag(persona);
                tagsContainer.appendChild(tag);
            }
        });
    }
    
    /**
     * Create persona tag element
     */
    createPersonaTag(persona) {
        const tag = document.createElement('button');
        tag.className = 'persona-tag';
        tag.setAttribute('data-persona-id', persona.id);
        tag.textContent = persona.name;
        
        // Check if selected
        if (this.engine.selectedPersona && this.engine.selectedPersona.id === persona.id) {
            tag.classList.add('active');
            this.selectedPersona = persona;
        }
        
        // Add click handler
        tag.addEventListener('click', () => {
            this.selectPersona(persona);
        });
        
        return tag;
    }
    
    /**
     * Select a persona
     */
    selectPersona(persona) {
        // Toggle if same persona clicked
        if (this.selectedPersona && this.selectedPersona.id === persona.id) {
            this.engine.removePersona();
            this.selectedPersona = null;
            this.updateUI();
            return;
        }
        
        // Apply new persona
        this.engine.applyPersona(persona.id);
        this.selectedPersona = persona;
        this.updateUI();
    }
    
    /**
     * Update UI to reflect selected persona
     */
    updateUI() {
        const tags = this.container.querySelectorAll('.persona-tag');
        tags.forEach(tag => {
            const personaId = tag.getAttribute('data-persona-id');
            if (this.selectedPersona && personaId === this.selectedPersona.id) {
                tag.classList.add('active');
            } else {
                tag.classList.remove('active');
            }
        });
    }
}

// Export
if (typeof window !== 'undefined') {
    window.PersonaSelector = PersonaSelector;
}
