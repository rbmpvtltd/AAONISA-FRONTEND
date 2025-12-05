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
import uuid from "react-native-uuid";
import Icon from "react-native-vector-icons/Ionicons";

import {
  addCommentApi,
  deleteCommentApi,
  getCommentsApi,
  likeCommentApi
} from "@/src/api/comments-api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useCommentStore } from "@/src/store/useCommentStore";
const { width: windowWidth } = Dimensions.get("window");

const extractMentions = (text: string): string[] => {
  const regex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  return mentions;
};

const CommentPage = () => {
  const { id } = useLocalSearchParams();
  const postId = id as string;
  const theme = useAppTheme();
  const {
    comments,
    setComments,
    addComment,
    addReply,
    deleteComment,
    toggleLike,
  } = useCommentStore();
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const photoComments = comments[postId] || [];
  const [currentUser, setCurrentUser] = useState({
    id: "",
    username: "you",
    realName: "",
    userProfile: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  });
  useEffect(() => {
  const fetchComments = async () => {
    if (!currentUser.id) return;

    try {
      const response = await getCommentsApi(postId);
      const rawComments = response?.data || [];

      const formattedComments = rawComments.map((c: any) => ({
        uuid: c.id,
        username:
          c.author?.id === currentUser.id
            ? "you"
            : c.author?.username?.trim() || "Unknown",
        userProfile:
          c.author?.userProfile?.url ||
          c.author?.userProfile ||
          "https://via.placeholder.com/150",
        content: c.content,
        time: new Date(c.createdAt).toLocaleTimeString(),
        mentions: c.mentions || [],
        replies: (c.replies || []).map((r: any) => ({
          uuid: r.id,
          username:
            r.author?.id === currentUser.id
              ? "you"
              : r.author?.username?.trim() || "Unknown",
          userProfile:
            r.author?.userProfile?.url ||
            r.author?.userProfile ||
            "https://via.placeholder.com/150",
          content: r.content,
          time: new Date(r.createdAt).toLocaleTimeString(),
          mentions: r.mentions || [],
          likedBy: r.likedBy || [],
        })),
        likedBy: c.likedBy || [],
      }));

      setComments(postId, formattedComments);
    } catch (error) {
      console.error("❌ Error fetching comments:", error);
    }
  };

  fetchComments();
}, [postId, currentUser.id]); // 🔥 re-run when user loads

  

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const data = await GetCurrentUser();
  //       if (data?.id) {
  //         setCurrentUser({
  //           id: data.id,
  //           username: data.username?.trim() || "you",
  //           userProfile:
  //             data.userProfile.ProfilePicture ||
  //             "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  //           realName: data.name,
  //         });
  //       }
  //     } catch (error) {
  //       console.error("❌ Error fetching user:", error);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  const handleAddComment = async () => {

    if (!commentText.trim()) return;
    setLoading(true);

    const mentions = extractMentions(commentText);
    const tempId = uuid.v4().toString();

    const newComment = {
      uuid: tempId,
      parentId: replyTo || null,
      username: currentUser.username,
      userProfile: currentUser.userProfile,
      content: commentText.trim(),
      mentions,
      time: new Date().toLocaleTimeString(),
      replies: [],
      likedBy: [],
      replyCount: 0,
    };

    try {

      const res = await addCommentApi(postId, newComment.content, mentions, replyTo || "");
      const saved = res?.data;
      if (saved) {
        const normalized = {
          uuid: saved.id,
          username: saved.author?.username || "Unknown",
          userProfile:
            saved.author?.userProfile?.url ||
            saved.author?.userProfile ||
            currentUser.userProfile,
          content: saved.content,
          time: new Date(saved.createdAt).toLocaleTimeString(),
          mentions: saved.mentions || [],
          replies: [],
          likedBy: [],
        };

        if (replyTo) {
          addReply(postId, replyTo, normalized);
        } else {
          addComment(postId, normalized);
        }
      }

      setCommentText("");
      setReplyTo(null);
    } catch (err) {
      console.error("❌ Error adding comment:", err);
      Alert.alert("Error", "Failed to add comment. Try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteComment = async (commentId: string, parentId?: string) => {
    Alert.alert("Delete Comment", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCommentApi(commentId);
            deleteComment(postId, commentId);
          } catch (err) {
            console.error("Error deleting comment:", err);
          }
        },
      },
    ]);
  };
  const getProfileUri = (profile: any) => {
    if (!profile) return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    if (typeof profile === "string") return profile || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    return profile.url || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  };

  const handleToggleLike = async (
    commentId: string,
    parentId?: string | null
  ) => {
    try {
      await likeCommentApi(commentId);
      toggleLike(postId, commentId, currentUser.realName, parentId || null);
      // toggleLike(postId, commentId, currentUser.username === "you" ? currentUser.id : currentUser.username, parentId || null);

    } catch (err) {
      console.error("❌ Error liking comment:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={photoComments}
          keyExtractor={(item) => item.uuid}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View>
              <View style={styles.commentContainer}>
                <Image
                  source={{ uri: getProfileUri(item.userProfile) }}
                  style={styles.profilePic}
                />


                <View style={{ flex: 1 }}>
                  <Text style={[styles.commentUsername, { color: theme.text }]}>
                    {item.username}{" "}
                    <Text
                      style={[styles.commentText, { color: theme.subtitle }]}
                    >
                      {item.content}
                    </Text>
                  </Text>

                  <View style={styles.commentMeta}>
                    <Text
                      style={[styles.commentTime, { color: theme.placeholder }]}
                    >
                      {item.time}
                    </Text>

                    <TouchableOpacity onPress={() => setReplyTo(item.uuid)}>
                      <Text
                        style={[styles.replyText, { color: theme.buttonBg }]}
                      >
                        Reply
                      </Text>
                    </TouchableOpacity>

                    {item.username === currentUser.username && (
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

                  {/* Replies */}
                  {item.replies?.length ? (
                    <View style={{ marginTop: 8, paddingLeft: 40 }}>
                      {item.replies.map((reply) => (
                        <View
                          key={reply.uuid}
                          style={{ flexDirection: "row", marginBottom: 5 }}
                        >
                          <Image
                            source={{ uri: getProfileUri(reply.userProfile) }}
                            style={styles.replyProfilePic}
                          />

                          <View style={{ flex: 1 }}>
                            <Text
                              style={[
                                styles.commentUsername,
                                { color: theme.text },
                              ]}
                            >
                              {reply.username}{" "}
                              <Text
                                style={[
                                  styles.commentText,
                                  { color: theme.subtitle },
                                ]}
                              >
                                {reply.content}
                              </Text>
                            </Text>

                            <View style={styles.commentMeta}>
                              <TouchableOpacity
                                onPress={() =>
                                  handleToggleLike(reply.uuid, item.uuid)
                                }
                              >
                                <Icon
                                  name={
                                    reply.likedBy.includes(
                                      currentUser.realName
                                    )
                                      ? "heart"
                                      : "heart-outline"
                                  }
                                  size={16}
                                  color={
                                    reply.likedBy.includes(
                                      currentUser.username
                                    )
                                      ? "red"
                                      : theme.text
                                  }
                                />
                              </TouchableOpacity>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: theme.subtitle,
                                }}
                              >
                                {reply.likedBy.length}
                              </Text>

                              {reply.username === currentUser.username && (
                                <TouchableOpacity
                                  onPress={() =>
                                    handleDeleteComment(reply.uuid, item.uuid)
                                  }
                                >
                                  <Text
                                    style={[
                                      styles.deleteText,
                                      { color: theme.buttonBg },
                                    ]}
                                  >
                                    Delete
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>

                {/* Like Button */}
                <TouchableOpacity
                  onPress={() => handleToggleLike(item.uuid, null)}
                >
                  <Icon
                    name={
                      item.likedBy.includes(currentUser.username)
                        ? "heart"
                        : "heart-outline"
                    }
                    size={windowWidth * 0.05}
                    color={
                      item.likedBy.includes(currentUser.username)
                        ? "red"
                        : theme.text
                    }
                  />
                </TouchableOpacity>
              </View>
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

        {/* Input */}
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
            source={{ uri: currentUser.userProfile }}
            style={styles.commentProfilePic}
          />

          <View style={{ flex: 1, position: "relative" }}>
            <TextInput
              placeholder={
                replyTo ? "Replying to comment..." : "Add a comment..."
              }
              placeholderTextColor={theme.placeholder}
              style={[
                styles.input,
                { color: theme.text, backgroundColor: theme.inputBg, paddingRight: 30 },
              ]}
              value={commentText}
              onChangeText={setCommentText}
            />

            {/* ❌ Cancel Reply Icon inside input (right side) */}
            {replyTo && (
              <TouchableOpacity
                onPress={() => setReplyTo(null)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: [{ translateY: -10 }],
                }}
              >
                <Icon name="close-circle" size={18} color={theme.placeholder} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={handleAddComment}
            disabled={loading || commentText.trim() === ""}
            style={{ marginLeft: 6 }}
          >
            <Text
              style={[
                styles.postButton,
                {
                  color:
                    commentText.trim() === "" || loading
                      ? theme.placeholder
                      : theme.buttonBg,
                },
              ]}
            >
              {loading ? "..." : "Post"}
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
