/**
 * AITuner v5.0 — Profile panel (tier badge click)
 */

class ProfilePanel {
    constructor(engine, onboardingState, userProfile, options) {
        this.engine = engine;
        this.onboardingState = onboardingState;
        this.userProfile = userProfile;
        this.options = options || {};
        this.overlay = null;
        this.boundDocClick = this.onDocumentClick.bind(this);
    }

    sourceLabel(src) {
        const map = {
            guided: 'guided',
            manual: 'Architect',
            decoder: 'decoded',
            discovery: 'discovery'
        };
        return map[src] || src || '—';
    }

    render() {
        this.userProfile.loadProfile();
        const dash = this.userProfile.getDashboardData();
        const next = this.onboardingState.getNextUnlock();
        const configs = dash.saved_configs || [];
        const lit = dash.literacy_record || {};
        const explored = lit.models_explored || [];
        const prefName =
            dash.preferred_model && window.MODELS_V5 && window.MODELS_V5[dash.preferred_model]
                ? window.MODELS_V5[dash.preferred_model].name
                : dash.preferred_model || 'Not set yet';

        const configRows = configs
            .slice(-12)
            .reverse()
            .map(
                (c) => `
            <li class="profile-config-item profile-config-clickable" role="button" tabindex="0" data-config-id="${this.escape(c.id || '')}">
                <span class="profile-config-name">${this.escape(c.name || 'Untitled')}</span>
                <span class="profile-config-src">${this.sourceLabel(c.source)}</span>
            </li>
        `
            )
            .join('');

        const compareDiscoveryLink =
            explored.length >= 1
                ? '<p class="profile-discovery-compare"><button type="button" class="profile-discovery-link" id="profile-goto-discovery">Compare models in Discovery Mode →</button></p>'
                : '';

        const nudgeExplore =
            explored.length === 0
                ? '<p class="profile-nudge"><strong>Explore a new model →</strong> Open Discovery Mode to compare up to four models side by side.</p>'
                : '';

        return `
            <div class="profile-panel-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-panel-title">
                <button type="button" class="profile-panel-close" aria-label="Close">&times;</button>
                <h2 id="profile-panel-title">Your profile</h2>
                <section class="profile-section">
                    <h3>Progress</h3>
                    <p><strong>Current tier:</strong> ${this.escape(this.onboardingState.getTierName())}</p>
                    ${
                        next
                            ? `<p class="profile-next"><strong>Next unlock:</strong> ${this.escape(next.action)} → ${this.escape(next.unlocks)}</p>`
                            : '<p class="profile-muted">You have full access.</p>'
                    }
                </section>
                <section class="profile-section">
                    <h3>Preferred model</h3>
                    <p>${this.escape(prefName)}</p>
                </section>
                <section class="profile-section">
                    <h3>Saved configurations</h3>
                    ${
                        configRows
                            ? `<ul class="profile-config-list">${configRows}</ul>`
                            : '<p class="profile-muted">Nothing saved yet. Once you build a configuration you love, save it here so you can come back to it.</p>'
                    }
                </section>
                <section class="profile-section">
                    <h3>Literacy record</h3>
                    <ul class="profile-lit-list">
                        <li>Models explored: <strong>${explored.length}</strong></li>
                        <li>Prompts decoded: <strong>${lit.prompts_decoded || 0}</strong></li>
                        <li>Prompts built: <strong>${lit.prompts_built || 0}</strong></li>
                    </ul>
                    ${compareDiscoveryLink}
                    ${nudgeExplore}
                </section>
            </div>
        `;
    }

    escape(s) {
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    open() {
        this.close();
        this.overlay = document.createElement('div');
        this.overlay.className = 'profile-panel-overlay';
        this.overlay.innerHTML = this.render();
        document.body.appendChild(this.overlay);

        this.overlay.querySelector('.profile-panel-close').addEventListener('click', () => this.close());
        this.overlay.querySelectorAll('.profile-config-clickable[data-config-id]').forEach((li) => {
            const openCfg = () => {
                const id = li.getAttribute('data-config-id');
                if (id && typeof this.options.onOpenSavedConfig === 'function') {
                    this.options.onOpenSavedConfig(id);
                    this.close();
                }
            };
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                openCfg();
            });
            li.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openCfg();
                }
            });
        });
        setTimeout(() => document.addEventListener('click', this.boundDocClick), 0);

        const goDiscovery = this.overlay.querySelector('#profile-goto-discovery');
        if (goDiscovery && typeof this.options.onNavigateToDiscovery === 'function') {
            goDiscovery.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
                this.options.onNavigateToDiscovery();
            });
        }
    }

    onDocumentClick(e) {
        if (!this.overlay) {
            return;
        }
        const dialog = this.overlay.querySelector('.profile-panel-dialog');
        if (dialog && dialog.contains(e.target)) {
            return;
        }
        this.close();
    }

    close() {
        document.removeEventListener('click', this.boundDocClick);
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
    }
}

if (typeof window !== 'undefined') {
    window.ProfilePanel = ProfilePanel;
}
