//
//  FloatingRadarButton.swift
//  AITuner4
//
//  AI Tuner v4.0 - Floating Radar Button
//

import SwiftUI

struct FloatingRadarButton: View {
    @Binding var isPresented: Bool
    
    var body: some View {
        VStack {
            HStack {
                Spacer()
                    Button(action: {
                        // Haptic feedback
                        let generator = UIImpactFeedbackGenerator(style: .medium)
                        generator.impactOccurred()
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                            isPresented = true
                        }
                    }) {
                        Image(systemName: "chart.pie.fill")
                            .font(.title2)
                            .foregroundColor(.white)
                            .frame(width: 56, height: 56)
                            .background(Color.blue)
                            .clipShape(Circle())
                            .shadow(color: .black.opacity(0.3), radius: 8, x: 0, y: 4)
                    }
                    .accessibilityLabel("Open radar chart")
                    .accessibilityHint("Tap to view and adjust lever values visually")
                    .padding(.trailing, 20)
                    .padding(.top, 100) // Positioned below navigation bar, above content
            }
            Spacer()
        }
    }
}

#Preview {
    FloatingRadarButton(isPresented: .constant(false))
}
