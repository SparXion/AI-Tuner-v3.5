//
//  WebTunerSectionView.swift
//  AITuner4
//
//  AI Tuner v4.0 - Collapsible Web Tuner Section
//

import SwiftUI

enum WebTunerType: String, CaseIterable {
    case personaSpine = "persona-spine"
    case engagement = "engagement"
    case truth = "truth"
    case delivery = "delivery"
    
    var title: String {
        switch self {
        case .personaSpine: return "Persona Spine"
        case .engagement: return "Engagement Surface"
        case .truth: return "Truth Discipline"
        case .delivery: return "Delivery System"
        }
    }
    
    var subtitle: String {
        switch self {
        case .personaSpine: return "Identity & attitude tuning"
        case .engagement: return "Communication & pacing"
        case .truth: return "Reasoning & validation"
        case .delivery: return "Presentation & formatting"
        }
    }
    
    var leverKeys: [String] {
        switch self {
        case .personaSpine:
            return [
                "assertiveness",
                "identitySourceLock",
                "adaptivityToUserTone",
                "creativity",
                "playfulness",
                "metaCommentary",
                "teachingMode",
                "proactivityLevel"
            ]
        case .engagement:
            return [
                "conciseness",
                "responseDirectness",
                "answerCompleteness",
                "speedOptimization",
                "affirmationFrequency",
                "empathyExpressiveness",
                "safetyDisclaimers",
                "structuralDensity"
            ]
        case .truth:
            return [
                "hedgingIntensity",
                "certaintyModulation",
                "citationRigidity",
                "transparency",
                "technicality",
                "toolAutonomy",
                "answerCompleteness", // Placeholder for Memory
                "proactivityLevel" // Placeholder for Goal Lock
            ]
        case .delivery:
            return [
                "markdownStructure",
                "strictFormatting",
                "formattingMinimalism",
                "formality",
                "conciseness", // Placeholder for Termination
                "responseDirectness", // Placeholder for Transitions
                "proactivityLevel", // Placeholder for Questions
                "structuralDensity" // Placeholder for Suggestions
            ]
        }
    }
}

struct WebTunerSectionView: View {
    let tunerType: WebTunerType
    @ObservedObject var engine: AITunerEngine
    @State private var isExpanded = true
    @State private var showingRadar = true
    
    var body: some View {
        VStack(spacing: 0) {
            // Header - always visible
            HStack {
                Button(action: {
                    // Haptic feedback
                    let generator = UIImpactFeedbackGenerator(style: .light)
                    generator.impactOccurred()
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                        isExpanded.toggle()
                    }
                }) {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(tunerType.title)
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            Text(tunerType.subtitle)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                        
                        // Expand/collapse icon
                        Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                            .foregroundColor(.secondary)
                            .font(.caption)
                    }
                }
                .buttonStyle(.plain)
                .accessibilityLabel("\(tunerType.title) section")
                .accessibilityHint(isExpanded ? "Tap to collapse" : "Tap to expand")
                
                // Radar toggle button
                Button(action: {
                    // Haptic feedback
                    let generator = UIImpactFeedbackGenerator(style: .light)
                    generator.impactOccurred()
                    withAnimation {
                        showingRadar.toggle()
                    }
                }) {
                    Image(systemName: showingRadar ? "chart.pie.fill" : "chart.pie")
                        .foregroundColor(.blue)
                        .font(.title3)
                }
                .buttonStyle(.plain)
                .padding(.leading, 8)
                .accessibilityLabel(showingRadar ? "Hide radar chart" : "Show radar chart")
                
                // Reset button
                Button(action: {
                    // Haptic feedback
                    let generator = UINotificationFeedbackGenerator()
                    generator.notificationOccurred(.success)
                    engine.resetLevers(tunerType.leverKeys)
                }) {
                    Image(systemName: "arrow.counterclockwise")
                        .foregroundColor(.orange)
                        .font(.title3)
                }
                .buttonStyle(.plain)
                .padding(.leading, 8)
                .accessibilityLabel("Reset \(tunerType.title) to defaults")
                .accessibilityHint("Resets all levers in this section to their default values")
            }
            .padding()
            .background(Color(.systemGray6))
            
            // Expanded content
            if isExpanded {
                VStack(spacing: 16) {
                    // Radar chart (if enabled)
                    if showingRadar {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Live Preview")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .padding(.horizontal)
                            
                            WebTunerRadarView(
                                tunerType: tunerType,
                                levers: engine.levers,
                                onLeverChange: { leverId, value in
                                    engine.setLever(leverId, value: value)
                                }
                            )
                            .frame(height: 250)
                            .padding()
                            .background(Color(.systemGray6))
                            .cornerRadius(12)
                            .padding(.horizontal)
                        }
                        .padding(.top)
                    }
                    
                    // Lever sliders for this tuner
                    VStack(spacing: 12) {
                        ForEach(tunerType.leverKeys, id: \.self) { leverId in
                            if let lever = Lever.allLevers[leverId] {
                                LeverSliderView(
                                    lever: lever,
                                    value: Binding(
                                        get: { engine.levers[leverId] ?? lever.defaultValue },
                                        set: { engine.setLever(leverId, value: $0) }
                                    ),
                                    isLocked: isLeverLocked(leverId)
                                )
                            }
                        }
                    }
                    .padding()
                    .accessibilityElement(children: .contain)
                    .accessibilityLabel("\(tunerType.title) lever controls")
                }
                .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color(.systemGray4), lineWidth: 1)
        )
    }
    
    private func isLeverLocked(_ leverId: String) -> Bool {
        guard let lever = Lever.allLevers[leverId],
              let lockedModels = lever.locked,
              let modelId = engine.selectedModel?.id else {
            return false
        }
        return lockedModels.contains(modelId)
    }
}

// Specialized radar view for web tuners (8 axes)
struct WebTunerRadarView: View {
    let tunerType: WebTunerType
    let levers: [String: Int]
    let onLeverChange: ((String, Int) -> Void)?
    
    @State private var draggingIndex: Int? = nil
    
    private var radarLevers: [(String, String)] {
        tunerType.leverKeys.enumerated().map { index, key in
            let lever = Lever.allLevers[key]
            return (key, lever?.name ?? key)
        }
    }
    
    var body: some View {
        GeometryReader { geometry in
            let chartSize = min(geometry.size.width, geometry.size.height)
            let center = CGPoint(x: geometry.size.width / 2, y: geometry.size.height / 2)
            let availableRadius = min(chartSize / 2 - 50, 120)
            let radius = availableRadius > 0 ? availableRadius : 100
            
            ZStack {
                // Background circles (grid)
                ForEach(0..<5) { level in
                    let levelRadius = radius * CGFloat(level + 1) / 5
                    Circle()
                        .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                        .frame(width: levelRadius * 2, height: levelRadius * 2)
                        .position(center)
                }
                
                // Grid lines (spokes)
                ForEach(0..<radarLevers.count, id: \.self) { index in
                    let angle = angleForIndex(index)
                    let endPoint = pointOnCircle(center: center, radius: radius, angle: angle)
                    
                    Path { path in
                        path.move(to: center)
                        path.addLine(to: endPoint)
                    }
                    .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                }
                
                // Data polygon
                ZStack {
                    PolygonShape(points: radarLevers.enumerated().map { index, lever in
                        let value = levers[lever.0] ?? 5
                        let normalizedValue = CGFloat(value) / 10.0
                        let angle = angleForIndex(index)
                        let pointRadius = radius * normalizedValue
                        return pointOnCircle(center: center, radius: pointRadius, angle: angle)
                    })
                    .fill(Color.blue.opacity(0.3))
                    
                    PolygonShape(points: radarLevers.enumerated().map { index, lever in
                        let value = levers[lever.0] ?? 5
                        let normalizedValue = CGFloat(value) / 10.0
                        let angle = angleForIndex(index)
                        let pointRadius = radius * normalizedValue
                        return pointOnCircle(center: center, radius: pointRadius, angle: angle)
                    })
                    .stroke(Color.blue, lineWidth: 2)
                }
                
                // Data points (visual only)
                ForEach(0..<radarLevers.count, id: \.self) { index in
                    let lever = radarLevers[index]
                    let value = levers[lever.0] ?? 5
                    let normalizedValue = CGFloat(value) / 10.0
                    let angle = angleForIndex(index)
                    let pointRadius = radius * normalizedValue
                    let point = pointOnCircle(center: center, radius: pointRadius, angle: angle)
                    
                    Circle()
                        .fill(draggingIndex == index ? Color.blue.opacity(0.8) : Color.blue)
                        .frame(width: draggingIndex == index ? 20 : 16, height: draggingIndex == index ? 20 : 16)
                        .overlay(
                            Circle()
                                .stroke(Color.white, lineWidth: 2)
                        )
                        .position(point)
                        .zIndex(draggingIndex == index ? 1 : 0)
                }
                
                // Labels
                ForEach(0..<radarLevers.count, id: \.self) { index in
                    let lever = radarLevers[index]
                    let angle = angleForIndex(index)
                    let labelRadius = radius + 20
                    let labelPoint = pointOnCircle(center: center, radius: labelRadius, angle: angle)
                    
                    Text(lever.1)
                        .font(.caption2)
                        .foregroundColor(.primary)
                        .position(labelPoint)
                }
                
                // Single drag gesture handler
                Color.clear
                    .contentShape(Rectangle())
                    .gesture(
                        DragGesture(minimumDistance: 0)
                            .onChanged { dragValue in
                                // Only find closest point if we haven't started dragging yet
                                if draggingIndex == nil {
                                    let startLocation = dragValue.startLocation
                                    
                                    // Find which point was closest to the start location
                                    var closestIndex: Int? = nil
                                    var closestDistance: CGFloat = 40
                                    
                                    for index in 0..<radarLevers.count {
                                        let lever = radarLevers[index]
                                        let currentValue = levers[lever.0] ?? 5
                                        let normalizedValue = CGFloat(currentValue) / 10.0
                                        let angle = angleForIndex(index)
                                        let pointRadius = radius * normalizedValue
                                        let point = pointOnCircle(center: center, radius: pointRadius, angle: angle)
                                        
                                        let distance = sqrt(
                                            pow(startLocation.x - point.x, 2) + 
                                            pow(startLocation.y - point.y, 2)
                                        )
                                        
                                        if distance < closestDistance {
                                            closestDistance = distance
                                            closestIndex = index
                                        }
                                    }
                                    
                                    // Lock onto the closest point
                                    draggingIndex = closestIndex
                                }
                                
                                // Only update if we have a locked point
                                if let index = draggingIndex {
                                    let lever = radarLevers[index]
                                    let angle = angleForIndex(index)
                                    
                                    let dragLocation = dragValue.location
                                    let dx = dragLocation.x - center.x
                                    let dy = dragLocation.y - center.y
                                    let dragAngle = atan2(dy, dx)
                                    
                                    let angleDiff = dragAngle - angle
                                    let normalizedAngleDiff = atan2(sin(angleDiff), cos(angleDiff))
                                    
                                    let distance = sqrt(dx * dx + dy * dy)
                                    let projectedDistance = distance * cos(normalizedAngleDiff)
                                    
                                    let normalizedDistance = min(max(projectedDistance / radius, 0), 1.0)
                                    let newValue = Int(round(normalizedDistance * 10.0))
                                    let clampedValue = max(0, min(10, newValue))
                                    
                                    onLeverChange?(lever.0, clampedValue)
                                }
                            }
                            .onEnded { _ in
                                draggingIndex = nil
                            }
                    )
            }
        }
    }
    
    private func angleForIndex(_ index: Int) -> CGFloat {
        let angleStep = 2 * .pi / CGFloat(radarLevers.count)
        return angleStep * CGFloat(index) - .pi / 2
    }
    
    private func pointOnCircle(center: CGPoint, radius: CGFloat, angle: CGFloat) -> CGPoint {
        return CGPoint(
            x: center.x + radius * cos(angle),
            y: center.y + radius * sin(angle)
        )
    }
}

#Preview {
    WebTunerSectionView(tunerType: .personaSpine, engine: AITunerEngine())
        .padding()
}
