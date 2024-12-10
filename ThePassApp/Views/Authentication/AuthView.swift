import SwiftUI
import FirebaseAuth

struct AuthView: View {
    @State private var isSignIn = true
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var fullName = ""
    @State private var isEducator = true
    @State private var showingError = false
    @State private var errorMessage = ""
    @State private var isLoading = false
    
    var body: some View {
        NavigationView {
            ZStack {
                Color("BackgroundColor")
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 25) {
                        // Logo and Title
                        Image("AppLogo")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 120, height: 120)
                        
                        Text(isSignIn ? "Welcome Back!" : "Create Account")
                            .font(.title)
                            .fontWeight(.bold)
                        
                        // Form Fields
                        VStack(spacing: 15) {
                            if !isSignIn {
                                TextField("Full Name", text: $fullName)
                                    .textFieldStyle(RoundedTextFieldStyle())
                                
                                Picker("Account Type", selection: $isEducator) {
                                    Text("Educator").tag(true)
                                    Text("Institution").tag(false)
                                }
                                .pickerStyle(SegmentedPickerStyle())
                                .padding(.horizontal)
                            }
                            
                            TextField("Email", text: $email)
                                .textFieldStyle(RoundedTextFieldStyle())
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                            
                            SecureField("Password", text: $password)
                                .textFieldStyle(RoundedTextFieldStyle())
                            
                            if !isSignIn {
                                SecureField("Confirm Password", text: $confirmPassword)
                                    .textFieldStyle(RoundedTextFieldStyle())
                            }
                        }
                        .padding(.horizontal)
                        
                        // Action Button
                        Button(action: handleAuth) {
                            if isLoading {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            } else {
                                Text(isSignIn ? "Sign In" : "Create Account")
                                    .font(.headline)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                        .padding(.horizontal)
                        .disabled(isLoading)
                        
                        // Toggle Button
                        Button(action: { isSignIn.toggle() }) {
                            Text(isSignIn ? "New user? Create account" : "Already have an account? Sign in")
                                .foregroundColor(.blue)
                        }
                        
                        if isSignIn {
                            Button(action: handleForgotPassword) {
                                Text("Forgot Password?")
                                    .foregroundColor(.gray)
                            }
                        }
                    }
                    .padding(.vertical)
                }
            }
            .alert("Error", isPresented: $showingError) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(errorMessage)
            }
        }
    }
    
    private func handleAuth() {
        isLoading = true
        
        if isSignIn {
            // Handle sign in
            Auth.auth().signIn(withEmail: email, password: password) { result, error in
                isLoading = false
                if let error = error {
                    errorMessage = error.localizedDescription
                    showingError = true
                }
            }
        } else {
            // Validate passwords match
            guard password == confirmPassword else {
                errorMessage = "Passwords do not match"
                showingError = true
                isLoading = false
                return
            }
            
            // Handle sign up
            Auth.auth().createUser(withEmail: email, password: password) { result, error in
                isLoading = false
                if let error = error {
                    errorMessage = error.localizedDescription
                    showingError = true
                } else if let user = result?.user {
                    // Create user profile
                    let changeRequest = user.createProfileChangeRequest()
                    changeRequest.displayName = fullName
                    changeRequest.commitChanges { error in
                        if let error = error {
                            errorMessage = error.localizedDescription
                            showingError = true
                        }
                    }
                }
            }
        }
    }
    
    private func handleForgotPassword() {
        guard !email.isEmpty else {
            errorMessage = "Please enter your email address"
            showingError = true
            return
        }
        
        Auth.auth().sendPasswordReset(withEmail: email) { error in
            if let error = error {
                errorMessage = error.localizedDescription
                showingError = true
            } else {
                errorMessage = "Password reset email sent. Please check your inbox."
                showingError = true
            }
        }
    }
}

struct RoundedTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color(.systemGray6))
            )
    }
}

#Preview {
    AuthView()
}
