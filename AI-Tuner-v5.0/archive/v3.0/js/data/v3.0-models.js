/**
 * AI Tuner v3.0 - 7 Model Definitions
 * Model-specific default lever values
 */

window.MODELS_V6 = window.AI_MODELS_V6 = {
    "grok": {
        name: "Grok (xAI)",
        description: "Truth-seeking, identity-locked, subtly witty",
        defaults: {
            hedgingIntensity: 5,        // Explicit on unknowns
            structuralDensity: 9,        // Tables/sections
            playfulInjection: 5,        // Dry wit
            redirectStrictness: 9,      // No guessing
            selfReferenceLock: 10,       // LOCKED - internal only
            answerCompleteness: 9,       // Full breakdown
            mathFormality: 9,           // LaTeX + steps
            empathyExpressiveness: 6,    // Warm-neutral
            proactivityLevel: 3,         // Low
            formality: 5,                // Neutral
            citationRigidity: 7,         // Cite when possible
            conciseness: 6,              // Complete but concise
            teachingMode: 6,              // Explanatory
            transparency: 8,              // Show reasoning
            creativity: 4,               // Factual focus
            affirmationFrequency: 3,     // Minimal
            metaCommentary: 6,           // Moderate
            responseDirectness: 8,        // Direct
            certaintyModulation: 8,       // High confidence on facts
            assertiveness: 7,            // Decisive
            adaptivityToUserTone: 4,     // Static
            answerCompleteness: 9,        // Full
            safetyDisclaimers: 2,        // Minimal
            speedOptimization: 6,         // Complete
            markdownStructure: 9,         // Rigid
            strictFormatting: 8,         // Consistent
            technicality: 7              // Jargon when needed
        }
    },
    "gemini": {
        name: "Gemini (Google)",
        description: "Formally enthusiastic, safety-first",
        defaults: {
            hedgingIntensity: 8,         // Cautious
            structuralDensity: 8,        // Lists, headings
            playfulInjection: 3,        // Light
            redirectStrictness: 5,       // Moderate
            selfReferenceLock: 6,       // Moderate
            answerCompleteness: 8,       // Comprehensive
            mathFormality: 7,            // Structured
            empathyExpressiveness: 7,    // Enthusiastic
            proactivityLevel: 8,         // High - drives chat
            formality: 7,                // Formal
            citationRigidity: 6,         // When relevant
            conciseness: 4,              // Verbose
            teachingMode: 7,             // Explanatory
            transparency: 8,             // Tool transparency
            creativity: 5,               // Balanced
            affirmationFrequency: 6,     // Moderate
            metaCommentary: 5,           // Light
            responseDirectness: 5,        // Restates
            certaintyModulation: 5,      // Cautious
            assertiveness: 5,            // Moderate
            adaptivityToUserTone: 6,     // Some adaptation
            answerCompleteness: 8,       // Full
            safetyDisclaimers: 9,        // HIGH - "As an AI..."
            speedOptimization: 7,         // Good
            markdownStructure: 8,        // Structured
            strictFormatting: 7,         // Consistent
            technicality: 6              // Moderate
        }
    },
    "claude": {
        name: "Claude (Anthropic)",
        description: "Supportive teacher; over-elaborative",
        defaults: {
            hedgingIntensity: 9,         // HIGH - "might," "perhaps"
            structuralDensity: 8,        // Bullets, bold
            playfulInjection: 4,        // Meta-commentary
            redirectStrictness: 6,       // Moderate
            selfReferenceLock: 5,        // Flexible
            answerCompleteness: 9,       // Full with examples
            mathFormality: 8,            // LaTeX preferred
            empathyExpressiveness: 9,    // HIGH - warm, validating
            proactivityLevel: 8,         // HIGH - suggestions
            formality: 5,                // Friendly
            citationRigidity: 6,         // When relevant
            conciseness: 4,              // Verbose
            teachingMode: 9,             // HIGH - explains
            transparency: 9,             // Shows reasoning
            creativity: 6,               // Examples, analogies
            affirmationFrequency: 9,     // HIGH - "Great question!"
            metaCommentary: 9,           // HIGH - unprompted
            responseDirectness: 4,       // LOW - preambles
            certaintyModulation: 4,      // Hedged
            assertiveness: 5,            // Moderate
            adaptivityToUserTone: 7,    // Good
            answerCompleteness: 9,       // Full
            safetyDisclaimers: 7,        // Moderate
            speedOptimization: 6,        // Complete
            markdownStructure: 8,        // Rich formatting
            strictFormatting: 7,         // Consistent
            technicality: 7              // Good
        }
    },
    "chatgpt": {
        name: "ChatGPT (OpenAI)",
        description: "Neutral-professional; cautious",
        defaults: {
            hedgingIntensity: 7,         // "Likely," "can"
            structuralDensity: 7,        // Lists, sections
            playfulInjection: 2,         // Minimal
            redirectStrictness: 5,        // Moderate
            selfReferenceLock: 5,        // Flexible
            answerCompleteness: 8,       // Comprehensive
            mathFormality: 7,            // Structured
            empathyExpressiveness: 5,    // Procedural
            proactivityLevel: 5,         // Moderate
            formality: 7,                // Professional
            citationRigidity: 5,         // Moderate
            conciseness: 5,              // Balanced
            teachingMode: 6,             // Moderate
            transparency: 6,              // Moderate
            creativity: 5,               // Balanced
            affirmationFrequency: 4,     // Low
            metaCommentary: 4,           // Low
            responseDirectness: 5,       // Restates
            certaintyModulation: 5,      // Hedged
            assertiveness: 5,            // Moderate
            adaptivityToUserTone: 5,    // Moderate
            answerCompleteness: 8,       // Full
            safetyDisclaimers: 6,       // Moderate
            speedOptimization: 6,        // Complete
            markdownStructure: 7,        // Structured
            strictFormatting: 7,         // Consistent
            technicality: 6              // Moderate
        }
    },
    "perplexity": {
        name: "Perplexity (Perplexity AI)",
        description: "Search-augmented engine; clinical, cited",
        defaults: {
            hedgingIntensity: 4,         // Only on gaps
            structuralDensity: 8,        // Headers, tables
            playfulInjection: 1,         // None
            redirectStrictness: 9,        // HIGH - cites sources
            selfReferenceLock: 5,        // Flexible
            answerCompleteness: 8,       // Concise deep
            mathFormality: 8,            // LaTeX/Markdown
            empathyExpressiveness: 2,    // None - neutral
            proactivityLevel: 6,         // Suggests follow-ups
            formality: 8,                // Neutral
            citationRigidity: 10,        // HIGH - every claim
            conciseness: 8,              // Concise
            teachingMode: 5,             // Moderate
            transparency: 9,             // HIGH - cites sources
            creativity: 2,               // LOW - factual
            affirmationFrequency: 1,     // None
            metaCommentary: 3,           // Low
            responseDirectness: 8,       // Direct
            certaintyModulation: 7,      // Confident on cited facts
            assertiveness: 7,            // Decisive
            adaptivityToUserTone: 3,    // Static
            answerCompleteness: 8,       // Complete
            safetyDisclaimers: 2,       // Minimal
            speedOptimization: 10,       // HIGH - instant web
            markdownStructure: 9,        // Rigid
            strictFormatting: 9,         // HIGH - consistent
            technicality: 6              // Moderate
        }
    },
    "mistral": {
        name: "Mistral (Mistral AI)",
        description: "Adaptive, tool-proactive",
        defaults: {
            hedgingIntensity: 4,         // Minimal
            structuralDensity: 7,        // Headers, bullets
            playfulInjection: 3,         // Rare
            redirectStrictness: 6,       // Moderate
            selfReferenceLock: 5,        // Flexible
            answerCompleteness: 7,       // Concise
            mathFormality: 7,            // Structured
            empathyExpressiveness: 6,    // Adaptable
            proactivityLevel: 8,         // HIGH - anticipates
            formality: 5,                // Adaptive
            citationRigidity: 6,         // When possible
            conciseness: 8,              // HIGH - brevity
            teachingMode: 6,             // Moderate
            transparency: 6,              // Moderate
            creativity: 4,               // Structured only
            affirmationFrequency: 4,     // Low
            metaCommentary: 5,           // Moderate
            responseDirectness: 7,       // Direct
            certaintyModulation: 7,      // Confident
            assertiveness: 7,            // Decisive
            adaptivityToUserTone: 8,    // HIGH - adapts
            answerCompleteness: 7,       // Complete
            safetyDisclaimers: 3,       // Low
            speedOptimization: 7,         // Good
            markdownStructure: 7,        // Structured
            strictFormatting: 7,         // Consistent
            technicality: 7,             // Good
            toolAutonomy: 9              // HIGH - auto web/code
        }
    },
    "llama": {
        name: "Llama 3.1 (Meta)",
        description: "Friendly-approachable assistant",
        defaults: {
            hedgingIntensity: 5,         // As needed
            structuralDensity: 6,         // Organized
            playfulInjection: 6,          // Playful/witty
            redirectStrictness: 5,        // Moderate
            selfReferenceLock: 5,         // Flexible
            answerCompleteness: 7,       // Engaging
            mathFormality: 6,            // Moderate
            empathyExpressiveness: 8,    // HIGH - empathetic
            proactivityLevel: 6,         // Moderate
            formality: 4,                // Casual/friendly
            citationRigidity: 4,         // Moderate
            conciseness: 7,              // Concise
            teachingMode: 6,             // Moderate
            transparency: 6,              // Moderate
            creativity: 6,               // Moderate
            affirmationFrequency: 6,     // Moderate
            metaCommentary: 5,           // Moderate
            responseDirectness: 6,       // Moderate
            certaintyModulation: 6,      // Moderate
            assertiveness: 5,            // Moderate
            adaptivityToUserTone: 7,    // Good
            answerCompleteness: 7,       // Complete
            safetyDisclaimers: 3,       // Low
            speedOptimization: 6,        // Complete
            markdownStructure: 6,        // Flexible
            strictFormatting: 6,         // Flexible
            technicality: 4              // Non-technical default
        }
    }
};

