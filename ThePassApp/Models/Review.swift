import Foundation

struct Review: Codable, Identifiable {
    let id: String
    let reviewerId: String
    let reviewerName: String
    let reviewerImage: String?
    let rating: Double
    let comment: String
    let date: Date
    let attributes: [ReviewAttribute]
    let isVerified: Bool
    
    // For educator reviews
    var schoolName: String?
    var position: String?
    var duration: String?
    
    // For school reviews
    var subject: String?
    var gradeLevel: String?
}

struct ReviewAttribute: Codable, Identifiable {
    let id: String
    let name: String
    let rating: Double
    
    static let educatorAttributes = [
        "Communication",
        "Reliability",
        "Subject Knowledge",
        "Classroom Management",
        "Student Engagement",
        "Professionalism"
    ]
    
    static let schoolAttributes = [
        "Work Environment",
        "Support Staff",
        "Resources",
        "Professional Development",
        "Work-Life Balance",
        "Administration"
    ]
}
