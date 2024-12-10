import SwiftUI

struct PositionsBoardView: View {
    @StateObject private var viewModel: PositionsBoardViewModel
    @State private var showingFilters = false
    @State private var showingSavedPositions = false
    @State private var showingAppliedPositions = false
    @State private var currentIndex = 0
    
    // Gesture Properties
    @State private var offset: CGSize = .zero
    @State private var cardRotation: Double = 0
    @GestureState private var isDragging: Bool = false
    
    private let screenSize = UIScreen.main.bounds.size
    private let swipeThreshold: CGFloat = 100
    
    init(educatorId: UUID) {
        _viewModel = StateObject(wrappedValue: PositionsBoardViewModel(educatorId: educatorId))
    }
    
    var body: some View {
        NavigationView {
            VStack {
                // Search and Filter Bar
                searchAndFilterBar
                
                // Position Cards Stack
                ZStack {
                    ForEach(viewModel.positions.prefix(3).reversed()) { position in
                        PositionCardView(position: position)
                            .offset(position.id == currentPosition?.id ? offset : .zero)
                            .rotationEffect(.degrees(position.id == currentPosition?.id ? cardRotation : 0))
                            .gesture(dragGesture)
                            .animation(.interactiveSpring(), value: offset)
                            .animation(.interactiveSpring(), value: cardRotation)
                    }
                }
                .padding()
                
                // Action Buttons
                actionButtons
            }
            .navigationTitle("Positions Board")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button(action: { showingSavedPositions = true }) {
                            Label("Saved Positions", systemImage: "bookmark.fill")
                        }
                        Button(action: { showingAppliedPositions = true }) {
                            Label("Applied Positions", systemImage: "paperplane.fill")
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                }
            }
            .sheet(isPresented: $showingFilters) {
                PositionFiltersView(filters: $viewModel.selectedFilters)
            }
            .sheet(isPresented: $showingSavedPositions) {
                SavedPositionsView(positions: viewModel.savedPositions)
            }
            .sheet(isPresented: $showingAppliedPositions) {
                AppliedPositionsView(positions: viewModel.appliedPositions)
            }
        }
    }
    
    private var currentPosition: Position? {
        guard currentIndex < viewModel.positions.count else { return nil }
        return viewModel.positions[currentIndex]
    }
    
    private var searchAndFilterBar: some View {
        HStack {
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.gray)
                TextField("Search positions...", text: $viewModel.searchText)
            }
            .padding(8)
            .background(Color(.systemGray6))
            .cornerRadius(10)
            
            Button(action: { showingFilters = true }) {
                Image(systemName: "slider.horizontal.3")
                    .foregroundColor(.blue)
            }
        }
        .padding()
    }
    
    private var actionButtons: some View {
        HStack(spacing: 20) {
            // Reject Button
            CircleButton(
                action: rejectPosition,
                systemName: "xmark",
                color: .red
            )
            
            // Save Button
            CircleButton(
                action: saveCurrentPosition,
                systemName: "bookmark",
                color: .yellow
            )
            
            // Upvote Button
            CircleButton(
                action: upvotePosition,
                systemName: "arrow.up",
                color: .green
            )
            
            // Accept Button
            CircleButton(
                action: acceptPosition,
                systemName: "checkmark",
                color: .blue
            )
        }
        .padding(.bottom)
    }
    
    private var dragGesture: some Gesture {
        DragGesture()
            .updating($isDragging) { value, state, _ in
                state = true
            }
            .onChanged { value in
                offset = value.translation
                cardRotation = Double(value.translation.width / 20)
            }
            .onEnded { value in
                let width = value.translation.width
                
                if abs(width) > swipeThreshold {
                    if width > 0 {
                        acceptPosition()
                    } else {
                        rejectPosition()
                    }
                } else {
                    withAnimation(.spring()) {
                        offset = .zero
                        cardRotation = 0
                    }
                }
            }
    }
    
    private func acceptPosition() {
        guard let position = currentPosition else { return }
        
        withAnimation(.spring()) {
            offset = CGSize(width: screenSize.width * 2, height: 0)
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            viewModel.swipeRight(position)
            currentIndex += 1
            offset = .zero
            cardRotation = 0
        }
    }
    
    private func rejectPosition() {
        guard let position = currentPosition else { return }
        
        withAnimation(.spring()) {
            offset = CGSize(width: -screenSize.width * 2, height: 0)
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            viewModel.swipeLeft(position)
            currentIndex += 1
            offset = .zero
            cardRotation = 0
        }
    }
    
    private func saveCurrentPosition() {
        guard let position = currentPosition else { return }
        viewModel.savePosition(position)
    }
    
    private func upvotePosition() {
        guard let position = currentPosition else { return }
        viewModel.upvotePosition(position)
    }
}

// MARK: - Supporting Views

struct CircleButton: View {
    let action: () -> Void
    let systemName: String
    let color: Color
    
    var body: some View {
        Button(action: action) {
            Image(systemName: systemName)
                .font(.title)
                .foregroundColor(.white)
                .padding()
                .background(color)
                .clipShape(Circle())
                .shadow(radius: 3)
        }
    }
}

struct PositionCardView: View {
    let position: Position
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                Text(position.title)
                    .font(.title2)
                    .bold()
                Spacer()
                Text(position.urgencyLevel.rawValue)
                    .font(.caption)
                    .padding(6)
                    .background(urgencyColor)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
            
            // Role and Schedule
            HStack {
                Label(position.roleType.rawValue, systemImage: "person.fill")
                Spacer()
                Label(position.schedule.type.rawValue, systemImage: "clock.fill")
            }
            .font(.subheadline)
            .foregroundColor(.secondary)
            
            Divider()
            
            // Requirements
            VStack(alignment: .leading, spacing: 8) {
                Text("Requirements")
                    .font(.headline)
                
                ForEach(position.requirements.education, id: \.self) { education in
                    Label(education, systemImage: "checkmark.circle")
                        .font(.subheadline)
                }
                
                ForEach(position.requirements.certifications, id: \.self) { certification in
                    Label(certification, systemImage: "checkmark.circle")
                        .font(.subheadline)
                }
            }
            
            Divider()
            
            // Compensation
            VStack(alignment: .leading, spacing: 8) {
                Text("Compensation")
                    .font(.headline)
                
                HStack {
                    Text("$\(position.compensation.rate, specifier: "%.2f")")
                        .font(.title3)
                        .bold()
                    Text(position.compensation.type.rawValue)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                if !position.compensation.benefits.isEmpty {
                    Text("Benefits:")
                        .font(.subheadline)
                    ForEach(position.compensation.benefits, id: \.type) { benefit in
                        Label(benefit.type.rawValue, systemImage: "plus.circle")
                            .font(.caption)
                    }
                }
            }
            
            Spacer()
            
            // Footer
            HStack {
                Label("\(position.upvotes) upvotes", systemImage: "arrow.up.circle")
                Spacer()
                Text(formatDate(position.postedDate))
            }
            .font(.caption)
            .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(radius: 5)
    }
    
    private var urgencyColor: Color {
        switch position.urgencyLevel {
        case .low:
            return .green
        case .medium:
            return .yellow
        case .high:
            return .orange
        case .immediate:
            return .red
        }
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

struct PositionFiltersView: View {
    @Binding var filters: PositionFilters
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Role Type")) {
                    Picker("Role", selection: $filters.roleType) {
                        Text("Any").tag(Position.RoleType?.none)
                        ForEach(Position.RoleType.allCases, id: \.self) { role in
                            Text(role.rawValue).tag(Optional(role))
                        }
                    }
                }
                
                Section(header: Text("Schedule Type")) {
                    Picker("Schedule", selection: $filters.scheduleType) {
                        Text("Any").tag(Position.Schedule.ScheduleType?.none)
                        Text("Full Time").tag(Optional(Position.Schedule.ScheduleType.fullTime))
                        Text("Part Time").tag(Optional(Position.Schedule.ScheduleType.partTime))
                        Text("Temporary").tag(Optional(Position.Schedule.ScheduleType.temporary))
                    }
                }
                
                Section(header: Text("Minimum Rate")) {
                    TextField("Minimum hourly rate", value: $filters.minRate, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                }
            }
            .navigationTitle("Filters")
            .navigationBarItems(
                leading: Button("Reset") {
                    filters = PositionFilters()
                },
                trailing: Button("Done") {
                    dismiss()
                }
            )
        }
    }
}

struct SavedPositionsView: View {
    let positions: [Position]
    
    var body: some View {
        NavigationView {
            List(positions) { position in
                PositionRowView(position: position)
            }
            .navigationTitle("Saved Positions")
        }
    }
}

struct AppliedPositionsView: View {
    let positions: [Position]
    
    var body: some View {
        NavigationView {
            List(positions) { position in
                PositionRowView(position: position)
            }
            .navigationTitle("Applied Positions")
        }
    }
}

struct PositionRowView: View {
    let position: Position
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(position.title)
                .font(.headline)
            
            HStack {
                Text(position.roleType.rawValue)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                Spacer()
                Text("$\(position.compensation.rate, specifier: "%.2f")")
                    .font(.subheadline)
                    .bold()
            }
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    PositionsBoardView(educatorId: UUID())
}
