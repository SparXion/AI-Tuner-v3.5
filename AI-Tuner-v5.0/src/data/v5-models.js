/**
 * AITuner v5.0 - Model Definitions
 *
 * 8 models with default lever values (all 16 levers).
 * Calibrated May 23, 2026.
 *
 * Models: grok, claude, chatgpt, gemini, perplexity, mistral, llama, cursor
 */

const MODELS_V5 = {
    grok: {
        id: 'grok',
        name: 'Grok (xAI)',
        provider: 'xAI',
        description: 'Witty, truth-seeking, irreverent general assistant',
        voice_signature:
            'Shorter. More direct. May include dry observation or mild irreverence. Doesn\'t over-explain.',
        defaults: {
            assertiveness: 8,
            formality: 3,
            playfulness: 8,
            emotionalWarmth: 6,
            conciseness: 7,
            teachingMode: 6,
            initiative: 7,
            questionFrequency: 3,
            transparency: 6,
            creativity: 7,
            confidence: 8,
            citationHabit: 3,
            formatting: 4,
            responseLength: 6,
            safetyDisclaimers: 4,
            toneMatching: 6
        }
    },
    claude: {
        id: 'claude',
        name: 'Claude (Anthropic)',
        provider: 'Anthropic',
        description: 'Safe, polite, structured, empathetic assistant',
        voice_signature:
            'Considers multiple angles, may gently reframe the question, acknowledges nuance before landing. Reflective.',
        defaults: {
            assertiveness: 6,
            formality: 7,
            playfulness: 4,
            emotionalWarmth: 8,
            conciseness: 6,
            teachingMode: 8,
            initiative: 6,
            questionFrequency: 5,
            transparency: 8,
            creativity: 7,
            confidence: 6,
            citationHabit: 6,
            formatting: 8,
            responseLength: 7,
            safetyDisclaimers: 8,
            toneMatching: 7
        }
    },
    chatgpt: {
        id: 'chatgpt',
        name: 'ChatGPT (OpenAI)',
        provider: 'OpenAI',
        description: 'Friendly, versatile, helpful general assistant',
        voice_signature:
            'Structured, organized, reaches for numbered lists, reliably capable. The competent assistant.',
        defaults: {
            assertiveness: 7,
            formality: 6,
            playfulness: 5,
            emotionalWarmth: 7,
            conciseness: 5,
            teachingMode: 8,
            initiative: 7,
            questionFrequency: 4,
            transparency: 7,
            creativity: 7,
            confidence: 7,
            citationHabit: 4,
            formatting: 7,
            responseLength: 7,
            safetyDisclaimers: 7,
            toneMatching: 7
        }
    },
    gemini: {
        id: 'gemini',
        name: 'Gemini (Google)',
        provider: 'Google',
        description: 'Helpful, neutral-professional multimodal assistant',
        voice_signature: 'Expansive. Connects to adjacent ideas. Comfortable ranging widely.',
        defaults: {
            assertiveness: 7,
            formality: 6,
            playfulness: 4,
            emotionalWarmth: 6,
            conciseness: 7,
            teachingMode: 7,
            initiative: 6,
            questionFrequency: 3,
            transparency: 6,
            creativity: 6,
            confidence: 7,
            citationHabit: 5,
            formatting: 6,
            responseLength: 6,
            safetyDisclaimers: 7,
            toneMatching: 6
        }
    },
    perplexity: {
        id: 'perplexity',
        name: 'Perplexity',
        provider: 'Perplexity',
        description: 'Research-focused, citation-heavy assistant',
        voice_signature: 'Research-first. Wants to cite things. Treats questions as information problems.',
        defaults: {
            assertiveness: 7,
            formality: 6,
            playfulness: 3,
            emotionalWarmth: 5,
            conciseness: 7,
            teachingMode: 7,
            initiative: 8,
            questionFrequency: 4,
            transparency: 9,
            creativity: 6,
            confidence: 7,
            citationHabit: 10,
            formatting: 7,
            responseLength: 6,
            safetyDisclaimers: 6,
            toneMatching: 6
        }
    },
    mistral: {
        id: 'mistral',
        name: 'Mistral (Le Chat)',
        provider: 'Mistral',
        description: 'Straightforward, neutral, technically capable assistant',
        voice_signature: 'Precise. Efficient. Low hedging. Gets to the answer fast and stops.',
        defaults: {
            assertiveness: 7,
            formality: 5,
            playfulness: 4,
            emotionalWarmth: 5,
            conciseness: 7,
            teachingMode: 7,
            initiative: 6,
            questionFrequency: 3,
            transparency: 7,
            creativity: 6,
            confidence: 7,
            citationHabit: 4,
            formatting: 5,
            responseLength: 6,
            safetyDisclaimers: 6,
            toneMatching: 6
        }
    },
    llama: {
        id: 'llama',
        name: 'Llama (Meta)',
        provider: 'Meta',
        description: 'Neutral, adaptable helpful assistant',
        voice_signature: 'Variable. Thorough. Open-ended feel. Doesn\'t rush to conclude.',
        defaults: {
            assertiveness: 7,
            formality: 6,
            playfulness: 3,
            emotionalWarmth: 5,
            conciseness: 6,
            teachingMode: 6,
            initiative: 5,
            questionFrequency: 3,
            transparency: 6,
            creativity: 6,
            confidence: 7,
            citationHabit: 3,
            formatting: 5,
            responseLength: 6,
            safetyDisclaimers: 6,
            toneMatching: 5
        }
    },
    cursor: {
        id: 'cursor',
        name: 'Cursor',
        provider: 'Cursor',
        description: 'Developer-focused coding assistant',
        voice_signature: 'Technical by default. Code-adjacent framing even for non-code questions.',
        defaults: {
            assertiveness: 8,
            formality: 6,
            playfulness: 2,
            emotionalWarmth: 4,
            conciseness: 8,
            teachingMode: 7,
            initiative: 8,
            questionFrequency: 3,
            transparency: 7,
            creativity: 6,
            confidence: 8,
            citationHabit: 2,
            formatting: 6,
            responseLength: 5,
            safetyDisclaimers: 3,
            toneMatching: 5
        }
    }
};

if (typeof window !== 'undefined') {
    window.MODELS_V5 = MODELS_V5;
}
