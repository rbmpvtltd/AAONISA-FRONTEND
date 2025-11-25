// // // import { useAppTheme } from '@/src/constants/themeHelper';
// // // import { useChatStore } from '@/src/store/useChatStore';
// // // import { Message } from '@/src/types/chatType';
// // // import { RouteProp, useRoute } from '@react-navigation/native';
// // // import React, { useEffect, useRef } from 'react';
// // // import io from "socket.io-client";

// // // import { GetCurrentUser } from '@/src/api/profile-api';
// // // import { useQuery } from '@tanstack/react-query';
// // // import {
// // //   FlatList,
// // //   KeyboardAvoidingView,
// // //   Modal,
// // //   Platform,
// // //   Pressable,
// // //   StyleSheet,
// // //   Text,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   View,
// // //   useWindowDimensions,
// // // } from 'react-native';

// // // const socket = io("http://192.168.1.52:3000/socket.io", {
// // //   transports: ["websocket"],
// // //   autoConnect: true,
// // //   // query: { userId: CURRENT_USER_ID },
// // // });

// // // function MessageBubble({
// // //   m,
// // //   onLongPress,
// // //   fontSize,
// // //   bubblePadding,
// // // }: {
// // //   m: Message;
// // //   onLongPress: (msg: Message) => void;
// // //   fontSize: number;
// // //   bubblePadding: number;
// // // }) {
// // //   const theme = useAppTheme();
// // //   const align = m.fromMe ? 'flex-end' : 'flex-start';
// // //   const bg = m.fromMe ? theme.buttonBg : theme.inputBg;
// // //   const textColor = m.fromMe ? theme.buttonText : theme.text;

// // //   return (
// // //     <Pressable
// // //       onLongPress={() => onLongPress(m)}
// // //       style={{
// // //         alignSelf: align,
// // //         marginVertical: 6,
// // //         maxWidth: '80%',
// // //       }}
// // //     >
// // //       <View
// // //         style={[
// // //           styles.bubble,
// // //           { backgroundColor: bg, padding: bubblePadding },
// // //         ]}
// // //       >
// // //         <Text style={{ color: textColor, fontSize }}>{m.text}</Text>
// // //       </View>
// // //       <Text
// // //         style={{
// // //           fontSize: fontSize - 4,
// // //           color: theme.subtitle,
// // //           marginTop: 4,
// // //           alignSelf: align,
// // //         }}
// // //       >
// // //         {new Date(m.createdAt).toLocaleTimeString([], {
// // //           hour: '2-digit',
// // //           minute: '2-digit',
// // //         })}
// // //       </Text>
// // //     </Pressable>
// // //   );
// // // }

// // // function Composer({
// // //   onSend,
// // //   inputFontSize,
// // //   padding,
// // // }: {
// // //   onSend: (msg: string) => void;
// // //   inputFontSize: number;
// // //   padding: number;
// // // }) {
// // //   const theme = useAppTheme();
// // //   const [text, setText] = React.useState('');

// // //   function sendText() {
// // //     if (!text.trim()) return;
// // //     onSend(text.trim());
// // //     setText('');
// // //   }



// // //   return (
// // //     <View
// // //       style={[
// // //         styles.composerContainer,
// // //         {
// // //           backgroundColor: theme.background,
// // //           borderColor: theme.inputBorder,
// // //           paddingHorizontal: padding,
// // //           paddingVertical: padding / 1.5,
// // //         },
// // //       ]}
// // //     >
// // //       <View style={styles.composerRow}>
// // //         <TextInput
// // //           placeholder="Message..."
// // //           placeholderTextColor={theme.placeholder}
// // //           value={text}
// // //           onChangeText={setText}
// // //           style={[
// // //             styles.textInput,
// // //             {
// // //               backgroundColor: theme.inputBg,
// // //               borderColor: theme.inputBorder,
// // //               color: theme.text,
// // //               fontSize: inputFontSize,
// // //               paddingHorizontal: padding / 1.2,
// // //               paddingVertical: padding / 2,
// // //             },
// // //           ]}
// // //           multiline
// // //         />
// // //         <TouchableOpacity
// // //           style={[
// // //             styles.sendBtn,
// // //             { backgroundColor: theme.buttonBg, paddingVertical: padding / 2, paddingHorizontal: padding },
// // //           ]}
// // //           onPress={sendText}
// // //         >
// // //           <Text style={{ color: theme.buttonText, fontSize: inputFontSize }}>Send</Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // export default function ChatDetailScreen() {
// // //   const theme = useAppTheme();
// // //   const { width, height } = useWindowDimensions();
// // //   const route = useRoute<RouteProp<{ params: { id: string; chatName?: string } }, 'params'>>();
// // //   const { id, chatName } = route.params;


// // //   const { data: currentUser } = useQuery({
// // //     queryKey: ["currentUser"],
// // //     queryFn: GetCurrentUser,

// // //   });

// // //   const CURRENT_USER_ID = currentUser?.id?.toString();
// // //   const chatUserId = id;

// // //   console.log("aaaaaaaaaaaa", CURRENT_USER_ID);
// // //   console.log("aaaaaaaaaaaa", currentUser);



// // //   const {
// // //     messages,
// // //     addMessage,
// // //     selectedMessage,
// // //     setSelectedMessage,
// // //     deleteMessageForMe,
// // //     deleteMessageForEveryone,
// // //   } = useChatStore();
// // //   const flatRef = useRef<FlatList<any>>(null);

// // // useEffect(() => {
// // //   if (!CURRENT_USER_ID || !chatUserId) return;

// // //   const roomId = [CURRENT_USER_ID, chatUserId].sort().join("-");

// // //   socket.emit("joinRoom", { roomId });
// // //   console.log("🟢 Joined Room:", roomId);

// // // }, [CURRENT_USER_ID, chatUserId]);


// // // useEffect(() => {
// // //   if (!CURRENT_USER_ID) return;

// // //   socket.io.opts.query = { userId: CURRENT_USER_ID };
// // //   socket.connect();

// // //   console.log("🔌 Socket Connected with", CURRENT_USER_ID);

// // //   return () => socket.disconnect();
// // // }, [CURRENT_USER_ID]);



// // // useEffect(() => {
// // //   if (!CURRENT_USER_ID || !chatUserId) return;

// // //   const roomId = [CURRENT_USER_ID, chatUserId].sort().join("-");

// // //   console.log("🟢 Joining Room:", roomId);
// // //   socket.emit("joinRoom", { roomId });

// // // }, [CURRENT_USER_ID, chatUserId]);


// // // useEffect(() => {
// // //   socket.on("Message", (msg) => {
// // //     console.log("📥 Received:", msg);

// // //     const chatKey =
// // //       msg.senderId === CURRENT_USER_ID
// // //         ? msg.receiverId
// // //         : msg.senderId;

// // //     addMessage(chatKey, {
// // //       id: msg.id ?? String(Date.now()),
// // //       text: msg.text,
// // //       fromMe: msg.senderId === CURRENT_USER_ID,
// // //       createdAt: msg.createdAt,
// // //     });

// // //     setTimeout(() => {
// // //       flatRef.current?.scrollToEnd({ animated: true });
// // //     }, 40);
// // //   });

// // //   return () => socket.off("Message");
// // // }, [CURRENT_USER_ID]);



// // //   const chatMessages = messages[id] ?? [];

// // //   function sendMessageToSocket(text: string) {
// // //   const payload = {
// // //     senderId: CURRENT_USER_ID,
// // //     receiverId: chatUserId,
// // //     text,
// // //     createdAt: Date.now(),
// // //   };

// // //   // UI update
// // //   addMessage(chatUserId, {
// // //     id: String(Date.now()),
// // //     text,
// // //     fromMe: true,
// // //     createdAt: Date.now(),
// // //   });

// // //   // Send to server room
// // //   socket.emit("sendMessage", payload);

// // //   flatRef.current?.scrollToEnd({ animated: true });
// // // }

// // //   // 🔹 Responsive metrics
// // //   const fontSize = width < 360 ? 13 : width < 400 ? 14 : width < 600 ? 15 : 16;
// // //   const bubblePadding = width < 360 ? 8 : width < 400 ? 10 : 12;
// // //   const padding = width < 360 ? 8 : width < 400 ? 10 : 14;
// // //   const modalWidth = width < 360 ? '85%' : width < 400 ? '80%' : '70%';

// // //   return (
// // //     <KeyboardAvoidingView
// // //       style={{ flex: 1, backgroundColor: theme.background }}
// // //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // //       keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
// // //     >
// // //       {/* <Stack.Screen name={`${chatId}`} options={{ title: `${chatName}` }} />  */}
// // //       <View style={[styles.container, { padding }]}>
// // //         <FlatList
// // //           ref={flatRef}
// // //           data={chatMessages}
// // //           keyExtractor={(i) => i.id}
// // //           renderItem={({ item }) => (
// // //             <MessageBubble
// // //               m={item}
// // //               fontSize={fontSize}
// // //               bubblePadding={bubblePadding}
// // //               onLongPress={(msg) => setSelectedMessage(msg)}
// // //             />
// // //           )}
// // //           contentContainerStyle={{ paddingBottom: 20 }}
// // //           showsVerticalScrollIndicator={false}
// // //         />
// // //         <Composer onSend={sendMessageToSocket} inputFontSize={fontSize} padding={padding} />
// // //       </View>

// // //       <Modal
// // //         visible={!!selectedMessage}
// // //         transparent
// // //         animationType="fade"
// // //         onRequestClose={() => setSelectedMessage(null)}
// // //       >
// // //         <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
// // //           <View style={[styles.modalBox, { backgroundColor: theme.background, width: modalWidth }]}>
// // //             <TouchableOpacity
// // //               onPress={() => deleteMessageForMe(id, selectedMessage!.id)}
// // //               style={styles.modalBtn}
// // //             >
// // //               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Me</Text>
// // //             </TouchableOpacity>
// // //             <TouchableOpacity
// // //               onPress={() => deleteMessageForEveryone(id, selectedMessage!.id)}
// // //               style={styles.modalBtn}
// // //             >
// // //               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>
// // //                 Delete for Everyone
// // //               </Text>
// // //             </TouchableOpacity>
// // //             <TouchableOpacity onPress={() => setSelectedMessage(null)} style={styles.modalBtn}>
// // //               <Text style={[styles.modalText, { color: theme.link, fontSize }]}>Close</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         </View>
// // //       </Modal>
// // //     </KeyboardAvoidingView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1 },
// // //   bubble: {
// // //     borderRadius: 10,
// // //     shadowColor: '#000',
// // //     shadowOpacity: 0.05,
// // //     elevation: 1,
// // //   },
// // //   composerContainer: {
// // //     borderTopWidth: 1,
// // //   },
// // //   composerRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-end',
// // //   },
// // //   textInput: {
// // //     flex: 1,
// // //     minHeight: 40,
// // //     maxHeight: 120,
// // //     borderRadius: 8,
// // //     borderWidth: 1,
// // //   },
// // //   sendBtn: {
// // //     marginLeft: 8,
// // //     borderRadius: 8,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// // //   modalBox: { borderRadius: 12, paddingVertical: 15, paddingHorizontal: 10 },
// // //   modalBtn: { paddingVertical: 12, alignItems: 'center' },
// // //   modalText: { fontWeight: '500' },
// // // });



// // // ChatDetailScreen.tsx
// // import { useAppTheme } from '@/src/constants/themeHelper';
// // import { useChatStore } from '@/src/store/useChatStore';
// // import { Message } from '@/src/types/chatType';
// // import { RouteProp, useRoute } from '@react-navigation/native';
// // import React, { useEffect, useRef } from 'react';
// // import io from 'socket.io-client';

// // import { GetCurrentUser } from '@/src/api/profile-api';
// // import { useQuery } from '@tanstack/react-query';
// // import {
// //   FlatList,
// //   KeyboardAvoidingView,
// //   Modal,
// //   Platform,
// //   Pressable,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   View,
// //   useWindowDimensions
// // } from 'react-native';

// // // ---------------------------
// // // socket config (autoConnect: false)
// // // ---------------------------

// // export const socket = io("http://192.168.1.52:3000/socket.io", {
// //   transports: ["websocket"],
// //   autoConnect: false,
// // });


// // // ---------------------------
// // // MessageBubble component (same UI)
// // // ---------------------------
// // function MessageBubble({
// //   m,
// //   onLongPress,
// //   fontSize,
// //   bubblePadding,
// // }: {
// //   m: Message;
// //   onLongPress: (msg: Message) => void;
// //   fontSize: number;
// //   bubblePadding: number;
// // }) {
// //   const theme = useAppTheme();
// //   const align = m.fromMe ? 'flex-end' : 'flex-start';
// //   const bg = m.fromMe ? theme.buttonBg : theme.inputBg;
// //   const textColor = m.fromMe ? theme.buttonText : theme.text;

// //   return (
// //     <Pressable
// //       onLongPress={() => onLongPress(m)}
// //       style={{
// //         alignSelf: align,
// //         marginVertical: 6,
// //         maxWidth: '80%',
// //       }}
// //     >
// //       <View style={[styles.bubble, { backgroundColor: bg, padding: bubblePadding }]}>
// //         <Text style={{ color: textColor, fontSize }}>{m.text}</Text>
// //       </View>

// //       <Text
// //         style={{
// //           fontSize: fontSize - 4,
// //           color: theme.subtitle,
// //           marginTop: 4,
// //           alignSelf: align,
// //         }}
// //       >
// //         {new Date(m.createdAt).toLocaleTimeString([], {
// //           hour: '2-digit',
// //           minute: '2-digit',
// //         })}
// //       </Text>
// //     </Pressable>
// //   );
// // }

// // // ---------------------------
// // // Composer component (same UI)
// // // ---------------------------
// // function Composer({
// //   onSend,
// //   inputFontSize,
// //   padding,
// // }: {
// //   onSend: (msg: string) => void;
// //   inputFontSize: number;
// //   padding: number;
// // }) {
// //   const theme = useAppTheme();
// //   const [text, setText] = React.useState('');

// //   function sendText() {
// //     if (!text.trim()) return;
// //     onSend(text.trim());
// //     setText('');
// //   }

// //   return (
// //     <View
// //       style={[
// //         styles.composerContainer,
// //         {
// //           backgroundColor: theme.background,
// //           borderColor: theme.inputBorder,
// //           paddingHorizontal: padding,
// //           paddingVertical: padding / 1.5,
// //         },
// //       ]}
// //     >
// //       <View style={styles.composerRow}>
// //         <TextInput
// //           placeholder="Message..."
// //           placeholderTextColor={theme.placeholder}
// //           value={text}
// //           onChangeText={setText}
// //           style={[
// //             styles.textInput,
// //             {
// //               backgroundColor: theme.inputBg,
// //               borderColor: theme.inputBorder,
// //               color: theme.text,
// //               fontSize: inputFontSize,
// //               paddingHorizontal: padding / 1.2,
// //               paddingVertical: padding / 2,
// //             },
// //           ]}
// //           multiline
// //         />
// //         <TouchableOpacity
// //           style={[
// //             styles.sendBtn,
// //             { backgroundColor: theme.buttonBg, paddingVertical: padding / 2, paddingHorizontal: padding },
// //           ]}
// //           onPress={sendText}
// //         >
// //           <Text style={{ color: theme.buttonText, fontSize: inputFontSize }}>Send</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // }

// // // ---------------------------
// // // ChatDetailScreen (fixed)
// // // ---------------------------
// // export default function ChatDetailScreen() {
// //   const theme = useAppTheme();
// //   const { width } = useWindowDimensions();
// //   const route = useRoute<RouteProp<{ params: { id: string; chatName?: string } }, 'params'>>();
// //   const { id: chatUserId, chatName } = route.params;

// //   // current user (from query)
// //   const { data: currentUser } = useQuery({
// //     queryKey: ['currentUser'],
// //     queryFn: GetCurrentUser,
// //   });

// //   const CURRENT_USER_ID = currentUser?.id;

// //   const {
// //     messages,
// //     addMessage,
// //     selectedMessage,
// //     setSelectedMessage,
// //     deleteMessageForMe,
// //     deleteMessageForEveryone,
// //   } = useChatStore();

// //   const flatRef = useRef<FlatList<any>>(null);


// //   const currentUserIdRef = useRef<string | undefined>(CURRENT_USER_ID);
// //   useEffect(() => {
// //     currentUserIdRef.current = CURRENT_USER_ID;
// //   }, [CURRENT_USER_ID]);

// //   // keep track if we've joined the room already (avoid duplicate join)
// //   const joinedRoomRef = useRef<Record<string, boolean>>({});

// //   useEffect(() => {
// //     if (!CURRENT_USER_ID) return;

// //     socket.io.opts.query = { userId: CURRENT_USER_ID };

// //     if (!socket.connected) socket.connect();
// //   }, [CURRENT_USER_ID]);


// //   // ---------------------------
// //   // join room whenever both ids available (ensure socket.connected)
// //   // ---------------------------
// //   useEffect(() => {
// //     if (!CURRENT_USER_ID || !chatUserId) return;

// //     const roomId = [CURRENT_USER_ID, chatUserId].sort().join('-');

// //     console.log("rrrrrrooooooooooooooooooommmmmmmmmm", roomId);

// //     // If already joined, skip
// //     if (joinedRoomRef.current[roomId]) return;

// //     // If socket already connected -> join now
// //     if (socket.connected) {
// //       socket.emit('joinRoom', { roomId });
// //       joinedRoomRef.current[roomId] = true;
// //       console.log('🟢 Joined Room:', roomId);
// //       return;
// //     }

// //     // otherwise wait for connect event and join once
// //     const handleConnectThenJoin = () => {
// //       socket.emit('joinRoom', { roomId });
// //       joinedRoomRef.current[roomId] = true;
// //       console.log('🟢 Joined Room after connect:', roomId);
// //     };
// //     socket.once('connect', handleConnectThenJoin);

// //     // cleanup
// //     return () => {
// //       socket.off('connect', handleConnectThenJoin);
// //     };
// //   }, [CURRENT_USER_ID, chatUserId]);


// //   useEffect(() => {
// //     const handler = (msg: any) => {
// //       console.log('📥 Received (socket):', msg);

// //       const myId = currentUserIdRef.current;
// //       if (!myId) return;

// //       // Always use the OTHER person's ID as the chat key
// //       const otherUserId = msg.senderId === myId ? msg.receiverId : msg.senderId;

// //       addMessage(otherUserId, {
// //         id: msg.id || String(msg.createdAt), // Fallback if no id
// //         text: msg.text,
// //         fromMe: msg.senderId === myId,
// //         createdAt: msg.createdAt,
// //       });

// //       setTimeout(() => {
// //         flatRef.current?.scrollToEnd({ animated: true });
// //       }, 50);
// //     };

// //     socket.on('Message', handler);

// //     return () => {
// //       socket.off('Message', handler);
// //     };
// //   }, []); // Empty deps - register ONCE only

// //   // chat messages for this screen
// //   const chatMessages = messages[chatUserId] ?? [];
// //   console.log("mmmmmmmmmmmmmmmmmmmmmmmmm", chatMessages);

// //   function sendMessageToSocket(text: string) {
// //     if (!CURRENT_USER_ID) {
// //       console.warn('No current user id available');
// //       return;
// //     }

// //     // Generate ID once
// //     const msgId = `${CURRENT_USER_ID}-${Date.now()}`;

// //     const payload = {
// //       id: msgId, // Include ID in payload
// //       senderId: CURRENT_USER_ID,
// //       receiverId: chatUserId,
// //       text,
// //       createdAt: Date.now(),
// //     };

// //     // UI update immediately with same ID
// //     addMessage(chatUserId, {
// //       id: msgId,
// //       text,
// //       fromMe: true,
// //       createdAt: Date.now(),
// //     });

// //     // Emit to server
// //     socket.emit('sendMessage', payload);
// //     console.log('📤 Emitted sendMessage:', payload);

// //     setTimeout(() => {
// //       flatRef.current?.scrollToEnd({ animated: true });
// //     }, 60);
// //   }
// //   // ---------------------------
// //   // Responsive metrics
// //   // ---------------------------
// //   const fontSize = width < 360 ? 13 : width < 400 ? 14 : width < 600 ? 15 : 16;
// //   const bubblePadding = width < 360 ? 8 : width < 400 ? 10 : 12;
// //   const padding = width < 360 ? 8 : width < 400 ? 10 : 14;
// //   const modalWidth = width < 360 ? '85%' : width < 400 ? '80%' : '70%';

// //   return (
// //     <KeyboardAvoidingView
// //       style={{ flex: 1, backgroundColor: theme.background }}
// //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //       keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
// //     >
// //       <View style={[styles.container, { padding }]}>
// //         <FlatList
// //           ref={flatRef}
// //           data={chatMessages}
// //           keyExtractor={(i) => i.id}
// //           renderItem={({ item }) => (
// //             <MessageBubble
// //               m={item}
// //               fontSize={fontSize}
// //               bubblePadding={bubblePadding}
// //               onLongPress={(msg) => setSelectedMessage(msg)}
// //             />
// //           )}
// //           contentContainerStyle={{ paddingBottom: 20 }}
// //           showsVerticalScrollIndicator={false}
// //         />

// //         <Composer onSend={sendMessageToSocket} inputFontSize={fontSize} padding={padding} />
// //       </View>

// //       <Modal
// //         visible={!!selectedMessage}
// //         transparent
// //         animationType="fade"
// //         onRequestClose={() => setSelectedMessage(null)}
// //       >
// //         <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
// //           <View style={[styles.modalBox, { backgroundColor: theme.background, width: modalWidth }]}>
// //             <TouchableOpacity onPress={() => deleteMessageForMe(chatUserId, selectedMessage!.id)} style={styles.modalBtn}>
// //               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Me</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity onPress={() => deleteMessageForEveryone(chatUserId, selectedMessage!.id)} style={styles.modalBtn}>
// //               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Everyone</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity onPress={() => setSelectedMessage(null)} style={styles.modalBtn}>
// //               <Text style={[styles.modalText, { color: theme.link, fontSize }]}>Close</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // // ---------------------------
// // // styles (same as yours)
// // // ---------------------------
// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   bubble: {
// //     borderRadius: 10,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.05,
// //     elevation: 1,
// //   },
// //   composerContainer: {
// //     borderTopWidth: 1,
// //   },
// //   composerRow: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-end',
// //   },
// //   textInput: {
// //     flex: 1,
// //     minHeight: 40,
// //     maxHeight: 120,
// //     borderRadius: 8,
// //     borderWidth: 1,
// //   },
// //   sendBtn: {
// //     marginLeft: 8,
// //     borderRadius: 8,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// //   modalBox: { borderRadius: 12, paddingVertical: 15, paddingHorizontal: 10 },
// //   modalBtn: { paddingVertical: 12, alignItems: 'center' },
// //   modalText: { fontWeight: '500' },
// // });


// // ChatDetailScreen.tsx - Updated with room-based messaging

// import { useAppTheme } from '@/src/constants/themeHelper';
// import { useChatStore } from '@/src/store/useChatStore';
// import { Message } from '@/src/types/chatType';
// import { RouteProp, useRoute } from '@react-navigation/native';
// import React, { useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// import { chatSessionId } from '@/src/api/chat-api';
// import { GetCurrentUser } from '@/src/api/profile-api';
// import { useQuery } from '@tanstack/react-query';
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
//   useWindowDimensions
// } from 'react-native';

// // Socket config
// export const socket = io("http://192.168.1.52:3000/socket.io", {
//   transports: ["websocket"],
//   autoConnect: false,
// });

// // Helper function to generate room ID
// function getRoomId(userId1: string, userId2: string): string {
//   return [userId1, userId2].sort().join('-');
// }

// // MessageBubble component
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
//   const align = m.fromMe ? 'flex-end' : 'flex-start';
//   const bg = m.fromMe ? theme.buttonBg : theme.inputBg;
//   const textColor = m.fromMe ? theme.buttonText : theme.text;

//   return (
//     <Pressable
//       onLongPress={() => onLongPress(m)}
//       style={{
//         alignSelf: align,
//         marginVertical: 6,
//         maxWidth: '80%',
//       }}
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
//           hour: '2-digit',
//           minute: '2-digit',
//         })}
//       </Text>
//     </Pressable>
//   );
// }

// // Composer component
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
//   const [text, setText] = React.useState('');

//   function sendText() {
//     if (!text.trim()) return;
//     onSend(text.trim());
//     setText('');
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
//             { backgroundColor: theme.buttonBg, paddingVertical: padding / 2, paddingHorizontal: padding },
//           ]}
//           onPress={sendText}
//         >
//           <Text style={{ color: theme.buttonText, fontSize: inputFontSize }}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// // ChatDetailScreen
// export default function ChatDetailScreen() {
//   const theme = useAppTheme();
//   const { width } = useWindowDimensions();
//   const route = useRoute<RouteProp<{ params: { id: string; chatName?: string } }, 'params'>>();
//   const { id: chatUserId, chatName } = route.params;

//   const { data: currentUser } = useQuery({
//     queryKey: ['currentUser'],
//     queryFn: GetCurrentUser,
//   });

//   const CURRENT_USER_ID = currentUser?.id;

//   const {
//     messages,
//     addMessage,
//     selectedMessage,
//     setSelectedMessage,
//     deleteMessageForMe,
//     deleteMessageForEveryone,
//   } = useChatStore();

//   const flatRef = useRef<FlatList<any>>(null);
//   const currentUserIdRef = useRef<string | undefined>(CURRENT_USER_ID);
//   const currentRoomIdRef = useRef<string | null>(null);

//   useEffect(() => {
//     currentUserIdRef.current = CURRENT_USER_ID;
//   }, [CURRENT_USER_ID]);

//   // Connect socket
//   useEffect(() => {
//     if (!CURRENT_USER_ID) return;

//     socket.io.opts.query = { userId: CURRENT_USER_ID };

//     if (!socket.connected) socket.connect();
//   }, [CURRENT_USER_ID]);

//   // Create session and join room
//   useEffect(() => {
//     if (!CURRENT_USER_ID || !chatUserId) return;

//     const roomId = getRoomId(CURRENT_USER_ID, chatUserId);
//     currentRoomIdRef.current = roomId;

//     // Pehle session create karo backend pe using your API
//     const createSessionAndJoin = async () => {
//       try {
//         // Your chatSessionId function call karo
//         const sessionData = await chatSessionId(CURRENT_USER_ID, chatUserId);
//         console.log('📝 Session created/found:', sessionData);

//         // Ab socket room join karo
//         const handleConnect = () => {
//           socket.emit('joinRoom', { roomId });
//           console.log('🟢 Joined Room:', roomId);
//         };

//         if (socket.connected) {
//           handleConnect();
//         } else {
//           socket.once('connect', handleConnect);
//         }
//       } catch (error) {
//         console.error('❌ Error creating session:', error);
//       }
//     };

//     createSessionAndJoin();

//     return () => {
//       socket.off('connect');
//     };
//   }, [CURRENT_USER_ID, chatUserId]);

//   // Listen for messages
//   useEffect(() => {
//     const handleMessage = (msg: any) => {
//       console.log('📥 Received message:', msg);

//       const myId = currentUserIdRef.current;
//       if (!myId) return;

//       const otherUserId = msg.senderId === myId ? msg.receiverId : msg.senderId;

//       addMessage(otherUserId, {
//         id: msg.message_id,
//         text: msg.text,
//         fromMe: msg.senderId === myId,
//         createdAt: msg.createdAt,
//       });

//       setTimeout(() => {
//         flatRef.current?.scrollToEnd({ animated: true });
//       }, 50);
//     };

//     // Listen for previous messages
//     // const handlePreviousMessages = (msgs: any[]) => {
//     //   console.log('📜 Loaded previous messages:', msgs.length);

//     //   const myId = currentUserIdRef.current;
//     //   if (!myId || !chatUserId) return;

//     //   msgs.forEach((msg) => {
//     //     addMessage(chatUserId, {
//     //       id: msg.message_id,
//     //       text: msg.message_text,
//     //       fromMe: msg.sender.id === myId,
//     //       createdAt: new Date(msg.created_at).getTime(),
//     //     });
//     //   });

//     //   setTimeout(() => {
//     //     flatRef.current?.scrollToEnd({ animated: false });
//     //   }, 100);
//     // };

//     // Listen for deleted messages
//     const handleMessageDeletedForMe = (data: { messageId: string }) => {
//       deleteMessageForMe(chatUserId, data.messageId);
//     };

//     // Listen for delete for everyone (all users in room)
//     const handleMessageDeleted = (data: { messageId: string; deletedForEveryone: boolean }) => {
//       if (data.deletedForEveryone) {
//         deleteMessageForEveryone(chatUserId, data.messageId);
//       }
//     };

//     socket.on('messageDeletedForMe', handleMessageDeletedForMe);
//     socket.on('messageDeleted', handleMessageDeleted);

//     return () => {
//       socket.off('messageDeletedForMe', handleMessageDeletedForMe);
//       socket.off('messageDeleted', handleMessageDeleted);
//     };
//   }, [chatUserId]);


//   // Update delete handlers
//   function handleDeleteForMe() {
//     if (!selectedMessage || !CURRENT_USER_ID) return;

//     socket.emit('deleteMessageForMe', {
//       messageId: selectedMessage.id,
//       userId: CURRENT_USER_ID,
//       roomId: currentRoomIdRef.current,
//     });

//     deleteMessageForMe(chatUserId, selectedMessage.id);
//     setSelectedMessage(null);
//   }

//   function handleDeleteForEveryone() {
//     if (!selectedMessage || !CURRENT_USER_ID || !currentRoomIdRef.current) return;

//     socket.emit('deleteMessageForEveryone', {
//       messageId: selectedMessage.id,
//       userId: CURRENT_USER_ID,
//       roomId: currentRoomIdRef.current,
//     });

//     deleteMessageForEveryone(chatUserId, selectedMessage.id);
//     setSelectedMessage(null);
//   }


//   const chatMessages = messages[chatUserId] ?? [];

//   function sendMessageToSocket(text: string) {
//     if (!CURRENT_USER_ID) {
//       console.warn('No current user id available');
//       return;
//     }

//     const msgId = `${CURRENT_USER_ID}-${Date.now()}`;
//     const timestamp = Date.now();

//     const payload = {
//       id: msgId,
//       senderId: CURRENT_USER_ID,
//       receiverId: chatUserId,
//       text,
//       createdAt: timestamp,
//     };

//     // Optimistic UI update
//     addMessage(chatUserId, {
//       id: msgId,
//       text,
//       fromMe: true,
//       createdAt: timestamp,
//     });

//     // Emit to server
//     socket.emit('sendMessage', payload);
//     console.log('📤 Sent message:', payload);

//     setTimeout(() => {
//       flatRef.current?.scrollToEnd({ animated: true });
//     }, 60);
//   }

//   // function handleDeleteForEveryone() {
//   //   if (!selectedMessage || !currentRoomIdRef.current) return;

//   //   socket.emit('deleteMessageForEveryone', {
//   //     messageId: selectedMessage.id,
//   //     roomId: currentRoomIdRef.current,
//   //   });

//   //   deleteMessageForEveryone(chatUserId, selectedMessage.id);
//   //   setSelectedMessage(null);
//   // }

//   // Responsive metrics
//   const fontSize = width < 360 ? 13 : width < 400 ? 14 : width < 600 ? 15 : 16;
//   const bubblePadding = width < 360 ? 8 : width < 400 ? 10 : 12;
//   const padding = width < 360 ? 8 : width < 400 ? 10 : 14;
//   const modalWidth = width < 360 ? '85%' : width < 400 ? '80%' : '70%';

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: theme.background }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
//     >
//       <View style={[styles.container, { padding }]}>
//         <FlatList
//           ref={flatRef}
//           data={chatMessages}
//           keyExtractor={(i) => i.id}
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
//         />

//         <Composer onSend={sendMessageToSocket} inputFontSize={fontSize} padding={padding} />
//       </View>

//       <Modal
//         visible={!!selectedMessage}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setSelectedMessage(null)}
//       >
//         <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
//           <View style={[styles.modalBox, { backgroundColor: theme.background, width: modalWidth }]}>
//             <TouchableOpacity
//               onPress={() => {
//                 deleteMessageForMe(chatUserId, selectedMessage!.id);
//                 setSelectedMessage(null);
//               }}
//               style={styles.modalBtn}
//             >
//               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Me</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={handleDeleteForEveryone}
//               style={styles.modalBtn}
//             >
//               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Everyone</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => setSelectedMessage(null)} style={styles.modalBtn}>
//               <Text style={[styles.modalText, { color: theme.link, fontSize }]}>Close</Text>
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

import { chatSessionId } from '@/src/api/chat-api';
import { GetCurrentUser } from '@/src/api/profile-api';
import { useAppTheme } from '@/src/constants/themeHelper';
import { socket } from '@/src/socket/socket';
import { useChatStore } from '@/src/store/useChatStore';
import { Message } from '@/src/types/chatType';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';

// Socket configuration

// Helper function to generate room ID
function getRoomId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join('-');
}

// MessageBubble component
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
  const align = m.fromMe ? 'flex-end' : 'flex-start';
  const bg = m.fromMe ? theme.buttonBg : theme.inputBg;
  const textColor = m.fromMe ? theme.buttonText : theme.text;

  return (
    <Pressable
      onLongPress={() => onLongPress(m)}
      style={{
        alignSelf: align,
        marginVertical: 6,
        maxWidth: '80%',
      }}
    >
      <View style={[styles.bubble, { backgroundColor: bg, padding: bubblePadding }]}>
        <Text style={{ color: textColor, fontSize }}>{m.text}</Text>
      </View>

      <Text
        style={{
          fontSize: fontSize - 4,
          color: theme.subtitle,
          marginTop: 4,
          alignSelf: align,
        }}
      >
        {new Date(m.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </Pressable>
  );
}

// Composer component
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
  const [text, setText] = React.useState('');

  function sendText() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
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
            { backgroundColor: theme.buttonBg, paddingVertical: padding / 2, paddingHorizontal: padding },
          ]}
          onPress={sendText}
        >
          <Text style={{ color: theme.buttonText, fontSize: inputFontSize }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ChatDetailScreen
export default function ChatDetailScreen() {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const route = useRoute<RouteProp<{ params: { id: string; chatName?: string } }, 'params'>>();
  const { id: chatUserId, chatName } = route.params;
 const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: GetCurrentUser,
  });

  const CURRENT_USER_ID = currentUser?.id;

  const {
    messages,
    addMessage,
    selectedMessage,
    setSelectedMessage,
    deleteMessageForMe,
    deleteMessageForEveryone,
    clearMessages
  } = useChatStore();

  // Refs
  const flatRef = useRef<FlatList<any>>(null);
  const currentUserIdRef = useRef<string | undefined>(CURRENT_USER_ID);
  const currentRoomIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<number | null>(null);
    // const messagesLoadedRef = useRef(false);

  // Update current user ref when user changes
  useEffect(() => {
    currentUserIdRef.current = CURRENT_USER_ID;
  }, [CURRENT_USER_ID]);

  // Connect socket when user is available
  useEffect(() => {
    if (!CURRENT_USER_ID) return;

    socket.io.opts.query = { userId: CURRENT_USER_ID };

    if (!socket.connected) {
      socket.connect();
      console.log('🔌 Socket connecting...');
    }

    return () => {
      // Cleanup: disconnect when component unmounts
      if (socket.connected) {
        socket.disconnect();
        console.log('🔌 Socket disconnected');
      }
    };
  }, [CURRENT_USER_ID]);

  // Create session and join room
  useEffect(() => {
    if (!CURRENT_USER_ID || !chatUserId) return;

    const roomId = getRoomId(CURRENT_USER_ID, chatUserId);
    currentRoomIdRef.current = roomId;

    const createSessionAndJoin = async () => {
      try {
        const sessionData = await chatSessionId(CURRENT_USER_ID, chatUserId);
        console.log('📝 Session created/found:', sessionData);

        // Store session ID for sending messages
        sessionIdRef.current = sessionData.session_id;

        const handleConnect = () => {
          socket.emit('joinRoom', { roomId });
          console.log('🟢 Joined Room:', roomId);

          // Request previous messages
          socket.emit('getPreviousMessages', { roomId });
        };

        if (socket.connected) {
          handleConnect();
        } else {
          socket.once('connect', handleConnect);
        }
      } catch (error) {
        console.error('❌ Error creating session:', error);
      }
    };

    createSessionAndJoin();

    return () => {
      // Leave room when component unmounts or chat changes
      if (roomId) {
        socket.emit('leaveRoom', { roomId });
        console.log('🔴 Left Room:', roomId);
      }
      socket.off('connect');
    };
  }, [CURRENT_USER_ID, chatUserId]);

  // Listen for socket events
  useEffect(() => {
    const handleMessage = (msg: any) => {
      console.log('📥 Received message:', msg);

      const myId = currentUserIdRef.current;
      if (!myId) return;

      const otherUserId = msg.senderId === myId ? msg.receiverId : msg.senderId;

      addMessage(otherUserId, {
        id: String(msg.message_id),
        text: msg.text,
        fromMe: msg.senderId === myId,
        createdAt: new Date(msg.createdAt).getTime(),
      });

      setTimeout(() => {
        flatRef.current?.scrollToEnd({ animated: true });
      }, 50);
    };

    const handlePreviousMessages = (msgs: any[]) => {
      console.log('📜 Loaded previous messages:', msgs.length);

      const myId = currentUserIdRef.current;
      if (!myId || !chatUserId) return;

      msgs.forEach((msg) => {
        addMessage(chatUserId, {
          id: String(msg.message_id),
          text: msg.message_text,
          fromMe: msg.sender.id === myId,
          createdAt: new Date(msg.created_at).getTime(),
        });
      });

      setTimeout(() => {
        flatRef.current?.scrollToEnd({ animated: false });
      }, 100);
    };


  //   const handlePreviousMessages = useCallback(async (sessionId: number) => {
  //   if (messagesLoadedRef.current) return;
    
  //   setIsLoadingMessages(true);
  //   try {
  //     const data = await getSessionMessages(String(sessionId));
  //     console.log('📜 Loaded messages from API:', data);

  //     const myId = currentUserIdRef.current;
  //     if (!myId || !chatUserId) return;

  //     // Clear existing messages for this chat before loading
  //     clearMessages(chatUserId);

  //     // Add messages to store
  //     if (data && Array.isArray(data)) {
  //       data.forEach((msg: any) => {
  //         addMessage(chatUserId, {
  //           id: String(msg.message_id),
  //           text: msg.message_text || msg.text,
  //           fromMe: msg.sender?.id === myId || msg.senderId === myId,
  //           createdAt: new Date(msg.created_at || msg.createdAt).getTime(),
  //         });
  //       });

  //       messagesLoadedRef.current = true;

  //       // Scroll to bottom after messages are loaded
  //       setTimeout(() => {
  //         flatRef.current?.scrollToEnd({ animated: false });
  //       }, 100);
  //     }
  //   } catch (error) {
  //     console.error('❌ Error loading messages:', error);
  //   } finally {
  //     setIsLoadingMessages(false);
  //   }
  // }, [chatUserId, addMessage, clearMessages]);

    const handleMessageDeletedForMe = (data: { messageId: string }) => {
      console.log('🗑️ Message deleted for me:', data.messageId);
      deleteMessageForMe(chatUserId, String(data.messageId));
    };

    const handleMessageDeleted = (data: { messageId: string; deletedForEveryone: boolean }) => {
      console.log('🗑️ Message deleted for everyone:', data.messageId);
      if (data.deletedForEveryone) {
        deleteMessageForEveryone(chatUserId, String(data.messageId));
      }
    };

    // Register event listeners
    socket.on('Message', handleMessage);
    socket.on('previousMessages', handlePreviousMessages);
    socket.on('messageDeletedForMe', handleMessageDeletedForMe);
    socket.on('messageDeleted', handleMessageDeleted);

    // Cleanup listeners on unmount or when dependencies change
    return () => {
      socket.off('Message', handleMessage);
      socket.off('previousMessages', handlePreviousMessages);
      socket.off('messageDeletedForMe', handleMessageDeletedForMe);
      socket.off('messageDeleted', handleMessageDeleted);
    };
  }, [chatUserId, addMessage, deleteMessageForMe, deleteMessageForEveryone]);

  const chatMessages = messages[chatUserId] ?? [];

  // Send message handler
  const sendMessageToSocket = useCallback((text: string) => {
    if (!CURRENT_USER_ID || !sessionIdRef.current) {
      console.warn('⚠️ Cannot send message: User ID or Session ID missing');
      return;
    }

    const payload = {
      sessionId: sessionIdRef.current,
      senderId: CURRENT_USER_ID,
      receiverId: chatUserId,
      text,
    };

    socket.emit('sendMessage', payload);
    console.log('📤 Sent message:', payload);
  }, [CURRENT_USER_ID, chatUserId]);

  // Delete message for me handler
  const handleDeleteForMe = useCallback(() => {
    if (!selectedMessage || !CURRENT_USER_ID) return;

    console.log('🗑️ Deleting for me:', selectedMessage.id);

    socket.emit('deleteMessageForMe', {
      messageId: selectedMessage.id,
      userId: CURRENT_USER_ID,
      roomId: currentRoomIdRef.current,
    });

    deleteMessageForMe(chatUserId, selectedMessage.id);
    setSelectedMessage(null);
  }, [selectedMessage, CURRENT_USER_ID, chatUserId, deleteMessageForMe, setSelectedMessage]);

  // Delete message for everyone handler
  const handleDeleteForEveryone = useCallback(() => {
    if (!selectedMessage || !CURRENT_USER_ID || !currentRoomIdRef.current) return;

    console.log('🗑️ Deleting for everyone:', selectedMessage.id);

    socket.emit('deleteMessageForEveryone', {
      messageId: selectedMessage.id,
      userId: CURRENT_USER_ID,
      roomId: currentRoomIdRef.current,
    });

    deleteMessageForEveryone(chatUserId, selectedMessage.id);
    setSelectedMessage(null);
  }, [selectedMessage, CURRENT_USER_ID, chatUserId, deleteMessageForEveryone, setSelectedMessage]);

  // Responsive metrics
  const fontSize = width < 360 ? 13 : width < 400 ? 14 : width < 600 ? 15 : 16;
  const bubblePadding = width < 360 ? 8 : width < 400 ? 10 : 12;
  const padding = width < 360 ? 8 : width < 400 ? 10 : 14;
  const modalWidth = width < 360 ? '85%' : width < 400 ? '80%' : '70%';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
      <View style={[styles.container, { padding }]}>
        <FlatList
          ref={flatRef}
          data={chatMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              m={item}
              fontSize={fontSize}
              bubblePadding={bubblePadding}
              onLongPress={setSelectedMessage}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />

        <Composer onSend={sendMessageToSocket} inputFontSize={fontSize} padding={padding} />
      </View>

      <Modal
        visible={!!selectedMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMessage(null)}
      >
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