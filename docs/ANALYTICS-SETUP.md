# Analytics Setup Guide

## Overview

AI Tuner v4.0 now includes a comprehensive analytics system with:
- **Enhanced localStorage** for immediate, privacy-friendly tracking
- **Plausible Analytics** integration for aggregated insights
- **Admin-only dashboard** for viewing metrics

## Features

### Tracked Events

The following user actions are automatically tracked:

- ✅ **Page visits** - Initial page load with device/browser info
- ✅ **Model selection** - Which AI models users choose
- ✅ **Persona selection** - Which personas are applied
- ✅ **Preset usage** - When presets are saved or loaded
- ✅ **Prompt copying** - Copy-to-clipboard actions
- ✅ **Downloads** - JSON and Markdown downloads
- ✅ **Uploads** - Config file uploads
- ✅ **Personality changes** - Personality selector changes
- ✅ **Tab switches** - Simple vs Advanced mode switches
- ✅ **Setting changes** - Lever adjustments (if implemented)

## Accessing Analytics

### Admin Access

1. **Via URL parameter:**
   ```
   https://your-site.com/index.html?admin=sparxion2025
   ```

2. **Via prompt:**
   - Click the Analytics button (if visible)
   - Enter admin key when prompted: `sparxion2025`

3. **Admin session:**
   - Valid for 24 hours after login
   - Analytics button appears in bottom-right corner

### Viewing Dashboard

1. Access admin mode (see above)
2. Click the **📊 Analytics** button (bottom-right)
3. Dashboard shows:
   - Total events, sessions, visitors
   - Average session duration
   - Top presets and personalities
   - Daily activity trends
   - Download/upload counts

### Exporting Data

From the analytics dashboard:
- **Export JSON** - Full event data in JSON format
- **Export CSV** - Event data in CSV format for spreadsheet analysis

## Plausible Analytics Setup

### Step 1: Create Plausible Account

1. Visit [plausible.io](https://plausible.io)
2. Sign up for an account
3. Add your domain (e.g., `aituner.app` or `sparxion.github.io`)

### Step 2: Update Domain in Code

Edit `index.html` and update the domain:

```html
<!-- Change this line: -->
<script defer data-domain="aituner.app" src="https://plausible.io/js/script.js"></script>

<!-- To your actual domain: -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### Step 3: Verify Installation

1. Visit your site
2. Open browser DevTools → Network tab
3. Look for requests to `plausible.io`
4. Check Plausible dashboard for incoming events

## Custom Events in Plausible

The following custom events are sent to Plausible:

- `model_selected` - When user selects an AI model
- `persona_selected` - When user selects a persona
- `preset_used` - When preset is saved or loaded
- `prompt_copied` - When prompt is copied
- `download` - When config is downloaded
- `upload` - When config is uploaded
- `personality_changed` - When personality selector changes
- `tab_switch` - When switching between Simple/Advanced

## localStorage Storage

### Storage Limits

- **Max events:** 500 events per user
- **Storage key:** `ai_tuner_events`
- **Auto-archiving:** Old events compressed to summaries
- **Quota handling:** Automatic cleanup when storage full

### Data Structure

Each event contains:
```javascript
{
    sessionId: "session_1234567890_abc123",
    userId: "user_1234567890_xyz789",
    timestamp: "2025-01-20T10:30:00.000Z",
    event: "model_selected",
    data: { model: "grok" },
    userAgent: "Mozilla/5.0...",
    url: "https://..."
}
```

## Privacy & Consent

### Consent Dialog

- Shown on first visit
- User can accept or decline
- Preference stored in `localStorage`
- Can be changed anytime

### What's Collected

✅ **Collected:**
- Anonymous usage patterns
- Feature usage statistics
- Configuration preferences
- Device/browser info (anonymized)

❌ **NOT Collected:**
- Personal information
- Generated prompts/content
- User-identifiable data
- IP addresses (via Plausible)

## Admin Key Security

**Current admin key:** `sparxion2025`

### Changing the Admin Key

Edit `analytics.js` and update:
```javascript
const ADMIN_SECRET = 'your-new-secret-key';
```

⚠️ **Security Note:** Change this key before deploying to production!

## Backend Integration (Optional)

To send events to your own backend:

1. Set endpoint in `index.html`:
```javascript
window.AI_TUNER_ANALYTICS_ENDPOINT = 'https://your-api.com/analytics';
```

2. Backend should accept POST requests:
```json
{
    "userId": "user_123",
    "sessionId": "session_456",
    "events": [...]
}
```

## Troubleshooting

### Analytics Not Working

1. **Check consent:** User must accept consent dialog
2. **Check console:** Look for errors in browser console
3. **Check localStorage:** Verify `ai_tuner_events` exists
4. **Check Plausible:** Verify domain is correct

### Dashboard Not Showing

1. **Verify admin access:** Check URL parameter or session
2. **Check button:** Analytics button should appear bottom-right
3. **Check console:** Look for JavaScript errors

### No Data in Dashboard

1. **Wait for events:** Need at least one tracked event
2. **Check localStorage:** Verify events are being stored
3. **Clear cache:** Try clearing browser cache

## Metrics Available

### Summary Metrics

- Total Events
- Unique Sessions
- Unique Visitors (by userId)
- Average Session Duration
- Downloads/Uploads Counts

### Usage Metrics

- Top Presets (by usage count)
- Top Personalities (by selection count)
- Top Models (by selection count)
- Daily Activity (events per day)
- Hourly Activity (events per hour)

### Event Breakdown

- Events by type (model_selected, preset_used, etc.)
- Setting changes by category
- Most popular configurations

## Next Steps

1. ✅ Analytics system is integrated
2. ⏳ Update Plausible domain to your actual domain
3. ⏳ Change admin key to a secure value
4. ⏳ (Optional) Set up backend endpoint for long-term storage
5. ⏳ Monitor analytics dashboard regularly

## Support

For issues or questions:
- Check browser console for errors
- Verify localStorage is enabled
- Ensure Plausible account is active
- Review this documentation

---

**Last Updated:** 2025-01-20
**Version:** 4.0
