import SwiftUI

struct Position: Identifiable {
    let id: String
    let title: String
    let institution: String
    let location: String
    let type: String
    let description: String
    let requirements: [String]
    let salary: String
    let imageURL: String
}

struct SwipeView: View {
    @State private var positions: [Position] = []
    @State private var currentIndex = 0
    @State private var offset = CGSize.zero
    @State private var showingFilters = false
    @State private var showingDetails = false
    @State private var selectedPosition: Position?
    
    var body: some View {
        NavigationView {
            ZStack {
                Color("BackgroundColor")
                    .ignoresSafeArea()
                
                VStack {
                    // Header
                    HStack {
                        Button(action: { showingFilters = true }) {
                            Image(systemName: "slider.horizontal.3")
                                .font(.title2)
                                .foregroundColor(.primary)
                        }
                        
                        Spacer()
                        
                        Text("Positions")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        Spacer()
                        
                        NavigationLink(destination: SavedPositionsView()) {
                            Image(systemName: "bookmark")
                                .font(.title2)
                                .foregroundColor(.primary)
                        }
                    }
                    .padding()
                    
                    // Cards
                    ZStack {
                        ForEach(positions.indices.prefix(3).reversed(), id: \.self) { index in
                            PositionCard(position: positions[index])
                                .offset(index == currentIndex ? offset : .zero)
                                .rotationEffect(index == currentIndex ? .degrees(Double(offset.width / 10)) : .zero)
                                .gesture(
                                    DragGesture()
                                        .onChanged { gesture in
                                            if index == currentIndex {
                                                offset = gesture.translation
                                            }
                                        }
                                        .onEnded { gesture in
                                            if index == currentIndex {
                                                withAnimation {
                                                    handleSwipe(gesture)
                                                }
                                            }
                                        }
                                )
                                .onTapGesture {
                                    selectedPosition = positions[index]
                                    showingDetails = true
                                }
                        }
                    }
                    .padding(.horizontal)
                    
                    // Action Buttons
                    HStack(spacing: 20) {
                        Button(action: { handleDislike() }) {
                            Image(systemName: "xmark")
                                .font(.title)
                                .foregroundColor(.white)
                                .frame(width: 60, height: 60)
                                .background(Color.red)
                                .clipShape(Circle())
                        }
                        
                        Button(action: { handleSave() }) {
                            Image(systemName: "bookmark")
                                .font(.title)
                                .foregroundColor(.white)
                                .frame(width: 60, height: 60)
                                .background(Color.yellow)
                                .clipShape(Circle())
                        }
                        
                        Button(action: { handleLike() }) {
                            Image(systemName: "checkmark")
                                .font(.title)
                                .foregroundColor(.white)
                                .frame(width: 60, height: 60)
                                .background(Color.green)
                                .clipShape(Circle())
                        }
                    }
                    .padding(.top)
                }
            }
            .sheet(isPresented: $showingFilters) {
                FilterView()
            }
            .sheet(isPresented: $showingDetails) {
                if let position = selectedPosition {
                    PositionDetailView(position: position)
                }
            }
        }
        .onAppear {
            loadPositions()
        }
    }
    
    private func loadPositions() {
        // TODO: Load positions from Firebase
        // This is sample data
        positions = [
            Position(
                id: "1",
                title: "Math Teacher",
                institution: "Delaware High School",
                location: "Wilmington, DE",
                type: "Full-time",
                description: "Seeking an experienced math teacher for grades 9-12",
                requirements: ["Bachelor's degree", "Teaching certification", "3+ years experience"],
                salary: "$50,000 - $70,000",
                imageURL: "school1"
            ),
            // Add more sample positions...
        ]
    }
    
    private func handleSwipe(_ gesture: DragGesture.Value) {
        let threshold: CGFloat = 100
        if gesture.translation.width > threshold {
            handleLike()
        } else if gesture.translation.width < -threshold {
            handleDislike()
        } else {
            offset = .zero
        }
    }
    
    private func handleLike() {
        withAnimation {
            offset = CGSize(width: 500, height: 0)
            moveToNext()
        }
    }
    
    private func handleDislike() {
        withAnimation {
            offset = CGSize(width: -500, height: 0)
            moveToNext()
        }
    }
    
    private func handleSave() {
        // TODO: Implement save functionality
    }
    
    private func moveToNext() {
        offset = .zero
        if currentIndex < positions.count - 1 {
            currentIndex += 1
        } else {
            // TODO: Load more positions or show empty state
        }
    }
}

struct PositionCard: View {
    let position: Position
    
    var body: some View {
        ZStack(alignment: .bottom) {
            // Position Image
            Image(position.imageURL)
                .resizable()
                .scaledToFill()
                .frame(height: 500)
                .clipShape(RoundedRectangle(cornerRadius: 20))
            
            // Position Info Overlay
            VStack(alignment: .leading, spacing: 8) {
                Text(position.title)
                    .font(.title)
                    .fontWeight(.bold)
                
                Text(position.institution)
                    .font(.title3)
                
                HStack {
                    Image(systemName: "mappin.circle.fill")
                    Text(position.location)
                }
                
                Text(position.type)
                    .font(.subheadline)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color.blue.opacity(0.2))
                    .cornerRadius(15)
            }
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(
                LinearGradient(
                    gradient: Gradient(colors: [.black.opacity(0.7), .clear]),
                    startPoint: .bottom,
                    endPoint: .top
                )
            )
            .foregroundColor(.white)
            .clipShape(RoundedRectangle(cornerRadius: 20))
        }
        .frame(height: 500)
        .shadow(radius: 5)
    }
}

struct SavedPositionsView: View {
    var body: some View {
        Text("Saved Positions")
            .navigationTitle("Saved")
    }
}

struct FilterView: View {
    var body: some View {
        Text("Filters")
    }
}

struct PositionDetailView: View {
    let position: Position
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Image(position.imageURL)
                    .resizable()
                    .scaledToFill()
                    .frame(height: 200)
                    .clipped()
                
                VStack(alignment: .leading, spacing: 15) {
                    Text(position.title)
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text(position.institution)
                        .font(.title3)
                    
                    HStack {
                        Image(systemName: "mappin.circle.fill")
                        Text(position.location)
                    }
                    .foregroundColor(.secondary)
                    
                    Text(position.description)
                        .padding(.top)
                    
                    Text("Requirements")
                        .font(.headline)
                        .padding(.top)
                    
                    ForEach(position.requirements, id: \.self) { requirement in
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                            Text(requirement)
                        }
                    }
                    
                    Text("Salary")
                        .font(.headline)
                        .padding(.top)
                    Text(position.salary)
                    
                    Button(action: {
                        // TODO: Implement apply functionality
                    }) {
                        Text("Apply Now")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .cornerRadius(10)
                    }
                    .padding(.top)
                }
                .padding()
            }
        }
        .navigationTitle("Position Details")
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    SwipeView()
}
