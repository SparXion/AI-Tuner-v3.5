# AI Tuner

**Free** visual AI personality configuration tool. Available as both a **web app** and **Cursor extension**.

[Try Web Version](https://sparxion.github.io/AI-Tuner/) | [Install Cursor Extension](#installation)

---

## Features

### **Core Functionality**
- **16+ Tunable Parameters**: Personality, bluntness, truth prioritization, humor, tool use, and more
- **20+ Model Templates**: Preset configurations for Claude, GPT, Gemini, Grok, Cursor Agent, and more
- **Real-time Preview**: See generated prompts instantly as you adjust settings
- **One-Click Apply**: Apply configurations directly to Cursor (extension only)
- **Sticky Preview**: Preview panel follows you as you scroll through options

### **Built-in Presets**
- **Absolute Mode**: Maximum directness and efficiency
- **Friendly Helper**: Warm, supportive, collaborative
- **Analytical Expert**: Methodical, evidence-based, systematic
- **Minimal Responder**: Ultra-concise, no-nonsense
- **Creative Collaborator**: Exploratory, imaginative
- **Coding Assistant**: Technical, structured, efficient
- **Factory Default**: Reset to neutral settings

### **AI Model Templates**
- **Claude**: Reset presets for Claude, Claude Opus, Claude Sonnet
- **GPT**: Templates for ChatGPT and variations
- **Gemini**: Google Gemini configurations
- **Grok**: X.AI Grok-specific presets with humor and real-time data bias
- **Cursor Agent**: Cursor-specific reset configurations

### **Dual Platform**
- **Web Version**: Works in any browser, no installation needed
- **Cursor Extension**: Integrated directly into Cursor with auto-apply functionality
- **Single Codebase**: Both platforms share the same feature set

---

## Installation

### **Web Version**
Simply visit: [https://sparxion.github.io/AI-Tuner/](https://sparxion.github.io/AI-Tuner/)

### **Cursor Extension**

#### From VS Code Marketplace (Coming Soon)
1. Open Cursor
2. Go to Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. Search for "AI Tuner"
4. Click Install

#### From VSIX Package
1. Download the latest `.vsix` from [Releases](https://github.com/SparXion/AI-Tuner/releases)
2. Open Cursor
3. Go to Extensions → `...` → "Install from VSIX..."
4. Select the downloaded `.vsix` file

#### Development Mode
```bash
git clone https://github.com/SparXion/AI-Tuner.git
cd cursor-ai-tuner
npm install
npm run compile
# Press F5 in Cursor to launch Extension Development Host
```

---

## Quick Start

### **Web Version**
1. Visit [sparxion.github.io/AI-Tuner](https://sparxion.github.io/AI-Tuner/)
2. Choose a preset or adjust parameters
3. Copy the generated prompt
4. Paste into your AI assistant

### **Cursor Extension**
1. **Open AI Tuner**: 
   - Click "AI Tuner" in the Explorer sidebar
   - Or press `Cmd+Shift+P` → "AI Tuner: Open Panel"
   - Or click the personality icon in the status bar
2. **Choose a Preset**: Select from built-in presets or model templates
3. **Fine-tune** (optional): Adjust individual parameters
4. **Apply**: Click "Apply to Cursor" to set it instantly

---

## Configuration Parameters

### **Personality & Approach**
Control the AI's fundamental personality: Neutral, Curious, Analytical, Witty, Directive, Collaborative, and more.

### **Cognition & Logic**
- **Bluntness**: Low → Medium → High → Absolute
- **Termination**: Natural flow vs. Abrupt endings
- **Cognitive Tier**: Surface conversation vs. Deep analysis

### **Affect & Tone**
- **Tone Neutrality**: Full, Partial, or Off
- **Sentiment Boost**: Disabled, Selective, or Enabled
- **Mirror Avoidance**: How much the AI mirrors your tone

### **Interface & Flow**
- **Element Elimination**: Remove emojis, filler words, transitions
- **Transitions**: Conversational flow vs. Direct statements
- **Call to Action**: Minimal or no prompting

### **Behavioral Controls**
- **Questions**: Prohibited, Selective, or Allowed
- **Suggestions**: Control recommendation frequency
- **Motivational Content**: Enable/disable encouragement

### **Goal Orientation**
- **Continuation Bias**: Encourage vs. suppress ongoing dialogue
- **Self-Sufficiency**: Collaboration vs. independence focus
- **Assumption Strength**: How much capability to assume in users

### **Special Features** (Model-Specific)
- **Truth Prioritization**: Absolute truth vs. diplomatic responses
- **Source Transparency**: Show/hide sources
- **Uncertainty Admission**: Allow/require admitting unknowns
- **Self-Referential Humor**: Enable meta-humor
- **Absurdism Injection**: Controlled absurdity
- **Tool Invocation**: Proactive vs. on-request tool use
- **Real-Time Data Bias**: Prioritize live data
- **Cosmic Perspective**: Subtle to overt existential awareness

---

## Use Cases

### **Programming**
Use "Coding Assistant" preset for technical, structured responses with minimal fluff.

### **Creative Writing**
Try "Creative Collaborator" for exploratory, imaginative interactions.

### **Research & Analysis**
"Analytical Expert" provides methodical, evidence-based responses.

### **Quick Tasks**
"Absolute Mode" or "Minimal Responder" for maximum efficiency.

### **Reset AI Behavior**
Use model-specific reset presets (e.g., "Reset Grok", "Reset Cursor Agent") to return to default behavior.

---

## Advanced Features

### **Custom Presets**
Save your own personality configurations for reuse:
1. Adjust parameters to your preference
2. Click "Save Preset"
3. Name your preset
4. Access it anytime via preset list

### **Real-time Memory Monitoring**
The extension includes automatic memory leak detection and performance monitoring.

### **Sticky Preview**
In the web version, the preview panel follows you as you scroll, making it easy to see changes in real-time.

---

## Latest Features

- **Sticky Preview**: Preview panel stays visible while scrolling
- **Model Templates**: Preset configurations for major AI models
- **Improved Memory Management**: Better performance monitoring
- **Grok-Specific Presets**: Optimized for X.AI's Grok personality
- **Cursor Integration**: Direct apply-to-Cursor functionality
- **Unified Codebase**: Web and extension share the same features

---

## Troubleshooting

### **Extension Not Loading**
- Ensure Cursor is updated to the latest version
- Try reloading the window: `Cmd+Shift+P` → "Developer: Reload Window"

### **Preview Not Sticking**
- Make sure you're using the latest version
- Check that JavaScript is enabled in your browser

### **Preset Not Applying**
- Verify the preset exists in the dropdown
- Try reloading the extension

---

## License

Apache 2.0 · [Full License](LICENSE)

---

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

- **Issues**: [GitHub Issues](https://github.com/SparXion/AI-Tuner/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SparXion/AI-Tuner/discussions)

---

## Links

- **Web App**: [sparxion.github.io/AI-Tuner](https://sparxion.github.io/AI-Tuner/)
- **GitHub**: [github.com/SparXion/AI-Tuner](https://github.com/SparXion/AI-Tuner)
- **Extension Source**: [github.com/SparXion/AI-Tuner/tree/main/cursor-ai-tuner](https://github.com/SparXion/AI-Tuner/tree/main/cursor-ai-tuner)

---

**Made by [SparXion](https://sparxion.com)**
