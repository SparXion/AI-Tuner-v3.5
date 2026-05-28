# Testing the Extension in Cursor - Step by Step

## Method 1: Install from VSIX File (EASIEST)

### Step-by-Step:

1. **Find the VSIX file**
   - File location: `/Users/johnviolette/AI Absolute Mode Overlay/cursor-ai-tuner/cursor-ai-tuner-2.0.0.vsix`
   - Or navigate to: `cursor-ai-tuner` folder → look for `.vsix` file

2. **Open Cursor**

3. **Open Command Palette**
   - Press: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Or: Menu → View → Command Palette

4. **Install Extension**
   - Type: `Install from VSIX`
   - Select: **"Extensions: Install from VSIX..."**
   - A file picker will open
   - Navigate to the folder: `cursor-ai-tuner`
   - Select the file: `cursor-ai-tuner-2.0.0.vsix`
   - Click "Install" or "Open"

5. **Reload Cursor**
   - Cursor will prompt you to reload
   - Click "Reload Window"

6. **Verify Installation**
   - Press `Cmd+Shift+P` again
   - Type: `AI Tuner`
   - You should see commands like "AI Tuner: Open Panel"
   - Look at bottom-right of window for "⚙️ AI Tuner" button

---

## Method 2: Development Mode (If VSIX doesn't work)

### Step-by-Step:

1. **Open the Extension Folder in Cursor**
   - In Cursor, go to: **File → Open Folder...**
   - Navigate to: `/Users/johnviolette/AI Absolute Mode Overlay/cursor-ai-tuner`
   - Click "Open"

2. **Check for Debug Configuration**
   - Look for `.vscode/launch.json` file in the extension folder
   - If it doesn't exist, we need to create one

3. **Press F5 (or use Run menu)**
   - If F5 doesn't work, go to: **Run → Start Debugging**
   - Or: Menu → Run → Start Debugging
   - This opens a new Cursor window labeled "[Extension Development Host]"

4. **Test in the New Window**
   - The new window has your extension active
   - Test all features there

---

## What You Should See After Installation:

### 1. Status Bar (Bottom-Right)
- Look at the very bottom-right of Cursor window
- You should see: **"⚙️ AI Tuner"** button
- Click it → Opens the full tuner panel

### 2. Explorer Sidebar (Left)
- Look at the left sidebar
- Find the "Explorer" section
- Look for **"AI Tuner"** subsection below it
- You should see a list of presets (Absolute Mode, Friendly Helper, etc.)
- Click any preset → Should apply it

### 3. Command Palette
- Press `Cmd+Shift+P`
- Type: `AI Tuner`
- You should see commands like:
  - "AI Tuner: Open Panel"
  - "AI Tuner: Apply Preset"
  - "AI Tuner: Toggle Elite Mode (Dev)"

---

## Troubleshooting

**Can't find the VSIX file?**
- Check: `cursor-ai-tuner` folder
- Look for files ending in `.vsix`
- If missing, run: `cd cursor-ai-tuner && npm run package`

**F5 doesn't work?**
- Use Method 1 (VSIX installation) instead
- That's simpler and more reliable

**Extension not appearing?**
- Check Cursor's Extension view (left sidebar, Extensions icon)
- Look for "AI Tuner" in installed extensions
- Make sure it's enabled (not disabled)

**Status bar button not showing?**
- Try reloading Cursor window (`Cmd+R` or Command Palette → "Developer: Reload Window")
- Check if extension is enabled in Extensions view


