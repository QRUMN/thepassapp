import Foundation
import Combine

class ReviewViewModel: ObservableObject {
    @Published var reviews: [Review] = []
    @Published var isLoading = false
    @Published var error: String?
    @Published var averageRating: Double = 0.0
    @Published var attributeAverages: [String: Double] = [:]
    @Published var ratingDistribution: [Int: Int] = [:] // 1-5 stars: count
    
    private var cancellables = Set<AnyCancellable>()
    
    func loadReviews(for userId: String, userType: UserType) {
        isLoading = true
        
        // Simulated API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.reviews = self.generateDemoReviews(for: userType)
            self.calculateStatistics()
            self.isLoading = false
        }
    }
    
    func submitReview(userId: String, rating: Double, comment: String, attributes: [ReviewAttribute], 
                     additionalInfo: [String: String]) {
        isLoading = true
        
        let review = Review(
            id: UUID().uuidString,
            reviewerId: "current-user-id",
            reviewerName: "Current User",
            reviewerImage: nil,
            rating: rating,
            comment: comment,
            date: Date(),
            attributes: attributes,
            isVerified: true,
            schoolName: additionalInfo["schoolName"],
            position: additionalInfo["position"],
            duration: additionalInfo["duration"],
            subject: additionalInfo["subject"],
            gradeLevel: additionalInfo["gradeLevel"]
        )
        
        // Simulated API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.reviews.insert(review, at: 0)
            self.calculateStatistics()
            self.isLoading = false
        }
    }
    
    private func calculateStatistics() {
        // Calculate average rating
        averageRating = reviews.reduce(0.0) { $0 + $1.rating } / Double(reviews.count)
        
        // Calculate attribute averages
        var attributeSums: [String: (total: Double, count: Int)] = [:]
        reviews.forEach { review in
            review.attributes.forEach { attribute in
                let current = attributeSums[attribute.name] ?? (total: 0, count: 0)
                attributeSums[attribute.name] = (
                    total: current.total + attribute.rating,
                    count: current.count + 1
                )
            }
        }
        
        attributeAverages = attributeSums.mapValues { $0.total / Double($0.count) }
        
        // Calculate rating distribution
        ratingDistribution = reviews.reduce(into: [:]) { counts, review in
            let rating = Int(round(review.rating))
            counts[rating, default: 0] += 1
        }
    }
    
    private func generateDemoReviews(for userType: UserType) -> [Review] {
        let isEducator = userType == .educator
        let attributes = isEducator ? ReviewAttribute.educatorAttributes : ReviewAttribute.schoolAttributes
        
        return [
            Review(
                id: "1",
                reviewerId: "reviewer1",
                reviewerName: isEducator ? "Lincoln High School" : "John Smith",
                reviewerImage: nil,
                rating: 4.8,
                comment: isEducator ? 
                    "Excellent teacher who consistently goes above and beyond. Students love their engaging teaching style." :
                    "Great work environment with supportive administration and excellent resources.",
                date: Date().addingTimeInterval(-86400), // 1 day ago
                attributes: attributes.map { attr in
                    ReviewAttribute(
                        id: UUID().uuidString,
                        name: attr,
                        rating: Double.random(in: 4.0...5.0)
                    )
                },
                isVerified: true,
                schoolName: isEducator ? "Lincoln High School" : nil,
                position: isEducator ? "Math Teacher" : nil,
                duration: isEducator ? "2021-2023" : nil,
                subject: isEducator ? nil : "Mathematics",
                gradeLevel: isEducator ? nil : "High School"
            ),
            Review(
                id: "2",
                reviewerId: "reviewer2",
                reviewerName: isEducator ? "Washington Middle School" : "Sarah Johnson",
                reviewerImage: nil,
                rating: 4.5,
                comment: isEducator ?
                    "Very reliable and professional. Strong classroom management skills." :
                    "Collaborative environment with great professional development opportunities.",
                date: Date().addingTimeInterval(-172800), // 2 days ago
                attributes: attributes.map { attr in
                    ReviewAttribute(
                        id: UUID().uuidString,
                        name: attr,
                        rating: Double.random(in: 4.0...5.0)
                    )
                },
                isVerified: true,
                schoolName: isEducator ? "Washington Middle School" : nil,
                position: isEducator ? "Science Teacher" : nil,
                duration: isEducator ? "2020-2021" : nil,
                subject: isEducator ? nil : "Science",
                gradeLevel: isEducator ? nil : "Middle School"
            )
        ]
    }
}
