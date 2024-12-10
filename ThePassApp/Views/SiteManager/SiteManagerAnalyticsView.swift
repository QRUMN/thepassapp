import SwiftUI
import Charts

struct SiteManagerAnalyticsView: View {
    @ObservedObject var viewModel: SiteManagerDashboardViewModel
    @State private var selectedTimeframe: Timeframe = .month
    @State private var selectedMetricType: MetricType = .staffing
    
    enum Timeframe: String, CaseIterable {
        case week = "Week"
        case month = "Month"
        case quarter = "Quarter"
        case year = "Year"
    }
    
    enum MetricType: String, CaseIterable {
        case staffing = "Staffing"
        case climate = "School Climate"
        case support = "Student Support"
        case community = "Community"
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                timeframeSelector
                metricTypeSelector
                
                switch selectedMetricType {
                case .staffing:
                    staffingMetricsView
                case .climate:
                    climateMetricsView
                case .support:
                    supportMetricsView
                case .community:
                    communityMetricsView
                }
                
                trendAnalysis
                reportingOptions
            }
            .padding()
        }
        .navigationTitle("Analytics Dashboard")
    }
    
    private var timeframeSelector: some View {
        Picker("Timeframe", selection: $selectedTimeframe) {
            ForEach(Timeframe.allCases, id: \.self) { timeframe in
                Text(timeframe.rawValue).tag(timeframe)
            }
        }
        .pickerStyle(SegmentedPickerStyle())
    }
    
    private var metricTypeSelector: some View {
        Picker("Metric Type", selection: $selectedMetricType) {
            ForEach(MetricType.allCases, id: \.self) { type in
                Text(type.rawValue).tag(type)
            }
        }
        .pickerStyle(SegmentedPickerStyle())
    }
    
    private var staffingMetricsView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Staffing Metrics")
                .font(.headline)
            
            // Staffing Overview Card
            metricsCard {
                HStack {
                    metricItem(title: "Total Staff",
                             value: "\(viewModel.staffingStatus.totalPositions)")
                    Divider()
                    metricItem(title: "Filled Positions",
                             value: "\(viewModel.staffingStatus.filledPositions)")
                    Divider()
                    metricItem(title: "Vacancy Rate",
                             value: String(format: "%.1f%%",
                                         Double(viewModel.staffingStatus.totalPositions - viewModel.staffingStatus.filledPositions) /
                                         Double(viewModel.staffingStatus.totalPositions) * 100))
                }
            }
            
            // Staff Performance Chart
            metricsCard {
                VStack(alignment: .leading) {
                    Text("Staff Performance Trends")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    Chart {
                        // Mock data - replace with actual data
                        ForEach(0..<5) { index in
                            LineMark(
                                x: .value("Month", "Month \(index + 1)"),
                                y: .value("Performance", Double.random(in: 0.6...0.95))
                            )
                        }
                    }
                    .frame(height: 200)
                }
            }
            
            // Attendance Metrics
            metricsCard {
                VStack(alignment: .leading) {
                    Text("Attendance Overview")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    HStack {
                        metricItem(title: "Present",
                                 value: "\(viewModel.dailyStats.staffPresent)")
                        Divider()
                        metricItem(title: "Absent",
                                 value: "\(viewModel.dailyStats.staffAbsent)")
                        Divider()
                        metricItem(title: "Substitute Requests",
                                 value: "\(viewModel.dailyStats.substituteRequests)")
                    }
                }
            }
        }
    }
    
    private var climateMetricsView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("School Climate Metrics")
                .font(.headline)
            
            // Climate Overview Card
            metricsCard {
                HStack {
                    metricItem(title: "Student Satisfaction",
                             value: String(format: "%.1f%%",
                                         viewModel.climateMetrics.studentSatisfaction * 100))
                    Divider()
                    metricItem(title: "Staff Morale",
                             value: String(format: "%.1f%%",
                                         viewModel.climateMetrics.staffMorale * 100))
                    Divider()
                    metricItem(title: "Safety Rating",
                             value: String(format: "%.1f%%",
                                         viewModel.climateMetrics.safetyRating * 100))
                }
            }
            
            // Climate Trends Chart
            metricsCard {
                VStack(alignment: .leading) {
                    Text("Climate Trends")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    Chart {
                        // Mock data - replace with actual data
                        ForEach(0..<5) { index in
                            BarMark(
                                x: .value("Month", "Month \(index + 1)"),
                                y: .value("Rating", Double.random(in: 0.7...0.9))
                            )
                        }
                    }
                    .frame(height: 200)
                }
            }
        }
    }
    
    private var supportMetricsView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Student Support Metrics")
                .font(.headline)
            
            // Support Cases Overview
            metricsCard {
                HStack {
                    metricItem(title: "Active Cases",
                             value: "\(viewModel.supportCases.count)")
                    Divider()
                    metricItem(title: "Resolved Cases",
                             value: "\(viewModel.supportCases.filter { $0.status == .resolved }.count)")
                    Divider()
                    metricItem(title: "Success Rate",
                             value: "\(calculateSuccessRate())%")
                }
            }
            
            // Intervention Distribution Chart
            metricsCard {
                VStack(alignment: .leading) {
                    Text("Intervention Types")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    Chart {
                        // Mock data - replace with actual data
                        ForEach(InterventionType.allCases.indices) { index in
                            SectorMark(
                                angle: .value("Count",
                                            Double.random(in: 10...30))
                            )
                        }
                    }
                    .frame(height: 200)
                }
            }
        }
    }
    
    private var communityMetricsView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Community Engagement Metrics")
                .font(.headline)
            
            // Engagement Overview
            metricsCard {
                HStack {
                    metricItem(title: "Engagement Rate",
                             value: String(format: "%.1f%%",
                                         viewModel.climateMetrics.communityEngagement * 100))
                    Divider()
                    metricItem(title: "Active Programs",
                             value: "\(viewModel.activeInitiatives.count)")
                    Divider()
                    metricItem(title: "Community Feedback",
                             value: String(format: "%.1f/5.0",
                                         viewModel.impactAssessment.communityFeedback * 5))
                }
            }
            
            // Community Events Timeline
            metricsCard {
                VStack(alignment: .leading) {
                    Text("Community Events Timeline")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    Chart {
                        // Mock data - replace with actual data
                        ForEach(0..<5) { index in
                            PointMark(
                                x: .value("Week", "Week \(index + 1)"),
                                y: .value("Events", Int.random(in: 1...5))
                            )
                        }
                    }
                    .frame(height: 200)
                }
            }
        }
    }
    
    private var trendAnalysis: some View {
        metricsCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Trend Analysis")
                    .font(.headline)
                
                Text("Key Insights")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                VStack(alignment: .leading, spacing: 4) {
                    insightRow(icon: "arrow.up.right",
                             color: .green,
                             text: "Staff retention improved by 15%")
                    insightRow(icon: "arrow.down.right",
                             color: .red,
                             text: "Substitute requests increased by 8%")
                    insightRow(icon: "equal",
                             color: .blue,
                             text: "Student satisfaction remains stable")
                }
            }
        }
    }
    
    private var reportingOptions: some View {
        HStack {
            Button(action: {
                viewModel.generateMonthlyReport()
            }) {
                Label("Generate Report", systemImage: "doc.text")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.bordered)
            
            Button(action: {
                // Export data
            }) {
                Label("Export Data", systemImage: "square.and.arrow.up")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.bordered)
        }
    }
    
    // Helper Views
    
    private func metricsCard<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        content()
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(10)
            .shadow(radius: 2)
    }
    
    private func metricItem(title: String, value: String) -> some View {
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
    
    private func insightRow(icon: String, color: Color, text: String) -> some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(color)
            Text(text)
                .font(.subheadline)
        }
    }
    
    // Helper Functions
    
    private func calculateSuccessRate() -> Int {
        let resolvedCases = viewModel.supportCases.filter { $0.status == .resolved }.count
        let totalCases = viewModel.supportCases.count
        guard totalCases > 0 else { return 0 }
        return Int((Double(resolvedCases) / Double(totalCases)) * 100)
    }
}

// MARK: - Supporting Types

extension InterventionType: CaseIterable {
    static var allCases: [InterventionType] {
        [.meeting, .support, .referral, .other]
    }
}

#Preview {
    NavigationView {
        SiteManagerAnalyticsView(viewModel: SiteManagerDashboardViewModel())
    }
}
