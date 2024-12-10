import { useState, useEffect, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';
import { format } from 'date-fns';
import { FaPaperPlane, FaEllipsisH } from 'react-icons/fa';
import MobileLayout from '../components/layouts/MobileLayout';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'educator' | 'school';
  participantAvatar: string;
  lastMessage?: Message;
  unreadCount: number;
}

export default function Messages() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockChats: Chat[] = [
        {
          id: '1',
          participantId: 'school1',
          participantName: 'Lincoln High School',
          participantRole: 'school',
          participantAvatar: '/school1.jpg',
          unreadCount: 2,
          lastMessage: {
            id: 'msg1',
            senderId: 'school1',
            senderName: 'Lincoln High School',
            recipientId: 'user1',
            content: 'We would love to schedule an interview with you.',
            timestamp: new Date(),
            read: false
          }
        },
        // Add more mock chats as needed
      ];

      setChats(mockChats);
      setIsLoading(false);
    } catch (error) {
      showToast('Failed to load chats', 'error');
      setIsLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockMessages: Message[] = [
        {
          id: 'msg1',
          senderId: 'school1',
          senderName: 'Lincoln High School',
          recipientId: 'user1',
          content: 'Hello! We were very impressed with your application.',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          read: true
        },
        {
          id: 'msg2',
          senderId: 'user1',
          senderName: 'You',
          recipientId: 'school1',
          content: "Thank you! I'm very interested in the position.",
          timestamp: new Date(Date.now() - 82800000), // 23 hours ago
          read: true
        },
        // Add more mock messages as needed
      ];

      setMessages(mockMessages);
    } catch (error) {
      showToast('Failed to load messages', 'error');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: `msg${Date.now()}`,
      senderId: 'user1',
      senderName: 'You',
      recipientId: selectedChat.participantId,
      content: newMessage.trim(),
      timestamp: new Date(),
      read: true
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Update last message in chats
      setChats(prev =>
        prev.map(chat =>
          chat.id === selectedChat.id
            ? { ...chat, lastMessage: message }
            : chat
        )
      );
    } catch (error) {
      showToast('Failed to send message', 'error');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="h-full flex flex-col">
        {!selectedChat ? (
          // Chat List
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h1 className="text-xl font-bold mb-4">Messages</h1>
              <div className="space-y-4">
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className="flex items-center p-3 bg-white dark:bg-dark-surface rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-accent/10"
                  >
                    <div className="relative">
                      <img
                        src={chat.participantAvatar}
                        alt={chat.participantName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {chat.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold">{chat.participantName}</h3>
                        {chat.lastMessage && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatMessageTime(chat.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      {chat.lastMessage && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {chat.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Chat View
          <>
            <div className="flex items-center justify-between p-4 border-b dark:border-dark-accent">
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="mr-3 text-gray-600 dark:text-gray-400"
                >
                  ←
                </button>
                <img
                  src={selectedChat.participantAvatar}
                  alt={selectedChat.participantName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h2 className="font-semibold">{selectedChat.participantName}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {selectedChat.participantRole}
                  </p>
                </div>
              </div>
              <button className="text-gray-600 dark:text-gray-400">
                <FaEllipsisH />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === 'user1' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-4 py-2 ${
                        message.senderId === 'user1'
                          ? 'bg-brand-primary text-white'
                          : 'bg-gray-100 dark:bg-dark-accent text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p>{message.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          message.senderId === 'user1'
                            ? 'text-white/80'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-4 border-t dark:border-dark-accent">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-full border dark:border-dark-accent bg-gray-100 dark:bg-dark-accent focus:outline-none focus:ring-2 focus:ring-brand-primary dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 rounded-full bg-brand-primary text-white disabled:opacity-50"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  );
}
