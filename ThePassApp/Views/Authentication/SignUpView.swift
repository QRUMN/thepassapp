import SwiftUI

struct SignUpView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var fullName = ""
    @State private var userType: UserType = .educator
    @State private var showError = false
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Create Account")
                .font(.title)
                .fontWeight(.bold)
            
            TextField("Full Name", text: $fullName)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .textContentType(.name)
            
            TextField("Email", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .textContentType(.emailAddress)
                .autocapitalization(.none)
            
            SecureField("Password", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            SecureField("Confirm Password", text: $confirmPassword)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            Picker("I am a:", selection: $userType) {
                Text("Educator").tag(UserType.educator)
                Text("School Admin").tag(UserType.schoolAdmin)
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding(.vertical)
            
            Button(action: {
                if password == confirmPassword {
                    authViewModel.signUp(
                        email: email,
                        password: password,
                        userType: userType,
                        fullName: fullName
                    )
                } else {
                    authViewModel.error = "Passwords do not match"
                }
            }) {
                Text("Sign Up")
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .cornerRadius(10)
            }
            .disabled(password != confirmPassword || 
                     password.isEmpty || 
                     email.isEmpty || 
                     fullName.isEmpty)
            
            if let error = authViewModel.error {
                Text(error)
                    .foregroundColor(.red)
                    .font(.caption)
            }
        }
        .padding()
    }
}
