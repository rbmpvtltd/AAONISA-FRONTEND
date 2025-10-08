import { useAppTheme } from '@/src/constants/themeHelper';
import { useChatStore } from '@/src/store/useChatStore';
import { ChatSummary } from '@/src/types/chatType';
import { router, Stack } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

function Avatar({ avatar, size }: { avatar?: string; size: number }) {
  return (
    <Image
      source={{ uri: avatar || 'https://via.placeholder.com/150' }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#ccc',
      }}
    />
  );
}

function ChatRow({
  chat,
  onPress,
  theme,
  avatarSize,
  nameFontSize,
  msgFontSize,
}: {
  chat: ChatSummary;
  onPress: () => void;
  theme: ReturnType<typeof useAppTheme>;
  avatarSize: number;
  nameFontSize: number;
  msgFontSize: number;
}) {
  return (
    <TouchableOpacity
      style={[styles.chatRow, { borderBottomColor: theme.inputBorder }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Avatar avatar={chat.avatar} size={avatarSize} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.chatName, { color: theme.text, fontSize: nameFontSize }]}>
          {chat.name}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.chatLastMsg, { color: theme.subtitle, fontSize: msgFontSize }]}
        >
          {chat.lastMessage}
        </Text>
      </View>
      {chat.unread ? (
        <View style={[styles.unreadBadge, { backgroundColor: theme.buttonBg }]}>
          <Text style={{ color: theme.buttonText, fontWeight: '600', fontSize: msgFontSize - 2 }}>
            {chat.unread}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export default function ChatListScreen() {
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();
  const { chats } = useChatStore();

  // Responsive sizing logic
  const avatarSize = width < 360 ? 44 : width < 400 ? 50 : 60;
  const headerFontSize = width < 360 ? 18 : width < 400 ? 20 : 24;
  const nameFontSize = width < 360 ? 14 : width < 400 ? 15 : 16;
  const msgFontSize = width < 360 ? 12 : width < 400 ? 13 : 14;
  const padding = width < 360 ? 12 : width < 400 ? 16 : 20;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* <Text
        style={[
          styles.header,
          { fontSize: headerFontSize, color: theme.text, paddingHorizontal: padding },
        ]}
      >
        Chats
      </Text> */}

         <Stack.Screen name="chat" options={{ title: "Chats" }} />


      <FlatList
        data={chats}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ChatRow
            chat={item}
            theme={theme}
            avatarSize={avatarSize}
            nameFontSize={nameFontSize}
            msgFontSize={msgFontSize}
            onPress={() =>
              router.push({
                pathname: '/chat/[chatId]',
                params: { chatId: item.id, chatName: item.name },
              })
            }
          />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: theme.inputBorder, opacity: 0.3 }} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: padding, paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // header: {
  //   fontWeight: '700',
  //   marginBottom: 10,
  //   textAlign: 'center',
  // },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  chatName: { fontWeight: '600' },
  chatLastMsg: { marginTop: 4 },
  unreadBadge: {
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});

