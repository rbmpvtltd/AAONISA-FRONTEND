import { useAppTheme } from "@/src/constants/themeHelper";
import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Notification as NotificationType, useNotificationStore } from "../../src/store/useNotificationStore";

const DEFAULT_AVATAR = "https://via.placeholder.com/150";

const NotificationItem: React.FC<{ item: NotificationType; theme: any; width: number }> = ({
  item,
  theme,
  width,
}) => {
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

  const avatarSize = width * 0.13;
  const fontSize = width * 0.04;

  return (
    <View
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
        style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
        defaultSource={{ uri: DEFAULT_AVATAR }}
      />

      <View style={styles.content}>
        <Text style={{ color: theme.text, fontSize }}>
          <Text style={[styles.bold, { fontSize }]}>{item.sender?.name || "Unknown User"}</Text>{" "}
          {getActionText()}
        </Text>
        <Text style={[styles.time, { color: theme.subtitle, fontSize: fontSize * 0.8 }]}>
          {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : "Just now"}
        </Text>
      </View>
    </View>
  );
};


const NotificationList = () => {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <SafeAreaView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} theme={theme} width={width} />}
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <Text style={{ color: theme.subtitle, textAlign: "center" }}>
              No notifications yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  container: { flexDirection: "row", borderBottomWidth: 1, alignItems: "center" },
  avatar: { marginRight: 10, backgroundColor: "#ccc" },
  content: { flex: 1, justifyContent: "center" },
  bold: { fontWeight: "bold" },
  time: { marginTop: 4 },
});

export default NotificationList;
