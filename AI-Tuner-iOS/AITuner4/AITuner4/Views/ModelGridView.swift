//
//  ModelGridView.swift
//  AITuner4
//
//  AI Tuner v4.0 - Model Selection Grid
//

import SwiftUI

struct ModelGridView: View {
    @ObservedObject var engine: AITunerEngine
    
    var body: some View {
        LazyVGrid(columns: [
            GridItem(.flexible()),
            GridItem(.flexible())
        ], spacing: 16) {
            ForEach(AIModel.allModels) { model in
                ModelCardView(
                    model: model,
                    isSelected: engine.selectedModel?.id == model.id
                ) {
                    engine.selectModel(model)
                }
            }
        }
    }
}

struct ModelCardView: View {
    let model: AIModel
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
                Text(model.name)
                    .font(.headline)
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.leading)
                    .lineLimit(2)
                
                Text(model.description)
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
        .accessibilityLabel("\(model.name) model")
        .accessibilityHint(isSelected ? "Selected" : "Tap to select")
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }
}

#Preview {
    ModelGridView(engine: AITunerEngine())
        .padding()
}
