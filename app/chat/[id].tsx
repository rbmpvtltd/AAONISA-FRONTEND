// import { useAppTheme } from '@/src/constants/themeHelper';
// import { useChatStore } from '@/src/store/useChatStore';
// import { Message } from '@/src/types/chatType';
// import { RouteProp, useRoute } from '@react-navigation/native';
// import React, { useEffect, useRef } from 'react';
// import io from "socket.io-client";

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
//   useWindowDimensions,
// } from 'react-native';

// const socket = io("http://192.168.1.52:3000/socket.io", {
//   transports: ["websocket"],
//   autoConnect: true,
//   // query: { userId: CURRENT_USER_ID },
// });

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
//       <View
//         style={[
//           styles.bubble,
//           { backgroundColor: bg, padding: bubblePadding },
//         ]}
//       >
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

// export default function ChatDetailScreen() {
//   const theme = useAppTheme();
//   const { width, height } = useWindowDimensions();
//   const route = useRoute<RouteProp<{ params: { id: string; chatName?: string } }, 'params'>>();
//   const { id, chatName } = route.params;


//   const { data: currentUser } = useQuery({
//     queryKey: ["currentUser"],
//     queryFn: GetCurrentUser,

//   });

//   const CURRENT_USER_ID = currentUser?.id?.toString();
//   const chatUserId = id;

//   console.log("aaaaaaaaaaaa", CURRENT_USER_ID);
//   console.log("aaaaaaaaaaaa", currentUser);



//   const {
//     messages,
//     addMessage,
//     selectedMessage,
//     setSelectedMessage,
//     deleteMessageForMe,
//     deleteMessageForEveryone,
//   } = useChatStore();
//   const flatRef = useRef<FlatList<any>>(null);

// useEffect(() => {
//   if (!CURRENT_USER_ID || !chatUserId) return;

//   const roomId = [CURRENT_USER_ID, chatUserId].sort().join("-");

//   socket.emit("joinRoom", { roomId });
//   console.log("🟢 Joined Room:", roomId);

// }, [CURRENT_USER_ID, chatUserId]);


// useEffect(() => {
//   if (!CURRENT_USER_ID) return;

//   socket.io.opts.query = { userId: CURRENT_USER_ID };
//   socket.connect();

//   console.log("🔌 Socket Connected with", CURRENT_USER_ID);

//   return () => socket.disconnect();
// }, [CURRENT_USER_ID]);

  

// useEffect(() => {
//   if (!CURRENT_USER_ID || !chatUserId) return;

//   const roomId = [CURRENT_USER_ID, chatUserId].sort().join("-");

//   console.log("🟢 Joining Room:", roomId);
//   socket.emit("joinRoom", { roomId });

// }, [CURRENT_USER_ID, chatUserId]);


// useEffect(() => {
//   socket.on("Message", (msg) => {
//     console.log("📥 Received:", msg);

//     const chatKey =
//       msg.senderId === CURRENT_USER_ID
//         ? msg.receiverId
//         : msg.senderId;

//     addMessage(chatKey, {
//       id: msg.id ?? String(Date.now()),
//       text: msg.text,
//       fromMe: msg.senderId === CURRENT_USER_ID,
//       createdAt: msg.createdAt,
//     });

//     setTimeout(() => {
//       flatRef.current?.scrollToEnd({ animated: true });
//     }, 40);
//   });

//   return () => socket.off("Message");
// }, [CURRENT_USER_ID]);



//   const chatMessages = messages[id] ?? [];

//   function sendMessageToSocket(text: string) {
//   const payload = {
//     senderId: CURRENT_USER_ID,
//     receiverId: chatUserId,
//     text,
//     createdAt: Date.now(),
//   };

//   // UI update
//   addMessage(chatUserId, {
//     id: String(Date.now()),
//     text,
//     fromMe: true,
//     createdAt: Date.now(),
//   });

//   // Send to server room
//   socket.emit("sendMessage", payload);

//   flatRef.current?.scrollToEnd({ animated: true });
// }

//   // 🔹 Responsive metrics
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
//       {/* <Stack.Screen name={`${chatId}`} options={{ title: `${chatName}` }} />  */}
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
//               onPress={() => deleteMessageForMe(id, selectedMessage!.id)}
//               style={styles.modalBtn}
//             >
//               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Me</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => deleteMessageForEveryone(id, selectedMessage!.id)}
//               style={styles.modalBtn}
//             >
//               <Text style={[styles.modalText, { color: theme.text, fontSize }]}>
//                 Delete for Everyone
//               </Text>
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
//   container: { flex: 1 },
//   bubble: {
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     elevation: 1,
//   },
//   composerContainer: {
//     borderTopWidth: 1,
//   },
//   composerRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//   },
//   textInput: {
//     flex: 1,
//     minHeight: 40,
//     maxHeight: 120,
//     borderRadius: 8,
//     borderWidth: 1,
//   },
//   sendBtn: {
//     marginLeft: 8,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   modalBox: { borderRadius: 12, paddingVertical: 15, paddingHorizontal: 10 },
//   modalBtn: { paddingVertical: 12, alignItems: 'center' },
//   modalText: { fontWeight: '500' },
// });

// ChatDetailScreen.tsx
import { useAppTheme } from '@/src/constants/themeHelper';
import { useChatStore } from '@/src/store/useChatStore';
import { Message } from '@/src/types/chatType';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

import { GetCurrentUser } from '@/src/api/profile-api';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
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
  useWindowDimensions,
} from 'react-native';

// ---------------------------
// socket config (autoConnect: false)
// ---------------------------
const socket: Socket = io('http://192.168.1.52:3000/socket.io', {
  transports: ['websocket'],
  autoConnect: false,
});

// ---------------------------
// MessageBubble component (same UI)
// ---------------------------
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

// ---------------------------
// Composer component (same UI)
// ---------------------------
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

// ---------------------------
// ChatDetailScreen (fixed)
// ---------------------------
export default function ChatDetailScreen() {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const route = useRoute<RouteProp<{ params: { id: string; chatName?: string } }, 'params'>>();
  const { id: chatUserId, chatName } = route.params;

  // current user (from query)
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: GetCurrentUser,
  });

  const CURRENT_USER_ID = currentUser?.id?.toString();

  // ---------------------------
  // IMPORTANT: grab store BEFORE effects
  // ---------------------------
  const {
    messages,
    addMessage,
    selectedMessage,
    setSelectedMessage,
    deleteMessageForMe,
    deleteMessageForEveryone,
  } = useChatStore();

  const flatRef = useRef<FlatList<any>>(null);

  // keep a ref for latest CURRENT_USER_ID so our listener uses latest
  const currentUserIdRef = useRef<string | undefined>(CURRENT_USER_ID);
  useEffect(() => {
    currentUserIdRef.current = CURRENT_USER_ID;
  }, [CURRENT_USER_ID]);

  // keep track if we've joined the room already (avoid duplicate join)
  const joinedRoomRef = useRef<Record<string, boolean>>({});

  // ---------------------------
  // 1) connect socket once when CURRENT_USER_ID available
  // ---------------------------
  useEffect(() => {
    if (!CURRENT_USER_ID) return;

    // set query BEFORE connect
    socket.io.opts.query = { userId: CURRENT_USER_ID };
    if (!socket.connected) socket.connect();

    // optional logs
    const onConnect = () => console.log('🔌 Socket connected', socket.id);
    const onDisconnect = (reason: any) => console.log('🔌 Socket disconnected', reason);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      // don't fully disconnect here if you want socket shared across screens;
      // if this screen owns the socket lifecycle then disconnect:
      // socket.disconnect();
    };
  }, [CURRENT_USER_ID]);

  // ---------------------------
  // 2) join room whenever both ids available (ensure socket.connected)
  // ---------------------------
  useEffect(() => {
    if (!CURRENT_USER_ID || !chatUserId) return;

    const roomId = [CURRENT_USER_ID, chatUserId].sort().join('-');

    // If already joined, skip
    if (joinedRoomRef.current[roomId]) return;

    // If socket already connected -> join now
    if (socket.connected) {
      socket.emit('joinRoom', { roomId });
      joinedRoomRef.current[roomId] = true;
      console.log('🟢 Joined Room:', roomId);
      return;
    }

    // otherwise wait for connect event and join once
    const handleConnectThenJoin = () => {
      socket.emit('joinRoom', { roomId });
      joinedRoomRef.current[roomId] = true;
      console.log('🟢 Joined Room after connect:', roomId);
    };
    socket.once('connect', handleConnectThenJoin);

    // cleanup
    return () => {
      socket.off('connect', handleConnectThenJoin);
    };
  }, [CURRENT_USER_ID, chatUserId]);


  useEffect(() => {
    const handler = (msg: any) => {
      console.log('📥 Received (socket):', msg);
   Alert.alert('📥 Received (socket):', JSON.stringify(msg))

      // use latest current user id from ref
      const myId = currentUserIdRef.current;

      // determine correct chat key (the "other" user)
      const chatKey = msg.senderId === myId ? msg.receiverId : msg.senderId;

      addMessage(chatKey, {
        id: msg.id ?? String(Date.now()),
        text: msg.text,
        fromMe: msg.senderId === myId,
        createdAt: msg.createdAt ?? Date.now(),
      });

      setTimeout(() => {
        flatRef.current?.scrollToEnd({ animated: true });
      }, 50);
    };

    socket.on('Message', handler);

    return () => {
      socket.off('Message', handler);
    };
    // empty deps so listener registers once
  }, []);

  // ---------------------------
  // chat messages for this screen
  // ---------------------------
  const chatMessages = messages[chatUserId] ?? [];

  // ---------------------------
  // send message
  // ---------------------------
  function sendMessageToSocket(text: string) {
    if (!CURRENT_USER_ID) {
      console.warn('No current user id available');
      return;
    }
    const payload = {
      senderId: CURRENT_USER_ID,
      receiverId: chatUserId,
      text,
      createdAt: Date.now(),
    };

    // UI update immediately
    addMessage(chatUserId, {
      id: String(Date.now()),
      text,
      fromMe: true,
      createdAt: Date.now(),
    });

    // emit to server (server will broadcast to room)
    socket.emit('sendMessage', payload);
    console.log('📤 Emitted sendMessage:', payload);

    setTimeout(() => {
      flatRef.current?.scrollToEnd({ animated: true });
    }, 60);
  }

  // ---------------------------
  // Responsive metrics
  // ---------------------------
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
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <MessageBubble
              m={item}
              fontSize={fontSize}
              bubblePadding={bubblePadding}
              onLongPress={(msg) => setSelectedMessage(msg)}
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
            <TouchableOpacity onPress={() => deleteMessageForMe(chatUserId, selectedMessage!.id)} style={styles.modalBtn}>
              <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteMessageForEveryone(chatUserId, selectedMessage!.id)} style={styles.modalBtn}>
              <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Everyone</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelectedMessage(null)} style={styles.modalBtn}>
              <Text style={[styles.modalText, { color: theme.link, fontSize }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ---------------------------
// styles (same as yours)
// ---------------------------
const styles = StyleSheet.create({
  container: { flex: 1 },
  bubble: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 1,
  },
  composerContainer: {
    borderTopWidth: 1,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 8,
    borderWidth: 1,
  },
  sendBtn: {
    marginLeft: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalBox: { borderRadius: 12, paddingVertical: 15, paddingHorizontal: 10 },
  modalBtn: { paddingVertical: 12, alignItems: 'center' },
  modalText: { fontWeight: '500' },
});

// import { GetCurrentUser } from "@/src/api/profile-api";
// import { useAppTheme } from "@/src/constants/themeHelper";
// import { useChatStore } from "@/src/store/useChatStore";
// import { RouteProp, useRoute } from "@react-navigation/native";
// import { useQuery } from "@tanstack/react-query";
// import { useEffect, useRef, useState } from "react";
// import {
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   useWindowDimensions,
//   View,
// } from "react-native";
// import io from "socket.io-client";



// export default function ChatDetailScreen() {
//   const theme = useAppTheme();
//   const { width } = useWindowDimensions();


//   const { data: currentUser } = useQuery({
//     queryKey: ["currentUser"],
//     queryFn: GetCurrentUser,
//   });

//   const CURRENT_USER_ID = currentUser?.data?.id?.toString();

// const socket = io("http://192.168.1.52:3000/socket.io", {
//   transports: ["websocket"],
//   autoConnect: false,
//   query: { userId: CURRENT_USER_ID },
// });


//   // ------------------------
//   // 🔥 Route params
//   // ------------------------
//   const route = useRoute<
//     RouteProp<{ params: { id: string; chatName?: string } }, "params">
//   >();

//   const { id: chatUserId, chatName } = route.params; // jisse chat kar rahe ho

//   // ------------------------
//   // 🔥 Zustand Store
//   // ------------------------
//   const { messages, addMessage } = useChatStore();
//   const chatMessages = messages[chatUserId] ?? [];

//   const flatRef = useRef<FlatList<any>>(null);

//   const fontSize = width < 360 ? 13 : 16;
//   const bubblePadding = width < 360 ? 8 : 12;
//   const padding = width < 360 ? 8 : 14;

//   // ------------------------
//   // 🔥 SOCKET INITIALIZATION
//   // ------------------------
//   useEffect(() => {
//     console.log("📡 Connecting socket…");
//     socket.connect();

//     // socket.on("connect", () => {
//     //   console.log("✅ Socket Connected:", socket.id);
//     // });

//     // ------------------------
//     // 🔥 Receive Private Message
//     // ------------------------
//     socket.on("Message", (msg) => {
//       console.log("📥 Message:", msg);

//       addMessage(msg.senderId, {
//         id: msg.id ?? String(Date.now()),
//         text: msg.text,
//         fromMe: false,
//         createdAt: msg.createdAt,
//       });

//       // scroll bottom
//       setTimeout(() => {
//         flatRef.current?.scrollToEnd({ animated: true });
//       }, 50);
//     });


//   }, []);

//   // ------------------------
//   // 🔥 SEND MESSAGE
//   // ------------------------
//   function sendMessageToSocket(text: string) {
//     const payload = {
//       senderId: CURRENT_USER_ID,
//       receiverId: chatUserId,
//       text,
//       createdAt: Date.now(),
//     };

//     // UI update immediately
//     addMessage(chatUserId, {
//       id: String(Date.now()),
//       text,
//       fromMe: true,
//       createdAt: Date.now(),
//     });

//     // send to server
//     socket.emit("sendMessage", payload);

//     setTimeout(() => {
//       flatRef.current?.scrollToEnd({ animated: true });
//     }, 100);
//   }

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: theme.background }}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <View style={{ flex: 1, padding }}>

//         {/* ------------------------
//             🔥 Chat Messages List 
//         -------------------------*/}
//         <FlatList
//           ref={flatRef}
//           data={chatMessages}
//           keyExtractor={(i) => i.id}
//           renderItem={({ item }) => (
//             <View
//               style={{
//                 alignSelf: item.fromMe ? "flex-end" : "flex-start",
//                 backgroundColor: item.fromMe
//                   ? theme.buttonBg
//                   : theme.inputBg,
//                 padding: bubblePadding,
//                 borderRadius: 10,
//                 marginVertical: 6,
//                 maxWidth: "80%",
//               }}
//             >
//               <Text style={{ fontSize }}>{item.text}</Text>
//             </View>
//           )}
//         />

//         {/* ------------------------
//             🔥 Chat Input Composer
//         -------------------------*/}
//         <Composer
//           onSend={sendMessageToSocket}
//           inputFontSize={fontSize}
//           padding={padding}
//         />
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // --------------------------------------------------
// // 🔥 COMPOSER (Message Input)
// // --------------------------------------------------
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

//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         alignItems: "center",
//         padding,
//         borderTopWidth: 1,
//         borderColor: theme.inputBorder,
//       }}
//     >
//       <TextInput
//         value={text}
//         onChangeText={setText}
//         placeholder="Message..."
//         style={{
//           flex: 1,
//           backgroundColor: theme.inputBg,
//           padding,
//           fontSize: inputFontSize,
//           borderRadius: 8,
//         }}
//       />

//       <TouchableOpacity
//         onPress={() => {
//           if (text.trim()) {
//             onSend(text);
//             setText("");
//           }
//         }}
//         style={{
//           marginLeft: 10,
//           backgroundColor: theme.buttonBg,
//           paddingHorizontal: 16,
//           paddingVertical: 10,
//           borderRadius: 8,
//         }}
//       >
//         <Text style={{ color: theme.buttonText }}>Send</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }


