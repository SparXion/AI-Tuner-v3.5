//
//  TutorialCoordinator.swift
//  AITuner4
//
//  AI Tuner v4.0 - Interactive Tutorial Coordinator
//

import SwiftUI
import Combine

enum TutorialStep: Int, CaseIterable {
    case welcome = 0
    case selectModel = 1
    case selectPersonality = 2
    case selectPersona = 3
    case adjustSliders = 4
    case useRadar = 5
    case copyPrompt = 6
    case exploreAdvanced = 7
    case complete = 8
    
    var title: String {
        switch self {
        case .welcome: return "Welcome to AI Tuner!"
        case .selectModel: return "Step 1: Choose Your AI Model"
        case .selectPersonality: return "Step 2: Select a Personality"
        case .selectPersona: return "Step 3: Apply a Persona (Optional)"
        case .adjustSliders: return "Step 4: Fine-Tune with Sliders"
        case .useRadar: return "Step 5: Visualize with Radar Chart"
        case .copyPrompt: return "Step 6: Copy Your Prompt"
        case .exploreAdvanced: return "Step 7: Explore Advanced Mode"
        case .complete: return "You're All Set!"
        }
    }
    
    var description: String {
        switch self {
        case .welcome:
            return "This interactive tutorial will guide you through customizing AI behavior. Follow the highlighted elements to learn each feature."
        case .selectModel:
            return "Tap any model card below to select it. Each model has unique default settings."
        case .selectPersonality:
            return "Use the dropdown above to select a personality style. This sets the overall tone."
        case .selectPersona:
            return "Tap a persona card to apply specialized settings. Personas optimize multiple levers at once."
        case .adjustSliders:
            return "Drag any slider to adjust values. Watch how the prompt updates in real-time."
        case .useRadar:
            return "Tap the radar icon in the top-right corner to see a visual representation of your settings."
        case .copyPrompt:
            return "Tap the 'Copy' button to copy your customized prompt. Paste it into your AI assistant."
        case .exploreAdvanced:
            return "Switch to Advanced mode for full control with 4 specialized web tuners."
        case .complete:
            return "You now know how to customize any AI's behavior. Experiment and save your favorites!"
        }
    }
    
    var highlightElement: TutorialHighlight? {
        switch self {
        case .selectModel: return .modelSelector
        case .selectPersonality: return .personalitySelector
        case .selectPersona: return .personaSelector
        case .adjustSliders: return .leverSliders
        case .useRadar: return .radarButton
        case .copyPrompt: return .promptPreview
        case .exploreAdvanced: return .advancedTab
        default: return nil
        }
    }
    
    var actionHint: String? {
        switch self {
        case .selectModel: return "Tap any model card"
        case .selectPersonality: return "Select from the dropdown"
        case .selectPersona: return "Tap a persona card"
        case .adjustSliders: return "Drag a slider"
        case .useRadar: return "Tap the radar icon"
        case .copyPrompt: return "Tap 'Copy' button"
        case .exploreAdvanced: return "Switch to Advanced tab"
        default: return nil
        }
    }
}

enum TutorialHighlight {
    case modelSelector
    case personalitySelector
    case personaSelector
    case leverSliders
    case radarButton
    case promptPreview
    case advancedTab
}

class TutorialCoordinator: ObservableObject {
    @Published var currentStep: TutorialStep = .welcome
    @Published var isActive: Bool = false
    @Published var highlightedElement: TutorialHighlight?
    @Published var showOverlay: Bool = false
    
    var progress: Double {
        Double(currentStep.rawValue) / Double(TutorialStep.allCases.count - 1)
    }
    
    func start() {
        guard !isActive else { return } // Prevent multiple starts
        // Check if already completed
        let tutorialCompleted = UserDefaults.standard.bool(forKey: "hasCompletedTutorial")
        guard !tutorialCompleted else { return }
        
        // Start on main thread
        DispatchQueue.main.async {
            self.isActive = true
            self.currentStep = .welcome
            self.highlightedElement = nil
            self.showOverlay = true
        }
    }
    
    func next() {
        if currentStep.rawValue < TutorialStep.allCases.count - 1 {
            withAnimation {
                currentStep = TutorialStep(rawValue: currentStep.rawValue + 1) ?? .complete
                highlightedElement = currentStep.highlightElement
            }
        } else {
            complete()
        }
    }
    
    func previous() {
        if currentStep.rawValue > 0 {
            withAnimation {
                currentStep = TutorialStep(rawValue: currentStep.rawValue - 1) ?? .welcome
                highlightedElement = currentStep.highlightElement
            }
        }
    }
    
    func skip() {
        UserDefaults.standard.set(true, forKey: "hasCompletedTutorial")
        withAnimation {
            isActive = false
            showOverlay = false
            highlightedElement = nil
        }
    }
    
    func complete() {
        UserDefaults.standard.set(true, forKey: "hasCompletedTutorial")
        withAnimation {
            isActive = false
            showOverlay = false
            highlightedElement = nil
        }
    }
    
    func checkStepCompletion(engine: AITunerEngine, selectedTab: Int) -> Bool {
        switch currentStep {
        case .selectModel:
            return engine.selectedModel != nil
        case .selectPersonality:
            return engine.personality != .neutral
        case .selectPersona:
            return engine.selectedPersona != nil
        case .adjustSliders:
            // Check if any lever has been changed from default
            return engine.levers.values.contains { $0 != 5 }
        case .useRadar:
            // This step is informational, auto-advance after showing
            return true
        case .copyPrompt:
            // Informational step
            return true
        case .exploreAdvanced:
            return selectedTab == 1
        default:
            return false
        }
    }
}
