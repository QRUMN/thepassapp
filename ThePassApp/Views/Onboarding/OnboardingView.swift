import SwiftUI

struct OnboardingPage {
    let title: String
    let description: String
    let imageName: String
}

struct OnboardingView: View {
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    @State private var currentPage = 0
    
    private let pages = [
        OnboardingPage(
            title: "Welcome to The Pass App",
            description: "Your gateway to educational opportunities in Delaware",
            imageName: "onboarding1"
        ),
        OnboardingPage(
            title: "Find Your Perfect Match",
            description: "Swipe through positions that match your qualifications and preferences",
            imageName: "onboarding2"
        ),
        OnboardingPage(
            title: "Quick Application Process",
            description: "Apply to positions with just one tap and track your applications in real-time",
            imageName: "onboarding3"
        ),
        OnboardingPage(
            title: "Stay Connected",
            description: "Get instant notifications about matches, interviews, and position updates",
            imageName: "onboarding4"
        )
    ]
    
    var body: some View {
        ZStack {
            Color("BackgroundColor")
                .ignoresSafeArea()
            
            VStack(spacing: 20) {
                TabView(selection: $currentPage) {
                    ForEach(0..<pages.count, id: \.self) { index in
                        VStack(spacing: 20) {
                            Image(pages[index].imageName)
                                .resizable()
                                .scaledToFit()
                                .frame(height: 300)
                                .padding()
                            
                            Text(pages[index].title)
                                .font(.title)
                                .fontWeight(.bold)
                                .multilineTextAlignment(.center)
                            
                            Text(pages[index].description)
                                .font(.body)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal)
                                .foregroundColor(.secondary)
                        }
                        .tag(index)
                    }
                }
                .tabViewStyle(PageTabViewStyle(indexDisplayMode: .always))
                
                Button(action: {
                    if currentPage < pages.count - 1 {
                        withAnimation {
                            currentPage += 1
                        }
                    } else {
                        hasCompletedOnboarding = true
                    }
                }) {
                    Text(currentPage < pages.count - 1 ? "Next" : "Get Started")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(10)
                }
                .padding(.horizontal)
                
                if currentPage < pages.count - 1 {
                    Button(action: {
                        hasCompletedOnboarding = true
                    }) {
                        Text("Skip")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.top, 8)
                }
            }
            .padding(.bottom, 50)
        }
    }
}

#Preview {
    OnboardingView()
}
