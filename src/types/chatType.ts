export type Message = {
  id: string;
  fromMe: boolean;
  text: string;
  createdAt: number;
};

export type ChatSummary = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  unread?: number;
};
