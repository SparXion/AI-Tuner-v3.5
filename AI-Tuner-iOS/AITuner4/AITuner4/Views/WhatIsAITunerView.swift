//
//  WhatIsAITunerView.swift
//  AITuner4
//
//  AI Tuner v4.0 - "What is AI Tuner?" Expandable Section
//

import SwiftUI

struct WhatIsAITunerView: View {
    @State private var isExpanded = false
    
    var body: some View {
        VStack(spacing: 0) {
            // Toggle button
            Button(action: {
                // Haptic feedback
                let generator = UIImpactFeedbackGenerator(style: .light)
                generator.impactOccurred()
                withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                    isExpanded.toggle()
                }
            }) {
                HStack {
                    Text("What is AI Tuner?")
                        .font(.headline)
                        .foregroundColor(.primary)
                    
                    Spacer()
                    
                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding()
                .background(Color(.systemGray6))
            }
            .buttonStyle(.plain)
            .accessibilityLabel("What is AI Tuner?")
            .accessibilityHint(isExpanded ? "Tap to collapse" : "Tap to expand")
            
            // Expanded content
            if isExpanded {
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        // About section
                        VStack(alignment: .leading, spacing: 12) {
                            Text("About AI Tuner")
                                .font(.title3)
                                .fontWeight(.bold)
                            
                            Text("AI Tuner removes the mystery from every chatbot.")
                                .font(.body)
                            
                            Text("No more guessing why an AI answers the way it does. No more fighting hidden defaults.")
                                .font(.body)
                            
                            Text("With one click you see exactly how the AI is wired — and with one drag you change it.")
                                .font(.body)
                                .fontWeight(.medium)
                        }
                        
                        Divider()
                        
                        // How It Works section
                        VStack(alignment: .leading, spacing: 16) {
                            Text("How It Works")
                                .font(.title3)
                                .fontWeight(.bold)
                            
                            VStack(alignment: .leading, spacing: 16) {
                                // Step 1
                                HStack(alignment: .top, spacing: 12) {
                                    Text("1")
                                        .font(.headline)
                                        .foregroundColor(.white)
                                        .frame(width: 28, height: 28)
                                        .background(Color.black)
                                        .clipShape(Circle())
                                    
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("Pick any AI")
                                            .font(.headline)
                                        Text("Grok • ChatGPT • Claude • Gemini • Perplexity • Mistral • Llama")
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                    }
                                }
                                
                                // Step 2
                                HStack(alignment: .top, spacing: 12) {
                                    Text("2")
                                        .font(.headline)
                                        .foregroundColor(.white)
                                        .frame(width: 28, height: 28)
                                        .background(Color.black)
                                        .clipShape(Circle())
                                    
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("See inside its mind")
                                            .font(.headline)
                                        Text("A live radar web instantly shows the AI's current personality — empathy, bluntness, creativity, speed, truth-focus… everything.")
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                    }
                                }
                                
                                // Step 3
                                HStack(alignment: .top, spacing: 12) {
                                    Text("3")
                                        .font(.headline)
                                        .foregroundColor(.white)
                                        .frame(width: 28, height: 28)
                                        .background(Color.black)
                                        .clipShape(Circle())
                                    
                                    VStack(alignment: .leading, spacing: 8) {
                                        Text("Tune it your way")
                                            .font(.headline)
                                        
                                        VStack(alignment: .leading, spacing: 8) {
                                            HStack(alignment: .top, spacing: 8) {
                                                Text("•")
                                                    .foregroundColor(.secondary)
                                                VStack(alignment: .leading, spacing: 2) {
                                                    Text("New users:")
                                                        .font(.caption)
                                                        .fontWeight(.semibold)
                                                    Text("Tap a picture (Therapist, Coder, Researcher, Friend, Scam Hunter…) and the AI changes instantly.")
                                                        .font(.caption)
                                                        .foregroundColor(.secondary)
                                                }
                                            }
                                            
                                            HStack(alignment: .top, spacing: 8) {
                                                Text("•")
                                                    .foregroundColor(.secondary)
                                                VStack(alignment: .leading, spacing: 2) {
                                                    Text("Power users:")
                                                        .font(.caption)
                                                        .fontWeight(.semibold)
                                                    Text("Drag any of the 26 axes on the radar web for total control.")
                                                        .font(.caption)
                                                        .foregroundColor(.secondary)
                                                }
                                            }
                                            
                                            HStack(alignment: .top, spacing: 8) {
                                                Text("•")
                                                    .foregroundColor(.secondary)
                                                VStack(alignment: .leading, spacing: 2) {
                                                    Text("Everyone:")
                                                        .font(.caption)
                                                        .fontWeight(.semibold)
                                                    Text("Watch the radar spin and the prompt update in real time.")
                                                        .font(.caption)
                                                        .foregroundColor(.secondary)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        Divider()
                        
                        // Key Features section
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Key Features")
                                .font(.title3)
                                .fontWeight(.bold)
                            
                            VStack(alignment: .leading, spacing: 12) {
                                FeatureRow(text: "Takes the black box out of AI — every behavior is visible and movable")
                                FeatureRow(text: "Works on every major model (no API keys needed)")
                                FeatureRow(text: "26 precision levers + one-tap personas")
                                FeatureRow(text: "Beginner mode (8 big picture axes) → Advanced mode (full 26-axis web)")
                                FeatureRow(text: "Save and share your presets")
                                FeatureRow(text: "Copy-paste prompt or use the upcoming AI Tuner Portal (one window, every AI)")
                            }
                        }
                        
                        Divider()
                        
                        // Closing statement
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Whether you're four years old or fifty years in tech,")
                                .font(.body)
                            
                            Text("AI Tuner makes every chatbot feel like it was built just for you.")
                                .font(.body)
                                .fontWeight(.bold)
                            
                            Text("Try it now – no signup, no mystery.")
                                .font(.body)
                                .italic()
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding()
                }
                .frame(maxHeight: 500)
                .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color(.systemGray4), lineWidth: 1)
        )
    }
}

struct FeatureRow: View {
    let text: String
    
    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(.blue)
                .font(.caption)
                .padding(.top, 2)
            
            Text(text)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}

#Preview {
    WhatIsAITunerView()
        .padding()
}
