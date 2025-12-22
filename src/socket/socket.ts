// import React from "react";
// import { io, Socket } from "socket.io-client";

// let globalSocket: Socket | null = null;
// let isListenerRegistered = false;

// export const getSocket = (): Socket => {
//   if (!globalSocket) {
//     globalSocket = io("http://192.168.1.63:3000/socket.io", {
//       transports: ["websocket"],
//       autoConnect: false,
//     });
//   }
//   return globalSocket;
// };

// export function useSocket(userId?: string) {
//   const socket = getSocket();

//   React.useEffect(() => {
//     if (!userId) return;

//     if (!socket.connected) {
//       socket.io.opts.query = { userId }; // only before connect
//       socket.connect();
//       console.log("🟢 Socket connecting...");
//     }

//     return () => {
//       // optional: leave rooms, but DO NOT disconnect globally
//     };
//   }, [userId]);

//   return socket;
// }

// /**
//  * Register listeners once
//  */
// export const registerSocketListeners = (handlers: Record<string, (...args: any[]) => void>) => {
//   const socket = getSocket();
//   if (isListenerRegistered) return; // prevent duplicate listener
//   isListenerRegistered = true;

//   Object.entries(handlers).forEach(([event, handler]) => {
//     socket.on(event, handler);
//   });
// };

// /**
//  * Cleanup all listeners (if needed)
//  */
// export const cleanupSocketListeners = () => {
//   const socket = getSocket();
//   socket.removeAllListeners();
//   isListenerRegistered = false;
// };

// /**
//  * Disconnect socket manually
//  */
// export const disconnectSocket = () => {
//   if (globalSocket?.connected) {
//     globalSocket.disconnect();
//     console.log("🔴 Socket disconnected manually");
//   }
//   globalSocket = null;
//   isListenerRegistered = false;
// };

// import { useChatStore } from "@/src/store/useChatStore";
// import { useEffect, useRef } from "react";
// import { io, Socket } from "socket.io-client";

// let globalSocket: Socket | null = null;
// let isListenerRegistered = false;

// export function useSocketManager(userId?: string, otherUserId?: string) {
//   const { addMessage } = useChatStore();
//   const userIdRef = useRef(userId);
//   const otherUserRef = useRef(otherUserId);

//   useEffect(() => { userIdRef.current = userId; }, [userId]);
//   useEffect(() => { otherUserRef.current = otherUserId; }, [otherUserId]);

//   useEffect(() => {
//     if (!userId || !otherUserId) return;

//     // Create socket instance if not exists
//     if (!globalSocket) {
//       globalSocket = io("http://192.168.1.63:3000/socket.io", {
//         transports: ["websocket"],
//         autoConnect: false,
//       });
//       console.log("🔌 Socket instance created");
//     }

//     // Set query before connect
//     globalSocket.io.opts.query = { userId };

//     // Function to join room & fetch previous messages
//     const joinRoomAndFetch = () => {
//       const roomId = [userIdRef.current, otherUserRef.current].sort().join("-");
//       globalSocket?.emit("joinRoom", { roomId });
//       globalSocket?.emit("getPreviousMessages", { user1Id: userIdRef.current, user2Id: otherUserRef.current });
//       console.log("🟢 Joined room:", roomId);
//     };

//     // Connect socket if not connected
//     if (!globalSocket.connected) {
//       globalSocket.connect();
//       console.log("🟢 Socket connecting...");
//       globalSocket.once("connect", joinRoomAndFetch);
//     } else {
//       joinRoomAndFetch(); // Already connected, join room immediately
//     }

//     // Register listeners only once
//     if (!isListenerRegistered) {
//       globalSocket.on("Message", (msg: any) => {
//         const myId = userIdRef.current;
//         if (!myId) return;

//         const roomKey = [msg.senderId, msg.receiverId].sort().join("-");
//         addMessage(roomKey, {
//           id: String(msg.id ?? msg.messageId ?? msg.createdAt),
//           text: msg.text ?? msg.message_text,
//           fromMe: msg.senderId === myId,
//           createdAt: msg.createdAt ?? Date.now(),
//         });
//       });

//       globalSocket.on("previousMessages", (payload: { messages?: any[] }) => {
//         const myId = userIdRef.current;
//         if (!myId) return;
//         const roomKey = [userIdRef.current, otherUserRef.current].sort().join("-");
//         (payload.messages ?? []).forEach((raw: any) => {
//           addMessage(roomKey, {
//             id: String(raw.id ?? raw.messageId ?? raw.createdAt),
//             text: raw.text ?? raw.message_text,
//             fromMe: raw.senderId === myId,
//             createdAt: raw.createdAt ?? Date.now(),
//           });
//         });
//       });

//       isListenerRegistered = true;
//       console.log("✅ Socket listeners registered");
//     }

//     // Cleanup function
//     return () => {
//       // optional: leave room on unmount of chat
//       const roomId = [userIdRef.current, otherUserRef.current].sort().join("-");
//       globalSocket?.emit("leaveRoom", { roomId });
//     };

//   }, [userId, otherUserId, addMessage]);

//   return globalSocket;
// }

// // Disconnect socket manually (e.g., on logout)
// export const disconnectSocket = () => {
//   if (globalSocket?.connected) globalSocket.disconnect();
//   globalSocket = null;
//   isListenerRegistered = false;
//   console.log("🔴 Socket disconnected");
// };
import { useChatStore } from "@/src/store/useChatStore";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let globalSocket: Socket | null = null;

export function useSocketManager(userId?: string, otherUserId?: string) {
  const { addMessage, setSessionId, clearCurrentChat } = useChatStore();
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);

  const userIdRef = useRef(userId);
  const otherUserIdRef = useRef(otherUserId);

  useEffect(() => {
    userIdRef.current = userId;
    otherUserIdRef.current = otherUserId;
  }, [userId, otherUserId]);

  useEffect(() => {
    if (!userId) return;

    // 🟢 Create Global Socket Once
    if (!globalSocket) {
      globalSocket = io("http://88.222.213.106:3000/socket.io", {
        transports: ["websocket"],
        autoConnect: false,
      });
      console.log("🔌 SOCKET CREATED");
    }

    globalSocket.io.opts.query = { userId };

    if (!globalSocket.connected) {
      globalSocket.connect();
      console.log("🟢 SOCKET CONNECTING...");
    }

    // ⚠️ STORY MODE → NO CHAT LOGIC
    if (!otherUserId) {
      console.log("📘 STORY MODE ACTIVE");
      return; // Socket connected, nothing else
    }

    // 🟣 CHAT MODE BELOW
    console.log("💬 CHAT MODE ACTIVE");

    const roomId = [userId, otherUserId].sort().join("-");
    setCurrentChat(roomId);

    const joinRoom = () => {
      globalSocket?.emit("joinRoom", { roomId });
      globalSocket?.emit("getPreviousMessages", {
        user1Id: userId,
        user2Id: otherUserId,
      });
    };

    if (globalSocket.connected) joinRoom();
    else globalSocket.once("connect", joinRoom);

    // CHAT listeners
    globalSocket.off("Message");
    globalSocket.off("previousMessages");

    globalSocket.on("Message", (msg) => {
      const activeRoom = [msg.senderId, msg.receiverId].sort().join("-");
      if (activeRoom !== roomId) return;

      addMessage({
        id: String(msg.chat_id ?? msg.message_id),
        text: msg.text ?? msg.message_text,
        fromMe: msg.senderId === userIdRef.current,
        createdAt: msg.createdAt ?? Date.now(),
      });
    });

    globalSocket.on("previousMessages", (payload) => {
      setSessionId(payload.sessionId);

      payload.messages?.forEach((raw: any) =>
        addMessage({
          id: String(raw.chat_id ?? raw.messageId),
          text: raw.message_text,
          fromMe: raw.sender.id === userIdRef.current,
          createdAt: raw.created_at,
        })
      );
    });

    return () => {
      console.log("🚪 LEAVING CHAT ROOM:", roomId);
      globalSocket?.emit("leaveRoom", { roomId });
      setSessionId(null);
      clearCurrentChat();
    };
  }, [userId, otherUserId]);

  return globalSocket;
}

// Disconnect socket manually (e.g., on logout)
export const disconnectSocket = () => {
  if (globalSocket?.connected) globalSocket.disconnect();
  globalSocket = null;
  console.log("🔴 Socket disconnected");
};