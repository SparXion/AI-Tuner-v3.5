//
//  WelcomePopupView.swift
//  AITuner4
//
//  AI Tuner v4.0 - Welcome Popup
//

import SwiftUI

struct WelcomePopupView: View {
    @Binding var isPresented: Bool
    @AppStorage("hasSeenWelcome") private var hasSeenWelcome = false
    
    var body: some View {
        ZStack {
            // Background overlay
            Color.black.opacity(0.5)
                .ignoresSafeArea()
            
            // Popup content
            VStack(spacing: 0) {
                // Header
                HStack {
                    Text("Welcome to AI Tuner")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.primary)
                    
                    Spacer()
                }
                .padding()
                .background(Color(.systemGray6))
                
                // Content
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        // Main message
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Making the invisible visible... and tunable.")
                                .font(.title3)
                                .fontWeight(.semibold)
                                .foregroundColor(.primary)
                            
                            Text("Every AI has a hidden personality — empathy, creativity, bluntness, truth-focus. These traits are usually locked away, invisible to you.")
                                .font(.body)
                                .foregroundColor(.secondary)
                            
                            Text("AI Tuner pulls back the curtain.")
                                .font(.body)
                                .fontWeight(.medium)
                                .foregroundColor(.primary)
                            
                            Text("With one tap, you see exactly how your AI is wired. With one drag, you change it. No more guessing why an AI answers the way it does. No more fighting hidden defaults.")
                                .font(.body)
                                .foregroundColor(.secondary)
                            
                            Text("See the radar chart? That's your AI's personality, visualized. Drag any point to reshape it. Watch the prompt update in real-time.")
                                .font(.body)
                                .foregroundColor(.secondary)
                            
                            Text("Whether you're four years old or fifty years in tech, AI Tuner makes every chatbot feel like it was built just for you.")
                                .font(.body)
                                .fontWeight(.medium)
                                .foregroundColor(.primary)
                            
                            Text("Try it now — no signup, no mystery.")
                                .font(.body)
                                .foregroundColor(.secondary)
                        }
                        .padding()
                    }
                }
                
                // Footer with button
                VStack(spacing: 12) {
                    Button(action: {
                        // Haptic feedback
                        let generator = UIImpactFeedbackGenerator(style: .medium)
                        generator.impactOccurred()
                        hasSeenWelcome = true
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                            isPresented = false
                        }
                    }) {
                        Text("Get Started")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .cornerRadius(12)
                    }
                    .accessibilityLabel("Get Started")
                    .accessibilityHint("Dismisses the welcome screen and starts using AI Tuner")
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
}

#Preview {
    WelcomePopupView(isPresented: .constant(true))
}
