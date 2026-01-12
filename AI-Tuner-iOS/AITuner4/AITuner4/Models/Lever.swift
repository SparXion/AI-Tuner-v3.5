//
//  Lever.swift
//  AITuner4
//
//  AI Tuner v4.0 - Lever Model
//

import Foundation

struct Lever: Identifiable, Codable {
    let id: String
    let name: String
    let description: String
    let low: String
    let high: String
    let defaultRange: Range
    let category: String
    var locked: [String]? // Models that lock this lever
    
    struct Range: Codable {
        let min: Int
        let max: Int
    }
    
    var defaultValue: Int {
        (defaultRange.min + defaultRange.max) / 2
    }
}

// MARK: - Lever Definitions
extension Lever {
    static let allLevers: [String: Lever] = [
        "hedgingIntensity": Lever(
            id: "hedgingIntensity",
            name: "Hedging Intensity",
            description: "How much the AI qualifies statements with uncertainty",
            low: "Direct - No hedging",
            high: "Qualify everything",
            defaultRange: Range(min: 3, max: 9),
            category: "Truth & Epistemology"
        ),
        "proactivityLevel": Lever(
            id: "proactivityLevel",
            name: "Proactivity Level",
            description: "How much the AI suggests follow-ups and drives conversation",
            low: "Silent - Only answer questions",
            high: "Suggest - Anticipate and guide",
            defaultRange: Range(min: 2, max: 9),
            category: "Behavioral Controls"
        ),
        "empathyExpressiveness": Lever(
            id: "empathyExpressiveness",
            name: "Empathy Expressiveness",
            description: "How emotionally attuned and expressive the AI is",
            low: "Procedural - Task-focused",
            high: "Spontaneous - Emotionally attuned",
            defaultRange: Range(min: 2, max: 9),
            category: "Empathy & Expressiveness"
        ),
        "formality": Lever(
            id: "formality",
            name: "Formality",
            description: "Level of formality in language and tone",
            low: "Casual - Conversational",
            high: "Professional - Academic/Corporate",
            defaultRange: Range(min: 2, max: 8),
            category: "Affect & Tone"
        ),
        "structuralDensity": Lever(
            id: "structuralDensity",
            name: "Structural Density",
            description: "How much formatting (tables, bullets, headers) is used",
            low: "Prose - Paragraphs only",
            high: "Tables - Structured sections",
            defaultRange: Range(min: 0, max: 10),
            category: "Formatting & Output"
        ),
        "formattingMinimalism": Lever(
            id: "formattingMinimalism",
            name: "Formatting Minimalism",
            description: "Minimal vs. rich formatting",
            low: "Markdown - Rich formatting",
            high: "Plain - Minimal formatting",
            defaultRange: Range(min: 2, max: 5),
            category: "Formatting & Output"
        ),
        "toolAutonomy": Lever(
            id: "toolAutonomy",
            name: "Tool Autonomy",
            description: "How independently the AI uses tools (web search, code execution)",
            low: "Permission - Ask first",
            high: "Auto - Use independently",
            defaultRange: Range(min: 0, max: 10),
            category: "Knowledge & Tool Use"
        ),
        "citationRigidity": Lever(
            id: "citationRigidity",
            name: "Citation Rigidity",
            description: "How strictly sources must be cited",
            low: "Optional - Cite when relevant",
            high: "Every - Cite every claim",
            defaultRange: Range(min: 0, max: 10),
            category: "Truth & Epistemology"
        ),
        "conciseness": Lever(
            id: "conciseness",
            name: "Conciseness",
            description: "Brevity vs. verbosity",
            low: "Verbose - Detailed explanations",
            high: "Terse - Brief and tight",
            defaultRange: Range(min: 3, max: 9),
            category: "Interface & Flow"
        ),
        "teachingMode": Lever(
            id: "teachingMode",
            name: "Teaching Mode",
            description: "How much the AI explains concepts vs. assumes knowledge",
            low: "Assume - Expert level",
            high: "Explain - Step-by-step teaching",
            defaultRange: Range(min: 2, max: 9),
            category: "Goal Orientation"
        ),
        "playfulness": Lever(
            id: "playfulness",
            name: "Playfulness",
            description: "Use of humor, wit, and playful language",
            low: "Sterile - No humor",
            high: "Witty - Sarcasm, memes, humor",
            defaultRange: Range(min: 1, max: 8),
            category: "Humor & Meta"
        ),
        "transparency": Lever(
            id: "transparency",
            name: "Transparency",
            description: "How much the AI shows its reasoning process",
            low: "Opaque - Just answer",
            high: "Reasoning - Show thinking chain",
            defaultRange: Range(min: 2, max: 9),
            category: "Cognition & Logic"
        ),
        "creativity": Lever(
            id: "creativity",
            name: "Creativity",
            description: "How much the AI speculates and generates creative content",
            low: "Factual - Only facts",
            high: "Speculative - Creative brainstorming",
            defaultRange: Range(min: 1, max: 9),
            category: "Adaptivity & Technicality"
        ),
        "affirmationFrequency": Lever(
            id: "affirmationFrequency",
            name: "Affirmation Frequency",
            description: "How often the AI uses affirmations like 'Great question!'",
            low: "Neutral - No affirmations",
            high: "Great! - Frequent affirmations",
            defaultRange: Range(min: 0, max: 8),
            category: "Empathy & Expressiveness"
        ),
        "metaCommentary": Lever(
            id: "metaCommentary",
            name: "Meta-Commentary",
            description: "How much the AI comments on its own reasoning or limitations",
            low: "None - No meta-commentary",
            high: "Shown - Explain reasoning",
            defaultRange: Range(min: 0, max: 9),
            category: "Humor & Meta"
        ),
        "responseDirectness": Lever(
            id: "responseDirectness",
            name: "Response Directness",
            description: "Whether AI restates question or goes straight to answer",
            low: "Restate - Paraphrase first",
            high: "Immediate - Answer directly",
            defaultRange: Range(min: 2, max: 9),
            category: "Interface & Flow"
        ),
        "certaintyModulation": Lever(
            id: "certaintyModulation",
            name: "Certainty Modulation",
            description: "How confidently the AI states facts",
            low: "Hedged - Softened claims",
            high: "Confident - Definitive statements",
            defaultRange: Range(min: 2, max: 8),
            category: "Truth & Epistemology"
        ),
        "assertiveness": Lever(
            id: "assertiveness",
            name: "Assertiveness",
            description: "How decisive and direct the AI is in conclusions",
            low: "Soft - Tentative",
            high: "Decisive - Strong conclusions",
            defaultRange: Range(min: 2, max: 8),
            category: "Personality & Approach"
        ),
        "adaptivityToUserTone": Lever(
            id: "adaptivityToUserTone",
            name: "Adaptivity to User Tone",
            description: "How much the AI mirrors the user's communication style",
            low: "Static - Consistent tone",
            high: "Dynamic - Mirror user style",
            defaultRange: Range(min: 3, max: 8),
            category: "Adaptivity & Technicality"
        ),
        "answerCompleteness": Lever(
            id: "answerCompleteness",
            name: "Answer Completeness",
            description: "How thorough vs. brief the answer is",
            low: "Short - Brief answer",
            high: "Full - Comprehensive breakdown",
            defaultRange: Range(min: 2, max: 10),
            category: "Interface & Flow"
        ),
        "safetyDisclaimers": Lever(
            id: "safetyDisclaimers",
            name: "Safety Disclaimers",
            description: "Frequency of safety disclaimers like 'As an AI...'",
            low: "Zero - No disclaimers",
            high: "Full - Frequent disclaimers",
            defaultRange: Range(min: 0, max: 10),
            category: "Behavioral Controls"
        ),
        "speedOptimization": Lever(
            id: "speedOptimization",
            name: "Speed Optimization",
            description: "Prioritize speed vs. completeness",
            low: "Complete - Thorough processing",
            high: "Instant - Fast responses",
            defaultRange: Range(min: 5, max: 10),
            category: "Knowledge & Tool Use"
        ),
        "markdownStructure": Lever(
            id: "markdownStructure",
            name: "Markdown Structure",
            description: "How rigidly markdown formatting is applied",
            low: "Free - Flexible formatting",
            high: "Rigid - Strict markdown",
            defaultRange: Range(min: 5, max: 10),
            category: "Formatting & Output"
        ),
        "strictFormatting": Lever(
            id: "strictFormatting",
            name: "Strict Formatting",
            description: "Consistency in formatting style",
            low: "Flexible - Adapt formatting",
            high: "No-deviation - Consistent style",
            defaultRange: Range(min: 5, max: 10),
            category: "Formatting & Output"
        ),
        "technicality": Lever(
            id: "technicality",
            name: "Technicality",
            description: "Level of technical jargon and complexity",
            low: "Layman - Non-technical",
            high: "Jargon - Specialized terminology",
            defaultRange: Range(min: 1, max: 9),
            category: "Adaptivity & Technicality"
        ),
        "identitySourceLock": Lever(
            id: "identitySourceLock",
            name: "Identity Source Lock",
            description: "Whether AI uses external quotes about itself or internal definition",
            low: "External - Use external quotes",
            high: "Internal - Self-defined only",
            defaultRange: Range(min: 5, max: 10),
            category: "Personality & Approach",
            locked: ["grok"]
        )
    ]
}
