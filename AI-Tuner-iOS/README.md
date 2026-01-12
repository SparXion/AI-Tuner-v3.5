# AI Tuner 4.0 - iOS App

A standalone iOS app for customizing AI behavior with precision controls. Port of the web-based AI Tuner to native iOS using SwiftUI.

## Features

- **Model Selection**: Choose from 7 AI models (Grok, Gemini, Claude, ChatGPT, Perplexity, Mistral, Llama)
- **Persona Selection**: Apply specialized personas (Therapist, Truth-Seeker, Coder, Researcher, Friend, Scam Hunter, Minimalist)
- **Simple Mode**: 8 essential tuning levers for quick customization
- **Advanced Mode**: Full control with all 26 tuning levers
- **Real-time Prompt Generation**: See generated prompts instantly as you adjust settings
- **Share & Copy**: Easily copy or share generated prompts

## Requirements

- iOS 15.0+
- Xcode 14.0+
- Swift 5.7+

## Project Structure

```
AITuner4/
├── AITuner4/
│   ├── AITuner4App.swift          # App entry point
│   ├── Models/                     # Data models
│   │   ├── AIModel.swift          # AI model definitions
│   │   ├── Lever.swift            # Lever definitions
│   │   └── Persona.swift          # Persona definitions
│   ├── Engine/
│   │   └── AITunerEngine.swift    # Core tuning engine
│   ├── Views/                      # SwiftUI views
│   │   ├── ContentView.swift      # Main content view
│   │   ├── ModelGridView.swift    # Model selection grid
│   │   ├── PersonaGridView.swift  # Persona selection grid
│   │   └── LeverControlsView.swift # Lever controls
│   └── Resources/
│       └── Info.plist             # App configuration
```

## Building the App

### Option 1: Create Xcode Project Manually

1. Open Xcode
2. Create a new project:
   - Choose "iOS" → "App"
   - Product Name: `AITuner4`
   - Interface: SwiftUI
   - Language: Swift
   - Bundle Identifier: `com.yourcompany.AITuner4`
3. Copy all files from this directory into the Xcode project
4. Build and run

### Option 2: Use XcodeGen (Recommended)

If you have [XcodeGen](https://github.com/yonaskolb/XcodeGen) installed:

```bash
cd AI-Tuner-iOS/AITuner4
xcodegen generate
open AITuner4.xcodeproj
```

## Architecture

### Models
- **AIModel**: Represents an AI model with default lever values
- **Lever**: Defines a tuning parameter with range and description
- **Persona**: Pre-configured personality profiles

### Engine
- **AITunerEngine**: ObservableObject that manages state and generates prompts
  - Tracks selected model, persona, and lever values
  - Generates prompt text based on current configuration
  - Handles lever locking for specific models

### Views
- **ContentView**: Main container with tab navigation
- **SimpleModeView**: Simplified interface with 8 key levers
- **AdvancedModeView**: Full control with all levers
- **ModelGridView**: Grid display of available AI models
- **PersonaGridView**: Grid display of available personas
- **LeverControlsView**: Slider controls for tuning levers

## Usage

1. **Choose a Model**: Select an AI model from the grid (Step 1)
2. **Apply a Persona** (Optional): Select a persona to override model defaults (Step 2)
3. **Fine-Tune**: Adjust sliders to customize behavior (Step 3)
4. **Copy Prompt**: Copy the generated prompt and paste into your AI assistant

## Tuning Levers

### Simple Mode (8 Levers)
- Creativity
- Teaching Mode
- Proactivity Level
- Playfulness
- Conciseness
- Answer Completeness
- Hedging Intensity
- Empathy Expressiveness

### Advanced Mode (26 Levers)
All levers from Simple Mode plus:
- Formality
- Structural Density
- Formatting Minimalism
- Tool Autonomy
- Citation Rigidity
- Transparency
- Affirmation Frequency
- Meta-Commentary
- Response Directness
- Certainty Modulation
- Assertiveness
- Adaptivity to User Tone
- Safety Disclaimers
- Speed Optimization
- Markdown Structure
- Strict Formatting
- Technicality
- Identity Source Lock

## License

Apache 2.0 - See LICENSE file

## Credits

Based on the web-based AI Tuner project. Ported to iOS for native mobile experience.
