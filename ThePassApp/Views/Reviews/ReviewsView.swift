import SwiftUI

struct ReviewsView: View {
    @StateObject private var viewModel: ReviewViewModel
    let userType: UserType
    let userId: String
    
    init(userId: String, userType: UserType) {
        self._viewModel = StateObject(wrappedValue: ReviewViewModel())
        self.userId = userId
        self.userType = userType
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Rating Overview
                RatingOverviewCard(
                    averageRating: viewModel.averageRating,
                    totalReviews: viewModel.reviews.count,
                    distribution: viewModel.ratingDistribution
                )
                
                // Attribute Ratings
                AttributeRatingsCard(
                    attributes: viewModel.attributeAverages,
                    userType: userType
                )
                
                // Reviews List
                ReviewsList(reviews: viewModel.reviews, userType: userType)
            }
            .padding()
        }
        .navigationTitle("Reviews")
        .onAppear {
            viewModel.loadReviews(for: userId, userType: userType)
        }
    }
}

struct RatingOverviewCard: View {
    let averageRating: Double
    let totalReviews: Int
    let distribution: [Int: Int]
    
    var body: some View {
        VStack(spacing: 16) {
            HStack(alignment: .center) {
                VStack(spacing: 8) {
                    Text(String(format: "%.1f", averageRating))
                        .font(.system(size: 48, weight: .bold))
                    RatingStarsView(rating: averageRating)
                    Text("\(totalReviews) reviews")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                }
                
                Divider()
                    .padding(.horizontal)
                
                VStack(spacing: 4) {
                    ForEach((1...5).reversed(), id: \.self) { stars in
                        HStack(spacing: 8) {
                            Text("\(stars)")
                                .font(.caption)
                            ProgressView(value: Double(distribution[stars, default: 0]), total: Double(totalReviews))
                                .frame(width: 100)
                            Text("\(distribution[stars, default: 0])")
                                .font(.caption)
                        }
                    }
                }
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

struct AttributeRatingsCard: View {
    let attributes: [String: Double]
    let userType: UserType
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(userType == .educator ? "Teaching Attributes" : "School Attributes")
                .font(.headline)
            
            ForEach(Array(attributes.keys.sorted()), id: \.self) { attribute in
                if let rating = attributes[attribute] {
                    HStack {
                        Text(attribute)
                            .font(.subheadline)
                        Spacer()
                        RatingStarsView(rating: rating)
                        Text(String(format: "%.1f", rating))
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                }
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

struct ReviewsList: View {
    let reviews: [Review]
    let userType: UserType
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Recent Reviews")
                .font(.headline)
            
            ForEach(reviews) { review in
                ReviewCard(review: review, userType: userType)
            }
        }
    }
}

struct ReviewCard: View {
    let review: Review
    let userType: UserType
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Reviewer Info
            HStack {
                if let imageURL = review.reviewerImage {
                    AsyncImage(url: URL(string: imageURL)) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Image(systemName: "person.circle.fill")
                            .resizable()
                    }
                    .frame(width: 40, height: 40)
                    .clipShape(Circle())
                } else {
                    Image(systemName: "person.circle.fill")
                        .resizable()
                        .frame(width: 40, height: 40)
                        .foregroundColor(.gray)
                }
                
                VStack(alignment: .leading) {
                    Text(review.reviewerName)
                        .font(.headline)
                    if userType == .educator {
                        if let position = review.position, let duration = review.duration {
                            Text("\(position) • \(duration)")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                    } else {
                        if let subject = review.subject, let gradeLevel = review.gradeLevel {
                            Text("\(subject) • \(gradeLevel)")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                    }
                }
                
                Spacer()
                
                if review.isVerified {
                    Image(systemName: "checkmark.seal.fill")
                        .foregroundColor(.blue)
                }
            }
            
            // Rating
            HStack {
                RatingStarsView(rating: review.rating)
                Text(review.date.timeAgo())
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
            // Review Text
            Text(review.comment)
                .font(.body)
            
            // Attribute Ratings
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(review.attributes) { attribute in
                        VStack(spacing: 4) {
                            Text(attribute.name)
                                .font(.caption)
                            Text(String(format: "%.1f", attribute.rating))
                                .font(.caption)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.blue.opacity(0.1))
                                .cornerRadius(8)
                        }
                    }
                }
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

struct RatingStarsView: View {
    let rating: Double
    
    var body: some View {
        HStack(spacing: 2) {
            ForEach(0..<5) { index in
                Image(systemName: index < Int(rating) ? "star.fill" : 
                    (index < ceil(rating) ? "star.leadinghalf.filled" : "star"))
                    .foregroundColor(.yellow)
                    .font(.caption)
            }
        }
    }
}

struct WriteReviewView: View {
    @Environment(\.presentationMode) var presentationMode
    @StateObject private var viewModel: ReviewViewModel
    let userType: UserType
    let userId: String
    
    @State private var overallRating: Double = 0
    @State private var comment: String = ""
    @State private var attributeRatings: [String: Double] = [:]
    @State private var additionalInfo: [String: String] = [:]
    
    init(userId: String, userType: UserType) {
        self._viewModel = StateObject(wrappedValue: ReviewViewModel())
        self.userId = userId
        self.userType = userType
    }
    
    var body: some View {
        NavigationView {
            Form {
                // Overall Rating
                Section(header: Text("Overall Rating")) {
                    RatingSelector(rating: $overallRating)
                }
                
                // Attribute Ratings
                Section(header: Text("\(userType == .educator ? "Teaching" : "School") Attributes")) {
                    let attributes = userType == .educator ? 
                        ReviewAttribute.educatorAttributes : 
                        ReviewAttribute.schoolAttributes
                    
                    ForEach(attributes, id: \.self) { attribute in
                        VStack(alignment: .leading) {
                            Text(attribute)
                            RatingSelector(rating: Binding(
                                get: { attributeRatings[attribute] ?? 0 },
                                set: { attributeRatings[attribute] = $0 }
                            ))
                        }
                    }
                }
                
                // Additional Information
                Section(header: Text("Additional Information")) {
                    if userType == .educator {
                        TextField("Position", text: Binding(
                            get: { additionalInfo["position"] ?? "" },
                            set: { additionalInfo["position"] = $0 }
                        ))
                        TextField("Duration", text: Binding(
                            get: { additionalInfo["duration"] ?? "" },
                            set: { additionalInfo["duration"] = $0 }
                        ))
                    } else {
                        TextField("Subject", text: Binding(
                            get: { additionalInfo["subject"] ?? "" },
                            set: { additionalInfo["subject"] = $0 }
                        ))
                        TextField("Grade Level", text: Binding(
                            get: { additionalInfo["gradeLevel"] ?? "" },
                            set: { additionalInfo["gradeLevel"] = $0 }
                        ))
                    }
                }
                
                // Review Comment
                Section(header: Text("Review")) {
                    TextEditor(text: $comment)
                        .frame(height: 100)
                }
            }
            .navigationTitle("Write Review")
            .navigationBarItems(
                leading: Button("Cancel") {
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: Button("Submit") {
                    submitReview()
                }
                .disabled(overallRating == 0 || comment.isEmpty)
            )
        }
    }
    
    private func submitReview() {
        let attributes = attributeRatings.map { name, rating in
            ReviewAttribute(
                id: UUID().uuidString,
                name: name,
                rating: rating
            )
        }
        
        viewModel.submitReview(
            userId: userId,
            rating: overallRating,
            comment: comment,
            attributes: attributes,
            additionalInfo: additionalInfo
        )
        
        presentationMode.wrappedValue.dismiss()
    }
}

struct RatingSelector: View {
    @Binding var rating: Double
    
    var body: some View {
        HStack {
            ForEach(1...5, id: \.self) { index in
                Image(systemName: index <= Int(rating) ? "star.fill" : "star")
                    .foregroundColor(.yellow)
                    .onTapGesture {
                        rating = Double(index)
                    }
            }
        }
    }
}
