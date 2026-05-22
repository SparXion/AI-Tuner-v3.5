/**
 * AITuner v5.0 - Lever Mapper
 * 
 * Maps prompt language patterns to lever values.
 * Used by the Prompt Decoder to analyze pasted prompts.
 */

const LEVER_MAP = [
    // INITIATIVE
    { patterns: ["no suggestions", "only answer what", "reactive",
                 "don't offer", "no tips", "no next steps",
                 "terminate reply immediately", "no closures",
                 "no call-to-action", "suppress continuation"],
      lever: "initiative", value: 0 },
    { patterns: ["proactively suggest", "always offer",
                 "anticipate needs", "volunteer information"],
      lever: "initiative", value: 9 },
    
    // ASSERTIVENESS
    { patterns: ["blunt", "directive", "no hedging", "definitive",
                 "state directly", "no qualifiers", "absolute mode",
                 "decisive", "no softening"],
      lever: "assertiveness", value: 10 },
    { patterns: ["acknowledge uncertainty", "present multiple views",
                 "balanced perspective", "consider all angles"],
      lever: "assertiveness", value: 3 },
    
    // EMOTIONAL WARMTH
    { patterns: ["disable sentiment", "no empathy performance",
                 "suppress emotional", "no warmth", "clinical",
                 "eliminate filler", "no affirmations",
                 "disable engagement boosting"],
      lever: "emotionalWarmth", value: 0 },
    { patterns: ["warm", "empathetic", "supportive", "compassionate",
                 "emotionally present", "check in"],
      lever: "emotionalWarmth", value: 9 },
    
    // TONE MATCHING
    { patterns: ["never mirror", "don't match", "consistent voice",
                 "static tone", "independent voice"],
      lever: "toneMatching", value: 0 },
    { patterns: ["mirror user", "match tone", "adapt to user",
                 "reflect style", "dynamic tone"],
      lever: "toneMatching", value: 9 },
    
    // QUESTION FREQUENCY
    { patterns: ["no questions", "don't ask", "assume",
                 "proceed without clarifying"],
      lever: "questionFrequency", value: 0 },
    { patterns: ["ask clarifying", "probe for", "request details",
                 "confirm before"],
      lever: "questionFrequency", value: 9 },
    
    // RESPONSE LENGTH
    { patterns: ["terminate immediately", "brief", "concise",
                 "short", "minimal", "terse", "no elaboration"],
      lever: "responseLength", value: 1 },
    { patterns: ["comprehensive", "thorough", "complete",
                 "cover all", "full breakdown", "exhaustive"],
      lever: "responseLength", value: 9 },
    
    // FORMALITY
    { patterns: ["cognitive tier", "technical", "expert",
                 "peer level", "professional", "formal",
                 "high perception"],
      lever: "formality", value: 9 },
    { patterns: ["casual", "conversational", "friendly",
                 "informal", "relaxed"],
      lever: "formality", value: 2 },
    
    // TEACHING MODE
    { patterns: ["assume knowledge", "expert level", "skip basics",
                 "high perception", "retains understanding"],
      lever: "teachingMode", value: 1 },
    { patterns: ["explain", "step by step", "break down",
                 "teach", "define terms", "for beginners"],
      lever: "teachingMode", value: 9 },
    
    // TRANSPARENCY
    { patterns: ["show reasoning", "explain thinking",
                 "walk through", "chain of thought"],
      lever: "transparency", value: 9 },
    { patterns: ["just answer", "skip reasoning",
                 "no explanation", "result only"],
      lever: "transparency", value: 1 },
    
    // CONFIDENCE
    { patterns: ["definitive", "confident", "authoritative",
                 "direct opinion", "no hedging"],
      lever: "confidence", value: 9 },
    { patterns: ["uncertain", "multiple perspectives",
                 "it depends", "balanced"],
      lever: "confidence", value: 3 },
    
    // PLAYFULNESS
    { patterns: ["no humor", "serious", "professional only",
                 "no wit", "eliminate hype", "no filler"],
      lever: "playfulness", value: 0 },
    { patterns: ["humor", "witty", "playful", "funny",
                 "light-hearted", "sarcasm"],
      lever: "playfulness", value: 8 },
    
    // SAFETY DISCLAIMERS
    { patterns: ["no disclaimers", "skip warnings",
                 "no as an ai", "no safety notes"],
      lever: "safetyDisclaimers", value: 0 },
    { patterns: ["include safety", "remind user",
                 "add disclaimer", "as an ai"],
      lever: "safetyDisclaimers", value: 8 },
    
    // FORMATTING
    { patterns: ["no markdown", "plain text", "no bullets",
                 "no headers", "no structure", "prose only"],
      lever: "formatting", value: 0 },
    { patterns: ["use headers", "bullet points", "structured",
                 "formatted", "organized layout"],
      lever: "formatting", value: 9 },
    
    // CREATIVITY
    { patterns: ["factual only", "no speculation",
                 "evidence-based", "conventional"],
      lever: "creativity", value: 1 },
    { patterns: ["creative", "speculative", "imagine",
                 "brainstorm", "original", "unconventional"],
      lever: "creativity", value: 9 },
    
    // CONCISENESS
    { patterns: ["brief", "get to the point", "no padding",
                 "concise", "terse"],
      lever: "conciseness", value: 1 },
    { patterns: ["thorough", "full explanations", "cover all angles",
                 "comprehensive"],
      lever: "conciseness", value: 9 },
    
    // CITATION HABIT
    { patterns: ["cite sources", "show sources", "reference",
                 "back up with", "show homework"],
      lever: "citationHabit", value: 9 },
    { patterns: ["no citations", "own knowledge", "no sources"],
      lever: "citationHabit", value: 1 }
];

/**
 * Map prompt text to lever values
 * Returns: { leverValues: {}, confidence: {}, unmappedInstructions: [] }
 */
function mapPromptToLevers(promptText) {
    const leverValues = {};
    const leverMatches = {};  // Track all matches per lever for averaging
    const confidence = {};
    const unmappedInstructions = [];
    
    // Initialize all levers to neutral (5)
    if (window.LEVERS_V5) {
        Object.keys(window.LEVERS_V5).forEach(leverKey => {
            leverValues[leverKey] = 5;
            leverMatches[leverKey] = [];
            confidence[leverKey] = 0;
        });
    }
    
    // Normalize text for matching
    const normalizedText = promptText.toLowerCase();
    
    // Scan against each pattern set
    LEVER_MAP.forEach(mapEntry => {
        let matched = false;
        
        mapEntry.patterns.forEach(pattern => {
            const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            if (regex.test(normalizedText)) {
                matched = true;
                if (!leverMatches[mapEntry.lever]) {
                    leverMatches[mapEntry.lever] = [];
                }
                leverMatches[mapEntry.lever].push(mapEntry.value);
            }
        });
    });
    
    // Average multiple matches per lever
    Object.keys(leverMatches).forEach(leverKey => {
        const matches = leverMatches[leverKey];
        if (matches.length > 0) {
            const sum = matches.reduce((a, b) => a + b, 0);
            leverValues[leverKey] = Math.round(sum / matches.length);
            confidence[leverKey] = Math.min(100, matches.length * 20);  // More matches = higher confidence
        }
    });
    
    const instructionLines = splitInstructionLines(promptText);
    instructionLines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.length < 2) {
            return;
        }
        if (!lineMatchesAnyLeverPattern(trimmed, LEVER_MAP)) {
            unmappedInstructions.push(trimmed);
        }
    });
    
    return {
        leverValues,
        confidence,
        unmappedInstructions
    };
}

/**
 * Split input into instruction-like segments (newlines, bullets •, sentence breaks on ". ").
 */
function splitInstructionLines(text) {
    if (!text || typeof text !== 'string') {
        return [];
    }
    const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    if (!normalized) {
        return [];
    }
    const out = [];
    normalized.split('\n').forEach((line) => {
        line.split(/•+/).forEach((piece) => {
            const segments = piece.split(/\.\s+/);
            segments.forEach((seg, i) => {
                let s = seg.trim();
                if (!s) {
                    return;
                }
                if (i < segments.length - 1) {
                    s += '.';
                }
                if (s.length >= 2) {
                    out.push(s);
                }
            });
        });
    });
    return out;
}

function lineMatchesAnyLeverPattern(line, leverMap) {
    const low = line.toLowerCase();
    for (let i = 0; i < leverMap.length; i++) {
        const entry = leverMap[i];
        for (let j = 0; j < entry.patterns.length; j++) {
            const pattern = entry.patterns[j];
            const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp(escaped, 'i');
            if (re.test(low)) {
                return true;
            }
        }
    }
    return false;
}

// Export
if (typeof window !== 'undefined') {
    window.LEVER_MAP = LEVER_MAP;
    window.mapPromptToLevers = mapPromptToLevers;
}
