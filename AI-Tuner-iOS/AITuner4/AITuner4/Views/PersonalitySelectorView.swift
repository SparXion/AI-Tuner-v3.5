//
//  PersonalitySelectorView.swift
//  AITuner4
//
//  AI Tuner v4.0 - Personality Selector
//

import SwiftUI

struct PersonalitySelectorView: View {
    @ObservedObject var engine: AITunerEngine
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Personality & Approach")
                .font(.headline)
            
            Picker("Intellectual Style", selection: $engine.personality) {
                ForEach(AITunerEngine.PersonalityType.allCases, id: \.self) { personality in
                    Text(personality.displayName).tag(personality)
                }
            }
            .pickerStyle(.menu)
            .onChange(of: engine.personality) { _ in
                // Haptic feedback
                let generator = UISelectionFeedbackGenerator()
                generator.selectionChanged()
                engine.generatePrompt()
            }
            .accessibilityLabel("Personality selector")
            .accessibilityHint("Choose the intellectual style for the AI")
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

#Preview {
    PersonalitySelectorView(engine: AITunerEngine())
        .padding()
}
