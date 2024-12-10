import SwiftUI

struct Message: Identifiable {
    let id: String
    let senderId: String
    let receiverId: String
    let content: String
    let timestamp: Date
    let isRead: Bool
}

struct Chat: Identifiable {
    let id: String
    let participants: [String]
    let lastMessage: Message
    let otherUser: User
}

struct MessagesView: View {
    @State private var chats: [Chat] = []
    @State private var searchText = ""
    
    var filteredChats: [Chat] {
        if searchText.isEmpty {
            return chats
        }
        return chats.filter {
            $0.otherUser.fullName.localizedCaseInsensitiveContains(searchText)
        }
    }
    
    var body: some View {
        NavigationView {
            VStack {
                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)
                    TextField("Search messages", text: $searchText)
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)
                .padding(.horizontal)
                
                // Chats List
                List(filteredChats) { chat in
                    NavigationLink(destination: ChatView(chat: chat)) {
                        ChatRowView(chat: chat)
                    }
                }
            }
            .navigationTitle("Messages")
        }
    }
}

struct ChatRowView: View {
    let chat: Chat
    
    var body: some View {
        HStack {
            // Profile Image
            if let imageURL = chat.otherUser.profileImageURL {
                AsyncImage(url: URL(string: imageURL)) { image in
                    image
                        .resizable()
                        .scaledToFill()
                        .frame(width: 50, height: 50)
                        .clipShape(Circle())
                } placeholder: {
                    Circle()
                        .fill(Color.gray.opacity(0.2))
                        .frame(width: 50, height: 50)
                }
            } else {
                Circle()
                    .fill(Color.gray.opacity(0.2))
                    .frame(width: 50, height: 50)
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(chat.otherUser.fullName)
                    .font(.headline)
                Text(chat.lastMessage.content)
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .lineLimit(1)
            }
            
            Spacer()
            
            VStack(alignment: .trailing, spacing: 4) {
                Text(chat.lastMessage.timestamp, style: .time)
                    .font(.caption)
                    .foregroundColor(.gray)
                
                if !chat.lastMessage.isRead {
                    Circle()
                        .fill(Color.blue)
                        .frame(width: 10, height: 10)
                }
            }
        }
        .padding(.vertical, 8)
    }
}

struct ChatView: View {
    let chat: Chat
    @State private var messageText = ""
    @State private var messages: [Message] = []
    
    var body: some View {
        VStack {
            // Messages
            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(messages) { message in
                        MessageBubble(message: message, isFromCurrentUser: message.senderId == "currentUserId")
                    }
                }
                .padding()
            }
            
            // Message Input
            HStack {
                TextField("Message", text: $messageText)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding(.horizontal)
                
                Button(action: sendMessage) {
                    Image(systemName: "paperplane.fill")
                        .foregroundColor(.blue)
                        .padding()
                }
            }
            .padding(.bottom)
        }
        .navigationTitle(chat.otherUser.fullName)
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private func sendMessage() {
        guard !messageText.isEmpty else { return }
        // Handle sending message
        messageText = ""
    }
}

struct MessageBubble: View {
    let message: Message
    let isFromCurrentUser: Bool
    
    var body: some View {
        HStack {
            if isFromCurrentUser { Spacer() }
            
            Text(message.content)
                .padding()
                .background(isFromCurrentUser ? Color.blue : Color(.systemGray5))
                .foregroundColor(isFromCurrentUser ? .white : .primary)
                .cornerRadius(20)
            
            if !isFromCurrentUser { Spacer() }
        }
    }
}
