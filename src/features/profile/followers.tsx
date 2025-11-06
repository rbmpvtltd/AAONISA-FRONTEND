// import { useAppTheme } from '@/src/constants/themeHelper';
// import { Follow, useFollowStore } from '@/src/store/useFollowerFollowingStore';
// import React from 'react';
// import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

// const FollowersScreen: React.FC = () => {
//   const { width } = useWindowDimensions();
//   const theme = useAppTheme();

//   const avatarSize = width > 400 ? 60 : 50; 
//   const padding = width > 400 ? 20 : 16;
//   const fontSizeName = width > 400 ? 18 : 16;
//   const fontSizeUsername = width > 400 ? 16 : 14;
//   const buttonPaddingHorizontal = width > 400 ? 24 : 20;

//   // Zustand store se data le rahe hain
//   const followers = useFollowStore((state) => state.followers);

//   const renderFollower = ({ item }: { item: Follow }) => (
//     <View style={[styles.userRow, { borderBottomColor: theme.inputBorder }]}>
//       <Image
//         source={{ uri: item.userProfilePicture || 'https://via.placeholder.com/150' }}
//         style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
//       />
//       <View style={[styles.userInfo, { marginLeft: padding / 2 }]}>
//         <Text style={[styles.name, { fontSize: fontSizeName, color: theme.text }]}>{item.name}</Text>
//         <Text style={[styles.username, { fontSize: fontSizeUsername, color: theme.subtitle }]}>@{item.username}</Text>
//       </View>
//       <TouchableOpacity
//         style={[styles.followButton, { paddingHorizontal: buttonPaddingHorizontal, backgroundColor: theme.buttonBg }]}
//       >
//         <Text style={[styles.followButtonText, { color: theme.buttonText }]}>Follow</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background, paddingHorizontal: padding, paddingTop: 50 }]}>
//       <Text style={[styles.header, { fontSize: width > 400 ? 24 : 20, color: theme.text }]}>Followers</Text>
//       <FlatList
//         data={followers} // store se followers
//         renderItem={renderFollower}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: { fontWeight: '600', marginBottom: 20, textAlign: 'center' },
//   userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5 },
//   avatar: {},
//   userInfo: { flex: 1 },
//   name: { fontWeight: '600' },
//   username: {},
//   followButton: { paddingVertical: 6, borderRadius: 8 },
//   followButtonText: { fontWeight: '600', fontSize: 14 },
// });

// export default FollowersScreen;



// import { followUser, GetProfileUsername } from "@/app/profile/api";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useLocalSearchParams } from "expo-router"; // for dynamic route param (username)
// import { useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function FollowersScreen() {
//   const { username } = useLocalSearchParams<{ username?: string }>();
//   const queryClient = useQueryClient();
//   const [tempFollowing, setTempFollowing] = useState<string[]>([]);

//     // Fetch user profile with followings
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ['userProfile', username],
//     queryFn: () => GetProfileUsername(username as string),
//     enabled: !!username,
//   })

//   // Mutation for unfollow
//   const followMutation = useMutation({
//     mutationFn: (id: string) => followUser(id),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfile', username] }),
//   })

//   // ✅ Loading state
//   if (isLoading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#00CFFF" />
//         <Text style={styles.loadingText}>Loading followers...</Text>
//       </View>
//     );
//   }

//   // ✅ Error state
//   if (isError) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "red" }}>Failed to load followers</Text>
//       </View>
//     );
//   }

//   console.log("follow list list", data);
  
//   const followers = data?.followers || [];
//   console.log("follow here", data?.followers);
  

//   // ✅ Handle Follow
//   const handleFollowToggle = (id: string) => {
//     followMutation.mutate(id);
//     setTempFollowing((prev) => [...prev, id]);
//   };

//   // ✅ Render Follower Item
//   const renderFollower = ({ item }: any) => {
//     const isFollowing = tempFollowing.includes(item.id);

//     return (
//       <View style={styles.userRow}>
//         <View style={styles.leftSection}>
//           <Image
//             source={{
//               uri:
//                 item.ProfilePicture?.trim() ||
//                 "https://www.w3schools.com/howto/img_avatar.png",
//             }}
//             style={styles.avatar}
//           />
//           <View style={{ marginLeft: 10 }}>
//             <Text style={styles.name}>{item.name}</Text>
//             <Text style={styles.username}>@{item.username}</Text>
//           </View>
//         </View>

//         <TouchableOpacity
//           onPress={() => handleFollowToggle(item.id)}
//           disabled={followMutation.isPending}
//           style={[
//             styles.followButton,
//             { backgroundColor: isFollowing ? "#333" : "#00CFFF" },
//           ]}
//         >
//           <Text style={styles.followButtonText}>
//             {isFollowing ? "Following" : "Follow Back"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   // ✅ Main return
//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Followers</Text>

//       <FlatList
//         data={followers}
//         renderItem={renderFollower}
//         keyExtractor={(item) => item.id}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No followers yet.</Text>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "600",
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#000",
//   },
//   userRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#00CFFF",
//     paddingVertical: 12,
//   },
//   leftSection: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   avatar: {
//     width: 55,
//     height: 55,
//     borderRadius: 27.5,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#000",
//   },
//   username: {
//     fontSize: 14,
//     color: "#777",
//   },
//   followButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   followButtonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   emptyText: {
//     textAlign: "center",
//     color: "#888",
//     marginTop: 20,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 10,
//     color: "#555",
//   },
// });
