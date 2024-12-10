import SwiftUI

struct CandidatesView: View {
    @State private var candidates: [User] = []
    @State private var currentIndex = 0
    @State private var translation: CGSize = .zero
    @State private var selectedEducatorType: EducatorType?
    
    private let cardWidth: CGFloat = UIScreen.main.bounds.width - 40
    private let cardHeight: CGFloat = UIScreen.main.bounds.height * 0.6
    private let threshold: CGFloat = 50
    
    var body: some View {
        NavigationView {
            VStack {
                // Educator Type Filter
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(EducatorType.allCases, id: \.self) { type in
                            FilterChip(
                                title: type.rawValue,
                                isSelected: selectedEducatorType == type
                            ) {
                                selectedEducatorType = type == selectedEducatorType ? nil : type
                                // Reload candidates based on filter
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical)
                
                ZStack {
                    ForEach(candidates.indices.prefix(3).reversed(), id: \.self) { index in
                        CardView(user: candidates[index])
                            .frame(width: cardWidth, height: cardHeight)
                            .offset(x: index == currentIndex ? translation.width : 0)
                            .rotationEffect(.degrees(index == currentIndex ? Double(translation.width / 10) : 0))
                            .gesture(
                                DragGesture()
                                    .onChanged { gesture in
                                        if index == currentIndex {
                                            translation = gesture.translation
                                        }
                                    }
                                    .onEnded { gesture in
                                        if index == currentIndex {
                                            withAnimation {
                                                let offset = gesture.translation.width
                                                if abs(offset) > threshold {
                                                    // Swipe right (hire)
                                                    if offset > 0 {
                                                        handleSwipe(direction: .right, candidate: candidates[index])
                                                    }
                                                    // Swipe left (pass)
                                                    else {
                                                        handleSwipe(direction: .left, candidate: candidates[index])
                                                    }
                                                    translation = .zero
                                                } else {
                                                    translation = .zero
                                                }
                                            }
                                        }
                                    }
                            )
                    }
                }
                
                // Action Buttons
                HStack(spacing: 40) {
                    Button(action: { swipeLeft() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 50))
                            .foregroundColor(.red)
                    }
                    
                    Button(action: { swipeRight() }) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 50))
                            .foregroundColor(.green)
                    }
                }
                .padding(.top, 30)
            }
            .navigationTitle("Find Educators")
        }
    }
    
    private func handleSwipe(direction: SwipeDirection, candidate: User) {
        if direction == .right {
            // Handle hire action
            print("Hired \(candidate.fullName)")
        } else {
            // Handle pass action
            print("Passed on \(candidate.fullName)")
        }
        
        // Move to next candidate
        withAnimation {
            currentIndex += 1
            if currentIndex >= candidates.count {
                // Load more candidates or reset
                currentIndex = 0
            }
        }
    }
    
    private func swipeLeft() {
        withAnimation {
            translation = CGSize(width: -500, height: 0)
            handleSwipe(direction: .left, candidate: candidates[currentIndex])
        }
    }
    
    private func swipeRight() {
        withAnimation {
            translation = CGSize(width: 500, height: 0)
            handleSwipe(direction: .right, candidate: candidates[currentIndex])
        }
    }
}

enum SwipeDirection {
    case left
    case right
}

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? Color.blue : Color.gray.opacity(0.2))
                .foregroundColor(isSelected ? .white : .primary)
                .cornerRadius(20)
        }
    }
}

struct CardView: View {
    let user: User
    
    var body: some View {
        ZStack(alignment: .bottom) {
            // Profile Image
            if let imageURL = user.profileImageURL {
                AsyncImage(url: URL(string: imageURL)) { image in
                    image
                        .resizable()
                        .scaledToFill()
                } placeholder: {
                    Color.gray
                }
            } else {
                Color.gray
            }
            
            // Info overlay
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(user.fullName)
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Spacer()
                    
                    HStack {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                        Text(String(format: "%.1f", user.rating))
                    }
                }
                
                if let educatorType = user.educatorType {
                    Text(educatorType.rawValue)
                        .font(.subheadline)
                }
                
                if let experience = user.experience {
                    Text("\(experience) years of experience")
                        .font(.subheadline)
                }
                
                if let certifications = user.certifications {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack {
                            ForEach(certifications, id: \.self) { cert in
                                Text(cert)
                                    .font(.caption)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color.blue.opacity(0.2))
                                    .cornerRadius(8)
                            }
                        }
                    }
                }
            }
            .padding()
            .background(
                LinearGradient(
                    gradient: Gradient(colors: [.clear, .black.opacity(0.8)]),
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .foregroundColor(.white)
        }
        .cornerRadius(10)
        .shadow(radius: 5)
    }
}
