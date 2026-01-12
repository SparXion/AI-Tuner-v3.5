//
//  RadarPopupView.swift
//  AITuner4
//
//  AI Tuner v4.0 - Radar Chart Popup Window
//

import SwiftUI

struct RadarPopupView: View {
    @Binding var isPresented: Bool
    @ObservedObject var engine: AITunerEngine
    
    var body: some View {
        ZStack {
            // Background overlay
            Color.black.opacity(0.3)
                .ignoresSafeArea()
                .onTapGesture {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                        isPresented = false
                    }
                }
            
            // Popup window
            VStack(spacing: 0) {
                // Header with close button
                HStack {
                    Text("Radar Web Tuner")
                        .font(.headline)
                        .foregroundColor(.primary)
                    
                    Spacer()
                    
                    Button(action: {
                        // Haptic feedback
                        let generator = UIImpactFeedbackGenerator(style: .light)
                        generator.impactOccurred()
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                            isPresented = false
                        }
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title2)
                            .foregroundColor(.secondary)
                    }
                    .accessibilityLabel("Close radar chart")
                }
                .padding()
                .background(Color(.systemGray6))
                
                // Radar chart content
                ScrollView {
                    VStack(spacing: 20) {
                        RadarChartView(
                            levers: engine.levers,
                            size: min(UIScreen.main.bounds.width - 60, 400),
                            onLeverChange: { leverId, value in
                                engine.setLever(leverId, value: value)
                            }
                        )
                        .frame(height: min(UIScreen.main.bounds.width - 60, 400))
                        .padding()
                        
                        // Instructions
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Instructions")
                                .font(.headline)
                            
                            Text("Drag any point on the radar chart to adjust lever values. The chart updates in real-time as you drag.")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        .padding()
                        .frame(maxWidth: CGFloat.infinity, alignment: .leading)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                        .padding(.horizontal)
                    }
                    .padding(.vertical)
                }
            }
            .frame(maxWidth: min(UIScreen.main.bounds.width - 40, 500))
            .frame(maxHeight: min(UIScreen.main.bounds.height - 100, 600))
            .background(Color(.systemBackground))
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.3), radius: 20, x: 0, y: 10)
        }
        .zIndex(1000)
        .transition(.scale.combined(with: .opacity))
    }
}

#Preview {
    RadarPopupView(isPresented: .constant(true), engine: AITunerEngine())
}
