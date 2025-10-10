import { useAppTheme } from '@/src/constants/themeHelper';
import { useChatStore } from '@/src/store/useChatStore';
import { Message } from '@/src/types/chatType';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useRef } from 'react';
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
  useWindowDimensions,
} from 'react-native';

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
      <View
        style={[
          styles.bubble,
          { backgroundColor: bg, padding: bubblePadding },
        ]}
      >
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

export default function ChatDetailScreen() {
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();
  const route = useRoute<RouteProp<{ params: { chatId: string; chatName?: string } }, 'params'>>();
  const { chatId, chatName } = route.params ?? { chatId: 'u1', chatName: 'User' };

  const {
    messages,
    addMessage,
    selectedMessage,
    setSelectedMessage,
    deleteMessageForMe,
    deleteMessageForEveryone,
  } = useChatStore();
  const flatRef = useRef<FlatList<any>>(null);

  const chatMessages = messages[chatId] ?? [];

  // 🔹 Responsive metrics
  const fontSize = width < 360 ? 13 : width < 400 ? 14 : width < 600 ? 15 : 16;
  const bubblePadding = width < 360 ? 8 : width < 400 ? 10 : 12;
  const padding = width < 360 ? 8 : width < 400 ? 10 : 14;
  const modalWidth = width < 360 ? '85%' : width < 400 ? '80%' : '70%';

  function handleSend(text: string) {
    const newMsg: Message = {
      id: String(Date.now()),
      fromMe: true,
      text,
      createdAt: Date.now(),
    };
    addMessage(chatId, newMsg);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 200);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
   {/* <Stack.Screen name={`${chatId}`} options={{ title: `${chatName}` }} />  */}
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
        <Composer onSend={handleSend} inputFontSize={fontSize} padding={padding} />
      </View>

      <Modal
        visible={!!selectedMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMessage(null)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.background, width: modalWidth }]}>
            <TouchableOpacity
              onPress={() => deleteMessageForMe(chatId, selectedMessage!.id)}
              style={styles.modalBtn}
            >
              <Text style={[styles.modalText, { color: theme.text, fontSize }]}>Delete for Me</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteMessageForEveryone(chatId, selectedMessage!.id)}
              style={styles.modalBtn}
            >
              <Text style={[styles.modalText, { color: theme.text, fontSize }]}>
                Delete for Everyone
              </Text>
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
