import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    
    var body: some View {
        Group {
            if authViewModel.isAuthenticated {
                MainTabView()
            } else {
                AuthenticationView()
            }
        }
    }
}

struct MainTabView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    
    var body: some View {
        TabView {
            if authViewModel.user?.userType == .schoolAdmin {
                CandidatesView()
                    .tabItem {
                        Label("Candidates", systemImage: "person.2")
                    }
            } else {
                JobsView()
                    .tabItem {
                        Label("Jobs", systemImage: "briefcase")
                    }
            }
            
            MessagesView()
                .tabItem {
                    Label("Messages", systemImage: "message")
                }
            
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.circle")
                }
        }
    }
}

struct AuthenticationView: View {
    @State private var isSignUp = false
    
    var body: some View {
        NavigationView {
            VStack {
                Image("app_logo")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 200, height: 200)
                    .padding()
                
                Text("The Pass App")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding(.bottom, 50)
                
                if isSignUp {
                    SignUpView()
                } else {
                    SignInView()
                }
                
                Button(action: {
                    withAnimation {
                        isSignUp.toggle()
                    }
                }) {
                    Text(isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up")
                        .foregroundColor(.blue)
                }
                .padding()
            }
            .padding()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(AuthViewModel())
            .environmentObject(ProfileViewModel())
    }
}
