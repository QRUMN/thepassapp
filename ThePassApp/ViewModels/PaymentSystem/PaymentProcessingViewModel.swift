import Foundation
import Combine

class PaymentProcessingViewModel: ObservableObject {
    // MARK: - Published Properties
    
    @Published private(set) var currentPayPeriod: PayPeriod?
    @Published private(set) var pendingPayments: [PayPeriod] = []
    @Published private(set) var paymentHistory: [PayPeriod] = []
    @Published private(set) var bonusProgress: [UUID: Int] = [:] // ContractorId: Completed Assignments
    @Published private(set) var permanentPlacementProgress: [UUID: PermanentPlacementProgress] = [:]
    
    // MARK: - Payment Processing
    
    func processWeeklyPayroll(for date: Date = Date()) {
        // 1. Get all completed shifts for the week
        let weeklyShifts = getWeeklyShifts(for: date)
        
        // 2. Calculate earnings for each contractor
        let contractorShifts = Dictionary(grouping: weeklyShifts) { $0.contractorId }
        
        for (contractorId, shifts) in contractorShifts {
            processContractorPayment(contractorId: contractorId, shifts: shifts)
        }
        
        // 3. Process bonuses
        processBonuses()
        
        // 4. Update permanent placement progress
        updatePlacementProgress()
    }
    
    func processContractorPayment(contractorId: UUID, shifts: [WorkShift]) {
        var totalAmount: Decimal = 0
        var bonuses: [Bonus] = []
        
        // Calculate regular pay
        for shift in shifts {
            if let payRate = getPayRate(for: shift.roleType) {
                let hoursWorked = Decimal(shift.hoursWorked)
                let regularPay = hoursWorked * payRate.baseHourlyRate
                
                // Add overtime if applicable
                if shift.hoursWorked > 8 {
                    let overtimeHours = Decimal(shift.hoursWorked - 8)
                    let overtimePay = overtimeHours * payRate.baseHourlyRate * payRate.overtimeMultiplier
                    totalAmount += overtimePay
                }
                
                totalAmount += regularPay
            }
        }
        
        // Check for bonuses
        if let completedAssignments = bonusProgress[contractorId] {
            if completedAssignments >= 30 {
                // $100 bonus for completing 30 assignments
                let bonus = Bonus(
                    id: UUID(),
                    contractorId: contractorId,
                    type: .thirtyAssignments,
                    amount: 100,
                    dateEarned: Date(),
                    status: .earned
                )
                bonuses.append(bonus)
                bonusProgress[contractorId] = 0 // Reset counter
            }
        }
        
        // Create pay period record
        let payPeriod = PayPeriod(
            id: UUID(),
            startDate: getWeekStartDate(for: Date()),
            endDate: getWeekEndDate(for: Date()),
            status: .pending,
            shifts: shifts,
            bonuses: bonuses,
            totalAmount: totalAmount
        )
        
        pendingPayments.append(payPeriod)
    }
    
    // MARK: - Bonus Management
    
    func processBonuses() {
        for (contractorId, assignments) in bonusProgress {
            if assignments >= 30 {
                // Create and process bonus
                let bonus = Bonus(
                    id: UUID(),
                    contractorId: contractorId,
                    type: .thirtyAssignments,
                    amount: 100,
                    dateEarned: Date(),
                    status: .processing
                )
                
                // Add to pending payments
                if var currentPeriod = pendingPayments.first(where: { $0.shifts.contains(where: { $0.contractorId == contractorId }) }) {
                    currentPeriod.bonuses.append(bonus)
                    currentPeriod.totalAmount += bonus.amount
                }
                
                // Reset counter
                bonusProgress[contractorId] = 0
            }
        }
    }
    
    // MARK: - Permanent Placement Tracking
    
    func updatePlacementProgress() {
        for (contractorId, progress) in permanentPlacementProgress {
            var updatedProgress = progress
            
            // Update assignments count
            let newAssignments = pendingPayments
                .flatMap { $0.shifts }
                .filter { $0.contractorId == contractorId && $0.status == .completed }
                .count
            
            updatedProgress.totalAssignments += newAssignments
            
            // Update unique schools
            let newSchools = Set(pendingPayments
                .flatMap { $0.shifts }
                .filter { $0.contractorId == contractorId }
                .compactMap { $0.notes }) // Assuming school name is in notes
            updatedProgress.uniqueSchools.formUnion(newSchools)
            
            // Check eligibility
            if updatedProgress.eligibleForPlacement &&
                updatedProgress.placementStatus == .active {
                updatedProgress.placementStatus = .inConsideration
            }
            
            permanentPlacementProgress[contractorId] = updatedProgress
        }
    }
    
    // MARK: - Helper Methods
    
    private func getWeeklyShifts(for date: Date) -> [WorkShift] {
        // Get all shifts for the current week
        let startOfWeek = getWeekStartDate(for: date)
        let endOfWeek = getWeekEndDate(for: date)
        
        return pendingPayments
            .flatMap { $0.shifts }
            .filter { $0.date >= startOfWeek && $0.date <= endOfWeek }
    }
    
    private func getPayRate(for roleType: PayRate.RoleType) -> PayRate? {
        // In a real app, this would fetch from a database or API
        return PayRate(
            id: UUID(),
            roleType: roleType,
            baseHourlyRate: roleType.minimumHourlyRate,
            overtimeMultiplier: 1.5,
            holidayMultiplier: 2.0
        )
    }
    
    private func getWeekStartDate(for date: Date) -> Date {
        Calendar.current.date(from: Calendar.current.dateComponents([.yearForWeekOfYear, .weekOfYear], from: date)) ?? date
    }
    
    private func getWeekEndDate(for date: Date) -> Date {
        let weekStart = getWeekStartDate(for: date)
        return Calendar.current.date(byAdding: .day, value: 6, to: weekStart) ?? date
    }
}

// MARK: - Payment Processing Error Handling

enum PaymentProcessingError: Error {
    case invalidPayRate
    case invalidShiftData
    case paymentProcessingFailed
    case insufficientFunds
    case invalidBankInfo
    
    var errorMessage: String {
        switch self {
        case .invalidPayRate:
            return "Unable to determine pay rate for the given role"
        case .invalidShiftData:
            return "Invalid shift data provided"
        case .paymentProcessingFailed:
            return "Payment processing failed. Please try again"
        case .insufficientFunds:
            return "Insufficient funds to process payment"
        case .invalidBankInfo:
            return "Invalid bank information provided"
        }
    }
}

// MARK: - Payment Notifications

extension PaymentProcessingViewModel {
    func sendPaymentNotification(to contractorId: UUID, for payPeriod: PayPeriod) {
        // In a real app, this would send push notifications or emails
        let message = """
        Your payment of $\(payPeriod.totalAmount) has been processed.
        Period: \(formatDate(payPeriod.startDate)) - \(formatDate(payPeriod.endDate))
        Regular Hours: \(payPeriod.shifts.reduce(0) { $0 + $1.hoursWorked })
        Bonuses: \(payPeriod.bonuses.reduce(0) { $0 + $1.amount })
        """
        
        // TODO: Implement actual notification sending
        print(message)
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        return formatter.string(from: date)
    }
}
