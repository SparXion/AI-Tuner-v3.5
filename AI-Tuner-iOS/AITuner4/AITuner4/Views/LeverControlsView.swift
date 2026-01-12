//
//  LeverControlsView.swift
//  AITuner4
//
//  AI Tuner v4.0 - Lever Controls
//

import SwiftUI

struct SimpleLeverControlsView: View {
    @ObservedObject var engine: AITunerEngine
    
    var body: some View {
        VStack(spacing: 20) {
            ForEach(engine.simpleModeLevers, id: \.self) { leverId in
                if let lever = Lever.allLevers[leverId] {
                    LeverSliderView(
                        lever: lever,
                        value: Binding(
                            get: { engine.levers[leverId] ?? lever.defaultValue },
                            set: { engine.setLever(leverId, value: $0) }
                        ),
                        isLocked: isLeverLocked(leverId)
                    )
                }
            }
        }
    }
    
    private func isLeverLocked(_ leverId: String) -> Bool {
        guard let lever = Lever.allLevers[leverId],
              let lockedModels = lever.locked,
              let modelId = engine.selectedModel?.id else {
            return false
        }
        return lockedModels.contains(modelId)
    }
}

struct AllLeverControlsView: View {
    @ObservedObject var engine: AITunerEngine
    
    var body: some View {
        VStack(spacing: 20) {
            ForEach(Array(Lever.allLevers.keys.sorted()), id: \.self) { leverId in
                if let lever = Lever.allLevers[leverId] {
                    LeverSliderView(
                        lever: lever,
                        value: Binding(
                            get: { engine.levers[leverId] ?? lever.defaultValue },
                            set: { engine.setLever(leverId, value: $0) }
                        ),
                        isLocked: isLeverLocked(leverId)
                    )
                }
            }
        }
    }
    
    private func isLeverLocked(_ leverId: String) -> Bool {
        guard let lever = Lever.allLevers[leverId],
              let lockedModels = lever.locked,
              let modelId = engine.selectedModel?.id else {
            return false
        }
        return lockedModels.contains(modelId)
    }
}

struct LeverSliderView: View {
    let lever: Lever
    @Binding var value: Int
    let isLocked: Bool
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(lever.name)
                    .font(.headline)
                
                if isLocked {
                    Image(systemName: "lock.fill")
                        .font(.caption)
                        .foregroundColor(.orange)
                }
                
                Spacer()
                
                Text("\(value)")
                    .font(.headline)
                    .foregroundColor(.blue)
            }
            
            Text(lever.description)
                .font(.caption)
                .foregroundColor(.secondary)
            
            HStack {
                Text(lever.low)
                    .font(.caption2)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Slider(
                    value: Binding(
                        get: { Double(value) },
                        set: { 
                            value = Int($0)
                            // Haptic feedback for slider changes
                            let generator = UISelectionFeedbackGenerator()
                            generator.selectionChanged()
                        }
                    ),
                    in: 0...10,
                    step: 1
                )
                .disabled(isLocked)
                .accessibilityLabel(lever.name)
                .accessibilityValue("\(value) out of 10")
                .accessibilityHint(lever.description)
                
                Text(lever.high)
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
        .opacity(isLocked ? 0.6 : 1.0)
    }
}

#Preview {
    SimpleLeverControlsView(engine: AITunerEngine())
        .padding()
}
