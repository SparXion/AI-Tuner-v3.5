# AI Tuner Flowchart

## System Architecture Flow

```mermaid
flowchart TD

    A[User Input<br/>Select Model + Levers + Persona] --> B[Model Selector<br/>7 Models: Grok, Gemini, etc.]

    A --> C[Lever Engine<br/>26 Sliders: Hedging, Empathy, etc.]

    A --> D[Persona Library<br/>7 + 4 Hidden: Therapist, Deep Thinker, etc.]

    B --> E[Tuning Processor<br/>Combine Defaults + Weights]

    C --> E

    D --> E

    E --> F{{Hybrid Blender?<br/>Optional: Mix 2-3 e.g., Claude + Perplexity}}

    E --> G[Output Generator<br/>Prompt Snippet + JSON Preview]

    F -->|Yes| G

    G --> H[Export Options<br/>Cursor Snippet, VS Code, API, QR Share]

    

    classDef input fill:#e1f5fe,stroke:#01579b,color:#000

    classDef core fill:#f3e5f5,stroke:#4a148c,color:#000

    classDef output fill:#e8f5e8,stroke:#1b5e20,color:#000

    classDef optional fill:#fff3e0,stroke:#e65100,color:#000

    

    class A input

    class B,C,D input

    class E core

    class F optional

    class G,H output
```

## Legend

- **Blue (Input)**: User input and initial selection components
- **Purple (Core)**: Core processing engine
- **Orange (Optional)**: Optional hybrid blending feature
- **Green (Output)**: Output generation and export options

## Component Details

### Input Layer
- **User Input**: Model selection, lever adjustments, persona choice
- **Model Selector**: 7 models (Grok, Gemini, Claude, ChatGPT, Perplexity, Mistral, Llama 3.1)
- **Lever Engine**: 26 tuning sliders (Hedging, Empathy, Formality, etc.)
- **Persona Library**: 7 core personas + 4 hidden modes (11 total)

### Processing Layer
- **Tuning Processor**: Combines model defaults, lever weights, and persona settings
- **Hybrid Blender**: Optional feature to mix 2-3 models/personas

### Output Layer
- **Output Generator**: Creates prompt snippet and JSON preview
- **Export Options**: Cursor snippet, VS Code integration, API, QR code sharing

