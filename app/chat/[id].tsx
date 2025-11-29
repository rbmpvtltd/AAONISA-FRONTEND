import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";

import { chatSessionId, getSessionMessages } from "@/src/api/chat-api";
import { GetCurrentUser } from "@/src/api/profile-api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { getSocket, useSocket } from "@/src/socket/socket";
import { useChatStore } from "@/src/store/useChatStore";
import { Message } from "@/src/types/chatType";

/* -------------------------
   Helpers
------------------------- */
function getRoomId(userId1: string, userId2: string) {
  return [userId1, userId2].sort().join("-");
}

function normalizeIncomingMessage(raw: any) {
  const id = String(raw.message_id ?? raw.chat_id ?? raw.id ?? raw.messageId);
  const text = raw.message_text ?? raw.text ?? "";
  const senderId = raw.sender_id ?? raw.sender?.id ?? raw.senderId;
  const receiverId = raw.receiver_id ?? raw.receiverId ?? raw.receiverId;
  const createdAt = new Date(raw.created_at ?? raw.createdAt ?? Date.now()).getTime();

  return { id, text, senderId, receiverId, createdAt };
}

/* -------------------------
   UI Components
------------------------- */
function MessageBubble({ m, onLongPress, fontSize, bubblePadding }: { m: Message; onLongPress: (msg: Message) => void; fontSize: number; bubblePadding: number; }) {
  const theme = useAppTheme();
  const align = m.fromMe ? "flex-end" : "flex-start";
  const bg = m.fromMe ? theme.buttonBg : theme.inputBg;
  const textColor = m.fromMe ? theme.buttonText : theme.text;

  return (
    <Pressable onLongPress={() => onLongPress(m)} style={{ alignSelf: align, marginVertical: 6, maxWidth: "80%" }}>
      <View style={[styles.bubble, { backgroundColor: bg, padding: bubblePadding }]}>
        <Text style={{ color: textColor, fontSize }}>{m.text}</Text>
      </View>
      <Text style={{ fontSize: fontSize - 4, color: theme.subtitle, marginTop: 4, alignSelf: align }}>
        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>
    </Pressable>
  );
}

function Composer({ onSend, inputFontSize, padding }: { onSend: (msg: string) => void; inputFontSize: number; padding: number; }) {
  const theme = useAppTheme();
  const [text, setText] = useState("");

  function sendText() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <View style={[styles.composerContainer, { backgroundColor: theme.background, borderColor: theme.inputBorder, paddingHorizontal: padding, paddingVertical: padding / 1.5 }]}>
      <View style={styles.composerRow}>
        <TextInput
          placeholder="Message..."
          placeholderTextColor={theme.placeholder}
          value={text}
          onChangeText={setText}
          style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text, fontSize: inputFontSize, paddingHorizontal: padding / 1.2, paddingVertical: padding / 2 }]}
          multiline
        />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: theme.buttonBg, paddingVertical: padding / 2, paddingHorizontal: padding }]} onPress={sendText}>
          <Text style={{ color: theme.buttonText, fontSize: inputFontSize }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* -------------------------
   Main Screen
------------------------- */
export default function ChatDetailScreen() {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const route = useRoute<RouteProp<{ params: { id: string; chatName?: string } }, "params">>();
  const { id: chatUserId } = route.params;

  const { data: currentUser } = useQuery({ queryKey: ["currentUser"], queryFn: GetCurrentUser });
  const CURRENT_USER_ID = currentUser?.id;

  const socket = getSocket();
  useSocket(CURRENT_USER_ID); // singleton connect

  const { messages, addMessage, selectedMessage, setSelectedMessage, deleteMessageForMe, deleteMessageForEveryone } = useChatStore();

  const flatRef = useRef<FlatList<any>>(null);
  const currentUserIdRef = useRef<string | undefined>(CURRENT_USER_ID);
  const currentRoomIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<number | null>(null);
  const joinedRef = useRef(false);
  
  useEffect(() => { currentUserIdRef.current = CURRENT_USER_ID; }, [CURRENT_USER_ID]);

  /* -------------------------
     Create session + join room (idempotent)
  ------------------------- */
  useEffect(() => {
    if (!CURRENT_USER_ID || !chatUserId) return;

    const roomId = getRoomId(CURRENT_USER_ID, chatUserId);
    currentRoomIdRef.current = roomId;
    let didCancel = false;

    async function createSession() {
      try {
        const sessionData = await chatSessionId(CURRENT_USER_ID, chatUserId);
        if (didCancel) return;
        sessionIdRef.current = sessionData.session_id;
      } catch (err) {
        console.error("❌ Error creating session:", err);
      }
    }

    createSession();

    const handleConnect = () => {
      if (joinedRef.current) return;
      joinedRef.current = true;
      socket.emit("joinRoom", { roomId });
      console.log("🟢 Joined Room:", roomId);
      socket.emit("getPreviousMessages", { user1Id: CURRENT_USER_ID, user2Id: chatUserId });
    };

    if (socket.connected) handleConnect();
    else socket.on("connect", handleConnect);

    return () => {
      didCancel = true;
      if (roomId) socket.emit("leaveRoom", { roomId });
      socket.off("connect", handleConnect);
      joinedRef.current = false;
    };
  }, [CURRENT_USER_ID, chatUserId, socket]);

  /* -------------------------
     Socket listeners (named + cleanup)
  ------------------------- */
  useEffect(() => {
    if (!chatUserId) return;
    const roomKey = getRoomId(String(CURRENT_USER_ID), chatUserId);

    const handleMessage = (raw: any) => {
      const myId = currentUserIdRef.current;
      if (!myId) return;
      const msg = normalizeIncomingMessage(raw);
      addMessage(roomKey, { ...msg, fromMe: String(msg.senderId) === String(myId) });
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 50);
    };

    const handlePreviousMessages = async (payload: { sessionId?: number; messages?: any[] }) => {
      try {
        const myId = currentUserIdRef.current;
        if (!myId) return;

        const arr = payload.messages ?? (payload.sessionId ? await getSessionMessages(String(payload.sessionId)) : []);
        arr.forEach((raw:any) => {
          const msg = normalizeIncomingMessage(raw);
          addMessage(roomKey, { ...msg, fromMe: String(msg.senderId) === String(myId) });
        });

        setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 80);
      } catch (err) {
        console.error("❌ Error loading previousMessages:", err);
      }
    };

    const handleDeletedForMe = (data: { messageId: string }) => { deleteMessageForMe(roomKey, String(data.messageId)); };
    const handleDeletedForEveryone = (data: { messageId: string; deletedForEveryone?: boolean }) => { if (data.deletedForEveryone) deleteMessageForEveryone(roomKey, String(data.messageId)); };

    socket.on("Message", handleMessage);
    socket.on("previousMessages", handlePreviousMessages);
    socket.on("messageDeletedForMe", handleDeletedForMe);
    socket.on("messageDeleted", handleDeletedForEveryone);

    return () => {
      socket.off("Message", handleMessage);
      socket.off("previousMessages", handlePreviousMessages);
      socket.off("messageDeletedForMe", handleDeletedForMe);
      socket.off("messageDeleted", handleDeletedForEveryone);
    };
  }, [chatUserId, addMessage, deleteMessageForMe, deleteMessageForEveryone, CURRENT_USER_ID, socket]);

  /* -------------------------
     Send / Delete Handlers
  ------------------------- */
  const sendMessageToSocket = useCallback((text: string) => {
    if (!CURRENT_USER_ID || !sessionIdRef.current) return;
    socket.emit("sendMessage", { sessionId: sessionIdRef.current, senderId: CURRENT_USER_ID, receiverId: chatUserId, text });
  }, [CURRENT_USER_ID, chatUserId, socket]);

  const handleDeleteForMe = useCallback(() => {
    if (!selectedMessage || !CURRENT_USER_ID) return;
    const roomKey = getRoomId(String(CURRENT_USER_ID), chatUserId);
    socket.emit("deleteMessageForMe", { messageId: selectedMessage.id, userId: CURRENT_USER_ID, roomId: roomKey });
    deleteMessageForMe(roomKey, selectedMessage.id);
    setSelectedMessage(null);
  }, [selectedMessage, CURRENT_USER_ID, chatUserId, deleteMessageForMe, setSelectedMessage, socket]);

  const handleDeleteForEveryone = useCallback(() => {
    if (!selectedMessage || !CURRENT_USER_ID) return;
    const roomKey = getRoomId(String(CURRENT_USER_ID), chatUserId);
    socket.emit("deleteMessageForEveryone", { messageId: selectedMessage.id, userId: CURRENT_USER_ID, roomId: roomKey });
    deleteMessageForEveryone(roomKey, selectedMessage.id);
    setSelectedMessage(null);
  }, [selectedMessage, CURRENT_USER_ID, chatUserId, deleteMessageForEveryone, setSelectedMessage, socket]);
  
  /* -------------------------
     Rendering
  ------------------------- */
  const fontSize = width < 360 ? 13 : width < 400 ? 14 : width < 600 ? 15 : 16;
  const bubblePadding = width < 360 ? 8 : width < 400 ? 10 : 12;
  const padding = width < 360 ? 8 : width < 400 ? 10 : 14;
  const modalWidth = width < 360 ? "85%" : width < 400 ? "80%" : "70%";

  const chatMessages = messages[getRoomId(String(CURRENT_USER_ID), chatUserId)] ?? [];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.background }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}>
      <View style={[styles.container, { padding }]}>
        <FlatList
          ref={flatRef}
          data={chatMessages.sort((a, b) => a.createdAt - b.createdAt)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble m={item} fontSize={fontSize} bubblePadding={bubblePadding} onLongPress={setSelectedMessage} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
        <Composer onSend={sendMessageToSocket} inputFontSize={fontSize} padding={padding} />
      </View>

      <Modal visible={!!selectedMessage} transparent animationType="fade" onRequestClose={() => setSelectedMessage(null)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.background, width: modalWidth }]}>
            <TouchableOpacity onPress={handleDeleteForMe} style={styles.modalBtn}>
              <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDeleteForEveryone} style={styles.modalBtn}>
              <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Everyone</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelectedMessage(null)} style={styles.modalBtn}>
              <Text style={[styles.modalText, { color: theme.link, fontSize }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bubble: {
    borderRadius: 12,
  },
  composerContainer: {
    borderTopWidth: 1,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    maxHeight: 100,
    marginBottom: 20,
  },
  sendBtn: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    borderRadius: 12,
    padding: 20,
  },
  modalBtn: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalText: {
    textAlign: 'center',
  },
});


// import { RouteProp, useRoute } from "@react-navigation/native";
// import { useQuery } from "@tanstack/react-query";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";

// import { chatSessionId } from "@/src/api/chat-api";
// import { GetCurrentUser } from "@/src/api/profile-api";
// import { useAppTheme } from "@/src/constants/themeHelper";
// import { useSocketManager } from "@/src/socket/socket";
// import { useChatStore } from "@/src/store/useChatStore";
// import { Message } from "@/src/types/chatType";

// /* -------------------------
//    Helpers
// ------------------------- */
// function getRoomId(userId1: string, userId2: string) {
//   return [userId1, userId2].sort().join("-");
// }

// function normalizeIncomingMessage(raw: any) {
//   const id = String(raw.message_id ?? raw.chat_id ?? raw.id ?? raw.messageId);
//   const text = raw.message_text ?? raw.text ?? "";
//   const senderId = raw.sender_id ?? raw.sender?.id ?? raw.senderId;
//   const receiverId = raw.receiver_id ?? raw.receiverId ?? raw.receiverId;
//   const createdAt = new Date(raw.created_at ?? raw.createdAt ?? Date.now()).getTime();
//   return { id, text, senderId, receiverId, createdAt };
// }

// /* -------------------------
//    UI Components
// ------------------------- */
// function MessageBubble({ m, onLongPress, fontSize, bubblePadding }: { m: Message; onLongPress: (msg: Message) => void; fontSize: number; bubblePadding: number }) {
//   const theme = useAppTheme();
//   const align = m.fromMe ? "flex-end" : "flex-start";
//   const bg = m.fromMe ? theme.buttonBg : theme.inputBg;
//   const textColor = m.fromMe ? theme.buttonText : theme.text;

//   return (
//     <Pressable onLongPress={() => onLongPress(m)} style={{ alignSelf: align, marginVertical: 6, maxWidth: "80%" }}>
//       <View style={[styles.bubble, { backgroundColor: bg, padding: bubblePadding }]}>
//         <Text style={{ color: textColor, fontSize }}>{m.text}</Text>
//       </View>
//       <Text style={{ fontSize: fontSize - 4, color: theme.subtitle, marginTop: 4, alignSelf: align }}>
//         {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//       </Text>
//     </Pressable>
//   );
// }

// function Composer({ onSend, inputFontSize, padding }: { onSend: (msg: string) => void; inputFontSize: number; padding: number }) {
//   const theme = useAppTheme();
//   const [text, setText] = useState("");

//   function sendText() {
//     if (!text.trim()) return;
//     onSend(text.trim());
//     setText("");
//   }

//   return (
//     <View style={[styles.composerContainer, { backgroundColor: theme.background, borderColor: theme.inputBorder, paddingHorizontal: padding, paddingVertical: padding / 1.5 }]}>
//       <View style={styles.composerRow}>
//         <TextInput
//           placeholder="Message..."
//           placeholderTextColor={theme.placeholder}
//           value={text}
//           onChangeText={setText}
//           style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text, fontSize: inputFontSize, paddingHorizontal: padding / 1.2, paddingVertical: padding / 2 }]}
//           multiline
//         />
//         <TouchableOpacity style={[styles.sendBtn, { backgroundColor: theme.buttonBg, paddingVertical: padding / 2, paddingHorizontal: padding }]} onPress={sendText}>
//           <Text style={{ color: theme.buttonText, fontSize: inputFontSize }}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// /* -------------------------
//    Main Screen
// ------------------------- */
// export default function ChatDetailScreen() {
//   const theme = useAppTheme();
//   const { width } = useWindowDimensions();
//   const route = useRoute<RouteProp<{ params: { id: string; chatName?: string } }, "params">>();
//   const { id: chatUserId } = route.params;

//   const { data: currentUser } = useQuery({ queryKey: ["currentUser"], queryFn: GetCurrentUser });
//   const CURRENT_USER_ID = currentUser?.id;

//   // ✅ Use socket manager instead of raw socket
//   const socket = useSocketManager(CURRENT_USER_ID, chatUserId);

//   const { messages, addMessage, selectedMessage, setSelectedMessage, deleteMessageForMe, deleteMessageForEveryone } = useChatStore();

//   const flatRef = useRef<FlatList<any>>(null);
//   const sessionIdRef = useRef<number | null>(null);
//   const joinedRef = useRef(false);

//   /* -------------------------
//      Create session + join room
//   ------------------------- */
//   useEffect(() => {
//     if (!CURRENT_USER_ID || !chatUserId || !socket) return;

//     const roomId = getRoomId(CURRENT_USER_ID, chatUserId);

//     async function createSession() {
//       try {
//         const sessionData = await chatSessionId(CURRENT_USER_ID, chatUserId);
//         sessionIdRef.current = sessionData.session_id;
//       } catch (err) {
//         console.error("❌ Error creating session:", err);
//       }
//     }

//     createSession();

//     const handleJoin = () => {
//       if (joinedRef.current) return;
//       joinedRef.current = true;
//       socket.emit("joinRoom", { roomId });
//       socket.emit("getPreviousMessages", { user1Id: CURRENT_USER_ID, user2Id: chatUserId });
//     };

//     if (socket.connected) handleJoin();
//     else socket.on("connect", handleJoin);

//     return () => {
//       socket.off("connect", handleJoin);
//       if (joinedRef.current) socket.emit("leaveRoom", { roomId });
//       joinedRef.current = false;
//     };
//   }, [CURRENT_USER_ID, chatUserId, socket]);

//   /* -------------------------
//      Send / Delete Handlers
//   ------------------------- */
//   const sendMessageToSocket = useCallback((text: string) => {
//     if (!CURRENT_USER_ID || !sessionIdRef.current || !socket) return;
//     socket.emit("sendMessage", { sessionId: sessionIdRef.current, senderId: CURRENT_USER_ID, receiverId: chatUserId, text });
//   }, [CURRENT_USER_ID, chatUserId, socket]);

//   const handleDeleteForMe = useCallback(() => {
//     if (!selectedMessage || !CURRENT_USER_ID || !socket) return;
//     const roomKey = getRoomId(CURRENT_USER_ID, chatUserId);
//     socket.emit("deleteMessageForMe", { messageId: selectedMessage.id, userId: CURRENT_USER_ID, roomId: roomKey });
//     deleteMessageForMe(roomKey, selectedMessage.id);
//     setSelectedMessage(null);
//   }, [selectedMessage, CURRENT_USER_ID, chatUserId, deleteMessageForMe, setSelectedMessage, socket]);

//   const handleDeleteForEveryone = useCallback(() => {
//     if (!selectedMessage || !CURRENT_USER_ID || !socket) return;
//     const roomKey = getRoomId(CURRENT_USER_ID, chatUserId);
//     socket.emit("deleteMessageForEveryone", { messageId: selectedMessage.id, userId: CURRENT_USER_ID, roomId: roomKey });
//     deleteMessageForEveryone(roomKey, selectedMessage.id);
//     setSelectedMessage(null);
//   }, [selectedMessage, CURRENT_USER_ID, chatUserId, deleteMessageForEveryone, setSelectedMessage, socket]);

//   /* -------------------------
//      Rendering
//   ------------------------- */
//   const fontSize = width < 360 ? 13 : width < 400 ? 14 : width < 600 ? 15 : 16;
//   const bubblePadding = width < 360 ? 8 : width < 400 ? 10 : 12;
//   const padding = width < 360 ? 8 : width < 400 ? 10 : 14;
//   const modalWidth = width < 360 ? "85%" : width < 400 ? "80%" : "70%";

//   const chatMessages = messages[getRoomId(String(CURRENT_USER_ID), chatUserId)] ?? [];

//   return (
//     <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.background }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}>
//       <View style={[styles.container, { padding }]}>
//         <FlatList
//           ref={flatRef}
//           data={chatMessages.sort((a, b) => a.createdAt - b.createdAt)}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => <MessageBubble m={item} fontSize={fontSize} bubblePadding={bubblePadding} onLongPress={setSelectedMessage} />}
//           contentContainerStyle={{ paddingBottom: 20 }}
//           showsVerticalScrollIndicator={false}
//         />
//         <Composer onSend={sendMessageToSocket} inputFontSize={fontSize} padding={padding} />
//       </View>

//       <Modal visible={!!selectedMessage} transparent animationType="fade" onRequestClose={() => setSelectedMessage(null)}>
//         <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
//           <View style={[styles.modalBox, { backgroundColor: theme.background, width: modalWidth }]}>
//             <TouchableOpacity onPress={handleDeleteForMe} style={styles.modalBtn}>
//               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Me</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={handleDeleteForEveryone} style={styles.modalBtn}>
//               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Everyone</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => setSelectedMessage(null)} style={styles.modalBtn}>
//               <Text style={[styles.modalText, { color: theme.link, fontSize }]}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   bubble: { borderRadius: 12 },
//   composerContainer: { borderTopWidth: 1 },
//   composerRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
//   textInput: { flex: 1, borderWidth: 1, borderRadius: 20, maxHeight: 100, marginBottom: 20 },
//   sendBtn: { borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
//   modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   modalBox: { borderRadius: 12, padding: 20 },
//   modalBtn: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
//   modalText: { textAlign: 'center' },
// });
