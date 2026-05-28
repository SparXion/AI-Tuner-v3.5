# 🚀 Launch Guide - AI Tuner for Cursor

## Quick Launch (Install Locally in Cursor)

### Method 1: Install from Existing VSIX

1. **Open Cursor**
2. **Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)**
3. **Type:** `Extensions: Install from VSIX...`
4. **Navigate to:** `cursor-ai-tuner/cursor-ai-tuner-2.0.0.vsix`
5. **Select the file** and click Install
6. **Reload Cursor** when prompted
7. **Open the extension:** 
   - Press `Cmd+Shift+P` → type `AI Tuner: Open Panel`
   - OR look for "AI Tuner" in the Explorer sidebar

### Method 2: Development Mode (Recommended for Testing)

1. **Open the extension folder in Cursor:**
   ```bash
   cd cursor-ai-tuner
   cursor .
   ```

2. **Press `F5`** - This opens a new Extension Development Host window

3. **Test in the new window:**
   - The extension will be loaded automatically
   - Press `Cmd+Shift+P` → `AI Tuner: Open Panel`

## 🔨 Rebuild VSIX (If Needed)

If you want a fresh VSIX package:

```bash
cd cursor-ai-tuner
npm install  # If dependencies aren't installed
npm run build:production  # This will create a new VSIX
```

The new VSIX will be created in the `cursor-ai-tuner/` directory.

## 📦 Publish to VS Code Marketplace

### Prerequisites:
1. **Create a publisher account** at https://marketplace.visualstudio.com/manage
2. **Get a Personal Access Token (PAT)** from Azure DevOps:
   - Go to https://dev.azure.com
   - User Settings → Personal Access Tokens
   - Create token with "Marketplace" → "Manage" scope

### Steps:

1. **Install vsce globally** (if not already):
   ```bash
   npm install -g @vscode/vsce
   ```

2. **Create Personal Access Token** in Azure DevOps

3. **Package the extension:**
   ```bash
   cd cursor-ai-tuner
   npm run build:production
   ```

4. **Publish to marketplace:**
   ```bash
   vsce publish -p <YOUR_PERSONAL_ACCESS_TOKEN>
   ```

   Or publish manually:
   ```bash
   vsce publish
   # Enter your publisher name: sparxion
   # Enter your Personal Access Token
   ```

5. **Verify publication:**
   - Check https://marketplace.visualstudio.com/manage
   - Your extension should appear as "Published" within a few minutes

### Update Existing Publication:

```bash
# Bump version in package.json first
npm version patch  # or minor, or major

# Then publish
vsce publish -p <YOUR_PERSONAL_ACCESS_TOKEN>
```

## 🌐 GitHub Pages (Already Done!)

The web app is already live at:
**https://sparxion.github.io/AI-Tuner/**

The extension loads this URL in an iframe, so CSS changes (like the sticky preview) are already live!

## ✅ Verify It's Working

After installation:
1. **Open AI Tuner Panel** (`Cmd+Shift+P` → `AI Tuner: Open Panel`)
2. **Check that the preview section sticks** when you scroll the left menu
3. **Try a preset** (click a personality preset)
4. **Check the generated prompt** appears in the preview
5. **Click "Apply to Cursor"** to test the apply function

## 🐛 Troubleshooting

### Extension Not Loading
- Make sure Cursor is up to date
- Check that TypeScript compiled: `npm run compile` in the extension folder
- Restart Cursor

### Web App Not Loading in Extension
- Check your internet connection (needs GitHub Pages)
- Verify: https://sparxion.github.io/AI-Tuner/ loads in browser
- Check Cursor's webview console for errors

### VSIX Installation Fails
- Make sure the VSIX file isn't corrupted
- Try rebuilding: `npm run build:production`
- Check Cursor version compatibility

