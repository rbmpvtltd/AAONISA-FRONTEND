// // // import { useLocalSearchParams } from "expo-router";
// // // import { useState } from "react";
// // // import {
// // //   Alert,
// // //   Dimensions,
// // //   FlatList,
// // //   Image,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // //   StyleSheet,
// // //   Text,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   View,
// // // } from "react-native";
// // // import { SafeAreaView } from "react-native-safe-area-context";
// // // import uuid from "react-native-uuid";
// // // import Icon from "react-native-vector-icons/Ionicons";

// // // import {
// // //   addCommentApi,
// // //   deleteCommentApi,
// // //   getCommentsApi,
// // //   likeCommentApi
// // // } from "@/src/api/comments-api";
// // // import { useAppTheme } from "@/src/constants/themeHelper";
// // // import { useCommentStore } from "@/src/store/useCommentStore";
// // // import { useQuery } from "@tanstack/react-query";
// // // const { width: windowWidth } = Dimensions.get("window");

// // // const extractMentions = (text: string): string[] => {
// // //   const regex = /@(\w+)/g;
// // //   const mentions: string[] = [];
// // //   let match;
// // //   while ((match = regex.exec(text)) !== null) {
// // //     mentions.push(match[1]);
// // //   }
// // //   return mentions;
// // // };

// // // const CommentPage = () => {
// // //   const { id } = useLocalSearchParams();
// // //   const postId = id as string;
// // //   const theme = useAppTheme();
// // //   const {
// // //     comments,
// // //     setComments,
// // //     addComment,
// // //     addReply,
// // //     deleteComment,
// // //     toggleLike,
// // //   } = useCommentStore();
// // //   const [commentText, setCommentText] = useState("");
// // //   const [replyTo, setReplyTo] = useState<string | null>(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const photoComments = comments[postId] || [];
// // //   const [currentUser, setCurrentUser] = useState({
// // //     id: "",
// // //     username: "you",
// // //     realName: "",
// // //     userProfile: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
// // //   });
// // // //   useEffect(() => {
// // // //   const fetchComments = async () => {
// // // //     if (!currentUser.id) return;

// // // //     try {
// // // //       const response = await getCommentsApi(postId);
// // // //       const rawComments = response?.data || [];

// // // //       const formattedComments = rawComments.map((c: any) => ({
// // // //         uuid: c.id,
// // // //         username:
// // // //           c.author?.id === currentUser.id
// // // //             ? "you"
// // // //             : c.author?.username?.trim() || "Unknown",
// // // //         userProfile:
// // // //           c.author?.userProfile?.url ||
// // // //           c.author?.userProfile ||
// // // //           "https://via.placeholder.com/150",
// // // //         content: c.content,
// // // //         time: new Date(c.createdAt).toLocaleTimeString(),
// // // //         mentions: c.mentions || [],
// // // //         replies: (c.replies || []).map((r: any) => ({
// // // //           uuid: r.id,
// // // //           username:
// // // //             r.author?.id === currentUser.id
// // // //               ? "you"
// // // //               : r.author?.username?.trim() || "Unknown",
// // // //           userProfile:
// // // //             r.author?.userProfile?.url ||
// // // //             r.author?.userProfile ||
// // // //             "https://via.placeholder.com/150",
// // // //           content: r.content,
// // // //           time: new Date(r.createdAt).toLocaleTimeString(),
// // // //           mentions: r.mentions || [],
// // // //           likedBy: r.likedBy || [],
// // // //         })),
// // // //         likedBy: c.likedBy || [],
// // // //       }));

// // // //       setComments(postId, formattedComments);
// // // //     } catch (error) {
// // // //       console.error("❌ Error fetching comments:", error);
// // // //     }
// // // //   };

// // // //   fetchComments();
// // // // }, [postId, currentUser.id]); // 🔥 re-run when user loads

// // //   // useEffect(() => {
// // //   //   const fetchUser = async () => {
// // //   //     try {
// // //   //       const data = await GetCurrentUser();
// // //   //       if (data?.id) {
// // //   //         setCurrentUser({
// // //   //           id: data.id,
// // //   //           username: data.username?.trim() || "you",
// // //   //           userProfile:
// // //   //             data.userProfile.ProfilePicture ||
// // //   //             "https://cdn-icons-png.flaticon.com/512/847/847969.png",
// // //   //           realName: data.name,
// // //   //         });
// // //   //       }
// // //   //     } catch (error) {
// // //   //       console.error("❌ Error fetching user:", error);
// // //   //     }
// // //   //   };

// // //   //   fetchUser();
// // //   // }, []);

// // //   const handleAddComment = async () => {

// // //     if (!commentText.trim()) return;
// // //     setLoading(true);

// // //     const mentions = extractMentions(commentText);
// // //     const tempId = uuid.v4().toString();

// // //     const newComment = {
// // //       uuid: tempId,
// // //       parentId: replyTo || null,
// // //       username: currentUser.username,
// // //       userProfile: currentUser.userProfile,
// // //       content: commentText.trim(),
// // //       mentions,
// // //       time: new Date().toLocaleTimeString(),
// // //       replies: [],
// // //       likedBy: [],
// // //       replyCount: 0,
// // //     };

// // //     try {

// // //       const res = await addCommentApi(postId, newComment.content, mentions, replyTo || "");
// // //       const saved = res?.data;
// // //       if (saved) {
// // //         const normalized = {
// // //           uuid: saved.id,
// // //           username: saved.author?.username || "Unknown",
// // //           userProfile:
// // //             saved.author?.userProfile?.url ||
// // //             saved.author?.userProfile ||
// // //             currentUser.userProfile,
// // //           content: saved.content,
// // //           time: new Date(saved.createdAt).toLocaleTimeString(),
// // //           mentions: saved.mentions || [],
// // //           replies: [],
// // //           likedBy: [],
// // //         };

// // //         if (replyTo) {
// // //           addReply(postId, replyTo, normalized);
// // //         } else {
// // //           addComment(postId, normalized);
// // //         }
// // //       }

// // //       setCommentText("");
// // //       setReplyTo(null);
// // //     } catch (err) {
// // //       console.error("❌ Error adding comment:", err);
// // //       Alert.alert("Error", "Failed to add comment. Try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };


// // //   const handleDeleteComment = async (commentId: string, parentId?: string) => {
// // //     Alert.alert("Delete Comment", "Are you sure?", [
// // //       { text: "Cancel", style: "cancel" },
// // //       {
// // //         text: "Delete",
// // //         style: "destructive",
// // //         onPress: async () => {
// // //           try {
// // //             await deleteCommentApi(commentId);
// // //             deleteComment(postId, commentId);
// // //           } catch (err) {
// // //             console.error("Error deleting comment:", err);
// // //           }
// // //         },
// // //       },
// // //     ]);
// // //   };
// // //   const getProfileUri = (profile: any) => {
// // //     if (!profile) return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
// // //     if (typeof profile === "string") return profile || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
// // //     return profile.url || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
// // //   };

// // //   const handleToggleLike = async (
// // //     commentId: string,
// // //     parentId?: string | null
// // //   ) => {
// // //     try {
// // //       await likeCommentApi(commentId);
// // //       toggleLike(postId, commentId, currentUser.realName, parentId || null);
// // //       // toggleLike(postId, commentId, currentUser.username === "you" ? currentUser.id : currentUser.username, parentId || null);

// // //     } catch (err) {
// // //       console.error("❌ Error liking comment:", err);
// // //     }
// // //   };

// // //   return (
// // //     <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
// // //       <KeyboardAvoidingView
// // //         style={{ flex: 1 }}
// // //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// // //         keyboardVerticalOffset={90}
// // //       >
// // //         <FlatList
// // //           data={photoComments}
// // //           keyExtractor={(item) => item.uuid}
// // //           contentContainerStyle={{ paddingBottom: 20 }}
// // //           renderItem={({ item }) => (
// // //             <View>
// // //               <View style={styles.commentContainer}>
// // //                 <Image
// // //                   source={{ uri: getProfileUri(item.userProfile) }}
// // //                   style={styles.profilePic}
// // //                 />


// // //                 <View style={{ flex: 1 }}>
// // //                   <Text style={[styles.commentUsername, { color: theme.text }]}>
// // //                     {item.username}{" "}
// // //                     <Text
// // //                       style={[styles.commentText, { color: theme.subtitle }]}
// // //                     >
// // //                       {item.content}
// // //                     </Text>
// // //                   </Text>

// // //                   <View style={styles.commentMeta}>
// // //                     <Text
// // //                       style={[styles.commentTime, { color: theme.placeholder }]}
// // //                     >
// // //                       {item.time}
// // //                     </Text>

// // //                     <TouchableOpacity onPress={() => setReplyTo(item.uuid)}>
// // //                       <Text
// // //                         style={[styles.replyText, { color: theme.buttonBg }]}
// // //                       >
// // //                         Reply
// // //                       </Text>
// // //                     </TouchableOpacity>

// // //                     {item.username === currentUser.username && (
// // //                       <TouchableOpacity
// // //                         onPress={() => handleDeleteComment(item.uuid)}
// // //                       >
// // //                         <Text
// // //                           style={[styles.deleteText, { color: theme.buttonBg }]}
// // //                         >
// // //                           Delete
// // //                         </Text>
// // //                       </TouchableOpacity>
// // //                     )}
// // //                   </View>

// // //                   {/* Replies */}
// // //                   {item.replies?.length ? (
// // //                     <View style={{ marginTop: 8, paddingLeft: 40 }}>
// // //                       {item.replies.map((reply) => (
// // //                         <View
// // //                           key={reply.uuid}
// // //                           style={{ flexDirection: "row", marginBottom: 5 }}
// // //                         >
// // //                           <Image
// // //                             source={{ uri: getProfileUri(reply.userProfile) }}
// // //                             style={styles.replyProfilePic}
// // //                           />

// // //                           <View style={{ flex: 1 }}>
// // //                             <Text
// // //                               style={[
// // //                                 styles.commentUsername,
// // //                                 { color: theme.text },
// // //                               ]}
// // //                             >
// // //                               {reply.username}{" "}
// // //                               <Text
// // //                                 style={[
// // //                                   styles.commentText,
// // //                                   { color: theme.subtitle },
// // //                                 ]}
// // //                               >
// // //                                 {reply.content}
// // //                               </Text>
// // //                             </Text>

// // //                             <View style={styles.commentMeta}>
// // //                               <TouchableOpacity
// // //                                 onPress={() =>
// // //                                   handleToggleLike(reply.uuid, item.uuid)
// // //                                 }
// // //                               >
// // //                                 <Icon
// // //                                   name={
// // //                                     reply.likedBy.includes(
// // //                                       currentUser.realName
// // //                                     )
// // //                                       ? "heart"
// // //                                       : "heart-outline"
// // //                                   }
// // //                                   size={16}
// // //                                   color={
// // //                                     reply.likedBy.includes(
// // //                                       currentUser.username
// // //                                     )
// // //                                       ? "red"
// // //                                       : theme.text
// // //                                   }
// // //                                 />
// // //                               </TouchableOpacity>
// // //                               <Text
// // //                                 style={{
// // //                                   fontSize: 12,
// // //                                   color: theme.subtitle,
// // //                                 }}
// // //                               >
// // //                                 {reply.likedBy.length}
// // //                               </Text>

// // //                               {reply.username === currentUser.username && (
// // //                                 <TouchableOpacity
// // //                                   onPress={() =>
// // //                                     handleDeleteComment(reply.uuid, item.uuid)
// // //                                   }
// // //                                 >
// // //                                   <Text
// // //                                     style={[
// // //                                       styles.deleteText,
// // //                                       { color: theme.buttonBg },
// // //                                     ]}
// // //                                   >
// // //                                     Delete
// // //                                   </Text>
// // //                                 </TouchableOpacity>
// // //                               )}
// // //                             </View>
// // //                           </View>
// // //                         </View>
// // //                       ))}
// // //                     </View>
// // //                   ) : null}
// // //                 </View>

// // //                 {/* Like Button */}
// // //                 <TouchableOpacity
// // //                   onPress={() => handleToggleLike(item.uuid, null)}
// // //                 >
// // //                   <Icon
// // //                     name={
// // //                       item.likedBy.includes(currentUser.username)
// // //                         ? "heart"
// // //                         : "heart-outline"
// // //                     }
// // //                     size={windowWidth * 0.05}
// // //                     color={
// // //                       item.likedBy.includes(currentUser.username)
// // //                         ? "red"
// // //                         : theme.text
// // //                     }
// // //                   />
// // //                 </TouchableOpacity>
// // //               </View>
// // //             </View>
// // //           )}
// // //           ListEmptyComponent={
// // //             <Text
// // //               style={[
// // //                 styles.emptyText,
// // //                 { color: theme.placeholder, fontSize: windowWidth * 0.04 },
// // //               ]}
// // //             >
// // //               No comments yet. Be the first to comment!
// // //             </Text>
// // //           }
// // //         />

// // //         {/* Input */}
// // //         <View
// // //           style={[
// // //             styles.inputRow,
// // //             {
// // //               borderTopColor: theme.inputBorder,
// // //               backgroundColor: theme.background,
// // //             },
// // //           ]}
// // //         >
// // //           <Image
// // //             source={{ uri: currentUser.userProfile }}
// // //             style={styles.commentProfilePic}
// // //           />

// // //           <View style={{ flex: 1, position: "relative" }}>
// // //             <TextInput
// // //               placeholder={
// // //                 replyTo ? "Replying to comment..." : "Add a comment..."
// // //               }
// // //               placeholderTextColor={theme.placeholder}
// // //               style={[
// // //                 styles.input,
// // //                 { color: theme.text, backgroundColor: theme.inputBg, paddingRight: 30 },
// // //               ]}
// // //               value={commentText}
// // //               onChangeText={setCommentText}
// // //             />

// // //             {/* ❌ Cancel Reply Icon inside input (right side) */}
// // //             {replyTo && (
// // //               <TouchableOpacity
// // //                 onPress={() => setReplyTo(null)}
// // //                 style={{
// // //                   position: "absolute",
// // //                   right: 8,
// // //                   top: "50%",
// // //                   transform: [{ translateY: -10 }],
// // //                 }}
// // //               >
// // //                 <Icon name="close-circle" size={18} color={theme.placeholder} />
// // //               </TouchableOpacity>
// // //             )}
// // //           </View>

// // //           <TouchableOpacity
// // //             onPress={handleAddComment}
// // //             disabled={loading || commentText.trim() === ""}
// // //             style={{ marginLeft: 6 }}
// // //           >
// // //             <Text
// // //               style={[
// // //                 styles.postButton,
// // //                 {
// // //                   color:
// // //                     commentText.trim() === "" || loading
// // //                       ? theme.placeholder
// // //                       : theme.buttonBg,
// // //                 },
// // //               ]}
// // //             >
// // //               {loading ? "..." : "Post"}
// // //             </Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </KeyboardAvoidingView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // export default CommentPage;

// // // const styles = StyleSheet.create({
// // //   commentContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "flex-start",
// // //     paddingHorizontal: 15,
// // //     paddingVertical: 10,
// // //     gap: 10,
// // //   },
// // //   profilePic: { width: 35, height: 35, borderRadius: 50 },
// // //   replyProfilePic: {
// // //     width: 25,
// // //     height: 25,
// // //     borderRadius: 50,
// // //     marginRight: 8,
// // //   },
// // //   commentUsername: { fontWeight: "600", fontSize: 14 },
// // //   commentText: { fontWeight: "400" },
// // //   commentMeta: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 15,
// // //     marginTop: 3,
// // //   },
// // //   commentTime: { fontSize: 12 },
// // //   replyText: { fontSize: 12 },
// // //   deleteText: { fontSize: 12, fontWeight: "600" },
// // //   emptyText: { textAlign: "center", marginTop: 30 },
// // //   inputRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     paddingHorizontal: 10,
// // //     borderTopWidth: 1,
// // //     paddingVertical: 8,
// // //   },
// // //   commentProfilePic: {
// // //     width: 30,
// // //     height: 30,
// // //     borderRadius: 50,
// // //     marginRight: 10,
// // //   },
// // //   input: {
// // //     flex: 1,
// // //     borderRadius: 20,
// // //     paddingHorizontal: 15,
// // //     paddingVertical: 6,
// // //     fontSize: 14,
// // //   },
// // //   postButton: {
// // //     fontSize: 14,
// // //     fontWeight: "600",
// // //     marginLeft: 10,
// // //   },
// // // });


// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useLocalSearchParams } from "expo-router";
// import { useState } from "react";
// import {
//   Alert,
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
// import { SafeAreaView } from "react-native-safe-area-context";
// import uuid from "react-native-uuid";
// import Icon from "react-native-vector-icons/Ionicons";

// import {
//   addCommentApi,
//   deleteCommentApi,
//   getCommentsApi,
//   likeCommentApi
// } from "@/src/api/comments-api";
// import { GetCurrentUser } from "@/src/api/profile-api";
// import { useAppTheme } from "@/src/constants/themeHelper";
// import { useCommentStore } from "@/src/store/useCommentStore";

// const { width: windowWidth } = Dimensions.get("window");

// const extractMentions = (text: string): string[] => {
//   const regex = /@(\w+)/g;
//   const mentions: string[] = [];
//   let match;
//   while ((match = regex.exec(text)) !== null) {
//     mentions.push(match[1]);
//   }
//   return mentions;
// };

// const CommentPage = () => {
//   const { id } = useLocalSearchParams();
//   const postId = id as string;
//   const theme = useAppTheme();
//   const queryClient = useQueryClient();

//   const {
//     comments,
//     setComments,
//     addComment,
//     addReply,
//     deleteComment,
//     toggleLike,
//   } = useCommentStore();

//   const [commentText, setCommentText] = useState("");
//   const [replyTo, setReplyTo] = useState<string | null>(null);

//   // const [currentUser, setCurrentUser] = useState({
//   //   id: "",
//   //   username: "you",
//   //   realName: "",
//   //   userProfile: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
//   // });


//   const { data: currentUserData, isLoading: currentUserLoading, isError: currentUserError } = useQuery({
//     queryKey: ["currentUser"],
//     queryFn: async () => {
//       console.log("🔥 Fetching current user...");
//       const result = await GetCurrentUser();
//       console.log("✅ Current user result:", result);
//       return result;
//     },
//     staleTime: 5 * 60 * 1000, // 5 mins
//     retry: 2,
//   });

// // ✅ Fallback to default if data not available
// const currentUser = currentUserData || {
//   id: "",
//   username: "you",
//   realName: "",
//   userProfile: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
// };

//   console.log("👤 Current User:", currentUser);
//   console.log("📍 Post ID:", postId);


//   //  const { data: currentUser, isLoading: currentUserLoading } = useQuery({
//   //   queryKey: ["currentUser"],
//   //   queryFn: GetCurrentUser,
//   // });

//   // const { data: currentUser, isLoading: currentUserLoading } = useQuery({
//   //   queryKey: ["currentUser"],
//   //   queryFn: GetCurrentUser,
//   //   staleTime: 5 * 60 * 1000, // 5 mins
//   // });


//   // Fetch Comments Query
//   const {
//     data: rawComments,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["comments", postId, currentUser.id],
//     queryFn: async () => {
//       const response = await getCommentsApi(postId);
//       console.log("response", response);

//       return response?.data || [];
//     },
//     enabled: !!currentUser?.id && !!postId,
//     staleTime: 30000,
//     gcTime: 5 * 60 * 1000,
//     retry: 2,
//     select: (data) => {
//       const formattedComments = data.map((c: any) => ({
//         id: c.id,
//         username:
//           c.author?.id === currentUser.id
//             ? "you"
//             : c.author?.username?.trim() || "Unknown",
//         userProfile:
//           c.author?.userProfile?.url ||
//           c.author?.userProfile ||
//           "https://via.placeholder.com/150",
//         content: c.content,
//         time: new Date(c.createdAt).toLocaleTimeString(),
//         mentions: c.mentions || [],
//         replies: (c.replies || []).map((r: any) => ({
//           uuid: r.id,
//           username:
//             r.author?.id === currentUser.id
//               ? "you"
//               : r.author?.username?.trim() || "Unknown",
//           userProfile:
//             r.author?.userProfile?.url ||
//             r.author?.userProfile ||
//             "https://via.placeholder.com/150",
//           content: r.content,
//           time: new Date(r.createdAt).toLocaleTimeString(),
//           mentions: r.mentions || [],
//           likedBy: r.likedBy || [],
//         })),
//         likedBy: c.likedBy || [],
//       }));

//       setComments(postId, formattedComments);
//       return formattedComments;
//     },
//   });

//   // Add Comment Mutation with Optimistic Update
//   const addCommentMutation = useMutation({
//     mutationFn: async ({
//       content,
//       mentions,
//       parentId,
//     }: {
//       content: string;
//       mentions: string[];
//       parentId: string | null;
//     }) => {
//       const res = await addCommentApi(postId, content, mentions, parentId || "");
//       return res?.data;
//     },
//     onMutate: async ({ content, mentions, parentId }) => {
//       await queryClient.cancelQueries({ queryKey: ["comments", postId] });

//       const previousComments = queryClient.getQueryData([
//         "comments",
//         postId,
//         currentUser.id,
//       ]);

//       const tempId = uuid.v4().toString();
//       const tempComment = {
//         uuid: tempId,
//         username: currentUser.username,
//         userProfile: currentUser.userProfile,
//         content: content.trim(),
//         mentions,
//         time: new Date().toLocaleTimeString(),
//         replies: [],
//         likedBy: [],
//       };

//       if (parentId) {
//         addReply(postId, parentId, tempComment);
//       } else {
//         addComment(postId, tempComment);
//       }

//       return { previousComments, tempId };
//     },
//     onSuccess: (savedComment, variables, context) => {
//       if (!savedComment) return;

//       const normalized = {
//         uuid: savedComment.id,
//         username: savedComment.author?.username || "Unknown",
//         userProfile:
//           savedComment.author?.userProfile?.url ||
//           savedComment.author?.userProfile ||
//           currentUser.userProfile,
//         content: savedComment.content,
//         time: new Date(savedComment.createdAt).toLocaleTimeString(),
//         mentions: savedComment.mentions || [],
//         replies: [],
//         likedBy: [],
//       };

//       if (variables.parentId) {
//         const updatedComments = comments[postId]?.map((comment) => {
//           if (comment.uuid === variables.parentId) {
//             return {
//               ...comment,
//               replies: comment.replies?.map((reply) =>
//                 reply.uuid === context?.tempId ? normalized : reply
//               ),
//             };
//           }
//           return comment;
//         });
//         setComments(postId, updatedComments || []);
//       } else {
//         const updatedComments = comments[postId]?.map((comment) =>
//           comment.uuid === context?.tempId ? normalized : comment
//         );
//         setComments(postId, updatedComments || []);
//       }

//       queryClient.invalidateQueries({ queryKey: ["comments", postId] });
//     },
//     onError: (error, variables, context) => {
//       if (context?.previousComments) {
//         queryClient.setQueryData(
//           ["comments", postId, currentUser?.id],
//           context.previousComments
//         );
//       }

//       if (variables.parentId) {
//         const rollbackComments = comments[postId]?.map((comment) => {
//           if (comment.uuid === variables.parentId) {
//             return {
//               ...comment,
//               replies: comment.replies?.filter(
//                 (reply) => reply.uuid !== context?.tempId
//               ),
//             };
//           }
//           return comment;
//         });
//         setComments(postId, rollbackComments || []);
//       } else {
//         const rollbackComments = comments[postId]?.filter(
//           (comment) => comment.uuid !== context?.tempId
//         );
//         setComments(postId, rollbackComments || []);
//       }

//       console.error("❌ Error adding comment:", error);
//       Alert.alert("Error", "Failed to add comment. Try again.");
//     },
//   });

//   // Delete Comment Mutation
//   const deleteCommentMutation = useMutation({
//     mutationFn: async (commentId: string) => {
//       return await deleteCommentApi(commentId);
//     },
//     onMutate: async (commentId) => {
//       await queryClient.cancelQueries({ queryKey: ["comments", postId] });
//       await queryClient.invalidateQueries({ queryKey: ["reels"] });
//       await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
//       // queryClient.invalidateQueries({ queryKey: ["stories"] });

//       const previousComments = queryClient.getQueryData([
//         "comments",
//         postId,
//         currentUser.id,
//       ]);

//       // Optimistically remove from store
//       deleteComment(postId, commentId);

//       return { previousComments };
//     },
//     onError: (error, commentId, context) => {
//       if (context?.previousComments) {
//         queryClient.setQueryData(
//           ["comments", postId, currentUser.id],
//           context.previousComments
//         );
//       }
//       console.error("❌ Error deleting comment:", error);
//       Alert.alert("Error", "Failed to delete comment");
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["comments", postId] });
//     },
//   });

//   // 🔥 Like Comment Mutation
//   const likeCommentMutation = useMutation({
//     mutationFn: async ({
//       commentId,
//       parentId
//     }: {
//       commentId: string;
//       parentId?: string | null;
//     }) => {
//       return await likeCommentApi(commentId);
//     },
//     onMutate: async ({ commentId, parentId }) => {
//       await queryClient.cancelQueries({ queryKey: ["comments", postId] });

//       const previousComments = queryClient.getQueryData([
//         "comments",
//         postId,
//         currentUser.id,
//       ]);

//       // Optimistically toggle like with parentId
//       toggleLike(postId, commentId, currentUser.realName, parentId || null);

//       return { previousComments };
//     },
//     onError: (error, { commentId, parentId }, context) => {
//       if (context?.previousComments) {
//         queryClient.setQueryData(
//           ["comments", postId, currentUser.id],
//           context.previousComments
//         );
//       }

//       // Rollback the like
//       toggleLike(postId, commentId, currentUser.realName, parentId || null);

//       console.error("❌ Error liking comment:", error);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["comments", postId] });
//     },
//   });



//   const handleAddComment = () => {
//     if (!commentText.trim()) return;

//     const mentions = extractMentions(commentText);

//     addCommentMutation.mutate(
//       {
//         content: commentText.trim(),
//         mentions,
//         parentId: replyTo,
//       },
//       {
//         onSuccess: () => {
//           setCommentText("");
//           setReplyTo(null);

//           queryClient.invalidateQueries({ queryKey: ["reels"] });
//           queryClient.invalidateQueries({ queryKey: ["userProfile"] });
//           // queryClient.invalidateQueries({ queryKey: ["stories"] });
//         },
//       }

//     );
//   };

//   const handleDeleteComment = (commentId: string, parentId?: string) => {
//     Alert.alert("Delete Comment", "Are you sure?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: () => deleteCommentMutation.mutate(commentId),
//       },
//     ]);
//   };

//   const getProfileUri = (profile: any) => {
//     if (!profile) return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
//     if (typeof profile === "string") return profile || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
//     return profile.url || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
//   };
//   const handleToggleLike = (commentId: string, parentId?: string | null) => {
//     console.log(" Like clicked:", { commentId, parentId, username: currentUser.realName });

//     likeCommentMutation.mutate({
//       commentId,
//       parentId: parentId || null
//     });
//   };

//   const photoComments = rawComments || comments[postId] || [];
//   const loading = addCommentMutation.isPending;
//   console.log('====================================');
//   console.log("COMMENTS =>", comments[postId]);
//   console.log("rawComments =>", rawComments);

//   console.log('====================================');
//   // Loading State
//   if (isLoading) {
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
//         <View style={styles.centerContainer}>
//           <Text style={{ color: theme.text }}>Loading comments...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Error State
//   if (isError) {
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
//         <View style={styles.centerContainer}>
//           <Text style={{ color: theme.text, marginBottom: 10 }}>
//             Failed to load comments
//           </Text>
//           <TouchableOpacity onPress={() => refetch()}>
//             <Text style={{ color: theme.buttonBg, fontWeight: "600" }}>
//               Retry
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={90}
//       >
//         <FlatList
//           data={photoComments}
//           keyExtractor={(item) => String(item.uuid || item.id)}
//           contentContainerStyle={{ paddingBottom: 20 }}
//           renderItem={({ item }) => (
//             <View>
//               <View style={styles.commentContainer}>
//                 <Image
//                   source={{ uri: getProfileUri(item.userProfile) }}
//                   style={styles.profilePic}
//                 />

//                 <View style={{ flex: 1 }}>
//                   <Text style={[styles.commentUsername, { color: theme.text }]}>
//                     {item.username}{" "}
//                     <Text
//                       style={[styles.commentText, { color: theme.subtitle }]}
//                     >
//                       {item.content}
//                     </Text>
//                   </Text>

//                   <View style={styles.commentMeta}>
//                     <Text
//                       style={[styles.commentTime, { color: theme.placeholder }]}
//                     >
//                       {item.time}
//                     </Text>

//                     <TouchableOpacity onPress={() => setReplyTo(item.uuid)}>
//                       <Text
//                         style={[styles.replyText, { color: theme.buttonBg }]}
//                       >
//                         Reply
//                       </Text>
//                     </TouchableOpacity>

//                     {item.username === currentUser.username && (
//                       <TouchableOpacity
//                         onPress={() => handleDeleteComment(item.uuid || item.id)}
//                       >
//                         <Text
//                           style={[styles.deleteText, { color: theme.buttonBg }]}
//                         >
//                           Delete
//                         </Text>
//                       </TouchableOpacity>
//                     )}
//                   </View>

//                   {/* Replies */}
//                   {item.replies?.length ? (
//                     <View style={{ marginTop: 8, paddingLeft: 40 }}>
//                       {item.replies.map((reply: any) => (
//                         <View
//                           key={reply.uuid}
//                           style={{ flexDirection: "row", marginBottom: 5 }}
//                         >
//                           <Image
//                             source={{ uri: getProfileUri(reply.userProfile) }}
//                             style={styles.replyProfilePic}
//                           />

//                           <View style={{ flex: 1 }}>
//                             <Text
//                               style={[
//                                 styles.commentUsername,
//                                 { color: theme.text },
//                               ]}
//                             >
//                               {reply.username}{" "}
//                               <Text
//                                 style={[
//                                   styles.commentText,
//                                   { color: theme.subtitle },
//                                 ]}
//                               >
//                                 {reply.content}
//                               </Text>
//                             </Text>

//                             <View style={styles.commentMeta}>
//                               <TouchableOpacity
//                                 onPress={() =>
//                                   handleToggleLike(reply.uuid, item.uuid)
//                                 }
//                               >
//                                 <Icon
//                                   name={
//                                     reply.likedBy.includes(
//                                       currentUser.realName
//                                     )
//                                       ? "heart"
//                                       : "heart-outline"
//                                   }
//                                   size={16}
//                                   color={
//                                     reply.likedBy.includes(
//                                       currentUser.realName
//                                     )
//                                       ? "red"
//                                       : theme.text
//                                   }
//                                 />

//                               </TouchableOpacity>
//                               <Text
//                                 style={{
//                                   fontSize: 12,
//                                   color: theme.subtitle,
//                                 }}
//                               >
//                                 {reply.likedBy.length}
//                               </Text>

//                               {reply.username === currentUser.username && (
//                                 <TouchableOpacity
//                                   onPress={() =>
//                                     handleDeleteComment(reply.uuid || reply.id, item.uuid || item.id)
//                                   }
//                                 >
//                                   <Text
//                                     style={[
//                                       styles.deleteText,
//                                       { color: theme.buttonBg },
//                                     ]}
//                                   >
//                                     Delete
//                                   </Text>
//                                 </TouchableOpacity>
//                               )}
//                             </View>
//                           </View>
//                         </View>
//                       ))}
//                     </View>
//                   ) : null}
//                 </View>

//                 {/* Like Button */}
//                 <TouchableOpacity
//                   onPress={() => handleToggleLike(item.uuid, null)}
//                 >
//                   <Icon
//                     name={
//                       item.likedBy.includes(currentUser.realName)
//                         ? "heart"
//                         : "heart-outline"
//                     }
//                     size={windowWidth * 0.05}
//                     color={
//                       item.likedBy.includes(currentUser.realName)
//                         ? "red"
//                         : theme.text
//                     }
//                   />
//                 </TouchableOpacity>


//                 <Text
//                   style={{
//                     fontSize: 12,
//                     color: theme.subtitle,
//                   }}
//                 >
//                   {item.likedBy.length}
//                 </Text>
//               </View>
//             </View>
//           )}
//           ListEmptyComponent={
//             <Text
//               style={[
//                 styles.emptyText,
//                 { color: theme.placeholder, fontSize: windowWidth * 0.04 },
//               ]}
//             >
//               No s yet. Be the first to comment!
//             </Text>
//           }
//         />

//         {/* Input */}
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
//             source={{ uri: currentUser.userProfile }}
//             style={styles.commentProfilePic}
//           />

//           <View style={{ flex: 1, position: "relative" }}>
//             <TextInput
//               placeholder={
//                 replyTo ? "Replying to comment..." : "Add a comment..."
//               }
//               placeholderTextColor={theme.placeholder}
//               style={[
//                 styles.input,
//                 { color: theme.text, backgroundColor: theme.inputBg, paddingRight: 30 },
//               ]}
//               value={commentText}
//               onChangeText={setCommentText}
//             />

//             {replyTo && (
//               <TouchableOpacity
//                 onPress={() => setReplyTo(null)}
//                 style={{
//                   position: "absolute",
//                   right: 8,
//                   top: "50%",
//                   transform: [{ translateY: -10 }],
//                 }}
//               >
//                 <Icon name="close-circle" size={18} color={theme.placeholder} />
//               </TouchableOpacity>
//             )}
//           </View>

//           <TouchableOpacity
//             onPress={handleAddComment}
//             disabled={loading || commentText.trim() === ""}
//             style={{ marginLeft: 6 }}
//           >
//             <Text
//               style={[
//                 styles.postButton,
//                 {
//                   color:
//                     commentText.trim() === "" || loading
//                       ? theme.placeholder
//                       : theme.buttonBg,
//                 },
//               ]}
//             >
//               {loading ? "..." : "Post"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default CommentPage;

// const styles = StyleSheet.create({
//   commentContainer: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     gap: 10,
//   },
//   profilePic: { width: 35, height: 35, borderRadius: 50 },
//   replyProfilePic: {
//     width: 25,
//     height: 25,
//     borderRadius: 50,
//     marginRight: 8,
//   },
//   commentUsername: { fontWeight: "600", fontSize: 14 },
//   commentText: { fontWeight: "400" },
//   commentMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 15,
//     marginTop: 3,
//   },
//   commentTime: { fontSize: 12 },
//   replyText: { fontSize: 12 },
//   deleteText: { fontSize: 12, fontWeight: "600" },
//   emptyText: { textAlign: "center", marginTop: 30 },
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
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });


// ======= arbaaz chouhan

import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
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

import {
  addCommentApi,
  deleteCommentApi,
  getCommentsApi,
  likeCommentApi,
} from "@/src/api/comments-api";

import { GetCurrentUser } from "@/src/api/profile-api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

const normalizeComment = (c: any) => ({
  uuid: c.id,
  parentId: c.parentId || null,
  username: c.author?.username || "Unknown",
  userProfile:
    c.author?.userProfile?.url ||
    c.author?.userProfile?.ProfilePicture ||
    "https://via.placeholder.com/150",
  content: c.content,
  time: new Date(c.createdAt).toLocaleTimeString(),
  mentions: c.mentions || [],
  // likedBy: c.likedBy || [],
  likedBy: (c.likedBy || []).map((u: any) => u.id),
  replies: (c.replies || []).map((r: any) => ({
    uuid: r.id,
    parentId: c.id,
    username: r.author?.username || "Unknown",
    userProfile:
      r.author?.userProfile?.url ||
      r.author?.userProfile?.ProfilePicture ||
      "https://via.placeholder.com/150",
    content: r.content,
    time: new Date(r.createdAt).toLocaleTimeString(),
    mentions: r.mentions || [],
    // likedBy: r.likedBy || [],
    likedBy: (r.likedBy || []).map((u: any) => u.id),
  })),
});

const CommentPage = () => {
  const { id } = useLocalSearchParams();
  const postId = id as string;

  const theme = useAppTheme();
  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  // Dummy current user
  // const currentUser = {
  //   id: "123",
  //   username: "you",
  //   userProfile: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  // };


  const { data: currentUser, isLoading: currentUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });


  if (currentUserLoading || !currentUser) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={styles.centerContainer}>
          <Text style={{ color: theme.text }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }
  console.log("cccccccccccuuuuuuuuuuu", currentUser);

  // -------------------------------
  // 🔥 FETCH COMMENTS — useQuery
  // -------------------------------
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await getCommentsApi(postId);
      return res.map(normalizeComment);
    },
  });

  console.log('====================================');
  console.log("ccccccccrrrrrrrrrrrroooo", comments);
  console.log('====================================');
  // ----------------------------------
  // 🔥 ADD COMMENT / REPLY MUTATION
  // ----------------------------------
  const addCommentMutation = useMutation({
    mutationFn: ({ content, mentions, parentId }: any) =>
      addCommentApi(postId, content, mentions, parentId || ""),

    onSuccess: (saved: any) => {
      const formatted = normalizeComment(saved.data);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      queryClient.setQueryData(["comments", postId], (old: any[] = []) => {
        if (!formatted.parentId) return [...old, formatted];


        return old.map((c) =>
          c.uuid === formatted.parentId
            ? { ...c, replies: [...c.replies, formatted] }
            : c
        );
      });

    },
  });

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const mentions = extractMentions(commentText);

    addCommentMutation.mutate({
      content: commentText,
      mentions,
      parentId: replyTo,
    });

    queryClient.cancelQueries({ queryKey: ["comments", postId] });
    queryClient.invalidateQueries({ queryKey: ["reels"] });
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    setCommentText("");
    setReplyTo(null);
  };

  // ----------------------------------
  // 🔥 DELETE COMMENT MUTATION
  // ----------------------------------
  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteCommentApi(commentId),

    onSuccess: (_, commentId) => {
      queryClient.setQueryData(["comments", postId], (old: any[]) =>
        old
          .filter((c) => c.uuid !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies.filter((r: any) => r.uuid !== commentId),
          }))
      );
    },
  });

  const handleDeleteComment = (commentId: string) => {
    Alert.alert("Delete Comment", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate(commentId),
      },
    ]);
    queryClient.cancelQueries({ queryKey: ["comments", postId] });
    queryClient.invalidateQueries({ queryKey: ["reels"] });
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  };

  // ----------------------------------
  // 🔥 LIKE TOGGLE — optimistic update
  // ----------------------------------

  interface LikeVars {
    commentId: string;
    parentId?: string | null;
  }
  interface CommentContext {
    prev: any;
  }

  const toggleArr = (arr: string[], value: string) =>
    arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];

  const likeMutation = useMutation<void, Error, LikeVars, CommentContext>({
    mutationFn: async ({ commentId }) => {
      return likeCommentApi(commentId);
    },

    onMutate: async ({ commentId, parentId }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      const prev = queryClient.getQueryData(["comments", postId]);

      // // ✅ Safe access
      // const username = currentUser?.username;
      // if (!username) return { prev };

      queryClient.setQueryData(["comments", postId], (old: any[] = []) =>
        old.map((comment) => {
          // 🔥 Like on main comment
          if (!parentId && comment.uuid === commentId) {
            return {
              ...comment,
              likedBy: toggleArr(comment.likedBy, currentUser?.id),
            };
          }

          // 🔥 Like on reply
          if (parentId && comment.uuid === parentId) {
            return {
              ...comment,
              replies: comment.replies.map((r: any) =>
                r.uuid === commentId
                  ? {
                    ...r,
                    likedBy: toggleArr(r.likedBy, currentUser?.id),
                  }
                  : r
              ),
            };
          }

          return comment;
        })
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["comments", postId], ctx.prev);
      }
    },

    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    // },
  });


  const handleToggleLike = (commentId: string, parentId?: string | null) => {
    likeMutation.mutate({ commentId, parentId });
  };



  const getProfileUri = (profile: any) =>
    typeof profile === "string"
      ? profile
      : profile?.url || "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  // ------------------------------------------
  // 🔥 UI
  // ------------------------------------------

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={comments}
          keyExtractor={(item) => item.uuid}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 30, color: theme.placeholder }}>
              No comments yet.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Image
                source={{ uri: getProfileUri(item.userProfile) }}
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
                  <Text style={[styles.commentTime, { color: theme.placeholder }]}>
                    {item.time}
                  </Text>

                  <TouchableOpacity onPress={() => setReplyTo(item.uuid)}>
                    <Text style={[styles.replyText, { color: theme.buttonBg }]}>
                      Reply
                    </Text>
                  </TouchableOpacity>

                  {item.username === currentUser.username && (
                    <TouchableOpacity onPress={() => handleDeleteComment(item.uuid)}>
                      <Text style={[styles.deleteText, { color: theme.buttonBg }]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Replies */}
                {item.replies?.length > 0 && (
                  <View style={{ marginTop: 8, paddingLeft: 40 }}>
                    {item.replies.map((reply: any) => (
                      <View key={reply.uuid} style={{ flexDirection: "row" }}>
                        <Image
                          source={{ uri: getProfileUri(reply.userProfile) }}
                          style={styles.replyProfilePic}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.commentUsername, { color: theme.text }]}>
                            {reply.username}{" "}
                            <Text style={[styles.commentText, { color: theme.subtitle }]}>
                              {reply.content}
                            </Text>
                          </Text>

                          <View style={styles.commentMeta}>
                            <TouchableOpacity
                              onPress={() => handleToggleLike(reply.uuid, item.uuid)}
                            >
                              <Icon
                                name={
                                  reply.likedBy.includes(currentUser?.id)
                                    ? "heart"
                                    : "heart-outline"
                                }
                                size={16}
                                color={
                                  reply.likedBy.includes(currentUser?.id)
                                    ? "red"
                                    : theme.text
                                }
                              />

                            </TouchableOpacity>

                            <Text
                              style={{
                                fontSize: 12,
                                color: theme.subtitle,
                                marginLeft: 4,
                              }}
                            >
                              {reply.likedBy.length}
                            </Text>

                            {reply.username === currentUser.username && (
                              <TouchableOpacity
                                onPress={() => handleDeleteComment(reply.uuid)}
                              >
                                <Text style={[styles.deleteText, { color: theme.buttonBg }]}>
                                  Delete
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Like Button */}
              <TouchableOpacity onPress={() => handleToggleLike(item.uuid)}>
                <Icon
                  name={
                    item.likedBy.includes(currentUser?.id)
                      ? "heart"
                      : "heart-outline"
                  }
                  size={windowWidth * 0.05}
                  color={
                    item.likedBy.includes(currentUser?.id)
                      ? "red"
                      : theme.text
                  }
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.subtitle,
                    marginLeft: 4,
                  }}
                >
                  {item.likedBy.length}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Input */}
        <View
          style={[
            styles.inputRow,
            { borderTopColor: theme.inputBorder, backgroundColor: theme.background },
          ]}
        >
          <Image source={{ uri: currentUser.userProfile?.ProfilePicture }} style={styles.commentProfilePic} />

          <View style={{ flex: 1 }}>
            <TextInput
              placeholder={replyTo ? "Replying..." : "Add a comment..."}
              placeholderTextColor={theme.placeholder}
              style={[
                styles.input,
                { color: theme.text, backgroundColor: theme.inputBg },
              ]}
              value={commentText}
              onChangeText={setCommentText}
            />
          </View>

          <TouchableOpacity onPress={handleAddComment}>
            <Text style={[styles.postButton, { color: theme.buttonBg }]}>Post</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});