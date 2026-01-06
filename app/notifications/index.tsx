import { useAppTheme } from "@/src/constants/themeHelper";
import { getTimeAgo } from "@/src/hooks/ReelsUploadTime";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { getUserNotifications } from "../../src/api/auth-api";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getUserNotifications,
    staleTime: 1000 * 60,
  });
};


const DEFAULT_AVATAR = "https://via.placeholder.com/150";

const NotificationItem = ({ item, theme, width }: any) => {
  const getActionText = () => {
    switch (item.type) {
      case "LIKE":
        return "liked your post";
      case "COMMENT":
        return "commented on your post";
      case "FOLLOW":
        return "started following you";
      case "MENTION":
        return "mentioned you";
      case "MESSAGE":
        return "sent you a message";
      default:
        return "interacted with you";
    }
  };

  const handleRedirect = () => {
    switch (item.type) {
      case "LIKE":
      case "COMMENT":
        router.push({
          pathname: "/(drawer)/(tabs)/reels",
          params: {
            // username: item.sender?.username,
            // id: item.id,
            videoId: item.referenceId, // Video/Reel ID
            id: item.referenceId,      // Same as videoId
            // tab: "explore",    
          },
        });
        break;

      // case "FOLLOW":
      //     router.push({
      //       pathname: "/profile/[username]",
      //       params: {
      //         username: item.sender.username,
      //       },
      //     });
      //   break;
      case "FOLLOW":
        const username = item.sender?.username || item.sender?.name?.toLowerCase().replace(/\s+/g, '');
        if (username) {
          router.push(`/profile/${username}`);
        } else {
          console.error("No username found:", item.sender);
        }
        break;

      // case "MESSAGE":
      //   router.push({
      //     pathname: "/chat/[id]",
      //     params: {
      //       username : item.sender?.username,
      //       id: item.sender?.id,
      //     },
      //   });
      //   break;

      case "MENTION":
        router.push({
          pathname: "/(drawer)/(tabs)/reels",
          params: {
            videoId: item.referenceId,
            id: item.referenceId,
          },
        });
        break;

      default:
        router.push("/notifications");
    }
  };

  const avatarSize = width * 0.13;
  const fontSize = width * 0.04;

  return (
    <Pressable onPress={handleRedirect}
      style={[
        styles.container,
        {
          borderBottomColor: theme.inputBorder,
          paddingVertical: width * 0.03,
          paddingHorizontal: width * 0.04,
          backgroundColor: !item.isRead ? theme.primaryOpacity : theme.background,
        },
      ]}
    >
      <Image
        source={{ uri: item.sender?.profilePicture || DEFAULT_AVATAR }}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          marginRight: 10,
        }}
      />

      <View style={styles.content}>
        <Text style={{ color: theme.text, fontSize }}>
          <Text style={{ fontWeight: "bold" }}>
            {item.sender?.name || "Unknown User"}
          </Text>{" "}
          {getActionText()}
        </Text>
        <Text style={{ color: "#ccc", fontSize: 12, marginTop: 4 }}>
          {getTimeAgo(item.createdAt)}
        </Text>

      </View>
    </Pressable>
  );
};

const NotificationList = () => {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();

  const { data, isLoading, isError, refetch } = useNotifications();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.subtitle }}>Failed to load notifications</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem item={item} theme={theme} width={width} />
        )}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: theme.subtitle, marginTop: 20 }}>
            No notifications yet
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default NotificationList;

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flexDirection: "row", borderBottomWidth: 1, alignItems: "center" },
  avatar: { marginRight: 10, backgroundColor: "#ccc" },
  content: { flex: 1, justifyContent: "center" },
  bold: { fontWeight: "bold" },
  time: { marginTop: 4 },
});