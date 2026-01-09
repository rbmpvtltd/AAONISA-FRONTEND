// import { RouteProp, useRoute } from "@react-navigation/native";
// import { useQuery } from "@tanstack/react-query";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";

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
// function MessageBubble({ m, onLongPress, fontSize, bubblePadding }: { m: Message; onLongPress: (msg: Message) => void; fontSize: number; bubblePadding: number; }) {
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

// function Composer({ onSend, inputFontSize, padding }: { onSend: (msg: string) => void; inputFontSize: number; padding: number; }) {
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
//  const socket = useSocketManager(CURRENT_USER_ID, chatUserId);

//   const { messages, addMessage, selectedMessage, setSelectedMessage, deleteMessageForMe, deleteMessageForEveryone, getSessionId } = useChatStore();

//   const flatRef = useRef<FlatList<any>>(null);
//   const currentUserIdRef = useRef<string | undefined>(CURRENT_USER_ID);
//   const currentRoomIdRef = useRef<string | null>(null);
//   // const sessionIdRef = useRef<number | null>(null);
//   const joinedRef = useRef(false);
//   const sessionId = useChatStore((s) => s.sessionId);


//   useEffect(() => {
//   if (!socket) return;

//   // Remove any existing listeners before adding new ones
//   socket.off("Message");

//   const handleMessage = (data: any) => {
//     console.log("📨 Message received:", data);
//     // Handle incoming message
//   };

//   socket.on("Message", handleMessage);

//   // Cleanup on unmount
//   return () => {
//     socket.off("Message", handleMessage);
//   };
// }, [socket]);

//   useEffect(() => { currentUserIdRef.current = CURRENT_USER_ID; }, [CURRENT_USER_ID]);
//   // useEffect(()=>{ sessionIdRef.current = sessionId; }, [sessionId]);
//   /* -------------------------
//      Socket listeners (named + cleanup)
//   ------------------------- */
//   useEffect(() => {
//     if (!chatUserId) return;
//     if (!socket) return;
//     const roomKey = getRoomId(String(CURRENT_USER_ID), chatUserId);
//     const handleDeletedForMe = (data: { messageId: string }) => { deleteMessageForMe(String(data.messageId)); };
//     const handleDeletedForEveryone = (data: { messageId: string; deletedForEveryone?: boolean }) => { if (data.deletedForEveryone) deleteMessageForEveryone(String(data.messageId)); };

//     socket.on("messageDeletedForMe", handleDeletedForMe);
//     socket.on("messageDeleted", handleDeletedForEveryone);

//     return () => {
//       socket.off("messageDeletedForMe", handleDeletedForMe);
//       socket.off("messageDeleted", handleDeletedForEveryone);
//     };
//   }, [chatUserId, addMessage, deleteMessageForMe, deleteMessageForEveryone, CURRENT_USER_ID, socket]);

//   /* -------------------------
//      Send / Delete Handlers
//   ------------------------- */
//   const sendMessageToSocket = useCallback(
//   (text: string) => {
//     if(!CURRENT_USER_ID || !sessionId || !socket) return;
//     console.log("send message ==================>",CURRENT_USER_ID,sessionId )
//     socket.emit("sendMessage", {
//       sessionId,
//       senderId: CURRENT_USER_ID,
//       receiverId: chatUserId,
//       text,
//     });
//   },
//   [CURRENT_USER_ID, chatUserId, socket, sessionId]
// );


//   const handleDeleteForMe = useCallback(() => {
//     if (!selectedMessage || !CURRENT_USER_ID) return;
//     if(!socket) return

//     const roomKey = getRoomId(String(CURRENT_USER_ID), chatUserId);
//     socket.emit("deleteMessageForMe", { messageId: selectedMessage.id, userId: CURRENT_USER_ID, roomId: roomKey });
//     deleteMessageForMe(selectedMessage.id);
//     setSelectedMessage(null);
//   }, [selectedMessage, CURRENT_USER_ID, chatUserId, deleteMessageForMe, setSelectedMessage, socket]);

//   const handleDeleteForEveryone = useCallback(() => {
//     if (!selectedMessage || !CURRENT_USER_ID) return;
//     if(!socket) return

//     const roomKey = getRoomId(String(CURRENT_USER_ID), chatUserId);
//     socket.emit("deleteMessageForEveryone", { messageId: selectedMessage.id, userId: CURRENT_USER_ID, roomId: roomKey });
//     deleteMessageForEveryone(selectedMessage.id);
//     setSelectedMessage(null);
//   }, [selectedMessage, CURRENT_USER_ID, chatUserId, deleteMessageForEveryone, setSelectedMessage, socket]);

//   /* -------------------------
//      Rendering
//   ------------------------- */
//   const fontSize = width < 360 ? 13 : width < 400 ? 14 : width < 600 ? 15 : 16;
//   const bubblePadding = width < 360 ? 8 : width < 400 ? 10 : 12;
//   const padding = width < 360 ? 8 : width < 400 ? 10 : 14;
//   const modalWidth = width < 360 ? "85%" : width < 400 ? "80%" : "70%";

//   // const chatMessages = messages[getRoomId(String(CURRENT_USER_ID), chatUserId)] ?? [];
//   const chatMessages = useChatStore.getState().getMessages();
//   // const chatMessages = useChatStore((state) =>
//   // state.currentChatId ? state.messages[state.currentChatId] ?? [] : []
// // );

//   // console.log(chatMessages)
//   return (
//     <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.background }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}>
//       <View style={[styles.container, { padding }]}>
//         <FlatList
//   ref={flatRef}
//   data={chatMessages
//     .slice()
//     .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())} 
//   keyExtractor={(item) => item.id.toString()} 
//   renderItem={({ item }) => (
//     <MessageBubble
//       m={item}
//       fontSize={fontSize}
//       bubblePadding={bubblePadding}
//       onLongPress={(msg) => setSelectedMessage(msg)}
//     />
//   )}
//   contentContainerStyle={{ paddingBottom: 20 }}
//   showsVerticalScrollIndicator={false}
// />

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
//   container: {
//     flex: 1,
//   },
//   bubble: {
//     borderRadius: 12,
//   },
//   composerContainer: {
//     borderTopWidth: 1,
//   },
//   composerRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     gap: 8,
//   },
//   textInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderRadius: 20,
//     maxHeight: 100,
//     marginBottom: 20,
//   },
//   sendBtn: {
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalBox: {
//     borderRadius: 12,
//     padding: 20,
//   },
//   modalBtn: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   modalText: {
//     textAlign: 'center',
//   },
// });


// // import { RouteProp, useRoute } from "@react-navigation/native";
// // import { useQuery } from "@tanstack/react-query";
// // import { useCallback, useEffect, useRef, useState } from "react";
// // import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";

// // import { chatSessionId } from "@/src/api/chat-api";
// // import { GetCurrentUser } from "@/src/api/profile-api";
// // import { useAppTheme } from "@/src/constants/themeHelper";
// // import { useSocketManager } from "@/src/socket/socket";
// // import { useChatStore } from "@/src/store/useChatStore";
// // import { Message } from "@/src/types/chatType";

// // /* -------------------------
// //    Helpers
// // ------------------------- */
// // function getRoomId(userId1: string, userId2: string) {
// //   return [userId1, userId2].sort().join("-");
// // }

// // function normalizeIncomingMessage(raw: any) {
// //   const id = String(raw.message_id ?? raw.chat_id ?? raw.id ?? raw.messageId);
// //   const text = raw.message_text ?? raw.text ?? "";
// //   const senderId = raw.sender_id ?? raw.sender?.id ?? raw.senderId;
// //   const receiverId = raw.receiver_id ?? raw.receiverId ?? raw.receiverId;
// //   const createdAt = new Date(raw.created_at ?? raw.createdAt ?? Date.now()).getTime();
// //   return { id, text, senderId, receiverId, createdAt };
// // }

// // /* -------------------------
// //    UI Components
// // ------------------------- */
// // function MessageBubble({ m, onLongPress, fontSize, bubblePadding }: { m: Message; onLongPress: (msg: Message) => void; fontSize: number; bubblePadding: number }) {
// //   const theme = useAppTheme();
// //   const align = m.fromMe ? "flex-end" : "flex-start";
// //   const bg = m.fromMe ? theme.buttonBg : theme.inputBg;
// //   const textColor = m.fromMe ? theme.buttonText : theme.text;

// //   return (
// //     <Pressable onLongPress={() => onLongPress(m)} style={{ alignSelf: align, marginVertical: 6, maxWidth: "80%" }}>
// //       <View style={[styles.bubble, { backgroundColor: bg, padding: bubblePadding }]}>
// //         <Text style={{ color: textColor, fontSize }}>{m.text}</Text>
// //       </View>
// //       <Text style={{ fontSize: fontSize - 4, color: theme.subtitle, marginTop: 4, alignSelf: align }}>
// //         {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
// //       </Text>
// //     </Pressable>
// //   );
// // }

// // function Composer({ onSend, inputFontSize, padding }: { onSend: (msg: string) => void; inputFontSize: number; padding: number }) {
// //   const theme = useAppTheme();
// //   const [text, setText] = useState("");

// //   function sendText() {
// //     if (!text.trim()) return;
// //     onSend(text.trim());
// //     setText("");
// //   }

// //   return (
// //     <View style={[styles.composerContainer, { backgroundColor: theme.background, borderColor: theme.inputBorder, paddingHorizontal: padding, paddingVertical: padding / 1.5 }]}>
// //       <View style={styles.composerRow}>
// //         <TextInput
// //           placeholder="Message..."
// //           placeholderTextColor={theme.placeholder}
// //           value={text}
// //           onChangeText={setText}
// //           style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text, fontSize: inputFontSize, paddingHorizontal: padding / 1.2, paddingVertical: padding / 2 }]}
// //           multiline
// //         />
// //         <TouchableOpacity style={[styles.sendBtn, { backgroundColor: theme.buttonBg, paddingVertical: padding / 2, paddingHorizontal: padding }]} onPress={sendText}>
// //           <Text style={{ color: theme.buttonText, fontSize: inputFontSize }}>Send</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // }

// // /* -------------------------
// //    Main Screen
// // ------------------------- */
// // export default function ChatDetailScreen() {
// //   const theme = useAppTheme();
// //   const { width } = useWindowDimensions();
// //   const route = useRoute<RouteProp<{ params: { id: string; chatName?: string } }, "params">>();
// //   const { id: chatUserId } = route.params;

// //   const { data: currentUser } = useQuery({ queryKey: ["currentUser"], queryFn: GetCurrentUser });
// //   const CURRENT_USER_ID = currentUser?.id;

// //   // ✅ Use socket manager instead of raw socket
// //   const socket = useSocketManager(CURRENT_USER_ID, chatUserId);

// //   const { messages, addMessage, selectedMessage, setSelectedMessage, deleteMessageForMe, deleteMessageForEveryone } = useChatStore();

// //   const flatRef = useRef<FlatList<any>>(null);
// //   const sessionIdRef = useRef<number | null>(null);
// //   const joinedRef = useRef(false);

// //   /* -------------------------
// //      Create session + join room
// //   ------------------------- */
// //   useEffect(() => {
// //     if (!CURRENT_USER_ID || !chatUserId || !socket) return;

// //     const roomId = getRoomId(CURRENT_USER_ID, chatUserId);

// //     async function createSession() {
// //       try {
// //         const sessionData = await chatSessionId(CURRENT_USER_ID, chatUserId);
// //         sessionIdRef.current = sessionData.session_id;
// //       } catch (err) {
// //         console.error("❌ Error creating session:", err);
// //       }
// //     }

// //     createSession();

// //     const handleJoin = () => {
// //       if (joinedRef.current) return;
// //       joinedRef.current = true;
// //       socket.emit("joinRoom", { roomId });
// //       socket.emit("getPreviousMessages", { user1Id: CURRENT_USER_ID, user2Id: chatUserId });
// //     };

// //     if (socket.connected) handleJoin();
// //     else socket.on("connect", handleJoin);

// //     return () => {
// //       socket.off("connect", handleJoin);
// //       if (joinedRef.current) socket.emit("leaveRoom", { roomId });
// //       joinedRef.current = false;
// //     };
// //   }, [CURRENT_USER_ID, chatUserId, socket]);

// //   /* -------------------------
// //      Send / Delete Handlers
// //   ------------------------- */
// //   const sendMessageToSocket = useCallback((text: string) => {
// //     if (!CURRENT_USER_ID || !sessionIdRef.current || !socket) return;
// //     socket.emit("sendMessage", { sessionId: sessionIdRef.current, senderId: CURRENT_USER_ID, receiverId: chatUserId, text });
// //   }, [CURRENT_USER_ID, chatUserId, socket]);

// //   const handleDeleteForMe = useCallback(() => {
// //     if (!selectedMessage || !CURRENT_USER_ID || !socket) return;
// //     const roomKey = getRoomId(CURRENT_USER_ID, chatUserId);
// //     socket.emit("deleteMessageForMe", { messageId: selectedMessage.id, userId: CURRENT_USER_ID, roomId: roomKey });
// //     deleteMessageForMe(roomKey, selectedMessage.id);
// //     setSelectedMessage(null);
// //   }, [selectedMessage, CURRENT_USER_ID, chatUserId, deleteMessageForMe, setSelectedMessage, socket]);

// //   const handleDeleteForEveryone = useCallback(() => {
// //     if (!selectedMessage || !CURRENT_USER_ID || !socket) return;
// //     const roomKey = getRoomId(CURRENT_USER_ID, chatUserId);
// //     socket.emit("deleteMessageForEveryone", { messageId: selectedMessage.id, userId: CURRENT_USER_ID, roomId: roomKey });
// //     deleteMessageForEveryone(roomKey, selectedMessage.id);
// //     setSelectedMessage(null);
// //   }, [selectedMessage, CURRENT_USER_ID, chatUserId, deleteMessageForEveryone, setSelectedMessage, socket]);

// //   /* -------------------------
// //      Rendering
// //   ------------------------- */
// //   const fontSize = width < 360 ? 13 : width < 400 ? 14 : width < 600 ? 15 : 16;
// //   const bubblePadding = width < 360 ? 8 : width < 400 ? 10 : 12;
// //   const padding = width < 360 ? 8 : width < 400 ? 10 : 14;
// //   const modalWidth = width < 360 ? "85%" : width < 400 ? "80%" : "70%";

// //   const chatMessages = messages[getRoomId(String(CURRENT_USER_ID), chatUserId)] ?? [];

// //   return (
// //     <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.background }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}>
// //       <View style={[styles.container, { padding }]}>
// //         <FlatList
// //           ref={flatRef}
// //           data={chatMessages.sort((a, b) => a.createdAt - b.createdAt)}
// //           keyExtractor={(item) => item.id}
// //           renderItem={({ item }) => <MessageBubble m={item} fontSize={fontSize} bubblePadding={bubblePadding} onLongPress={setSelectedMessage} />}
// //           contentContainerStyle={{ paddingBottom: 20 }}
// //           showsVerticalScrollIndicator={false}
// //         />
// //         <Composer onSend={sendMessageToSocket} inputFontSize={fontSize} padding={padding} />
// //       </View>

// //       <Modal visible={!!selectedMessage} transparent animationType="fade" onRequestClose={() => setSelectedMessage(null)}>
// //         <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
// //           <View style={[styles.modalBox, { backgroundColor: theme.background, width: modalWidth }]}>
// //             <TouchableOpacity onPress={handleDeleteForMe} style={styles.modalBtn}>
// //               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Me</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity onPress={handleDeleteForEveryone} style={styles.modalBtn}>
// //               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Everyone</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity onPress={() => setSelectedMessage(null)} style={styles.modalBtn}>
// //               <Text style={[styles.modalText, { color: theme.link, fontSize }]}>Cancel</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   bubble: { borderRadius: 12 },
// //   composerContainer: { borderTopWidth: 1 },
// //   composerRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
// //   textInput: { flex: 1, borderWidth: 1, borderRadius: 20, maxHeight: 100, marginBottom: 20 },
// //   sendBtn: { borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
// //   modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// //   modalBox: { borderRadius: 12, padding: 20 },
// //   modalBtn: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
// //   modalText: { textAlign: 'center' },
// // });

// ========================================================================

// import { RouteProp, useRoute } from "@react-navigation/native";
// import { useQuery } from "@tanstack/react-query";
// import { useCallback, useEffect, useRef, useState } from "react";
// import {
//   FlatList,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   useWindowDimensions,
// } from "react-native";

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

// /* -------------------------
//    UI Components
// ------------------------- */
// function MessageBubble({
//   m,
//   onLongPress,
//   fontSize,
//   bubblePadding,
// }: {
//   m: Message;
//   onLongPress: (msg: Message) => void;
//   fontSize: number;
//   bubblePadding: number;
// }) {
//   const theme = useAppTheme();
//   const align = m.fromMe ? "flex-end" : "flex-start";
//   const bg = m.fromMe ? theme.buttonBg : theme.inputBg;
//   const textColor = m.fromMe ? theme.buttonText : theme.text;

//   return (
//     <Pressable
//       onLongPress={() => onLongPress(m)}
//       style={{ alignSelf: align, marginVertical: 6, maxWidth: "80%" }}
//     >
//       <View style={[styles.bubble, { backgroundColor: bg, padding: bubblePadding }]}>
//         <Text style={{ color: textColor, fontSize }}>{m.text}</Text>
//       </View>
//       <Text
//         style={{
//           fontSize: fontSize - 4,
//           color: theme.subtitle,
//           marginTop: 4,
//           alignSelf: align,
//         }}
//       >
//         {new Date(m.createdAt).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })}
//       </Text>
//     </Pressable>
//   );
// }

// function Composer({
//   onSend,
//   inputFontSize,
//   padding,
// }: {
//   onSend: (msg: string) => void;
//   inputFontSize: number;
//   padding: number;
// }) {
//   const theme = useAppTheme();
//   const [text, setText] = useState("");

//   function sendText() {
//     if (!text.trim()) return;
//     onSend(text.trim());
//     setText("");
//   }

//   return (
//     <View
//       style={[
//         styles.composerContainer,
//         {
//           backgroundColor: theme.background,
//           borderColor: theme.inputBorder,
//           paddingHorizontal: padding,
//           paddingVertical: padding / 1.5,
//         },
//       ]}
//     >
//       <View style={styles.composerRow}>
//         <TextInput
//           placeholder="Message..."
//           placeholderTextColor={theme.placeholder}
//           value={text}
//           onChangeText={setText}
//           style={[
//             styles.textInput,
//             {
//               backgroundColor: theme.inputBg,
//               borderColor: theme.inputBorder,
//               color: theme.text,
//               fontSize: inputFontSize,
//               paddingHorizontal: padding / 1.2,
//               paddingVertical: padding / 2,
//             },
//           ]}
//           multiline
//         />
//         <TouchableOpacity
//           style={[
//             styles.sendBtn,
//             {
//               backgroundColor: theme.buttonBg,
//               paddingVertical: padding / 2,
//               paddingHorizontal: padding,
//             },
//           ]}
//           onPress={sendText}
//         >
//           <Text style={{ color: theme.buttonText, fontSize: inputFontSize }}>
//             Send
//           </Text>
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
//   const route = useRoute<
//     RouteProp<{ params: { id: string; chatName?: string } }, "params">
//   >();
//   const { id: chatUserId } = route.params;

//   const { data: currentUser } = useQuery({
//     queryKey: ["currentUser"],
//     queryFn: GetCurrentUser,
//   });
//   const CURRENT_USER_ID = currentUser?.id;

//   // Socket manager
//   const socket = useSocketManager(CURRENT_USER_ID, chatUserId);

//   // Store
//   const {
//     addMessage,
//     selectedMessage,
//     setSelectedMessage,
//     deleteMessageForMe,
//     deleteMessageForEveryone,
//     getMessages,
//   } = useChatStore();

//   const flatRef = useRef<FlatList<any>>(null);
//   const sessionId = useChatStore((s) => s.sessionId);
//   const hasSetupListeners = useRef(false);

//   /* -------------------------
//      Socket Message Listener - ONLY ONE!
//   ------------------------- */
//   useEffect(() => {
//     if (!socket || !CURRENT_USER_ID || !chatUserId) return;

//     // Prevent duplicate listener registration
//     if (hasSetupListeners.current) return;
//     hasSetupListeners.current = true;

//     console.log("🎧 Setting up socket listeners...");

//     // ✅ Single Message listener
//     const handleIncomingMessage = (data: any) => {
//       console.log("📨 Message received:", data);

//       // Normalize the message
//       const normalizedMessage: Message = {
//         id: String(data.message_id),
//         text: data.text,
//         // senderId: data.senderId,
//         // receiverId: data.receiverId,
//         createdAt: new Date(data.createdAt).getTime(),
//         fromMe: data.senderId === CURRENT_USER_ID,
//       };

//       // Add to store
//       addMessage(normalizedMessage);

//       // Auto-scroll to bottom
//       setTimeout(() => {
//         flatRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     };

//     // ✅ Delete listeners
//     const handleDeletedForMe = (data: { messageId: string }) => {
//       console.log("🗑️ Message deleted for me:", data.messageId);
//       deleteMessageForMe(String(data.messageId));
//     };

//     const handleDeletedForEveryone = (data: {
//       messageId: string;
//       deletedForEveryone?: boolean;
//     }) => {
//       if (data.deletedForEveryone) {
//         console.log("🗑️ Message deleted for everyone:", data.messageId);
//         deleteMessageForEveryone(String(data.messageId));
//       }
//     };

//     // Remove old listeners first (safety measure)
//     socket.off("Message");
//     socket.off("messageDeletedForMe");
//     socket.off("messageDeleted");

//     // Register new listeners
//     socket.on("Message", handleIncomingMessage);
//     socket.on("messageDeletedForMe", handleDeletedForMe);
//     socket.on("messageDeleted", handleDeletedForEveryone);

//     // Cleanup on unmount
//     return () => {
//       console.log("🧹 Cleaning up socket listeners...");
//       socket.off("Message", handleIncomingMessage);
//       socket.off("messageDeletedForMe", handleDeletedForMe);
//       socket.off("messageDeleted", handleDeletedForEveryone);
//       hasSetupListeners.current = false;
//     };
//   }, [socket, CURRENT_USER_ID, chatUserId, addMessage, deleteMessageForMe, deleteMessageForEveryone]);

//   /* -------------------------
//      Send Message Handler
//   ------------------------- */
//   const sendMessageToSocket = useCallback(
//     (text: string) => {
//       if (!CURRENT_USER_ID || !sessionId || !socket) {
//         console.warn("⚠️ Cannot send message: missing requirements");
//         return;
//       }

//       console.log("📤 Sending message...", {
//         sessionId,
//         senderId: CURRENT_USER_ID,
//         receiverId: chatUserId,
//       });

//       socket.emit("sendMessage", {
//         sessionId,
//         senderId: CURRENT_USER_ID,
//         receiverId: chatUserId,
//         text,
//       });
//     },
//     [CURRENT_USER_ID, chatUserId, socket, sessionId]
//   );

//   /* -------------------------
//      Delete Handlers
//   ------------------------- */
//   const handleDeleteForMe = useCallback(() => {
//     if (!selectedMessage || !CURRENT_USER_ID || !socket) return;

//     const roomKey = getRoomId(String(CURRENT_USER_ID), chatUserId);
//     socket.emit("deleteMessageForMe", {
//       messageId: selectedMessage.id,
//       userId: CURRENT_USER_ID,
//       roomId: roomKey,
//     });

//     deleteMessageForMe(selectedMessage.id);
//     setSelectedMessage(null);
//   }, [
//     selectedMessage,
//     CURRENT_USER_ID,
//     chatUserId,
//     deleteMessageForMe,
//     setSelectedMessage,
//     socket,
//   ]);

//   const handleDeleteForEveryone = useCallback(() => {
//     if (!selectedMessage || !CURRENT_USER_ID || !socket) return;

//     const roomKey = getRoomId(String(CURRENT_USER_ID), chatUserId);
//     socket.emit("deleteMessageForEveryone", {
//       messageId: selectedMessage.id,
//       userId: CURRENT_USER_ID,
//       roomId: roomKey,
//     });

//     deleteMessageForEveryone(selectedMessage.id);
//     setSelectedMessage(null);
//   }, [
//     selectedMessage,
//     CURRENT_USER_ID,
//     chatUserId,
//     deleteMessageForEveryone,
//     setSelectedMessage,
//     socket,
//   ]);

//   /* -------------------------
//      Rendering
//   ------------------------- */
//   const fontSize = width < 360 ? 13 : width < 400 ? 14 : width < 600 ? 15 : 16;
//   const bubblePadding = width < 360 ? 8 : width < 400 ? 10 : 12;
//   const padding = width < 360 ? 8 : width < 400 ? 10 : 14;
//   const modalWidth = width < 360 ? "85%" : width < 400 ? "80%" : "70%";

//   const chatMessages = getMessages();

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: theme.background }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
//     >
//       <View style={[styles.container, { padding }]}>
//         <FlatList
//           ref={flatRef}
//           data={chatMessages
//             .slice()
//             .sort(
//               (a, b) =>
//                 new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//             )}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <MessageBubble
//               m={item}
//               fontSize={fontSize}
//               bubblePadding={bubblePadding}
//               onLongPress={(msg) => setSelectedMessage(msg)}
//             />
//           )}
//           contentContainerStyle={{ paddingBottom: 20 }}
//           showsVerticalScrollIndicator={false}
//           onContentSizeChange={() => {
//             flatRef.current?.scrollToEnd({ animated: false });
//           }}
//         />

//         <Composer
//           onSend={sendMessageToSocket}
//           inputFontSize={fontSize}
//           padding={padding}
//         />
//       </View>

//       <Modal
//         visible={!!selectedMessage}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setSelectedMessage(null)}
//       >
//         <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
//           <View
//             style={[
//               styles.modalBox,
//               { backgroundColor: theme.background, width: modalWidth },
//             ]}
//           >
//             <TouchableOpacity onPress={handleDeleteForMe} style={styles.modalBtn}>
//               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>
//                 Delete for Me
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={handleDeleteForEveryone}
//               style={styles.modalBtn}
//             >
//               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>
//                 Delete for Everyone
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => setSelectedMessage(null)}
//               style={styles.modalBtn}
//             >
//               <Text style={[styles.modalText, { color: theme.link, fontSize }]}>
//                 Cancel
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   bubble: {
//     borderRadius: 12,
//   },
//   composerContainer: {
//     borderTopWidth: 1,
//   },
//   composerRow: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     gap: 8,
//   },
//   textInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderRadius: 20,
//     maxHeight: 100,
//     marginBottom: 20,
//   },
//   sendBtn: {
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalBox: {
//     borderRadius: 12,
//     padding: 20,
//   },
//   modalBtn: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   modalText: {
//     textAlign: "center",
//   },
// });

//=======================================================================

import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";

import { GetCurrentUser } from "@/src/api/profile-api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useSocketManager } from "@/src/socket/socket";
import { useChatStore } from "@/src/store/useChatStore";
import { Message } from "@/src/types/chatType";
import { timeAgo } from "@/src/utils/timeAgo";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";


/* -------------------------
   Helpers
------------------------- */
function getRoomId(userId1: string, userId2: string) {
  return [userId1, userId2].sort().join("-");
}

/* -------------------------
   UI Components
------------------------- */
function MessageBubble({
  m,
  onLongPress,
  fontSize,
  bubblePadding,
}: {
  m: Message;
  onLongPress: (msg: Message) => void;
  fontSize: number;
  bubblePadding: number;
}) {
  const theme = useAppTheme();
  const align = m.fromMe ? "flex-end" : "flex-start";
  const bg = m.fromMe ? theme.buttonBg : theme.inputBg;
  const textColor = m.fromMe ? theme.buttonText : theme.text;

  let isReelMessage = false;
  let reelData: any = null;

  try {
    const parsed = JSON.parse(m.text);
    if (parsed?.type === "reel") {
      isReelMessage = true;
      reelData = parsed;
    }
  } catch { }
  const handleReelPress = () => {
    if (!reelData) return;

    router.push({
      pathname: "/(drawer)/(tabs)/reels",
      params: {
        videoId: reelData.reelId,
        // videoUrl: reelData.url,
      },
    });
  };

  return (
    <Pressable
      onLongPress={() => onLongPress(m)}
      style={{ alignSelf: align, marginVertical: 6, maxWidth: "80%" }}
    >
      <View
        style={[
          styles.bubble,
          { backgroundColor: bg, padding: isReelMessage ? 4 : bubblePadding },
        ]}
      >
        {isReelMessage ? (
          <Pressable onPress={handleReelPress}>
            <View style={styles.reelContainer}>
              <Image
                source={{ uri: reelData.thumbnail }}
                style={styles.reelThumbnail}
                resizeMode="cover"
              />
              <View style={styles.reelOverlay}>
                <View style={styles.reelOverlay}>
                  <MaterialIcons
                    name="play-circle-fill"
                    size={56}
                    color="#fff"
                  />
                  <Text style={[styles.reelText, { color: textColor }]}>
                    Reel
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ) : (
          <Text style={{ color: textColor, fontSize }}>
            {m.text}
          </Text>
        )}
      </View>

      <Text
        style={{
          fontSize: fontSize - 4,
          color: theme.subtitle,
          marginTop: 4,
          alignSelf: align,
        }}
      >
        {timeAgo(new Date(m.createdAt).toISOString())}
        {/* {new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} */}
      </Text>
    </Pressable>
  );
}


function Composer({
  onSend,
  inputFontSize,
  padding,
}: {
  onSend: (msg: string) => void;
  inputFontSize: number;
  padding: number;
}) {
  const theme = useAppTheme();
  const [text, setText] = useState("");

  function sendText() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <View
      style={[
        styles.composerContainer,
        {
          backgroundColor: theme.background,
          borderColor: theme.inputBorder,
          paddingHorizontal: padding,
          paddingVertical: padding / 1.5,
        },
      ]}
    >
      <View style={styles.composerRow}>
        <TextInput
          placeholder="Message..."
          placeholderTextColor={theme.placeholder}
          value={text}
          onChangeText={setText}
          style={[
            styles.textInput,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.inputBorder,
              color: theme.text,
              fontSize: inputFontSize,
              paddingHorizontal: padding / 1.2,
              paddingVertical: padding / 2,
            },
          ]}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            {
              backgroundColor: theme.buttonBg,
              paddingVertical: padding / 2,
              paddingHorizontal: padding,
            },
          ]}
          onPress={sendText}
        >
          <Text style={{ color: theme.buttonText, fontSize: inputFontSize }}>
            Send
          </Text>
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
  const route = useRoute<
    RouteProp<{ params: { id: string; chatName?: string, username?: string, avatar?: string } }, "params">
  >();
  const { id: chatUserId, username, avatar } = route.params;

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });
  const CURRENT_USER_ID = currentUser?.id;

  // Socket manager
  const socket = useSocketManager(CURRENT_USER_ID, chatUserId);

  // Store
  const {
    addMessage,
    selectedMessage,
    setSelectedMessage,
    deleteMessageForMe,
    deleteMessageForEveryone,
    getMessages,
  } = useChatStore();

  const flatRef = useRef<FlatList<any>>(null);
  const sessionId = useChatStore((s) => s.sessionId);
  const hasSetupListeners = useRef(false);

  /* -------------------------
     Socket Message Listener - ONLY ONE!
  ------------------------- */
  useEffect(() => {
    if (!socket || !CURRENT_USER_ID || !chatUserId) return;

    // Prevent duplicate listener registration
    if (hasSetupListeners.current) return;
    hasSetupListeners.current = true;

    console.log("🎧 Setting up socket listeners...");

    // ✅ Single Message listener
    const handleIncomingMessage = (data: any) => {
      console.log("📨 Message received:", data);

      // Check if this is a reel message
      const isReelMessage = data.type === 'reel' || data.reelid;

      // Normalize the message
      const normalizedMessage: Message = {
        id: String(data.message_id),
        text: isReelMessage ? '' : data.text,
        createdAt: new Date(data.createdAt).getTime(),
        fromMe: data.senderId === CURRENT_USER_ID,
        type: isReelMessage ? 'reel' : 'text',
        ...(isReelMessage && {
          reelData: {
            videoId: data.reelid,
            url: data.url || data.reelUrl,
            thumbnail: data.thumbnail || data.thumbnailUrl,
          }
        })
      };

      // console.log("Normalized Message:", normalizedMessage);

      // Add to store
      addMessage(normalizedMessage);

      // Auto-scroll to bottom
      setTimeout(() => {
        flatRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    // ✅ Delete listeners
    const handleDeletedForMe = (data: { messageId: string }) => {
      console.log("🗑️ Message deleted for me:", data.messageId);
      deleteMessageForMe(String(data.messageId));
    };

    const handleDeletedForEveryone = (data: {
      messageId: string;
      deletedForEveryone?: boolean;
    }) => {
      if (data.deletedForEveryone) {
        console.log("🗑️ Message deleted for everyone:", data.messageId);
        deleteMessageForEveryone(String(data.messageId));
      }
    };

    // Remove old listeners first (safety measure)
    socket.off("Message");
    socket.off("messageDeletedForMe");
    socket.off("messageDeleted");

    // Register new listeners
    socket.on("Message", handleIncomingMessage);
    socket.on("messageDeletedForMe", handleDeletedForMe);
    socket.on("messageDeleted", handleDeletedForEveryone);

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up socket listeners...");
      socket.off("Message", handleIncomingMessage);
      socket.off("messageDeletedForMe", handleDeletedForMe);
      socket.off("messageDeleted", handleDeletedForEveryone);
      hasSetupListeners.current = false;
    };
  }, [socket, CURRENT_USER_ID, chatUserId, addMessage, deleteMessageForMe, deleteMessageForEveryone]);

  /* -------------------------
     Send Message Handler
  ------------------------- */
  const sendMessageToSocket = useCallback(
    (text: string) => {
      if (!CURRENT_USER_ID || !sessionId || !socket) {
        console.warn("⚠️ Cannot send message: missing requirements");
        return;
      }

      console.log("📤 Sending message...", {
        sessionId,
        senderId: CURRENT_USER_ID,
        receiverId: chatUserId,
      });

      socket.emit("sendMessage", {
        sessionId,
        senderId: CURRENT_USER_ID,
        receiverId: chatUserId,
        text,
      });
    },
    [CURRENT_USER_ID, chatUserId, socket, sessionId]
  );

  /* -------------------------
     Delete Handlers
  ------------------------- */
  const handleDeleteForMe = useCallback(() => {
    if (!selectedMessage || !CURRENT_USER_ID || !socket) return;

    const roomKey = getRoomId(String(CURRENT_USER_ID), chatUserId);
    socket.emit("deleteMessageForMe", {
      messageId: selectedMessage.id,
      userId: CURRENT_USER_ID,
      roomId: roomKey,
    });

    deleteMessageForMe(selectedMessage.id);
    setSelectedMessage(null);
  }, [
    selectedMessage,
    CURRENT_USER_ID,
    chatUserId,
    deleteMessageForMe,
    setSelectedMessage,
    socket,
  ]);

  const handleDeleteForEveryone = useCallback(() => {
    if (!selectedMessage || !CURRENT_USER_ID || !socket) return;

    const roomKey = getRoomId(String(CURRENT_USER_ID), chatUserId);
    socket.emit("deleteMessageForEveryone", {
      messageId: selectedMessage.id,
      userId: CURRENT_USER_ID,
      roomId: roomKey,
    });

    deleteMessageForEveryone(selectedMessage.id);
    setSelectedMessage(null);
  }, [
    selectedMessage,
    CURRENT_USER_ID,
    chatUserId,
    deleteMessageForEveryone,
    setSelectedMessage,
    socket,
  ]);

  /* -------------------------
     Rendering
  ------------------------- */
  const fontSize = width < 360 ? 13 : width < 400 ? 14 : width < 600 ? 15 : 16;
  const bubblePadding = width < 360 ? 8 : width < 400 ? 10 : 12;
  const padding = width < 360 ? 8 : width < 400 ? 10 : 14;
  const modalWidth = width < 360 ? "85%" : width < 400 ? "80%" : "70%";

  const chatMessages = getMessages();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {avatar && (
                <Image
                  source={{ uri: avatar }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#ccc',
                  }}
                />
              )}
              <TouchableOpacity onPress={() => router.push(`/profile/${username}`)} >
                <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}>
                  {username || 'Chat'}
                </Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      {/* <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.background }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
      > */}
      <>
        <View style={[styles.container, { padding }]}>
          <FlatList
            ref={flatRef}
            data={ //chatMessages
              // .slice()
              // .sort(
              //   (a, b) =>
              //     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              // ) || 
              chatMessages.sort((a, b) => b.createdAt - a.createdAt)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MessageBubble
                m={item}
                fontSize={fontSize}
                bubblePadding={bubblePadding}
                onLongPress={(msg) => setSelectedMessage(msg)}
              />
            )}
            // inverted
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              flatRef.current?.scrollToEnd({ animated: false });
            }}
          />

          <Composer
            onSend={sendMessageToSocket}
            inputFontSize={fontSize}
            padding={padding}
          />
        </View>

        <Modal
          visible={!!selectedMessage}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedMessage(null)}
        >
          <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
            <View
              style={[
                styles.modalBox,
                { backgroundColor: theme.background, width: modalWidth },
              ]}
            >
              <TouchableOpacity onPress={handleDeleteForMe} style={styles.modalBtn}>
                <Text style={[styles.modalText, { color: theme.text, fontSize }]}>
                  Delete for Me
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteForEveryone}
                style={styles.modalBtn}
              >
                <Text style={[styles.modalText, { color: theme.text, fontSize }]}>
                  Delete for Everyone
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedMessage(null)}
                style={styles.modalBtn}
              >
                <Text style={[styles.modalText, { color: theme.link, fontSize }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>

      {/* </KeyboardAvoidingView> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bubble: {
    borderRadius: 12,
  },
  reelContainer: {
    // width: 200,
    // height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  reelThumbnail: {
    // width: '100%',
    // height: '100%',

    width: 220,
    height: 300,

  },
  reelOverlay: {
    position: 'absolute',
    // bottom: 10,
    // left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    gap: 6,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)"
  },
  reelIcon: {
    fontSize: 20,
  },
  reelText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  composerContainer: {
    borderTopWidth: 1,
  },
  composerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    borderRadius: 12,
    padding: 20,
  },
  modalBtn: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalText: {
    textAlign: "center",
  },
});