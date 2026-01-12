//
//  Preset.swift
//  AITuner4
//
//  AI Tuner v4.0 - Preset Model
//

import Foundation

struct Preset: Identifiable, Codable {
    let id: UUID
    let name: String
    let modelId: String?
    let personaId: String?
    let personality: String
    let levers: [String: Int]
    let createdAt: Date
    
    init(id: UUID = UUID(), name: String, modelId: String?, personaId: String?, personality: String, levers: [String: Int], createdAt: Date = Date()) {
        self.id = id
        self.name = name
        self.modelId = modelId
        self.personaId = personaId
        self.personality = personality
        self.levers = levers
        self.createdAt = createdAt
    }
}

// MARK: - Preset Storage
class PresetManager: ObservableObject {
    @Published var presets: [Preset] = []
    private let storageKey = "AITuner4_Presets"
    
    init() {
        loadPresets()
    }
    
    func savePreset(_ preset: Preset) {
        // Check if preset with same name already exists
        if let existingIndex = presets.firstIndex(where: { $0.name == preset.name }) {
            presets[existingIndex] = preset
        } else {
            presets.append(preset)
        }
        savePresets()
    }
    
    func deletePreset(_ preset: Preset) {
        presets.removeAll { $0.id == preset.id }
        savePresets()
    }
    
    func loadPreset(_ preset: Preset) -> (modelId: String?, personaId: String?, personality: String, levers: [String: Int]) {
        return (preset.modelId, preset.personaId, preset.personality, preset.levers)
    }
    
    private func savePresets() {
        do {
            let encoded = try JSONEncoder().encode(presets)
            UserDefaults.standard.set(encoded, forKey: storageKey)
        } catch {
            print("Error saving presets: \(error.localizedDescription)")
        }
    }
    
    private func loadPresets() {
        guard let data = UserDefaults.standard.data(forKey: storageKey) else {
            presets = []
            return
        }
        
        do {
            presets = try JSONDecoder().decode([Preset].self, from: data)
        } catch {
            print("Error loading presets: \(error.localizedDescription)")
            presets = []
        }
    }
}
