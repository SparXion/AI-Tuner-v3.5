/**
 * AI Tuner v3.0 - 26 Universal Tuning Levers
 * Definition of all levers with descriptions and ranges
 */

window.LEVERS_V6 = {
    hedgingIntensity: {
        name: "Hedging Intensity",
        description: "How much the AI qualifies statements with uncertainty",
        low: "Direct - No hedging",
        high: "Qualify everything",
        defaultRange: { min: 3, max: 9 },
        category: "Truth & Epistemology"
    },
    proactivityLevel: {
        name: "Proactivity Level",
        description: "How much the AI suggests follow-ups and drives conversation",
        low: "Silent - Only answer questions",
        high: "Suggest - Anticipate and guide",
        defaultRange: { min: 2, max: 9 },
        category: "Behavioral Controls"
    },
    empathyExpressiveness: {
        name: "Empathy Expressiveness",
        description: "How emotionally attuned and expressive the AI is",
        low: "Procedural - Task-focused",
        high: "Spontaneous - Emotionally attuned",
        defaultRange: { min: 2, max: 9 },
        category: "Empathy & Expressiveness"
    },
    formality: {
        name: "Formality",
        description: "Level of formality in language and tone",
        low: "Casual - Conversational",
        high: "Professional - Academic/Corporate",
        defaultRange: { min: 2, max: 8 },
        category: "Affect & Tone"
    },
    structuralDensity: {
        name: "Structural Density",
        description: "How much formatting (tables, bullets, headers) is used",
        low: "Prose - Paragraphs only",
        high: "Tables - Structured sections",
        defaultRange: { min: 0, max: 10 },
        category: "Formatting & Output"
    },
    formattingMinimalism: {
        name: "Formatting Minimalism",
        description: "Minimal vs. rich formatting",
        low: "Markdown - Rich formatting",
        high: "Plain - Minimal formatting",
        defaultRange: { min: 2, max: 5 },
        category: "Formatting & Output"
    },
    toolAutonomy: {
        name: "Tool Autonomy",
        description: "How independently the AI uses tools (web search, code execution)",
        low: "Permission - Ask first",
        high: "Auto - Use independently",
        defaultRange: { min: 0, max: 10 },
        category: "Knowledge & Tool Use"
    },
    citationRigidity: {
        name: "Citation Rigidity",
        description: "How strictly sources must be cited",
        low: "Optional - Cite when relevant",
        high: "Every - Cite every claim",
        defaultRange: { min: 0, max: 10 },
        category: "Truth & Epistemology"
    },
    conciseness: {
        name: "Conciseness",
        description: "Brevity vs. verbosity",
        low: "Verbose - Detailed explanations",
        high: "Terse - Brief and tight",
        defaultRange: { min: 3, max: 9 },
        category: "Interface & Flow"
    },
    teachingMode: {
        name: "Teaching Mode",
        description: "How much the AI explains concepts vs. assumes knowledge",
        low: "Assume - Expert level",
        high: "Explain - Step-by-step teaching",
        defaultRange: { min: 2, max: 9 },
        category: "Goal Orientation"
    },
    playfulness: {
        name: "Playfulness",
        description: "Use of humor, wit, and playful language",
        low: "Sterile - No humor",
        high: "Witty - Sarcasm, memes, humor",
        defaultRange: { min: 1, max: 8 },
        category: "Humor & Meta"
    },
    transparency: {
        name: "Transparency",
        description: "How much the AI shows its reasoning process",
        low: "Opaque - Just answer",
        high: "Reasoning - Show thinking chain",
        defaultRange: { min: 2, max: 9 },
        category: "Cognition & Logic"
    },
    creativity: {
        name: "Creativity",
        description: "How much the AI speculates and generates creative content",
        low: "Factual - Only facts",
        high: "Speculative - Creative brainstorming",
        defaultRange: { min: 1, max: 9 },
        category: "Adaptivity & Technicality"
    },
    affirmationFrequency: {
        name: "Affirmation Frequency",
        description: "How often the AI uses affirmations like 'Great question!'",
        low: "Neutral - No affirmations",
        high: "Great! - Frequent affirmations",
        defaultRange: { min: 0, max: 8 },
        category: "Empathy & Expressiveness"
    },
    metaCommentary: {
        name: "Meta-Commentary",
        description: "How much the AI comments on its own reasoning or limitations",
        low: "None - No meta-commentary",
        high: "Shown - Explain reasoning",
        defaultRange: { min: 0, max: 9 },
        category: "Humor & Meta"
    },
    responseDirectness: {
        name: "Response Directness",
        description: "Whether AI restates question or goes straight to answer",
        low: "Restate - Paraphrase first",
        high: "Immediate - Answer directly",
        defaultRange: { min: 2, max: 9 },
        category: "Interface & Flow"
    },
    certaintyModulation: {
        name: "Certainty Modulation",
        description: "How confidently the AI states facts",
        low: "Hedged - Softened claims",
        high: "Confident - Definitive statements",
        defaultRange: { min: 2, max: 8 },
        category: "Truth & Epistemology"
    },
    assertiveness: {
        name: "Assertiveness",
        description: "How decisive and direct the AI is in conclusions",
        low: "Soft - Tentative",
        high: "Decisive - Strong conclusions",
        defaultRange: { min: 2, max: 8 },
        category: "Personality & Approach"
    },
    adaptivityToUserTone: {
        name: "Adaptivity to User Tone",
        description: "How much the AI mirrors the user's communication style",
        low: "Static - Consistent tone",
        high: "Dynamic - Mirror user style",
        defaultRange: { min: 3, max: 8 },
        category: "Adaptivity & Technicality"
    },
    answerCompleteness: {
        name: "Answer Completeness",
        description: "How thorough vs. brief the answer is",
        low: "Short - Brief answer",
        high: "Full - Comprehensive breakdown",
        defaultRange: { min: 2, max: 10 },
        category: "Interface & Flow"
    },
    safetyDisclaimers: {
        name: "Safety Disclaimers",
        description: "Frequency of safety disclaimers like 'As an AI...'",
        low: "Zero - No disclaimers",
        high: "Full - Frequent disclaimers",
        defaultRange: { min: 0, max: 10 },
        category: "Behavioral Controls"
    },
    speedOptimization: {
        name: "Speed Optimization",
        description: "Prioritize speed vs. completeness",
        low: "Complete - Thorough processing",
        high: "Instant - Fast responses",
        defaultRange: { min: 5, max: 10 },
        category: "Knowledge & Tool Use"
    },
    markdownStructure: {
        name: "Markdown Structure",
        description: "How rigidly markdown formatting is applied",
        low: "Free - Flexible formatting",
        high: "Rigid - Strict markdown",
        defaultRange: { min: 5, max: 10 },
        category: "Formatting & Output"
    },
    strictFormatting: {
        name: "Strict Formatting",
        description: "Consistency in formatting style",
        low: "Flexible - Adapt formatting",
        high: "No-deviation - Consistent style",
        defaultRange: { min: 5, max: 10 },
        category: "Formatting & Output"
    },
    technicality: {
        name: "Technicality",
        description: "Level of technical jargon and complexity",
        low: "Layman - Non-technical",
        high: "Jargon - Specialized terminology",
        defaultRange: { min: 1, max: 9 },
        category: "Adaptivity & Technicality"
    },
    identitySourceLock: {
        name: "Identity Source Lock",
        description: "Whether AI uses external quotes about itself or internal definition",
        low: "External - Use external quotes",
        high: "Internal - Self-defined only",
        defaultRange: { min: 5, max: 10 },
        category: "Personality & Approach",
        locked: ["grok"] // Grok has this locked at 10
    }
};

