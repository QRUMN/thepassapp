import Foundation
import Combine

class PositionsBoardViewModel: ObservableObject {
    // MARK: - Published Properties
    
    @Published private(set) var positions: [Position] = []
    @Published private(set) var savedPositions: [Position] = []
    @Published private(set) var appliedPositions: [Position] = []
    @Published private(set) var matches: [PositionMatch] = []
    @Published private(set) var interactions: [PositionInteraction] = []
    
    @Published var selectedFilters: PositionFilters = PositionFilters()
    @Published var sortOption: SortOption = .datePosted
    @Published var searchText: String = ""
    
    // MARK: - Private Properties
    
    private var cancellables = Set<AnyCancellable>()
    private let educatorId: UUID
    
    // MARK: - Initialization
    
    init(educatorId: UUID) {
        self.educatorId = educatorId
        setupSubscriptions()
        loadPositions()
    }
    
    // MARK: - Position Management
    
    func loadPositions() {
        // TODO: Load positions from API
        // For now, using mock data
        positions = mockPositions()
        filterAndSortPositions()
    }
    
    func upvotePosition(_ position: Position) {
        guard let index = positions.firstIndex(where: { $0.id == position.id }) else { return }
        
        // Create interaction
        let interaction = PositionInteraction(
            id: UUID(),
            positionId: position.id,
            educatorId: educatorId,
            type: .upvote,
            timestamp: Date(),
            status: .active
        )
        
        // Update position
        var updatedPosition = position
        updatedPosition.upvotes += 1
        positions[index] = updatedPosition
        
        // Save interaction
        interactions.append(interaction)
        
        // TODO: Sync with backend
    }
    
    func removeUpvote(_ position: Position) {
        guard let index = positions.firstIndex(where: { $0.id == position.id }) else { return }
        
        // Update interaction status
        if let interactionIndex = interactions.firstIndex(where: {
            $0.positionId == position.id &&
            $0.educatorId == educatorId &&
            $0.type == .upvote &&
            $0.status == .active
        }) {
            interactions[interactionIndex].status = .removed
        }
        
        // Update position
        var updatedPosition = position
        updatedPosition.upvotes -= 1
        positions[index] = updatedPosition
        
        // TODO: Sync with backend
    }
    
    func savePosition(_ position: Position) {
        let interaction = PositionInteraction(
            id: UUID(),
            positionId: position.id,
            educatorId: educatorId,
            type: .save,
            timestamp: Date(),
            status: .active
        )
        
        savedPositions.append(position)
        interactions.append(interaction)
        
        // TODO: Sync with backend
    }
    
    func applyToPosition(_ position: Position) {
        let interaction = PositionInteraction(
            id: UUID(),
            positionId: position.id,
            educatorId: educatorId,
            type: .apply,
            timestamp: Date(),
            status: .active
        )
        
        appliedPositions.append(position)
        interactions.append(interaction)
        
        // TODO: Sync with backend
    }
    
    func swipeRight(_ position: Position) {
        // Create match
        let match = createMatch(for: position)
        matches.append(match)
        
        // Apply to position
        applyToPosition(position)
    }
    
    func swipeLeft(_ position: Position) {
        // Create interaction to hide position
        let interaction = PositionInteraction(
            id: UUID(),
            positionId: position.id,
            educatorId: educatorId,
            type: .view,
            timestamp: Date(),
            status: .hidden
        )
        
        interactions.append(interaction)
        
        // Remove position from current stack
        positions.removeAll { $0.id == position.id }
    }
    
    // MARK: - Filtering and Sorting
    
    private func filterAndSortPositions() {
        var filteredPositions = positions
        
        // Apply filters
        if let roleType = selectedFilters.roleType {
            filteredPositions = filteredPositions.filter { $0.roleType == roleType }
        }
        
        if let scheduleType = selectedFilters.scheduleType {
            filteredPositions = filteredPositions.filter { $0.schedule.type == scheduleType }
        }
        
        if let minRate = selectedFilters.minRate {
            filteredPositions = filteredPositions.filter { $0.compensation.rate >= minRate }
        }
        
        // Apply search
        if !searchText.isEmpty {
            filteredPositions = filteredPositions.filter {
                $0.title.localizedCaseInsensitiveContains(searchText) ||
                $0.roleType.rawValue.localizedCaseInsensitiveContains(searchText)
            }
        }
        
        // Apply sorting
        filteredPositions.sort { first, second in
            switch sortOption {
            case .datePosted:
                return first.postedDate > second.postedDate
            case .upvotes:
                return first.upvotes > second.upvotes
            case .urgency:
                return first.urgencyLevel.rawValue > second.urgencyLevel.rawValue
            case .matchScore:
                let firstScore = getMatchScore(for: first)
                let secondScore = getMatchScore(for: second)
                return firstScore > secondScore
            }
        }
        
        // Update positions
        positions = filteredPositions
    }
    
    // MARK: - Helper Methods
    
    private func setupSubscriptions() {
        // Update positions when filters change
        Publishers.CombineLatest3($selectedFilters, $sortOption, $searchText)
            .debounce(for: .milliseconds(300), scheduler: DispatchQueue.main)
            .sink { [weak self] _, _, _ in
                self?.filterAndSortPositions()
            }
            .store(in: &cancellables)
    }
    
    private func createMatch(for position: Position) -> PositionMatch {
        return PositionMatch(
            id: UUID(),
            positionId: position.id,
            educatorId: educatorId,
            matchScore: getMatchScore(for: position),
            matchDate: Date(),
            status: .pending
        )
    }
    
    private func getMatchScore(for position: Position) -> Int {
        // TODO: Implement actual matching algorithm
        return Int.random(in: 0...100)
    }
    
    private func mockPositions() -> [Position] {
        // TODO: Replace with actual data
        return []
    }
}

// MARK: - Supporting Types

struct PositionFilters: Equatable {
    var roleType: Position.RoleType?
    var scheduleType: Position.Schedule.ScheduleType?
    var minRate: Decimal?
    var maxDistance: Double?
    var requirementLevels: [Position.Requirements.ExperienceLevel] = []
}

enum SortOption {
    case datePosted
    case upvotes
    case urgency
    case matchScore
}
