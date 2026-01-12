//
//  AnalyticsManager.swift
//  AITuner4
//
//  Centralized analytics tracking using Firebase Analytics
//
//  Copyright 2025 John Violette
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//

import Foundation
import FirebaseAnalytics

/// Centralized analytics manager for tracking user interactions
/// Uses Firebase Analytics for anonymous, privacy-compliant tracking
class AnalyticsManager {
    static let shared = AnalyticsManager()
    
    private init() {
        // Private initializer for singleton
    }
    
    // MARK: - Feature Usage Events
    
    /// Track when a user selects an AI model
    func trackModelSelected(_ modelId: String) {
        logEvent("model_selected", parameters: [
            "model_id": modelId
        ])
    }
    
    /// Track when a user selects a persona
    func trackPersonaSelected(_ personaId: String) {
        logEvent("persona_selected", parameters: [
            "persona_id": personaId
        ])
    }
    
    /// Track when a user selects a personality type
    func trackPersonalitySelected(_ personality: String) {
        logEvent("personality_selected", parameters: [
            "personality_type": personality
        ])
    }
    
    /// Track when user switches between Simple and Advanced mode
    func trackModeSwitched(to mode: String) {
        logEvent("mode_switched", parameters: [
            "mode": mode
        ])
    }
    
    // MARK: - Lever Interactions
    
    /// Track when a user adjusts a lever
    func trackLeverAdjusted(leverId: String, value: Int, mode: String) {
        logEvent("lever_adjusted", parameters: [
            "lever_id": leverId,
            "value": value,
            "mode": mode
        ])
    }
    
    /// Track when user resets levers
    func trackLeversReset(leverIds: [String]?, mode: String) {
        let leverCount = leverIds?.count ?? 0
        let resetType = leverIds == nil ? "all" : "section"
        
        logEvent("levers_reset", parameters: [
            "reset_type": resetType,
            "lever_count": leverCount,
            "mode": mode
        ])
    }
    
    /// Track radar chart interactions
    func trackRadarChartInteracted(leverId: String, value: Int) {
        logEvent("radar_chart_interacted", parameters: [
            "lever_id": leverId,
            "value": value,
            "interaction_type": "drag"
        ])
    }
    
    // MARK: - Preset Management
    
    /// Track when a user saves a preset
    func trackPresetSaved(name: String, hasModel: Bool, hasPersona: Bool, leverCount: Int) {
        logEvent("preset_saved", parameters: [
            "preset_name": name,
            "has_model": hasModel,
            "has_persona": hasPersona,
            "lever_count": leverCount
        ])
    }
    
    /// Track when a user loads a preset
    func trackPresetLoaded(presetName: String) {
        logEvent("preset_loaded", parameters: [
            "preset_name": presetName
        ])
    }
    
    /// Track when a user deletes a preset
    func trackPresetDeleted() {
        logEvent("preset_deleted", parameters: [:])
    }
    
    // MARK: - User Flow Events
    
    /// Track app opens (session start)
    func trackAppOpened() {
        logEvent("app_opened", parameters: [:])
    }
    
    /// Track when welcome popup is viewed
    func trackWelcomeViewed() {
        logEvent("welcome_viewed", parameters: [:])
    }
    
    /// Track tutorial completion
    func trackTutorialCompleted() {
        logEvent("tutorial_completed", parameters: [:])
    }
    
    /// Track when user skips tutorial
    func trackTutorialSkipped() {
        logEvent("tutorial_skipped", parameters: [:])
    }
    
    /// Track when prompt is copied (core action)
    func trackPromptCopied(promptLength: Int, hasModel: Bool, hasPersona: Bool) {
        logEvent("prompt_copied", parameters: [
            "prompt_length": promptLength,
            "has_model": hasModel,
            "has_persona": hasPersona
        ])
    }
    
    /// Track when radar popup is opened
    func trackRadarPopupOpened() {
        logEvent("radar_popup_opened", parameters: [:])
    }
    
    /// Track when radar popup is closed
    func trackRadarPopupClosed() {
        logEvent("radar_popup_closed", parameters: [:])
    }
    
    // MARK: - Advanced Features
    
    /// Track when web tuner section is expanded/collapsed
    func trackWebTunerSectionToggled(section: String, isExpanded: Bool) {
        logEvent("web_tuner_section_toggled", parameters: [
            "section": section,
            "is_expanded": isExpanded
        ])
    }
    
    /// Track when radar chart visibility is toggled in web tuner
    func trackWebTunerRadarToggled(section: String, isVisible: Bool) {
        logEvent("web_tuner_radar_toggled", parameters: [
            "section": section,
            "is_visible": isVisible
        ])
    }
    
    /// Track when "What is AI Tuner?" section is expanded
    func trackWhatIsAITunerExpanded() {
        logEvent("what_is_ai_tuner_expanded", parameters: [:])
    }
    
    // MARK: - Error Tracking
    
    /// Track errors (non-fatal)
    func trackError(_ error: Error, context: String) {
        logEvent("error_occurred", parameters: [
            "error_description": error.localizedDescription,
            "context": context
        ])
    }
    
    // MARK: - User Properties (for segmentation)
    
    /// Set user property for Firebase Analytics segmentation
    func setUserProperty(_ value: String, forName name: String) {
        #if DEBUG
        print("📊 User Property: \(name) = \(value)")
        #endif
        
        // Set Firebase Analytics user property
        Analytics.setUserProperty(value, forName: name)
    }
    
    /// Mark user as power user (uses advanced features)
    func markPowerUser() {
        setUserProperty("true", forName: "is_power_user")
    }
    
    // MARK: - Private Helper
    
    /// Log event to analytics service
    /// Uses Firebase Analytics for production, prints to console in debug mode
    private func logEvent(_ name: String, parameters: [String: Any]) {
        #if DEBUG
        print("📊 Analytics: \(name)")
        for (key, value) in parameters {
            print("   \(key): \(value)")
        }
        #endif
        
        // Convert parameters to Firebase format
        // Firebase has parameter name restrictions (no hyphens, max 40 chars)
        var firebaseParams: [String: Any] = [:]
        for (key, value) in parameters {
            // Sanitize parameter names for Firebase
            var sanitizedKey = key.replacingOccurrences(of: "-", with: "_")
            // Truncate if too long (Firebase limit is 40 characters)
            if sanitizedKey.count > 40 {
                sanitizedKey = String(sanitizedKey.prefix(40))
            }
            firebaseParams[sanitizedKey] = value
        }
        
        // Log to Firebase Analytics
        Analytics.logEvent(name, parameters: firebaseParams.isEmpty ? nil : firebaseParams)
    }
}
