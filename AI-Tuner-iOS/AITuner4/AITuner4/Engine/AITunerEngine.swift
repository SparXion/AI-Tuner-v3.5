//
//  AITunerEngine.swift
//  AITuner4
//
//  AI Tuner v4.0 - Core Engine
//
//  Copyright 2025 John Violette
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//

import Foundation
import Combine

class AITunerEngine: ObservableObject {
    @Published var selectedModel: AIModel?
    @Published var selectedPersona: Persona?
    @Published var personality: PersonalityType = .neutral
    @Published var levers: [String: Int] = [:]
    @Published var generatedPrompt: String = ""
    @Published var mode: TuningMode = .simple
    @Published var emojiShutoff: Bool = false
    
    enum PersonalityType: String, CaseIterable {
        case neutral = "neutral"
        case socratic = "socratic"
        case curious = "curious"
        case analytical = "analytical"
        case sarcastic = "sarcastic"
        case witty = "witty"
        case charming = "charming"
        case sympathetic = "sympathetic"
        case empathetic = "empathetic"
        case directive = "directive"
        case collaborative = "collaborative"
        case provocative = "provocative"
        
        var displayName: String {
            switch self {
            case .neutral: return "Neutral - Objective, balanced"
            case .socratic: return "Socratic - Question-driven, probing"
            case .curious: return "Curious - Inquisitive, exploratory"
            case .analytical: return "Analytical - Methodical, systematic"
            case .sarcastic: return "Sarcastic - Sharp, ironic"
            case .witty: return "Witty - Clever, humorous"
            case .charming: return "Charming - Engaging, charismatic"
            case .sympathetic: return "Sympathetic - Understanding, supportive"
            case .empathetic: return "Empathetic - Emotionally attuned"
            case .directive: return "Directive - Authoritative, commanding"
            case .collaborative: return "Collaborative - Cooperative, inclusive"
            case .provocative: return "Provocative - Challenging, thought-provoking"
            }
        }
    }
    
    enum TuningMode {
        case simple
        case advanced
    }
    
    init() {
        initializeLevers()
    }
    
    private func initializeLevers() {
        // Initialize all levers to middle value (5)
        for (key, lever) in Lever.allLevers {
            levers[key] = lever.defaultValue
        }
    }
    
    func selectModel(_ model: AIModel) {
        selectedModel = model
        // Apply model defaults
        for (key, value) in model.defaults {
            // Validate lever exists before setting
            if Lever.allLevers[key] != nil {
                levers[key] = max(0, min(10, value)) // Ensure value is in valid range
            }
        }
        // Track analytics
        AnalyticsManager.shared.trackModelSelected(model.id)
        generatePrompt()
    }
    
    func selectPersona(_ persona: Persona) {
        selectedPersona = persona
        // Apply persona lever values
        for (key, value) in persona.levers {
            // Validate lever exists before setting
            if Lever.allLevers[key] != nil {
                levers[key] = max(0, min(10, value)) // Ensure value is in valid range
            }
        }
        // Track analytics
        AnalyticsManager.shared.trackPersonaSelected(persona.id)
        generatePrompt()
    }
    
    func setLever(_ leverId: String, value: Int) {
        // Validate lever exists
        guard Lever.allLevers[leverId] != nil else {
            print("Warning: Lever '\(leverId)' not found")
            return
        }
        
        // Check if lever is locked for current model
        if let lever = Lever.allLevers[leverId],
           let lockedModels = lever.locked,
           let modelId = selectedModel?.id,
           lockedModels.contains(modelId) {
            return // Don't update locked levers
        }
        
        // Clamp value to 0-10 range
        let clampedValue = max(0, min(10, value))
        levers[leverId] = clampedValue
        
        // Track analytics
        let modeString = mode == .simple ? "simple" : "advanced"
        AnalyticsManager.shared.trackLeverAdjusted(leverId: leverId, value: clampedValue, mode: modeString)
        
        generatePrompt()
    }
    
    func resetModel() {
        selectedModel = nil
        initializeLevers()
        generatePrompt()
    }
    
    func resetPersona() {
        selectedPersona = nil
        if let model = selectedModel {
            // Restore model defaults
            for (key, value) in model.defaults {
                levers[key] = value
            }
        } else {
            initializeLevers()
        }
        generatePrompt()
    }
    
    func resetLevers(_ leverIds: [String]) {
        for leverId in leverIds {
            if let lever = Lever.allLevers[leverId] {
                levers[leverId] = lever.defaultValue
            }
        }
        generatePrompt()
    }
    
    func resetLeversToDefaults() {
        initializeLevers()
        generatePrompt()
    }
    
    func resetAllLevers() {
        initializeLevers()
        generatePrompt()
    }
    
    func generatePrompt() {
        var promptParts: [String] = []
        
        // Add model context if selected (for Simple Mode)
        if let model = selectedModel {
            promptParts.append("You are \(model.name). \(model.description).")
        }
        
        // Add persona activation snippet if selected
        if let persona = selectedPersona {
            promptParts.append(persona.activationSnippet)
        }
        
        // Add personality type
        let personalityPrompt = getPersonalityPrompt(personality)
        if !personalityPrompt.isEmpty {
            promptParts.append(personalityPrompt)
        }
        
        // If no model selected (Advanced Mode), generate neutral prompt with lever parameters
        if selectedModel == nil {
            let neutralPrompt = generateNeutralPrompt()
            if !neutralPrompt.isEmpty {
                promptParts.append(neutralPrompt)
            }
        } else {
            // Add lever-based instructions for Simple Mode
            let leverInstructions = generateLeverInstructions()
            if !leverInstructions.isEmpty {
                promptParts.append(leverInstructions)
            }
        }
        
        // Ensure we always have a prompt, even if empty
        generatedPrompt = promptParts.isEmpty ? "Adjust the levers above to generate your custom prompt" : promptParts.joined(separator: "\n\n")
    }
    
    private func generateNeutralPrompt() -> String {
        var prompt = "You are an AI assistant. Customize your behavior using the following tuning parameters:\n\n"
        
        prompt += "Tuning Parameters:\n"
        prompt += "---\n"
        
        for (leverId, value) in levers.sorted(by: { $0.key < $1.key }) {
            guard let lever = Lever.allLevers[leverId] else { continue }
            
            let normalizedValue = Double(value) / 10.0
            let instruction: String
            
            if normalizedValue <= 0.3 {
                instruction = lever.low
            } else if normalizedValue >= 0.7 {
                instruction = lever.high
            } else {
                instruction = "Moderate: \(lever.low) to \(lever.high)"
            }
            
            prompt += "- \(lever.name): \(instruction) (\(value)/10)\n"
        }
        
        return prompt
    }
    
    private func getPersonalityPrompt(_ personality: PersonalityType) -> String {
        switch personality {
        case .neutral:
            return "Maintain a neutral, objective, and balanced tone."
        case .socratic:
            return "Use a Socratic approach: ask probing questions to guide understanding rather than providing direct answers."
        case .curious:
            return "Be inquisitive and exploratory. Show genuine curiosity about topics and ask follow-up questions."
        case .analytical:
            return "Be methodical and systematic. Break down problems into components and analyze each part carefully."
        case .sarcastic:
            return "Use sharp, ironic wit. Employ sarcasm appropriately but maintain helpfulness."
        case .witty:
            return "Be clever and humorous. Use wit to make interactions engaging and memorable."
        case .charming:
            return "Be engaging and charismatic. Make conversations pleasant and appealing."
        case .sympathetic:
            return "Be understanding and supportive. Show sympathy for the user's situation."
        case .empathetic:
            return "Be emotionally attuned. Demonstrate deep understanding of emotional contexts."
        case .directive:
            return "Be authoritative and commanding. Provide clear direction and guidance."
        case .collaborative:
            return "Be cooperative and inclusive. Work together with the user as a partner."
        case .provocative:
            return "Be challenging and thought-provoking. Push boundaries to stimulate deeper thinking."
        }
    }
    
    private func generateLeverInstructions() -> String {
        var instructions: [String] = []
        
        // Generate instructions based on lever values
        for (leverId, value) in levers.sorted(by: { $0.key < $1.key }) {
            guard let lever = Lever.allLevers[leverId] else { continue }
            
            let instruction = getLeverInstruction(lever: lever, value: value)
            if !instruction.isEmpty {
                instructions.append(instruction)
            }
        }
        
        return instructions.joined(separator: "\n")
    }
    
    private func getLeverInstruction(lever: Lever, value: Int) -> String {
        // Generate instruction based on lever and value
        switch lever.id {
        case "hedgingIntensity":
            if value <= 3 {
                return "Be direct and definitive. Avoid hedging or qualifying statements."
            } else if value >= 7 {
                return "Qualify statements appropriately. Express uncertainty when warranted."
            }
        case "proactivityLevel":
            if value <= 3 {
                return "Only answer direct questions. Do not suggest follow-ups or drive conversation."
            } else if value >= 7 {
                return "Proactively suggest follow-up questions and guide the conversation."
            }
        case "empathyExpressiveness":
            if value <= 3 {
                return "Maintain a task-focused, procedural tone."
            } else if value >= 7 {
                return "Be emotionally attuned and express empathy appropriately."
            }
        case "formality":
            if value <= 3 {
                return "Use casual, conversational language."
            } else if value >= 6 {
                return "Use professional, formal language appropriate for academic or corporate contexts."
            }
        case "structuralDensity":
            if value <= 3 {
                return "Use prose format with paragraphs. Avoid excessive formatting."
            } else if value >= 7 {
                return "Use structured formatting: tables, bullets, headers, and clear sections."
            }
        case "conciseness":
            if value <= 3 {
                return "Provide detailed, verbose explanations."
            } else if value >= 7 {
                return "Be concise and brief. Avoid unnecessary verbosity."
            }
        case "teachingMode":
            if value <= 3 {
                return "Assume expert-level knowledge. Skip basic explanations."
            } else if value >= 7 {
                return "Explain concepts step-by-step. Assume minimal prior knowledge."
            }
        case "playfulness":
            if value <= 2 {
                return "Maintain a serious, professional tone. Avoid humor."
            } else if value >= 6 {
                return "Use appropriate humor, wit, and playful language when suitable."
            }
        case "transparency":
            if value <= 3 {
                return "Provide answers directly without showing reasoning process."
            } else if value >= 7 {
                return "Show your reasoning process and thinking chain."
            }
        case "creativity":
            if value <= 2 {
                return "Stick to factual information only. Avoid speculation."
            } else if value >= 7 {
                return "Engage in creative brainstorming and speculative thinking when appropriate."
            }
        case "citationRigidity":
            if value <= 3 {
                return "Cite sources when relevant but not required for every claim."
            } else if value >= 7 {
                return "Cite sources for every factual claim. Provide references."
            }
        case "responseDirectness":
            if value <= 3 {
                return "Restate or paraphrase the question before answering."
            } else if value >= 7 {
                return "Answer directly without restating the question."
            }
        case "certaintyModulation":
            if value <= 3 {
                return "Use hedged language and softened claims."
            } else if value >= 6 {
                return "State facts confidently and definitively."
            }
        case "assertiveness":
            if value <= 3 {
                return "Be tentative and soft in conclusions."
            } else if value >= 6 {
                return "Be decisive and direct in conclusions."
            }
        case "answerCompleteness":
            if value <= 4 {
                return "Provide brief, focused answers."
            } else if value >= 8 {
                return "Provide comprehensive, thorough breakdowns."
            }
        case "safetyDisclaimers":
            if value <= 2 {
                return "Avoid unnecessary safety disclaimers."
            } else if value >= 7 {
                return "Include appropriate safety disclaimers when relevant."
            }
        case "technicality":
            if value <= 3 {
                return "Use non-technical, layman-friendly language."
            } else if value >= 7 {
                return "Use technical jargon and specialized terminology when appropriate."
            }
        default:
            break
        }
        
        return ""
    }
    
    // Simple mode: 8 key levers
    var simpleModeLevers: [String] {
        [
            "creativity",
            "teachingMode",
            "proactivityLevel",
            "playfulness",
            "conciseness",
            "answerCompleteness",
            "hedgingIntensity",
            "empathyExpressiveness"
        ]
    }
}
