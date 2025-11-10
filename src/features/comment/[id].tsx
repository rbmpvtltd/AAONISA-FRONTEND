import { useAppTheme } from "@/src/constants/themeHelper";
import { useCommentStore } from "@/src/store/useCommentStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const { width: windowWidth } = Dimensions.get("window");

const CommentPage = () => {
  const { id } = useLocalSearchParams(); // photoId
  const theme = useAppTheme();
  const { comments, addComment, deleteComment, setComments } = useCommentStore();
  const [commentText, setCommentText] = useState("");

  const postId = Number(id) || 1; // fallback id = 1
  const photoComments = comments[postId] || [];

  // 🧠 Dummy comments when nothing exists in store
  useEffect(() => {
    // if (!comments[postId] || comments[postId].length === 0) {
    //   setComments(postId, [
    //     {
    //       uuid: "c1",
    //       username: "john_doe",
    //       content: "Awesome photo! 🔥",
    //       userProfile:
    //         "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    //       time: "2h ago",
    //       replyCount: 1,
    //       replies: [
    //         {
    //           uuid: "r1",
    //           parentId: "c1",
    //           username: "alice",
    //           content: "Agree! Stunning shot 📸",
    //           userProfile:
    //             "https://randomuser.me/api/portraits/women/44.jpg",
    //           time: "1h ago",
    //         },
    //       ],
    //     },
    //     {
    //       uuid: "c2",
    //       username: "michael",
    //       content: "What camera did you use?",
    //       userProfile:
    //         "https://randomuser.me/api/portraits/men/45.jpg",
    //       time: "30m ago",
    //       replyCount: 0,
    //       replies: [],
    //     },
    //   ]);
    // }
  }, []);

  const handleAddComment = () => {
    if (commentText.trim() === "") return;

    const newComment = {
      uuid: Date.now().toString(),
      username: "you",
      content: commentText,
      userProfile:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      time: "Just now",
      replyCount: 0,
      replies: [],
    };

    addComment(postId, newComment);
    setCommentText("");
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert("Delete Comment", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteComment(postId, commentId),
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {/* Comment List */}
        <FlatList
          data={photoComments}
          keyExtractor={(item) => item.uuid}
          contentContainerStyle={{ paddingBottom: 10 }}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Image
                source={{ uri: item.userProfile }}
                style={styles.profilePic}
              />

              <View style={{ flex: 1 }}>
                <Text style={[styles.commentUsername, { color: theme.text }]}>
                  {item.username}{" "}
                  <Text style={[styles.commentText, { color: theme.subtitle }]}>
                    {item.content}
                  </Text>
                </Text>

                <View style={styles.commentMeta}>
                  <Text style={[styles.commentTime, { color: theme.subtitle }]}>
                    {item.time}
                  </Text>

                  <TouchableOpacity>
                    <Text
                      style={[styles.replyText, { color: theme.placeholder }]}
                    >
                      Reply
                    </Text>
                  </TouchableOpacity>

                  {item.username === "you" && (
                    <TouchableOpacity
                      onPress={() => handleDeleteComment(item.uuid)}
                    >
                      <Text
                        style={[styles.deleteText, { color: theme.buttonBg }]}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Show replies (if any) */}
                {item.replies && item.replies.length > 0 && (
                  <View style={{ marginTop: 8, paddingLeft: 40 }}>
                    {item.replies.map((reply) => (
                      <View
                        key={reply.uuid}
                        style={{ flexDirection: "row", marginBottom: 5 }}
                      >
                        <Image
                          source={{ uri: reply.userProfile }}
                          style={styles.replyProfilePic}
                        />
                        <Text
                          style={[
                            styles.commentUsername,
                            { color: theme.text },
                          ]}
                        >
                          {reply.username}{" "}
                          <Text
                            style={[styles.commentText, { color: theme.subtitle }]}
                          >
                            {reply.content}
                          </Text>
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <TouchableOpacity>
                <Icon
                  name="heart-outline"
                  size={windowWidth * 0.05}
                  color={theme.text}
                />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text
              style={[
                styles.emptyText,
                { color: theme.placeholder, fontSize: windowWidth * 0.04 },
              ]}
            >
              No comments yet. Be the first to comment!
            </Text>
          }
        />

        {/* Input Row */}
        <View
          style={[
            styles.inputRow,
            {
              borderTopColor: theme.inputBorder,
              backgroundColor: theme.background,
            },
          ]}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
            }}
            style={styles.commentProfilePic}
          />

          <TextInput
            placeholder="Add a comment..."
            placeholderTextColor={theme.placeholder}
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.inputBg },
            ]}
            value={commentText}
            onChangeText={setCommentText}
          />

          <TouchableOpacity onPress={handleAddComment}>
            <Text
              style={[
                styles.postButton,
                {
                  color:
                    commentText.trim() === ""
                      ? theme.placeholder
                      : theme.buttonBg,
                },
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CommentPage;

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  profilePic: { width: 35, height: 35, borderRadius: 50 },
  replyProfilePic: {
    width: 25,
    height: 25,
    borderRadius: 50,
    marginRight: 8,
  },
  commentUsername: { fontWeight: "600", fontSize: 14 },
  commentText: { fontWeight: "400" },
  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 3,
  },
  commentTime: { fontSize: 12 },
  replyText: { fontSize: 12 },
  deleteText: { fontSize: 12, fontWeight: "600" },
  emptyText: { textAlign: "center", marginTop: 30 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  commentProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    fontSize: 14,
  },
  postButton: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
});
