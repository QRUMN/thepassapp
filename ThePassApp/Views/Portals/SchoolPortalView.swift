import SwiftUI

struct SchoolPortalView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var candidateViewModel = CandidateViewModel()
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Candidate Discovery
            CandidateDiscoveryView(viewModel: candidateViewModel)
                .tabItem {
                    Image(systemName: "person.2.fill")
                    Text("Candidates")
                }
                .tag(0)
            
            // Active Jobs
            ActiveJobsView()
                .tabItem {
                    Image(systemName: "briefcase.fill")
                    Text("Jobs")
                }
                .tag(1)
            
            // Messages
            MessagesView()
                .tabItem {
                    Image(systemName: "message.fill")
                    Text("Messages")
                }
                .tag(2)
            
            // School Profile
            SchoolProfileView()
                .tabItem {
                    Image(systemName: "building.2.fill")
                    Text("Profile")
                }
                .tag(3)
        }
        .accentColor(.blue)
    }
}

struct CandidateDiscoveryView: View {
    @ObservedObject var viewModel: CandidateViewModel
    @State private var showingFilters = false
    
    var body: some View {
        NavigationView {
            VStack {
                // Search and Filter Bar
                HStack {
                    SearchBar(text: $viewModel.searchText)
                    Button(action: { showingFilters.toggle() }) {
                        Image(systemName: "slider.horizontal.3")
                            .foregroundColor(.blue)
                    }
                }
                .padding()
                
                // Candidate Cards
                ScrollView {
                    LazyVStack(spacing: 16) {
                        ForEach(viewModel.filteredCandidates) { candidate in
                            CandidateCardView(candidate: candidate)
                                .padding(.horizontal)
                        }
                    }
                }
            }
            .navigationTitle("Discover Educators")
            .sheet(isPresented: $showingFilters) {
                CandidateFiltersView(viewModel: viewModel)
            }
        }
    }
}

struct CandidateCardView: View {
    let candidate: User
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                AsyncImage(url: URL(string: candidate.profileImageURL ?? "")) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Image(systemName: "person.circle.fill")
                        .resizable()
                }
                .frame(width: 60, height: 60)
                .clipShape(Circle())
                
                VStack(alignment: .leading) {
                    Text(candidate.fullName)
                        .font(.headline)
                    HStack {
                        ForEach(candidate.specialties ?? [], id: \.self) { specialty in
                            Text(specialty)
                                .font(.caption)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.blue.opacity(0.1))
                                .cornerRadius(12)
                        }
                    }
                }
            }
            
            if let yearsExp = candidate.yearsOfExperience {
                Label("\(yearsExp) years experience", systemImage: "clock.fill")
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }
            
            if let certifications = candidate.certifications {
                Text("Certifications: \(certifications.joined(separator: ", "))")
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }
            
            HStack {
                RatingView(rating: candidate.rating)
                Text("(\(candidate.reviewCount) reviews)")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
            if let availability = candidate.availability {
                Text("Available: \(availability.joined(separator: ", "))")
                    .font(.caption)
                    .foregroundColor(.green)
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(10)
        .shadow(radius: 2)
    }
}

struct RatingView: View {
    let rating: Double
    
    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<5) { index in
                Image(systemName: index < Int(rating) ? "star.fill" : "star")
                    .foregroundColor(.yellow)
            }
            Text(String(format: "%.1f", rating))
                .font(.caption)
                .foregroundColor(.gray)
        }
    }
}
