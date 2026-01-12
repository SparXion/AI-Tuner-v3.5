//
//  TutorialGuideView.swift
//  AITuner4
//
//  AI Tuner v4.0 - Simple Tutorial Guide
//

import SwiftUI

struct TutorialGuideView: View {
    @Binding var isPresented: Bool
    @AppStorage("hasCompletedTutorial") private var hasCompletedTutorial = false
    @State private var currentStep = 0
    
    private let tutorialSteps: [(title: String, description: String)] = [
        ("Welcome to AI Tuner!", "This tutorial will guide you through customizing AI behavior. You can skip anytime or restart later from the question mark icon."),
        ("Step 1: Choose Your AI Model", "Start by selecting an AI model like Grok, ChatGPT, or Claude. Each model has its own default personality that you'll see visualized."),
        ("Step 2: Select a Personality", "Choose an intellectual style like Socratic, Analytical, or Empathetic. This sets the overall tone of the AI's responses."),
        ("Step 3: Apply a Persona (Optional)", "Apply specialized personas like Therapist, Coder, or Truth-Seeker. These override the model's defaults with optimized settings."),
        ("Step 4: Fine-Tune with Sliders", "Adjust the 8 key levers to customize behavior. Watch the generated prompt update in real-time as you drag the sliders."),
        ("Step 5: Visualize with Radar Chart", "Tap the radar icon in the top-right to see a visual representation of your AI's personality. Drag points on the chart to adjust values."),
        ("Step 6: Copy Your Prompt", "Once you're happy with your settings, copy the generated prompt and paste it into your AI assistant. The prompt contains all your customizations."),
        ("Advanced Mode", "Switch to Advanced mode for full control with 4 specialized web tuners: Persona Spine, Engagement Surface, Truth Discipline, and Delivery System."),
        ("You're All Set!", "You now know how to customize any AI's behavior. Experiment with different combinations and save your favorites as presets.")
    ]
    
    var body: some View {
        ZStack {
            Color.black.opacity(0.5)
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Header
                HStack {
                    Text("Tutorial")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.primary)
                    
                    Spacer()
                    
                    Button(action: {
                        // Haptic feedback
                        let generator = UIImpactFeedbackGenerator(style: .light)
                        generator.impactOccurred()
                        skipTutorial()
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title3)
                            .foregroundColor(.secondary)
                    }
                    .accessibilityLabel("Skip tutorial")
                }
                .padding()
                .background(Color(.systemGray6))
                
                // Progress indicator
                HStack(spacing: 4) {
                    ForEach(0..<tutorialSteps.count, id: \.self) { index in
                        Rectangle()
                            .fill(index <= currentStep ? Color.blue : Color.gray.opacity(0.3))
                            .frame(height: 4)
                    }
                }
                .padding(.horizontal)
                .padding(.vertical, 8)
                .background(Color(.systemGray6))
                
                // Step content
                ScrollView {
                    VStack(spacing: 20) {
                        Text(tutorialSteps[currentStep].title)
                            .font(.title3)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                            .padding(.top)
                        
                        Text(tutorialSteps[currentStep].description)
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }
                    .padding(.vertical)
                }
                
                // Navigation buttons
                HStack(spacing: 12) {
                    if currentStep > 0 {
                        Button(action: {
                            withAnimation {
                                currentStep -= 1
                            }
                        }) {
                            Text("Previous")
                                .font(.headline)
                                .foregroundColor(.blue)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(12)
                        }
                    }
                    
                    Button(action: {
                        if currentStep < tutorialSteps.count - 1 {
                            withAnimation {
                                currentStep += 1
                            }
                        } else {
                            completeTutorial()
                        }
                    }) {
                        Text(currentStep < tutorialSteps.count - 1 ? "Next" : "Got It!")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .cornerRadius(12)
                    }
                }
                .padding()
                .background(Color(.systemBackground))
            }
            .frame(maxWidth: min(UIScreen.main.bounds.width - 40, 500))
            .frame(maxHeight: min(UIScreen.main.bounds.height - 100, 600))
            .background(Color(.systemBackground))
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.3), radius: 20, x: 0, y: 10)
        }
        .zIndex(2000)
        .transition(.scale.combined(with: .opacity))
    }
    
    private func skipTutorial() {
        hasCompletedTutorial = true
        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
            isPresented = false
        }
    }
    
    private func completeTutorial() {
        hasCompletedTutorial = true
        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
            isPresented = false
        }
    }
}

#Preview {
    TutorialGuideView(isPresented: .constant(true))
}
