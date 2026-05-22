/**
 * Inline save configuration dialog (replaces window.prompt / alert).
 * Use from room tuner, onboarding preview, and Architect mode.
 */
(function (global) {
    'use strict';

    const OVERLAY_CLASS = 'aituner-save-overlay';
    const PANEL_CLASS = 'aituner-save-panel';

    function ensureStyles() {
        if (document.getElementById('aituner-save-dialog-styles')) {
            return;
        }
        const style = document.createElement('style');
        style.id = 'aituner-save-dialog-styles';
        style.textContent = `
            .${OVERLAY_CLASS} {
                position: fixed; inset: 0; background: rgba(0, 0, 0, 0.55); z-index: 4000;
                display: flex; align-items: center; justify-content: center; padding: 20px;
            }
            .${PANEL_CLASS} {
                background: #1a1a1a;
                border: 2px solid #ffffff;
                border-radius: 4px;
                padding: 24px 28px;
                max-width: 400px;
                width: 100%;
                box-shadow: 0 12px 40px rgba(0,0,0,0.45);
            }
            .${PANEL_CLASS} h3 { margin: 0 0 8px; font-size: 18px; color: #ffffff; }
            .${PANEL_CLASS} p.hint { margin: 0 0 16px; font-size: 14px; color: #bdbdbd; }
            .${PANEL_CLASS} input[type="text"] {
                width: 100%; padding: 12px 14px; border-radius: 4px; border: 2px solid #ffffff;
                font-size: 15px; margin-bottom: 8px; box-sizing: border-box; font-family: inherit;
                background: #000000; color: #ffffff;
            }
            .${PANEL_CLASS} .aituner-save-name-error {
                display: none; font-size: 14px; color: #ffffff; font-weight: 600; margin: 0 0 12px;
            }
            .${PANEL_CLASS} .aituner-save-name-error.aituner-save-name-error-visible { display: block; }
            .${PANEL_CLASS} .aituner-save-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: flex-end; }
            .${PANEL_CLASS} .aituner-save-confirm {
                padding: 10px 20px; border-radius: 4px; border: 2px solid #ffffff; font-weight: 700; cursor: pointer;
                background: #ffffff; color: #000000; font-size: 15px; font-family: inherit;
            }
            .${PANEL_CLASS} .aituner-save-confirm:hover { background: #e0e0e0; border-color: #e0e0e0; }
            .${PANEL_CLASS} .aituner-save-cancel {
                padding: 10px 18px; border-radius: 4px; border: 2px solid #ffffff; background: transparent;
                font-weight: 600; cursor: pointer; color: #ffffff; font-size: 15px; font-family: inherit;
            }
            .${PANEL_CLASS} .aituner-save-cancel:hover { background: #333333; }
            .${PANEL_CLASS} .aituner-save-toast {
                margin-top: 14px; font-size: 15px; font-weight: 800; letter-spacing: 0.04em;
                color: #ffffff; opacity: 0;
                transition: opacity 0.35s ease;
            }
            .${PANEL_CLASS} .aituner-save-toast.aituner-save-toast-show { opacity: 1; }
            .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        `;
        document.head.appendChild(style);
    }

    function escapeHtml(s) {
        const d = document.createElement('div');
        d.textContent = s == null ? '' : String(s);
        return d.innerHTML;
    }

    /**
     * @param {{ engine: object, defaultName?: string, onSaved?: function(string): void }} opts
     */
    function openSaveConfigDialog(opts) {
        if (!opts || !opts.engine || typeof opts.engine.saveConfig !== 'function') {
            console.warn('openSaveConfigDialog: engine.saveConfig required');
            return;
        }
        ensureStyles();

        const existing = document.querySelector('.' + OVERLAY_CLASS);
        if (existing) {
            existing.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = OVERLAY_CLASS;
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'aituner-save-title');

        const defaultName = opts.defaultName || 'My configuration';
        overlay.innerHTML = `
            <div class="${PANEL_CLASS}">
                <h3 id="aituner-save-title">Name this configuration</h3>
                <p class="hint">Choose a name you’ll recognize in your profile.</p>
                <label class="sr-only" for="aituner-save-input">Configuration name</label>
                <input type="text" id="aituner-save-input" placeholder="e.g. My writing Claude" value="${escapeHtml(defaultName)}" autocomplete="off" aria-describedby="aituner-save-name-error" />
                <p id="aituner-save-name-error" class="aituner-save-name-error" role="alert">Please give this a name</p>
                <div class="aituner-save-actions">
                    <button type="button" class="aituner-save-cancel">Cancel</button>
                    <button type="button" class="aituner-save-confirm">Save →</button>
                </div>
                <div class="aituner-save-toast" aria-live="polite">Saved.</div>
            </div>
        `;

        document.body.appendChild(overlay);

        const input = overlay.querySelector('#aituner-save-input');
        const toast = overlay.querySelector('.aituner-save-toast');
        const close = () => {
            overlay.remove();
        };

        const errEl = overlay.querySelector('#aituner-save-name-error');

        const doSave = () => {
            const name = input.value.trim();
            if (!name) {
                if (errEl) {
                    errEl.classList.add('aituner-save-name-error-visible');
                }
                input.focus();
                return;
            }
            if (errEl) {
                errEl.classList.remove('aituner-save-name-error-visible');
            }
            const result = opts.engine.saveConfig(name);
            if (result == null) {
                close();
                return;
            }
            if (typeof opts.onSaved === 'function') {
                opts.onSaved(name);
            }
            toast.classList.add('aituner-save-toast-show');
            setTimeout(() => {
                toast.classList.remove('aituner-save-toast-show');
            }, 2100);
            setTimeout(close, 2000);
        };

        overlay.querySelector('.aituner-save-cancel').addEventListener('click', close);
        overlay.querySelector('.aituner-save-confirm').addEventListener('click', doSave);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                close();
            }
        });
        input.addEventListener('input', () => {
            if (errEl && input.value.trim()) {
                errEl.classList.remove('aituner-save-name-error-visible');
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                doSave();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
            }
        });

        setTimeout(() => {
            input.focus();
            input.select();
        }, 0);
    }

    global.openSaveConfigDialog = openSaveConfigDialog;
})(typeof window !== 'undefined' ? window : globalThis);
