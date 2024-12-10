export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    imageUrl?: string;
  };
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastActivity: Date;
  unreadCount: {
    [userId: string]: number;
  };
  metadata?: {
    positionId?: string;
    positionTitle?: string;
    institutionId?: string;
    educatorId?: string;
  };
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  type: 'educator' | 'institution';
  lastSeen?: Date;
  isOnline?: boolean;
}
