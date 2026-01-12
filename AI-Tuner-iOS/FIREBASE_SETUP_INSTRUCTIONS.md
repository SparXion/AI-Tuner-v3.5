# Firebase Setup Instructions

## ✅ Code Changes Complete!

I've added Firebase to your project. Here's what was done:

1. ✅ Added Firebase package to `project.yml`
2. ✅ Updated `AITuner4App.swift` to initialize Firebase
3. ✅ Enabled Firebase Analytics in `AnalyticsManager.swift`
4. ✅ Regenerated Xcode project

## 🔄 Next Steps: Firebase Console Setup

You still need to create the Firebase project and add the configuration file:

### Step 1: Create Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com
2. Click "Add project" or "Create a project"
3. Enter project name: **AI Tuner**
4. (Optional) Disable Google Analytics for Firebase (you can enable later)
5. Click "Create project"
6. Wait for project to be created

### Step 2: Add iOS App to Firebase (5 minutes)

1. In Firebase Console, click the iOS icon (or "Add app")
2. Enter:
   - **Bundle ID:** `com.aituner.AITuner4`
   - **App nickname:** AI Tuner iOS
   - **App Store ID:** (leave blank for now)
3. Click "Register app"

### Step 3: Download Configuration File (2 minutes)

1. Download `GoogleService-Info.plist`
2. **Important:** Add this file to your Xcode project:
   - Open `AITuner4.xcodeproj` in Xcode
   - Drag `GoogleService-Info.plist` into the `AITuner4/Resources/` folder
   - Make sure "Copy items if needed" is checked ✅
   - Make sure "AITuner4" target is selected ✅
   - Click "Finish"

### Step 4: Verify Setup (2 minutes)

1. Open Xcode project
2. Build the project (Cmd+B)
3. If it builds successfully, Firebase is configured! ✅
4. Run the app - analytics will start tracking automatically

## 🧪 Testing Analytics

### Enable DebugView (for testing):

1. In Xcode: Product → Scheme → Edit Scheme
2. Select "Run" on the left
3. Go to "Arguments" tab
4. Under "Arguments Passed On Launch", add:
   ```
   -FIRDebugEnabled
   ```
5. Click "Close"

### View Real-Time Events:

1. Run your app in Xcode (with DebugView enabled)
2. Go to Firebase Console → Analytics → DebugView
3. You should see events appearing in real-time as you use the app!

## 📊 What's Being Tracked

Once Firebase is configured, these events will be tracked automatically:

- ✅ `app_opened` - When app launches
- ✅ `model_selected` - When user picks an AI model
- ✅ `persona_selected` - When user picks a persona
- ✅ `lever_adjusted` - When user adjusts any lever

(More events will be added as you integrate tracking calls throughout the app)

## 🔒 Privacy Note

Firebase Analytics is:
- ✅ Anonymous (no user IDs)
- ✅ Compliant with App Store guidelines
- ✅ No personal data collected

You'll need to declare analytics in App Store Connect when submitting.

## 🚨 Troubleshooting

### Build Error: "No such module 'FirebaseCore'"
- Make sure you've run `xcodegen generate` after updating project.yml
- Try cleaning build folder: Product → Clean Build Folder (Shift+Cmd+K)
- Make sure Firebase package is resolved in Xcode

### Analytics Not Working
- Make sure `GoogleService-Info.plist` is added to the project
- Check that it's included in the target (select file, check Target Membership)
- Verify Firebase is initialized in `AITuner4App.swift`

### Can't See Events in DebugView
- Make sure DebugView is enabled (see "Testing Analytics" above)
- Check that you're running in debug mode (not release)
- Wait a few seconds - events can take a moment to appear

## 📚 Resources

- Firebase Console: https://console.firebase.google.com
- Firebase Analytics Docs: https://firebase.google.com/docs/analytics
- iOS Setup Guide: https://firebase.google.com/docs/ios/setup

---

**Once you add `GoogleService-Info.plist`, you're all set!** 🎉
