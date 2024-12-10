import SwiftUI

struct SwipeableCardStack: View {
    @ObservedObject var viewModel: CandidateViewModel
    @State private var currentIndex = 0
    @State private var showingFilters = false
    @State private var showingProfile = false
    @State private var selectedCandidate: User?
    @State private var showHireConfirmation = false
    @State private var educatorToHire: User? = nil
    
    private let maxVisibleCards = 3
    private let cardOffset: CGFloat = 8
    
    var body: some View {
        ZStack {
            // Background
            Color.gray.opacity(0.1)
                .edgesIgnoringSafeArea(.all)
            
            VStack {
                // Top Bar
                HStack {
                    Button(action: { showingFilters.toggle() }) {
                        Image(systemName: "slider.horizontal.3")
                            .font(.title2)
                            .foregroundColor(.blue)
                    }
                    
                    Spacer()
                    
                    Text("Discover Educators")
                        .font(.headline)
                    
                    Spacer()
                    
                    Button(action: { viewModel.loadCandidates() }) {
                        Image(systemName: "arrow.clockwise")
                            .font(.title2)
                            .foregroundColor(.blue)
                    }
                }
                .padding()
                
                // Action Buttons
                HStack(spacing: 20) {
                    Button(action: { handleSwipe(.down) }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 42))
                            .foregroundColor(.red)
                    }
                    
                    Button(action: { 
                        if let candidate = viewModel.filteredCandidates.first {
                            educatorToHire = candidate
                            showHireConfirmation = true
                        }
                    }) {
                        VStack {
                            Image(systemName: "checkmark.seal.fill")
                                .font(.system(size: 42))
                                .foregroundColor(.green)
                            Text("Hire")
                                .font(.caption)
                                .bold()
                                .foregroundColor(.green)
                        }
                    }
                }
                .padding(.top)
                
                Spacer()
                
                // Card Stack
                ZStack {
                    ForEach(visibleCandidates.indices.reversed(), id: \.self) { index in
                        let offset = CGFloat(index) * cardOffset
                        let scale = CGFloat(1.0 - (Double(index) * 0.05))
                        let candidate = visibleCandidates[index]
                        
                        SwipeableCardView(candidate: candidate) { direction in
                            handleSwipe(direction, candidate: candidate)
                        }
                        .offset(y: offset)
                        .scaleEffect(scale)
                        .onTapGesture {
                            selectedCandidate = candidate
                            showingProfile = true
                        }
                    }
                }
                .padding(.horizontal)
                .padding(.top)
            }
        }
        .sheet(isPresented: $showingFilters) {
            CandidateFiltersView(viewModel: viewModel)
        }
        .sheet(isPresented: $showingProfile) {
            if let candidate = selectedCandidate {
                EducatorProfileDetailView(educator: candidate)
            }
        }
        .confirmationDialog(
            "Hire \(educatorToHire?.fullName ?? "")?",
            isPresented: $showHireConfirmation,
            titleVisibility: .visible
        ) {
            Button("Hire") {
                if let educator = educatorToHire {
                    print("🎉 Sending job offer to \(educator.fullName)")
                    currentIndex += 1
                    educatorToHire = nil
                    // Reset if we've reached the end
                    if currentIndex >= viewModel.filteredCandidates.count {
                        currentIndex = 0
                        viewModel.loadCandidates() // Load new candidates
                    }
                }
            }
            Button("Cancel", role: .cancel) {
                educatorToHire = nil
            }
        } message: {
            Text("This will send a job offer to \(educatorToHire?.fullName ?? ""). You can discuss details and finalize the contract once they accept.")
        }
        .onAppear {
            viewModel.loadCandidates()
        }
    }
    
    private var visibleCandidates: [User] {
        let endIndex = min(currentIndex + maxVisibleCards, viewModel.filteredCandidates.count)
        return Array(viewModel.filteredCandidates[currentIndex..<endIndex])
    }
    
    private var currentCandidate: User {
        viewModel.filteredCandidates[currentIndex]
    }
    
    private func handleSwipe(_ direction: SwipeableCardView.SwipeDirection, candidate: User) {
        withAnimation {
            switch direction {
            case .up:
                educatorToHire = candidate
                showHireConfirmation = true
            case .down:
                // Pass
                print("Passed on: \(candidate.fullName)")
                currentIndex += 1
                // Reset if we've reached the end
                if currentIndex >= viewModel.filteredCandidates.count {
                    currentIndex = 0
                    viewModel.loadCandidates() // Load new candidates
                }
            case .left:
                // Pass
                print("Passed on: \(candidate.fullName)")
                currentIndex += 1
                // Reset if we've reached the end
                if currentIndex >= viewModel.filteredCandidates.count {
                    currentIndex = 0
                    viewModel.loadCandidates() // Load new candidates
                }
            case .right:
                educatorToHire = candidate
                showHireConfirmation = true
            }
        }
    }
}

struct EducatorProfileDetailView: View {
    let educator: User
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Profile Image
                AsyncImage(url: URL(string: educator.profileImageURL ?? "")) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(Color.gray.opacity(0.2))
                }
                .frame(height: 300)
                .clipped()
                
                VStack(alignment: .leading, spacing: 16) {
                    // Name and Rating
                    HStack {
                        Text(educator.fullName)
                            .font(.title)
                            .bold()
                        Spacer()
                        RatingView(rating: educator.rating)
                    }
                    
                    // Experience
                    if let yearsExp = educator.yearsOfExperience {
                        Label("\(yearsExp) years experience", systemImage: "clock.fill")
                            .font(.subheadline)
                    }
                    
                    // Bio
                    if let bio = educator.bio {
                        Text(bio)
                            .font(.body)
                    }
                    
                    // Certifications
                    if let certifications = educator.certifications {
                        VStack(alignment: .leading) {
                            Text("Certifications")
                                .font(.headline)
                            ForEach(certifications, id: \.self) { cert in
                                Label(cert, systemImage: "checkmark.seal.fill")
                                    .foregroundColor(.blue)
                            }
                        }
                    }
                    
                    // Specialties
                    if let specialties = educator.specialties {
                        VStack(alignment: .leading) {
                            Text("Specialties")
                                .font(.headline)
                            FlowLayout(spacing: 8) {
                                ForEach(specialties, id: \.self) { specialty in
                                    Text(specialty)
                                        .font(.subheadline)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 6)
                                        .background(Color.blue.opacity(0.1))
                                        .cornerRadius(16)
                                }
                            }
                        }
                    }
                    
                    // Availability
                    if let availability = educator.availability {
                        VStack(alignment: .leading) {
                            Text("Availability")
                                .font(.headline)
                            ForEach(availability, id: \.self) { time in
                                Label(time, systemImage: "calendar")
                                    .foregroundColor(.green)
                            }
                        }
                    }
                }
                .padding()
            }
        }
        .navigationBarItems(trailing: Button("Done") {
            presentationMode.wrappedValue.dismiss()
        })
    }
}

struct FlowLayout: Layout {
    var spacing: CGFloat = 8
    
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let sizes = subviews.map { $0.sizeThatFits(.unspecified) }
        var width: CGFloat = 0
        var height: CGFloat = 0
        var x: CGFloat = 0
        var y: CGFloat = 0
        var maxHeight: CGFloat = 0
        
        for size in sizes {
            if x + size.width > (proposal.width ?? .infinity) {
                x = 0
                y += maxHeight + spacing
                maxHeight = 0
            }
            
            maxHeight = max(maxHeight, size.height)
            x += size.width + spacing
            width = max(width, x)
            height = y + maxHeight
        }
        
        return CGSize(width: width, height: height)
    }
    
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX
        var y = bounds.minY
        var maxHeight: CGFloat = 0
        
        for view in subviews {
            let size = view.sizeThatFits(.unspecified)
            
            if x + size.width > bounds.maxX {
                x = bounds.minX
                y += maxHeight + spacing
                maxHeight = 0
            }
            
            view.place(at: CGPoint(x: x, y: y), proposal: .unspecified)
            maxHeight = max(maxHeight, size.height)
            x += size.width + spacing
        }
    }
}
