/*
 * Copyright 2025 John Violette
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// AI Tuner - Analytics and Usage Tracking

class AITunerAnalytics {
    constructor() {
        this.consentGiven = localStorage.getItem('ai_tuner_analytics_consent') === 'true';
        this.sessionId = this.generateSessionId();
        this.events = [];
        this.init();
    }

    init() {
        if (!this.consentGiven) {
            this.showConsentDialog();
        } else {
            this.trackPageVisit();
        }
    }

    // Track page visits with detailed visitor info
    trackPageVisit() {
        this.track('page_visit', {
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            platform: navigator.platform
        });
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showConsentDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'analytics-consent-dialog';
        dialog.innerHTML = `
            <div class="consent-overlay">
                <div class="consent-dialog">
                    <h3>Help Improve AI Tuner</h3>
                    <p>We'd like to collect anonymous usage data to understand how people use AI Tuner and improve the tool. This helps us:</p>
                    <ul>
                        <li>See which features are most popular</li>
                        <li>Understand how people customize AI responses</li>
                        <li>Improve the user experience</li>
                        <li>Add features people actually want</li>
                    </ul>
                    <p><strong>What we collect:</strong> Anonymous usage patterns, feature usage, and configuration preferences. No personal information, no prompts, no identifiable data.</p>
                    <div class="consent-buttons">
                        <button id="consent-accept" class="btn btn-primary">Yes, help improve AI Tuner</button>
                        <button id="consent-decline" class="btn btn-secondary">No thanks</button>
                    </div>
                    <p class="consent-note">You can change this preference anytime in settings.</p>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        
        document.getElementById('consent-accept').addEventListener('click', () => {
            this.giveConsent(true);
            this.removeDialog();
        });
        
        document.getElementById('consent-decline').addEventListener('click', () => {
            this.giveConsent(false);
            this.removeDialog();
        });
    }

    giveConsent(consent) {
        this.consentGiven = consent;
        localStorage.setItem('ai_tuner_analytics_consent', consent.toString());
        if (consent) {
            this.track('consent_given');
            this.trackPageVisit(); // Track the visit after consent
        }
    }

    removeDialog() {
        const dialog = document.getElementById('analytics-consent-dialog');
        if (dialog) {
            dialog.remove();
        }
    }

    track(eventName, data = {}) {
        if (!this.consentGiven) return;

        const event = {
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            event: eventName,
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.events.push(event);
        this.sendEvent(event);
    }

    sendEvent(event) {
        // Send to your analytics endpoint
        // For now, we'll store locally and you can implement your backend
        try {
            // Store in localStorage for now (you can implement proper backend later)
            const storedEvents = JSON.parse(localStorage.getItem('ai_tuner_events') || '[]');
            storedEvents.push(event);
            localStorage.setItem('ai_tuner_events', JSON.stringify(storedEvents.slice(-100))); // Keep last 100 events
        } catch (error) {
            console.error('Analytics error:', error);
        }
    }

    // Specific tracking methods
    trackPresetUsed(presetName) {
        this.track('preset_used', { preset: presetName });
    }

    trackSettingChanged(category, setting, value) {
        this.track('setting_changed', { 
            category: category, 
            setting: setting, 
            value: value 
        });
    }

    trackPromptGenerated(settings) {
        this.track('prompt_generated', { 
            personality: settings.personality,
            bluntness: settings.bluntness,
            elementElimination: settings.elementElimination,
            sentimentBoost: settings.sentimentBoost
        });
    }

    trackDownload(type) {
        this.track('download', { type: type });
    }

    trackUpload() {
        this.track('upload');
    }

    trackInfoButtonClicked(category) {
        this.track('info_clicked', { category: category });
    }

    // Export data for analysis
    exportData() {
        // Check if user is admin (you)
        const isAdmin = this.checkAdminAccess();
        if (!isAdmin) {
            alert('Analytics access restricted to admin only.');
            return;
        }
        
        const events = JSON.parse(localStorage.getItem('ai_tuner_events') || '[]');
        const dataStr = JSON.stringify(events, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai_tuner_analytics_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Check if current user is admin
    checkAdminAccess() {
        // Check URL parameter for admin key
        const urlParams = new URLSearchParams(window.location.search);
        const urlKey = urlParams.get('admin');
        
        // Check localStorage for persistent admin session
        const storedKey = localStorage.getItem('ai_tuner_admin_key');
        const sessionKey = localStorage.getItem('ai_tuner_admin_session');
        
        // Admin secret key (change this to your preferred key)
        const ADMIN_SECRET = 'sparxion2025';
        
        // Check if admin key matches from URL
        if (urlKey === ADMIN_SECRET) {
            // Store admin session (valid for 24 hours)
            localStorage.setItem('ai_tuner_admin_session', Date.now().toString());
            return true;
        }
        
        // Check if admin session is still valid (24 hours)
        if (sessionKey) {
            const sessionTime = parseInt(sessionKey);
            const hoursSinceLogin = (Date.now() - sessionTime) / (1000 * 60 * 60);
            if (hoursSinceLogin < 24) {
                return true;
            } else {
                // Session expired, clear it
                localStorage.removeItem('ai_tuner_admin_session');
            }
        }
        
        // If neither URL param nor valid session, prompt for key
        const adminKey = prompt('Enter admin key to access analytics:');
        if (adminKey === ADMIN_SECRET) {
            localStorage.setItem('ai_tuner_admin_session', Date.now().toString());
            return true;
        }
        
        return false;
    }
    
    // Check if admin UI should be visible
    isAdminMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlKey = urlParams.get('admin');
        const sessionKey = localStorage.getItem('ai_tuner_admin_session');
        
        const ADMIN_SECRET = 'sparxion2025';
        
        // Check URL parameter
        if (urlKey === ADMIN_SECRET) {
            localStorage.setItem('ai_tuner_admin_session', Date.now().toString());
            return true;
        }
        
        // Check if admin session is valid (24 hours)
        if (sessionKey) {
            const sessionTime = parseInt(sessionKey);
            const hoursSinceLogin = (Date.now() - sessionTime) / (1000 * 60 * 60);
            if (hoursSinceLogin < 24) {
                return true;
            } else {
                localStorage.removeItem('ai_tuner_admin_session');
            }
        }
        
        return false;
    }

    // Get analytics summary with enhanced stats
    getSummary() {
        const events = JSON.parse(localStorage.getItem('ai_tuner_events') || '[]');
        
        if (events.length === 0) {
            return {
                totalEvents: 0,
                uniqueSessions: 0,
                totalVisitors: 0,
                presetUsage: {},
                settingChanges: {},
                downloads: 0,
                uploads: 0,
                dailyActivity: {},
                hourlyActivity: {},
                topPersonalities: {},
                topSettings: {},
                averageSessionDuration: 0,
                eventsByType: {}
            };
        }
        
        const summary = {
            totalEvents: events.length,
            uniqueSessions: new Set(events.map(e => e.sessionId)).size,
            uniqueVisitors: new Set(events.map(e => e.userAgent)).size,
            presetUsage: {},
            settingChanges: {},
            downloads: 0,
            uploads: 0,
            dailyActivity: {},
            hourlyActivity: {},
            topPersonalities: {},
            topSettings: {},
            eventsByType: {},
            sessionDurations: []
        };
        
        // Track session start/end times
        const sessionTimestamps = {};
        
        events.forEach(event => {
            // Track event types
            summary.eventsByType[event.event] = (summary.eventsByType[event.event] || 0) + 1;
            
            // Track daily activity
            const date = event.timestamp.split('T')[0];
            summary.dailyActivity[date] = (summary.dailyActivity[date] || 0) + 1;
            
            // Track hourly activity
            const hour = new Date(event.timestamp).getHours();
            summary.hourlyActivity[hour] = (summary.hourlyActivity[hour] || 0) + 1;
            
            // Track session timestamps
            if (!sessionTimestamps[event.sessionId]) {
                sessionTimestamps[event.sessionId] = { start: event.timestamp, end: event.timestamp };
            } else {
                if (new Date(event.timestamp) < new Date(sessionTimestamps[event.sessionId].start)) {
                    sessionTimestamps[event.sessionId].start = event.timestamp;
                }
                if (new Date(event.timestamp) > new Date(sessionTimestamps[event.sessionId].end)) {
                    sessionTimestamps[event.sessionId].end = event.timestamp;
                }
            }
            
            switch (event.event) {
                case 'preset_used':
                    summary.presetUsage[event.data.preset] = (summary.presetUsage[event.data.preset] || 0) + 1;
                    break;
                case 'setting_changed':
                    const key = `${event.data.category}.${event.data.setting}`;
                    summary.settingChanges[key] = (summary.settingChanges[key] || 0) + 1;
                    
                    // Track most popular settings
                    if (event.data.setting === 'personality') {
                        summary.topPersonalities[event.data.value] = (summary.topPersonalities[event.data.value] || 0) + 1;
                    }
                    break;
                case 'download':
                    summary.downloads++;
                    break;
                case 'upload':
                    summary.uploads++;
                    break;
                case 'prompt_generated':
                    // Track personality usage from prompts
                    if (event.data.personality) {
                        summary.topPersonalities[event.data.personality] = (summary.topPersonalities[event.data.personality] || 0) + 1;
                    }
                    break;
            }
        });
        
        // Calculate average session duration
        Object.values(sessionTimestamps).forEach(session => {
            const duration = (new Date(session.end) - new Date(session.start)) / 1000 / 60; // minutes
            summary.sessionDurations.push(duration);
        });
        
        if (summary.sessionDurations.length > 0) {
            summary.averageSessionDuration = Math.round(
                summary.sessionDurations.reduce((a, b) => a + b, 0) / summary.sessionDurations.length
            );
        }
        
        // Sort top personalities and settings
        summary.topPersonalities = Object.fromEntries(
            Object.entries(summary.topPersonalities)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
        );
        
        summary.topSettings = Object.fromEntries(
            Object.entries(summary.settingChanges)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
        );
        
        return summary;
    }
    
    // Export data as CSV
    exportCSV() {
        const isAdmin = this.checkAdminAccess();
        if (!isAdmin) {
            alert('Analytics access restricted to admin only.');
            return;
        }
        
        const events = JSON.parse(localStorage.getItem('ai_tuner_events') || '[]');
        if (events.length === 0) {
            alert('No analytics data to export.');
            return;
        }
        
        // Convert events to CSV
        const headers = ['Timestamp', 'Session ID', 'Event', 'Category', 'Setting', 'Value', 'URL', 'User Agent'];
        const rows = events.map(event => {
            return [
                event.timestamp,
                event.sessionId,
                event.event,
                event.data?.category || '',
                event.data?.setting || '',
                event.data?.value || event.data?.preset || event.data?.type || '',
                event.url || '',
                event.userAgent || ''
            ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
        });
        
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai_tuner_analytics_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize analytics
window.aiTunerAnalytics = new AITunerAnalytics();
