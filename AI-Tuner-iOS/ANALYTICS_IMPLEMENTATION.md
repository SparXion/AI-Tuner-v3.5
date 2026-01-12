# Analytics Implementation - Step by Step

## ✅ Already Done

1. ✅ `AnalyticsManager.swift` created with all tracking methods
2. ✅ Basic tracking integrated in `AITunerEngine.swift`
3. ✅ App launch tracking added to `AITuner4App.swift`

## 🔄 Next Steps: Add Firebase

### Step 1: Create Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Enter project name: "AI Tuner"
4. Disable Google Analytics (optional, we'll use Firebase Analytics)
5. Click "Create project"

### Step 2: Add iOS App to Firebase (5 minutes)

1. In Firebase Console, click "Add app" → iOS
2. Enter:
   - **Bundle ID:** `com.aituner.AITuner4`
   - **App nickname:** "AI Tuner iOS"
   - **App Store ID:** (leave blank for now)
3. Click "Register app"
4. Download `GoogleService-Info.plist`
5. **Important:** Add `GoogleService-Info.plist` to your Xcode project:
   - Drag file into `AITuner4/Resources/` folder
   - Make sure "Copy items if needed" is checked
   - Add to target: AITuner4

### Step 3: Add Firebase SDK via Swift Package Manager (5 minutes)

**Option A: Using Xcode (Recommended)**
1. Open `AITuner4.xcodeproj` in Xcode
2. File → Add Packages...
3. Enter URL: `https://github.com/firebase/firebase-ios-sdk`
4. Select version: "Up to Next Major Version" → 10.0.0
5. Click "Add Package"
6. Select: **FirebaseAnalytics**
7. Click "Add Package"

**Option B: Using project.yml (Advanced)**
Add to `project.yml`:
```yaml
packages:
  Firebase:
    url: https://github.com/firebase/firebase-ios-sdk
    from: 10.0.0

targets:
  AITuner4:
    dependencies:
      - package: Firebase
        product: FirebaseAnalytics
```
Then run: `xcodegen generate`

### Step 4: Initialize Firebase in App (2 minutes)

Update `AITuner4App.swift`:

```swift
import SwiftUI
import FirebaseCore  // Add this

@main
struct AITuner4App: App {
    init() {
        // Initialize Firebase
        FirebaseApp.configure()
        
        // Track app opened
        AnalyticsManager.shared.trackAppOpened()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### Step 5: Enable Firebase in AnalyticsManager (1 minute)

In `AnalyticsManager.swift`, uncomment the Firebase code:

1. Uncomment: `import FirebaseAnalytics` at the top
2. Uncomment the `extension AnalyticsManager` block at the bottom
3. Remove or comment out the `#if DEBUG print` statements in `logEvent`

The file already has the Firebase code ready - just uncomment it!

### Step 6: Add Remaining Tracking Calls (30 minutes)

Add analytics calls to these locations:

#### In `ContentView.swift`:
- When personality changes: `AnalyticsManager.shared.trackPersonalitySelected(...)`
- When mode switches: `AnalyticsManager.shared.trackModeSwitched(...)`
- When welcome shown: `AnalyticsManager.shared.trackWelcomeViewed()`
- When tutorial completes: `AnalyticsManager.shared.trackTutorialCompleted()`
- When tutorial skipped: `AnalyticsManager.shared.trackTutorialSkipped()`

#### In `PromptPreviewView` (ContentView.swift):
- When prompt copied: `AnalyticsManager.shared.trackPromptCopied(...)`
- When preset saved: `AnalyticsManager.shared.trackPresetSaved(...)`
- When preset loaded: `AnalyticsManager.shared.trackPresetLoaded(...)`
- When preset deleted: `AnalyticsManager.shared.trackPresetDeleted()`

#### In `RadarPopupView.swift`:
- When popup opens: `AnalyticsManager.shared.trackRadarPopupOpened()`
- When popup closes: `AnalyticsManager.shared.trackRadarPopupClosed()`

#### In `RadarChartView.swift`:
- When radar point dragged: `AnalyticsManager.shared.trackRadarChartInteracted(...)`

#### In `WebTunerSectionView.swift`:
- When section toggled: `AnalyticsManager.shared.trackWebTunerSectionToggled(...)`
- When radar toggled: `AnalyticsManager.shared.trackWebTunerRadarToggled(...)`

#### In `WhatIsAITunerView.swift`:
- When expanded: `AnalyticsManager.shared.trackWhatIsAITunerExpanded()`

### Step 7: Test Analytics (10 minutes)

1. **Enable DebugView:**
   - In Xcode: Product → Scheme → Edit Scheme
   - Run → Arguments → Arguments Passed On Launch
   - Add: `-FIRDebugEnabled`

2. **Run app in debug mode**

3. **View real-time events:**
   - Go to Firebase Console → Analytics → DebugView
   - You should see events appear as you use the app

4. **Verify events:**
   - Click on events to see parameters
   - Make sure all data is correct

### Step 8: Update Privacy Policy (10 minutes)

Add to your privacy policy:

```
Analytics
We use Firebase Analytics to understand how users interact with our app. 
This helps us improve features and user experience. 

Data Collected:
- App usage events (which features are used)
- Device information (model, OS version)
- User interactions (button clicks, feature usage)

Data Usage:
- Improve app features and user experience
- Understand which features are most popular
- Identify bugs and issues

Data Storage:
- Data is stored by Google Firebase
- Data is anonymous and cannot identify individual users
- Data is retained according to Firebase's data retention policies

You can opt out by disabling analytics in your device settings.
```

### Step 9: App Store Connect Declaration (5 minutes)

When submitting to App Store:

1. Go to App Store Connect → Your App → App Privacy
2. Click "Get Started" or "Edit"
3. Select "Yes" for data collection
4. Add data type:
   - **Product Interaction** → Analytics
   - **Usage Data** → App Interactions
5. For each:
   - Purpose: Analytics
   - Linked to User: No
   - Used for Tracking: No

## 📊 Viewing Your Analytics

### Real-Time (During Development)
1. Firebase Console → Analytics → DebugView
2. See events as they happen
3. Perfect for testing

### Production Analytics
1. Firebase Console → Analytics → Dashboard
2. View:
   - Active users (daily/weekly/monthly)
   - Top events
   - User engagement
   - Custom reports

### Key Reports to Check
- **Events:** See all tracked events and counts
- **User Properties:** Segment users (e.g., power users)
- **Funnels:** Track user journeys
- **Audiences:** Create user segments

## 🎯 Expected Timeline

- **Setup:** 30 minutes (one-time)
- **Integration:** 1-2 hours (adding all tracking calls)
- **Testing:** 30 minutes
- **Total:** 2-3 hours

## ✅ Checklist

- [ ] Firebase project created
- [ ] iOS app added to Firebase
- [ ] `GoogleService-Info.plist` added to Xcode
- [ ] Firebase SDK added via SPM
- [ ] Firebase initialized in app
- [ ] AnalyticsManager Firebase code enabled
- [ ] All tracking calls added throughout app
- [ ] DebugView tested and working
- [ ] Privacy policy updated
- [ ] App Store Connect privacy declaration ready

---

**You're ready to track!** Once Firebase is set up, analytics will start collecting data automatically. 📊
