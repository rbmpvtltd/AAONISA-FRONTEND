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
let listenersRegistered = false;

export function useSocketManager(userId?: string, otherUserId?: string) {
  const { addMessage,setSessionId,clearMessages } = useChatStore();

  const userIdRef = useRef(userId);
  const otherUserRef = useRef(otherUserId);
  const roomIdRef = useRef<string | null>(null);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    otherUserRef.current = otherUserId;
  }, [otherUserId]);

  useEffect(() => {
    if (!userId || !otherUserId) return;

    // Create a single global socket
    if (!globalSocket) {
      globalSocket = io("http://192.168.1.63:3000/socket.io", {
        transports: ["websocket"],
        query: { userId },
        autoConnect: false,
      });
      console.log("🔌 Socket instance created");
    }

    // Always update query before connect
    globalSocket.io.opts.query = { userId };

    // Connect if needed
    if (!globalSocket.connected) {
      globalSocket.connect();
      console.log("🟢 Connecting...");
    }

    // Create room ID
    const roomId = [userId, otherUserId].sort().join("-");
    roomIdRef.current = roomId;

    const joinRoom = () => {
      globalSocket?.emit("joinRoom", { roomId });
      globalSocket?.emit("getPreviousMessages", { user1Id: userId, user2Id: otherUserId });
      console.log("🟢 Joined Room:", roomId);
    };

    if (globalSocket.connected) {
      joinRoom();
    } else {
      globalSocket.once("connect", joinRoom);
    }

    // Register global listeners ONCE
    if (!listenersRegistered) {
      globalSocket.on("Message", (msg: any) => {
        const myId = userIdRef.current;
        const otherId = otherUserRef.current;

        const currentRoom = [myId, otherId].sort().join("-");
        const incomingRoom = [msg.senderId, msg.receiverId].sort().join("-");

        // Prevent duplicate / wrong room messages
        if (incomingRoom !== currentRoom) return;

        addMessage(currentRoom, {
          id: String(msg.chat_id ?? msg.createdAt ?? Date.now()),
          text: msg.text ?? msg.message_text,
          fromMe: msg.sender.id === myId,
          createdAt: msg.created_at ?? Date.now(),
        });
      });

      globalSocket.on("previousMessages", (payload) => {
        const myId = userIdRef.current;
        const otherId = otherUserRef.current;
        setSessionId(payload.sessionId);
        const room = [myId, otherId].sort().join("-");
        payload.messages?.forEach((raw:any) => {
          addMessage(room, {
            id: String(raw.chat_id ?? raw.messageId ?? raw.createdAt),
            text: raw.message_text,
            fromMe: raw.sender.id === myId,
            createdAt: raw.created_at,
          });
        });
      });

      listenersRegistered = true;
      console.log("✅ Listeners registered once");
    }

    // Cleanup only room leave — NOT listeners
    return () => {
      console.log("🚪 Leaving room:", roomIdRef.current);
      globalSocket?.emit("leaveRoom", { roomId: roomIdRef.current });
      setSessionId(null);
      clearMessages(otherUserId);
    };
  }, [userId, otherUserId]);

  return globalSocket;
}

export const disconnectSocket = () => {
  if (globalSocket) {
    globalSocket.removeAllListeners();
    globalSocket.disconnect();
  }
  globalSocket = null;
  listenersRegistered = false;
  console.log("🔴 Socket fully disconnected!");
};
