# App Store Submission Guide for AI Tuner v4.0

## 📋 Pre-Submission Checklist

### 1. App Store Connect Setup
- [ ] Create Apple Developer account ($99/year)
- [ ] Enroll in App Store Connect
- [ ] Create new app listing in App Store Connect
- [ ] Set up Bundle ID: `com.aituner.AITuner4`
- [ ] Configure app information

### 2. Required Assets

#### App Icons (Required)
You need app icons in these sizes:
- **1024x1024** (App Store icon - required)
- **180x180** (iPhone 60pt @3x)
- **120x120** (iPhone 60pt @2x)
- **167x167** (iPad Pro 83.5pt @2x)
- **152x152** (iPad 76pt @2x)
- **76x76** (iPad 76pt @1x)

**Location:** `AITuner4/Resources/Assets.xcassets/AppIcon.appiconset/`

#### Screenshots (Required)
You need screenshots for:
- **iPhone 6.7"** (1290 x 2796 pixels) - iPhone 14 Pro Max, 15 Pro Max
- **iPhone 6.5"** (1284 x 2778 pixels) - iPhone 11 Pro Max, XS Max
- **iPhone 5.5"** (1242 x 2208 pixels) - iPhone 8 Plus
- **iPad Pro 12.9"** (2048 x 2732 pixels)
- **iPad Pro 11"** (1668 x 2388 pixels)

**Minimum:** 3 screenshots per device size
**Maximum:** 10 screenshots per device size

### 3. App Information

#### App Name
**AI Tuner**

#### Subtitle (30 characters max)
**Customize AI Behavior**

#### Description (4000 characters max)
```
AI Tuner removes the mystery from every chatbot.

No more guessing why an AI answers the way it does. No more fighting hidden defaults. With one tap you see exactly how the AI is wired — and with one drag you change it.

HOW IT WORKS

1. Pick any AI
Choose from Grok, ChatGPT, Claude, Gemini, Perplexity, Mistral, or Llama. Each model has its own default personality.

2. See inside its mind
A live radar chart instantly shows the AI's current personality — empathy, bluntness, creativity, speed, truth-focus… everything.

3. Tune it your way
• New users: Tap a persona (Therapist, Coder, Researcher, Friend…) and the AI changes instantly.
• Power users: Drag any of the 26 axes on the radar chart for total control.
• Everyone: Watch the radar spin and the prompt update in real time.

KEY FEATURES

✓ Takes the black box out of AI — every behavior is visible and movable
✓ Works on every major model (no API keys needed)
✓ 26 precision levers + one-tap personas
✓ Beginner mode (8 big picture axes) → Advanced mode (full 26-axis web)
✓ Save and share your presets
✓ Copy-paste prompt to use with any AI assistant

Whether you're four years old or fifty years in tech, AI Tuner makes every chatbot feel like it was built just for you.

Try it now – no signup, no mystery.
```

#### Keywords (100 characters max)
```
AI,chatbot,personality,customize,prompt,Claude,GPT,Grok,Gemini,tuning,assistant
```

#### Support URL
Your website URL (required)

#### Marketing URL (Optional)
Your marketing website URL

#### Privacy Policy URL (Required)
You must provide a privacy policy URL

### 4. App Store Categories

**Primary Category:** Productivity
**Secondary Category:** Utilities

### 5. Age Rating

**Content Rating:** 4+ (All Ages)
- No objectionable content
- No violence, profanity, or mature themes

### 6. Pricing and Availability

- **Price:** Free
- **Availability:** All countries (or select specific countries)

### 7. Version Information

- **Version:** 1.0.0
- **Build:** 1 (increment for each submission)

### 8. App Privacy Details

You'll need to answer questions about:
- Data collection (if any)
- Data usage
- Tracking (if any)

**For AI Tuner:** Likely "No data collected" since it's a local app that generates prompts.

### 9. Required Legal Documents

#### Privacy Policy (Required)
Must be accessible via URL. Should cover:
- What data is collected (if any)
- How data is used
- Data storage and security
- User rights

**Template Privacy Policy:**
```
AI Tuner Privacy Policy

Last Updated: [Date]

AI Tuner ("we", "our", or "us") is committed to protecting your privacy.

Data Collection
AI Tuner does not collect, store, or transmit any personal data. All settings, presets, and prompts are stored locally on your device.

Local Storage
The app uses local storage (UserDefaults) to save your preferences and presets. This data never leaves your device.

Third-Party Services
AI Tuner does not use any third-party analytics, advertising, or tracking services.

Changes to This Policy
We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.

Contact Us
If you have questions about this privacy policy, please contact us at [your email].
```

### 10. Build Configuration

#### Check These Settings:
- [ ] Bundle Identifier: `com.aituner.AITuner4`
- [ ] Version: 1.0.0
- [ ] Build: 1
- [ ] Deployment Target: iOS 15.0
- [ ] Signing: Automatic or Manual (requires certificates)
- [ ] Capabilities: None required (no special permissions needed)

### 11. Testing Requirements

Before submission:
- [ ] Test on physical devices (iPhone and iPad)
- [ ] Test all features work correctly
- [ ] Test on different iOS versions (15.0+)
- [ ] Test in different orientations
- [ ] Test with VoiceOver enabled
- [ ] Test with different screen sizes
- [ ] Verify no crashes or memory leaks

### 12. App Store Connect Steps

1. **Create App Record**
   - Go to App Store Connect
   - Click "+" to create new app
   - Fill in app information
   - Select Bundle ID

2. **Upload Build**
   - Archive your app in Xcode
   - Upload to App Store Connect via Xcode or Transporter
   - Wait for processing (can take 30-60 minutes)

3. **Complete App Information**
   - Add screenshots
   - Write description
   - Add keywords
   - Set categories
   - Add privacy policy URL

4. **Submit for Review**
   - Answer export compliance questions
   - Submit for review
   - Wait for review (typically 24-48 hours)

## 📱 Screenshot Guidelines

### What to Capture:
1. **Simple Mode** - Show model selection, sliders, and prompt
2. **Advanced Mode** - Show web tuner sections
3. **Radar Chart** - Show interactive radar visualization
4. **Personas** - Show persona selection
5. **Tutorial** - Show tutorial interface

### Tips:
- Use real content (not placeholder text)
- Show the app in use
- Highlight key features
- Use consistent styling
- Remove any personal/sensitive information

## 🔐 Signing & Certificates

### Automatic Signing (Recommended)
1. In Xcode: Project → Signing & Capabilities
2. Enable "Automatically manage signing"
3. Select your Team
4. Xcode will handle certificates automatically

### Manual Signing
1. Create App ID in Apple Developer Portal
2. Create Distribution Certificate
3. Create Provisioning Profile
4. Configure in Xcode

## 📝 App Store Review Guidelines

Ensure your app complies with:
- **Guideline 1.1** - Safety (no harmful content)
- **Guideline 2.1** - Performance (no crashes)
- **Guideline 2.3** - Metadata (accurate description)
- **Guideline 4.0** - Design (follows iOS design guidelines)
- **Guideline 5.1.1** - Privacy (privacy policy required)

## 🚀 Submission Steps Summary

1. ✅ Complete app development
2. ✅ Create App Store Connect listing
3. ✅ Prepare screenshots and app icon
4. ✅ Write app description and metadata
5. ✅ Create privacy policy
6. ✅ Archive and upload build
7. ✅ Complete app information in App Store Connect
8. ✅ Submit for review
9. ✅ Wait for approval
10. ✅ Release!

## 📞 Support

For questions about:
- **App Store Connect:** https://developer.apple.com/support/app-store-connect/
- **Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Technical Issues:** Check Xcode console and App Store Connect messages

---

**Next Steps:**
1. Create Apple Developer account (if you don't have one)
2. Set up App Store Connect
3. Prepare screenshots
4. Create privacy policy page
5. Archive and upload your first build

Good luck with your submission! 🎉
