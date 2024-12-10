import { useState } from 'react';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
  selectedChatId?: string;
}

export default function ChatList({ onChatSelect, selectedChatId }: ChatListProps) {
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Lincoln High School',
      lastMessage: 'We would love to schedule an interview with you...',
      time: '5m',
      unread: 2,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    {
      id: '2',
      name: 'Edison Middle School',
      lastMessage: 'Thank you for your interest in our position...',
      time: '2h',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    },
    {
      id: '3',
      name: 'Washington Elementary',
      lastMessage: 'Your experience looks like a great fit for...',
      time: '1d',
      unread: 1,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    }
  ]);

  return (
    <div className="border-r border-gray-200 w-80 flex-shrink-0 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
              selectedChatId === chat.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onChatSelect(chat.id)}
          >
            <div className="flex items-center space-x-4">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.name}
                  </p>
                  <p className="text-xs text-gray-500">{chat.time}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full">
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
