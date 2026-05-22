/**
 * AITuner v5.0 - Prompt Display Component
 * 
 * Displays the generated prompt with copy functionality
 */

class PromptDisplay {
    constructor(engine, containerId) {
        this.engine = engine;
        this.container = document.getElementById(containerId);
        
        // Subscribe to prompt changes
        this.engine.onPromptChange = (prompt) => {
            this.update(prompt);
        };

        // First paint (Architect and others may call selectModel before this component exists)
        this.update(this.engine.currentPrompt);
    }
    
    /**
     * Render prompt display
     */
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="prompt-header">
                <h3>Generated Prompt</h3>
                <button class="copy-prompt-btn" id="copy-prompt-btn">Copy Prompt</button>
            </div>
            <div class="prompt-content" id="prompt-content">
                <p class="prompt-placeholder">Select a model to generate a prompt</p>
            </div>
        `;
        
        // Add copy button listener
        const copyBtn = this.container.querySelector('#copy-prompt-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyPrompt();
            });
        }
        
        // Initial update
        this.update(this.engine.currentPrompt);
    }
    
    /**
     * Update prompt display
     */
    update(prompt) {
        let content = this.container && this.container.querySelector('#prompt-content');
        if (!content && this.container && this.container.querySelector('.prompt-content')) {
            content = this.container.querySelector('.prompt-content');
        }
        if (!content) {
            content = this.container;
        }
        if (!content) return;
        
        const text = prompt && typeof prompt.generated_text === 'string' ? prompt.generated_text : '';
        if (!prompt || text.length === 0) {
            content.innerHTML = '<p class="prompt-placeholder">Select a model to generate a prompt</p>';
            return;
        }

        if (window.PromptPreviewUi && typeof window.PromptPreviewUi.renderInto === 'function') {
            window.PromptPreviewUi.renderInto(content, prompt);
        } else {
            content.innerHTML = `<pre class="prompt-text">${this.escapeHtml(text)}</pre>`;
        }
    }
    
    /**
     * Copy prompt to clipboard
     */
    copyPrompt() {
        if (!this.engine.currentPrompt) return;
        
        this.engine.copyPrompt();
        
        // Visual feedback
        const copyBtn = this.container.querySelector('#copy-prompt-btn');
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        }
    }
    
    /**
     * Escape HTML for safe display
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.PromptDisplay = PromptDisplay;
}
