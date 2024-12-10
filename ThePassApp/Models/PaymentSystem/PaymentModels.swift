import Foundation

// MARK: - Payment Rate Models

struct PayRate {
    let id: UUID
    let roleType: RoleType
    let baseHourlyRate: Decimal
    let overtimeMultiplier: Decimal
    let holidayMultiplier: Decimal
    
    enum RoleType: String, Codable {
        case busAide = "Bus Aide"
        case paraprofessional = "Paraprofessional"
        case cafeteriaStaff = "Cafeteria Staff"
        case substituteTeacher = "Substitute Teacher"
        case clinicalStaff = "Clinical Staff"
        case administrativeStaff = "Administrative Staff"
        
        var minimumHourlyRate: Decimal {
            switch self {
            case .busAide: return 18.50
            case .paraprofessional: return 22.00
            case .cafeteriaStaff: return 17.50
            case .substituteTeacher: return 25.00
            case .clinicalStaff: return 35.00
            case .administrativeStaff: return 23.00
            }
        }
    }
}

// MARK: - Work Schedule Models

struct WorkShift: Identifiable, Codable {
    let id: UUID
    let contractorId: UUID
    let roleType: PayRate.RoleType
    let date: Date
    let startTime: Date
    let endTime: Date
    var status: ShiftStatus
    var notes: String?
    
    enum ShiftStatus: String, Codable {
        case scheduled
        case inProgress
        case completed
        case cancelled
        case noShow
    }
    
    var duration: TimeInterval {
        endTime.timeIntervalSince(startTime)
    }
    
    var hoursWorked: Double {
        duration / 3600 // Convert seconds to hours
    }
}

// MARK: - Payment Models

struct PayPeriod: Identifiable, Codable {
    let id: UUID
    let startDate: Date
    let endDate: Date
    var status: PaymentStatus
    var shifts: [WorkShift]
    var bonuses: [Bonus]
    var totalAmount: Decimal
    
    enum PaymentStatus: String, Codable {
        case pending
        case processing
        case paid
        case failed
    }
}

struct Bonus: Identifiable, Codable {
    let id: UUID
    let contractorId: UUID
    let type: BonusType
    let amount: Decimal
    let dateEarned: Date
    var status: BonusStatus
    
    enum BonusType: String, Codable {
        case thirtyAssignments = "30 Assignments Completion"
        case perfectAttendance = "Perfect Attendance"
        case longTermAssignment = "Long-term Assignment"
        case referral = "Referral Bonus"
        case specialProject = "Special Project"
    }
    
    enum BonusStatus: String, Codable {
        case earned
        case processing
        case paid
    }
}

// MARK: - Permanent Placement Tracking

struct PermanentPlacementProgress: Identifiable, Codable {
    let id: UUID
    let contractorId: UUID
    let startDate: Date
    var totalAssignments: Int
    var uniqueSchools: Set<String>
    var positiveFeedbackCount: Int
    var placementStatus: PlacementStatus
    
    enum PlacementStatus: String, Codable {
        case active = "Active Contractor"
        case inConsideration = "In Consideration"
        case interviewing = "Interviewing"
        case offered = "Offered Position"
        case placed = "Permanently Placed"
        case declined = "Declined"
    }
    
    var placementScore: Int {
        // Calculate placement score based on various factors
        var score = 0
        score += totalAssignments * 2
        score += uniqueSchools.count * 5
        score += positiveFeedbackCount * 3
        return score
    }
    
    var eligibleForPlacement: Bool {
        return totalAssignments >= 30 && 
               uniqueSchools.count >= 3 && 
               positiveFeedbackCount >= 10
    }
}

// MARK: - Payment Analytics

struct PaymentAnalytics {
    let contractorId: UUID
    let period: DateInterval
    
    var totalEarnings: Decimal = 0
    var regularHours: Double = 0
    var overtimeHours: Double = 0
    var bonusEarnings: Decimal = 0
    var averageHourlyRate: Decimal = 0
    var assignmentsCompleted: Int = 0
    
    var projectedEarnings: Decimal {
        // Project earnings based on current trajectory
        let weeklyAverage = totalEarnings / Decimal(period.duration / 604800) // seconds in a week
        return weeklyAverage * 52 // annual projection
    }
}

// MARK: - Direct Deposit Information

struct DirectDepositInfo: Codable {
    let id: UUID
    let contractorId: UUID
    let bankName: String
    let accountType: AccountType
    let routingNumber: String
    let accountNumber: String
    var isVerified: Bool
    var isPrimary: Bool
    
    enum AccountType: String, Codable {
        case checking
        case savings
    }
}

// MARK: - Tax Information

struct TaxInformation: Codable {
    let id: UUID
    let contractorId: UUID
    let taxYear: Int
    var w9Submitted: Bool
    var federalTaxWithholding: Decimal
    var stateTaxWithholding: Decimal
    var allowances: Int
    var filingStatus: FilingStatus
    
    enum FilingStatus: String, Codable {
        case single = "Single"
        case marriedJoint = "Married Filing Jointly"
        case marriedSeparate = "Married Filing Separately"
        case headOfHousehold = "Head of Household"
    }
}
