//
//  RadarChartView.swift
//  AITuner4
//
//  AI Tuner v4.0 - Radar Chart Visualization
//

import SwiftUI

struct RadarChartView: View {
    let levers: [String: Int]
    let size: CGFloat
    let onLeverChange: ((String, Int) -> Void)?
    
    // 8 key levers for the radar chart
    private let radarLevers = [
        ("creativity", "Creativity"),
        ("teachingMode", "Teaching"),
        ("proactivityLevel", "Proactivity"),
        ("playfulness", "Playfulness"),
        ("conciseness", "Conciseness"),
        ("answerCompleteness", "Completeness"),
        ("hedgingIntensity", "Hedging"),
        ("empathyExpressiveness", "Empathy")
    ]
    
    @State private var draggingIndex: Int? = nil
    
    init(levers: [String: Int], size: CGFloat = 300, onLeverChange: ((String, Int) -> Void)? = nil) {
        self.levers = levers
        self.size = size
        self.onLeverChange = onLeverChange
    }
    
    var body: some View {
        GeometryReader { geometry in
            let chartSize = min(geometry.size.width, geometry.size.height)
            let center = CGPoint(x: geometry.size.width / 2, y: geometry.size.height / 2)
            let availableRadius = min(chartSize / 2 - 50, size / 2)
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
                    // Fill
                    PolygonShape(points: radarLevers.enumerated().map { index, lever in
                        let value = levers[lever.0] ?? 5
                        let normalizedValue = CGFloat(value) / 10.0
                        let angle = angleForIndex(index)
                        let pointRadius = radius * normalizedValue
                        return pointOnCircle(center: center, radius: pointRadius, angle: angle)
                    })
                    .fill(Color.blue.opacity(0.3))
                    
                    // Stroke
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
                    let currentValue = levers[lever.0] ?? 5
                    let normalizedValue = CGFloat(currentValue) / 10.0
                    let angle = angleForIndex(index)
                    let pointRadius = radius * normalizedValue
                    let point = pointOnCircle(center: center, radius: pointRadius, angle: angle)
                    
                    Circle()
                        .fill(draggingIndex == index ? Color.blue.opacity(0.8) : Color.blue)
                        .frame(width: draggingIndex == index ? 24 : 20, height: draggingIndex == index ? 24 : 20)
                        .overlay(
                            Circle()
                                .stroke(Color.white, lineWidth: 2)
                        )
                        .position(point)
                        .zIndex(draggingIndex == index ? 1 : 0)
                }
                
                // Single drag gesture handler for entire chart
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
                                    var closestDistance: CGFloat = 50 // Touch threshold
                                    
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
                                    
                                    // dragValue.location is in the GeometryReader's coordinate system
                                    let dragLocation = dragValue.location
                                    
                                    // Calculate angle of drag relative to center
                                    let dx = dragLocation.x - center.x
                                    let dy = dragLocation.y - center.y
                                    let dragAngle = atan2(dy, dx)
                                    
                                    // Project onto the radial line for this point
                                    let angleDiff = dragAngle - angle
                                    // Normalize angle difference to -pi to pi
                                    let normalizedAngleDiff = atan2(sin(angleDiff), cos(angleDiff))
                                    
                                    // Project distance onto radial line
                                    let distance = sqrt(dx * dx + dy * dy)
                                    let projectedDistance = distance * cos(normalizedAngleDiff)
                                    
                                    // Clamp and convert to 0-10 value
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
                
                // Labels
                ForEach(0..<radarLevers.count, id: \.self) { index in
                    let lever = radarLevers[index]
                    let angle = angleForIndex(index)
                    let labelRadius = radius + 25
                    let labelPoint = pointOnCircle(center: center, radius: labelRadius, angle: angle)
                    
                    Text(lever.1)
                        .font(.caption2)
                        .foregroundColor(.primary)
                        .position(labelPoint)
                }
            }
        }
        .frame(width: size, height: size)
    }
    
    private func angleForIndex(_ index: Int) -> CGFloat {
        let angleStep = 2 * .pi / CGFloat(radarLevers.count)
        return angleStep * CGFloat(index) - .pi / 2 // Start at top
    }
    
    private func pointOnCircle(center: CGPoint, radius: CGFloat, angle: CGFloat) -> CGPoint {
        return CGPoint(
            x: center.x + radius * cos(angle),
            y: center.y + radius * sin(angle)
        )
    }
}

// Helper shape for iOS 15 compatibility
struct PolygonShape: Shape {
    let points: [CGPoint]
    
    func path(in rect: CGRect) -> Path {
        var path = Path()
        guard let firstPoint = points.first else { return path }
        
        path.move(to: firstPoint)
        for point in points.dropFirst() {
            path.addLine(to: point)
        }
        path.closeSubpath()
        
        return path
    }
}



#Preview {
    RadarChartView(levers: [
        "creativity": 7,
        "teachingMode": 5,
        "proactivityLevel": 6,
        "playfulness": 4,
        "conciseness": 8,
        "answerCompleteness": 7,
        "hedgingIntensity": 3,
        "empathyExpressiveness": 6
    ])
    .padding()
}
