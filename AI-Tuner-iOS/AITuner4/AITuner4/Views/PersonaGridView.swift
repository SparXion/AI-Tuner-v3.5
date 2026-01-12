//
//  PersonaGridView.swift
//  AITuner4
//
//  AI Tuner v4.0 - Persona Selection Grid
//

import SwiftUI

struct PersonaGridView: View {
    @ObservedObject var engine: AITunerEngine
    
    var body: some View {
        LazyVGrid(columns: [
            GridItem(.flexible()),
            GridItem(.flexible())
        ], spacing: 16) {
            ForEach(Persona.allPersonas) { persona in
                PersonaCardView(
                    persona: persona,
                    isSelected: engine.selectedPersona?.id == persona.id
                ) {
                    engine.selectPersona(persona)
                }
            }
        }
    }
}

struct PersonaCardView: View {
    let persona: Persona
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: {
            // Haptic feedback
            let generator = UIImpactFeedbackGenerator(style: .light)
            generator.impactOccurred()
            action()
        }) {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(persona.name)
                        .font(.headline)
                        .foregroundColor(.primary)
                    
                    if persona.type == .hidden {
                        Image(systemName: "lock.fill")
                            .font(.caption)
                            .foregroundColor(.orange)
                    }
                }
                
                Text(persona.description)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.leading)
                    .lineLimit(2)
            }
            .frame(maxWidth: .infinity, minHeight: 80, alignment: .leading)
            .padding()
            .background(isSelected ? Color.blue.opacity(0.2) : Color(.systemGray6))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(isSelected ? Color.blue : Color.clear, lineWidth: 2)
            )
            .cornerRadius(8)
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(persona.name) persona")
        .accessibilityHint(isSelected ? "Selected" : "Tap to apply")
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }
}

#Preview {
    PersonaGridView(engine: AITunerEngine())
        .padding()
}
