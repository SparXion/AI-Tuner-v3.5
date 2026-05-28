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

// AI Tuner v4.0 - Enhanced Analytics and Usage Tracking
// Features: Improved localStorage management, Plausible integration, Admin dashboard

class AITunerAnalytics {
    constructor() {
        this.consentGiven = localStorage.getItem('ai_tuner_analytics_consent') === 'true';
        this.sessionId = this.generateSessionId();
        this.userId = this.getOrCreateUserId();
        this.events = [];
        this.maxLocalStorageEvents = 500; // Increased from 100
        this.storageKeys = {
            events: 'ai_tuner_events',
            summary: 'ai_tuner_summary',
            userId: 'ai_tuner_user_id',
            lastSync: 'ai_tuner_last_sync',
            archived: 'ai_tuner_archived'
        };
        this.analyticsProvider = this.detectAnalyticsProvider();
        this.sessionStartTime = Date.now();
        this.init();
    }

    init() {
        if (!this.consentGiven) {
            this.showConsentDialog();
        } else {
            this.trackPageVisit();
        }
        
        // Check for admin mode on load
        if (this.isAdminMode()) {
            this.showAdminButton();
        }
    }

    // Detect which analytics provider is available
    detectAnalyticsProvider() {
        if (window.plausible) return 'plausible';
        if (typeof gtag !== 'undefined') return 'ga4';
        if (window.fathom) return 'fathom';
        return 'localStorage-only';
    }

    // Generate persistent user ID (survives sessions)
    getOrCreateUserId() {
        let userId = localStorage.getItem(this.storageKeys.userId);
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(this.storageKeys.userId, userId);
        }
        return userId;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
            platform: navigator.platform,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });
    }

    showConsentDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'analytics-consent-dialog';
        dialog.innerHTML = `
            <div class="consent-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div class="consent-dialog" style="background: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                    <h3 style="margin-top: 0;">Help Improve AI Tuner</h3>
                    <p>We'd like to collect anonymous usage data to understand how people use AI Tuner and improve the tool. This helps us:</p>
                    <ul>
                        <li>See which features are most popular</li>
                        <li>Understand how people customize AI responses</li>
                        <li>Improve the user experience</li>
                        <li>Add features people actually want</li>
                    </ul>
                    <p><strong>What we collect:</strong> Anonymous usage patterns, feature usage, and configuration preferences. No personal information, no prompts, no identifiable data.</p>
                    <div class="consent-buttons" style="display: flex; gap: 10px; margin-top: 20px;">
                        <button id="consent-accept" class="btn btn-primary" style="flex: 1; padding: 10px 20px; border: none; background: #000; color: #fff; cursor: pointer; border-radius: 4px;">Yes, help improve AI Tuner</button>
                        <button id="consent-decline" class="btn btn-secondary" style="flex: 1; padding: 10px 20px; border: 1px solid #000; background: #fff; color: #000; cursor: pointer; border-radius: 4px;">No thanks</button>
                    </div>
                    <p class="consent-note" style="font-size: 0.85em; color: #666; margin-top: 15px; margin-bottom: 0;">You can change this preference anytime in settings.</p>
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
            this.trackPageVisit();
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
            userId: this.userId,
            timestamp: new Date().toISOString(),
            event: eventName,
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.events.push(event);
        this.sendEvent(event);
        this.sendToAnalyticsService(eventName, data);
    }

    // Send to analytics service (Plausible, GA4, etc.)
    sendToAnalyticsService(eventName, data) {
        switch (this.analyticsProvider) {
            case 'plausible':
                if (window.plausible) {
                    window.plausible(eventName, { props: data });
                }
                break;
            case 'ga4':
                if (typeof gtag !== 'undefined') {
                    gtag('event', eventName, {
                        ...data,
                        event_category: 'AI Tuner'
                    });
                }
                break;
            case 'fathom':
                if (window.fathom && window.fathom.trackEvent) {
                    window.fathom.trackEvent(eventName, data);
                }
                break;
        }
    }

    // Improved storage with compression and batching
    sendEvent(event) {
        if (!this.consentGiven) return;

        try {
            const storedEvents = this.getStoredEvents();
            storedEvents.push(event);
            
            // Smart storage management
            if (storedEvents.length > this.maxLocalStorageEvents) {
                const recentEvents = storedEvents.slice(-this.maxLocalStorageEvents);
                const archivedEvents = storedEvents.slice(0, -this.maxLocalStorageEvents);
                
                this.setStoredEvents(recentEvents);
                
                // Try to send archived events to backend (if available)
                this.sendToBackend(archivedEvents).catch(() => {
                    this.archiveOldEvents(archivedEvents);
                });
            } else {
                this.setStoredEvents(storedEvents);
            }

            // Update summary cache periodically (every 10 events)
            if (storedEvents.length % 10 === 0) {
                this.updateSummaryCache();
            }
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.warn('localStorage quota exceeded, archiving old events');
                this.handleQuotaExceeded();
            } else {
                console.error('Analytics error:', error);
            }
        }
    }

    // Get events with error handling
    getStoredEvents() {
        try {
            const data = localStorage.getItem(this.storageKeys.events);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading events:', error);
            return [];
        }
    }

    // Set events with size checking
    setStoredEvents(events) {
        try {
            const data = JSON.stringify(events);
            // Check size (localStorage limit ~5-10MB)
            if (data.length > 4 * 1024 * 1024) { // 4MB safety limit
                throw new Error('Data too large');
            }
            localStorage.setItem(this.storageKeys.events, data);
        } catch (error) {
            if (error.name === 'QuotaExceededError' || error.message === 'Data too large') {
                const recent = events.slice(-Math.floor(this.maxLocalStorageEvents / 2));
                localStorage.setItem(this.storageKeys.events, JSON.stringify(recent));
            } else {
                throw error;
            }
        }
    }

    // Archive old events (compress to summary)
    archiveOldEvents(events) {
        const summary = this.compressEventsToSummary(events);
        const archived = JSON.parse(localStorage.getItem(this.storageKeys.archived) || '[]');
        archived.push(summary);
        // Keep only last 10 archived summaries
        localStorage.setItem(this.storageKeys.archived, JSON.stringify(archived.slice(-10)));
    }

    // Compress events to summary format
    compressEventsToSummary(events) {
        const summary = {
            date: new Date().toISOString().split('T')[0],
            totalEvents: events.length,
            eventTypes: {},
            presetUsage: {},
            topPersonalities: {}
        };

        events.forEach(event => {
            summary.eventTypes[event.event] = (summary.eventTypes[event.event] || 0) + 1;
            if (event.event === 'preset_used') {
                const preset = event.data?.preset;
                if (preset) {
                    summary.presetUsage[preset] = (summary.presetUsage[preset] || 0) + 1;
                }
            }
        });

        return summary;
    }

    // Handle quota exceeded
    handleQuotaExceeded() {
        const events = this.getStoredEvents();
        const recent = events.slice(-100);
        this.setStoredEvents(recent);
        this.archiveOldEvents(events.slice(0, -100));
    }

    // Update summary cache for faster access
    updateSummaryCache() {
        try {
            const summary = this.getSummary();
            localStorage.setItem(this.storageKeys.summary, JSON.stringify(summary));
        } catch (error) {
            // Summary cache is optional, don't fail if it can't be stored
        }
    }

    // Send to backend (optional - implement your endpoint)
    async sendToBackend(events) {
        if (!window.AI_TUNER_ANALYTICS_ENDPOINT) {
            return Promise.resolve();
        }

        try {
            const response = await fetch(window.AI_TUNER_ANALYTICS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.userId,
                    sessionId: this.sessionId,
                    events: events
                })
            });

            if (response.ok) {
                localStorage.setItem(this.storageKeys.lastSync, Date.now().toString());
            }
        } catch (error) {
            console.warn('Backend sync failed:', error);
            throw error;
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

    // New tracking methods for v4.0 features
    trackTabSwitch(tab) {
        this.track('tab_switch', { tab: tab });
    }

    trackModelSelected(model) {
        this.track('model_selected', { model: model });
    }

    trackPersonaSelected(persona) {
        this.track('persona_selected', { persona: persona });
    }

    trackCopyPrompt() {
        this.track('prompt_copied');
    }

    trackRadarInteraction(tuner, axis, value) {
        this.track('radar_interaction', {
            tuner: tuner,
            axis: axis,
            value: value
        });
    }

    trackTimeToFirstPrompt(seconds) {
        this.track('time_to_first_prompt', { seconds: seconds });
    }

    trackPersonalityChanged(personality) {
        this.track('personality_changed', { personality: personality });
    }

    trackLeverChanged(leverKey, value) {
        this.track('lever_changed', { lever: leverKey, value: value });
    }

    // Admin access methods
    checkAdminAccess() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlKey = urlParams.get('admin');
        const sessionKey = localStorage.getItem('ai_tuner_admin_session');
        
        const ADMIN_SECRET = 'sparxion2025';
        
        if (urlKey === ADMIN_SECRET) {
            localStorage.setItem('ai_tuner_admin_session', Date.now().toString());
            return true;
        }
        
        if (sessionKey) {
            const sessionTime = parseInt(sessionKey);
            const hoursSinceLogin = (Date.now() - sessionTime) / (1000 * 60 * 60);
            if (hoursSinceLogin < 24) {
                return true;
            } else {
                localStorage.removeItem('ai_tuner_admin_session');
            }
        }
        
        const adminKey = prompt('Enter admin key to access analytics:');
        if (adminKey === ADMIN_SECRET) {
            localStorage.setItem('ai_tuner_admin_session', Date.now().toString());
            return true;
        }
        
        return false;
    }
    
    isAdminMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlKey = urlParams.get('admin');
        const sessionKey = localStorage.getItem('ai_tuner_admin_session');
        
        const ADMIN_SECRET = 'sparxion2025';
        
        if (urlKey === ADMIN_SECRET) {
            localStorage.setItem('ai_tuner_admin_session', Date.now().toString());
            return true;
        }
        
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

    showAdminButton() {
        let btn = document.getElementById('analytics-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'analytics-btn';
            btn.className = 'btn btn-secondary';
            btn.innerHTML = '📊 Analytics';
            btn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 1000; padding: 10px 20px; border: 1px solid #000; background: #fff; color: #000; cursor: pointer; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);';
            btn.addEventListener('click', () => this.toggleAnalyticsDashboard());
            document.body.appendChild(btn);
        }
        btn.style.display = 'block';
    }

    toggleAnalyticsDashboard() {
        if (!this.checkAdminAccess()) {
            return;
        }
        
        const dashboard = document.getElementById('analytics-dashboard');
        if (dashboard) {
            dashboard.style.display = dashboard.style.display === 'none' ? 'block' : 'none';
            if (dashboard.style.display === 'block') {
                this.updateDashboard();
            }
        } else {
            this.createDashboard();
        }
    }

    createDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'analytics-dashboard';
        dashboard.style.cssText = 'display: block; position: fixed; top: 10px; right: 10px; background: white; border: 2px solid #000; padding: 20px; z-index: 3000; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: system-ui, -apple-system, sans-serif;';
        
        dashboard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 10px;">
                <h3 style="margin: 0;">📊 Analytics Dashboard</h3>
                <button id="analytics-close" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; line-height: 1;">×</button>
            </div>
            <div id="analytics-summary" style="margin-bottom: 15px;"></div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; border-top: 1px solid #ddd; padding-top: 15px;">
                <button id="export-json" class="btn btn-primary" style="flex: 1; min-width: 120px; padding: 8px 16px; border: 1px solid #000; background: #000; color: #fff; cursor: pointer; border-radius: 4px;">📥 Export JSON</button>
                <button id="export-csv" class="btn btn-secondary" style="flex: 1; min-width: 120px; padding: 8px 16px; border: 1px solid #000; background: #fff; color: #000; cursor: pointer; border-radius: 4px;">📊 Export CSV</button>
            </div>
            <div style="margin-top: 10px; font-size: 0.8em; color: #666; text-align: center;">
                <p style="margin: 0;"><em>Analytics data collected with user consent</em></p>
            </div>
        `;
        
        document.body.appendChild(dashboard);
        
        document.getElementById('analytics-close').addEventListener('click', () => {
            dashboard.style.display = 'none';
        });
        
        document.getElementById('export-json').addEventListener('click', () => this.exportData());
        document.getElementById('export-csv').addEventListener('click', () => this.exportCSV());
        
        this.updateDashboard();
    }

    updateDashboard() {
        const summary = this.getSummary();
        const summaryDiv = document.getElementById('analytics-summary');
        if (!summaryDiv) return;

        const presetList = Object.keys(summary.presetUsage).length > 0
            ? Object.entries(summary.presetUsage)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([preset, count]) => `<li>${preset}: <strong>${count}</strong> uses</li>`)
                .join('')
            : '<li><em>No preset usage data yet</em></li>';

        const personalityList = Object.keys(summary.topPersonalities).length > 0
            ? Object.entries(summary.topPersonalities)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([personality, count]) => `<li>${personality}: <strong>${count}</strong> uses</li>`)
                .join('')
            : '<li><em>No personality data yet</em></li>';

        const dailyActivity = Object.keys(summary.dailyActivity).length > 0
            ? Object.entries(summary.dailyActivity)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 7)
                .map(([date, count]) => `<li>${date}: <strong>${count}</strong> events</li>`)
                .join('')
            : '<li><em>No daily activity data yet</em></li>';

        summaryDiv.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h4 style="margin-top: 0; margin-bottom: 10px;">Overview</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="padding: 5px 0;"><strong>Total Events:</strong> ${summary.totalEvents}</li>
                    <li style="padding: 5px 0;"><strong>Unique Sessions:</strong> ${summary.uniqueSessions}</li>
                    <li style="padding: 5px 0;"><strong>Unique Visitors:</strong> ${summary.uniqueVisitors}</li>
                    <li style="padding: 5px 0;"><strong>Avg Session Duration:</strong> ${summary.averageSessionDuration} minutes</li>
                    <li style="padding: 5px 0;"><strong>Downloads:</strong> ${summary.downloads}</li>
                    <li style="padding: 5px 0;"><strong>Uploads:</strong> ${summary.uploads}</li>
                </ul>
            </div>
            <div style="margin-bottom: 15px;">
                <h4 style="margin-top: 0; margin-bottom: 10px;">Top Presets</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">${presetList}</ul>
            </div>
            <div style="margin-bottom: 15px;">
                <h4 style="margin-top: 0; margin-bottom: 10px;">Top Personalities</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">${personalityList}</ul>
            </div>
            <div style="margin-bottom: 15px;">
                <h4 style="margin-top: 0; margin-bottom: 10px;">Recent Activity (Last 7 Days)</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">${dailyActivity}</ul>
            </div>
        `;
    }

    // Get analytics summary with enhanced stats
    getSummary() {
        const events = this.getStoredEvents();
        
        if (events.length === 0) {
            return {
                totalEvents: 0,
                uniqueSessions: 0,
                uniqueVisitors: 0,
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
            uniqueVisitors: new Set(events.map(e => e.userId || e.userAgent)).size,
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
        
        const sessionTimestamps = {};
        
        events.forEach(event => {
            summary.eventsByType[event.event] = (summary.eventsByType[event.event] || 0) + 1;
            
            const date = event.timestamp.split('T')[0];
            summary.dailyActivity[date] = (summary.dailyActivity[date] || 0) + 1;
            
            const hour = new Date(event.timestamp).getHours();
            summary.hourlyActivity[hour] = (summary.hourlyActivity[hour] || 0) + 1;
            
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
                    if (event.data.personality) {
                        summary.topPersonalities[event.data.personality] = (summary.topPersonalities[event.data.personality] || 0) + 1;
                    }
                    break;
                case 'personality_changed':
                    summary.topPersonalities[event.data.personality] = (summary.topPersonalities[event.data.personality] || 0) + 1;
                    break;
                case 'model_selected':
                    summary.modelUsage = summary.modelUsage || {};
                    summary.modelUsage[event.data.model] = (summary.modelUsage[event.data.model] || 0) + 1;
                    break;
            }
        });
        
        Object.values(sessionTimestamps).forEach(session => {
            const duration = (new Date(session.end) - new Date(session.start)) / 1000 / 60;
            summary.sessionDurations.push(duration);
        });
        
        if (summary.sessionDurations.length > 0) {
            summary.averageSessionDuration = Math.round(
                summary.sessionDurations.reduce((a, b) => a + b, 0) / summary.sessionDurations.length
            );
        }
        
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

    exportData() {
        if (!this.checkAdminAccess()) {
            alert('Analytics access restricted to admin only.');
            return;
        }
        
        const events = this.getStoredEvents();
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

    exportCSV() {
        if (!this.checkAdminAccess()) {
            alert('Analytics access restricted to admin only.');
            return;
        }
        
        const events = this.getStoredEvents();
        if (events.length === 0) {
            alert('No analytics data to export.');
            return;
        }
        
        const headers = ['Timestamp', 'Session ID', 'User ID', 'Event', 'Category', 'Setting', 'Value', 'URL', 'User Agent'];
        const rows = events.map(event => {
            return [
                event.timestamp,
                event.sessionId,
                event.userId || '',
                event.event,
                event.data?.category || '',
                event.data?.setting || '',
                event.data?.value || event.data?.preset || event.data?.type || event.data?.model || event.data?.persona || '',
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
