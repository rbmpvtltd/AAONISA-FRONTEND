// import { getUserSessionsWithLatestMessage } from "@/src/api/chat-api";
// import { useAppTheme } from "@/src/constants/themeHelper";
// import { ChatSummary } from "@/src/types/chatType";
// import { useQuery } from "@tanstack/react-query";
// import { router, useLocalSearchParams } from "expo-router";

// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useWindowDimensions,
//   View,
// } from "react-native";

// function Avatar({ avatar, size }: { avatar?: string; size: number }) {
//   return (
//     <Image
//       source={{ uri: avatar || "https://via.placeholder.com/150" }}
//       style={{
//         width: size,
//         height: size,
//         borderRadius: size / 2,
//         backgroundColor: "#ccc",
//       }}
//     />
//   );
// }

// function ChatRow({
//   chat,
//   onPress,
//   theme,
//   avatarSize,
//   nameFontSize,
//   msgFontSize,
// }: {
//   chat: ChatSummary;
//   onPress: () => void;
//   theme: ReturnType<typeof useAppTheme>;
//   avatarSize: number;
//   nameFontSize: number;
//   msgFontSize: number;
// }) {
//   return (
//     <TouchableOpacity
//       style={[styles.chatRow, { borderBottomColor: theme.inputBorder }]}
//       onPress={onPress}
//       activeOpacity={0.7}
//     >
//       <Avatar avatar={chat.avatar} size={avatarSize} />

//       <View style={{ flex: 1, marginLeft: 12 }}>
//         <Text style={[styles.chatName, { color: theme.text, fontSize: nameFontSize }]}>
//           {chat.name}
//         </Text>
//         <Text
//           numberOfLines={1}
//           style={[styles.chatLastMsg, { color: theme.subtitle, fontSize: msgFontSize }]}
//         >
//           {chat.lastMessage}
//         </Text>
//       </View>

//       {chat.unread ? (
//         <View style={[styles.unreadBadge, { backgroundColor: theme.buttonBg }]}>
//           <Text style={{ color: theme.buttonText, fontWeight: "600", fontSize: msgFontSize - 2 }}>
//             {chat.unread}
//           </Text>
//         </View>
//       ) : null}
//     </TouchableOpacity>
//   );
// }

// export default function ChatListScreen() {
//   const theme = useAppTheme();
//   const { width } = useWindowDimensions();
//   // const { reelId } = useLocalSearchParams();
//   const params = useLocalSearchParams();
// const shareMode = params.shareMode === "true";
// const reelId = params.reelId;



//   // Backend already filters by logged-in user and returns "otherUser"
//   const { data: sessions, isLoading, isError } = useQuery({
//     queryKey: ["sessions"],
//     queryFn: () => getUserSessionsWithLatestMessage(),
//   });

//   const avatarSize = width < 360 ? 44 : width < 400 ? 50 : 60;
//   const nameFontSize = width < 360 ? 14 : width < 400 ? 15 : 16;
//   const msgFontSize = width < 360 ? 12 : width < 400 ? 13 : 14;
//   const padding = width < 360 ? 12 : width < 400 ? 16 : 20;

//   // if (isLoading)
//   //   return <Text style={{ color: theme.text, marginTop: 20, textAlign: "center" }}>Loading...</Text>;

//   if (isLoading)
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <ActivityIndicator size="large" color={theme.text} />
//       <Text style={{ color: theme.text, marginTop: 10 }}>Loading...</Text>
//     </View>
//   );


//   if (isError)
//     return (
//       <Text style={{ color: "red", marginTop: 20, textAlign: "center" }}>
//         Failed to load chat list
//       </Text>
//     );

//   // FORMAT DATA - Backend already gives us the "otherUser"
//   const chatList: ChatSummary[] = sessions?.map((session: any) => ({
//     id: session.otherUser.id,
//     name: session.otherUser.username,
//     avatar: session.otherUser.profilePicture,
//     lastMessage: session.latestMessage?.text || "Start chatting...",
//     unread: 0,
//     sessionId: session.sessionId,
//   })) || [];

//   if (chatList.length === 0) {
//     return (
//       <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ color: theme.subtitle, fontSize: 16 }}>No chats yet</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <FlatList
//         data={chatList}
//         keyExtractor={(item) => item.sessionId}
//         renderItem={({ item }) => (
//           <ChatRow
//             chat={item}
//             theme={theme}
//             avatarSize={avatarSize}
//             nameFontSize={nameFontSize}
//             msgFontSize={msgFontSize}
//             onPress={() =>
//               router.push({
//                 pathname: "/chat/[id]",
//                 params: {
//                   id: item.id,
//                   sessionId: item.sessionId,
//                     reelId: reelId, 
//                 },
//               })
//             }
//           />
//         )}
//         ItemSeparatorComponent={() => (
//           <View style={{ height: 1, backgroundColor: theme.inputBorder, opacity: 0.3 }} />
//         )}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: padding, paddingBottom: 20 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   chatRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 0.5,
//   },
//   chatName: { fontWeight: "600" },
//   chatLastMsg: { marginTop: 4 },
//   unreadBadge: {
//     borderRadius: 50,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
// });

// ==========================================================================

import { getUserSessionsWithLatestMessage, sendReelToChats } from "@/src/api/chat-api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { ChatSummary } from "@/src/types/chatType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

function Avatar({ avatar, size }: { avatar?: string; size: number }) {
  return (
    <Image
      source={{ uri: avatar || "https://via.placeholder.com/150" }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#ccc",
      }}
    />
  );
}

interface ChatRowProps {
  chat: ChatSummary;
  onPress: () => void;
  theme: ReturnType<typeof useAppTheme>;
  avatarSize: number;
  nameFontSize: number;
  msgFontSize: number;
  shareMode: boolean;
  selected: boolean;
}


function ChatRow({
  chat,
  onPress,
  theme,
  avatarSize,
  nameFontSize,
  msgFontSize,
  shareMode,
  selected,
}: ChatRowProps) {
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
          <Text style={{ color: theme.buttonText, fontWeight: "600", fontSize: msgFontSize - 2 }}>
            {chat.unread}
          </Text>
        </View>
      ) : null}


      {/* WhatsApp-style check box */}
      {shareMode && (
        <TouchableOpacity onPress={onPress} style={{ marginRight: 12 }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: theme.text,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: selected ? theme.buttonBg : "transparent",
            }}
          >
            {selected && (
              <Text style={{ color: theme.buttonText, fontSize: 14 }}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

export default function ChatListScreen() {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  // const { reelId } = useLocalSearchParams();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();

  const shareMode = params.shareMode === "true";
  const reelId = params.reelId;
  const [selectedChats, setSelectedChats] = useState<string[]>([]);

  // Backend already filters by logged-in user and returns "otherUser"
  const { data: sessions, isLoading, isError, refetch,
    isRefetching, } = useQuery({
      queryKey: ["sessions"],
      queryFn: () => getUserSessionsWithLatestMessage(),
    });


  console.log("dataaaaaaaa", sessions);


  const avatarSize = width < 360 ? 44 : width < 400 ? 50 : 60;
  const nameFontSize = width < 360 ? 14 : width < 400 ? 15 : 16;
  const msgFontSize = width < 360 ? 12 : width < 400 ? 13 : 14;
  const padding = width < 360 ? 12 : width < 400 ? 16 : 20;


  const getLastMessagePreview = (latest: any) => {
    if (!latest) return "Start chatting...";

    let msg = latest;

    //  JSON STRING → OBJECT
    if (typeof latest === "string") {
      try {
        msg = JSON.parse(latest);
      } catch {
        return latest; // normal text
      }
    }

    //  REELS (NEW + OLD both)
    if (msg.type === "reels" || msg.type === "reel") {
      return "📹 Send Reel";
    }

    if (msg.type === "news") {
      return "📹 Send News";
    }

    // Normal text
    if (typeof msg.text === "string") {
      return msg.text;
    }

    return "New message";
  };


  // FORMAT DATA - Backend already gives us the "otherUser"
  // const chatList: ChatSummary[] = sessions?.map((session: any) => ({
  //   id: session.otherUser.id,
  //   name: session.otherUser.username,
  //   avatar: session.otherUser.profilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  //   lastMessage: session.latestMessage?.text || "Start chatting...",
  //   unread: 0,
  //   sessionId: session.sessionId,
  // })) || [];

  const sortedSessions = [...(sessions || [])].sort(
    (a: any, b: any) => {
      const timeA = new Date(a.latestMessage?.createdAt || a.createdAt).getTime();
      const timeB = new Date(b.latestMessage?.createdAt || b.createdAt).getTime();
      return timeB - timeA;
    }
  );

  const chatList: ChatSummary[] =
    sortedSessions.map((session: any) => {
      const latest = session.latestMessage;

      return {
        id: session.otherUser.id,
        name: session.otherUser.username,
        avatar:
          session.otherUser.profilePicture ||
          "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        lastMessage: getLastMessagePreview(latest?.text),
        unread: 0,
        sessionId: session.sessionId,
      };
    }) || [];

  const toggleSelect = (sessionId: string): void => {
    setSelectedChats((prev: string[]) =>
      prev.includes(sessionId)
        ? prev.filter((id: string) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  // const handleSend = async () => {
  //   if (!reelId) return;

  //   try {
  //     // Replace with your API to send reel to selected sessions
  //     await sendReelToChats(
  //       reelId as string,
  //       selectedChats,
  //     );
  //     alert("Reel sent successfully!");
  //     router.back();
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to send reel");
  //   }

  // };

  const sendReelToChatsMutation = useMutation({
    mutationFn: (data: any) => sendReelToChats(data.reelId, data.sessionIds),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-videos-feed"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["reels"] });

      Toast.show({
        type: "success",
        text1: "Reel sent successfully!",
      });

      router.back();
    }
  });

  const handleSend = async () => {
    if (!reelId) return;
    sendReelToChatsMutation.mutate({
      reelId: reelId as string,
      sessionIds: selectedChats
    })
  };



  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.text} />
        <Text style={{ color: theme.text, marginTop: 10 }}>Loading...</Text>
      </View>
    );


  if (isError)
    return (
      <Text style={{ color: "red", marginTop: 20, textAlign: "center" }}>
        Failed to load chat list
      </Text>
    );

  if (chatList.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.subtitle, fontSize: 16 }}>No chats yet</Text>
      </View>
    );

  }
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={chatList}
        keyExtractor={(item: ChatSummary) => item.sessionId}
        renderItem={({ item }: { item: ChatSummary }) => (
          <ChatRow
            chat={item}
            theme={theme}
            avatarSize={avatarSize}
            nameFontSize={nameFontSize}
            msgFontSize={msgFontSize}
            shareMode={shareMode}
            selected={selectedChats.includes(item.sessionId)}

            onPress={() => {
              if (shareMode) {
                toggleSelect(item.sessionId);
              } else {
                router.push({
                  pathname: "/chat/[id]",
                  params: {
                    id: item.id,
                    sessionId: item.sessionId,
                    username: item.name,
                    avatar: item.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                    reelId,
                  },
                });
              }
            }}
          />
        )}
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        updateCellsBatchingPeriod={50}
        getItemLayout={(_, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}

        refreshing={isRefetching}
        onRefresh={refetch}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: theme.inputBorder, opacity: 0.3 }} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: padding, paddingBottom: 20 }}
      />
      {shareMode && selectedChats.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            backgroundColor: theme.background,
            borderTopWidth: 1,
            borderTopColor: theme.inputBorder,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: theme.buttonBg,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={handleSend}
          >
            <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: "600" }}>
              Send ({selectedChats.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  chatName: { fontWeight: "600" },
  chatLastMsg: { marginTop: 4 },
  unreadBadge: {
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});