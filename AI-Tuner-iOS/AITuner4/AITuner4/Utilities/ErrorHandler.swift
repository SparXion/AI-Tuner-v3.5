//
//  ErrorHandler.swift
//  AITuner4
//
//  AI Tuner v4.0 - Error Handling Utilities
//

import Foundation
import SwiftUI

enum AITunerError: LocalizedError {
    case invalidLeverValue(leverId: String, value: Int)
    case leverNotFound(leverId: String)
    case modelNotFound(modelId: String)
    case personaNotFound(personaId: String)
    case promptGenerationFailed
    
    var errorDescription: String? {
        switch self {
        case .invalidLeverValue(let leverId, let value):
            return "Invalid lever value: \(leverId) = \(value). Value must be between 0 and 10."
        case .leverNotFound(let leverId):
            return "Lever not found: \(leverId)"
        case .modelNotFound(let modelId):
            return "Model not found: \(modelId)"
        case .personaNotFound(let personaId):
            return "Persona not found: \(personaId)"
        case .promptGenerationFailed:
            return "Failed to generate prompt. Please try again."
        }
    }
}

struct ErrorAlert: ViewModifier {
    @Binding var error: AITunerError?
    
    func body(content: Content) -> some View {
        content
            .alert("Error", isPresented: .constant(error != nil), presenting: error) { error in
                Button("OK") {
                    self.error = nil
                }
            } message: { error in
                Text(error.localizedDescription)
            }
    }
}

extension View {
    func errorAlert(error: Binding<AITunerError?>) -> some View {
        modifier(ErrorAlert(error: error))
    }
}
