import SwiftUI

struct Job: Identifiable {
    let id: String
    let schoolName: String
    let position: EducatorType
    let location: String
    let description: String
    let requirements: [String]
    let salary: String
    let postedDate: Date
    let schoolRating: Double
    let schoolImageURL: String?
}

struct JobsView: View {
    @State private var jobs: [Job] = []
    @State private var selectedPosition: EducatorType?
    @State private var searchText = ""
    
    var filteredJobs: [Job] {
        var filtered = jobs
        
        if let position = selectedPosition {
            filtered = filtered.filter { $0.position == position }
        }
        
        if !searchText.isEmpty {
            filtered = filtered.filter {
                $0.schoolName.localizedCaseInsensitiveContains(searchText) ||
                $0.location.localizedCaseInsensitiveContains(searchText)
            }
        }
        
        return filtered
    }
    
    var body: some View {
        NavigationView {
            VStack {
                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)
                    TextField("Search schools or locations", text: $searchText)
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)
                .padding(.horizontal)
                
                // Position Filter
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(EducatorType.allCases, id: \.self) { position in
                            FilterChip(
                                title: position.rawValue,
                                isSelected: selectedPosition == position
                            ) {
                                selectedPosition = position == selectedPosition ? nil : position
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                
                // Jobs List
                List(filteredJobs) { job in
                    NavigationLink(destination: JobDetailView(job: job)) {
                        JobRowView(job: job)
                    }
                }
            }
            .navigationTitle("Available Jobs")
        }
    }
}

struct JobRowView: View {
    let job: Job
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                // School Image
                if let imageURL = job.schoolImageURL {
                    AsyncImage(url: URL(string: imageURL)) { image in
                        image
                            .resizable()
                            .scaledToFill()
                            .frame(width: 60, height: 60)
                            .clipShape(Circle())
                    } placeholder: {
                        Circle()
                            .fill(Color.gray.opacity(0.2))
                            .frame(width: 60, height: 60)
                    }
                } else {
                    Circle()
                        .fill(Color.gray.opacity(0.2))
                        .frame(width: 60, height: 60)
                }
                
                VStack(alignment: .leading) {
                    Text(job.schoolName)
                        .font(.headline)
                    Text(job.position.rawValue)
                        .font(.subheadline)
                        .foregroundColor(.blue)
                    Text(job.location)
                        .font(.subheadline)
                        .foregroundColor(.gray)
                }
                
                Spacer()
                
                VStack(alignment: .trailing) {
                    HStack {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                        Text(String(format: "%.1f", job.schoolRating))
                    }
                    Text(job.salary)
                        .font(.subheadline)
                        .foregroundColor(.green)
                }
            }
            
            Text(job.description)
                .font(.subheadline)
                .lineLimit(2)
                .foregroundColor(.gray)
            
            Text(job.postedDate, style: .relative)
                .font(.caption)
                .foregroundColor(.gray)
        }
        .padding(.vertical, 8)
    }
}

struct JobDetailView: View {
    let job: Job
    @State private var showingApplySheet = false
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header
                HStack {
                    VStack(alignment: .leading) {
                        Text(job.schoolName)
                            .font(.title)
                            .fontWeight(.bold)
                        Text(job.position.rawValue)
                            .font(.title2)
                            .foregroundColor(.blue)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing) {
                        HStack {
                            Image(systemName: "star.fill")
                                .foregroundColor(.yellow)
                            Text(String(format: "%.1f", job.schoolRating))
                        }
                        Text(job.salary)
                            .foregroundColor(.green)
                    }
                }
                
                // Location
                HStack {
                    Image(systemName: "location.fill")
                        .foregroundColor(.gray)
                    Text(job.location)
                        .foregroundColor(.gray)
                }
                
                // Description
                Text("About the Position")
                    .font(.headline)
                    .padding(.top)
                Text(job.description)
                    .foregroundColor(.gray)
                
                // Requirements
                Text("Requirements")
                    .font(.headline)
                    .padding(.top)
                ForEach(job.requirements, id: \.self) { requirement in
                    HStack(alignment: .top) {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.green)
                        Text(requirement)
                            .foregroundColor(.gray)
                    }
                }
                
                // Posted Date
                HStack {
                    Image(systemName: "clock")
                        .foregroundColor(.gray)
                    Text("Posted \(job.postedDate, style: .relative)")
                        .foregroundColor(.gray)
                }
                .padding(.top)
            }
            .padding()
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button("Apply") {
                    showingApplySheet = true
                }
            }
        }
        .sheet(isPresented: $showingApplySheet) {
            JobApplicationView(job: job)
        }
    }
}

struct JobApplicationView: View {
    let job: Job
    @Environment(\.presentationMode) var presentationMode
    @State private var coverLetter = ""
    @State private var availability = ""
    @State private var isSubmitting = false
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Cover Letter")) {
                    TextEditor(text: $coverLetter)
                        .frame(height: 200)
                }
                
                Section(header: Text("Availability")) {
                    TextEditor(text: $availability)
                        .frame(height: 100)
                }
            }
            .navigationTitle("Apply to \(job.schoolName)")
            .navigationBarItems(
                leading: Button("Cancel") {
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: Button(action: submitApplication) {
                    if isSubmitting {
                        ProgressView()
                    } else {
                        Text("Submit")
                            .bold()
                    }
                }
                .disabled(coverLetter.isEmpty || availability.isEmpty || isSubmitting)
            )
        }
    }
    
    private func submitApplication() {
        isSubmitting = true
        // Handle application submission
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            isSubmitting = false
            presentationMode.wrappedValue.dismiss()
        }
    }
}
