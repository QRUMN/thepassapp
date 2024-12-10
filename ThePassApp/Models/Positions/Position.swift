import Foundation

struct Position: Identifiable, Codable {
    let id: UUID
    let schoolId: UUID
    let title: String
    let roleType: RoleType
    let schedule: Schedule
    let requirements: Requirements
    let compensation: Compensation
    var status: Status
    var upvotes: Int
    var applicantCount: Int
    var postedDate: Date
    var lastModified: Date
    var urgencyLevel: UrgencyLevel
    
    enum RoleType: String, Codable, CaseIterable {
        case teacher = "Teacher"
        case substituteTeacher = "Substitute Teacher"
        case paraprofessional = "Paraprofessional"
        case specialEducation = "Special Education"
        case busAide = "Bus Aide"
        case cafeteriaStaff = "Cafeteria Staff"
        case clinicalStaff = "Clinical Staff"
        case administrativeStaff = "Administrative Staff"
        case counselor = "Counselor"
        case librarian = "Librarian"
        case specialist = "Specialist"
        case other = "Other"
    }
    
    struct Schedule: Codable {
        var type: ScheduleType
        var startDate: Date
        var endDate: Date?
        var hoursPerWeek: Int
        var timeSlots: [TimeSlot]
        var isFlexible: Bool
        
        enum ScheduleType: String, Codable {
            case fullTime = "Full Time"
            case partTime = "Part Time"
            case temporary = "Temporary"
            case longTerm = "Long Term"
            case shortTerm = "Short Term"
            case onCall = "On Call"
        }
        
        struct TimeSlot: Codable {
            var dayOfWeek: DayOfWeek
            var startTime: Date
            var endTime: Date
            var isRequired: Bool
        }
        
        enum DayOfWeek: String, Codable, CaseIterable {
            case monday = "Monday"
            case tuesday = "Tuesday"
            case wednesday = "Wednesday"
            case thursday = "Thursday"
            case friday = "Friday"
        }
    }
    
    struct Requirements: Codable {
        var education: [String]
        var certifications: [String]
        var experience: ExperienceLevel
        var skills: [String]
        var clearances: [Clearance]
        
        enum ExperienceLevel: String, Codable {
            case entry = "Entry Level"
            case intermediate = "1-3 Years"
            case experienced = "3-5 Years"
            case senior = "5+ Years"
        }
        
        enum Clearance: String, Codable {
            case background = "Background Check"
            case fingerprint = "Fingerprint Clearance"
            case tuberculosis = "TB Test"
            case childAbuse = "Child Abuse Clearance"
            case fbi = "FBI Clearance"
        }
    }
    
    struct Compensation: Codable {
        var type: CompensationType
        var rate: Decimal
        var benefits: [Benefit]
        var bonuses: [Bonus]
        
        enum CompensationType: String, Codable {
            case hourly = "Hourly"
            case daily = "Daily"
            case salary = "Salary"
        }
        
        struct Benefit: Codable {
            var type: BenefitType
            var description: String
            
            enum BenefitType: String, Codable {
                case health = "Health Insurance"
                case dental = "Dental Insurance"
                case vision = "Vision Insurance"
                case retirement = "Retirement Plan"
                case pto = "Paid Time Off"
                case other = "Other"
            }
        }
        
        struct Bonus: Codable {
            var type: BonusType
            var amount: Decimal
            var conditions: String
            
            enum BonusType: String, Codable {
                case signing = "Signing Bonus"
                case performance = "Performance Bonus"
                case retention = "Retention Bonus"
                case referral = "Referral Bonus"
            }
        }
    }
    
    enum Status: String, Codable {
        case active = "Active"
        case filled = "Filled"
        case pending = "Pending"
        case expired = "Expired"
        case cancelled = "Cancelled"
    }
    
    enum UrgencyLevel: String, Codable {
        case low = "Low"
        case medium = "Medium"
        case high = "High"
        case immediate = "Immediate"
    }
}

// MARK: - Position Interaction

struct PositionInteraction: Identifiable, Codable {
    let id: UUID
    let positionId: UUID
    let educatorId: UUID
    let type: InteractionType
    let timestamp: Date
    var status: InteractionStatus
    
    enum InteractionType: String, Codable {
        case upvote = "Upvote"
        case view = "View"
        case save = "Save"
        case apply = "Apply"
        case share = "Share"
    }
    
    enum InteractionStatus: String, Codable {
        case active = "Active"
        case removed = "Removed"
        case hidden = "Hidden"
    }
}

// MARK: - Position Match

struct PositionMatch: Identifiable, Codable {
    let id: UUID
    let positionId: UUID
    let educatorId: UUID
    let matchScore: Int
    let matchDate: Date
    var status: MatchStatus
    var notes: String?
    
    enum MatchStatus: String, Codable {
        case pending = "Pending"
        case accepted = "Accepted"
        case rejected = "Rejected"
        case expired = "Expired"
    }
    
    var matchStrength: MatchStrength {
        switch matchScore {
        case 0...30: return .low
        case 31...60: return .medium
        case 61...85: return .high
        default: return .perfect
        }
    }
    
    enum MatchStrength: String {
        case low = "Low Match"
        case medium = "Good Match"
        case high = "Strong Match"
        case perfect = "Perfect Match"
        
        var color: String {
            switch self {
            case .low: return "red"
            case .medium: return "yellow"
            case .high: return "green"
            case .perfect: return "blue"
            }
        }
    }
}
