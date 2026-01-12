//
//  ContentView.swift
//  AITuner4
//
//  AI Tuner v4.0 - Main Content View
//

import SwiftUI

struct ContentView: View {
    @StateObject private var engine = AITunerEngine()
    @State private var selectedTab = 0
    @AppStorage("hasSeenWelcome") private var hasSeenWelcome = false
    @AppStorage("hasCompletedTutorial") private var hasCompletedTutorial = false
    @State private var showingWelcome = false
    @State private var showingTutorial = false
    @State private var showingTutorialOptions = false
    
    var body: some View {
        NavigationView {
            TabView(selection: $selectedTab) {
                SimpleModeView(engine: engine)
                    .tabItem {
                        Label("Simple", systemImage: "sparkles")
                    }
                    .tag(0)
                
                AdvancedModeView(engine: engine)
                    .tabItem {
                        Label("Advanced", systemImage: "slider.horizontal.3")
                    }
                    .tag(1)
            }
            .navigationTitle("AI Tuner v4.0")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        showingTutorialOptions = true
                    }) {
                        Image(systemName: "questionmark.circle")
                            .foregroundColor(.blue)
                    }
                }
            }
            .confirmationDialog("Tutorial", isPresented: $showingTutorialOptions, titleVisibility: .visible) {
                Button("Show Tutorial") {
                    showingTutorial = true
                }
                Button("Restart Tutorial") {
                    UserDefaults.standard.set(false, forKey: "hasCompletedTutorial")
                    showingTutorial = true
                }
                Button("Cancel", role: .cancel) { }
            }
            .onAppear {
                // Generate initial prompt
                engine.generatePrompt()
                
                if !hasSeenWelcome {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        showingWelcome = true
                    }
                }
            }
            .overlay {
                // Welcome popup overlay
                if showingWelcome {
                    WelcomePopupView(isPresented: $showingWelcome)
                }
                
                // Tutorial overlay
                if showingTutorial {
                    TutorialGuideView(isPresented: $showingTutorial)
                }
            }
        }
    }
}

struct SimpleModeView: View {
    @ObservedObject var engine: AITunerEngine
    @State private var showingRadarPopup = false
    
    var body: some View {
        ZStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Quick Start Guide
                    QuickStartGuideView()
                    
                    // What is AI Tuner? section
                    WhatIsAITunerView()
                        .padding(.horizontal)
                    
                    // Step 1: Choose Model
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("1")
                                .font(.headline)
                                .foregroundColor(.white)
                                .frame(width: 32, height: 32)
                                .background(Color.black)
                                .clipShape(Circle())
                            
                            Text("Choose Your AI Model")
                                .font(.headline)
                        }
                        
                        ModelGridView(engine: engine)
                    }
                    .padding()
                    .accessibilityElement(children: .contain)
                    .accessibilityLabel("Step 1: Choose Your AI Model")
                    
                    // Personality Selector
                    PersonalitySelectorView(engine: engine)
                        .padding(.horizontal)
                    
                    // Step 2: Apply Persona
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("2")
                                .font(.headline)
                                .foregroundColor(.white)
                                .frame(width: 32, height: 32)
                                .background(Color.black)
                                .clipShape(Circle())
                            
                            Text("Apply Hidden Mode")
                                .font(.headline)
                        }
                        
                        PersonaGridView(engine: engine)
                    }
                    .padding()
                    .accessibilityElement(children: .contain)
                    .accessibilityLabel("Step 2: Apply Hidden Mode")
                    
                    // Step 3: Fine-Tune
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("3")
                                .font(.headline)
                                .foregroundColor(.white)
                                .frame(width: 32, height: 32)
                                .background(Color.black)
                                .clipShape(Circle())
                            
                            Text("Fine-Tune Your Settings")
                                .font(.headline)
                        }
                        
                        SimpleLeverControlsView(engine: engine)
                    }
                    .padding()
                    .accessibilityElement(children: .contain)
                    .accessibilityLabel("Step 3: Fine-Tune Your Settings")
                    
                    // Generated Prompt
                    PromptPreviewView(engine: engine)
                        .padding()
                }
            }
            
            // Floating radar button
            if !showingRadarPopup {
                FloatingRadarButton(isPresented: $showingRadarPopup)
            }
            
            // Radar popup
            if showingRadarPopup {
                RadarPopupView(isPresented: $showingRadarPopup, engine: engine)
            }
        }
        .onAppear {
            // Generate initial prompt
            engine.generatePrompt()
        }
    }
}

struct AdvancedModeView: View {
    @ObservedObject var engine: AITunerEngine
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Advanced Mode")
                    .font(.title)
                    .padding()
                
                Text("Full control with 4 specialized web tuners")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                // 4 Web Tuner Sections
                VStack(spacing: 16) {
                    WebTunerSectionView(tunerType: .personaSpine, engine: engine)
                    WebTunerSectionView(tunerType: .engagement, engine: engine)
                    WebTunerSectionView(tunerType: .truth, engine: engine)
                    WebTunerSectionView(tunerType: .delivery, engine: engine)
                }
                .padding(.horizontal)
                
                // Generated Prompt
                PromptPreviewView(engine: engine)
                    .padding()
            }
        }
        .onAppear {
            // Auto-generate neutral prompt for Advanced Mode
            engine.generatePrompt()
        }
    }
}

struct QuickStartGuideView: View {
    var body: some View {
        VStack(spacing: 16) {
            HStack(spacing: 20) {
                VStack {
                    Image(systemName: "sparkles")
                        .font(.title2)
                        .foregroundColor(.blue)
                    Text("Choose")
                        .font(.caption)
                        .fontWeight(.semibold)
                    Text("Select model")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                .accessibilityElement(children: .combine)
                .accessibilityLabel("Choose: Select model")
                
                Image(systemName: "arrow.right")
                    .foregroundColor(.secondary)
                    .accessibilityHidden(true)
                
                VStack {
                    Image(systemName: "slider.horizontal.3")
                        .font(.title2)
                        .foregroundColor(.blue)
                    Text("Tune")
                        .font(.caption)
                        .fontWeight(.semibold)
                    Text("Adjust sliders")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                .accessibilityElement(children: .combine)
                .accessibilityLabel("Tune: Adjust sliders")
                
                Image(systemName: "arrow.right")
                    .foregroundColor(.secondary)
                    .accessibilityHidden(true)
                
                VStack {
                    Image(systemName: "doc.on.doc")
                        .font(.title2)
                        .foregroundColor(.blue)
                    Text("Copy")
                        .font(.caption)
                        .fontWeight(.semibold)
                    Text("Copy prompt")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                .accessibilityElement(children: .combine)
                .accessibilityLabel("Copy: Copy prompt")
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
        .padding()
        .accessibilityElement(children: .contain)
        .accessibilityLabel("Quick start guide: Choose a model, tune with sliders, then copy your prompt")
    }
}

struct PromptPreviewView: View {
    @ObservedObject var engine: AITunerEngine
    @StateObject private var presetManager = PresetManager()
    @State private var showingShareSheet = false
    @State private var showingSavePreset = false
    @State private var showingPresets = false
    @State private var presetName = ""
    @State private var showCopySuccess = false
    @State private var showSaveSuccess = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Generated Prompt")
                .font(.headline)
            
            ScrollView {
                Text(engine.generatedPrompt)
                    .font(.system(.body, design: .monospaced))
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
                    .textSelection(.enabled)
            }
            .frame(height: 200)
            .accessibilityLabel("Generated prompt")
            .accessibilityHint("The custom prompt generated from your settings")
            
            HStack(spacing: 12) {
                Button(action: {
                    UIPasteboard.general.string = engine.generatedPrompt
                    // Haptic feedback
                    let generator = UINotificationFeedbackGenerator()
                    generator.notificationOccurred(.success)
                    // Show success message
                    withAnimation {
                        showCopySuccess = true
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                        withAnimation {
                            showCopySuccess = false
                        }
                    }
                }) {
                    Label(showCopySuccess ? "Copied!" : "Copy", systemImage: showCopySuccess ? "checkmark.circle.fill" : "doc.on.doc")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .disabled(engine.generatedPrompt.isEmpty)
                .animation(.easeInOut, value: showCopySuccess)
                
                Button(action: {
                    showingShareSheet = true
                }) {
                    Label("Share", systemImage: "square.and.arrow.up")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .disabled(engine.generatedPrompt.isEmpty)
                
                Button(action: {
                    showingSavePreset = true
                }) {
                    Label("Save", systemImage: "bookmark")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .disabled(engine.generatedPrompt.isEmpty)
            }
            
            if !presetManager.presets.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Saved Presets")
                        .font(.headline)
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(presetManager.presets) { preset in
                                PresetButtonView(
                                    preset: preset,
                                    onTap: {
                                        loadPreset(preset)
                                    },
                                    onDelete: {
                                        presetManager.deletePreset(preset)
                                    }
                                )
                            }
                        }
                        .padding(.horizontal)
                    }
                }
            }
        }
        .sheet(isPresented: $showingShareSheet) {
            ShareSheet(items: [engine.generatedPrompt])
        }
        .alert("Save Preset", isPresented: $showingSavePreset) {
            TextField("Preset Name", text: $presetName)
                .autocapitalization(.words)
                .disableAutocorrection(false)
                .submitLabel(.done)
            Button("Cancel", role: .cancel) {
                presetName = ""
            }
            Button("Save") {
                savePreset()
            }
            .disabled(presetName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        } message: {
            Text("Enter a name for this preset")
        }
        .overlay {
            if showSaveSuccess {
                VStack {
                    Spacer()
                    HStack {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.green)
                        Text("Preset saved!")
                            .font(.headline)
                    }
                    .padding()
                    .background(Color(.systemBackground))
                    .cornerRadius(12)
                    .shadow(radius: 10)
                    .padding()
                }
            }
        }
    }
    
    private func savePreset() {
        guard !presetName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        
        let trimmedName = presetName.trimmingCharacters(in: .whitespacesAndNewlines)
        let preset = Preset(
            name: trimmedName,
            modelId: engine.selectedModel?.id,
            personaId: engine.selectedPersona?.id,
            personality: engine.personality.rawValue,
            levers: engine.levers
        )
        
        presetManager.savePreset(preset)
        presetName = ""
        
        // Haptic feedback
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
        
        // Show success message
        withAnimation {
            showSaveSuccess = true
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            withAnimation {
                showSaveSuccess = false
            }
        }
    }
    
    private func loadPreset(_ preset: Preset) {
        // Haptic feedback
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
        
        let (modelId, personaId, personality, levers) = presetManager.loadPreset(preset)
        
        // Load model if present
        if let modelId = modelId,
           let model = AIModel.allModels.first(where: { $0.id == modelId }) {
            engine.selectModel(model)
        } else {
            // Reset model if preset doesn't have one
            engine.resetModel()
        }
        
        // Load persona if present
        if let personaId = personaId,
           let persona = Persona.allPersonas.first(where: { $0.id == personaId }) {
            engine.selectPersona(persona)
        } else {
            // Reset persona if preset doesn't have one
            engine.resetPersona()
        }
        
        // Load personality
        if let personalityType = AITunerEngine.PersonalityType(rawValue: personality) {
            engine.personality = personalityType
        }
        
        // Load lever values
        for (key, value) in levers {
            engine.setLever(key, value: value)
        }
    }
}

struct PresetButtonView: View {
    let preset: Preset
    let onTap: () -> Void
    let onDelete: () -> Void
    
    var body: some View {
        Button(action: {
            // Haptic feedback
            let generator = UIImpactFeedbackGenerator(style: .light)
            generator.impactOccurred()
            onTap()
        }) {
            HStack {
                Text(preset.name)
                    .font(.caption)
                    .foregroundColor(.primary)
                
                Button(action: {
                    // Haptic feedback
                    let generator = UIImpactFeedbackGenerator(style: .medium)
                    generator.impactOccurred()
                    onDelete()
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.caption2)
                        .foregroundColor(.red)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color(.systemGray5))
            .cornerRadius(20)
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Preset: \(preset.name)")
        .accessibilityHint("Tap to load this preset, or tap the X to delete")
    }
}

struct ShareSheet: UIViewControllerRepresentable {
    let items: [Any]
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        let controller = UIActivityViewController(activityItems: items, applicationActivities: nil)
        return controller
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

#Preview {
    ContentView()
}
