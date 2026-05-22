/**
 * Project Setup — Memory: prompt commands only (minimal copy per provider).
 */
(function (global) {
    'use strict';

    /** @returns {'claude'|'grok'|'chatgpt'|'gemini'|'generic'} */
    function platformForModel(modelId) {
        var map = {
            claude: 'claude',
            grok: 'grok',
            chatgpt: 'chatgpt',
            gemini: 'gemini'
        };
        var id = typeof modelId === 'string' ? modelId.toLowerCase() : '';
        if (map[id]) {
            return map[id];
        }
        return 'generic';
    }

    function getMemoryGuide(modelId) {
        var p = platformForModel(modelId);
        /** @type {{ intro: string, commands: string[], seeds: string[], whereToLook?: string }} */
        var out = {
            intro: '',
            commands: [],
            seeds: [],
            whereToLook: ''
        };

        if (p === 'claude') {
            out.intro =
                'Project memory gathers from your chats — private to you. You can view and edit it in the Memory panel when it appears.';
            out.whereToLook = 'Project sidebar → Memory.';
            out.commands = [
                'What do you remember about me?',
                'Remember that [X]',
                'Update your memory — [X] is no longer true',
                'Forget [X]'
            ];
            out.seeds = [
                'Remember that I\'m working on [project].',
                'Remember that my preferred communication style is [X].'
            ];
        } else if (p === 'grok') {
            out.intro =
                'Memory spans conversations — less surfaced than Claude\'s sidebar. Use prompts to steer what persists.';
            out.whereToLook = 'Settings → Memory (to clear when needed).';
            out.commands = [
                'What have you learned about me?',
                'Please remember that [X]',
                'Forget what you know about [X]'
            ];
            out.seeds = [
                'Remember that my project focuses on [X]. Please keep replies direct.'
            ];
        } else if (p === 'chatgpt') {
            out.intro =
                'Explicit memory saves across chats — you can view and tune it in personalization settings.';
            out.whereToLook = 'Settings → Personalization → Memory.';
            out.commands = [
                'What do you remember?',
                'Remember that [X]',
                'Forget [X]'
            ];
            out.seeds = [
                'Remember that I\'m setting up [project] and prefer [tone].'
            ];
        } else if (p === 'gemini') {
            out.intro =
                'Gemini ties memory to your Google account; controls vary by surface. Start with concise recall prompts.';
            out.whereToLook = 'Google account / product settings.';
            out.commands = ['What do you know about me?'];
            out.seeds = [];
        } else {
            out.intro =
                'Memory learns from chats over time — separate from files you upload. Keep it deliberate with recall and correction prompts.';
            out.commands = [
                'What do you remember about me?',
                'Remember that [X]',
                'Forget [X]'
            ];
            out.seeds = [];
        }

        return out;
    }

    global.ProjectSetupMemoryGuide = {
        platformForModel: platformForModel,
        getMemoryGuide: getMemoryGuide
    };
})(typeof window !== 'undefined' ? window : globalThis);
