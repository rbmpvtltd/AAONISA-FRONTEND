// import { useAppTheme } from "@/src/constants/themeHelper";
// import { usePhotoStore } from "@/src/store/useFeedStore";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   Dimensions,
//   FlatList,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";

// const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

// const CommentPage = () => {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const theme = useAppTheme();

//   const photos = usePhotoStore((state) => state.photos);
//   const setPhotos = usePhotoStore((state) => state.setPhotos);

//   const photo = photos.find((p) => p.id === Number(id));
//   const [comment, setComment] = useState("");

//   if (!photo) {
//     return (
//       <View style={[styles.container, { backgroundColor: theme.background }]}>
//         <Text style={{ color: theme.text, textAlign: "center", marginTop: 20 }}>
//           Photo not found!
//         </Text>
//       </View>
//     );
//   }

//   const handleAddComment = () => {
//     if (comment.trim() === "") return;

//     const newComment = {
//       username: "you",
//       text: comment,
//       time: "Just now",
//     };

//     const updatedComments = [...photo.comments, newComment];

//     setPhotos((prev) =>
//       prev.map((p) => (p.id === photo.id ? { ...p, comments: updatedComments } : p))
//     );

//     setComment("");
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: theme.background }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={90}
//     >
//       <View style={[styles.container, { backgroundColor: theme.background }]}>
//         {/* Header */}
//         <View style={[styles.header, { borderBottomColor: theme.inputBorder }]}>
//           <TouchableOpacity onPress={() => router.back()}>
//             <Icon name="arrow-back" size={windowWidth * 0.06} color={theme.text} />
//           </TouchableOpacity>
//           <Text style={[styles.headerTitle, { color: theme.text }]}>Comments</Text>
//         </View>

//         {/* Comment List */}
//         <FlatList
//           data={photo.comments}
//           keyExtractor={(item, index) => index.toString()}
//           contentContainerStyle={{ paddingBottom: 10 }}
//           renderItem={({ item }) => (
//             <View style={styles.commentContainer}>
//               {/* Profile Image */}
//               <Image
//                 source={{
//                   uri:
//                     item.profilePic ||
//                     "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000",
//                 }}
//                 style={styles.profilePic}
//               />

//               {/* Comment Section */}
//               <View style={{ flex: 1 }}>
//                 <Text style={[styles.commentUsername, { color: theme.text }]}>
//                   {item.username || "user_name"}{" "}
//                   <Text
//                     style={[styles.commentText, { color: theme.subtitle }]}
//                   >
//                     {item.text || "Comment"}
//                   </Text>
//                 </Text>

//                 <View style={styles.commentMeta}>
//                   <Text style={[styles.commentTime, { color: theme.subtitle}]}>
//                     {item.time || "1h"}
//                   </Text>
//                   <TouchableOpacity>
//                     <Text
//                       style={[styles.replyText, { color: theme.placeholder}]}
//                     >
//                       Reply
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {/* Heart Icon */}
//               <TouchableOpacity>
//                 <Icon
//                   name="heart-outline"
//                   size={windowWidth * 0.05}
//                   color={theme.text}
//                 />
//               </TouchableOpacity>
//             </View>
//           )}
//           ListEmptyComponent={
//             <Text
//               style={[
//                 styles.emptyText,
//                 { color: theme.placeholder, fontSize: windowWidth * 0.04 },
//               ]}
//             >
//               No comments yet. Be the first to comment!
//             </Text>
//           }
//         />

//         {/* Input Bar */}
//         <View
//           style={[
//             styles.inputRow,
//             {
//               borderTopColor: theme.inputBorder,
//               backgroundColor: theme.background,
//             },
//           ]}
//         >
//           <Image
//             source={{
//               uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000",
//             }}
//             style={styles.commentProfilePic}
//           />

//           <TextInput
//             placeholder="Add a comment..."
//             placeholderTextColor={theme.placeholder}
//             style={[
//               styles.input,
//               {
//                 color: theme.text,
//                 backgroundColor: theme.inputBg,
//               },
//             ]}
//             value={comment}
//             onChangeText={setComment}
//           />

//           <TouchableOpacity onPress={handleAddComment}>
//             <Text
//               style={[
//                 styles.postButton,
//                 {
//                   color:
//                     comment.trim() === ""
//                       ? theme.placeholder
//                       : theme.buttonBg,
//                 },
//               ]}
//             >
//               Post
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default CommentPage;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     borderBottomWidth: 1,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginLeft: 15,
//   },
//   commentContainer: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     gap: 10,
//   },
//   profilePic: {
//     width: 35,
//     height: 35,
//     borderRadius: 50,
//   },
//   commentUsername: {
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   commentText: {
//     fontWeight: "400",
//   },
//   commentMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 15,
//     marginTop: 3,
//   },
//   commentTime: {
//     fontSize: 12,
//   },
//   replyText: {
//     fontSize: 12,
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: 30,
//   },
//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     borderTopWidth: 1,
//     paddingVertical: 8,
//   },
//   commentProfilePic: {
//     width: 30,
//     height: 30,
//     borderRadius: 50,
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 6,
//     fontSize: 14,
//   },
//   postButton: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginLeft: 10,
//   },
// });


// =======================================================

import { useAppTheme } from "@/src/constants/themeHelper";
import { usePhotoStore } from "@/src/store/useFeedStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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
import Icon from "react-native-vector-icons/Ionicons";

const { width: windowWidth } = Dimensions.get("window");

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

    const newComment = {
      username: "you",
      text: comment,
      time: "Just now",
      profilePic:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      id: Date.now(), 
    };

    const updatedComments = [...photo.comments, newComment];

    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photo.id ? { ...p, comments: updatedComments } : p
      )
    );

    setComment("");
  };

  const handleDeleteComment = (commentId: number) => {
    Alert.alert("Delete Comment", "Are you sure you want to delete this comment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedComments = photo.comments.filter(
            (c: any) => c.id !== commentId
          );

          setPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id ? { ...p, comments: updatedComments } : p
            )
          );
        },
      },
    ]);
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
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Comments
          </Text>
        </View>

        {/* Comment List */}
        <FlatList
          data={photo.comments}
          keyExtractor={(item: any) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          contentContainerStyle={{ paddingBottom: 10 }}
          renderItem={({ item }: any) => (
            <View style={styles.commentContainer}>
              <Image
                source={{
                  uri:
                    item.profilePic ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
                }}
                style={styles.profilePic}
              />

              <View style={{ flex: 1 }}>
                <Text style={[styles.commentUsername, { color: theme.text }]}>
                  {item.username}{" "}
                  <Text style={[styles.commentText, { color: theme.subtitle }]}>
                    {item.text}
                  </Text>
                </Text>

                <View style={styles.commentMeta}>
                  <Text style={[styles.commentTime, { color: theme.subtitle }]}>
                    {item.time}
                  </Text>

                  <TouchableOpacity>
                    <Text style={[styles.replyText, { color: theme.placeholder }]}>
                      Reply
                    </Text>
                  </TouchableOpacity>

                  {item.username === "you" && (
                    <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                      <Text
                        style={[styles.deleteText, { color: theme.buttonBg }]}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
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
              {
                color: theme.text,
                backgroundColor: theme.inputBg,
              },
            ]}
            value={comment}
            onChangeText={setComment}
          />

          <TouchableOpacity onPress={handleAddComment}>
            <Text
              style={[
                styles.postButton,
                {
                  color:
                    comment.trim() === "" ? theme.placeholder : theme.buttonBg,
                },
              ]}
            >
              Post
            </Text>
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
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", marginLeft: 15 },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  profilePic: { width: 35, height: 35, borderRadius: 50 },
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
