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
} from 'react-native';

function MessageBubble({ m, onLongPress }: { m: Message; onLongPress: (msg: Message) => void }) {
  const theme = useAppTheme();
  const align = m.fromMe ? 'flex-end' : 'flex-start';
  const bg = m.fromMe ? theme.buttonBg : theme.inputBg;
  const textColor = m.fromMe ? theme.buttonText : theme.text;

  return (
    <Pressable onLongPress={() => onLongPress(m)} style={{ alignSelf: align, marginVertical: 6, maxWidth: '80%' }}>
      <View style={[styles.bubble, { backgroundColor: bg }]}>
        <Text style={{ color: textColor }}>{m.text}</Text>
      </View>
      <Text style={{ fontSize: 10, color: theme.subtitle, marginTop: 4 }}>
        {new Date(m.createdAt).toLocaleTimeString()}
      </Text>
    </Pressable>
  );
}

function Composer({ onSend }: { onSend: (msg: string) => void }) {
  const theme = useAppTheme();
  const [text, setText] = React.useState('');

  function sendText() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <View style={[styles.composerContainer, { backgroundColor: theme.background, borderColor: theme.inputBorder }]}>
      <View style={styles.composerRow}>
        <TextInput
          placeholder="Message..."
          placeholderTextColor={theme.placeholder}
          value={text}
          onChangeText={setText}
          style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          multiline
        />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: theme.buttonBg }]} onPress={sendText}>
          <Text style={{ color: theme.buttonText }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ChatDetailScreen() {
  const theme = useAppTheme();
  const route = useRoute<RouteProp<{ params: { chatId: string; chatName?: string } }, 'params'>>();
  const { chatId, chatName } = route.params ?? { chatId: 'u1', chatName: 'User' };

  const { messages, addMessage, selectedMessage, setSelectedMessage, deleteMessageForMe, deleteMessageForEveryone } =
    useChatStore();
  const flatRef = useRef<FlatList<any>>(null);

  const chatMessages = messages[chatId] ?? [];

  function handleSend(text: string) {
    const newMsg: Message = { id: String(Date.now()), fromMe: true, text, createdAt: Date.now() };
    addMessage(chatId, newMsg);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 200);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
      <View style={[styles.container, { padding: 12 }]}>
        <FlatList
          ref={flatRef}
          data={chatMessages}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <MessageBubble m={item} onLongPress={(msg) => setSelectedMessage(msg)} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        <Composer onSend={handleSend} />
      </View>

      <Modal visible={!!selectedMessage} transparent animationType="fade" onRequestClose={() => setSelectedMessage(null)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.background }]}>
            <TouchableOpacity onPress={() => deleteMessageForMe(chatId, selectedMessage!.id)} style={styles.modalBtn}>
              <Text style={[styles.modalText, { color: theme.text }]}>Delete for Me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteMessageForEveryone(chatId, selectedMessage!.id)} style={styles.modalBtn}>
              <Text style={[styles.modalText, { color: theme.text }]}>Delete for Everyone</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedMessage(null)} style={styles.modalBtn}>
              <Text style={[styles.modalText, { color: theme.link }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bubble: { padding: 10, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.05, elevation: 1 },
  composerContainer: { paddingTop: 8, paddingBottom: 8, paddingHorizontal: 10, borderTopWidth: 1 },
  composerRow: { flexDirection: 'row', alignItems: 'flex-end' },
  textInput: { flex: 1, minHeight: 40, maxHeight: 120, borderRadius: 8, borderWidth: 1, padding: 8 },
  sendBtn: { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '75%', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 10 },
  modalBtn: { paddingVertical: 12, alignItems: 'center' },
  modalText: { fontSize: 16, fontWeight: '500' },
});
