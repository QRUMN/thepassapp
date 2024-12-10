import Foundation

enum UserType: String, Codable {
    case school
    case educator
}

struct User: Identifiable, Codable {
    let id: String
    var email: String
    var fullName: String
    var userType: UserType
    var profileImageURL: String?
    var bio: String?
    var location: String?
    var rating: Double
    var reviewCount: Int
    var badges: [Badge]?
    var specialties: [String]?
    var createdAt: Date
    var lastActive: Date
    
    // School-specific properties
    var schoolName: String?
    var schoolType: String?
    var schoolSize: Int?
    
    // Educator-specific properties
    var yearsOfExperience: Int?
    var education: String?
    var certifications: [String]?
    var preferredGradeLevels: [String]?
    var availability: [String]?
}

struct Review: Codable {
    var id: String
    var reviewerId: String
    var rating: Double
    var comment: String
    var date: Date
    var attributes: [String: Double]
}

struct Badge: Codable {
    var id: String
    var name: String
    var description: String
    var dateEarned: Date
}
