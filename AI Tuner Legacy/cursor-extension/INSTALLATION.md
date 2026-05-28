# AI Tuner for Cursor - Installation Guide

## 🚀 **Quick Installation**

### **Method 1: From Source (Recommended)**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SparXion/cursor-ai-tuner.git
   cd cursor-ai-tuner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile the extension:**
   ```bash
   npm run compile
   ```

4. **Load in Cursor:**
   - Open Cursor
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Extensions: Install from VSIX"
   - Navigate to the `cursor-ai-tuner` folder
   - Select the compiled extension (it will be in the `out` folder)

### **Method 2: Development Mode**

1. **Open the project in Cursor:**
   ```bash
   cd cursor-ai-tuner
   cursor .
   ```

2. **Press F5** to run the extension in a new Extension Development Host window

3. **Test the extension** in the new window

## 🎯 **First Time Setup**

1. **Open AI Tuner Panel:**
   - Look for "AI Tuner" in the Explorer sidebar
   - Click to open the panel

2. **Try a Quick Preset:**
   - Click the personality emoji in the status bar (bottom right)
   - Select "Coding Assistant" or "Absolute Mode"
   - Watch the status bar update

3. **Apply to Your Project:**
   - Click "Apply to Cursor" in the AI Tuner panel
   - Check that `.cursorrules` file was created/updated in your project root

## 🔧 **Usage**

### **Sidebar Panel (Full Control)**
- **Location:** Explorer sidebar → "AI Tuner"
- **Features:** All 16 personality controls, real-time preview, custom presets
- **Best for:** Detailed customization and learning

### **Status Bar (Quick Access)**
- **Location:** Bottom status bar (right side)
- **Features:** Current personality indicator, one-click preset switching
- **Best for:** Rapid personality changes during work

### **Command Palette**
- **Access:** `Cmd+Shift+P` → "AI Tuner"
- **Commands:** Open panel, quick presets, apply settings
- **Best for:** Keyboard-driven workflow

## 🎭 **Built-in Presets**

| Preset | Description | Best For |
|--------|-------------|----------|
| **Absolute Mode** | Maximum bluntness, no fluff | Efficiency, direct answers |
| **Coding Assistant** | Analytical, no emojis, independent | Programming, technical work |
| **Friendly Assistant** | Warm, helpful, encouraging | Learning, collaboration |
| **Analytical Expert** | Precise, technical, detailed | Research, analysis |
| **Minimal Responder** | Ultra-brief, essential only | Quick questions, summaries |
| **Creative Collaborator** | Open-ended, imaginative | Brainstorming, creative work |
| **Standard Reset** | Neutral, allows all elements | Default Cursor behavior |

## ⚙️ **Configuration Options**

### **Personality & Approach**
- **Intellectual Style:** How the AI thinks and approaches problems
- **12 options:** Neutral, Socratic, Curious, Analytical, Sarcastic, Witty, Charming, Sympathetic, Empathetic, Directive, Collaborative, Provocative

### **Cognition & Logic**
- **Bluntness Level:** How direct and unfiltered responses are
- **Response Termination:** Whether responses end naturally or abruptly
- **Cognitive Targeting:** Surface conversation vs. deeper logical layers

### **Affect & Tone**
- **Tone Neutrality:** Emotional neutrality level
- **Sentiment Boosting:** Engagement tactics and enthusiasm
- **User Mirroring:** Whether to reflect user's communication style

### **Interface & Flow**
- **Element Elimination:** Remove emojis, filler words, hype language
- **Conversational Transitions:** Smooth linking between ideas
- **Call-to-Action:** Whether to encourage further interaction

### **Behavioral Controls**
- **Questions:** Whether AI can ask clarifying questions
- **Suggestions:** Whether AI can offer alternatives
- **Motivational Content:** Whether to include encouragement

### **Goal Orientation**
- **Continuation Bias:** Whether to encourage ongoing dialogue
- **Self-Sufficiency Goal:** Foster user independence vs. collaboration
- **User Assumption:** How much capability to assume in users

## 🔄 **Workflow Integration**

### **Daily Development**
1. **Start with a preset** (e.g., "Coding Assistant" for programming)
2. **Switch personalities** as needed via status bar
3. **Fine-tune** using the full panel when required
4. **Save custom presets** for specific project types

### **Team Collaboration**
1. **Share preset configurations** via git
2. **Document personality choices** in project README
3. **Use consistent presets** across team members
4. **Version control** `.cursorrules` changes

### **Learning & Experimentation**
1. **Try different presets** to understand AI behavior
2. **Use info tooltips** to learn what each setting does
3. **Compare responses** with different configurations
4. **Build intuition** for optimal AI personality selection

## 🐛 **Troubleshooting**

### **Extension Not Loading**
- Ensure Cursor is updated to latest version
- Check that TypeScript compiled successfully (`npm run compile`)
- Restart Cursor after installation

### **Panel Not Visible**
- Check Explorer sidebar for "AI Tuner" section
- Try `Cmd+Shift+P` → "AI Tuner: Open Panel"
- Ensure extension is enabled in Extensions view

### **Status Bar Not Showing**
- Check if status bar is enabled in Cursor settings
- Look for personality emoji in bottom-right corner
- Try reloading the window (`Cmd+R`)

### **Settings Not Persisting**
- Check VS Code configuration: `Cmd+Shift+P` → "Preferences: Open Settings (JSON)"
- Look for `aiTuner` configuration section
- Ensure you have write permissions to settings

### **.cursorrules Not Updating**
- Check that you have a workspace folder open
- Ensure you have write permissions to project root
- Try manually clicking "Apply to Cursor" button

## 📚 **Advanced Usage**

### **Custom Presets**
1. Configure desired settings in the panel
2. Click "Save Preset" button
3. Enter a name for your preset
4. Access via status bar quick pick or panel

### **Configuration Management**
- Settings stored in VS Code configuration system
- Accessible via `Cmd+Shift+P` → "Preferences: Open Settings (JSON)"
- Can be shared across projects and team members

### **Integration with Git**
- `.cursorrules` file should be committed to version control
- Team members can use same AI personality settings
- Track personality changes alongside code changes

## 🆘 **Support**

- **Issues:** [GitHub Issues](https://github.com/SparXion/cursor-ai-tuner/issues)
- **Discussions:** [GitHub Discussions](https://github.com/SparXion/cursor-ai-tuner/discussions)
- **Documentation:** [Full Documentation](https://github.com/SparXion/cursor-ai-tuner)

---

**Happy AI tuning! 🎛️**
