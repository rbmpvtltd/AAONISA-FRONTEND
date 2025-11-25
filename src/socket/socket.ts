import io from "socket.io-client";

export const socket = io("http://192.168.1.52:3000/socket.io", {
  transports: ["websocket"],
  autoConnect: false,
});


// src/hooks/useSocketManager.ts
// import { useChatStore } from '@/src/store/useChatStore';
// import { useEffect, useRef } from 'react';
// import { io, Socket } from 'socket.io-client';

// let globalSocket: Socket | null = null;
// let isListenerRegistered = false;

// export function useSocketManager(userId?: string) {
//   const { addMessage } = useChatStore();
//   const userIdRef = useRef(userId);

//   // ✅ Keep userId ref updated
//   useEffect(() => {
//     userIdRef.current = userId;
//   }, [userId]);

//   useEffect(() => {
//     if (!userId) return;

//     // ✅ Create socket instance once
//     if (!globalSocket) {
//       globalSocket = io('http://192.168.1.52:3000/socket.io', {
//         transports: ['websocket'],
//         autoConnect: false,
//       });

//       console.log('🔌 Socket instance created');
//     }

//     // ✅ Set user ID in query
//     globalSocket.io.opts.query = { userId };

//     // ✅ Connect if not connected
//     if (!globalSocket.connected) {
//       globalSocket.connect();
//       console.log('🟢 Socket connecting...');
//     }

//     // ✅ Register message listener ONCE globally
//     if (!isListenerRegistered) {
//       const handleMessage = (msg: any) => {
//         console.log('📥 Global listener received:', msg);

//         const currentUserId = userIdRef.current;
//         if (!currentUserId) return;

//         // ✅ Determine the chat key (other person's ID)
//         const otherUserId =
//           msg.senderId === currentUserId ? msg.receiverId : msg.senderId;

//         // ✅ Add message to store (will persist automatically)
//         addMessage(otherUserId, {
//           id: msg.id || String(msg.createdAt),
//           text: msg.text,
//           fromMe: msg.senderId === currentUserId,
//           createdAt: msg.createdAt,
//         });
//       };

//       globalSocket.on('Message', handleMessage);
//       isListenerRegistered = true;
//       console.log('✅ Global message listener registered');

//       // ✅ Connection event handlers
//       globalSocket.on('connect', () => {
//         console.log('✅ Socket connected:', globalSocket?.id);
//       });

//       globalSocket.on('disconnect', () => {
//         console.log('❌ Socket disconnected');
//       });

//       globalSocket.on('connect_error', (error) => {
//         console.error('❌ Socket connection error:', error);
//       });
//     }

//     // ✅ NO cleanup on component unmount (keep listening)
//     return () => {
//       // Keep socket alive
//     };
//   }, [userId, addMessage]);

//   return globalSocket;
// }

// // ✅ Export getter for socket instance
// export const getSocket = (): Socket | null => globalSocket;

// // ✅ Cleanup function (call on logout)
// export const disconnectSocket = () => {
//   if (globalSocket?.connected) {
//     globalSocket.disconnect();
//     console.log('🔴 Socket disconnected manually');
//   }
//   globalSocket = null;
//   isListenerRegistered = false;
// };