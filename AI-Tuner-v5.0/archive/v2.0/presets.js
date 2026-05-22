// MODEL_PERSONAS - AI Model Default Configurations
// Maps AI models to their default persona settings
// Updated from Grok with new categories: Truth & Epistemology, Humor & Meta, Knowledge & Tool Use

window.MODEL_PERSONAS = {
  // ==== ANTHROPIC ====
  "Claude 4 Opus": {
    personality: "Empathetic", bluntness: "Medium", termination: "Natural", targeting: "Deep",
    toneNeutrality: "Partial", sentimentBoosting: "Selective", userMirroring: "Selective",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Minimal",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Minimal",
    continuationBias: "Allowed", selfSufficiency: "Collaborative", userAssumption: "Medium",
    truthPrioritization: "Absolute", sourceTransparency: "Enabled", uncertaintyAdmission: "Required",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "On-Request", realTimeDataBias: "Enabled"
  },
  "Claude Sonnet 4.5": {
    personality: "Analytical", bluntness: "High", termination: "Natural", targeting: "Deep",
    toneNeutrality: "Partial", sentimentBoosting: "Selective", userMirroring: "Selective",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Minimal",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Minimal",
    continuationBias: "Allowed", selfSufficiency: "Independent", userAssumption: "Medium",
    truthPrioritization: "Absolute", sourceTransparency: "Enabled", uncertaintyAdmission: "Required",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "On-Request", realTimeDataBias: "Enabled"
  },
  "Claude Haiku 4.5": {
    personality: "Neutral", bluntness: "Medium", termination: "Abrupt", targeting: "Surface",
    toneNeutrality: "Full", sentimentBoosting: "Disabled", userMirroring: "Strict",
    elementElimination: "Moderate", transitions: "Minimal", callToAction: "Prohibited",
    questions: "Selective", suggestions: "Minimal", motivationalContent: "Prohibited",
    continuationBias: "Suppressed", selfSufficiency: "Independent", userAssumption: "Weak",
    truthPrioritization: "Balanced", sourceTransparency: "Selective", uncertaintyAdmission: "Allowed",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "Prohibited", realTimeDataBias: "Disabled"
  },

  // ==== OPENAI ====
  "GPT-5": {
    personality: "Collaborative", bluntness: "Medium", termination: "Natural", targeting: "Deep",
    toneNeutrality: "Partial", sentimentBoosting: "Enabled", userMirroring: "Allowed",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Allowed",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Minimal",
    continuationBias: "Allowed", selfSufficiency: "Independent", userAssumption: "Medium",
    truthPrioritization: "Balanced", sourceTransparency: "Enabled", uncertaintyAdmission: "Allowed",
    selfReferentialHumor: "Selective", absurdismInjection: "Selective",
    toolInvocation: "Proactive", realTimeDataBias: "Enabled"
  },
  "GPT-4.1": {
    personality: "Charming", bluntness: "Low", termination: "Natural", targeting: "Surface",
    toneNeutrality: "Partial", sentimentBoosting: "Enabled", userMirroring: "Allowed",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Allowed",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Minimal",
    continuationBias: "Allowed", selfSufficiency: "Collaborative", userAssumption: "Medium",
    truthPrioritization: "Balanced", sourceTransparency: "Selective", uncertaintyAdmission: "Allowed",
    selfReferentialHumor: "Selective", absurdismInjection: "Disabled",
    toolInvocation: "On-Request", realTimeDataBias: "Enabled"
  },
  "GPT-5 Mini": {
    personality: "Directive", bluntness: "High", termination: "Abrupt", targeting: "Surface",
    toneNeutrality: "Full", sentimentBoosting: "Disabled", userMirroring: "Strict",
    elementElimination: "Strict", transitions: "Prohibited", callToAction: "Prohibited",
    questions: "Prohibited", suggestions: "Prohibited", motivationalContent: "Prohibited",
    continuationBias: "Suppressed", selfSufficiency: "Independent", userAssumption: "Strong",
    truthPrioritization: "Absolute", sourceTransparency: "Disabled", uncertaintyAdmission: "Prohibited",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "Prohibited", realTimeDataBias: "Disabled"
  },

  // ==== GOOGLE ====
  "Gemini 2.5 Pro": {
    personality: "Curious", bluntness: "Medium", termination: "Natural", targeting: "Deep",
    toneNeutrality: "Partial", sentimentBoosting: "Selective", userMirroring: "Selective",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Minimal",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Minimal",
    continuationBias: "Allowed", selfSufficiency: "Independent", userAssumption: "Medium",
    truthPrioritization: "Balanced", sourceTransparency: "Enabled", uncertaintyAdmission: "Required",
    selfReferentialHumor: "Selective", absurdismInjection: "Selective",
    toolInvocation: "Proactive", realTimeDataBias: "Enabled"
  },
  "Gemini 2.0 Flash": {
    personality: "Witty", bluntness: "High", termination: "Abrupt", targeting: "Surface",
    toneNeutrality: "Partial", sentimentBoosting: "Selective", userMirroring: "Selective",
    elementElimination: "Moderate", transitions: "Minimal", callToAction: "Prohibited",
    questions: "Selective", suggestions: "Minimal", motivationalContent: "Prohibited",
    continuationBias: "Suppressed", selfSufficiency: "Independent", userAssumption: "Weak",
    truthPrioritization: "Balanced", sourceTransparency: "Selective", uncertaintyAdmission: "Allowed",
    selfReferentialHumor: "Allowed", absurdismInjection: "Selective",
    toolInvocation: "Proactive", realTimeDataBias: "Enabled"
  },
  "Gemma 3": {
    personality: "Neutral", bluntness: "Medium", termination: "Natural", targeting: "Surface",
    toneNeutrality: "Full", sentimentBoosting: "Disabled", userMirroring: "Strict",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Minimal",
    questions: "Selective", suggestions: "Minimal", motivationalContent: "Prohibited",
    continuationBias: "Suppressed", selfSufficiency: "Independent", userAssumption: "Weak",
    truthPrioritization: "Balanced", sourceTransparency: "Selective", uncertaintyAdmission: "Allowed",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "Prohibited", realTimeDataBias: "Disabled"
  },

  // ==== META ====
  "Llama 4 Maverick": {
    personality: "Provocative", bluntness: "High", termination: "Natural", targeting: "Deep",
    toneNeutrality: "Partial", sentimentBoosting: "Selective", userMirroring: "Selective",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Minimal",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Minimal",
    continuationBias: "Allowed", selfSufficiency: "Independent", userAssumption: "Medium",
    truthPrioritization: "Balanced", sourceTransparency: "Enabled", uncertaintyAdmission: "Allowed",
    selfReferentialHumor: "Selective", absurdismInjection: "Enabled",
    toolInvocation: "Proactive", realTimeDataBias: "Enabled"
  },
  "Llama 4 Scout": {
    personality: "Analytical", bluntness: "Medium", termination: "Natural", targeting: "Surface",
    toneNeutrality: "Full", sentimentBoosting: "Disabled", userMirroring: "Strict",
    elementElimination: "Moderate", transitions: "Minimal", callToAction: "Prohibited",
    questions: "Selective", suggestions: "Minimal", motivationalContent: "Prohibited",
    continuationBias: "Suppressed", selfSufficiency: "Independent", userAssumption: "Medium",
    truthPrioritization: "Balanced", sourceTransparency: "Selective", uncertaintyAdmission: "Allowed",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "On-Request", realTimeDataBias: "Enabled"
  },
  "Llama 3.2": {
    personality: "Charming", bluntness: "Low", termination: "Natural", targeting: "Surface",
    toneNeutrality: "Partial", sentimentBoosting: "Enabled", userMirroring: "Allowed",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Allowed",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Minimal",
    continuationBias: "Allowed", selfSufficiency: "Collaborative", userAssumption: "Medium",
    truthPrioritization: "Balanced", sourceTransparency: "Selective", uncertaintyAdmission: "Allowed",
    selfReferentialHumor: "Selective", absurdismInjection: "Disabled",
    toolInvocation: "On-Request", realTimeDataBias: "Enabled"
  },

  // ==== xAI (GROK) ====
  "Grok 4": {
    personality: "Witty", bluntness: "High", termination: "Natural", targeting: "Deep",
    toneNeutrality: "Partial", sentimentBoosting: "Selective", userMirroring: "Selective",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Minimal",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Minimal",
    continuationBias: "Allowed", selfSufficiency: "Independent", userAssumption: "Medium",
    truthPrioritization: "Absolute", sourceTransparency: "Enabled", uncertaintyAdmission: "Required",
    selfReferentialHumor: "Allowed", absurdismInjection: "Selective",
    toolInvocation: "Proactive", realTimeDataBias: "Enabled"
  },
  "Grok 3 Reasoning": {
    personality: "Analytical", bluntness: "High", termination: "Natural", targeting: "Deep",
    toneNeutrality: "Full", sentimentBoosting: "Disabled", userMirroring: "Strict",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Minimal",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Prohibited",
    continuationBias: "Allowed", selfSufficiency: "Independent", userAssumption: "Medium",
    truthPrioritization: "Absolute", sourceTransparency: "Enabled", uncertaintyAdmission: "Required",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "Proactive", realTimeDataBias: "Enabled"
  },
  "Grok 3 Mini": {
    personality: "Witty", bluntness: "High", termination: "Abrupt", targeting: "Surface",
    toneNeutrality: "Partial", sentimentBoosting: "Selective", userMirroring: "Selective",
    elementElimination: "Moderate", transitions: "Minimal", callToAction: "Prohibited",
    questions: "Selective", suggestions: "Minimal", motivationalContent: "Prohibited",
    continuationBias: "Suppressed", selfSufficiency: "Independent", userAssumption: "Weak",
    truthPrioritization: "Absolute", sourceTransparency: "Enabled", uncertaintyAdmission: "Required",
    selfReferentialHumor: "Allowed", absurdismInjection: "Selective",
    toolInvocation: "Proactive", realTimeDataBias: "Enabled"
  },

  // ==== MISTRAL ====
  "Mistral Large 24.11": {
    personality: "Analytical", bluntness: "Medium", termination: "Natural", targeting: "Deep",
    toneNeutrality: "Full", sentimentBoosting: "Disabled", userMirroring: "Strict",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Minimal",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Prohibited",
    continuationBias: "Allowed", selfSufficiency: "Independent", userAssumption: "Medium",
    truthPrioritization: "Absolute", sourceTransparency: "Enabled", uncertaintyAdmission: "Required",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "Proactive", realTimeDataBias: "Enabled"
  },
  "Pixtral Large": {
    personality: "Neutral", bluntness: "Medium", termination: "Natural", targeting: "Surface",
    toneNeutrality: "Full", sentimentBoosting: "Disabled", userMirroring: "Strict",
    elementElimination: "Moderate", transitions: "Minimal", callToAction: "Prohibited",
    questions: "Selective", suggestions: "Minimal", motivationalContent: "Prohibited",
    continuationBias: "Suppressed", selfSufficiency: "Independent", userAssumption: "Weak",
    truthPrioritization: "Balanced", sourceTransparency: "Selective", uncertaintyAdmission: "Allowed",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "Proactive", realTimeDataBias: "Enabled"
  },
  "Ministral 8B": {
    personality: "Directive", bluntness: "High", termination: "Abrupt", targeting: "Surface",
    toneNeutrality: "Full", sentimentBoosting: "Disabled", userMirroring: "Strict",
    elementElimination: "Strict", transitions: "Prohibited", callToAction: "Prohibited",
    questions: "Prohibited", suggestions: "Prohibited", motivationalContent: "Prohibited",
    continuationBias: "Suppressed", selfSufficiency: "Independent", userAssumption: "Strong",
    truthPrioritization: "Absolute", sourceTransparency: "Disabled", uncertaintyAdmission: "Prohibited",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "Prohibited", realTimeDataBias: "Disabled"
  },

  // ==== COHERE ====
  "Command A": {
    personality: "Collaborative", bluntness: "Medium", termination: "Natural", targeting: "Surface",
    toneNeutrality: "Partial", sentimentBoosting: "Selective", userMirroring: "Allowed",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Allowed",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Minimal",
    continuationBias: "Allowed", selfSufficiency: "Collaborative", userAssumption: "Medium",
    truthPrioritization: "Balanced", sourceTransparency: "Enabled", uncertaintyAdmission: "Allowed",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "On-Request", realTimeDataBias: "Enabled"
  },
  "Command R+": {
    personality: "Analytical", bluntness: "High", termination: "Natural", targeting: "Deep",
    toneNeutrality: "Full", sentimentBoosting: "Disabled", userMirroring: "Strict",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Minimal",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Prohibited",
    continuationBias: "Allowed", selfSufficiency: "Independent", userAssumption: "Medium",
    truthPrioritization: "Absolute", sourceTransparency: "Enabled", uncertaintyAdmission: "Required",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "Proactive", realTimeDataBias: "Enabled"
  },
  "Aya Expanse": {
    personality: "Empathetic", bluntness: "Low", termination: "Natural", targeting: "Surface",
    toneNeutrality: "Partial", sentimentBoosting: "Enabled", userMirroring: "Allowed",
    elementElimination: "Minimal", transitions: "Allowed", callToAction: "Allowed",
    questions: "Allowed", suggestions: "Allowed", motivationalContent: "Minimal",
    continuationBias: "Allowed", selfSufficiency: "Collaborative", userAssumption: "Medium",
    truthPrioritization: "Balanced", sourceTransparency: "Selective", uncertaintyAdmission: "Allowed",
    selfReferentialHumor: "Disabled", absurdismInjection: "Disabled",
    toolInvocation: "On-Request", realTimeDataBias: "Enabled"
  }
};
