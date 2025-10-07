import { create } from 'zustand';
import { ChatSummary, Message } from '../types/chatType';

type ChatState = {
  chats: ChatSummary[];
  messages: Record<string, Message[]>; // chatId → messages[]
  selectedMessage: Message | null;
  setSelectedMessage: (msg: Message | null) => void;
  addMessage: (chatId: string, msg: Message) => void;
  deleteMessageForMe: (chatId: string, msgId: string) => void;
  deleteMessageForEveryone: (chatId: string, msgId: string) => void;
  setChats: (chats: ChatSummary[]) => void;
};

const MOCK_CHATS: ChatSummary[] = [
  { id: 'u1', name: 'Sara', avatar: 'https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=', lastMessage: 'Sent a reel', unread: 2 },
  { id: 'u2', name: 'Ahsan', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000', lastMessage: 'Shared news', unread: 0 },
  { id: 'u3', name: 'Riz', avatar: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000', lastMessage: 'Voice message', unread: 1 },
    { id: 'u4', name: 'Sa', avatar: 'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?fm=jpg&q=60&w=3000', lastMessage: 'Sent a reel', unread: 2 },
  { id: 'u5', name: 'Ah', avatar: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D', lastMessage: 'Shared news', unread: 0 },
  { id: 'u6', name: 'R', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', lastMessage: 'Voice message', unread: 1 },
  { id: 'u7', name: 'ra', avatar: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D', lastMessage: 'Sent a reel', unread: 2 },
  { id: 'u8', name: 'san', avatar: 'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', lastMessage: 'Shared news', unread: 0 },
  { id: 'u9', name: 'z', avatar: 'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', lastMessage: 'Voice message', unread: 1 },
  { id: 'u10', name: 'a', avatar: 'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', lastMessage: 'Sent a reel', unread: 2 },
  { id: 'u11', name: 'Ahssaa', avatar: 'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', lastMessage: 'Shared news', unread: 0 },
  { id: 'u12', name: 'Rizaaa', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', lastMessage: 'Voice message', unread: 1 },
  { id: 'u13', name: 'Saraaa', avatar: 'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', lastMessage: 'Sent a reel', unread: 2 },
  { id: 'u14', name: 'Ahsanaa', avatar: 'https://img.freepik.com/free-photo/front-view-man-posing_23-2148364843.jpg?semt=ais_hybrid&w=740&q=80', lastMessage: 'Shared news', unread: 0 },
  { id: 'u15', name: 'Rizaaaaa', avatar: 'https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=', lastMessage: 'Voice message', unread: 1 },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  u1: [
    { id: 'm1', fromMe: false, text: 'Hey, kya haal hai?', createdAt: Date.now() - 1000 * 60 * 60 },
    { id: 'm2', fromMe: true, text: 'Bas chill, tu bata?', createdAt: Date.now() - 1000 * 50 },
  ],
};

export const useChatStore = create<ChatState>((set) => ({
  chats: MOCK_CHATS,
  messages: MOCK_MESSAGES,
  selectedMessage: null,

  setSelectedMessage: (msg) => set({ selectedMessage: msg }),
  setChats: (chats) => set({ chats }),

  addMessage: (chatId, msg) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] ?? []), msg],
      },
    })),

  deleteMessageForMe: (chatId, msgId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId].filter((m) => m.id !== msgId),
      },
      selectedMessage: null,
    })),

  deleteMessageForEveryone: (chatId, msgId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId].map((m) =>
          m.id === msgId ? { ...m, text: 'This message was deleted' } : m
        ),
      },
      selectedMessage: null,
    })),
}));
