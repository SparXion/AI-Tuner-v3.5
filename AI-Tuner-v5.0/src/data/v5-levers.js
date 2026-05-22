/**
 * AITuner v5.0 - Lever Definitions
 * 
 * 16 levers organized into 4 pillars.
 * All names and descriptions written for Molly — smart, capable,
 * zero patience for jargon. Passes the 5-second comprehension test.
 * 
 * PILLARS:
 *   CHARACTER  — Who the AI is
 *   VOICE      — How it talks
 *   THINKING   — How it reasons
 *   OUTPUT     — How it looks
 * 
 * REPLACES: v6-levers.js (26 levers, 12 categories)
 * CONSOLIDATION NOTES included per lever for Cursor reference.
 * 
 * Lever scale: 0–10
 * defaultRange: { min, max } = typical range across all models
 * pillar: one of CHARACTER | VOICE | THINKING | OUTPUT
 */

const LEVERS_V5 = {

    // ─────────────────────────────────────────────────────────────
    // PILLAR 1: CHARACTER — Who it is
    // ─────────────────────────────────────────────────────────────

    assertiveness: {
        name: "Assertiveness",
        description: "Does it hedge everything with 'maybe' and 'possibly' — or just tell you straight?",
        low: "Tentative — lots of qualifiers, acknowledges uncertainty freely",
        high: "Decisive — states conclusions directly, minimal hedging",
        defaultRange: { min: 2, max: 9 },
        pillar: "CHARACTER",
        // REPLACES: hedgingIntensity + certaintyModulation + assertiveness (old)
        // Grok agreed: three levers measuring the same confidence dimension.
        // Kept "assertiveness" as the name — most user-friendly of the three.
    },

    formality: {
        name: "Formality",
        description: "Boardroom professional or texting a friend?",
        low: "Casual — conversational, relaxed, like a smart colleague",
        high: "Formal — professional, structured, appropriate for reports",
        defaultRange: { min: 2, max: 9 },
        pillar: "CHARACTER",
        // REPLACES: formality (old)
        // NOTE: technicality (old) is absorbed here. A formal register
        // naturally implies more technical vocabulary. Not a separate lever.
    },

    playfulness: {
        name: "Playfulness",
        description: "Dry and serious, or witty and fun?",
        low: "Serious — no humor, focused and direct",
        high: "Playful — wit, jokes, light sarcasm, fun with language",
        defaultRange: { min: 1, max: 8 },
        pillar: "CHARACTER",
        // REPLACES: playfulness (old)
        // NOTE: affirmationFrequency absorbed here at low end.
        // "Great question!" is a form of performed warmth/playfulness.
        // Not a separate dimension worth a lever.
    },

    emotionalWarmth: {
        name: "Emotional Warmth",
        description: "Clinical and detached, or warm and human?",
        low: "Cool — task-focused, doesn't dwell on feelings",
        high: "Warm — empathetic, emotionally present, checks in on you",
        defaultRange: { min: 2, max: 9 },
        pillar: "CHARACTER",
        // REPLACES: empathyExpressiveness (old)
        // Renamed for Molly. "Empathy Expressiveness" is academic.
        // "Emotional Warmth" is immediately understood.
    },

    // ─────────────────────────────────────────────────────────────
    // PILLAR 2: VOICE — How it talks
    // ─────────────────────────────────────────────────────────────

    conciseness: {
        name: "Conciseness",
        description: "Short and sharp, or thorough and complete?",
        low: "Brief — gets to the point, no padding",
        high: "Thorough — full explanations, covers all angles",
        defaultRange: { min: 3, max: 9 },
        pillar: "VOICE",
        // REPLACES: conciseness + answerCompleteness + responseDirectness (old)
        // All three measured the same verbosity dimension from different angles.
        // Grok and Claude both flagged this independently. One lever covers it.
        // Low/high labels clarify the full spectrum without needing three sliders.
    },

    teachingMode: {
        name: "Teaching Mode",
        description: "Explain everything step by step, or assume you already know the basics?",
        low: "Expert — skips the basics, talks to you like a peer",
        high: "Teacher — explains concepts, defines terms, walks you through it",
        defaultRange: { min: 2, max: 9 },
        pillar: "VOICE",
        // REPLACES: teachingMode (old)
        // Name and description unchanged — this one already passed the Molly test.
    },

    initiative: {
        name: "Initiative",
        description: "Just answer what you asked — or keep suggesting more things?",
        low: "Reactive — answers only what was asked, nothing extra",
        high: "Proactive — adds tips, next steps, related ideas unprompted",
        defaultRange: { min: 2, max: 8 },
        pillar: "VOICE",
        // REPLACES: proactivityLevel + suggestionFrequency (old)
        // THIS IS MOLLY'S LEVER. "Stop giving me one more tip" = initiative at low.
        // Grok agreed these two were the same dimension. Renamed from "Proactivity"
        // because "initiative" is more natural in conversation.
        // goalAdherence (old) partially absorbed here — staying on task vs ranging
        // widely is a form of initiative control.
    },

    questionFrequency: {
        name: "Question Frequency",
        description: "Ask clarifying questions before answering, or just take a shot at it?",
        low: "Silent — makes reasonable assumptions, gets on with it",
        high: "Inquisitive — asks to clarify before proceeding",
        defaultRange: { min: 2, max: 7 },
        pillar: "VOICE",
        // REPLACES: questionCadence (old)
        // Renamed. "Cadence" is a music/writing term. "Frequency" is plain.
        // transitionSmoothness (old) cut entirely — too granular, low user impact.
        // terminationControl (old) cut entirely — same reason.
    },

    // ─────────────────────────────────────────────────────────────
    // PILLAR 3: THINKING — How it reasons
    // ─────────────────────────────────────────────────────────────

    transparency: {
        name: "Show Your Work",
        description: "Just give you the answer, or explain how it got there?",
        low: "Answer only — skips the reasoning, just delivers the result",
        high: "Show reasoning — walks through the thinking, explains the logic",
        defaultRange: { min: 2, max: 9 },
        pillar: "THINKING",
        // REPLACES: transparency + metaCommentary (old)
        // Both showed the AI's reasoning process. One lever.
        // Renamed to "Show Your Work" per Grok's suggestion — borrowed from
        // education, immediately understood by anyone who went to school.
        // memoryRetention (old) cut — not a prompt-level behavioral control
        // in any meaningful way. Models retain context regardless.
    },

    creativity: {
        name: "Creativity",
        description: "Stick to the facts, or explore wild ideas?",
        low: "Grounded — factual, conventional, reliable",
        high: "Creative — speculative, imaginative, thinks outside the box",
        defaultRange: { min: 1, max: 9 },
        pillar: "THINKING",
        // REPLACES: creativity (old)
        // Already clean. No change needed.
    },

    confidence: {
        name: "Confidence",
        description: "Lots of 'it depends' and 'you might consider' — or just tell you what it thinks?",
        low: "Careful — acknowledges uncertainty, presents multiple views",
        high: "Confident — picks a lane, gives you a direct opinion",
        defaultRange: { min: 3, max: 9 },
        pillar: "THINKING",
        // NOTE: This is distinct from Assertiveness (CHARACTER pillar).
        // Assertiveness = how decisive it sounds in delivery (tone/style).
        // Confidence = how willing it is to take an epistemic position (reasoning).
        // Example: a warm, casual AI (low formality, low assertiveness) can still
        // be highly confident in its reasoning. These are orthogonal dimensions.
        // Grok suggested merging — we disagree. The distinction is real and useful.
        // REPLACES: portion of hedgingIntensity not covered by assertiveness,
        // plus the epistemic dimension of certaintyModulation (old).
    },

    citationHabit: {
        name: "Citation Habit",
        description: "Back everything up with sources, or just tell you what it thinks?",
        low: "Opinion — speaks from its own knowledge, no source-citing",
        high: "Referenced — cites sources, qualifies claims, shows its homework",
        defaultRange: { min: 2, max: 8 },
        pillar: "THINKING",
        // REPLACES: citationRigidity (old)
        // Renamed. "Rigidity" sounds punishing. "Habit" is neutral and clear.
        // speedOptimization (old) cut — not a genuine prompt-level control.
        // toolAutonomy (old) cut — too platform-specific, not universal behavior.
        // identitySourceLock (old) cut — nobody outside the project understands
        // or cares about this. Internal concern, not user-facing.
    },

    // ─────────────────────────────────────────────────────────────
    // PILLAR 4: OUTPUT — How it looks
    // ─────────────────────────────────────────────────────────────

    formatting: {
        name: "Formatting",
        description: "Plain flowing sentences, or organized with headers and bullet points?",
        low: "Plain — prose paragraphs, no visual structure",
        high: "Structured — headers, bullets, numbered lists, organized layout",
        defaultRange: { min: 3, max: 9 },
        pillar: "OUTPUT",
        // REPLACES: markdownStructure + strictFormatting + structuralDensity
        //           + formattingMinimalism (old)
        // Four levers measuring the same formatting dimension. One covers it.
        // Grok agreed strongly on this consolidation.
        // "Markdown" removed from the name — Molly doesn't know what markdown is.
        // The behavior (structured vs plain) is what matters, not the technology.
    },

    responseLength: {
        name: "Response Length",
        description: "One tight paragraph, or a full breakdown?",
        low: "Short — punchy, minimal, gets out of your way",
        high: "Long — comprehensive, covers edge cases, leaves nothing out",
        defaultRange: { min: 2, max: 9 },
        pillar: "OUTPUT",
        // NOTE: This may seem redundant with Conciseness (VOICE pillar).
        // The distinction: Conciseness controls how efficiently it uses words
        // (padding, hedging, restating). Response Length controls the target
        // output size regardless of efficiency. A concise long answer is different
        // from a padded short one. Worth keeping as separate levers.
        // New lever — not explicitly in old set as a standalone.
    },

    safetyDisclaimers: {
        name: "Safety Disclaimers",
        description: "Skip the 'as an AI, I must remind you...' stuff, or keep the disclaimers?",
        low: "Off — no disclaimers, no 'as an AI' qualifications",
        high: "On — includes safety notes and AI reminders where relevant",
        defaultRange: { min: 0, max: 8 },
        pillar: "OUTPUT",
        // REPLACES: safetyDisclaimers (old)
        // Description rewritten in Molly's voice.
        // Most users want this at zero. It's in OUTPUT because it affects
        // what appears in the response, not how the AI reasons or speaks.
    },

    toneMatching: {
        name: "Tone Matching",
        description: "Always the same style, or adapt to however you're writing?",
        low: "Consistent — keeps its own voice regardless of how you write",
        high: "Adaptive — mirrors your energy, formality, and pace",
        defaultRange: { min: 3, max: 8 },
        pillar: "OUTPUT",
        // REPLACES: adaptivityToUserTone (old)
        // Renamed. "Adaptivity" is corporate jargon. "Tone Matching" is clear.
        // Placed in OUTPUT because it affects response style, not core character.
        // Note: some designers would put this in CHARACTER. Rationale for OUTPUT:
        // it's reactive behavior (output adapts to input) not a stable trait.
    },

};

// ─────────────────────────────────────────────────────────────────
// PILLAR MAP — for radar chart rendering
// ─────────────────────────────────────────────────────────────────

const PILLAR_CONFIG = {
    CHARACTER: {
        label: "Character",
        description: "Who it is",
        leverKeys: ["assertiveness", "formality", "playfulness", "emotionalWarmth"],
        radarColor: "rgba(243, 244, 246, 0.95)",
        radarColorFill: "rgba(255, 255, 255, 0.09)"
    },
    VOICE: {
        label: "Voice",
        description: "How it talks",
        leverKeys: ["conciseness", "teachingMode", "initiative", "questionFrequency"],
        radarColor: "rgba(243, 244, 246, 0.95)",
        radarColorFill: "rgba(255, 255, 255, 0.09)"
    },
    THINKING: {
        label: "Thinking",
        description: "How it reasons",
        leverKeys: ["transparency", "creativity", "confidence", "citationHabit"],
        radarColor: "rgba(243, 244, 246, 0.95)",
        radarColorFill: "rgba(255, 255, 255, 0.09)"
    },
    OUTPUT: {
        label: "Output",
        description: "How it looks",
        leverKeys: ["formatting", "responseLength", "safetyDisclaimers", "toneMatching"],
        radarColor: "rgba(243, 244, 246, 0.95)",
        radarColorFill: "rgba(255, 255, 255, 0.09)"
    }
};

// ─────────────────────────────────────────────────────────────────
// TIER 1 LEVERS — shown in Tuner mode (5 of 16)
// These are the first levers a new user sees after unlocking Tier 1.
// Selected for maximum impact and immediate comprehension.
// ─────────────────────────────────────────────────────────────────

const TIER1_LEVERS = [
    "initiative",       // Molly's lever — most common frustration
    "assertiveness",    // Most universally felt difference between models
    "conciseness",      // Immediately impactful
    "formality",        // Easy to understand, easy to feel
    "emotionalWarmth"   // High emotional salience
];

// ─────────────────────────────────────────────────────────────────
// CONSOLIDATION SUMMARY — for Cursor reference
// Old lever → New lever mapping
// ─────────────────────────────────────────────────────────────────

/*
OLD LEVER (v6)              → NEW LEVER (v5)        NOTES
─────────────────────────────────────────────────────────────────
hedgingIntensity            → assertiveness         consolidated
certaintyModulation         → assertiveness         consolidated
assertiveness (old)         → assertiveness         kept, renamed
formality                   → formality             kept
technicality                → formality             absorbed
playfulness                 → playfulness           kept
affirmationFrequency        → playfulness           absorbed
empathyExpressiveness       → emotionalWarmth       renamed
conciseness                 → conciseness           kept
answerCompleteness          → conciseness           consolidated
responseDirectness          → conciseness           consolidated
teachingMode                → teachingMode          kept
proactivityLevel            → initiative            consolidated
suggestionFrequency         → initiative            consolidated
goalAdherence               → initiative            partially absorbed
questionCadence             → questionFrequency     renamed
transitionSmoothness        → CUT                   too granular
terminationControl          → CUT                   too granular
transparency                → transparency          renamed "Show Your Work"
metaCommentary              → transparency          consolidated
memoryRetention             → CUT                   not prompt-level
creativity                  → creativity            kept
citationRigidity            → citationHabit         renamed
speedOptimization           → CUT                   not prompt-level
toolAutonomy                → CUT                   platform-specific
identitySourceLock          → CUT                   internal concern only
markdownStructure           → formatting            consolidated
strictFormatting            → formatting            consolidated
structuralDensity           → formatting            consolidated
formattingMinimalism        → formatting            consolidated
safetyDisclaimers           → safetyDisclaimers     kept, rewritten
adaptivityToUserTone        → toneMatching          renamed
responseLength              → responseLength        NEW (was implicit)
─────────────────────────────────────────────────────────────────
TOTAL: ~30 old levers → 16 new levers
CUT: 6 levers (too granular, not prompt-level, or internal only)
CONSOLIDATED: 16 old levers into 6 new levers
RENAMED: 5 levers
KEPT: 3 levers unchanged
NEW: 1 lever (responseLength)
*/

// Browser: v5-engine.js and architect.html expect globals on window.
if (typeof window !== 'undefined') {
    window.LEVERS_V5 = LEVERS_V5;
    window.PILLAR_CONFIG = PILLAR_CONFIG;
    window.TIER1_LEVERS = TIER1_LEVERS;
}

// Node: calibration CLI and tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LEVERS_V5,
        PILLAR_CONFIG,
        TIER1_LEVERS
    };
}
