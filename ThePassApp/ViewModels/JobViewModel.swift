import Foundation
import Combine

class JobViewModel: ObservableObject {
    @Published var jobs: [Job] = []
    @Published var searchText = ""
    @Published var filters = JobFilters()
    @Published var isLoading = false
    @Published var error: String?
    
    var filteredJobs: [Job] {
        jobs.filter { job in
            let matchesSearch = searchText.isEmpty || 
                job.title.localizedCaseInsensitiveContains(searchText) ||
                job.description.localizedCaseInsensitiveContains(searchText) ||
                job.schoolName.localizedCaseInsensitiveContains(searchText)
            
            let matchesType = filters.selectedTypes.isEmpty || 
                filters.selectedTypes.contains(job.type)
            
            let matchesSalary = job.salary >= filters.salaryRange.lowerBound &&
                job.salary <= filters.salaryRange.upperBound
            
            let matchesLocation = filters.selectedLocations.isEmpty ||
                filters.selectedLocations.contains(job.location)
            
            return matchesSearch && matchesType && matchesSalary && matchesLocation
        }
    }
    
    // Demo data
    func loadJobs() {
        isLoading = true
        
        // Simulated API call delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.jobs = [
                Job(id: "1", 
                    title: "Math Teacher",
                    description: "Looking for an experienced math teacher for high school algebra and calculus",
                    type: .fullTime,
                    schoolName: "Lincoln High School",
                    location: "San Francisco, CA",
                    salary: 75000,
                    requirements: ["Teaching credential", "3+ years experience"],
                    postedDate: Date().addingTimeInterval(-86400)), // 1 day ago
                
                Job(id: "2",
                    title: "Substitute Teacher",
                    description: "Seeking substitute teachers for various subjects",
                    type: .substitute,
                    schoolName: "Washington Middle School",
                    location: "San Francisco, CA",
                    salary: 200, // per day
                    requirements: ["Teaching credential"],
                    postedDate: Date()),
                
                Job(id: "3",
                    title: "Special Education Teacher",
                    description: "Special education teacher needed for elementary school",
                    type: .fullTime,
                    schoolName: "Roosevelt Elementary",
                    location: "Oakland, CA",
                    salary: 80000,
                    requirements: ["Special Education Credential", "5+ years experience"],
                    postedDate: Date().addingTimeInterval(-172800)) // 2 days ago
            ]
            
            self.isLoading = false
        }
    }
    
    func applyForJob(jobId: String) {
        isLoading = true
        
        // Simulated API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            // In a real app, this would send the application to the backend
            print("Applied for job: \(jobId)")
            self.isLoading = false
        }
    }
}

struct JobFilters {
    var selectedTypes: Set<JobType> = []
    var salaryRange: ClosedRange<Double> = 0...200000
    var selectedLocations: Set<String> = []
    
    mutating func reset() {
        selectedTypes.removeAll()
        salaryRange = 0...200000
        selectedLocations.removeAll()
    }
}
