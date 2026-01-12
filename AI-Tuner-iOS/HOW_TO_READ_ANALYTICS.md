# How to Read and Use Analytics Data

## 📊 Understanding Your Analytics Dashboard

### Firebase Analytics Dashboard Overview

When you log into Firebase Console (https://console.firebase.google.com), you'll see:

#### 1. **Overview Tab**
- **Active Users:** Daily/Weekly/Monthly active users
- **Events:** Total events tracked
- **Top Events:** Most common user actions
- **User Engagement:** Session duration, screens per session

#### 2. **Events Tab**
- **All Events:** Complete list of tracked events
- **Event Details:** Click any event to see:
  - Count (how many times it happened)
  - Parameters (what data was sent)
  - User breakdown (who triggered it)

#### 3. **User Properties Tab**
- **Custom Properties:** User segments (e.g., "power_user")
- **Create Audiences:** Group users by behavior
- **Example:** "Users who used Advanced Mode"

#### 4. **Funnels Tab**
- **Create Funnels:** Track user journeys
- **Example Funnel:**
  1. App Opened
  2. Model Selected
  3. Lever Adjusted
  4. Prompt Copied

## 🔍 Key Metrics to Monitor

### Feature Usage Metrics

#### Most Popular Models
**Question:** Which AI models do users prefer?
**How to Find:**
1. Go to Events → `model_selected`
2. View parameters → `model_id`
3. See breakdown: "grok" (45%), "chatgpt" (30%), "claude" (25%)

**Insight:** "Grok is most popular, consider featuring it first"

#### Most Used Levers
**Question:** Which tuning parameters matter most?
**How to Find:**
1. Go to Events → `lever_adjusted`
2. View parameters → `lever_id`
3. Sort by count
4. See: "creativity" (500), "empathy" (300), "conciseness" (200)

**Insight:** "Users care most about creativity, make it prominent"

#### Persona Popularity
**Question:** Which personas are most useful?
**How to Find:**
1. Go to Events → `persona_selected`
2. View parameters → `persona_id`
3. See breakdown: "therapist" (40%), "coder" (30%), "researcher" (20%)

**Insight:** "Therapist persona is most popular, consider adding more therapy-focused features"

### User Behavior Patterns

#### Simple vs Advanced Mode Usage
**Question:** Do users need advanced features?
**How to Find:**
1. Go to Events → `mode_switched`
2. View parameters → `mode`
3. Compare: "simple" (80%) vs "advanced" (20%)

**Insight:** "Most users stay in Simple Mode, Advanced Mode might be too complex"

#### Feature Discovery
**Question:** Do users find the radar chart?
**How to Find:**
1. Go to Events → `radar_popup_opened`
2. Compare to `app_opened`
3. Calculate: 30% of users opened radar popup

**Insight:** "70% of users haven't discovered radar chart, consider making it more visible"

#### Tutorial Completion
**Question:** Is the tutorial helpful?
**How to Find:**
1. Go to Events → `tutorial_completed`
2. Compare to `tutorial_skipped`
3. See: 60% completed, 40% skipped

**Insight:** "Tutorial is helpful, but 40% skip it - consider making it shorter"

### User Engagement Metrics

#### Daily Active Users (DAU)
**Question:** How many people use the app daily?
**How to Find:**
1. Go to Overview → Active Users
2. Select "Daily"
3. See trend over time

**Insight:** "DAU is growing, app is gaining traction"

#### Session Duration
**Question:** How long do users spend in the app?
**How to Find:**
1. Go to Overview → User Engagement
2. View "Average session duration"
3. See: 5 minutes average

**Insight:** "Users spend 5 minutes per session, app is engaging"

#### Actions Per Session
**Question:** How many things do users do per session?
**How to Find:**
1. Go to Overview → User Engagement
2. View "Screens per session"
3. See: 8 screens average

**Insight:** "Users explore multiple features, app has good engagement"

## 📈 Creating Custom Reports

### Example Report: "Power User Analysis"

**Goal:** Identify users who use advanced features

**Steps:**
1. Go to User Properties
2. Create property: `is_power_user` = true
3. Filter events by this property
4. See: Power users use Advanced Mode 5x more

**Action:** Create "Power User" badge or special features

### Example Report: "Feature Adoption Funnel"

**Goal:** Track how users discover and use features

**Funnel:**
1. App Opened (100%)
2. Model Selected (80%)
3. Lever Adjusted (60%)
4. Radar Popup Opened (30%)
5. Preset Saved (10%)

**Insight:** "Only 10% save presets, consider making it easier or more valuable"

## 🎯 Actionable Insights Examples

### Insight 1: "Creativity Lever is Most Popular"
**Data:** `lever_adjusted` shows "creativity" is adjusted 3x more than others
**Action:** 
- Make creativity lever more prominent
- Add creativity presets
- Feature creativity in marketing

### Insight 2: "Radar Chart is Underused"
**Data:** Only 30% of users open radar popup
**Action:**
- Make radar chart more visible
- Add tutorial step about radar
- Show radar chart by default

### Insight 3: "Therapist Persona is Most Popular"
**Data:** Therapist persona selected 40% of the time
**Action:**
- Add more therapy-focused personas
- Create therapy preset pack
- Feature therapist persona in app store screenshots

### Insight 4: "Users Don't Save Presets"
**Data:** Only 10% of users save presets
**Action:**
- Make preset saving more prominent
- Add preset sharing feature
- Show preset benefits in tutorial

## 📊 Exporting Data

### Export to CSV/Excel

1. Go to Events tab
2. Select event
3. Click "Export" (if available)
4. Or use Firebase API to export programmatically

### Custom Analysis

Use Firebase BigQuery integration:
1. Enable BigQuery export in Firebase
2. Query SQL database
3. Create custom reports
4. Build dashboards

## 🔔 Setting Up Alerts

### Alert: "Feature Usage Drop"
**Trigger:** When `prompt_copied` drops below threshold
**Action:** Investigate why users aren't completing core action

### Alert: "Error Spike"
**Trigger:** When `error_occurred` spikes
**Action:** Check for bugs or issues

## 📱 Real-Time Monitoring

### DebugView (During Development)

1. Enable DebugView in Firebase
2. Run app in debug mode
3. See events in real-time
4. Verify tracking works correctly

### Real-Time Dashboard

1. Go to Analytics → Real-time
2. See events as they happen
3. Monitor during app launches
4. Track feature releases

## 🎓 Learning Resources

- **Firebase Analytics Docs:** https://firebase.google.com/docs/analytics
- **Analytics Academy:** https://analytics.google.com/analytics/academy/
- **Firebase YouTube Channel:** Firebase Analytics tutorials

## 💡 Pro Tips

1. **Start Simple:** Track basic events first, add complexity later
2. **Focus on Actions:** Track what users DO, not just what they see
3. **Compare Over Time:** Look for trends, not just snapshots
4. **Segment Users:** Compare power users vs casual users
5. **Test Changes:** Use analytics to measure impact of UI changes
6. **Privacy First:** Always respect user privacy, make analytics opt-in if needed

---

**Remember:** Analytics is about understanding users, not tracking individuals. Use data to improve the app experience!
