import SwiftUI
import PhotosUI

class EducatorProfileSetupViewModel: ObservableObject {
    // Navigation
    @Published var currentStep = 0
    @Published var showSuccessAlert = false
    
    // Basic Info
    @Published var selectedPhoto: PhotosPickerItem? {
        didSet { Task { await loadImage() } }
    }
    @Published var profileImage: UIImage?
    @Published var fullName = ""
    @Published var email = ""
    @Published var phone = ""
    @Published var dateOfBirth = Date()
    @Published var bio = ""
    
    // Role Selection
    @Published var primaryRole = EducationalRole.teacher
    @Published var secondaryRoles: Set<EducationalRole> = []
    @Published var specializations: [String] = []
    
    // Professional Details
    @Published var educationEntries: [EducationEntry] = [EducationEntry()]
    @Published var certifications: [String] = [""]
    @Published var licenses: [License] = []
    @Published var yearsOfExperience = 0
    @Published var currentPosition = ""
    @Published var currentSchool = ""
    
    // Role-Specific Qualifications
    @Published var clinicalCredentials: [Credential] = []
    @Published var specialEducationCertifications: [String] = []
    @Published var administrativeExperience: [String] = []
    @Published var technicalSkills: [String] = []
    @Published var languages: [String] = []
    
    // Schedule & Availability
    @Published var availabilityType = AvailabilityType.fullTime
    @Published var availableShifts: Set<WorkShift> = []
    @Published var startDate = Date()
    @Published var isImmediatelyAvailable = false
    @Published var preferredHoursPerWeek: Int = 40
    @Published var seasonalAvailability: Set<Season> = []
    
    // Teaching Preferences
    @Published var subjectAreas: [String] = [""]
    @Published var selectedGradeLevels: [GradeLevel: Bool] = [:]
    @Published var isWillingToRelocate = false
    @Published var preferredLocationType: LocationType = .urban
    @Published var desiredSalaryRange = ""
    @Published var specialPopulationExperience: Set<SpecialPopulation> = []
    
    // Portfolio
    @Published var teachingPhilosophy = ""
    @Published var achievements: [String] = []
    @Published var personalWebsite = ""
    @Published var linkedInProfile = ""
    @Published var portfolioLinks: [String] = []
    @Published var references: [Reference] = []
    
    var canProceedToNextStep: Bool {
        switch currentStep {
        case 0:
            return !fullName.isEmpty && !email.isEmpty && !phone.isEmpty
        case 1:
            return !educationEntries.isEmpty && !currentPosition.isEmpty
        case 2:
            return validateRoleSpecificRequirements()
        case 3:
            return !teachingPhilosophy.isEmpty
        default:
            return true
        }
    }
    
    private func validateRoleSpecificRequirements() -> Bool {
        switch primaryRole {
        case .teacher, .substituteTeacher:
            return !subjectAreas.isEmpty && selectedGradeLevels.values.contains(true)
        case .clinician, .therapist, .nurse:
            return !clinicalCredentials.isEmpty && clinicalCredentials.allSatisfy { $0.isValid }
        case .administrator, .principal:
            return !administrativeExperience.isEmpty
        case .aide, .assistant:
            return true // Less stringent requirements
        case .specialist:
            return !specializations.isEmpty
        case .support:
            return true // Basic requirements only
        }
    }
    
    var isProfileComplete: Bool {
        return !fullName.isEmpty &&
            !email.isEmpty &&
            !phone.isEmpty &&
            validateRoleSpecificRequirements() &&
            !currentPosition.isEmpty &&
            availabilityType != nil &&
            !availableShifts.isEmpty
    }
    
    func addEducationEntry() {
        educationEntries.append(EducationEntry())
    }
    
    func addReference() {
        references.append(Reference())
    }
    
    func addLicense() {
        licenses.append(License())
    }
    
    func addCredential() {
        clinicalCredentials.append(Credential())
    }
    
    private func loadImage() async {
        guard let item = selectedPhoto else { return }
        guard let data = try? await item.loadTransferable(type: Data.self) else { return }
        guard let image = UIImage(data: data) else { return }
        
        await MainActor.run {
            profileImage = image
        }
    }
    
    @MainActor
    func submitProfile() async {
        // TODO: Implement API call to submit profile
        showSuccessAlert = true
    }
}

// Models
struct EducationEntry: Identifiable {
    let id = UUID()
    var degree = ""
    var institution = ""
    var startDate = Date()
    var endDate = Date()
}

struct Reference: Identifiable {
    let id = UUID()
    var name = ""
    var position = ""
    var contact = ""
}

struct License: Identifiable {
    let id = UUID()
    var type = ""
    var number = ""
    var state = ""
    var expirationDate = Date()
    var isActive = true
}

struct Credential: Identifiable {
    let id = UUID()
    var name = ""
    var issuingBody = ""
    var dateObtained = Date()
    var expirationDate = Date()
    var verificationURL = ""
    
    var isValid: Bool {
        return !name.isEmpty && !issuingBody.isEmpty && expirationDate > Date()
    }
}

// Enums
enum EducationalRole: String, CaseIterable, Identifiable {
    // Teaching Staff
    case teacher = "Teacher"
    case substituteTeacher = "Substitute Teacher"
    case specialEducationTeacher = "Special Education Teacher"
    case headStartTeacher = "Head Start Teacher"
    
    // Administrative
    case administrator = "Administrator"
    case principal = "Principal"
    case administrativeAssistant = "Administrative Assistant"
    case secretary = "Secretary"
    case receptionist = "Receptionist"
    
    // Specialists
    case specialist = "Specialist"
    case readingSpecialist = "Reading Specialist"
    case mediaSpecialist = "Media Center Specialist"
    case itSpecialist = "IT Specialist"
    case educationalInterpreter = "Educational Interpreter"
    
    // Clinical Staff
    case clinician = "Clinician"
    case counselor = "School Counselor"
    case nurse = "School Nurse"
    case therapist = "Therapist"
    
    // Support Staff
    case aide = "Aide"
    case assistant = "Assistant"
    case paraprofessional = "Paraprofessional"
    case support = "Support Staff"
    
    // Program Staff
    case beforeAfterSchool = "Before & After School Staff"
    case summerProgram = "Summer Program Staff"
    case foodService = "Food Service Worker"
    case transportation = "Transportation Staff"
    case hallMonitor = "Hall Monitor"
    case libraryStaff = "Library Staff"
    
    var id: String { self.rawValue }
}

enum GradeLevel: String, CaseIterable, Identifiable {
    case earlyChildhood = "Early Childhood"
    case preK = "Pre-K"
    case elementary = "Elementary"
    case middleSchool = "Middle School"
    case highSchool = "High School"
    case special = "Special Education"
    
    var id: String { self.rawValue }
}

enum LocationType: String, CaseIterable, Identifiable {
    case urban = "Urban"
    case suburban = "Suburban"
    case rural = "Rural"
    
    var id: String { self.rawValue }
}

enum AvailabilityType: String, CaseIterable, Identifiable {
    case fullTime = "Full-Time"
    case partTime = "Part-Time"
    case substitute = "Substitute"
    case seasonal = "Seasonal"
    case contract = "Contract"
    
    var id: String { self.rawValue }
}

enum WorkShift: String, CaseIterable, Identifiable {
    case morning = "Morning"
    case afternoon = "Afternoon"
    case evening = "Evening"
    case beforeSchool = "Before School"
    case afterSchool = "After School"
    case weekends = "Weekends"
    
    var id: String { self.rawValue }
}

enum Season: String, CaseIterable, Identifiable {
    case schoolYear = "School Year"
    case summer = "Summer"
    case fall = "Fall"
    case winter = "Winter"
    case spring = "Spring"
    
    var id: String { self.rawValue }
}

enum SpecialPopulation: String, CaseIterable, Identifiable {
    case esl = "ESL/ELL"
    case specialNeeds = "Special Needs"
    case gifted = "Gifted & Talented"
    case atrisk = "At-Risk"
    case earlyIntervention = "Early Intervention"
    case behavioral = "Behavioral Support"
    
    var id: String { self.rawValue }
}
