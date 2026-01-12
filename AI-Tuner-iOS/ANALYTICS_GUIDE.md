# Analytics Implementation Guide for AI Tuner

## 📊 Overview

This guide covers implementing anonymous user analytics to understand:
- Which features users actually use
- Which levers/presets are most popular
- User behavior patterns
- Feature adoption rates

## 🎯 Best Practices for Analytics

### Industry Standards

**Top Analytics Solutions:**
1. **Firebase Analytics** (Google) - Free, most popular, easy integration
2. **Mixpanel** - Event-focused, great for product analytics
3. **Amplitude** - User behavior analytics, free tier available
4. **App Store Connect Analytics** - Basic, built-in, no code needed

**Recommendation: Firebase Analytics**
- ✅ Free forever
- ✅ Easy iOS integration
- ✅ Real-time dashboard
- ✅ Privacy-compliant (anonymous by default)
- ✅ Industry standard
- ✅ No user tracking IDs needed

## 🔒 Privacy Considerations

### Important Notes:
- **App Store Requirements:** You must declare data collection in App Store Connect
- **Privacy Policy:** Must mention analytics collection
- **GDPR/CCPA:** Consider user consent (though Firebase is anonymous)
- **Best Practice:** Make analytics opt-in or clearly disclosed

### What Firebase Collects:
- Device information (model, OS version)
- App usage events
- User interactions
- **NOT:** Personal info, names, emails (unless you add them)

## 📈 What to Track

### Recommended Events:

#### 1. **Feature Usage**
- `model_selected` - Which AI model users choose
- `persona_selected` - Which personas are popular
- `personality_selected` - Personality type usage
- `mode_switched` - Simple vs Advanced mode usage

#### 2. **Lever Interactions**
- `lever_adjusted` - Which levers users actually tune
- `lever_reset` - Reset button usage
- `radar_chart_interacted` - Radar chart usage

#### 3. **Preset Management**
- `preset_saved` - How often users save presets
- `preset_loaded` - Which presets are reused
- `preset_deleted` - Preset management patterns

#### 4. **User Flow**
- `app_opened` - Daily active users
- `welcome_viewed` - Onboarding completion
- `tutorial_completed` - Tutorial engagement
- `prompt_copied` - Core action completion
- `radar_popup_opened` - Feature discovery

#### 5. **Advanced Features**
- `web_tuner_section_expanded` - Which sections users explore
- `advanced_mode_used` - Power user identification
- `what_is_ai_tuner_expanded` - Help content engagement

## 🛠️ Implementation Strategy

### Event Naming Convention:
- Use snake_case: `model_selected`, `lever_adjusted`
- Be descriptive: `preset_saved` not `save`
- Include context: `radar_chart_interacted` not `clicked`

### Event Parameters:
- Include relevant context:
  - `model_id`: "grok", "chatgpt", etc.
  - `persona_id`: "therapist", "coder", etc.
  - `lever_id`: "creativity", "empathy", etc.
  - `value`: Numeric value (0-10)
  - `mode`: "simple" or "advanced"

## 📊 How to Read/Analyze Data

### Firebase Analytics Dashboard:
1. **Real-time:** See events as they happen
2. **Events:** List of all tracked events
3. **User Properties:** Segment users (e.g., "power_user")
4. **Funnels:** Track user journeys
5. **Audiences:** Create user segments

### Key Metrics to Monitor:
- **Most Used Models:** Which AI models are popular
- **Most Used Levers:** Which tuning parameters matter most
- **Feature Adoption:** % of users using advanced features
- **Retention:** Daily/weekly active users
- **User Flow:** Where users drop off

### Example Insights:
- "80% of users only use Simple Mode"
- "Creativity lever is adjusted 3x more than others"
- "Therapist persona is most popular"
- "Only 10% of users save presets"

## 🚀 Implementation Steps

### Step 1: Add Firebase to Project
1. Install Firebase SDK via Swift Package Manager
2. Add `GoogleService-Info.plist` to project
3. Initialize Firebase in app startup

### Step 2: Create Analytics Manager
- Centralized analytics class
- Easy-to-use methods
- Consistent event naming

### Step 3: Instrument Events
- Add tracking calls throughout app
- Track user interactions
- Include relevant parameters

### Step 4: Test & Verify
- Use Firebase DebugView
- Verify events fire correctly
- Check real-time dashboard

### Step 5: Analyze Data
- Set up custom dashboards
- Create reports
- Monitor key metrics

## 📱 App Store Requirements

### Privacy Declaration:
When submitting to App Store, you'll need to declare:
- **Data Collection:** Yes
- **Data Types:** 
  - Product Interaction (analytics)
  - Usage Data (app interactions)
- **Purpose:** Analytics
- **Linked to User:** No (anonymous)
- **Used for Tracking:** No (if you don't use IDFA)

### Privacy Policy Update:
Add section about analytics:
```
Analytics
We use Firebase Analytics to understand how users interact with our app. 
This helps us improve features and user experience. All data is anonymous 
and cannot be used to identify individual users.
```

## 🎓 Learning Resources

- **Firebase Analytics Docs:** https://firebase.google.com/docs/analytics
- **iOS Analytics Best Practices:** https://developer.apple.com/app-store/app-privacy-details/
- **Privacy Guidelines:** https://developer.apple.com/app-store/review/guidelines/#privacy

---

**Next:** See `ANALYTICS_IMPLEMENTATION.md` for code implementation details.
