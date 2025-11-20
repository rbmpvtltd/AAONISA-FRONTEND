import io from "socket.io-client";

export const socket = io("http://192.168.1.52:3000/socket.io", {
  query: {
    userId: "id", // login ke baad actual id set karna
  },
});
