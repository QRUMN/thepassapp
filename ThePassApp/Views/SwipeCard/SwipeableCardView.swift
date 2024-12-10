import SwiftUI

struct SwipeableCardView: View {
    @GestureState private var translation: CGSize = .zero
    @State private var swipeStatus: SwipeStatus = .none
    
    let candidate: User
    let onSwipe: (SwipeDirection) -> Void
    
    private let screenHeight = UIScreen.main.bounds.height
    private let swipeThreshold: CGFloat = 150
    private let rotationAngle: CGFloat = 0.15
    
    enum SwipeStatus {
        case none
        case hire
        case pass
    }
    
    enum SwipeDirection {
        case up
        case down
    }
    
    var body: some View {
        GeometryReader { geometry in
            VStack(alignment: .leading, spacing: 0) {
                // Profile Image
                ZStack(alignment: .center) {
                    AsyncImage(url: URL(string: candidate.profileImageURL ?? "")) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Rectangle()
                            .fill(Color.gray.opacity(0.2))
                    }
                    .frame(height: geometry.size.height * 0.6)
                    .clipped()
                    
                    // Swipe Indicators
                    VStack {
                        HireIndicator()
                            .opacity(swipeStatus == .hire ? 1 : 0)
                            .offset(y: -20)
                        Spacer()
                        PassIndicator()
                            .opacity(swipeStatus == .pass ? 1 : 0)
                            .offset(y: 20)
                    }
                    .padding()
                }
                
                // Profile Info
                VStack(alignment: .leading, spacing: 12) {
                    // Name and Rating
                    HStack {
                        Text(candidate.fullName)
                            .font(.title2)
                            .bold()
                        Spacer()
                        RatingView(rating: candidate.rating)
                    }
                    
                    // Experience and Certifications
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
                    
                    // Specialties
                    if let specialties = candidate.specialties {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack {
                                ForEach(specialties, id: \.self) { specialty in
                                    Text(specialty)
                                        .font(.caption)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 6)
                                        .background(Color.blue.opacity(0.1))
                                        .cornerRadius(16)
                                }
                            }
                        }
                    }
                    
                    // Bio
                    if let bio = candidate.bio {
                        Text(bio)
                            .font(.body)
                            .lineLimit(3)
                    }
                }
                .padding()
                .background(Color.white)
            }
            .background(Color.white)
            .cornerRadius(12)
            .shadow(radius: 5)
            .offset(y: translation.height)
            .rotationEffect(.degrees(Double(translation.height / screenHeight) * -20))
            .gesture(
                DragGesture()
                    .updating($translation) { value, state, _ in
                        state = value.translation
                        
                        // Update swipe status based on translation
                        if value.translation.height < -swipeThreshold {
                            swipeStatus = .hire
                        } else if value.translation.height > swipeThreshold {
                            swipeStatus = .pass
                        } else {
                            swipeStatus = .none
                        }
                    }
                    .onEnded { value in
                        let offset = value.translation.height
                        
                        if abs(offset) > swipeThreshold {
                            // Swipe card away
                            withAnimation {
                                onSwipe(offset < 0 ? .up : .down)
                            }
                        } else {
                            // Reset card position
                            withAnimation {
                                swipeStatus = .none
                            }
                        }
                    }
            )
        }
    }
}

struct PassIndicator: View {
    var body: some View {
        Label("PASS", systemImage: "xmark.circle.fill")
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color.red.opacity(0.8))
            .foregroundColor(.white)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color.white, lineWidth: 2)
            )
    }
}

struct HireIndicator: View {
    var body: some View {
        Label("HIRE", systemImage: "checkmark.seal.fill")
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color.green.opacity(0.8))
            .foregroundColor(.white)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color.white, lineWidth: 2)
            )
    }
}
