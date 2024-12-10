import Foundation
import Combine

class CandidateViewModel: ObservableObject {
    @Published var candidates: [User] = []
    @Published var searchText = ""
    @Published var filters = CandidateFilters()
    @Published var isLoading = false
    @Published var error: String?
    
    var filteredCandidates: [User] {
        candidates.filter { candidate in
            let matchesSearch = searchText.isEmpty || 
                candidate.fullName.localizedCaseInsensitiveContains(searchText) ||
                (candidate.specialties?.contains { $0.localizedCaseInsensitiveContains(searchText) } ?? false)
            
            let matchesExperience = candidate.yearsOfExperience ?? 0 >= filters.minimumExperience
            
            let matchesCertifications = filters.requiredCertifications.isEmpty ||
                (candidate.certifications?.contains { cert in
                    filters.requiredCertifications.contains(cert)
                } ?? false)
            
            let matchesAvailability = filters.availability.isEmpty ||
                (candidate.availability?.contains { avail in
                    filters.availability.contains(avail)
                } ?? false)
            
            return matchesSearch && matchesExperience && matchesCertifications && matchesAvailability
        }
    }
    
    // Demo data
    func loadCandidates() {
        isLoading = true
        
        // Simulated API call delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.candidates = [
                User(id: "1",
                     email: "john.doe@example.com",
                     fullName: "John Doe",
                     userType: .educator,
                     profileImageURL: nil,
                     bio: "Experienced math teacher with a passion for education",
                     location: "San Francisco, CA",
                     rating: 4.8,
                     reviewCount: 15,
                     badges: [],
                     specialties: ["Mathematics", "Physics"],
                     createdAt: Date(),
                     lastActive: Date(),
                     yearsOfExperience: 5,
                     education: "M.Ed. in Mathematics Education",
                     certifications: ["Mathematics Teaching Credential"],
                     preferredGradeLevels: ["High School"],
                     availability: ["Full-time", "Immediate"]),
                
                User(id: "2",
                     email: "sarah.smith@example.com",
                     fullName: "Sarah Smith",
                     userType: .educator,
                     profileImageURL: nil,
                     bio: "Special education teacher specializing in early childhood development",
                     location: "Oakland, CA",
                     rating: 4.9,
                     reviewCount: 23,
                     badges: [],
                     specialties: ["Special Education", "Early Childhood"],
                     createdAt: Date(),
                     lastActive: Date(),
                     yearsOfExperience: 8,
                     education: "M.A. in Special Education",
                     certifications: ["Special Education Credential", "Early Childhood Education"],
                     preferredGradeLevels: ["Elementary"],
                     availability: ["Full-time", "Part-time"])
            ]
            
            self.isLoading = false
        }
    }
    
    func contactCandidate(candidateId: String) {
        isLoading = true
        
        // Simulated API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            // In a real app, this would initiate a conversation or send a message
            print("Contacted candidate: \(candidateId)")
            self.isLoading = false
        }
    }
}

struct CandidateFilters {
    var minimumExperience: Int = 0
    var requiredCertifications: Set<String> = []
    var availability: Set<String> = []
    
    mutating func reset() {
        minimumExperience = 0
        requiredCertifications.removeAll()
        availability.removeAll()
    }
}
