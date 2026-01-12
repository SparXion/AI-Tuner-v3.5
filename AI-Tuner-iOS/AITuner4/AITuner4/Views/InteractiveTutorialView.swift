//
//  InteractiveTutorialView.swift
//  AITuner4
//
//  AI Tuner v4.0 - Interactive Tutorial Overlay
//

import SwiftUI

struct InteractiveTutorialView: View {
    @ObservedObject var coordinator: TutorialCoordinator
    @ObservedObject var engine: AITunerEngine
    @Binding var selectedTab: Int
    
    var body: some View {
        ZStack {
            // Dark overlay with cutout for highlighted element
            Color.black.opacity(0.6)
                .ignoresSafeArea()
                .animation(.easeInOut, value: coordinator.highlightedElement)
            
            // Tutorial card
            VStack(spacing: 0) {
                // Header
                HStack {
                    Text(coordinator.currentStep.title)
                        .font(.title3)
                        .fontWeight(.bold)
                        .foregroundColor(.primary)
                    
                    Spacer()
                    
                    Button(action: {
                        coordinator.skip()
                    }) {
                        Text("Skip")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
                .padding()
                .background(Color(.systemGray6))
                
                // Progress indicator
                GeometryReader { geometry in
                    Rectangle()
                        .fill(Color.blue)
                        .frame(width: geometry.size.width * coordinator.progress)
                }
                .frame(height: 4)
                .background(Color.gray.opacity(0.3))
                
                // Content
                ScrollView {
                    VStack(spacing: 20) {
                        Text(coordinator.currentStep.description)
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding()
                        
                        if let hint = coordinator.currentStep.actionHint {
                            HStack {
                                Image(systemName: "hand.point.up.left.fill")
                                    .foregroundColor(.blue)
                                Text(hint)
                                    .font(.caption)
                                    .foregroundColor(.blue)
                            }
                            .padding()
                            .background(Color.blue.opacity(0.1))
                            .cornerRadius(8)
                            .padding(.horizontal)
                        }
                    }
                    .padding(.vertical)
                }
                
                // Navigation buttons
                HStack(spacing: 12) {
                    if coordinator.currentStep.rawValue > 0 {
                        Button(action: {
                            coordinator.previous()
                        }) {
                            Text("Previous")
                                .font(.headline)
                                .foregroundColor(.blue)
                                .frame(maxWidth: CGFloat.infinity)
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(12)
                        }
                    }
                    
                    Button(action: {
                        // Check if step is complete, then advance
                        if coordinator.checkStepCompletion(engine: engine, selectedTab: selectedTab) {
                            coordinator.next()
                        } else {
                            // Show hint that action is needed
                            withAnimation {
                                // Visual feedback
                            }
                        }
                    }) {
                        Text(coordinator.currentStep == .complete ? "Got It!" : "Next")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: CGFloat.infinity)
                            .padding()
                            .background(coordinator.checkStepCompletion(engine: engine, selectedTab: selectedTab) ? Color.blue : Color.gray)
                            .cornerRadius(12)
                    }
                    .disabled(coordinator.currentStep == .complete ? false : !coordinator.checkStepCompletion(engine: engine, selectedTab: selectedTab))
                }
                .padding()
                .background(Color(.systemBackground))
            }
            .frame(maxWidth: min(UIScreen.main.bounds.width - 40, 500))
            .frame(maxHeight: min(UIScreen.main.bounds.height - 100, 600))
            .background(Color(.systemBackground))
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.3), radius: 20, x: 0, y: 10)
            .padding()
        }
        .zIndex(3000)
        .transition(.scale.combined(with: .opacity))
        .onChange(of: engine.selectedModel) { _ in
            if coordinator.currentStep == .selectModel {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    coordinator.next()
                }
            }
        }
        .onChange(of: engine.personality) { _ in
            if coordinator.currentStep == .selectPersonality {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    coordinator.next()
                }
            }
        }
        .onChange(of: engine.selectedPersona) { _ in
            if coordinator.currentStep == .selectPersona {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    coordinator.next()
                }
            }
        }
        .onChange(of: engine.levers) { _ in
            if coordinator.currentStep == .adjustSliders {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    coordinator.next()
                }
            }
        }
        .onChange(of: selectedTab) { _ in
            if coordinator.currentStep == .exploreAdvanced {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    coordinator.next()
                }
            }
        }
    }
}

// View modifier for highlighting elements
struct TutorialHighlightModifier: ViewModifier {
    let isHighlighted: Bool
    
    func body(content: Content) -> some View {
        content
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(isHighlighted ? Color.blue : Color.clear, lineWidth: 4)
                    .shadow(color: isHighlighted ? Color.blue.opacity(0.5) : Color.clear, radius: 10)
            )
            .scaleEffect(isHighlighted ? 1.05 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isHighlighted)
    }
}

extension View {
    func tutorialHighlight(_ isHighlighted: Bool) -> some View {
        modifier(TutorialHighlightModifier(isHighlighted: isHighlighted))
    }
}

#Preview {
    InteractiveTutorialView(
        coordinator: TutorialCoordinator(),
        engine: AITunerEngine(),
        selectedTab: .constant(0)
    )
}
