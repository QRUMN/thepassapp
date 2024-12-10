import Foundation

struct SiteManager: Identifiable {
    let id: UUID
    var name: String
    var school: School
    var assignedStaff: [User]
    var communityConnections: [CommunityConnection]
    var studentRelationships: [StudentRelationship]
    var staffingMetrics: StaffingMetrics
    var schoolClimateInitiatives: [ClimateInitiative]
    
    // Analytics and Metrics
    var staffPlacementSuccess: Double // Percentage of successful placements
    var studentSatisfactionRate: Double
    var schoolAdminFeedback: [Feedback]
    var staffRetentionRate: Double
    
    struct CommunityConnection: Identifiable {
        let id: UUID
        var organizationName: String
        var contactPerson: String
        var relationshipType: String
        var engagementHistory: [EngagementEvent]
        var notes: String
    }
    
    struct StudentRelationship {
        var gradeLevel: String
        var supportType: Set<SupportType>
        var successMetrics: [String: Double]
        var interventionHistory: [Intervention]
    }
    
    struct StaffingMetrics {
        var totalPositions: Int
        var filledPositions: Int
        var substituteRequests: Int
        var substituteFullfillmentRate: Double
        var averageResponseTime: TimeInterval
        var staffFeedbackScore: Double
        
        var staffingSuccessRate: Double {
            return Double(filledPositions) / Double(totalPositions)
        }
    }
    
    struct ClimateInitiative: Identifiable {
        let id: UUID
        var name: String
        var description: String
        var startDate: Date
        var status: Status
        var metrics: [String: Double]
        var participants: [String]
        var outcomes: [String]
        
        enum Status: String {
            case planned = "Planned"
            case active = "Active"
            case completed = "Completed"
            case onHold = "On Hold"
        }
    }
    
    struct Intervention: Identifiable {
        let id: UUID
        var date: Date
        var type: InterventionType
        var description: String
        var outcome: String
        var followUpNeeded: Bool
        var followUpDate: Date?
    }
    
    struct EngagementEvent: Identifiable {
        let id: UUID
        var date: Date
        var eventType: String
        var description: String
        var outcome: String
        var participants: [String]
        var impact: ImpactLevel
        
        enum ImpactLevel: String {
            case high = "High Impact"
            case medium = "Medium Impact"
            case low = "Low Impact"
        }
    }
    
    struct Feedback: Identifiable {
        let id: UUID
        var date: Date
        var source: String
        var rating: Int // 1-5
        var comments: String
        var category: FeedbackCategory
        var actionTaken: String?
        
        enum FeedbackCategory: String {
            case staffing = "Staffing"
            case communication = "Communication"
            case support = "Support"
            case initiative = "Initiative"
            case general = "General"
        }
    }
    
    enum SupportType: String {
        case academic = "Academic"
        case behavioral = "Behavioral"
        case emotional = "Emotional"
        case social = "Social"
        case attendance = "Attendance"
        case transportation = "Transportation"
    }
    
    enum InterventionType: String {
        case academicSupport = "Academic Support"
        case behavioralIntervention = "Behavioral Intervention"
        case familyOutreach = "Family Outreach"
        case resourceConnection = "Resource Connection"
        case transportationAssistance = "Transportation Assistance"
        case attendanceIntervention = "Attendance Intervention"
    }
}

// Extension for analytics and reporting
extension SiteManager {
    func generateMonthlyReport() -> MonthlyReport {
        // Generate comprehensive monthly report
        return MonthlyReport(
            siteManager: self,
            month: Date(),
            staffingMetrics: self.staffingMetrics,
            communityEngagement: summarizeCommunityEngagement(),
            studentProgress: summarizeStudentProgress(),
            climateInitiatives: summarizeClimateInitiatives()
        )
    }
    
    private func summarizeCommunityEngagement() -> [String: Any] {
        // Analyze community connections and engagement
        let totalConnections = communityConnections.count
        let activeEngagements = communityConnections.flatMap { $0.engagementHistory }
            .filter { $0.date > Date().addingTimeInterval(-30 * 24 * 60 * 60) }
        
        return [
            "totalConnections": totalConnections,
            "recentEngagements": activeEngagements.count,
            "impactMetrics": calculateImpactMetrics(from: activeEngagements)
        ]
    }
    
    private func summarizeStudentProgress() -> [String: Any] {
        // Analyze student relationships and interventions
        let totalInterventions = studentRelationships.flatMap { $0.interventionHistory }.count
        let successfulInterventions = studentRelationships
            .flatMap { $0.interventionHistory }
            .filter { !($0.followUpNeeded ?? false) }
            .count
        
        return [
            "totalStudentsSupported": studentRelationships.count,
            "interventionSuccessRate": Double(successfulInterventions) / Double(totalInterventions),
            "supportTypeDistribution": analyzeSupportTypeDistribution()
        ]
    }
    
    private func summarizeClimateInitiatives() -> [String: Any] {
        // Analyze climate initiatives and their impact
        let activeInitiatives = schoolClimateInitiatives.filter { $0.status == .active }
        let completedInitiatives = schoolClimateInitiatives.filter { $0.status == .completed }
        
        return [
            "activeInitiatives": activeInitiatives.count,
            "completedInitiatives": completedInitiatives.count,
            "averageImpact": calculateAverageInitiativeImpact()
        ]
    }
    
    private func calculateImpactMetrics(from events: [EngagementEvent]) -> [String: Double] {
        // Calculate impact metrics from engagement events
        let highImpact = events.filter { $0.impact == .high }.count
        let mediumImpact = events.filter { $0.impact == .medium }.count
        
        return [
            "highImpactRate": Double(highImpact) / Double(events.count),
            "mediumImpactRate": Double(mediumImpact) / Double(events.count)
        ]
    }
    
    private func analyzeSupportTypeDistribution() -> [SupportType: Double] {
        // Analyze distribution of support types
        var distribution: [SupportType: Int] = [:]
        let relationships = studentRelationships
        
        for relationship in relationships {
            for type in relationship.supportType {
                distribution[type, default: 0] += 1
            }
        }
        
        let total = Double(relationships.count)
        return distribution.mapValues { Double($0) / total }
    }
    
    private func calculateAverageInitiativeImpact() -> Double {
        // Calculate average impact of climate initiatives
        let completedInitiatives = schoolClimateInitiatives.filter { $0.status == .completed }
        let impactScores = completedInitiatives.compactMap { $0.metrics["impact"] }
        return impactScores.reduce(0, +) / Double(impactScores.count)
    }
}

struct MonthlyReport {
    let siteManager: SiteManager
    let month: Date
    let staffingMetrics: SiteManager.StaffingMetrics
    let communityEngagement: [String: Any]
    let studentProgress: [String: Any]
    let climateInitiatives: [String: Any]
    
    var overallPerformanceScore: Double {
        // Calculate overall performance score based on multiple metrics
        let staffingScore = staffingMetrics.staffingSuccessRate * 0.3
        let satisfactionScore = siteManager.studentSatisfactionRate * 0.3
        let retentionScore = siteManager.staffRetentionRate * 0.2
        let climateScore = (climateInitiatives["averageImpact"] as? Double ?? 0) * 0.2
        
        return staffingScore + satisfactionScore + retentionScore + climateScore
    }
}
