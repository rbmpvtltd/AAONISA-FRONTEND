
// import { create } from "zustand";

// export type Message = {
//   id: string;
//   fromMe: boolean;
//   text: string;
//   createdAt: number;
// };

// export type ChatSummary = { id: string; name: string; lastMessage?: string };

// type ChatState = {
//   chats: ChatSummary[];
//   messages: Record<string, Message[]>;
//   selectedMessage: Message | null;
//   sessionId:number|null;
//   setSessionId: (id:number|null) => void;
//   getSessionId: () => number|null
//   setSelectedMessage: (msg: Message | null) => void;
//   setChats: (chats: ChatSummary[]) => void;
//   addMessage: (chatId: string, msg: Message) => void;
//   deleteMessageForMe: (chatId: string, msgId: string) => void;
//   deleteMessageForEveryone: (chatId: string, msgId: string) => void;
//   clearMessages: (chatId: string) => void;
// };

// export const useChatStore = create<ChatState>((set,get) => ({
//   chats: [],
//   messages: {},
//   selectedMessage: null,
//   sessionId: null,
//   setSessionId(id) {
//     // console.log(id)
//     set({ sessionId: id });
//   },
//   getSessionId: () => get().sessionId,

//   setSelectedMessage: (msg) => set({ selectedMessage: msg }),
//   setChats: (chats) => set({ chats }),

//   // ✅ Add message with duplicate check
//   addMessage: (chatId, msg) =>
//     set((state) => {
//       const existing = state.messages[chatId] ?? [];
//       if (existing.some((m) => m.id === msg.id)) return state; // ignore duplicate
//       return { messages: { ...state.messages, [chatId]: [...existing, msg] } };
//     }),

//   clearMessages: (chatId) =>
//     set((state) => ({ messages: { ...state.messages, [chatId]: [] } })),
//   clearRoomMessages: (chatId:any) =>
//     set((state) => {
//       const updated = { ...state.messages };
//       delete updated[chatId];
//       return { messages: updated };
//     }),
//   deleteMessageForMe: (chatId, msgId) =>
//     set((state) => ({
//       messages: { ...state.messages, [chatId]: state.messages[chatId]?.filter((m) => m.id !== msgId) ?? [] },
//       selectedMessage: null,
//     })),

//   deleteMessageForEveryone: (chatId, msgId) =>
//     set((state) => ({
//       messages: {
//         ...state.messages,
//         [chatId]: state.messages[chatId]?.map((m) => (m.id === msgId ? { ...m, text: "This message was deleted" } : m)) ?? [],
//       },
//       selectedMessage: null,
//     })),
// }));
import { create } from "zustand";

export type Message = {
  id: string;
  fromMe: boolean;
  text: string;
  createdAt: number;
};

export type ChatSummary = { id: string; name: string; lastMessage?: string };

type ChatState = {
  chats: ChatSummary[];
  messages: Record<string, Message[]>;
  currentChatId: string | null;
  selectedMessage: Message | null;
  sessionId: number | null;

  setSessionId: (id: number | null) => void;
  getSessionId: () => number | null;
  setSelectedMessage: (msg: Message | null) => void;
  setChats: (chats: ChatSummary[]) => void;

  setCurrentChat: (chatId: string) => void;
  clearCurrentChat: () => void;
  getMessages: () => Message[]|[];
  addMessage: (msg: Message) => void;
  deleteMessageForMe: (msgId: string) => void;
  deleteMessageForEveryone: (msgId: string) => void;
  clearMessages: () => void;
  clearRoomMessages: (chatId: string) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: {},
  currentChatId: null,
  selectedMessage: null,
  sessionId: null,

  setSessionId: (id) => set({ sessionId: id }),
  getSessionId: () => get().sessionId,
  setSelectedMessage: (msg) => set({ selectedMessage: msg }),
  setChats: (chats) => set({ chats }),

  // Set the current chat
  setCurrentChat: (chatId) =>
  {
    set((state) => ({
      currentChatId: chatId,
      messages: { ...state.messages, [chatId]: state.messages[chatId] ?? [] },
      selectedMessage: null,
    }))},

  // Clear the current chat messages from store
  clearCurrentChat: () =>{
    console.log("clearing current chat")
    set((state) => {
      const chatId = state.currentChatId;
      if (!chatId) return state;
      return {
        messages: { ...state.messages, [chatId]: [] },
        currentChatId: null,
        selectedMessage: null,
      };
    })},
    getMessages: () => {
  const state = get();
  if (!state.currentChatId) return [];
  return state.messages[state.currentChatId] ?? [];
},

  addMessage: (msg) =>{
    set((state) => {
      const chatId = state.currentChatId;
      if (!chatId) return state;
      const existing = state.messages[chatId] ?? [];
      if (existing.some((m) => m.id === msg.id)) return state;
      return {
        messages: { ...state.messages, [chatId]: [...existing, msg] },
      };
    })},
  deleteMessageForMe: (msgId) =>
    set((state) => {
      const chatId = state.currentChatId;
      if (!chatId) return state;
      return {
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId]?.filter((m) => m.id !== msgId) ?? [],
        },
        selectedMessage: null,
      };
    }),

  deleteMessageForEveryone: (msgId) =>
    set((state) => {
      const chatId = state.currentChatId;
      if (!chatId) return state;
      return {
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId]?.map((m) =>
            m.id === msgId ? { ...m, text: "This message was deleted" } : m
          ) ?? [],
        },
        selectedMessage: null,
      };
    }),

  clearMessages: () =>
    set((state) => {
      const chatId = state.currentChatId;
      if (!chatId) return state;
      return { messages: { ...state.messages, [chatId]: [] } };
    }),

  clearRoomMessages: (chatId) =>
    set((state) => {
      const updated = { ...state.messages };
      delete updated[chatId];
      return { messages: updated };
    }),
}));
