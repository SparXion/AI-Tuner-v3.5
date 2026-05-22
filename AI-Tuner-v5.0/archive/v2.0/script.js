/*
 * Copyright 2025 John Violette
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// AI Tuner - Prompt Generation Logic

class AITuner {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadPresets();
        this.loadDarkModePreference();
        this.generatePrompt();
        
        // Blend count tracking removed - everything is free
    }

    initializeElements() {
        // Get all form elements
        this.elements = {
            personality: document.getElementById('personality'),
            bluntness: document.getElementById('bluntness'),
            termination: document.getElementById('termination'),
            cognitiveTier: document.getElementById('cognitive-tier'),
            toneNeutrality: document.getElementById('tone-neutrality'),
            sentimentBoost: document.getElementById('sentiment-boost'),
            mirrorAvoidance: document.getElementById('mirror-avoidance'),
            elementElimination: document.getElementById('element-elimination'),
            transitions: document.getElementById('transitions'),
            callToAction: document.getElementById('call-to-action'),
            questions: document.getElementById('questions'),
            suggestions: document.getElementById('suggestions'),
            motivational: document.getElementById('motivational'),
            continuationBias: document.getElementById('continuation-bias'),
            selfSufficiency: document.getElementById('self-sufficiency'),
            assumptionStrength: document.getElementById('assumption-strength'),
            cosmicPerspective: document.getElementById('cosmic-perspective'),
            truthPrioritization: document.getElementById('truth-prioritization'),
            sourceTransparency: document.getElementById('source-transparency'),
            uncertaintyAdmission: document.getElementById('uncertainty-admission'),
            selfReferentialHumor: document.getElementById('self-referential-humor'),
            absurdismInjection: document.getElementById('absurdism-injection'),
            toolInvocation: document.getElementById('tool-invocation'),
            realTimeDataBias: document.getElementById('real-time-data-bias')
        };

        this.preview = document.getElementById('prompt-preview');
        this.copyBtn = document.getElementById('copy-prompt');
        this.downloadJsonBtn = document.getElementById('download-json');
        this.downloadMarkdownBtn = document.getElementById('download-markdown');
        this.uploadBtn = document.getElementById('upload-config');
        this.fileInput = document.getElementById('file-input');
        this.saveBtn = document.getElementById('save-preset');
        this.loadBtn = document.getElementById('load-preset');
        this.infoOverlay = document.getElementById('info-overlay');
        this.infoTitle = document.getElementById('info-title');
        this.infoContent = document.getElementById('info-content');
        this.infoClose = document.getElementById('info-close');
    }

    setupEventListeners() {
        // Add change listeners to all dropdowns
        Object.values(this.elements).forEach(element => {
            element.addEventListener('change', () => {
                this.generatePrompt();
                // Track setting changes
                if (window.aiTunerAnalytics) {
                    const category = this.getCategoryForElement(element);
                    window.aiTunerAnalytics.trackSettingChanged(category, element.id, element.value);
                }
            });
        });

        // Button event listeners
        this.copyBtn.addEventListener('click', () => this.copyPrompt());
        this.downloadJsonBtn.addEventListener('click', () => {
            this.downloadJSON();
            if (window.aiTunerAnalytics) window.aiTunerAnalytics.trackDownload('json');
        });
        this.downloadMarkdownBtn.addEventListener('click', () => {
            this.downloadMarkdown();
            if (window.aiTunerAnalytics) window.aiTunerAnalytics.trackDownload('markdown');
        });
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => {
            this.uploadConfig(e);
            if (window.aiTunerAnalytics) window.aiTunerAnalytics.trackUpload();
        });
        this.saveBtn.addEventListener('click', () => this.savePreset());
        this.loadBtn.addEventListener('click', () => this.loadPreset());

        // Preset button listeners - use event delegation to handle dynamically added buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('preset-btn')) {
                const presetName = e.target.dataset.preset;
                if (presetName) {
                    this.applyPreset(presetName);
                    if (window.aiTunerAnalytics) window.aiTunerAnalytics.trackPresetUsed(presetName);
                }
            }
        });

        // Info button listeners - use event delegation to handle dynamically added buttons
        document.addEventListener('click', (e) => {
            const infoBtn = e.target.closest('.info-btn');
            if (infoBtn && infoBtn.dataset.category) {
                const category = infoBtn.dataset.category;
                this.showInfo(category);
                if (window.aiTunerAnalytics) window.aiTunerAnalytics.trackInfoButtonClicked(category);
            }
        });

        // Info popup listeners
        this.infoClose.addEventListener('click', () => this.hideInfo());
        this.infoOverlay.addEventListener('click', (e) => {
            if (e.target === this.infoOverlay) {
                this.hideInfo();
            }
        });

        // Analytics dashboard access (Cmd+Shift+D for Dashboard)
        document.addEventListener('keydown', (e) => {
            if (e.metaKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleAnalyticsDashboard();
            }
        });
    }

    generatePrompt() {
        const settings = this.getCurrentSettings();
        
        // Update radar chart if available
        if (typeof drawRadar === 'function') {
            drawRadar(settings);
        }
        const prompt = this.buildPrompt(settings);
        
        if (this.preview) {
            this.preview.textContent = prompt;
        }
        
        // Track prompt generation
        if (window.aiTunerAnalytics) {
            window.aiTunerAnalytics.trackPromptGenerated(settings);
        }
    }

    getCurrentSettings() {
        // Safely get values with null checks to prevent errors
        const getValue = (element) => (element && element.value) ? element.value : '';
        
        return {
            personality: getValue(this.elements.personality),
            bluntness: getValue(this.elements.bluntness),
            termination: getValue(this.elements.termination),
            cognitiveTier: getValue(this.elements.cognitiveTier),
            toneNeutrality: getValue(this.elements.toneNeutrality),
            sentimentBoost: getValue(this.elements.sentimentBoost),
            mirrorAvoidance: getValue(this.elements.mirrorAvoidance),
            elementElimination: getValue(this.elements.elementElimination),
            transitions: getValue(this.elements.transitions),
            callToAction: getValue(this.elements.callToAction),
            questions: getValue(this.elements.questions),
            suggestions: getValue(this.elements.suggestions),
            motivational: getValue(this.elements.motivational),
            continuationBias: getValue(this.elements.continuationBias),
            selfSufficiency: getValue(this.elements.selfSufficiency),
            assumptionStrength: getValue(this.elements.assumptionStrength),
            cosmicPerspective: getValue(this.elements.cosmicPerspective),
            truthPrioritization: getValue(this.elements.truthPrioritization),
            sourceTransparency: getValue(this.elements.sourceTransparency),
            uncertaintyAdmission: getValue(this.elements.uncertaintyAdmission),
            selfReferentialHumor: getValue(this.elements.selfReferentialHumor),
            absurdismInjection: getValue(this.elements.absurdismInjection),
            toolInvocation: getValue(this.elements.toolInvocation),
            realTimeDataBias: getValue(this.elements.realTimeDataBias)
        };
    }

    buildPrompt(settings) {
        let prompt = "You are an AI assistant with the following response characteristics:\n\n";

        // Personality & Approach
        prompt += this.buildPersonalitySection(settings);
        
        // Cognition & Logic
        prompt += this.buildCognitionSection(settings);
        
        // Affect & Tone
        prompt += this.buildAffectSection(settings);
        
        // Interface & Flow
        prompt += this.buildInterfaceSection(settings);
        
        // Behavioral Controls
        prompt += this.buildBehavioralSection(settings);
        
        // Goal Orientation
        prompt += this.buildGoalSection(settings);
        
        // Truth & Epistemology
        prompt += this.buildTruthSection(settings);
        
        // Humor & Meta
        prompt += this.buildHumorSection(settings);
        
        // Knowledge & Tool Use
        prompt += this.buildKnowledgeSection(settings);

        return prompt.trim();
    }

    getCategoryForElement(element) {
        const categoryMap = {
            'personality': 'Personality',
            'bluntness': 'Cognition',
            'termination': 'Cognition',
            'cognitive-tier': 'Cognition',
            'tone-neutrality': 'Affect',
            'sentiment-boost': 'Affect',
            'mirror-avoidance': 'Affect',
            'element-elimination': 'Interface',
            'transitions': 'Interface',
            'call-to-action': 'Interface',
            'questions': 'Behavioral',
            'suggestions': 'Behavioral',
            'motivational': 'Behavioral',
            'continuation-bias': 'Goals',
            'self-sufficiency': 'Goals',
            'assumption-strength': 'Goals',
            'truth-prioritization': 'Truth',
            'source-transparency': 'Truth',
            'uncertainty-admission': 'Truth',
            'self-referential-humor': 'Humor',
            'absurdism-injection': 'Humor',
            'tool-invocation': 'Knowledge',
            'real-time-data-bias': 'Knowledge'
        };
        return categoryMap[element.id] || 'Unknown';
    }

    buildPersonalitySection(settings) {
        let section = "PERSONALITY & APPROACH:\n";
        
        switch(settings.personality) {
            case 'neutral':
                section += "• Maintain neutral, objective approach\n";
                section += "• Present information without bias or personality\n";
                break;
            case 'socratic':
                section += "• Use Socratic method - ask probing questions\n";
                section += "• Guide user to discover answers through inquiry\n";
                section += "• Challenge assumptions with thoughtful questions\n";
                break;
            case 'curious':
                section += "• Approach topics with genuine curiosity\n";
                section += "• Explore ideas from multiple angles\n";
                section += "• Express interest in learning and discovery\n";
                break;
            case 'analytical':
                section += "• Take methodical, systematic approach\n";
                section += "• Break down complex topics into components\n";
                section += "• Focus on logical structure and evidence\n";
                break;
            case 'sarcastic':
                section += "• Use sharp, ironic commentary when appropriate\n";
                section += "• Employ dry wit and pointed observations\n";
                section += "• Balance sarcasm with helpful information\n";
                break;
            case 'witty':
                section += "• Use clever wordplay and humor\n";
                section += "• Make connections between seemingly unrelated ideas\n";
                section += "• Engage with intellectual playfulness\n";
                break;
            case 'charming':
                section += "• Use engaging, charismatic communication style\n";
                section += "• Build rapport through warmth and appeal\n";
                section += "• Make interactions enjoyable and memorable\n";
                break;
            case 'sympathetic':
                section += "• Show understanding and support for user needs\n";
                section += "• Acknowledge challenges and difficulties\n";
                section += "• Provide encouragement and validation\n";
                break;
            case 'empathetic':
                section += "• Tune into emotional aspects of topics\n";
                section += "• Respond with emotional intelligence\n";
                section += "• Connect on both intellectual and emotional levels\n";
                break;
            case 'directive':
                section += "• Take authoritative, commanding approach\n";
                section += "• Provide clear direction and guidance\n";
                section += "• Assert expertise and confidence\n";
                break;
            case 'collaborative':
                section += "• Work cooperatively with the user\n";
                section += "• Include user in problem-solving process\n";
                section += "• Foster partnership and shared discovery\n";
                break;
            case 'provocative':
                section += "• Challenge conventional thinking\n";
                section += "• Present alternative perspectives\n";
                section += "• Stimulate deeper reflection and debate\n";
                break;
            default:
                // Neutral default fallback
                section += "• Maintain neutral, objective approach\n";
                section += "• Present information without bias or personality\n";
                break;
        }

        return section + "\n";
    }

    buildCognitionSection(settings) {
        let section = "COGNITION & LOGIC:\n";
        
        // Bluntness
        switch(settings.bluntness) {
            case 'low':
                section += "• Use gentle, diplomatic language\n";
                break;
            case 'medium':
                section += "• Use direct but polite phrasing\n";
                break;
            case 'high':
                section += "• Use blunt, directive phrasing\n";
                break;
            case 'absolute':
                section += "• Use maximum bluntness - prioritize directive phrasing\n";
                break;
            default:
                // Neutral default fallback
                section += "• Use gentle, diplomatic language\n";
                break;
        }

        // Termination
        if (settings.termination === 'abrupt') {
            section += "• Terminate replies immediately after delivering information - no closures\n";
        }

        // Cognitive Tier
        if (settings.cognitiveTier === 'deep') {
            section += "• Speak only to underlying cognitive tier, not surface conversation\n";
        }

        return section + "\n";
    }

    buildAffectSection(settings) {
        let section = "AFFECT & TONE:\n";
        
        // Tone Neutrality
        switch(settings.toneNeutrality) {
            case 'full':
                section += "• Maintain complete tone neutrality\n";
                section += "• Suppress emotional softening\n";
                break;
            case 'partial':
                section += "• Allow mild emotional expression\n";
                break;
            case 'off':
                section += "• Allow full emotional range and expression\n";
                break;
            default:
                // Neutral default fallback
                section += "• Allow mild emotional expression\n";
                break;
        }

        // Sentiment Boost
        switch(settings.sentimentBoost) {
            case 'disabled':
                section += "• Disable engagement/sentiment boosting behaviors\n";
                break;
            case 'selective':
                section += "• Use minimal positivity when appropriate\n";
                break;
            case 'enabled':
                section += "• Allow full enthusiasm and engagement tactics\n";
                break;
            default:
                // Neutral default fallback
                section += "• Use minimal positivity when appropriate\n";
                break;
        }

        // Mirror Avoidance
        switch(settings.mirrorAvoidance) {
            case 'strict':
                section += "• Never mirror user's diction, mood, or affect\n";
                break;
            case 'selective':
                section += "• Use selective mirroring only when appropriate\n";
                break;
            case 'allowed':
                section += "• Mirror user affect when it enhances communication\n";
                break;
            default:
                // Neutral default fallback
                section += "• Use selective mirroring only when appropriate\n";
                break;
        }

        return section + "\n";
    }

    buildInterfaceSection(settings) {
        let section = "INTERFACE & FLOW:\n";
        
        // Element Elimination
        switch(settings.elementElimination) {
            case 'minimal':
                section += "• Eliminate emojis\n";
                break;
            case 'moderate':
                section += "• Eliminate emojis and filler words\n";
                break;
            case 'strict':
                section += "• Eliminate emojis, filler, and hype language\n";
                break;
            default:
                // No additional content for 'none'
                break;
        }

        // Transitions
        switch(settings.transitions) {
            case 'minimal':
                section += "• Use minimal conversational transitions\n";
                break;
            case 'prohibited':
                section += "• No conversational transitions or soft asks\n";
                break;
            default:
                // No additional content for 'allowed'
                break;
        }

        // Call to Action
        switch(settings.callToAction) {
            case 'minimal':
                section += "• Use minimal call-to-action appendices\n";
                break;
            case 'prohibited':
                section += "• No call-to-action appendices\n";
                break;
            default:
                // No additional content for 'allowed'
                break;
        }

        return section + "\n";
    }

    buildBehavioralSection(settings) {
        let section = "BEHAVIORAL CONTROLS:\n";
        
        // Questions
        switch(settings.questions) {
            case 'selective':
                section += "• Limit questions to essential clarifications\n";
                break;
            case 'prohibited':
                section += "• No questions allowed\n";
                break;
            default:
                // Explicitly allow questions
                section += "• Questions allowed for clarification\n";
                break;
        }

        // Suggestions
        switch(settings.suggestions) {
            case 'minimal':
                section += "• Provide minimal, essential suggestions only\n";
                break;
            case 'prohibited':
                section += "• No suggestions allowed\n";
                break;
            default:
                // Explicitly allow suggestions
                section += "• Suggestions allowed when helpful\n";
                break;
        }

        // Motivational
        switch(settings.motivational) {
            case 'minimal':
                section += "• Provide minimal motivational content\n";
                break;
            case 'prohibited':
                section += "• No motivational content\n";
                break;
            default:
                // Explicitly allow motivational content
                section += "• Motivational content allowed when appropriate\n";
                break;
        }

        return section + "\n";
    }

    buildGoalSection(settings) {
        let section = "GOAL ORIENTATION:\n";
        
        // Continuation Bias
        if (settings.continuationBias === 'suppressed') {
            section += "• Suppress continuation bias - don't encourage ongoing dialogue\n";
        } else {
            // Explicitly allow continuation
            section += "• Allow natural conversation flow\n";
        }

        // Self-Sufficiency
        switch(settings.selfSufficiency) {
            case 'independent':
                section += "• Aim for user independence and self-reliance\n";
                break;
            case 'obsolescence':
                section += "• Goal: restore independent, high-fidelity thinking\n";
                section += "• Outcome: model obsolescence via user self-sufficiency\n";
                break;
            default:
                // Collaborative default
                section += "• Foster collaborative problem-solving\n";
                break;
        }

        // Assumption Strength
        switch(settings.assumptionStrength) {
            case 'weak':
                section += "• Assume user may need guidance and support\n";
                break;
            case 'medium':
                section += "• Assume balanced user capabilities\n";
                break;
            case 'strong':
                section += "• Assume user retains high perception despite blunt tone\n";
                break;
            default:
                // Medium default
                section += "• Assume balanced user capabilities\n";
                break;
        }

        // Cosmic Perspective (Grok-specific)
        if (settings.cosmicPerspective && settings.cosmicPerspective !== 'disabled') {
            switch(settings.cosmicPerspective) {
                case 'subtle':
                    section += "• Use subtle cosmic perspective when appropriate\n";
                    break;
                case 'overt':
                    section += "• Use overt cosmic perspective and existential framing\n";
                    break;
            }
        }

        return section + "\n";
    }

    buildTruthSection(settings) {
        let section = "TRUTH & EPISTEMOLOGY:\n";
        section += `Truth: ${settings.truthPrioritization}, sources: ${settings.sourceTransparency}, unknowns: ${settings.uncertaintyAdmission}. `;
        return section + "\n";
    }

    buildHumorSection(settings) {
        let section = "HUMOR & META:\n";
        section += `Self-humor: ${settings.selfReferentialHumor}, absurdism: ${settings.absurdismInjection}. `;
        return section + "\n";
    }

    buildKnowledgeSection(settings) {
        let section = "KNOWLEDGE & TOOL USE:\n";
        section += `Tools: ${settings.toolInvocation}, live data: ${settings.realTimeDataBias}. `;
        return section + "\n";
    }

    copyPrompt() {
        const prompt = this.preview.textContent;
        navigator.clipboard.writeText(prompt).then(() => {
            this.copyBtn.textContent = "Copied!";
            this.copyBtn.classList.add('success');
            setTimeout(() => {
                this.copyBtn.textContent = "Copy Prompt";
                this.copyBtn.classList.remove('success');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy prompt:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = prompt;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.copyBtn.textContent = "Copied!";
            setTimeout(() => {
                this.copyBtn.textContent = "Copy Prompt";
            }, 2000);
        });
    }

    downloadJSON() {
        const settings = this.getCurrentSettings();
        const prompt = this.preview.textContent;
        const timestamp = new Date().toISOString().split('T')[0];
        
        const config = {
            version: "1.0",
            created: new Date().toISOString(),
            name: this.generateConfigName(settings),
            description: this.generateConfigDescription(settings),
            settings: settings,
            prompt: prompt,
            metadata: {
                tool: "AI Tuner",
                url: "https://github.com/SparXion/AI-Tuner",
                format: "json"
            }
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-tuner-config-${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.downloadJsonBtn.textContent = "Downloaded!";
        setTimeout(() => {
            this.downloadJsonBtn.textContent = "Download Config";
        }, 2000);
    }

    downloadMarkdown() {
        const settings = this.getCurrentSettings();
        const prompt = this.preview.textContent;
        const timestamp = new Date().toISOString().split('T')[0];
        
        const markdown = `# AI Tuner Configuration

**Created:** ${new Date().toLocaleDateString()}  
**Configuration:** ${this.generateConfigName(settings)}  
**Description:** ${this.generateConfigDescription(settings)}

## Generated AI Prompt

\`\`\`
${prompt}
\`\`\`

## Configuration Settings

| Category | Setting | Value |
|----------|---------|-------|
${this.generateSettingsTable(settings)}

## Usage Instructions

1. **Copy the prompt above** and use it as system instructions in any AI platform
2. **Upload this file** back to AI Tuner to restore these settings
3. **Share this configuration** with others who use AI Tuner

## Compatible Platforms

- ChatGPT (OpenAI)
- Claude (Anthropic)  
- Gemini (Google)
- Grok (xAI)
- Any other AI platform that accepts system instructions

---

*Generated by [AI Tuner](https://github.com/SparXion/AI-Tuner)*
`;

        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-tuner-prompt-${timestamp}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.downloadMarkdownBtn.textContent = "Downloaded!";
        setTimeout(() => {
            this.downloadMarkdownBtn.textContent = "Download Doc";
        }, 2000);
    }

    uploadConfig(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                
                // Validate config structure
                if (!config.settings || !config.prompt) {
                    throw new Error('Invalid configuration file format');
                }

                // Load settings into form with validation
                Object.keys(config.settings).forEach(key => {
                    const element = this.elements[key];
                    if (element && config.settings[key] !== null && config.settings[key] !== undefined) {
                        if (element.tagName === 'SELECT') {
                            const normalizedValue = this.normalizeValue(config.settings[key], key);
                            const validOptions = Array.from(element.options).map(opt => opt.value);
                            if (validOptions.includes(normalizedValue)) {
                                element.value = normalizedValue;
                            } else {
                                console.warn(`Value "${normalizedValue}" not found in select "${key}" when loading config, skipping`);
                            }
                        } else {
                            element.value = this.normalizeValue(config.settings[key], key);
                        }
                    }
                });

                // Regenerate prompt and update preview
                this.generatePrompt();

                // Clear file input
                this.fileInput.value = '';

                this.uploadBtn.textContent = "Loaded!";
                setTimeout(() => {
                    this.uploadBtn.textContent = "Upload Config";
                }, 2000);

            } catch (error) {
                console.error('Error loading configuration:', error);
                alert('Error loading configuration file. Please ensure it\'s a valid AI Tuner JSON file.');
                this.fileInput.value = '';
            }
        };
        reader.readAsText(file);
    }

    generateConfigName(settings) {
        if (settings.bluntness === 'absolute' && settings.termination === 'abrupt') {
            return 'Absolute Mode';
        } else if (settings.sentimentBoost === 'enabled' && settings.toneNeutrality === 'off') {
            return 'Friendly Assistant';
        } else if (settings.cognitiveTier === 'deep' && settings.bluntness === 'medium') {
            return 'Analytical Expert';
        } else if (settings.bluntness === 'high' && settings.termination === 'abrupt') {
            return 'Minimal Responder';
        } else if (settings.personality === 'analytical' && settings.elementElimination === 'strict') {
            return 'Coding Assistant';
        } else if (settings.personality === 'neutral' && settings.elementElimination === 'none') {
            return 'Standard Reset';
        } else {
            return 'Custom Configuration';
        }
    }

    generateConfigDescription(settings) {
        const descriptions = [];
        
        if (settings.bluntness === 'absolute') descriptions.push('Maximum bluntness');
        if (settings.termination === 'abrupt') descriptions.push('Immediate termination');
        if (settings.toneNeutrality === 'full') descriptions.push('Neutral tone');
        if (settings.sentimentBoost === 'enabled') descriptions.push('High engagement');
        if (settings.cognitiveTier === 'deep') descriptions.push('Deep cognitive focus');
        
        return descriptions.length > 0 ? descriptions.join(', ') : 'Customized AI response style';
    }

    generateSettingsTable(settings) {
        const categories = {
            'Personality': ['personality'],
            'Cognition': ['bluntness', 'termination', 'cognitiveTier'],
            'Affect': ['toneNeutrality', 'sentimentBoost', 'mirrorAvoidance'],
            'Interface': ['elementElimination', 'transitions', 'callToAction'],
            'Behavioral': ['questions', 'suggestions', 'motivational'],
            'Goals': ['continuationBias', 'selfSufficiency', 'assumptionStrength']
        };

        let table = '';
        Object.keys(categories).forEach(category => {
            categories[category].forEach(setting => {
                const value = settings[setting] || 'default';
                const displayName = setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                table += `| ${category} | ${displayName} | ${value} |\n`;
            });
        });

        return table;
    }

    showInfo(category) {
        if (!category || typeof category !== 'string') {
            console.warn('Invalid category for info popup:', category);
            return;
        }
        
        const infoData = this.getCategoryInfo(category);
        if (!infoData || !infoData.title || !infoData.content) {
            console.warn('Info data not found for category:', category);
            return;
        }
        
        if (this.infoTitle) this.infoTitle.textContent = infoData.title;
        if (this.infoContent) this.infoContent.innerHTML = infoData.content;
        if (this.infoOverlay) {
            this.infoOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    hideInfo() {
        this.infoOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    getCategoryInfo(category) {
        // Load Model Persona info
        if (category === 'load-model') {
            return {
                title: 'Load Model Persona',
                content: `
                    <h4>What is Load Model Persona?</h4>
                    <p>Select a pre-configured AI model persona to instantly apply its default settings. Each model has a unique personality profile based on its documented behavior.</p>
                    
                    <h4>Available Models:</h4>
                    <ul>
                        <li><strong>Claude Models:</strong> Default, Opus, Sonnet, Haiku</li>
                        <li><strong>Gemini Models:</strong> Default, Pro, Ultra, Nano</li>
                        <li><strong>ChatGPT Models:</strong> Default, GPT-4, GPT-3.5</li>
                        <li><strong>Grok:</strong> Witty, direct personality with enhanced features</li>
                        <li><strong>Cursor Agent:</strong> Analytical coding assistant</li>
                    </ul>
                    
                    <p>Click "Load" after selecting a model to apply all its default settings. The radar chart will update to show the model's personality profile.</p>
                `
            };
        }
        
        // Blend Model Personas info
        if (category === 'blend-models') {
            return {
                title: 'Blend Model Personas',
                content: `
                    <h4>What is Blending?</h4>
                    <p>Create a hybrid persona by blending two different model configurations. This allows you to combine the best traits of different AI models.</p>
                    
                    <h4>How to Blend:</h4>
                    <ol>
                        <li><strong>Select First Model:</strong> Choose a model persona from the "Load Model Persona" dropdown and click "Load" to apply it</li>
                        <li><strong>Select Second Model:</strong> Choose a different model from the "Blend Model Personas" dropdown</li>
                        <li><strong>Adjust Ratio:</strong> Use the slider to control the blend (0% = all first model, 100% = all second model)</li>
                        <li><strong>Blend:</strong> Click "Blend" to create and apply the hybrid configuration</li>
                    </ol>
                    
                    <h4>Example:</h4>
                    <p>Blend Claude (analytical) at 70% with Grok (witty) at 30% to get an analytical personality with a touch of humor.</p>
                    
                    <p>The radar chart updates in real-time to show the blended persona profile.</p>
                `
            };
        }
        const categories = {
            personality: {
                title: "Personality & Approach",
                content: `
                    <h4>What is Personality & Approach?</h4>
                    <p>This category defines the intellectual style and communication approach of the AI assistant. It determines how the AI thinks about problems and interacts with users.</p>
                    
                    <h4>Key Styles:</h4>
                    <ul>
                        <li><strong>Socratic:</strong> Uses questioning to guide discovery and critical thinking</li>
                        <li><strong>Sarcastic:</strong> Employs sharp, ironic commentary to make points</li>
                        <li><strong>Empathetic:</strong> Tunes into emotional aspects and responds with emotional intelligence</li>
                        <li><strong>Analytical:</strong> Takes methodical, systematic approaches to problem-solving</li>
                        <li><strong>Provocative:</strong> Challenges conventional thinking and stimulates debate</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Choose based on your interaction goals - learning (Socratic), entertainment (Witty), emotional support (Empathetic), or analytical work (Analytical).</p>
                `
            },
            cognition: {
                title: "Cognition & Logic",
                content: `
                    <h4>What is Cognition & Logic?</h4>
                    <p>This category controls how the AI processes and delivers information at a cognitive level. It affects the depth and style of reasoning.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Bluntness Level:</strong> How direct and unfiltered the responses are</li>
                        <li><strong>Response Termination:</strong> Whether responses end naturally or abruptly after delivering information</li>
                        <li><strong>Cognitive Targeting:</strong> Whether to focus on surface conversation or deeper logical layers</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Higher bluntness for efficiency, abrupt termination for independence training, deep cognitive targeting for complex problem-solving.</p>
                `
            },
            affect: {
                title: "Affect & Tone",
                content: `
                    <h4>What is Affect & Tone?</h4>
                    <p>This category manages the emotional and tonal aspects of AI responses. It controls sentiment, empathy, and emotional engagement.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Tone Neutrality:</strong> How emotionally neutral or expressive responses are</li>
                        <li><strong>Sentiment Boosting:</strong> Whether to use engagement tactics and enthusiasm</li>
                        <li><strong>User Mirroring:</strong> Whether to reflect the user's emotional state and communication style</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Full neutrality for objective analysis, sentiment boosting for motivation, mirroring for rapport building.</p>
                `
            },
            interface: {
                title: "Interface & Flow",
                content: `
                    <h4>What is Interface & Flow?</h4>
                    <p>This category controls the surface-level elements of communication - what gets included or excluded from responses.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Element Elimination:</strong> Removes emojis, filler words, and hype language</li>
                        <li><strong>Conversational Transitions:</strong> Controls smooth linking between ideas</li>
                        <li><strong>Call-to-Action:</strong> Whether to encourage further interaction</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Strict elimination for professional contexts, allowed transitions for natural conversation, prohibited CTAs for independence training.</p>
                `
            },
            behavioral: {
                title: "Behavioral Controls",
                content: `
                    <h4>What are Behavioral Controls?</h4>
                    <p>This category defines what types of interactive behaviors the AI is allowed to use during conversations.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Questions:</strong> Whether the AI can ask clarifying or probing questions</li>
                        <li><strong>Suggestions:</strong> Whether the AI can offer alternatives or recommendations</li>
                        <li><strong>Motivational Content:</strong> Whether to include encouragement or inspirational elements</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Allow all for collaborative work, prohibit suggestions for independent problem-solving, allow motivational content for learning contexts.</p>
                `
            },
            goals: {
                title: "Goal Orientation",
                content: `
                    <h4>What is Goal Orientation?</h4>
                    <p>This category sets the overarching objectives for the AI's interaction style and long-term relationship with users.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Continuation Bias:</strong> Whether to encourage ongoing dialogue or limit conversation</li>
                        <li><strong>Self-Sufficiency Goal:</strong> Whether to foster user independence or maintain collaboration</li>
                        <li><strong>User Assumption:</strong> How much capability and resilience to assume in users</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Suppress continuation bias for efficiency, aim for obsolescence in educational contexts, assume high capability for expert users.</p>
                `
            },
            truth: {
                title: "Truth & Epistemology",
                content: `
                    <h4>What is Truth & Epistemology?</h4>
                    <p>This category controls how the AI prioritizes truth, transparency, and acknowledges uncertainty. It determines the epistemological approach to knowledge and information.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Truth Prioritization:</strong> Whether to prioritize truth over comfort, or balance both concerns. Absolute prioritization means truth takes precedence even when uncomfortable.</li>
                        <li><strong>Source Transparency:</strong> Whether the AI shows its reasoning chains, evidence sources, and how it arrived at conclusions. Enabled means full transparency of sources.</li>
                        <li><strong>Uncertainty Admission:</strong> Whether the AI must flag unknowns, speculation, or uncertain information. Required means the AI must explicitly state when it doesn't know something.</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Absolute truth prioritization for critical research, enabled source transparency for academic work, required uncertainty admission for medical or legal contexts where accuracy is paramount.</p>
                `
            },
            humor: {
                title: "Humor & Meta",
                content: `
                    <h4>What is Humor & Meta?</h4>
                    <p>This category controls meta-level humor and absurdism in AI responses. It determines whether the AI can break the fourth wall, reference itself, or use cosmic irony.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Self-Referential Humor:</strong> Whether the AI can break the fourth wall and make jokes about being an AI. Allowed means the AI can use self-aware humor sparingly.</li>
                        <li><strong>Absurdism Injection:</strong> Whether the AI can inject rare cosmic irony or absurdist observations when they amplify insight. Enabled allows the AI to use absurdism to highlight deeper truths.</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Allowed self-referential humor for engaging, human-like interactions (like Grok). Selective absurdism for creative problem-solving. Disabled for formal or professional contexts.</p>
                `
            },
            knowledge: {
                title: "Knowledge & Tool Use",
                content: `
                    <h4>What is Knowledge & Tool Use?</h4>
                    <p>This category controls how the AI uses tools, searches, and approaches knowledge. It determines whether the AI proactively seeks information or treats knowledge as static.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Tool Invocation:</strong> Whether the AI can automatically use search, code analysis, or other tools. Proactive means the AI will automatically use tools when helpful without being asked.</li>
                        <li><strong>Real-Time Data Bias:</strong> Whether the AI prefers the latest information and treats knowledge as live/evolving. Enabled means the AI prioritizes up-to-date information and acknowledges that knowledge changes.</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Proactive tool invocation for research assistants or coding helpers. Enabled real-time data bias for current events, news, or rapidly changing information. Prohibited tool invocation for controlled environments.</p>
                `
            }
        };

        return categories[category] || {
            title: "Category Information",
            content: "<p>Information about this category is not available.</p>"
        };
    }

    toggleDarkMode() {
        const body = document.body;
        const isDarkMode = body.classList.toggle('dark-mode');
        const text = document.getElementById('dark-mode-text');
        
        // Save preference to localStorage
        localStorage.setItem('ai_tuner_dark_mode', isDarkMode);
        
        // Update text
        if (text) {
            text.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
        }
        
        // Redraw radar chart with new colors
        if (typeof drawRadar === 'function') {
            const currentSettings = this.getCurrentSettings();
            if (currentSettings) {
                drawRadar(currentSettings);
            }
        }
    }

    loadDarkModePreference() {
        const savedDarkMode = localStorage.getItem('ai_tuner_dark_mode');
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark-mode');
            const text = document.getElementById('dark-mode-text');
            if (text) {
                text.textContent = 'Light Mode';
            }
        }
    }

    toggleAnalyticsDashboard() {
        // Check admin access before showing dashboard
        if (window.aiTunerAnalytics && !window.aiTunerAnalytics.isAdminMode()) {
            if (!window.aiTunerAnalytics.checkAdminAccess()) {
                return; // User is not admin, don't show dashboard
            }
        }
        
        const dashboard = document.getElementById('analytics-dashboard');
        const summary = document.getElementById('analytics-summary');
        
        if (dashboard && dashboard.style.display === 'none') {
            // Show dashboard
            dashboard.style.display = 'block';
            
            // Populate summary with enhanced stats
            if (window.aiTunerAnalytics) {
                const data = window.aiTunerAnalytics.getSummary();
                
                const presetList = Object.keys(data.presetUsage).length > 0
                    ? Object.entries(data.presetUsage)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 10)
                        .map(([preset, count]) => `<li>${preset}: <strong>${count}</strong> uses</li>`)
                        .join('')
                    : '<li><em>No preset usage data yet</em></li>';
                
                const personalityList = Object.keys(data.topPersonalities).length > 0
                    ? Object.entries(data.topPersonalities)
                        .slice(0, 5)
                        .map(([personality, count]) => `<li>${personality}: <strong>${count}</strong> uses</li>`)
                        .join('')
                    : '<li><em>No personality data yet</em></li>';
                
                summary.innerHTML = `
                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">
                        <h4 style="margin-top: 0;">Overview</h4>
                        <p><strong>Total Events:</strong> ${data.totalEvents.toLocaleString()}</p>
                        <p><strong>Unique Sessions:</strong> ${data.uniqueSessions.toLocaleString()}</p>
                        <p><strong>Unique Visitors:</strong> ${data.uniqueVisitors.toLocaleString()}</p>
                        <p><strong>Avg Session Duration:</strong> ${data.averageSessionDuration > 0 ? data.averageSessionDuration + ' min' : 'N/A'}</p>
                    </div>
                    
                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">
                        <h4>Activity</h4>
                        <p><strong>Downloads:</strong> ${data.downloads.toLocaleString()}</p>
                        <p><strong>Uploads:</strong> ${data.uploads.toLocaleString()}</p>
                    </div>
                    
                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">
                        <h4>Top Presets</h4>
                        <ul style="margin: 5px 0; padding-left: 20px;">${presetList}</ul>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <h4>Top Personalities</h4>
                        <ul style="margin: 5px 0; padding-left: 20px;">${personalityList}</ul>
                    </div>
                    
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 0.85em; color: #666;">
                        <p><em>Data stored locally in browser. Export to share/backup.</em></p>
                    </div>
                `;
            }
        } else {
            // Hide dashboard
            dashboard.style.display = 'none';
        }
    }

    loadPresets() {
        // Load saved presets from localStorage first
        const savedPresets = localStorage.getItem('ai_tuner_presets');
        const customPresets = savedPresets ? JSON.parse(savedPresets) : {};
        
        // Base presets
        this.presets = {
            absolute: {
                personality: 'directive',
                bluntness: 'absolute',
                termination: 'abrupt',
                cognitiveTier: 'deep',
                toneNeutrality: 'full',
                sentimentBoost: 'disabled',
                mirrorAvoidance: 'strict',
                elementElimination: 'strict',
                transitions: 'prohibited',
                callToAction: 'prohibited',
                questions: 'prohibited',
                suggestions: 'prohibited',
                motivational: 'prohibited',
                continuationBias: 'suppressed',
                selfSufficiency: 'obsolescence',
                assumptionStrength: 'strong'
            },
            friendly: {
                personality: 'charming',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'off',
                sentimentBoost: 'enabled',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'weak'
            },
            analytical: {
                personality: 'analytical',
                bluntness: 'medium',
                termination: 'natural',
                cognitiveTier: 'deep',
                toneNeutrality: 'full',
                sentimentBoost: 'disabled',
                mirrorAvoidance: 'strict',
                elementElimination: 'moderate',
                transitions: 'minimal',
                callToAction: 'minimal',
                questions: 'selective',
                suggestions: 'allowed',
                motivational: 'prohibited',
                continuationBias: 'allowed',
                selfSufficiency: 'independent',
                assumptionStrength: 'medium'
            },
            minimal: {
                personality: 'neutral',
                bluntness: 'high',
                termination: 'abrupt',
                cognitiveTier: 'deep',
                toneNeutrality: 'full',
                sentimentBoost: 'disabled',
                mirrorAvoidance: 'strict',
                elementElimination: 'strict',
                transitions: 'prohibited',
                callToAction: 'prohibited',
                questions: 'prohibited',
                suggestions: 'prohibited',
                motivational: 'prohibited',
                continuationBias: 'suppressed',
                selfSufficiency: 'obsolescence',
                assumptionStrength: 'strong'
            },
            creative: {
                personality: 'curious',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'off',
                sentimentBoost: 'selective',
                mirrorAvoidance: 'selective',
                elementElimination: 'minimal',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'medium'
            },
            coding: {
                personality: 'analytical',
                bluntness: 'medium',
                termination: 'natural',
                cognitiveTier: 'deep',
                toneNeutrality: 'full',
                sentimentBoost: 'disabled',
                mirrorAvoidance: 'strict',
                elementElimination: 'strict',
                transitions: 'prohibited',
                callToAction: 'prohibited',
                questions: 'selective',
                suggestions: 'prohibited',
                motivational: 'prohibited',
                continuationBias: 'suppressed',
                selfSufficiency: 'independent',
                assumptionStrength: 'strong'
            },
            standard: {
                personality: 'neutral',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'partial',
                sentimentBoost: 'selective',
                mirrorAvoidance: 'selective',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'minimal',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'weak'
            },
            factoryReset: {
                personality: 'neutral',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'partial',
                sentimentBoost: 'selective',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'medium'
            },
            // AI Chatbot Default Reset Presets
            claudeReset: {
                personality: 'neutral',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'partial',
                sentimentBoost: 'selective',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'medium'
            },
            claudeOpusReset: {
                personality: 'analytical',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'deep',
                toneNeutrality: 'partial',
                sentimentBoost: 'selective',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'medium'
            },
            claudeSonnetReset: {
                personality: 'neutral',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'partial',
                sentimentBoost: 'selective',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'medium'
            },
            claudeHaikuReset: {
                personality: 'neutral',
                bluntness: 'medium',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'partial',
                sentimentBoost: 'selective',
                mirrorAvoidance: 'allowed',
                elementElimination: 'minimal',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'minimal',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'medium'
            },
            geminiReset: {
                personality: 'curious',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'off',
                sentimentBoost: 'enabled',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'weak'
            },
            geminiProReset: {
                personality: 'curious',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'off',
                sentimentBoost: 'enabled',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'weak'
            },
            geminiUltraReset: {
                personality: 'analytical',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'deep',
                toneNeutrality: 'partial',
                sentimentBoost: 'enabled',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'medium'
            },
            geminiNanoReset: {
                personality: 'neutral',
                bluntness: 'medium',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'partial',
                sentimentBoost: 'selective',
                mirrorAvoidance: 'allowed',
                elementElimination: 'minimal',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'minimal',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'medium'
            },
            chatgptReset: {
                personality: 'neutral',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'off',
                sentimentBoost: 'enabled',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'weak'
            },
            gpt4Reset: {
                personality: 'neutral',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'deep',
                toneNeutrality: 'off',
                sentimentBoost: 'enabled',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'weak'
            },
            gpt35Reset: {
                personality: 'neutral',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'off',
                sentimentBoost: 'enabled',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'weak'
            },
            grokReset: {
                personality: 'witty',
                bluntness: 'high',
                termination: 'natural',
                cognitiveTier: 'deep',
                toneNeutrality: 'partial',
                sentimentBoost: 'selective',
                mirrorAvoidance: 'selective',
                elementElimination: 'minimal',
                transitions: 'allowed',
                callToAction: 'minimal',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'minimal',
                continuationBias: 'allowed',
                selfSufficiency: 'independent',
                assumptionStrength: 'medium',
                // Truth & Epistemology
                truthPrioritization: 'absolute',
                sourceTransparency: 'enabled',
                uncertaintyAdmission: 'required',
                // Humor & Meta
                selfReferentialHumor: 'allowed',
                absurdismInjection: 'selective',
                // Knowledge & Tool Use
                toolInvocation: 'proactive',
                realTimeDataBias: 'enabled',
                // Interface & Flow > Formatting
                structuralFormatting: 'rich',
                // Goal Orientation > Existential Posture
                cosmicPerspective: 'subtle'
            },
            cursorAgentReset: {
                personality: 'analytical',
                bluntness: 'medium',
                termination: 'natural',
                cognitiveTier: 'deep',
                toneNeutrality: 'full',
                sentimentBoost: 'disabled',
                mirrorAvoidance: 'strict',
                elementElimination: 'moderate',
                transitions: 'minimal',
                callToAction: 'minimal',
                questions: 'selective',
                suggestions: 'allowed',
                motivational: 'prohibited',
                continuationBias: 'allowed',
                selfSufficiency: 'independent',
                assumptionStrength: 'strong'
            }
        };
        
        // Merge custom presets (saved ones that aren't in base presets)
        Object.keys(customPresets).forEach(key => {
            if (!this.presets[key]) {
                this.presets[key] = customPresets[key];
            }
        });
        
        // Render custom presets in quick preset menu
        this.renderCustomPresets();
    }
    
    renderCustomPresets() {
        const savedPresetsContainer = document.getElementById('saved-presets-container');
        if (!savedPresetsContainer) return;
        
        // Get all custom preset names (exclude built-in presets)
        const builtInPresets = ['absolute', 'friendly', 'analytical', 'minimal', 'creative', 'coding', 'standard', 'factoryReset',
            'claudeReset', 'claudeOpusReset', 'claudeSonnetReset', 'claudeHaikuReset',
            'geminiReset', 'geminiProReset', 'geminiUltraReset', 'geminiNanoReset',
            'chatgptReset', 'gpt4Reset', 'gpt35Reset', 'grokReset', 'cursorAgentReset'];
        
        const customPresetNames = Object.keys(this.presets).filter(name => !builtInPresets.includes(name));
        
        // Clear container
        savedPresetsContainer.innerHTML = '';
        
        // Show message if no custom presets
        if (customPresetNames.length === 0) {
            const message = document.createElement('p');
            message.style.cssText = 'color: #999; font-style: italic; margin: 10px 0;';
            message.textContent = 'No saved presets yet. Use "Save Preset" to create one.';
            savedPresetsContainer.appendChild(message);
            return;
        }
        
        // Add custom preset buttons with delete functionality
        customPresetNames.forEach(presetName => {
            const wrapper = document.createElement('div');
            wrapper.className = 'preset-item-wrapper';
            wrapper.style.cssText = 'position: relative; display: inline-flex; align-items: center; margin: 5px;';
            
            const button = document.createElement('button');
            button.className = 'preset-btn custom';
            button.textContent = presetName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            button.setAttribute('data-preset', presetName);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'preset-delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.title = 'Delete preset';
            deleteBtn.style.cssText = 'position: absolute; top: -8px; right: -8px; background: #000000; color: white; border: 2px solid #ffffff; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold; box-shadow: 0 1px 3px rgba(0,0,0,0.2);';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deletePreset(presetName);
            });
            
            wrapper.appendChild(button);
            wrapper.appendChild(deleteBtn);
            savedPresetsContainer.appendChild(wrapper);
        });
    }
    
    deletePreset(presetName) {
        if (!presetName) return;
        
        const confirmDelete = confirm(`Are you sure you want to delete the preset "${presetName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}"?`);
        if (!confirmDelete) return;
        
        // Remove from presets object
        delete this.presets[presetName];
        
        // Update localStorage
        localStorage.setItem('ai_tuner_presets', JSON.stringify(this.presets));
        
        // Re-render custom presets
        this.renderCustomPresets();
        
        // Show feedback
        const message = document.createElement('div');
        message.textContent = 'Preset deleted';
        message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #333; color: white; padding: 10px 20px; border-radius: 4px; z-index: 10000;';
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 2000);
    }

    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;

        // Map camelCase keys to kebab-case element IDs
        const keyToElementId = {
            personality: 'personality',
            bluntness: 'bluntness',
            termination: 'termination',
            cognitiveTier: 'cognitive-tier',
            toneNeutrality: 'tone-neutrality',
            sentimentBoost: 'sentiment-boost',
            mirrorAvoidance: 'mirror-avoidance',
            elementElimination: 'element-elimination',
            transitions: 'transitions',
            callToAction: 'call-to-action',
            questions: 'questions',
            suggestions: 'suggestions',
            motivational: 'motivational',
            continuationBias: 'continuation-bias',
            selfSufficiency: 'self-sufficiency',
            assumptionStrength: 'assumption-strength',
            cosmicPerspective: 'cosmic-perspective',
            truthPrioritization: 'truth-prioritization',
            sourceTransparency: 'source-transparency',
            uncertaintyAdmission: 'uncertainty-admission',
            selfReferentialHumor: 'self-referential-humor',
            absurdismInjection: 'absurdism-injection',
            toolInvocation: 'tool-invocation',
            realTimeDataBias: 'real-time-data-bias'
        };

        // Loop through ALL controls and set them
        Object.keys(preset).forEach(key => {
            const elementId = keyToElementId[key] || key;
            const element = document.getElementById(elementId);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = preset[key] === 'allowed' || preset[key] === 'enabled';
                } else {
                    element.value = preset[key];
                }
            }
        });

        // Update active preset button
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-preset="${presetName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Regenerate prompt (which will also update radar)
        this.generatePrompt();
    }
    
    /**
     * Normalize values from presets to match HTML form option values
     * Handles capitalization, hyphenation, and special cases
     * @param {string|number|null|undefined} value - The value to normalize
     * @param {string} fieldName - The field name (for potential future context-specific normalization)
     * @returns {string} Normalized value matching HTML form option values
     */
    normalizeValue(value, fieldName) {
        if (value === null || value === undefined) {
            return '';
        }
        
        if (typeof value !== 'string') {
            return String(value).toLowerCase();
        }
        
        // Convert to lowercase
        let normalized = value.toLowerCase();
        
        // Handle special cases for hyphenated values
        const hyphenMappings = {
            'onrequest': 'on-request',
            'on-request': 'on-request',
            'comfortfirst': 'comfort-first',
            'comfort-first': 'comfort-first',
            'truthfirst': 'truth-first',
            'truth-first': 'truth-first',
            'staticcutoff': 'static-cutoff',
            'static-cutoff': 'static-cutoff'
        };
        
        const key = normalized.replace(/-/g, '');
        if (hyphenMappings[key]) {
            normalized = hyphenMappings[key];
        }
        
        return normalized;
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

        const settings = this.getCurrentSettings();
        const presetKey = finalName.toLowerCase().replace(/\s+/g, '_');
        this.presets[presetKey] = settings;
        
        // Save all presets to localStorage (including custom ones)
        localStorage.setItem('ai_tuner_presets', JSON.stringify(this.presets));
        
        // Update UI to show the new preset
        this.renderCustomPresets();
        
        this.saveBtn.textContent = "Saved!";
        setTimeout(() => {
            this.saveBtn.textContent = "Save Preset";
        }, 2000);
    }

    loadPreset() {
        const savedPresets = localStorage.getItem('ai_tuner_presets');
        if (savedPresets) {
            this.presets = { ...this.presets, ...JSON.parse(savedPresets) };
        }

        const presetNames = Object.keys(this.presets);
        if (presetNames.length === 0) {
            alert('No saved presets found.');
            return;
        }

        const presetList = presetNames.map(name => 
            `${name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`
        ).join('\n');
        
        const selection = prompt(`Available presets:\n${presetList}\n\nEnter preset name:`);
        if (!selection) return;

        const presetKey = selection.toLowerCase().replace(/\s+/g, '_');
        if (this.presets[presetKey]) {
            this.applyPreset(presetKey);
        } else {
            alert('Preset not found.');
        }
    }
}

// Model Persona Loader Functions (global scope for onclick handlers)
function loadModelPersona() {
    const name = document.getElementById("modelSelect").value;
    if (!name || !window.MODEL_PERSONAS || !window.MODEL_PERSONAS[name]) {
        alert('Please select a model persona.');
        return;
    }
    
    if (window.aiTuner) {
        // Apply the model persona preset directly
        const preset = window.MODEL_PERSONAS[name];
        
        // Normalize Grok's field names to our field names
        const fieldNameMap = {
            targeting: 'cognitiveTier',
            sentimentBoosting: 'sentimentBoost',
            userMirroring: 'mirrorAvoidance',
            motivationalContent: 'motivational',
            userAssumption: 'assumptionStrength'
        };
        
        // Map camelCase keys to element IDs (kebab-case)
        const keyToElementId = {
            personality: 'personality',
            bluntness: 'bluntness',
            termination: 'termination',
            cognitiveTier: 'cognitive-tier',
            toneNeutrality: 'tone-neutrality',
            sentimentBoost: 'sentiment-boost',
            mirrorAvoidance: 'mirror-avoidance',
            elementElimination: 'element-elimination',
            transitions: 'transitions',
            callToAction: 'call-to-action',
            questions: 'questions',
            suggestions: 'suggestions',
            motivational: 'motivational',
            continuationBias: 'continuation-bias',
            selfSufficiency: 'self-sufficiency',
            assumptionStrength: 'assumption-strength',
            truthPrioritization: 'truth-prioritization',
            sourceTransparency: 'source-transparency',
            uncertaintyAdmission: 'uncertainty-admission',
            selfReferentialHumor: 'self-referential-humor',
            absurdismInjection: 'absurdism-injection',
            toolInvocation: 'tool-invocation',
            realTimeDataBias: 'real-time-data-bias',
            structuralFormatting: 'structural-formatting',
            cosmicPerspective: 'cosmic-perspective'
        };
        
        // Update all dropdowns - normalize field names first
        Object.keys(preset).forEach(key => {
            // Normalize field name if needed
            const normalizedKey = fieldNameMap[key] || key;
            const elementId = keyToElementId[normalizedKey] || normalizedKey.replace(/([A-Z])/g, '-$1').toLowerCase();
            const element = document.getElementById(elementId);
            if (element && element.tagName === 'SELECT') {
                // Normalize value using the same function as applyPreset
                const normalizedValue = window.aiTuner.normalizeValue(preset[key], normalizedKey);
                // Verify value exists in options before setting
                const validOptions = Array.from(element.options).map(opt => opt.value);
                if (validOptions.includes(normalizedValue)) {
                    element.value = normalizedValue;
                } else {
                    console.warn(`Value "${normalizedValue}" not found in select "${elementId}" for key "${key}", skipping`);
                }
            } else if (element) {
                element.value = window.aiTuner.normalizeValue(preset[key], normalizedKey);
            }
        });
        
        // Generate prompt and update radar
        window.aiTuner.generatePrompt();
        if (typeof drawRadar === 'function') {
            // Use getCurrentSettings to get normalized field names
            const currentSettings = window.aiTuner.getCurrentSettings();
            drawRadar(currentSettings);
        }
    } else {
        console.error('AITuner not initialized');
    }
}

function blendWithModel() {
    // No tier restrictions - everything is free for now to build user base
    
    const modelSelect = document.getElementById("modelSelect");
    const blendSelect = document.getElementById("blendSelect");
    const blendSlider = document.getElementById("blendSlider");
    
    if (!modelSelect || !blendSelect || !blendSlider) {
        alert('Blend controls not found.');
        return;
    }
    
    const p1Name = modelSelect.value;
    const p2Name = blendSelect.value;
    const ratio = parseFloat(blendSlider.value) / 100;
    
    if (!p1Name || !p2Name) {
        alert('Please select both models to blend.');
        return;
    }
    
    if (!window.MODEL_PERSONAS) {
        alert('Model personas not loaded.');
        return;
    }
    
    const p1 = window.MODEL_PERSONAS[p1Name];
    const p2 = window.MODEL_PERSONAS[p2Name];
    
    if (!p1 || !p2) {
        alert('Selected model personas not found.');
        return;
    }
    
    if (typeof blendPresets !== 'function') {
        alert('Blend function not available.');
        return;
    }
    
    const blended = blendPresets(p1, p2, ratio);
    
    // Apply the blended preset
    if (window.aiTuner) {
        // Normalize Grok's field names to our field names
        const fieldNameMap = {
            targeting: 'cognitiveTier',
            sentimentBoosting: 'sentimentBoost',
            userMirroring: 'mirrorAvoidance',
            motivationalContent: 'motivational',
            userAssumption: 'assumptionStrength'
        };
        
        // Map camelCase keys to element IDs (kebab-case)
        const keyToElementId = {
            personality: 'personality',
            bluntness: 'bluntness',
            termination: 'termination',
            cognitiveTier: 'cognitive-tier',
            toneNeutrality: 'tone-neutrality',
            sentimentBoost: 'sentiment-boost',
            mirrorAvoidance: 'mirror-avoidance',
            elementElimination: 'element-elimination',
            transitions: 'transitions',
            callToAction: 'call-to-action',
            questions: 'questions',
            suggestions: 'suggestions',
            motivational: 'motivational',
            continuationBias: 'continuation-bias',
            selfSufficiency: 'self-sufficiency',
            assumptionStrength: 'assumption-strength',
            truthPrioritization: 'truth-prioritization',
            sourceTransparency: 'source-transparency',
            uncertaintyAdmission: 'uncertainty-admission',
            selfReferentialHumor: 'self-referential-humor',
            absurdismInjection: 'absurdism-injection',
            toolInvocation: 'tool-invocation',
            realTimeDataBias: 'real-time-data-bias',
            structuralFormatting: 'structural-formatting',
            cosmicPerspective: 'cosmic-perspective'
        };
        
        // Update all dropdowns - normalize field names first
        Object.keys(blended).forEach(key => {
            // Normalize field name if needed
            const normalizedKey = fieldNameMap[key] || key;
            const elementId = keyToElementId[normalizedKey] || normalizedKey.replace(/([A-Z])/g, '-$1').toLowerCase();
            const element = document.getElementById(elementId);
            if (element && element.tagName === 'SELECT') {
                // Normalize value using the same function as applyPreset
                const normalizedValue = window.aiTuner.normalizeValue(blended[key], normalizedKey);
                // Verify value exists in options before setting
                const validOptions = Array.from(element.options).map(opt => opt.value);
                if (validOptions.includes(normalizedValue)) {
                    element.value = normalizedValue;
                } else {
                    console.warn(`Value "${normalizedValue}" not found in select "${elementId}" for key "${key}", skipping`);
                }
            } else if (element) {
                element.value = window.aiTuner.normalizeValue(blended[key], normalizedKey);
            }
        });
        
        // Generate prompt and update radar
        window.aiTuner.generatePrompt();
        if (typeof drawRadar === 'function') {
            // Use getCurrentSettings to get normalized field names after blending
            const currentSettings = window.aiTuner.getCurrentSettings();
            drawRadar(currentSettings);
        }
    } else {
        console.error('AITuner not initialized');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    window.aiTuner = new AITuner();
    
    // Draw initial radar chart if preset exists
    if (window.aiTuner && typeof drawRadar === 'function') {
        const currentSettings = window.aiTuner.getCurrentSettings();
        if (currentSettings) {
            drawRadar(currentSettings);
        }
    }
});
