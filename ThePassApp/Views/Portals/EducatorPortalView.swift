import SwiftUI

struct EducatorPortalView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var jobViewModel = JobViewModel()
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Available Jobs Feed
            JobsFeedView(viewModel: jobViewModel)
                .tabItem {
                    Image(systemName: "briefcase.fill")
                    Text("Jobs")
                }
                .tag(0)
            
            // Applications & Status
            ApplicationsView()
                .tabItem {
                    Image(systemName: "doc.text.fill")
                    Text("Applications")
                }
                .tag(1)
            
            // Messages
            MessagesView()
                .tabItem {
                    Image(systemName: "message.fill")
                    Text("Messages")
                }
                .tag(2)
            
            // Profile
            EducatorProfileView()
                .tabItem {
                    Image(systemName: "person.fill")
                    Text("Profile")
                }
                .tag(3)
        }
        .accentColor(.blue)
    }
}

struct JobsFeedView: View {
    @ObservedObject var viewModel: JobViewModel
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
                
                // Job Cards List
                ScrollView {
                    LazyVStack(spacing: 16) {
                        ForEach(viewModel.filteredJobs) { job in
                            JobCardView(job: job)
                                .padding(.horizontal)
                        }
                    }
                }
            }
            .navigationTitle("Available Jobs")
            .sheet(isPresented: $showingFilters) {
                JobFiltersView(viewModel: viewModel)
            }
        }
    }
}

struct SearchBar: View {
    @Binding var text: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.gray)
            
            TextField("Search jobs...", text: $text)
                .textFieldStyle(RoundedBorderTextFieldStyle())
        }
    }
}

struct JobCardView: View {
    let job: Job
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text(job.title)
                    .font(.headline)
                Spacer()
                Text(job.type.rawValue)
                    .font(.subheadline)
                    .foregroundColor(.blue)
            }
            
            Text(job.schoolName)
                .font(.subheadline)
                .foregroundColor(.gray)
            
            HStack {
                Image(systemName: "mappin.circle.fill")
                Text(job.location)
            }
            .font(.subheadline)
            .foregroundColor(.gray)
            
            Text(job.description)
                .font(.body)
                .lineLimit(3)
            
            HStack {
                Label("\(job.salary)", systemImage: "dollarsign.circle.fill")
                Spacer()
                Text(job.postedDate.timeAgo())
                    .font(.caption)
                    .foregroundColor(.gray)
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(10)
        .shadow(radius: 2)
    }
}
