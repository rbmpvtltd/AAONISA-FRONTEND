import { useAppTheme } from '@/src/constants/themeHelper';
import { useChatStore } from '@/src/store/useChatStore';
import { ChatSummary } from '@/src/types/chatType';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

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
}: {
  chat: ChatSummary;
  onPress: () => void;
  theme: ReturnType<typeof useAppTheme>;
  avatarSize: number;
}) {
  return (
    <TouchableOpacity
      style={[styles.chatRow, { borderBottomColor: theme.inputBorder }]}
      onPress={onPress}
    >
      <Avatar avatar={chat.avatar} size={avatarSize} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.chatName, { color: theme.text }]}>{chat.name}</Text>
        <Text numberOfLines={1} style={[styles.chatLastMsg, { color: theme.subtitle }]}>
          {chat.lastMessage}
        </Text>
      </View>
      {chat.unread ? (
        <View style={[styles.unreadBadge, { backgroundColor: theme.buttonBg }]}>
          <Text style={{ color: theme.buttonText, fontWeight: '600' }}>{chat.unread}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export default function ChatListScreen() {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const { chats } = useChatStore(); 
  const avatarSize = width > 400 ? 60 : 50;
  const headerFontSize = width > 400 ? 24 : 20;
  const padding = width > 400 ? 20 : 16;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text
        style={[
          styles.header,
          { fontSize: headerFontSize, color: theme.text, paddingHorizontal: padding },
        ]}
      >
        Chats
      </Text>

      <FlatList
        data={chats}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ChatRow
            chat={item}
            theme={theme}
            avatarSize={avatarSize}
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
        contentContainerStyle={{ paddingHorizontal: padding }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  chatName: { fontWeight: '600', fontSize: 16 },
  chatLastMsg: { marginTop: 4, fontSize: 14 },
  unreadBadge: {
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
