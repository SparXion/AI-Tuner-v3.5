/**
 * Project Setup — Instructions field content via Stop 9 synthesis (PROMPT_SYNTHESIS_V9).
 */
(function (global) {
    'use strict';

    /**
     * Map model id → formatting lane:
     * claude/chatgpt/gemini/grok — design-doc platforms
     * cursor — Claude-style markdown (same as claude)
     * mistral — Grok-like structured plain text (same formatter as grok)
     * llama — Gemini-style plain paragraphs (same as gemini)
     * perplexity — structured plain + optional citation line from synthesis
     * default — claude (markdown)
     */
    function platformForModel(modelId) {
        var id = typeof modelId === 'string' ? modelId.toLowerCase() : '';
        var map = {
            claude: 'claude',
            grok: 'grok',
            chatgpt: 'chatgpt',
            gemini: 'gemini',
            mistral: 'mistral',
            cursor: 'cursor',
            llama: 'llama',
            perplexity: 'perplexity'
        };
        if (map[id]) {
            return map[id];
        }
        return 'claude';
    }

    /** Strip markdown/noise → plain block (Grok / Mistral). */
    function toPlainInstructionBlock(body) {
        return String(body || '')
            .replace(/\*\*/g, '')
            .replace(/^#{1,6}\s/gm, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    /**
     * Optional citation behavior line from Stop 9 source map (standalone citationHabit).
     */
    function citationCueFromSynth(synth) {
        if (!synth || !Array.isArray(synth.sourceMap)) {
            return '';
        }
        var line = '';
        synth.sourceMap.forEach(function (row) {
            if (
                row &&
                row.type === 'standalone' &&
                row.lever &&
                row.lever.key === 'citationHabit' &&
                row.instruction
            ) {
                line = String(row.instruction).trim();
            }
        });
        return line;
    }

    function synthOrThrow(engine) {
        if (
            typeof window.PROMPT_SYNTHESIS_V9 === 'undefined' ||
            typeof window.PROMPT_SYNTHESIS_V9.compose !== 'function'
        ) {
            throw new Error('Prompt synthesis (Stop 9) is required for Instructions formatting.');
        }
        return window.PROMPT_SYNTHESIS_V9.compose(engine);
    }

    /** Remove trailing Context appendix (profile literacy); keep hierarchy embedded in synth. */
    function trimInstructionsBody(generatedText) {
        var t = generatedText != null ? String(generatedText) : '';
        t = t.replace(/\n\nContext:\n[\s\S]*$/, '').trim();
        return t;
    }

    /** One-line hint for Grok footer (synth hierarchy string if present). */
    function shorthandPriority(synthResult) {
        var h =
            synthResult &&
            synthResult.hierarchy &&
            String(synthResult.hierarchy).trim();
        return h
            ? 'Priority when rules conflict: ' +
                  String(synthResult.hierarchy)
                      .replace(/→/g, '>')
                      .trim() +
                  '.'
            : '';
    }

    /**
     * Format synthesized prompt into platform-specific Instructions clipboard text(s).
     * @param {object} engine
     * @param {string} modelId
     * @param {{ chatgptKnowledgeBlock?: string }} [options]
     */
    function formatForInstructions(engine, modelId, options) {
        options = options || {};
        var pla = platformForModel(modelId);
        var synth = synthOrThrow(engine);
        var raw = synth && synth.generated_text ? String(synth.generated_text) : '';
        var body = trimInstructionsBody(raw).trim();

        var out = {
            platform: pla,
            modelId: modelId,
            synthesized: synth,
            singleField: '',
            chatgptAboutYou: '',
            chatgptHowToRespond: '',
            shortPriorityHint: shorthandPriority(synth)
        };

        /* Claude-style markdown (+ Cursor lane: identical) */
        if (pla === 'claude' || pla === 'cursor') {
            out.singleField = '## Behavioral instructions\n\n' + body;
            return out;
        }

        /* Grok-like structured plain (+ Mistral lane: identical) */
        if (pla === 'grok' || pla === 'mistral') {
            var gplain = toPlainInstructionBlock(body);
            out.singleField =
                gplain +
                (out.shortPriorityHint ? '\n\n' + out.shortPriorityHint : '');
            return out;
        }

        if (pla === 'chatgpt') {
            out.chatgptAboutYou =
                options.chatgptKnowledgeBlock && options.chatgptKnowledgeBlock.trim()
                    ? options.chatgptKnowledgeBlock.trim()
                    : '[Fill from your Knowledge Template / project notes — who you are, what you\'re working on.]';
            out.chatgptHowToRespond = body;
            out.singleField =
                '(Custom Instructions — About you)\n\n' +
                out.chatgptAboutYou +
                '\n\n---\n\n(Custom Instructions — How to respond)\n\n' +
                out.chatgptHowToRespond +
                (out.shortPriorityHint ? '\n\n---\n\n' + out.shortPriorityHint : '');
            return out;
        }

        /* Gemini-style plain prose (+ Llama lane: identical) */
        if (pla === 'gemini' || pla === 'llama') {
            var gemPlain = body
                .replace(/#{2,}\s/gm, '')
                .trim();
            out.singleField =
                'System / project instructions:\n\n' +
                gemPlain +
                (out.shortPriorityHint ? '\n\n' + out.shortPriorityHint : '');
            return out;
        }

        /* Perplexity: structured plain + optional citation cue from synthesis */
        if (pla === 'perplexity') {
            var pplain = toPlainInstructionBlock(body);
            var cite = citationCueFromSynth(synth);
            out.singleField =
                pplain +
                (out.shortPriorityHint ? '\n\n' + out.shortPriorityHint : '') +
                (cite ? '\n\nSources / citations: ' + cite : '');
            return out;
        }

        out.singleField = body;
        return out;
    }

    global.ProjectSetupInstructionsFormatter = {
        platformForModel: platformForModel,
        formatForInstructions: formatForInstructions,
        synthOrThrow: synthOrThrow,
        trimInstructionsBody: trimInstructionsBody
    };
})(typeof window !== 'undefined' ? window : globalThis);
