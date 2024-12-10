import Foundation

enum JobType: String, Codable {
    case fullTime = "Full-time"
    case partTime = "Part-time"
    case substitute = "Substitute"
    case contract = "Contract"
}

struct Job: Identifiable, Codable {
    let id: String
    let title: String
    let description: String
    let type: JobType
    let schoolName: String
    let location: String
    let salary: Double
    let requirements: [String]
    let postedDate: Date
    
    // Optional fields
    var benefits: [String]?
    var startDate: Date?
    var endDate: Date?  // For contract positions
    var numberOfOpenings: Int?
    var applicationDeadline: Date?
    var contactEmail: String?
    var preferredQualifications: [String]?
}

extension Date {
    func timeAgo() -> String {
        let calendar = Calendar.current
        let now = Date()
        let components = calendar.dateComponents([.year, .month, .day, .hour, .minute], from: self, to: now)
        
        if let year = components.year, year >= 1 {
            return year == 1 ? "1 year ago" : "\(year) years ago"
        }
        
        if let month = components.month, month >= 1 {
            return month == 1 ? "1 month ago" : "\(month) months ago"
        }
        
        if let day = components.day, day >= 1 {
            return day == 1 ? "1 day ago" : "\(day) days ago"
        }
        
        if let hour = components.hour, hour >= 1 {
            return hour == 1 ? "1 hour ago" : "\(hour) hours ago"
        }
        
        if let minute = components.minute, minute >= 1 {
            return minute == 1 ? "1 minute ago" : "\(minute) minutes ago"
        }
        
        return "Just now"
    }
}
