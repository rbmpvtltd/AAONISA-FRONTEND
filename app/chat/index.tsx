import { getAllUsers } from '@/src/api/chat-api';
import { useAppTheme } from '@/src/constants/themeHelper';
import { ChatSummary } from '@/src/types/chatType';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
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
  const { width } = useWindowDimensions();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => getAllUsers(),
  });

  console.log("All users:", data);
  
  
  const avatarSize = width < 360 ? 44 : width < 400 ? 50 : 60;
  const nameFontSize = width < 360 ? 14 : width < 400 ? 15 : 16;
  const msgFontSize = width < 360 ? 12 : width < 400 ? 13 : 14;
  const padding = width < 360 ? 12 : width < 400 ? 16 : 20;

  if (isLoading)
    return <Text style={{ color: theme.text, marginTop: 20, textAlign: "center" }}>Loading...</Text>;

  if (isError)
    return (
      <Text style={{ color: "red", marginTop: 20, textAlign: "center" }}>
        Failed to load users
      </Text>
    );

  // STEP: Convert API format → ChatSummary format
  const chatList = data?.map((u: any) => ({
    id: u.id,
    name: u.userProfile?.name || u.username,
    avatar: u.userProfile?.ProfilePicture,
    lastMessage: "Start chatting...", // default msg
    unread: 0, // default
  }));

  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={chatList}
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
                pathname: "/chat/[id]",
                params: {
                  id: item.id,
                },
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

