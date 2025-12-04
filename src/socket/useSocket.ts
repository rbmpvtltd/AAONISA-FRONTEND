// import { useEffect, useRef } from "react";
// import { getSocket } from "./socket";

// export function useSocket(userId?: string) {
//   const socketRef = useRef(getSocket());

//   useEffect(() => {
//     const socket = socketRef.current;

//     if (!userId) return;

//     // attach auth/userId
//     socket.io.opts.query = { userId };

//     if (!socket.connected) {
//       socket.connect();
//       console.log("🔌 Socket connecting with:", userId);
//     }

//     return () => {
//       // ❌ do NOT disconnect entire socket
//       // socket.disconnect();
//     };
//   }, [userId]);

//   return socketRef.current;
// }
