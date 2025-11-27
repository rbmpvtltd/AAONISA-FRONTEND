import { chatSessionId, getSessionMessages } from '@/src/api/chat-api';
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
          // socket.emit('getPreviousMessages', { roomId });
          socket.emit("getPreviousMessages", {
            user1Id: CURRENT_USER_ID,
            user2Id: chatUserId
          });

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

    // Received previousMessages handler function
    const handlePreviousMessages = async (payload: { sessionId: number; messages?: any[] }) => {
      try {
        console.log("📥 Received previousMessages:", payload);

        const myId = currentUserIdRef.current;
        if (!myId || !chatUserId) return;

        // 1: Use socket messages
        if (payload.messages && Array.isArray(payload.messages)) {
          payload.messages.forEach((msg: any) => {
            addMessage(chatUserId, {
              id: String(msg.chat_id || msg.message_id),
              text: msg.message_text || msg.text,
              fromMe: msg.sender_id === myId || msg.sender?.id === myId,
              createdAt: new Date(msg.created_at || msg.createdAt).getTime(),
            });
          });
        }

        // 2: Fetch from API
        else {
          const data = await getSessionMessages(String(payload.sessionId));
          console.log("📥 Loaded from API:", data.length, "messages");

          data.forEach((msg: any) => {
            addMessage(chatUserId, {
              id: String(msg.chat_id || msg.message_id),
              text: msg.message_text,
              fromMe: msg.sender_id === myId || msg.sender?.id === myId,
              createdAt: new Date(msg.created_at).getTime(),
            });
          });
        }

        setTimeout(() => {
          flatRef.current?.scrollToEnd({ animated: false });
        }, 100);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

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
      socket.off('previousMessages', handlePreviousMessages)
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