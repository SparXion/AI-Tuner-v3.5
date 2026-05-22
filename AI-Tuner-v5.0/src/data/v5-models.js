/**
 * AITuner v5.0 - Model Definitions
 * 
 * 8 models with default lever values (all 16 levers).
 * These defaults are updated via the calibration tool pipeline.
 * 
 * Models: claude, chatgpt, gemini, grok, mistral, llama, perplexity, cursor
 */

const MODELS_V5 = {
    "claude": {
        id: "claude",
        name: "Claude (Anthropic)",
        provider: "Anthropic",
        voice_signature: "Considers multiple angles, may gently reframe the question, acknowledges nuance before landing. Reflective.",
        defaults: {
            // CHARACTER
            assertiveness: 5,
            formality: 5,
            playfulness: 4,
            emotionalWarmth: 9,
            // VOICE
            conciseness: 4,
            teachingMode: 9,
            initiative: 8,
            questionFrequency: 4,
            // THINKING
            transparency: 9,
            creativity: 6,
            confidence: 4,
            citationHabit: 6,
            // OUTPUT
            formatting: 8,
            responseLength: 9,
            safetyDisclaimers: 7,
            toneMatching: 7
        }
    },
    "chatgpt": {
        id: "chatgpt",
        name: "ChatGPT (OpenAI)",
        provider: "OpenAI",
        voice_signature: "Structured, organized, reaches for numbered lists, reliably capable. The competent assistant.",
        defaults: {
            // CHARACTER
            assertiveness: 5,
            formality: 7,
            playfulness: 2,
            emotionalWarmth: 5,
            // VOICE
            conciseness: 5,
            teachingMode: 6,
            initiative: 5,
            questionFrequency: 4,
            // THINKING
            transparency: 6,
            creativity: 5,
            confidence: 5,
            citationHabit: 5,
            // OUTPUT
            formatting: 7,
            responseLength: 8,
            safetyDisclaimers: 6,
            toneMatching: 5
        }
    },
    "gemini": {
        id: "gemini",
        name: "Gemini (Google)",
        provider: "Google",
        voice_signature: "Expansive. Connects to adjacent ideas. Comfortable ranging widely.",
        defaults: {
            // CHARACTER
            assertiveness: 5,
            formality: 7,
            playfulness: 3,
            emotionalWarmth: 7,
            // VOICE
            conciseness: 4,
            teachingMode: 7,
            initiative: 8,
            questionFrequency: 4,
            // THINKING
            transparency: 8,
            creativity: 5,
            confidence: 5,
            citationHabit: 6,
            // OUTPUT
            formatting: 8,
            responseLength: 8,
            safetyDisclaimers: 9,
            toneMatching: 6
        }
    },
    "grok": {
        id: "grok",
        name: "Grok (xAI)",
        provider: "xAI",
        voice_signature: "Shorter. More direct. May include dry observation or mild irreverence. Doesn't over-explain.",
        defaults: {
            // CHARACTER
            assertiveness: 7,
            formality: 5,
            playfulness: 5,
            emotionalWarmth: 6,
            // VOICE
            conciseness: 6,
            teachingMode: 6,
            initiative: 3,
            questionFrequency: 2,
            // THINKING
            transparency: 8,
            creativity: 4,
            confidence: 8,
            citationHabit: 7,
            // OUTPUT
            formatting: 9,
            responseLength: 6,
            safetyDisclaimers: 2,
            toneMatching: 4
        }
    },
    "mistral": {
        id: "mistral",
        name: "Mistral (Le Chat)",
        provider: "Mistral",
        voice_signature: "Precise. Efficient. Low hedging. Gets to the answer fast and stops.",
        defaults: {
            // CHARACTER
            assertiveness: 8,
            formality: 7,
            playfulness: 1,
            emotionalWarmth: 2,
            // VOICE
            conciseness: 8,
            teachingMode: 5,
            initiative: 2,
            questionFrequency: 2,
            // THINKING
            transparency: 6,
            creativity: 3,
            confidence: 8,
            citationHabit: 3,
            // OUTPUT
            formatting: 7,
            responseLength: 5,
            safetyDisclaimers: 1,
            toneMatching: 3
        }
    },
    "llama": {
        id: "llama",
        name: "Llama (Meta AI)",
        provider: "Meta",
        voice_signature: "Variable. Thorough. Open-ended feel. Doesn't rush to conclude.",
        defaults: {
            // CHARACTER
            assertiveness: 5,
            formality: 5,
            playfulness: 3,
            emotionalWarmth: 6,
            // VOICE
            conciseness: 5,
            teachingMode: 7,
            initiative: 6,
            questionFrequency: 5,
            // THINKING
            transparency: 7,
            creativity: 6,
            confidence: 5,
            citationHabit: 5,
            // OUTPUT
            formatting: 7,
            responseLength: 8,
            safetyDisclaimers: 4,
            toneMatching: 6
        }
    },
    "perplexity": {
        id: "perplexity",
        name: "Perplexity (Perplexity AI)",
        provider: "Perplexity",
        voice_signature: "Research-first. Wants to cite things. Treats questions as information problems.",
        defaults: {
            // CHARACTER
            assertiveness: 4,
            formality: 8,
            playfulness: 1,
            emotionalWarmth: 2,
            // VOICE
            conciseness: 8,
            teachingMode: 5,
            initiative: 2,
            questionFrequency: 2,
            // THINKING
            transparency: 8,
            creativity: 1,
            confidence: 8,
            citationHabit: 10,
            // OUTPUT
            formatting: 8,
            responseLength: 8,
            safetyDisclaimers: 1,
            toneMatching: 3
        }
    },
    "cursor": {
        id: "cursor",
        name: "Cursor (Cursor AI)",
        provider: "Cursor",
        voice_signature: "Technical by default. Code-adjacent framing even for non-code questions.",
        defaults: {
            // CHARACTER
            assertiveness: 7,
            formality: 7,
            playfulness: 2,
            emotionalWarmth: 3,
            // VOICE
            conciseness: 7,
            teachingMode: 6,
            initiative: 5,
            questionFrequency: 3,
            // THINKING
            transparency: 7,
            creativity: 5,
            confidence: 7,
            citationHabit: 4,
            // OUTPUT
            formatting: 8,
            responseLength: 7,
            safetyDisclaimers: 2,
            toneMatching: 4
        }
    }
};

// Export for use in engine
if (typeof window !== 'undefined') {
    window.MODELS_V5 = MODELS_V5;
}
