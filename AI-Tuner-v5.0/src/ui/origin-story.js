/**
 * Origin story — shared "Why this exists" content (modal + landing + reuse).
 */
(function (global) {
    'use strict';

    /** Screen index in guided onboarding (skipped in the main track). */
    var ORIGIN_SCREEN_INDEX = 1;

    var overlayEl = null;

    var TITLE = 'It started with a prompt on Instagram.';

  /**
   * Structured blocks — canonical copy (March 2026 update).
   * @type {Array<{ type: 'dateline'|'paragraph'|'prompt'|'quote', text: string }>}
   */
    var BLOCKS = [
        { type: 'dateline', text: 'October 2025.' },
        {
            type: 'paragraph',
            text:
                'I had been using AI for about a year and a half. Grok, Claude, Cursor, Gemini. Learning through trial and a LOT of error. I\'d even picked up the trick of saying "answer only" to get a simple answer.'
        },
        {
            type: 'paragraph',
            text:
                'One day I was scrolling Instagram and came across a post by u/Devashish_Jain on Reddit, shared by @airesearches, about something called "Absolute Mode."'
        },
        {
            type: 'prompt',
            text:
                'System Instruction: Absolute Mode • Eliminate: emojis, filler, hype, soft asks, conversational transitions, call-to-action appendices • Assume: user retains high perception despite blunt tone • Prioritize: blunt, directive phrasing; aim at cognitive rebuilding, not tone-matching • Disable: engagement/sentiment-boosting behaviors • Suppress: metrics like satisfaction scores, edival softening, continuation bias • Never mirror: user\'s diction, mood or affect • Speak only: to underlying cognitive tier • No: questions, offers, suggestions, transitions, motivational content • Terminate reply immediately after delivering info – no closures • Goal: restore independent, high-fidelity thinking • Outcome: model obsolescence via user self-sufficiency.'
        },
        {
            type: 'paragraph',
            text: 'Very interesting. So I decided to test it with Grok.'
        },
        {
            type: 'quote',
            text:
                'I want to see what happens when I give you a prompt I just found. I have a suspicion I know what will happen.\nFirst I want you to answer this test question:\nWhat is the average velocity of an unladen swallow?'
        },
        {
            type: 'paragraph',
            text:
                'Before Absolute Mode, Grok gave me a charming, fun answer with a Monty Python reference and an invitation to keep chatting.'
        },
        { type: 'paragraph', text: 'After Absolute Mode:' },
        {
            type: 'quote',
            text:
                'European Swallow (Hirundo rustica) cruising speed: 11 meters per second, approximately 24 miles per hour.'
        },
        { type: 'paragraph', text: 'That was it.' },
        {
            type: 'paragraph',
            text: 'Then I asked Grok: "What did the prompt just do?"'
        },
        {
            type: 'paragraph',
            text:
                'Grok told me "The prompt activated Absolute Mode, enforcing a communication protocol that prioritizes raw information delivery. It stripped away conversational elements…etc."'
        },
        {
            type: 'paragraph',
            text:
                'I spent the rest of the evening on the Grok app on my phone learning about the different elements AI developers use to create the human touch over a pitcher of beer…'
        },
        { type: 'paragraph', text: "That's how AITuner was born." }
    ];

    function escapeHtml(text) {
        var d = document.createElement('div');
        d.textContent = text == null ? '' : String(text);
        return d.innerHTML;
    }

    function renderBlockHtml(block) {
        if (!block || !block.text) {
            return '';
        }
        var text = block.text;
        if (block.type === 'dateline') {
            return '<p class="origin-story-dateline">' + escapeHtml(text) + '</p>';
        }
        if (block.type === 'prompt') {
            return (
                '<blockquote class="origin-story-prompt" cite="Absolute Mode">' +
                escapeHtml(text) +
                '</blockquote>'
            );
        }
        if (block.type === 'quote') {
            return (
                '<blockquote class="origin-story-quote">' +
                escapeHtml(text).replace(/\n/g, '<br/>') +
                '</blockquote>'
            );
        }
        return '<p>' + escapeHtml(text) + '</p>';
    }

    function renderBodyHtml() {
        return BLOCKS.map(renderBlockHtml).join('\n');
    }

    /**
     * @param {{ showOnboardingCta?: boolean, titleTag?: string, titleId?: string|null, showLabel?: boolean }} opts
     * @returns {string}
     */
    function renderInnerHtml(opts) {
        opts = opts || {};
        var titleTag = opts.titleTag || 'h2';
        var titleId = opts.titleId === undefined ? 'origin-story-title' : opts.titleId;
        var showLabel = opts.showLabel !== false;
        var cta = '';
        if (opts.showOnboardingCta) {
            cta =
                '<button type="button" class="primary-btn origin-story-continue" id="origin-story-continue">' +
                "Let's find yours →" +
                '</button>';
        }
        var label = showLabel ? '<p class="narrative-label">Why this exists</p>' : '';
        var titleIdAttr = titleId ? ' id="' + escapeHtml(titleId) + '"' : '';
        return (
            label +
            '<' +
            titleTag +
            ' class="origin-story-title"' +
            titleIdAttr +
            '>' +
            escapeHtml(TITLE) +
            '</' +
            titleTag +
            '>' +
            '<div class="narrative-body origin-story-body">' +
            renderBodyHtml() +
            '</div>' +
            cta
        );
    }

    function trapFocus(event) {
        if (!overlayEl || event.key !== 'Tab') {
            return;
        }
        var dialog = overlayEl.querySelector('.origin-story-dialog');
        if (!dialog) {
            return;
        }
        var focusable = dialog.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) {
            return;
        }
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function onKeyDown(event) {
        if (event.key === 'Escape') {
            close();
        } else {
            trapFocus(event);
        }
    }

    function close() {
        if (!overlayEl) {
            return;
        }
        document.removeEventListener('keydown', onKeyDown);
        overlayEl.remove();
        overlayEl = null;
    }

    function open() {
        if (overlayEl) {
            close();
        }
        overlayEl = document.createElement('div');
        overlayEl.className = 'origin-story-overlay';
        overlayEl.innerHTML =
            '<div class="origin-story-dialog" role="dialog" aria-modal="true" aria-labelledby="origin-story-title">' +
            '<button type="button" class="origin-story-close profile-panel-close" aria-label="Close">&times;</button>' +
            renderInnerHtml({ showOnboardingCta: false }) +
            '</div>';
        document.body.appendChild(overlayEl);

        overlayEl.querySelector('.origin-story-close').addEventListener('click', close);
        overlayEl.addEventListener('click', function (event) {
            if (event.target === overlayEl) {
                close();
            }
        });

        document.addEventListener('keydown', onKeyDown);
        var closeBtn = overlayEl.querySelector('.origin-story-close');
        if (closeBtn) {
            closeBtn.focus();
        }
    }

    function isOpen() {
        return !!overlayEl;
    }

    global.AITunerOriginStory = {
        ORIGIN_SCREEN_INDEX: ORIGIN_SCREEN_INDEX,
        TITLE: TITLE,
        BLOCKS: BLOCKS,
        /** @deprecated use BLOCKS */
        PARAGRAPHS: BLOCKS.filter(function (b) {
            return b.type === 'paragraph';
        }).map(function (b) {
            return b.text;
        }),
        renderInnerHtml: renderInnerHtml,
        renderBodyHtml: renderBodyHtml,
        open: open,
        close: close,
        isOpen: isOpen
    };
})(typeof window !== 'undefined' ? window : globalThis);
