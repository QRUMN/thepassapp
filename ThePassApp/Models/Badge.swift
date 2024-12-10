import Foundation

struct Badge: Codable, Identifiable {
    let id: String
    let name: String
    let description: String
    let imageURL: String?
    let dateEarned: Date
    let category: BadgeCategory
    
    enum BadgeCategory: String, Codable {
        case achievement  // For completing specific milestones
        case certification  // For verified certifications
        case experience  // For years of experience
        case rating  // For maintaining high ratings
        case specialization  // For specific subject expertise
    }
}
