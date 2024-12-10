import SwiftUI
import PhotosUI

struct ProfileView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var profileViewModel: ProfileViewModel
    @State private var showingImagePicker = false
    @State private var showingEditProfile = false
    @State private var selectedImage: PhotosPickerItem?
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Profile Header
                    VStack {
                        // Profile Image
                        ZStack(alignment: .bottomTrailing) {
                            if let imageURL = authViewModel.user?.profileImageURL {
                                AsyncImage(url: URL(string: imageURL)) { image in
                                    image
                                        .resizable()
                                        .scaledToFill()
                                        .frame(width: 120, height: 120)
                                        .clipShape(Circle())
                                } placeholder: {
                                    Circle()
                                        .fill(Color.gray.opacity(0.2))
                                        .frame(width: 120, height: 120)
                                }
                            } else {
                                Circle()
                                    .fill(Color.gray.opacity(0.2))
                                    .frame(width: 120, height: 120)
                            }
                            
                            PhotosPicker(selection: $selectedImage,
                                       matching: .images) {
                                Image(systemName: "camera.circle.fill")
                                    .font(.system(size: 30))
                                    .foregroundColor(.blue)
                                    .background(Color.white)
                                    .clipShape(Circle())
                            }
                        }
                        .padding(.bottom)
                        
                        Text(authViewModel.user?.fullName ?? "")
                            .font(.title)
                            .fontWeight(.bold)
                        
                        if let userType = authViewModel.user?.userType {
                            Text(userType == .educator ? "Educator" : "School Administrator")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                        
                        // Rating
                        HStack {
                            ForEach(0..<5) { index in
                                Image(systemName: index < Int(authViewModel.user?.rating ?? 0) ? "star.fill" : "star")
                                    .foregroundColor(.yellow)
                            }
                            Text(String(format: "%.1f", authViewModel.user?.rating ?? 0))
                                .foregroundColor(.gray)
                            Text("(\(authViewModel.user?.reviewCount ?? 0) reviews)")
                                .foregroundColor(.gray)
                        }
                        .padding(.top, 4)
                    }
                    .padding()
                    
                    // Educator-specific fields
                    if authViewModel.user?.userType == .educator {
                        VStack(alignment: .leading, spacing: 16) {
                            if let educatorType = authViewModel.user?.educatorType {
                                InfoRow(title: "Position", value: educatorType.rawValue)
                            }
                            
                            if let experience = authViewModel.user?.experience {
                                InfoRow(title: "Experience", value: "\(experience) years")
                            }
                            
                            if let certifications = authViewModel.user?.certifications {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Certifications")
                                        .font(.headline)
                                    
                                    ScrollView(.horizontal, showsIndicators: false) {
                                        HStack {
                                            ForEach(certifications, id: \.self) { cert in
                                                Text(cert)
                                                    .padding(.horizontal, 12)
                                                    .padding(.vertical, 6)
                                                    .background(Color.blue.opacity(0.1))
                                                    .foregroundColor(.blue)
                                                    .cornerRadius(15)
                                            }
                                        }
                                    }
                                }
                            }
                            
                            if let availability = authViewModel.user?.availability {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Availability")
                                        .font(.headline)
                                    
                                    ForEach(availability, id: \.self) { day in
                                        Text(day)
                                            .foregroundColor(.gray)
                                    }
                                }
                            }
                        }
                        .padding()
                        .background(Color(.systemBackground))
                    }
                    
                    // School Admin-specific fields
                    if authViewModel.user?.userType == .schoolAdmin {
                        VStack(alignment: .leading, spacing: 16) {
                            if let schoolName = authViewModel.user?.schoolName {
                                InfoRow(title: "School", value: schoolName)
                            }
                            
                            if let district = authViewModel.user?.schoolDistrict {
                                InfoRow(title: "District", value: district)
                            }
                            
                            if let location = authViewModel.user?.schoolLocation {
                                InfoRow(title: "Location", value: location)
                            }
                            
                            if let type = authViewModel.user?.schoolType {
                                InfoRow(title: "School Type", value: type)
                            }
                        }
                        .padding()
                        .background(Color(.systemBackground))
                    }
                    
                    // Reviews Section
                    if let reviews = authViewModel.user?.reviews {
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Reviews")
                                .font(.headline)
                                .padding(.horizontal)
                            
                            ForEach(reviews, id: \.id) { review in
                                ReviewRow(review: review)
                            }
                        }
                    }
                    
                    // Badges Section
                    if let badges = authViewModel.user?.badges {
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Badges")
                                .font(.headline)
                                .padding(.horizontal)
                            
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 20) {
                                    ForEach(badges, id: \.id) { badge in
                                        BadgeView(badge: badge)
                                    }
                                }
                                .padding(.horizontal)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Profile")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Edit") {
                        showingEditProfile = true
                    }
                }
                
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Sign Out") {
                        authViewModel.signOut()
                    }
                }
            }
            .sheet(isPresented: $showingEditProfile) {
                EditProfileView()
            }
            .onChange(of: selectedImage) { _ in
                Task {
                    if let data = try? await selectedImage?.loadTransferable(type: Data.self) {
                        profileViewModel.uploadProfileImage(data)
                    }
                }
            }
        }
    }
}

struct InfoRow: View {
    let title: String
    let value: String
    
    var body: some View {
        HStack {
            Text(title)
                .font(.headline)
            Spacer()
            Text(value)
                .foregroundColor(.gray)
        }
    }
}

struct ReviewRow: View {
    let review: Review
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                ForEach(0..<5) { index in
                    Image(systemName: index < Int(review.rating) ? "star.fill" : "star")
                        .foregroundColor(.yellow)
                        .font(.system(size: 12))
                }
                Text(review.date, style: .date)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
            Text(review.comment)
                .font(.subheadline)
                .foregroundColor(.gray)
            
            if !review.attributes.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack {
                        ForEach(Array(review.attributes.keys), id: \.self) { key in
                            if let value = review.attributes[key] {
                                AttributeTag(name: key, value: value)
                            }
                        }
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(10)
        .padding(.horizontal)
    }
}

struct AttributeTag: View {
    let name: String
    let value: Double
    
    var body: some View {
        HStack(spacing: 4) {
            Text(name)
            Text(String(format: "%.1f", value))
        }
        .font(.caption)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(Color.blue.opacity(0.1))
        .foregroundColor(.blue)
        .cornerRadius(8)
    }
}

struct BadgeView: View {
    let badge: Badge
    
    var body: some View {
        VStack {
            Circle()
                .fill(Color.blue.opacity(0.1))
                .frame(width: 60, height: 60)
                .overlay(
                    Image(systemName: "star.circle.fill")
                        .font(.system(size: 30))
                        .foregroundColor(.blue)
                )
            
            Text(badge.name)
                .font(.caption)
                .multilineTextAlignment(.center)
        }
    }
}

struct EditProfileView: View {
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var profileViewModel: ProfileViewModel
    @State private var user: User?
    @State private var isLoading = false
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Basic Information")) {
                    TextField("Full Name", text: Binding(
                        get: { user?.fullName ?? "" },
                        set: { user?.fullName = $0 }
                    ))
                    
                    if user?.userType == .educator {
                        Picker("Position", selection: Binding(
                            get: { user?.educatorType ?? .fullTimeTeacher },
                            set: { user?.educatorType = $0 }
                        )) {
                            ForEach(EducatorType.allCases, id: \.self) { type in
                                Text(type.rawValue).tag(type)
                            }
                        }
                        
                        TextField("Experience (years)", value: Binding(
                            get: { user?.experience ?? 0 },
                            set: { user?.experience = $0 }
                        ), format: .number)
                    }
                }
                
                if user?.userType == .educator {
                    Section(header: Text("Certifications")) {
                        // Add certification management
                    }
                    
                    Section(header: Text("Availability")) {
                        // Add availability management
                    }
                }
                
                if user?.userType == .schoolAdmin {
                    Section(header: Text("School Information")) {
                        TextField("School Name", text: Binding(
                            get: { user?.schoolName ?? "" },
                            set: { user?.schoolName = $0 }
                        ))
                        
                        TextField("District", text: Binding(
                            get: { user?.schoolDistrict ?? "" },
                            set: { user?.schoolDistrict = $0 }
                        ))
                        
                        TextField("Location", text: Binding(
                            get: { user?.schoolLocation ?? "" },
                            set: { user?.schoolLocation = $0 }
                        ))
                        
                        TextField("School Type", text: Binding(
                            get: { user?.schoolType ?? "" },
                            set: { user?.schoolType = $0 }
                        ))
                    }
                }
            }
            .navigationTitle("Edit Profile")
            .navigationBarItems(
                leading: Button("Cancel") {
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: Button("Save") {
                    if let user = user {
                        profileViewModel.updateProfile(user: user)
                        presentationMode.wrappedValue.dismiss()
                    }
                }
            )
            .onAppear {
                user = authViewModel.user
            }
        }
    }
}
