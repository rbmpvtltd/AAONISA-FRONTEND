import { useAppTheme } from "@/src/constants/themeHelper";
import { usePhotoStore } from "@/src/store/useFeedStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// Get window dimensions
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const CommentPage = () => {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const theme = useAppTheme(); 

  const photos = usePhotoStore((state) => state.photos);
  const setPhotos = usePhotoStore((state) => state.setPhotos);

  const photo = photos.find((p) => p.id === Number(id));
  const [comment, setComment] = useState("");

  if (!photo) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text, textAlign: "center", marginTop: 20 }}>
          Photo not found!
        </Text>
      </View>
    );
  }

  const handleAddComment = () => {
    if (comment.trim() === "") return;

    const updatedComments = [...photo.comments, comment];

    setPhotos((prev) =>
      prev.map((p) => (p.id === photo.id ? { ...p, comments: updatedComments } : p))
    );

    setComment("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.inputBorder }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={windowWidth * 0.06} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text, fontSize: windowWidth * 0.045 }]}>
            Comments
          </Text>
        </View>

        {/* Comment List */}
        <FlatList
          data={photo.comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.commentItem, { paddingVertical: windowHeight * 0.015 }]}>
              <Icon name="person-circle-outline" size={windowWidth * 0.08} color={theme.text} />
              <Text style={[styles.commentText, { color: theme.text, fontSize: windowWidth * 0.04 }]}>
                {item}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.text, fontSize: windowWidth * 0.04 }]}>
              No comments yet.
            </Text>
          }
        />

        {/* Input */}
        <View style={[styles.inputRow, { borderTopColor: theme.inputBorder, paddingVertical: windowHeight * 0.015 }]}>
          <TextInput
            placeholder="Add a comment..."
            placeholderTextColor={theme.placeholder}
            style={[
              styles.input,
              {
                color: theme.text,
                backgroundColor: theme.inputBg,
                fontSize: windowWidth * 0.04,
                paddingHorizontal: windowWidth * 0.03,
              },
            ]}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity onPress={handleAddComment}>
            <Icon name="send" size={windowWidth * 0.06} color={theme.buttonBg} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommentPage;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: windowWidth * 0.04,
    borderBottomWidth: 1,
  },
  headerTitle: { fontWeight: "600", marginLeft: windowWidth * 0.03 },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: windowWidth * 0.04,
    borderBottomWidth: 0.3,
    borderBottomColor: "#ccc",
      flex: 1,
  },
  commentText: { marginLeft: windowWidth * 0.03, flexShrink: 1, },
  emptyText: { textAlign: "center", marginTop: windowHeight * 0.02 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: windowWidth * 0.04,
    borderTopWidth: 1,
  },
  input: { flex: 1,borderRadius: 5, paddingHorizontal: windowWidth * 0.03, fontSize: windowWidth * 0.04,},
});
