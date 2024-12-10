import Foundation
import Combine

class AuthViewModel: ObservableObject {
    @Published var user: User?
    @Published var isAuthenticated = false
    @Published var error: String?
    
    // Temporary in-memory storage for demo purposes
    private var users: [String: User] = [:]
    
    func signIn(email: String, password: String) {
        // Demo authentication
        if let user = users[email] {
            self.user = user
            self.isAuthenticated = true
        } else {
            self.error = "Invalid credentials"
        }
    }
    
    func signUp(email: String, password: String, userType: UserType, fullName: String) {
        // Demo user creation
        let newUser = User(
            id: UUID().uuidString,
            email: email,
            fullName: fullName,
            userType: userType,
            rating: 0.0,
            reviewCount: 0,
            createdAt: Date(),
            lastActive: Date()
        )
        
        users[email] = newUser
        self.user = newUser
        self.isAuthenticated = true
    }
    
    func signOut() {
        self.user = nil
        self.isAuthenticated = false
    }
}
