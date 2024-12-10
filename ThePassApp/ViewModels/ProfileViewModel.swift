import Foundation
import Combine

class ProfileViewModel: ObservableObject {
    @Published var currentUser: User?
    @Published var error: String?
    @Published var isLoading = false
    
    // Temporary in-memory storage
    private var reviews: [String: [Review]] = [:]
    
    func updateProfile(user: User) {
        isLoading = true
        // Demo update
        self.currentUser = user
        isLoading = false
    }
    
    func uploadProfileImage(_ image: Data) {
        isLoading = true
        // Demo image upload - just simulate a delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) { [weak self] in
            self?.isLoading = false
        }
    }
    
    func submitReview(for userId: String, rating: Double, comment: String, attributes: [String: Double]) {
        isLoading = true
        
        let review = Review(
            id: UUID().uuidString,
            reviewerId: "currentUserId",
            rating: rating,
            comment: comment,
            date: Date(),
            attributes: attributes
        )
        
        // Add review to in-memory storage
        var userReviews = reviews[userId] ?? []
        userReviews.append(review)
        reviews[userId] = userReviews
        
        // Update user rating
        if var updatedUser = currentUser {
            let averageRating = userReviews.reduce(0.0) { $0 + $1.rating } / Double(userReviews.count)
            updatedUser.rating = averageRating
            updatedUser.reviewCount = userReviews.count
            currentUser = updatedUser
        }
        
        isLoading = false
    }
}
