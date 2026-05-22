/**
 * Shared prompt preview + expandable "How this was built" (Stop 9).
 * Used by PromptDisplay and guided onboarding wherever a generated prompt appears.
 */

(function (global) {
    'use strict';

    const HIER_LABEL = 'Conflict resolution priority';
    const DETAILS_CLASS = 'prompt-how-built-details';
    const SUMMARY_CLASS = 'prompt-how-built-summary';

    function escapeHtml(text) {
        const d = document.createElement('div');
        d.textContent = text == null ? '' : String(text);
        return d.innerHTML;
    }

    /**
     * Build inner HTML for a prompt preview wrapper (caller supplies outer `.prompt-preview` styling).
     * @param {object|null} currentPrompt engine.currentPrompt or shape { generated_text, sourceMap, neutralLevers, hierarchy, wordCount }
     * @param {{ omitHowBuilt?: boolean }} opts
     * @returns {string} HTML snippet safe to inject
     */
    function renderPromptPreviewInner(currentPrompt, opts) {
        const omitHowBuilt = !!(opts && opts.omitHowBuilt);
        let text =
            currentPrompt && typeof currentPrompt.generated_text === 'string' ? currentPrompt.generated_text.trim() : '';
        if (!text) {
            return '<p class="prompt-placeholder">Select a model to generate a prompt.</p>';
        }
        let inner = `<pre class="prompt-text">${escapeHtml(text)}</pre>`;
        if (
            omitHowBuilt ||
            !currentPrompt ||
            !Array.isArray(currentPrompt.sourceMap) ||
            currentPrompt.sourceMap.length === 0
        ) {
            return inner;
        }
        inner += '\n';
        inner += renderHowBuiltDetails(currentPrompt);
        return inner;
    }

    /**
     * Collapsible "How this was built" (collapsed by default).
     */
    function renderHowBuiltDetails(p) {
        const body = escapeHtml(renderHowBuiltPlainTextBody(p)).replace(/\n/g, '<br/>');
        return `
<details class="${DETAILS_CLASS}">
<summary class="${SUMMARY_CLASS}" role="button">How this was built</summary>
<div class="prompt-how-built-body">${body}</div>
</details>`;
    }

    /** Plain-text body for readability / future copy; escaped when embedded in HTML. */
    function renderHowBuiltPlainTextBody(p) {
        const blocks = [];

        function leverLabel(key) {
            if (window.LEVERS_V5 && window.LEVERS_V5[key] && window.LEVERS_V5[key].name) {
                return window.LEVERS_V5[key].name;
            }
            return key;
        }

        function formatLeverChip(key, value) {
            if (key === 'safetyDisclaimers') {
                return value <= 2 ? `${leverLabel(key)}: off` : value >= 8 ? `${leverLabel(key)}: on` : `${leverLabel(key)}: ${value}`;
            }
            return `${leverLabel(key)}: ${value}`;
        }

        p.sourceMap.forEach((entry) => {
            if (entry.type === 'persona') {
                blocks.push(`${String(entry.personaName || entry.clusterName || 'Persona')}`.toUpperCase());
                blocks.push('  Pre-synthesized behavioral profile');
                if (entry.description) {
                    blocks.push(`  ${entry.description}`);
                }
                if (entry.levers && entry.levers.length) {
                    const chips = entry.levers.map((L) => formatLeverChip(L.key, L.value)).join(' · ');
                    blocks.push(`  Lever values this persona represents: ${chips}`);
                }
                return;
            }
            const title = `${(entry.clusterName || 'Instruction').toUpperCase()}`;
            blocks.push(title);
            let chips = '';
            if (entry.type === 'cluster' && entry.levers && entry.levers.length) {
                chips = entry.levers.map((L) => formatLeverChip(L.key, L.value)).join(' · ');
                blocks.push(`  ${chips}`);
            }
            if (entry.type === 'standalone' && entry.lever) {
                chips = `${leverLabel(entry.lever.key)} (${entry.lever.value})`;
                blocks.push(`  Standalone · ${chips}`);
            }
            blocks.push(`  → "${entry.instruction.replace(/\s+/g, ' ')}"`);
            blocks.push('');
        });

        if (p.hierarchy) {
            blocks.push('CONFLICT RESOLUTION');
            blocks.push(`  Priority: ${p.hierarchy}`);
            blocks.push('');
        }

        if (Array.isArray(p.neutralLevers) && p.neutralLevers.length) {
            blocks.push('LEVERS IN NEUTRAL ZONE (no instruction generated)');
            const line =
                '  ' +
                p.neutralLevers.map((nl) => `${leverLabel(nl.key)}: ${nl.value}`).join(' · ');
            blocks.push(line);
            blocks.push('');
        }

        if (typeof p.wordCount === 'number') {
            blocks.push(`Approx. words in prompt body: ${p.wordCount}`);
        }

        return blocks.join('\n').trim();
    }

    /**
     * Render into container element.
     */
    function renderInto(containerEl, currentPrompt, opts) {
        if (!containerEl) {
            return;
        }
        containerEl.innerHTML = renderPromptPreviewInner(currentPrompt, opts || {});
    }

    /**
     * Chain prompt updates onto engine.onPromptChange and fire immediately.
     * @returns {function} unwatch
     */
    function wireEngine(engine, containerEl, opts) {
        if (!engine || !containerEl) {
            return function () {};
        }
        const prev = engine.onPromptChange;
        function fire(p) {
            renderInto(containerEl, p, opts || {});
            if (typeof prev === 'function') {
                prev.call(engine, p);
            }
        }
        engine.onPromptChange = fire;
        fire(engine.currentPrompt || null);
        return function unwind() {
            engine.onPromptChange = prev;
        };
    }

    global.PromptPreviewUi = {
        escapeHtml,
        renderPromptPreviewInner,
        renderHowBuiltDetails,
        renderInto,
        wireEngine,
        HIER_LABEL
    };
})(typeof window !== 'undefined' ? window : globalThis);
