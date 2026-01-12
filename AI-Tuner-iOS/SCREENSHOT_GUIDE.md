# Screenshot Guide for App Store Submission

## Required Screenshot Sizes

You need screenshots for each device size you want to support. Apple requires at least 3 screenshots per device size, up to 10 maximum.

### iPhone Screenshots

#### iPhone 6.7" Display (iPhone 14 Pro Max, 15 Pro Max)
- **Size:** 1290 x 2796 pixels
- **Required:** 3-10 screenshots

#### iPhone 6.5" Display (iPhone 11 Pro Max, XS Max)
- **Size:** 1284 x 2778 pixels
- **Required:** 3-10 screenshots

#### iPhone 5.5" Display (iPhone 8 Plus)
- **Size:** 1242 x 2208 pixels
- **Required:** 3-10 screenshots

### iPad Screenshots

#### iPad Pro 12.9" Display
- **Size:** 2048 x 2732 pixels
- **Required:** 3-10 screenshots

#### iPad Pro 11" Display
- **Size:** 1668 x 2388 pixels
- **Required:** 3-10 screenshots

## What Screenshots to Capture

### Recommended Screenshot Set (5 screenshots):

1. **Simple Mode - Model Selection**
   - Show the model grid (Grok, ChatGPT, Claude, etc.)
   - Highlight the "Choose" step
   - Include the Quick Start Guide at top

2. **Simple Mode - Sliders & Radar**
   - Show the lever sliders
   - Show the radar chart (if visible)
   - Show the prompt preview
   - Include the "Tune" step

3. **Radar Chart Popup**
   - Show the full-screen radar chart popup
   - Show interactive points
   - Demonstrate the visual tuning capability

4. **Advanced Mode - Web Tuners**
   - Show the 4 web tuner sections
   - Show collapsible sections
   - Show the advanced radar charts

5. **Personas & Presets**
   - Show persona selection
   - Show preset saving/loading
   - Demonstrate the "one-tap" persona feature

## How to Capture Screenshots

### Using Xcode Simulator:

1. **Open Simulator**
   - Xcode → Open Developer Tool → Simulator
   - Or: `open -a Simulator`

2. **Select Device**
   - File → Open Simulator → [Device Name]
   - For iPhone 6.7": iPhone 14 Pro Max or iPhone 15 Pro Max
   - For iPhone 6.5": iPhone 11 Pro Max or iPhone XS Max
   - For iPhone 5.5": iPhone 8 Plus
   - For iPad: iPad Pro 12.9" or iPad Pro 11"

3. **Run Your App**
   - Build and run in Xcode
   - Navigate to the screen you want to capture

4. **Capture Screenshot**
   - Device → Screenshot (or Cmd+S)
   - Screenshot saves to Desktop automatically
   - Or: File → Save Screen

### Using Physical Device:

1. **Connect iPhone/iPad**
2. **Navigate to screen**
3. **Take screenshot:**
   - iPhone X or later: Side button + Volume Up
   - iPhone 8 or earlier: Home button + Side button
   - iPad: Top button + Volume Up (or Home + Side)
4. **Screenshots save to Photos app**
5. **Transfer to Mac via AirDrop or Photos sync**

## Screenshot Best Practices

### Do:
✅ Use real content (not placeholder text)
✅ Show the app in use (not empty states)
✅ Highlight key features
✅ Use consistent styling
✅ Show different screens/features
✅ Include UI elements that demonstrate functionality
✅ Use high-quality, clear images
✅ Ensure text is readable

### Don't:
❌ Use placeholder or Lorem Ipsum text
❌ Show personal or sensitive information
❌ Include status bar with personal info (use generic)
❌ Use blurry or low-quality images
❌ Show error states or crashes
❌ Include device frames (Apple adds these automatically)
❌ Use copyrighted images without permission

## Editing Screenshots

### Tools:
- **Preview** (macOS built-in)
- **Photoshop** or **GIMP**
- **Sketch** or **Figma**
- **Screenshot editing apps**

### Common Edits:
- Crop to exact dimensions
- Remove personal information
- Adjust brightness/contrast
- Add text overlays (optional, but Apple prefers clean screenshots)
- Ensure consistent styling across all screenshots

## Screenshot Checklist

Before uploading:
- [ ] All screenshots are correct size (exact pixels)
- [ ] At least 3 screenshots per device size
- [ ] Screenshots show different features
- [ ] No personal information visible
- [ ] Text is readable
- [ ] Images are high quality
- [ ] Consistent styling across all screenshots
- [ ] Screenshots demonstrate key features

## Alternative: Screenshot Generation Tools

### Automated Tools:
- **Fastlane Screenshots** - Automates screenshot capture
- **App Store Screenshot Generator** - Online tools
- **Screenshot Builder** - Third-party apps

### Fastlane Setup (Optional):
```ruby
# fastlane/Snapfile
devices([
  "iPhone 14 Pro Max",
  "iPhone 11 Pro Max",
  "iPhone 8 Plus",
  "iPad Pro (12.9-inch) (6th generation)",
  "iPad Pro (11-inch) (4th generation)"
])

languages(["en-US"])

scheme("AITuner4")

clear_previous_screenshots(true)
```

## Uploading Screenshots

1. Go to App Store Connect
2. Select your app
3. Go to "App Store" tab
4. Select version
5. Scroll to "Screenshots"
6. Select device size
7. Upload screenshots (drag and drop or click)
8. Arrange in desired order
9. Repeat for each device size

## Tips

- **Order matters:** First screenshot is most important
- **Update regularly:** Refresh screenshots with new features
- **A/B testing:** Try different screenshots to see what works
- **Localization:** Consider localized screenshots for different markets

---

**Next Steps:**
1. Capture screenshots for each device size
2. Edit and prepare screenshots
3. Upload to App Store Connect
4. Arrange in order of importance

Good luck! 📸
