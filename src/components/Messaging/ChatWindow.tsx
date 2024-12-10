import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { FaPaperPlane } from 'react-icons/fa';
import { useToast } from '../../contexts/ToastContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  timestamp: string;
}

interface ChatWindowProps {
  chatId: string;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! We were very impressed with your profile.',
      sender: 'other',
      timestamp: '10:00 AM'
    },
    {
      id: '2',
      content: 'Thank you! I\'m very interested in the position.',
      sender: 'user',
      timestamp: '10:02 AM'
    },
    {
      id: '3',
      content: 'Would you be available for an interview next week?',
      sender: 'other',
      timestamp: '10:05 AM'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: 'user',
      timestamp: format(new Date(), 'h:mm a')
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      showToast('Failed to send message', 'error');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-dark-background">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-brand-primary text-white'
                    : 'bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100'
                }`}
              >
                <p>{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === 'user'
                      ? 'text-white/80'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {message.timestamp}
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
            className="flex-1 px-4 py-2 rounded-full border dark:border-dark-accent bg-white dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-brand-primary dark:text-white"
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
    </div>
  );
}
