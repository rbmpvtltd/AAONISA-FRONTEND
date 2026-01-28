export interface Message {
  id: string;
  text: string;
  createdAt: number;
  fromMe: boolean;
  type?: 'text' | 'reel';  // Optional type field
  reelData?: {              // Optional reelData field
    videoId: string;
    url: string;
    thumbnail: string;
  };
}

export type ChatSummary = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  unread?: number;
  sessionId: string;
  role: string;
};
