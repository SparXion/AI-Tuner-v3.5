# AI Tuner 4.0 iOS - Setup Guide

## Quick Start

### Prerequisites
- macOS with Xcode 14.0 or later
- iOS 15.0+ device or simulator
- Swift 5.7+

### Option 1: Manual Xcode Project Setup

1. **Open Xcode** and create a new project:
   - File → New → Project
   - Choose "iOS" → "App"
   - Product Name: `AITuner4`
   - Interface: **SwiftUI**
   - Language: **Swift**
   - Bundle Identifier: `com.yourcompany.AITuner4` (or your preferred identifier)

2. **Copy Files**:
   - Copy all files from `AITuner4/AITuner4/` into your Xcode project
   - Ensure the folder structure matches:
     ```
     AITuner4/
     ├── AITuner4App.swift
     ├── Models/
     │   ├── AIModel.swift
     │   ├── Lever.swift
     │   ├── Persona.swift
     │   └── Preset.swift
     ├── Engine/
     │   └── AITunerEngine.swift
     ├── Views/
     │   ├── ContentView.swift
     │   ├── ModelGridView.swift
     │   ├── PersonaGridView.swift
     │   ├── LeverControlsView.swift
     │   └── PersonalitySelectorView.swift
     └── Resources/
         └── Info.plist
     ```

3. **Configure Info.plist**:
   - Update `Info.plist` with the provided content or use the one in `Resources/`
   - Ensure bundle identifier matches your project settings

4. **Build and Run**:
   - Select a simulator or connected device
   - Press `Cmd+R` to build and run

### Option 2: Using XcodeGen (Recommended)

If you have [XcodeGen](https://github.com/yonaskolb/XcodeGen) installed:

```bash
cd AI-Tuner-iOS/AITuner4
xcodegen generate
open AITuner4.xcodeproj
```

Then build and run in Xcode.

## Project Structure

```
AITuner4/
├── AITuner4App.swift          # App entry point (@main)
├── Models/                     # Data models
│   ├── AIModel.swift          # AI model definitions (7 models)
│   ├── Lever.swift            # Lever definitions (26 levers)
│   ├── Persona.swift          # Persona definitions (7+ personas)
│   └── Preset.swift           # Preset storage model
├── Engine/
│   └── AITunerEngine.swift    # Core tuning engine (ObservableObject)
├── Views/                      # SwiftUI views
│   ├── ContentView.swift      # Main container with tabs
│   ├── ModelGridView.swift    # Model selection grid
│   ├── PersonaGridView.swift  # Persona selection grid
│   ├── LeverControlsView.swift # Lever slider controls
│   └── PersonalitySelectorView.swift # Personality picker
└── Resources/
    └── Info.plist             # App configuration
```

## Features Implemented

✅ **Model Selection**: 7 AI models (Grok, Gemini, Claude, ChatGPT, Perplexity, Mistral, Llama)
✅ **Persona Selection**: 7 core personas (Therapist, Truth-Seeker, Coder, Researcher, Friend, Scam Hunter, Minimalist)
✅ **Personality Types**: 12 intellectual styles (Neutral, Socratic, Curious, Analytical, etc.)
✅ **Simple Mode**: 8 essential tuning levers
✅ **Advanced Mode**: All 26 tuning levers
✅ **Real-time Prompt Generation**: Updates as you adjust settings
✅ **Preset Management**: Save, load, and delete presets
✅ **Share & Copy**: Native iOS sharing and clipboard support

## Testing

1. **Run on Simulator**:
   - Select iPhone 14 Pro or later simulator
   - Build and run (`Cmd+R`)

2. **Test Flow**:
   - Select a model (e.g., "Grok")
   - Choose a persona (e.g., "Truth-Seeker")
   - Adjust sliders in Simple mode
   - Copy the generated prompt
   - Save a preset
   - Load the preset

## Troubleshooting

### Build Errors

1. **Missing Files**: Ensure all Swift files are added to the Xcode project target
2. **Bundle Identifier**: Update Info.plist and project settings to match
3. **Swift Version**: Ensure project uses Swift 5.7+

### Runtime Issues

1. **Presets Not Saving**: Check that UserDefaults is accessible (should work by default)
2. **Prompt Not Generating**: Ensure a model is selected first
3. **Lever Values Not Updating**: Check that `AITunerEngine` is properly observed with `@ObservedObject`

## Next Steps

- Add radar chart visualization (using Swift Charts or custom drawing)
- Add dark mode support
- Add export/import functionality for presets
- Add haptic feedback for slider adjustments
- Add tutorial/onboarding flow

## License

Apache 2.0 - See LICENSE file
