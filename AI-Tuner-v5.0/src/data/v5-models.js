/**
 * AITuner v5.0 - Model Definitions (public)
 *
 * Neutral default lever values (all 16 levers at midpoint).
 * Calibrated profiles are maintained in the private AI-Tuner-Methodology repo.
 *
 * Models: grok, claude, chatgpt, gemini, perplexity, mistral, llama, cursor
 */

const MODELS_V5 = {
    grok: {
        id: 'grok',
        name: 'Grok (xAI)',
        provider: 'xAI',
        description: 'General assistant',
        voice_signature: 'Direct general assistant.',
        defaults: {
            assertiveness: 5,
            formality: 5,
            playfulness: 5,
            emotionalWarmth: 5,
            conciseness: 5,
            teachingMode: 5,
            initiative: 5,
            questionFrequency: 5,
            transparency: 5,
            creativity: 5,
            confidence: 5,
            citationHabit: 5,
            formatting: 5,
            responseLength: 5,
            safetyDisclaimers: 5,
            toneMatching: 5
        }
    },
    claude: {
        id: 'claude',
        name: 'Claude (Anthropic)',
        provider: 'Anthropic',
        description: 'General assistant',
        voice_signature: 'General assistant.',
        defaults: {
            assertiveness: 5,
            formality: 5,
            playfulness: 5,
            emotionalWarmth: 5,
            conciseness: 5,
            teachingMode: 5,
            initiative: 5,
            questionFrequency: 5,
            transparency: 5,
            creativity: 5,
            confidence: 5,
            citationHabit: 5,
            formatting: 5,
            responseLength: 5,
            safetyDisclaimers: 5,
            toneMatching: 5
        }
    },
    chatgpt: {
        id: 'chatgpt',
        name: 'ChatGPT (OpenAI)',
        provider: 'OpenAI',
        description: 'General assistant',
        voice_signature: 'General assistant.',
        defaults: {
            assertiveness: 5,
            formality: 5,
            playfulness: 5,
            emotionalWarmth: 5,
            conciseness: 5,
            teachingMode: 5,
            initiative: 5,
            questionFrequency: 5,
            transparency: 5,
            creativity: 5,
            confidence: 5,
            citationHabit: 5,
            formatting: 5,
            responseLength: 5,
            safetyDisclaimers: 5,
            toneMatching: 5
        }
    },
    gemini: {
        id: 'gemini',
        name: 'Gemini (Google)',
        provider: 'Google',
        description: 'General assistant',
        voice_signature: 'General assistant.',
        defaults: {
            assertiveness: 5,
            formality: 5,
            playfulness: 5,
            emotionalWarmth: 5,
            conciseness: 5,
            teachingMode: 5,
            initiative: 5,
            questionFrequency: 5,
            transparency: 5,
            creativity: 5,
            confidence: 5,
            citationHabit: 5,
            formatting: 5,
            responseLength: 5,
            safetyDisclaimers: 5,
            toneMatching: 5
        }
    },
    perplexity: {
        id: 'perplexity',
        name: 'Perplexity',
        provider: 'Perplexity',
        description: 'Research assistant',
        voice_signature: 'Research assistant.',
        defaults: {
            assertiveness: 5,
            formality: 5,
            playfulness: 5,
            emotionalWarmth: 5,
            conciseness: 5,
            teachingMode: 5,
            initiative: 5,
            questionFrequency: 5,
            transparency: 5,
            creativity: 5,
            confidence: 5,
            citationHabit: 5,
            formatting: 5,
            responseLength: 5,
            safetyDisclaimers: 5,
            toneMatching: 5
        }
    },
    mistral: {
        id: 'mistral',
        name: 'Mistral (Le Chat)',
        provider: 'Mistral',
        description: 'General assistant',
        voice_signature: 'General assistant.',
        defaults: {
            assertiveness: 5,
            formality: 5,
            playfulness: 5,
            emotionalWarmth: 5,
            conciseness: 5,
            teachingMode: 5,
            initiative: 5,
            questionFrequency: 5,
            transparency: 5,
            creativity: 5,
            confidence: 5,
            citationHabit: 5,
            formatting: 5,
            responseLength: 5,
            safetyDisclaimers: 5,
            toneMatching: 5
        }
    },
    llama: {
        id: 'llama',
        name: 'Llama (Meta)',
        provider: 'Meta',
        description: 'General assistant',
        voice_signature: 'General assistant.',
        defaults: {
            assertiveness: 5,
            formality: 5,
            playfulness: 5,
            emotionalWarmth: 5,
            conciseness: 5,
            teachingMode: 5,
            initiative: 5,
            questionFrequency: 5,
            transparency: 5,
            creativity: 5,
            confidence: 5,
            citationHabit: 5,
            formatting: 5,
            responseLength: 5,
            safetyDisclaimers: 5,
            toneMatching: 5
        }
    },
    cursor: {
        id: 'cursor',
        name: 'Cursor',
        provider: 'Cursor',
        description: 'Coding assistant',
        voice_signature: 'Coding assistant.',
        defaults: {
            assertiveness: 5,
            formality: 5,
            playfulness: 5,
            emotionalWarmth: 5,
            conciseness: 5,
            teachingMode: 5,
            initiative: 5,
            questionFrequency: 5,
            transparency: 5,
            creativity: 5,
            confidence: 5,
            citationHabit: 5,
            formatting: 5,
            responseLength: 5,
            safetyDisclaimers: 5,
            toneMatching: 5
        }
    }
};

if (typeof window !== 'undefined') {
    window.MODELS_V5 = MODELS_V5;
}
