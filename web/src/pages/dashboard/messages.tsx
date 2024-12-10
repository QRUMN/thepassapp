import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Message, Chat, ChatParticipant } from '@/types/chat';

// Demo data
const DEMO_CHATS: Chat[] = [
  {
    id: '1',
    participants: ['demo_educator', 'demo_institution1'],
    lastMessage: {
      id: 'msg1',
      senderId: 'demo_institution1',
      receiverId: 'demo_educator',
      content: 'We would love to schedule an interview with you.',
      timestamp: new Date(),
      read: false,
      type: 'text'
    },
    lastActivity: new Date(),
    unreadCount: {
      demo_educator: 1,
      demo_institution1: 0
    },
    metadata: {
      positionId: '1',
      positionTitle: 'Math Teacher'
    }
  },
  // Add more demo chats
];

const DEMO_MESSAGES: Message[] = [
  {
    id: 'msg1',
    senderId: 'demo_institution1',
    receiverId: 'demo_educator',
    content: 'We would love to schedule an interview with you.',
    timestamp: new Date(),
    read: false,
    type: 'text'
  },
  {
    id: 'msg2',
    senderId: 'demo_educator',
    receiverId: 'demo_institution1',
    content: 'That sounds great! When would be a good time?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: true,
    type: 'text'
  },
  // Add more demo messages
];

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>(DEMO_CHATS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat) {
      // In a real app, fetch messages from Firestore
      setMessages(DEMO_MESSAGES);
      scrollToBottom();
    }
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'demo_educator',
      receiverId: selectedChat.participants.find(p => p !== 'demo_educator') || '',
      content: newMessage,
      timestamp: new Date(),
      read: false,
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    scrollToBottom();
  };

  return (
    <>
      <Head>
        <title>Messages - The Pass App</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 divide-x divide-gray-200">
              {/* Chat List */}
              <div className="col-span-4 h-[calc(100vh-12rem)]">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Messages</h2>
                </div>
                <div className="overflow-y-auto h-full">
                  {chats.map(chat => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                        selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {chat.metadata?.positionTitle}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {chat.lastMessage?.content}
                          </p>
                        </div>
                        {chat.unreadCount['demo_educator'] > 0 && (
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs">
                              {chat.unreadCount['demo_educator']}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="col-span-8 h-[calc(100vh-12rem)] flex flex-col">
                {selectedChat ? (
                  <>
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold">
                        {selectedChat.metadata?.positionTitle}
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-4">
                        {messages.map(message => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderId === 'demo_educator'
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                                message.senderId === 'demo_educator'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.senderId === 'demo_educator'
                                    ? 'text-blue-100'
                                    : 'text-gray-500'
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <form onSubmit={handleSendMessage}>
                        <div className="flex space-x-4">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Send
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Select a conversation to start messaging
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
