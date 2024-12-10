import SwiftUI
import Charts

struct ContractorPaymentDashboardView: View {
    @StateObject private var viewModel: PaymentProcessingViewModel
    @State private var selectedTimeframe: TimeframeFilter = .week
    @State private var showingBankDetails = false
    @State private var showingTaxInfo = false
    
    enum TimeframeFilter: String, CaseIterable {
        case week = "This Week"
        case month = "This Month"
        case year = "This Year"
    }
    
    init(contractorId: UUID) {
        _viewModel = StateObject(wrappedValue: PaymentProcessingViewModel())
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                earningsOverview
                weeklyPaymentStatus
                bonusProgress
                permanentPlacementProgress
                paymentSettings
            }
            .padding()
        }
        .navigationTitle("Payment Dashboard")
        .sheet(isPresented: $showingBankDetails) {
            BankDetailsView()
        }
        .sheet(isPresented: $showingTaxInfo) {
            TaxInformationView()
        }
    }
    
    private var earningsOverview: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Earnings Overview")
                .font(.headline)
            
            timeframeSelector
            
            // Earnings Card
            VStack(spacing: 12) {
                HStack {
                    VStack(alignment: .leading) {
                        Text("Total Earnings")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        Text("$2,450.00")
                            .font(.title)
                            .bold()
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing) {
                        Text("Next Payment")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        Text("Friday")
                            .font(.title2)
                            .bold()
                    }
                }
                
                Divider()
                
                // Hours Breakdown
                HStack {
                    earningsMetric(title: "Regular Hours", value: "32")
                    Divider()
                    earningsMetric(title: "Overtime Hours", value: "8")
                    Divider()
                    earningsMetric(title: "Assignments", value: "12")
                }
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
            .shadow(radius: 2)
            
            // Earnings Chart
            earningsChart
        }
    }
    
    private var timeframeSelector: some View {
        Picker("Timeframe", selection: $selectedTimeframe) {
            ForEach(TimeframeFilter.allCases, id: \.self) { timeframe in
                Text(timeframe.rawValue).tag(timeframe)
            }
        }
        .pickerStyle(SegmentedPickerStyle())
    }
    
    private var earningsChart: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Earnings Trend")
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            Chart {
                // Mock data - replace with actual data
                ForEach(0..<7) { day in
                    LineMark(
                        x: .value("Day", "Day \(day + 1)"),
                        y: .value("Earnings", Double.random(in: 100...300))
                    )
                }
            }
            .frame(height: 200)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
    }
    
    private var weeklyPaymentStatus: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Weekly Payment Status")
                .font(.headline)
            
            HStack {
                VStack(alignment: .leading) {
                    Text("Current Week")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    Text("May 1 - May 7")
                        .font(.title3)
                }
                
                Spacer()
                
                Button(action: {
                    // Download pay statement
                }) {
                    Label("Statement", systemImage: "arrow.down.doc")
                }
                .buttonStyle(.bordered)
            }
            
            // Payment Timeline
            VStack(spacing: 12) {
                paymentTimelineItem(
                    day: "Monday",
                    hours: "8",
                    amount: "$200",
                    status: .completed
                )
                paymentTimelineItem(
                    day: "Tuesday",
                    hours: "6",
                    amount: "$150",
                    status: .completed
                )
                paymentTimelineItem(
                    day: "Wednesday",
                    hours: "8",
                    amount: "$200",
                    status: .inProgress
                )
                paymentTimelineItem(
                    day: "Thursday",
                    hours: "4",
                    amount: "$100",
                    status: .scheduled
                )
                paymentTimelineItem(
                    day: "Friday",
                    hours: "8",
                    amount: "$200",
                    status: .scheduled
                )
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
            .shadow(radius: 2)
        }
    }
    
    private var bonusProgress: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Bonus Progress")
                .font(.headline)
            
            VStack(spacing: 12) {
                // 30 Assignments Bonus
                bonusProgressBar(
                    title: "30 Assignments Bonus",
                    current: 25,
                    target: 30,
                    reward: "$100"
                )
                
                // Perfect Attendance Bonus
                bonusProgressBar(
                    title: "Perfect Attendance",
                    current: 19,
                    target: 20,
                    reward: "$50"
                )
                
                // Referral Bonus
                bonusProgressBar(
                    title: "Referral Program",
                    current: 2,
                    target: 5,
                    reward: "$250"
                )
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
            .shadow(radius: 2)
        }
    }
    
    private var permanentPlacementProgress: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Permanent Placement Progress")
                .font(.headline)
            
            VStack(alignment: .leading, spacing: 12) {
                Text("Your path to permanent placement")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                // Progress Metrics
                HStack {
                    placementMetric(
                        title: "Assignments",
                        current: "25",
                        target: "30"
                    )
                    Divider()
                    placementMetric(
                        title: "Schools",
                        current: "3",
                        target: "3"
                    )
                    Divider()
                    placementMetric(
                        title: "Feedback",
                        current: "8",
                        target: "10"
                    )
                }
                
                // Overall Progress
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text("Overall Progress")
                        Spacer()
                        Text("83%")
                    }
                    .font(.subheadline)
                    
                    ProgressView(value: 0.83)
                        .tint(.blue)
                }
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
            .shadow(radius: 2)
        }
    }
    
    private var paymentSettings: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Payment Settings")
                .font(.headline)
            
            HStack {
                Button(action: {
                    showingBankDetails = true
                }) {
                    Label("Bank Details", systemImage: "building.columns")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                
                Button(action: {
                    showingTaxInfo = true
                }) {
                    Label("Tax Information", systemImage: "doc.text")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
            }
        }
    }
    
    // Helper Views
    
    private func earningsMetric(title: String, value: String) -> some View {
        VStack(spacing: 4) {
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
            Text(value)
                .font(.title3)
                .bold()
        }
        .frame(maxWidth: .infinity)
    }
    
    private func paymentTimelineItem(
        day: String,
        hours: String,
        amount: String,
        status: PaymentStatus
    ) -> some View {
        HStack {
            VStack(alignment: .leading) {
                Text(day)
                    .font(.headline)
                Text("\(hours) hours")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Text(amount)
                .font(.title3)
                .bold()
            
            Circle()
                .fill(status.color)
                .frame(width: 12, height: 12)
        }
    }
    
    private func bonusProgressBar(
        title: String,
        current: Int,
        target: Int,
        reward: String
    ) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(title)
                    .font(.subheadline)
                Spacer()
                Text(reward)
                    .font(.subheadline)
                    .bold()
                    .foregroundColor(.blue)
            }
            
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text("\(current)/\(target)")
                        .font(.caption)
                    Spacer()
                    Text("\(Int((Double(current) / Double(target)) * 100))%")
                        .font(.caption)
                }
                
                ProgressView(value: Double(current), total: Double(target))
                    .tint(.blue)
            }
        }
    }
    
    private func placementMetric(title: String, current: String, target: String) -> some View {
        VStack(spacing: 4) {
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
            HStack(alignment: .lastTextBaseline, spacing: 2) {
                Text(current)
                    .font(.title3)
                    .bold()
                Text("/\(target)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Supporting Types

enum PaymentStatus {
    case scheduled
    case inProgress
    case completed
    
    var color: Color {
        switch self {
        case .scheduled:
            return .gray
        case .inProgress:
            return .orange
        case .completed:
            return .green
        }
    }
}

// MARK: - Preview

#Preview {
    NavigationView {
        ContractorPaymentDashboardView(contractorId: UUID())
    }
}

// MARK: - Supporting Views

struct BankDetailsView: View {
    var body: some View {
        Text("Bank Details View")
            .navigationTitle("Bank Details")
    }
}

struct TaxInformationView: View {
    var body: some View {
        Text("Tax Information View")
            .navigationTitle("Tax Information")
    }
}
