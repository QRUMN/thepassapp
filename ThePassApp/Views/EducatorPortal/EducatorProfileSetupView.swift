import SwiftUI
import PhotosUI

struct EducatorProfileSetupView: View {
    @StateObject private var viewModel = EducatorProfileSetupViewModel()
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationStack {
            TabView(selection: $viewModel.currentStep) {
                // Step 1: Basic Info
                BasicInfoView(viewModel: viewModel)
                    .tag(0)
                
                // Step 2: Professional Details
                ProfessionalDetailsView(viewModel: viewModel)
                    .tag(1)
                
                // Step 3: Teaching Preferences
                TeachingPreferencesView(viewModel: viewModel)
                    .tag(2)
                
                // Step 4: Portfolio & Achievements
                PortfolioView(viewModel: viewModel)
                    .tag(3)
                
                // Step 5: Review & Submit
                ReviewProfileView(viewModel: viewModel)
                    .tag(4)
            }
            .tabViewStyle(.page)
            .navigationTitle("Create Your Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    if viewModel.currentStep > 0 {
                        Button("Back") {
                            withAnimation {
                                viewModel.currentStep -= 1
                            }
                        }
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    if viewModel.currentStep < 4 {
                        Button("Next") {
                            withAnimation {
                                viewModel.currentStep += 1
                            }
                        }
                        .disabled(!viewModel.canProceedToNextStep)
                    } else {
                        Button("Submit") {
                            Task {
                                await viewModel.submitProfile()
                            }
                        }
                        .disabled(!viewModel.isProfileComplete)
                    }
                }
            }
            .alert("Profile Created!", isPresented: $viewModel.showSuccessAlert) {
                Button("Get Started") {
                    dismiss()
                }
            } message: {
                Text("Your educator profile has been created. You can now start exploring opportunities!")
            }
        }
    }
}

// Basic Info View
struct BasicInfoView: View {
    @ObservedObject var viewModel: EducatorProfileSetupViewModel
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Profile Photo
                PhotosPicker(selection: $viewModel.selectedPhoto, matching: .images) {
                    if let profileImage = viewModel.profileImage {
                        Image(uiImage: profileImage)
                            .resizable()
                            .scaledToFill()
                            .frame(width: 120, height: 120)
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Color.blue, lineWidth: 2))
                    } else {
                        Circle()
                            .fill(Color.gray.opacity(0.2))
                            .frame(width: 120, height: 120)
                            .overlay {
                                Image(systemName: "camera.fill")
                                    .foregroundColor(.blue)
                                    .font(.system(size: 30))
                            }
                    }
                }
                .padding(.top)
                
                GroupBox("Personal Information") {
                    VStack(spacing: 15) {
                        TextField("Full Name", text: $viewModel.fullName)
                            .textFieldStyle(.roundedBorder)
                        
                        TextField("Email", text: $viewModel.email)
                            .textFieldStyle(.roundedBorder)
                            .keyboardType(.emailAddress)
                        
                        TextField("Phone", text: $viewModel.phone)
                            .textFieldStyle(.roundedBorder)
                            .keyboardType(.phonePad)
                        
                        DatePicker("Date of Birth", 
                                 selection: $viewModel.dateOfBirth,
                                 displayedComponents: .date)
                    }
                    .padding()
                }
                
                GroupBox("Bio") {
                    TextEditor(text: $viewModel.bio)
                        .frame(height: 100)
                        .padding(5)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.gray.opacity(0.2))
                        )
                        .padding()
                }
            }
            .padding()
        }
    }
}

// Professional Details View
struct ProfessionalDetailsView: View {
    @ObservedObject var viewModel: EducatorProfileSetupViewModel
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                GroupBox("Education") {
                    VStack(alignment: .leading, spacing: 15) {
                        ForEach(viewModel.educationEntries.indices, id: \.self) { index in
                            VStack(alignment: .leading) {
                                TextField("Degree", text: $viewModel.educationEntries[index].degree)
                                    .textFieldStyle(.roundedBorder)
                                TextField("Institution", text: $viewModel.educationEntries[index].institution)
                                    .textFieldStyle(.roundedBorder)
                                HStack {
                                    DatePicker("Start", selection: $viewModel.educationEntries[index].startDate, displayedComponents: .date)
                                    DatePicker("End", selection: $viewModel.educationEntries[index].endDate, displayedComponents: .date)
                                }
                            }
                            .padding(.bottom)
                            
                            if index < viewModel.educationEntries.count - 1 {
                                Divider()
                            }
                        }
                        
                        Button("Add Education") {
                            viewModel.addEducationEntry()
                        }
                    }
                    .padding()
                }
                
                GroupBox("Certifications") {
                    VStack(alignment: .leading, spacing: 15) {
                        ForEach(viewModel.certifications.indices, id: \.self) { index in
                            HStack {
                                TextField("Certification Name", text: $viewModel.certifications[index])
                                    .textFieldStyle(.roundedBorder)
                                
                                Button(action: {
                                    viewModel.certifications.remove(at: index)
                                }) {
                                    Image(systemName: "minus.circle.fill")
                                        .foregroundColor(.red)
                                }
                            }
                        }
                        
                        Button("Add Certification") {
                            viewModel.certifications.append("")
                        }
                    }
                    .padding()
                }
                
                GroupBox("Experience") {
                    VStack(alignment: .leading, spacing: 15) {
                        Picker("Years of Experience", selection: $viewModel.yearsOfExperience) {
                            ForEach(0...50, id: \.self) { year in
                                Text("\(year) years").tag(year)
                            }
                        }
                        .pickerStyle(.wheel)
                        .frame(height: 100)
                        
                        TextField("Current/Last Position", text: $viewModel.currentPosition)
                            .textFieldStyle(.roundedBorder)
                        
                        TextField("Current/Last School", text: $viewModel.currentSchool)
                            .textFieldStyle(.roundedBorder)
                    }
                    .padding()
                }
            }
            .padding()
        }
    }
}

// Teaching Preferences View
struct TeachingPreferencesView: View {
    @ObservedObject var viewModel: EducatorProfileSetupViewModel
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                GroupBox("Subject Areas") {
                    VStack(alignment: .leading, spacing: 15) {
                        ForEach(viewModel.subjectAreas.indices, id: \.self) { index in
                            HStack {
                                TextField("Subject", text: $viewModel.subjectAreas[index])
                                    .textFieldStyle(.roundedBorder)
                                
                                Button(action: {
                                    viewModel.subjectAreas.remove(at: index)
                                }) {
                                    Image(systemName: "minus.circle.fill")
                                        .foregroundColor(.red)
                                }
                            }
                        }
                        
                        Button("Add Subject") {
                            viewModel.subjectAreas.append("")
                        }
                    }
                    .padding()
                }
                
                GroupBox("Grade Levels") {
                    VStack(alignment: .leading, spacing: 10) {
                        ForEach(GradeLevel.allCases) { level in
                            Toggle(level.rawValue, isOn: $viewModel.selectedGradeLevels[level, default: false])
                        }
                    }
                    .padding()
                }
                
                GroupBox("Preferences") {
                    VStack(alignment: .leading, spacing: 15) {
                        Toggle("Available for Full-time", isOn: $viewModel.isAvailableFullTime)
                        Toggle("Available for Part-time", isOn: $viewModel.isAvailablePartTime)
                        Toggle("Available for Substitute", isOn: $viewModel.isAvailableSubstitute)
                        Toggle("Willing to Relocate", isOn: $viewModel.isWillingToRelocate)
                        
                        Picker("Preferred Location Type", selection: $viewModel.preferredLocationType) {
                            ForEach(LocationType.allCases) { type in
                                Text(type.rawValue).tag(type)
                            }
                        }
                        .pickerStyle(.segmented)
                        
                        TextField("Desired Salary Range", text: $viewModel.desiredSalaryRange)
                            .textFieldStyle(.roundedBorder)
                    }
                    .padding()
                }
            }
            .padding()
        }
    }
}

// Portfolio View
struct PortfolioView: View {
    @ObservedObject var viewModel: EducatorProfileSetupViewModel
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                GroupBox("Teaching Philosophy") {
                    TextEditor(text: $viewModel.teachingPhilosophy)
                        .frame(height: 150)
                        .padding(5)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.gray.opacity(0.2))
                        )
                        .padding()
                }
                
                GroupBox("Achievements") {
                    VStack(alignment: .leading, spacing: 15) {
                        ForEach(viewModel.achievements.indices, id: \.self) { index in
                            HStack {
                                TextField("Achievement", text: $viewModel.achievements[index])
                                    .textFieldStyle(.roundedBorder)
                                
                                Button(action: {
                                    viewModel.achievements.remove(at: index)
                                }) {
                                    Image(systemName: "minus.circle.fill")
                                        .foregroundColor(.red)
                                }
                            }
                        }
                        
                        Button("Add Achievement") {
                            viewModel.achievements.append("")
                        }
                    }
                    .padding()
                }
                
                GroupBox("Portfolio Links") {
                    VStack(alignment: .leading, spacing: 15) {
                        TextField("Personal Website", text: $viewModel.personalWebsite)
                            .textFieldStyle(.roundedBorder)
                        
                        TextField("LinkedIn Profile", text: $viewModel.linkedInProfile)
                            .textFieldStyle(.roundedBorder)
                        
                        ForEach(viewModel.portfolioLinks.indices, id: \.self) { index in
                            HStack {
                                TextField("Portfolio Link", text: $viewModel.portfolioLinks[index])
                                    .textFieldStyle(.roundedBorder)
                                
                                Button(action: {
                                    viewModel.portfolioLinks.remove(at: index)
                                }) {
                                    Image(systemName: "minus.circle.fill")
                                        .foregroundColor(.red)
                                }
                            }
                        }
                        
                        Button("Add Portfolio Link") {
                            viewModel.portfolioLinks.append("")
                        }
                    }
                    .padding()
                }
                
                GroupBox("References") {
                    VStack(alignment: .leading, spacing: 15) {
                        ForEach(viewModel.references.indices, id: \.self) { index in
                            VStack(alignment: .leading) {
                                TextField("Name", text: $viewModel.references[index].name)
                                    .textFieldStyle(.roundedBorder)
                                TextField("Position", text: $viewModel.references[index].position)
                                    .textFieldStyle(.roundedBorder)
                                TextField("Contact", text: $viewModel.references[index].contact)
                                    .textFieldStyle(.roundedBorder)
                            }
                            .padding(.bottom)
                            
                            if index < viewModel.references.count - 1 {
                                Divider()
                            }
                        }
                        
                        Button("Add Reference") {
                            viewModel.addReference()
                        }
                    }
                    .padding()
                }
            }
            .padding()
        }
    }
}

// Review Profile View
struct ReviewProfileView: View {
    @ObservedObject var viewModel: EducatorProfileSetupViewModel
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                if let profileImage = viewModel.profileImage {
                    Image(uiImage: profileImage)
                        .resizable()
                        .scaledToFill()
                        .frame(width: 120, height: 120)
                        .clipShape(Circle())
                        .overlay(Circle().stroke(Color.blue, lineWidth: 2))
                }
                
                GroupBox("Basic Information") {
                    VStack(alignment: .leading, spacing: 10) {
                        InfoRow(title: "Name", value: viewModel.fullName)
                        InfoRow(title: "Email", value: viewModel.email)
                        InfoRow(title: "Phone", value: viewModel.phone)
                        InfoRow(title: "Bio", value: viewModel.bio)
                    }
                    .padding()
                }
                
                GroupBox("Professional Details") {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Education")
                            .bold()
                        ForEach(viewModel.educationEntries) { education in
                            Text("• \(education.degree) - \(education.institution)")
                                .foregroundColor(.secondary)
                        }
                        
                        Divider()
                        
                        Text("Certifications")
                            .bold()
                        ForEach(viewModel.certifications, id: \.self) { cert in
                            Text("• \(cert)")
                                .foregroundColor(.secondary)
                        }
                        
                        Divider()
                        
                        InfoRow(title: "Experience", value: "\(viewModel.yearsOfExperience) years")
                        InfoRow(title: "Current Position", value: viewModel.currentPosition)
                        InfoRow(title: "Current School", value: viewModel.currentSchool)
                    }
                    .padding()
                }
                
                GroupBox("Teaching Preferences") {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Subject Areas")
                            .bold()
                        ForEach(viewModel.subjectAreas, id: \.self) { subject in
                            Text("• \(subject)")
                                .foregroundColor(.secondary)
                        }
                        
                        Divider()
                        
                        Text("Grade Levels")
                            .bold()
                        let selectedGrades = viewModel.selectedGradeLevels.filter { $0.value }.map { $0.key.rawValue }
                        Text(selectedGrades.joined(separator: ", "))
                            .foregroundColor(.secondary)
                        
                        Divider()
                        
                        Text("Availability")
                            .bold()
                        if viewModel.isAvailableFullTime { Text("• Full-time") }
                        if viewModel.isAvailablePartTime { Text("• Part-time") }
                        if viewModel.isAvailableSubstitute { Text("• Substitute") }
                        
                        InfoRow(title: "Willing to Relocate", value: viewModel.isWillingToRelocate ? "Yes" : "No")
                        InfoRow(title: "Preferred Location", value: viewModel.preferredLocationType.rawValue)
                        InfoRow(title: "Desired Salary", value: viewModel.desiredSalaryRange)
                    }
                    .padding()
                }
                
                GroupBox("Portfolio & Achievements") {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Teaching Philosophy")
                            .bold()
                        Text(viewModel.teachingPhilosophy)
                            .foregroundColor(.secondary)
                        
                        Divider()
                        
                        Text("Achievements")
                            .bold()
                        ForEach(viewModel.achievements, id: \.self) { achievement in
                            Text("• \(achievement)")
                                .foregroundColor(.secondary)
                        }
                        
                        if !viewModel.personalWebsite.isEmpty {
                            InfoRow(title: "Website", value: viewModel.personalWebsite)
                        }
                        if !viewModel.linkedInProfile.isEmpty {
                            InfoRow(title: "LinkedIn", value: viewModel.linkedInProfile)
                        }
                        
                        if !viewModel.portfolioLinks.isEmpty {
                            Text("Portfolio Links")
                                .bold()
                            ForEach(viewModel.portfolioLinks, id: \.self) { link in
                                Text("• \(link)")
                                    .foregroundColor(.secondary)
                            }
                        }
                        
                        if !viewModel.references.isEmpty {
                            Text("References")
                                .bold()
                            ForEach(viewModel.references) { reference in
                                Text("• \(reference.name) - \(reference.position)")
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    .padding()
                }
            }
            .padding()
        }
    }
}

struct InfoRow: View {
    let title: String
    let value: String
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(title)
                .bold()
            Text(value)
                .foregroundColor(.secondary)
        }
    }
}
