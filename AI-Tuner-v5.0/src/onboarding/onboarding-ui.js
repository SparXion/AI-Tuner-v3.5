/**
 * AITuner v5.0 - Onboarding UI
 *
 * Narrative flow (script-aligned screen indices):
 * 0 Welcome, 1 Origin, 2 Promise, 3 Frustration cards, 4 Fix, 5 Reveal,
 * 6 Model selection, 7 Tuner (tier 0/1), 8 Preview & save
 */

class TierUnlock {
    constructor() {
        this.unlockCallbacks = [];
    }

    showTier1Unlock() {
        this.animateRadarUnlock();
        this.showToast(
            "You just built your first prompt. Now let's show you what you actually changed. →",
            'success'
        );
        this.updateTierBadge(1);
    }

    showTier2Unlock() {
        this.showToast("You've been adjusting levers. Time to see the full picture. →", 'success');
        this.updateTierBadge(2);
    }

    animateRadarUnlock() {
        const radarCharts = document.querySelectorAll('.radar-chart');
        radarCharts.forEach((chart) => {
            chart.classList.add('unlocking');
            setTimeout(() => {
                chart.classList.remove('unlocking');
            }, 2000);
        });
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `aituner-toast aituner-toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.add('aituner-toast-show');
        });
        setTimeout(() => {
            toast.classList.remove('aituner-toast-show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    updateTierBadge(tier) {
        const badge = document.querySelector('.tier-badge');
        if (badge) {
            badge.setAttribute('data-tier', tier);
            badge.textContent = 'My Profile';
        }
    }
}

const ONBOARDING_FRUSTRATIONS = [
    {
        id: 'tips',
        title: "It keeps adding tips I didn't ask for",
        sub: 'Always one more suggestion',
        leverKey: 'initiative',
        fixValue: 1
    },
    {
        id: 'hedge',
        title: "It hedges everything with 'maybe' and 'it depends'",
        sub: 'Just tell me what you think',
        leverKey: 'assertiveness',
        fixValue: 8
    },
    {
        id: 'robot',
        title: "It's too formal — feels like talking to a robot",
        sub: 'I want it to sound more human',
        leverKey: 'formality',
        fixValue: 3
    },
    {
        id: 'explain',
        title: 'It over-explains things I already know',
        sub: 'Treat me like an adult',
        leverKey: 'teachingMode',
        fixValue: 2
    },
    {
        id: 'long',
        title: "It's too long — I just want the answer",
        sub: 'Get to the point',
        leverKey: 'conciseness',
        fixValue: 2
    },
    {
        id: 'cold',
        title: 'It feels cold and clinical',
        sub: 'I want a bit more warmth',
        leverKey: 'emotionalWarmth',
        fixValue: 8
    }
];

class OnboardingUI {
    constructor(engine, onboardingState) {
        this.engine = engine;
        this.onboardingState = onboardingState;
        this.container = null;
        this.currentScreen = null;
        this.tierUnlock = new TierUnlock();
        this.radarApi = null;
        this.selectedFrustrationId = null;
        this.revealRadarApi = null;
        this.skippedRevealAfterFix = false;
        this._promptUnwatch = null;

        this.engine.onTierChange = (tier) => {
            this.onboardingState.loadState();
            this.handleTierUnlock(tier);
            if (tier === 1 && this.currentScreen === 7) {
                this.showScreen(7);
            }
            if (tier >= 2 && this.currentScreen === 7) {
                this.initializeRadar();
            }
        };
    }

    initialize(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('OnboardingUI: Container not found', containerId);
            return;
        }
        if (this.engine.session && !this.engine.session.entry_point) {
            this.engine.setEntryPoint('guided');
        }
        if (!this.engine.selectedIntent) {
            this.engine.setIntent('think');
        }
        this.showScreen(0);
    }

    escapeHtmlForTemplate(s) {
        const d = document.createElement('div');
        d.textContent = s == null ? '' : String(s);
        return d.innerHTML;
    }

    mountPromptPreviewHost(hostEl) {
        if (!hostEl || !window.PromptPreviewUi || typeof window.PromptPreviewUi.wireEngine !== 'function') {
            return;
        }
        if (typeof this._promptUnwatch === 'function') {
            this._promptUnwatch();
            this._promptUnwatch = null;
        }
        this._promptUnwatch = window.PromptPreviewUi.wireEngine(this.engine, hostEl);
    }

    showScreen(screenNumber) {
        if (this.revealRadarApi && typeof this.revealRadarApi.destroy === 'function') {
            this.revealRadarApi.destroy();
            this.revealRadarApi = null;
        }
        if (typeof this._promptUnwatch === 'function') {
            this._promptUnwatch();
            this._promptUnwatch = null;
        }
        this.currentScreen = screenNumber;

        switch (screenNumber) {
            case 0:
                this.showWelcomeScreen();
                break;
            case 1:
                this.showOriginScreen();
                break;
            case 2:
                this.showPromiseScreen();
                break;
            case 3:
                this.showFrustrationScreen();
                break;
            case 4:
                this.showFixScreen();
                break;
            case 5:
                this.showRevealScreen();
                break;
            case 6:
                this.showModelSelection();
                break;
            case 7:
                this.showTunerScreen();
                break;
            case 8:
                this.showPreviewAndSave();
                break;
            default:
                this.showWelcomeScreen();
        }
    }

    showWelcomeScreen() {
        const html = `
            <div class="onboarding-screen welcome-screen narrative-welcome">
                <div class="screen-content narrative-content">
                    <h1>AI is more flexible than anyone told you.</h1>
                    <p class="subtitle narrative-sub">AITuner shows you what's under the hood — and helps you take the wheel.</p>
                    <div class="welcome-actions">
                        <button type="button" class="primary-btn" onclick="onboardingUI.nextScreen()">Show me →</button>
                        <button type="button" class="secondary-btn" onclick="onboardingUI.skipToFull()">I already know what I'm doing — skip to full controls</button>
                    </div>
                </div>
            </div>
        `;
        this.renderScreen(html, false);
    }

    showOriginScreen() {
        const html = `
            <div class="onboarding-screen origin-screen">
                <div class="screen-content narrative-content narrative-origin">
                    <p class="narrative-label">Why this exists</p>
                    <h1>It started with a prompt on Instagram.</h1>
                    <div class="narrative-body">
                        <p>I've been using AI for about a year and a half at this point and had learned through trial and error how to navigate in the AI model space. I even learned the term 'answer only.'</p>
                        <p>I was flipping through Instagram and came across this post about 'Absolute Mode.' After reading, I immediately copied it into Grok and Claude and was amazed at the result. Clean answer. No fluff. No personality. Just the answer.</p>
                        <p>Chasing my curiosity, I wondered what elements he was changing with that prompt. What levers was he pulling? So I put it into Grok and asked Grok to deconstruct it for me. 'What levers is he pulling with this prompt?' That's when I first learned the term persona. Each model has a persona. This curiosity unlocked the idea that you can tune your AI model's persona.</p>
                        <p>That's how AITuner was born.</p>
                    </div>
                    <p class="narrative-signature">— John Violette, founder</p>
                    <button type="button" class="primary-btn" onclick="onboardingUI.nextScreen()">Let's find yours →</button>
                </div>
            </div>
        `;
        this.renderScreen(html, false);
    }

    showPromiseScreen() {
        const html = `
            <div class="onboarding-screen promise-screen">
                <div class="screen-content narrative-content">
                    <p class="narrative-label">Here's how this works</p>
                    <h1>We'll go at your pace.<br>One thing at a time.</h1>
                    <ul class="promise-beats">
                        <li><span class="promise-icon promise-icon-search" aria-hidden="true"></span> First, we'll find what's been bugging you about AI.</li>
                        <li><span class="promise-icon promise-icon-dial" aria-hidden="true"></span> Then, we'll show you how to fix it.</li>
                        <li><span class="promise-icon promise-icon-rocket" aria-hidden="true"></span> Then, we'll show you how much further you can go.</li>
                    </ul>
                    <p class="subtitle narrative-sub">You don't need to know anything yet. That's the whole point.</p>
                    <button type="button" class="primary-btn" onclick="onboardingUI.nextScreen()">I'm ready →</button>
                </div>
            </div>
        `;
        this.renderScreen(html, false);
    }

    showFrustrationScreen() {
        const cards = ONBOARDING_FRUSTRATIONS.map(
            (f) => `
            <button type="button" class="frustration-card${this.selectedFrustrationId === f.id ? ' selected' : ''}" data-frustration="${f.id}" onclick="onboardingUI.selectFrustration('${f.id}')">
                <span class="frustration-title">${f.title}</span>
                <span class="frustration-sub">${f.sub}</span>
            </button>
        `
        ).join('');

        const html = `
            <div class="onboarding-screen frustration-screen">
                <div class="screen-content narrative-content">
                    <p class="narrative-label">Let's start here</p>
                    <h1>What's been bothering you about how AI talks to you?</h1>
                    <p class="subtitle narrative-sub">Pick the one that's most familiar. We'll fix it first.</p>
                    <div class="frustration-grid">${cards}</div>
                    <button type="button" class="secondary-btn frustration-explore" onclick="onboardingUI.exploreOnOwn()">None of these — let me explore on my own →</button>
                    <div class="screen-nav">
                        <button type="button" class="nav-btn" onclick="onboardingUI.prevScreen()">← Back</button>
                        <button type="button" class="primary-btn" id="frustration-continue" onclick="onboardingUI.continueFromFrustration()" ${this.selectedFrustrationId ? '' : 'disabled'}>Continue →</button>
                    </div>
                </div>
            </div>
        `;
        this.renderScreen(html, false);
    }

    selectFrustration(id) {
        this.selectedFrustrationId = id;
        this.showScreen(3);
    }

    continueFromFrustration() {
        if (!this.selectedFrustrationId) {
            return;
        }
        this.nextScreen();
    }

    exploreOnOwn() {
        if (typeof window.router !== 'undefined' && window.router.navigateTo) {
            window.router.navigateTo('discovery');
        }
    }

    applyFrustrationFix() {
        const card = ONBOARDING_FRUSTRATIONS.find((f) => f.id === this.selectedFrustrationId);
        if (!card) {
            return;
        }
        if (!this.engine.selectedModel) {
            this.engine.selectModel('claude');
        }
        this.engine.loadModelDefaults();
        this.engine.adjustLever(card.leverKey, card.fixValue);
    }

    showFixScreen() {
        this.applyFrustrationFix();
        if (!this.engine.selectedModel) {
            this.engine.selectModel('claude');
        } else {
            this.engine.generatePrompt();
        }
        const html = `
            <div class="onboarding-screen fix-screen">
                <div class="screen-content narrative-content">
                    <p class="narrative-label">Here's your fix</p>
                    <h1>We built you a prompt.<br>Copy it. Paste it. Feel the difference.</h1>
                    <div class="prompt-preview narrative-prompt-preview" id="prompt-preview">
                        <div class="prompt-preview-body-host"></div>
                        <button type="button" class="copy-btn" onclick="onboardingUI.copyPromptFromFix()">Copy prompt</button>
                    </div>
                    <p class="fix-instruction">Paste this at the start of your next conversation — or into the system prompt field if your AI supports it.</p>
                    <div class="fix-cta-row">
                        <button type="button" class="secondary-btn" onclick="onboardingUI.nextScreen()">What does this actually do? →</button>
                    </div>
                    <p class="fix-footnote">Works with Claude, ChatGPT, Gemini, Grok, and most others.</p>
                    <div class="screen-nav">
                        <button type="button" class="nav-btn" onclick="onboardingUI.prevScreen()">← Back</button>
                    </div>
                </div>
            </div>
        `;
        this.renderScreen(html, false);
        const ppHost =
            typeof document !== 'undefined' && document.getElementById('prompt-preview')
                ? document.getElementById('prompt-preview').querySelector('.prompt-preview-body-host')
                : null;
        this.mountPromptPreviewHost(ppHost);
    }

    copyPromptFromFix() {
        this.engine.copyPrompt();
        if (this.onboardingState.getTierBadge().tier >= 1) {
            this.skippedRevealAfterFix = true;
            this.showScreen(6);
        }
    }

    getRevealBodyHtml(leverKey) {
        if (leverKey === 'initiative') {
            return `<p>That prompt adjusted one specific dimension of how the AI behaves. We call it Initiative — how proactively the AI volunteers information beyond what you asked for.</p>
                <p>You turned it down.</p>
                <p>That's it. One instruction. One change. Immediate result.</p>
                <p>There are 15 more dimensions like this one. Together, they shape the entire personality of your AI.</p>`;
        }
        const lever = window.LEVERS_V5 && window.LEVERS_V5[leverKey];
        const name = lever ? lever.name : leverKey;
        const desc = lever ? lever.description : '';
        return `<p>That prompt adjusted one specific dimension of how the AI behaves. We call it ${name} — ${desc}</p>
            <p>You adjusted how strongly that behavior shows up in your prompt.</p>
            <p>That's it. One instruction. One change. Immediate result.</p>
            <p>There are 15 more dimensions like this one. Together, they shape the entire personality of your AI.</p>`;
    }

    showRevealScreen() {
        this.skippedRevealAfterFix = false;
        const card = ONBOARDING_FRUSTRATIONS.find((f) => f.id === this.selectedFrustrationId);
        const leverKey = card ? card.leverKey : 'initiative';
        const html = `
            <div class="onboarding-screen reveal-screen">
                <div class="screen-content narrative-content">
                    <p class="narrative-label">What just happened</p>
                    <h1>You just pulled a lever.</h1>
                    <div class="reveal-body">${this.getRevealBodyHtml(leverKey)}</div>
                    <div id="reveal-radar-host" class="reveal-radar-host"></div>
                    <p class="reveal-caption">This is what you just changed. The other axes? You'll unlock those as we go.</p>
                    <button type="button" class="primary-btn" onclick="onboardingUI.nextScreen()">Show me what else is possible →</button>
                    <button type="button" class="secondary-btn reveal-quiet" onclick="onboardingUI.savePromptAndExit()">I'm good for now — save this prompt and come back later →</button>
                    <div class="screen-nav">
                        <button type="button" class="nav-btn" onclick="onboardingUI.prevScreen()">← Back</button>
                    </div>
                </div>
            </div>
        `;
        this.renderScreen(html, false);

        const host = document.getElementById('reveal-radar-host');
        if (host && typeof mountAITunerV5Radars === 'function') {
            mountAITunerV5Radars(this.engine, host, { tier: 2, highlightLeverKey: leverKey })
                .then((api) => {
                    this.revealRadarApi = api;
                })
                .catch((err) => console.error('Reveal radar failed', err));
        }
    }

    savePromptAndExit() {
        if (typeof window.router !== 'undefined' && window.router.showHome) {
            window.router.showHome();
        }
    }

    showModelSelection() {
        const models = Object.values(window.MODELS_V5);
        const intent = this.engine.selectedIntent || 'think';

        const modelCards = models
            .map((model) => {
                const sample = window.MODEL_SAMPLES[intent][model.id] || 'Sample response not available.';
                return `
                <div class="model-card" onclick="onboardingUI.selectModel('${model.id}')">
                    <div class="model-header">
                        <h3>${model.name}</h3>
                        <span class="model-provider">${model.provider}</span>
                    </div>
                    <p class="voice-signature">${model.voice_signature}</p>
                    <div class="sample-container">
                        <button type="button" class="sample-toggle" onclick="this.nextElementSibling.classList.toggle('expanded'); event.stopPropagation()">Show sample ▾</button>
                        <div class="sample-response">
                            <div class="sample-prompt">"${this.getIntentPrompt(intent)}"</div>
                            <div class="sample-answer">${sample}</div>
                        </div>
                    </div>
                </div>
            `;
            })
            .join('');

        const html = `
            <div class="onboarding-screen model-screen">
                <div class="screen-content">
                    <h1>Which AI are you tuning for?</h1>
                    <p class="subtitle">Each model has a distinct voice. Here's what that sounds like.</p>
                    <div class="model-grid">${modelCards}</div>
                    <div class="screen-nav">
                        <button type="button" class="nav-btn" onclick="onboardingUI.backFromModelScreen()">← Back</button>
                    </div>
                </div>
            </div>
        `;
        this.renderScreen(html, false);
    }

    backFromModelScreen() {
        if (this.skippedRevealAfterFix) {
            this.showScreen(4);
        } else {
            this.showScreen(5);
        }
    }

    showTunerScreen() {
        if (!this.engine.selectedModel) {
            this.engine.selectModel('claude');
        } else {
            this.engine.generatePrompt();
        }
        const tier = this.onboardingState.getTierBadge().tier;
        const html =
            tier === 0
                ? `
            <div class="onboarding-screen prompt-screen tier-0">
                <div class="screen-content">
                    <h1>Shape your AI's personality</h1>
                    <div class="prompt-preview" id="prompt-preview">
                        <div class="prompt-preview-body-host"></div>
                        <button type="button" class="copy-btn" onclick="onboardingUI.copyPrompt()">Copy prompt</button>
                    </div>
                    <div class="tier-hint">
                        <div class="radar-placeholder"><p>Copy your prompt above to unlock visual tuning.</p></div>
                    </div>
                    <div class="screen-nav">
                        <button type="button" class="nav-btn" onclick="onboardingUI.prevScreen()">← Back</button>
                        <button type="button" class="nav-btn" onclick="onboardingUI.unlockTier1()">Unlock visual tuning</button>
                    </div>
                </div>
            </div>
        `
                : `
            <div class="onboarding-screen prompt-screen tier-1">
                <div class="screen-content">
                    <h1>Shape your AI's personality</h1>
                    <div class="tuner-layout">
                        <div class="controls-panel">
                            <h3>Adjust these core controls:</h3>
                            <div id="slider-controls"></div>
                        </div>
                        <div class="radar-panel">
                            <div id="radar-container"></div>
                            <p class="radar-caption">5 of 16 controls — unlock all in Architect mode</p>
                        </div>
                    </div>
                    <div class="tier1-prompt-region">
                        <div class="prompt-preview" id="tier1-prompt-preview">
                            <div class="prompt-preview-body-host"></div>
                            <button type="button" class="copy-btn" onclick="onboardingUI.copyPrompt()">Copy prompt</button>
                        </div>
                    </div>
                    <div class="screen-nav">
                        <button type="button" class="nav-btn" onclick="onboardingUI.prevScreen()">← Back</button>
                        <button type="button" class="nav-btn" onclick="onboardingUI.nextScreen()">Continue →</button>
                    </div>
                </div>
            </div>
        `;
        this.renderScreen(html, true);
        if (tier === 0) {
            const el = typeof document !== 'undefined' ? document.getElementById('prompt-preview') : null;
            const h = el ? el.querySelector('.prompt-preview-body-host') : null;
            this.mountPromptPreviewHost(h);
        } else if (tier >= 1) {
            const root =
                typeof document !== 'undefined' ? document.getElementById('tier1-prompt-preview') : null;
            const host = root ? root.querySelector('.prompt-preview-body-host') : null;
            this.mountPromptPreviewHost(host);
        }
    }

    showPreviewAndSave() {
        if (!this.engine.selectedModel) {
            this.engine.selectModel('claude');
        } else {
            this.engine.generatePrompt();
        }
        const html = `
            <div class="onboarding-screen preview-screen">
                <div class="screen-content">
                    <h1>Ready to go</h1>
                    <div class="prompt-preview" id="final-prompt-preview">
                        <div class="prompt-preview-body-host"></div>
                        <button type="button" class="copy-btn" onclick="onboardingUI.copyPrompt()">Copy prompt</button>
                    </div>
                    <div class="persona-section">
                        <h3>Quick presets (optional)</h3>
                        <div id="persona-selector"></div>
                    </div>
                    <div class="save-section">
                        <input type="text" id="config-name" placeholder="Name this configuration" />
                        <button type="button" class="save-btn" onclick="onboardingUI.saveConfig()">Save this configuration</button>
                    </div>
                    <div class="unlock-hint">
                        <button type="button" class="unlock-btn" onclick="onboardingUI.unlockTier2()">Unlock all 16 controls →</button>
                    </div>
                </div>
            </div>
        `;
        this.renderScreen(html, false);

        const fpRoot = typeof document !== 'undefined' ? document.getElementById('final-prompt-preview') : null;
        const fpHost = fpRoot ? fpRoot.querySelector('.prompt-preview-body-host') : null;
        this.mountPromptPreviewHost(fpHost);
        const personaContainer = document.getElementById('persona-selector');
        if (personaContainer) {
            const personaSelector = new PersonaSelector(this.engine, 'persona-selector');
            personaSelector.render();
        }
    }

    renderScreen(html, initTunerWidgets) {
        if (this.container) {
            this.container.innerHTML = html;
            if (initTunerWidgets && this.currentScreen === 7 && this.onboardingState.getTierBadge().tier >= 1) {
                this.initializeSliders();
                this.initializeRadar();
            }
        }
    }

    initializeSliders() {
        const tier1Levers = this.onboardingState.getTier1Levers();
        const sliderContainer = document.getElementById('slider-controls');
        if (sliderContainer && tier1Levers) {
            const sliderControls = new SliderControls(this.engine, 'slider-controls');
            sliderControls.render(tier1Levers, 1);
        }
    }

    initializeRadar() {
        if (this.radarApi && typeof this.radarApi.destroy === 'function') {
            this.radarApi.destroy();
            this.radarApi = null;
        }
        const radarContainer = document.getElementById('radar-container');
        if (!radarContainer || typeof mountAITunerV5Radars !== 'function') {
            return;
        }
        const tierBadge = this.onboardingState.getTierBadge().tier;
        const radarTier = tierBadge >= 2 ? 2 : 1;
        mountAITunerV5Radars(this.engine, radarContainer, { tier: radarTier })
            .then((api) => {
                this.radarApi = api;
            })
            .catch((err) => {
                console.error('OnboardingUI: radar mount failed', err);
            });
    }

    selectModel(modelId) {
        sessionStorage.setItem('aituner_room_resume_onboarding', '7');
        if (typeof window.openModelRoom === 'function') {
            window.openModelRoom({ modelId: modelId, initialTab: 'entry' });
        } else {
            this.engine.selectModel(modelId);
            this.nextScreen();
        }
    }

    copyPrompt() {
        this.engine.copyPrompt();
    }

    saveConfig() {
        const nameInput = document.getElementById('config-name');
        const defaultName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'My Configuration';
        if (typeof window.openSaveConfigDialog === 'function') {
            window.openSaveConfigDialog({
                engine: this.engine,
                defaultName: defaultName
            });
        } else if (defaultName) {
            this.engine.saveConfig(defaultName);
        }
    }

    unlockTier1() {
        if (this.onboardingState.getTierBadge().tier === 0) {
            this.engine.copyPrompt();
        }
        this.showScreen(7);
    }

    unlockTier2() {
        this.onboardingState.handleSliderAdjust();
        this.navigateToArchitect();
    }

    handleTierUnlock(tier) {
        switch (tier) {
            case 1:
                this.tierUnlock.showTier1Unlock();
                break;
            case 2:
                this.tierUnlock.showTier2Unlock();
                break;
        }
    }

    navigateToArchitect() {
        if (this.engine && typeof this.engine.setEntryPoint === 'function') {
            this.engine.setEntryPoint('manual');
        }
        window.location.href = 'architect.html';
    }

    skipToFull() {
        this.onboardingState.skipToFullControls();
        this.navigateToArchitect();
    }

    nextScreen() {
        if (this.currentScreen < 8) {
            this.showScreen(this.currentScreen + 1);
        }
    }

    prevScreen() {
        if (this.currentScreen > 0) {
            this.showScreen(this.currentScreen - 1);
        }
    }

    getIntentPrompt(intent) {
        const prompts = {
            think: "What's the best way to make a hard decision?",
            write: 'How do I open a cold email?',
            build: 'How should I structure a new codebase?',
            explore: "What's the most interesting thing about black holes?"
        };
        return prompts[intent] || "What's the best way to make a hard decision?";
    }
}

if (typeof window !== 'undefined') {
    window.TierUnlock = TierUnlock;
    window.OnboardingUI = OnboardingUI;
}
