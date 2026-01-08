// import { GetCurrentUser } from "@/src/api/profile-api";
// import { markViewed } from "@/src/api/story-api";
// import { useDeleteVideo } from "@/src/hooks/videosMutation";
// import { useSocketManager } from "@/src/socket/socket";
// import { useStoryStore } from "@/src/store/useStoryStore";
// import { useViewStore } from "@/src/store/viewStore";
// import { formatCount } from "@/src/utils/formatCount";
// import { timeAgo } from "@/src/utils/timeAgo";
// import { Ionicons } from "@expo/vector-icons";
// import { useQuery } from "@tanstack/react-query";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { VideoView, useVideoPlayer } from "expo-video";
// import { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// const { width, height } = Dimensions.get("window");
// export default function StoryViewPage() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const { userStories, markStoryViewed } = useStoryStore();
//   const userStory = userStories.find((u) =>
//     u.stories.some((s) => s.id === id)
// );


//   const storyList = userStory?.stories || [];
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const progress = useRef(new Animated.Value(0)).current;
//   const [paused, setPaused] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [showViewers, setShowViewers] = useState(false);

//   const player = useVideoPlayer("");

//   const currentStory = storyList[currentIndex];
//   const isOwnStory = userStory?.self === true;

//   const { data: currentUser, isLoading: currentUserLoading } = useQuery({
//     queryKey: ["currentUser"],
//     queryFn: GetCurrentUser,
//   });

//   const socket = useSocketManager(currentUser?.id)


//   useEffect(() => {
//     if (player) {
//       player.volume = isMuted ? 0 : 1.0;
//     }
//   }, [isMuted, player]);

//   // Set initial index only once on mount
//   useEffect(() => {
//     if (userStory && id) {
//       const idx = userStory.stories.findIndex((s) => s.id === id);
//       if (idx !== -1) {
//         setCurrentIndex(idx);
//       }
//     }
//   }, [id]);

//   useEffect(() => {
//     if (!currentStory?.videoUrl || !player) return;
//     const loadVideo = async () => {
//       try {
//         if (player.replaceAsync) {
//           await player.replaceAsync(currentStory.videoUrl);
//         } else {
//           player.replace(currentStory.videoUrl);
//         }
//         player.volume = isMuted ? 0 : 1.0;
//         if (!paused) player.play();
//       } catch (err) {
//         console.log("Video load error:", err);
//       }
//     };

//     loadVideo();
//   }, [currentStory?.videoUrl]);

//   const storyId = currentStory?.id;
// const { setViews, resetViews, setNewStory,views,addSingleView } = useViewStore() as any;

// useEffect(() => {
//   if (!socket || !storyId) return;

//   console.log("📤 Emitting getStoryViews", storyId);
//   setNewStory(storyId);

//   socket.emit("getStoryViews", { storyId });

//   const handleStoryViews = (data: any) => {
//     console.log("📥 storyViews EVENT RECEIVED:", data);

//     const formatted = data.views
//     .filter((v: any) => v.user_id !== currentUser?.id)
//     .map((v: any) => ({
//       view_id: v.view_id,
//       username: v.username,
//       profilePic: v.profilepic,
//       viewedAt: v.createdat,
//     }));

//     setViews(formatted);
//   };

//   socket.off("storyViews");
//   socket.on("storyViews", handleStoryViews);
//   // socket.on("story:newView", (viewer) => {
//   //   console.log("🔥 LIVE NEW VIEW RECEIVED:", viewer);
//   //   addSingleView(viewer);
//   // });
//   socket.on("story:newView", (viewer) => {
//   if (viewer.user_id !== currentUser?.id) {
//     addSingleView(viewer);
//   }
// });

//   return () => {
//     console.log("🚪 Cleanup: leaving room", storyId);

//     socket.off("storyViews", handleStoryViews);
//     socket.emit("leaveRoom", { roomId: `story:${storyId}` });
//     socket.off("story:newView");
//     resetViews();
//   };
// }, [socket, storyId]);


//   // Progress animation
//   // useEffect(() => {
//   //   if (!currentStory || !socket) return;
//   //   markViewed(storyId);
//   //   socket.emit("viewStory", { userId: currentUser?.id, storyId });

//   //   markStoryViewed(currentStory.id);

//   //   progress.stopAnimation();
//   //   progress.setValue(0);

//   //   const anim = Animated.timing(progress, {
//   //     toValue: 1,
//   //     duration: currentStory.duration * 1000,
//   //     useNativeDriver: false,
//   //   });

//   //   anim.start(({ finished }) => {
//   //     if (finished) handleNext();
//   //   });

//   //   return () => anim.stop();
//   // }, [currentIndex]);

// useEffect(() => {
//   if (!currentStory || !socket || !currentUser) return;

//   // ❌ Apni story ho to view count na bhejo
//   if (!isOwnStory) {
//     markViewed(storyId);
//     socket.emit("viewStory", {
//       userId: currentUser.id,
//       storyId,
//     });
//   }

//   markStoryViewed(currentStory.id);

//   progress.stopAnimation();
//   progress.setValue(0);

//   const anim = Animated.timing(progress, {
//     toValue: 1,
//     duration: currentStory.duration * 1000,
//     useNativeDriver: false,
//   });

//   anim.start(({ finished }) => {
//     if (finished) handleNext();
//   });

//   return () => anim.stop();
// }, [currentIndex]);


//   const handleNext = () => {
//     if (currentIndex < storyList.length - 1) {
//       setCurrentIndex((i) => i + 1);
//       return;
//     }

//     const currentUserIndex = userStories.findIndex((u) => u.username === userStory?.username);

//     // Move to next user
//     if (currentUserIndex < userStories.length - 1) {
//       const nextUser = userStories[currentUserIndex + 1];
//       const nextStory =
//         nextUser.stories.find((s) => !s.viewed) || nextUser.stories[0];

//       router.replace(`/story/${nextStory.id}`);
//     } else {
//       // End of last user
//       router.back();
//     }
//   };


//   const handlePrevious = () => {
//     // SELF story → LEFT tap ignored
//     // if (userStory?.self) return;

//     if (currentIndex > 0) {
//       setCurrentIndex((i) => i - 1);
//       return;
//     }

//     const currentUserIndex = userStories.findIndex(
//       (u) => u.username === userStory?.username
//     );

//     if (currentUserIndex > 0) {
//       const prevUser = userStories[currentUserIndex - 1];
//       const prevStory =
//         prevUser.stories[prevUser.stories.length - 1];

//       router.replace(`/story/${prevStory.id}`);
//     } else {
//       router.back();
//     }
//   };

//   const handleLongPressIn = () => {
//     setPaused(true);
//     player.pause();
//   };

//   const handleLongPressOut = () => {
//     setPaused(false);
//     player.play();
//   };


//   const deleteVideo = useDeleteVideo();

//   const handleDelete = () => {
//     Alert.alert(
//       "Delete Story",
//       "Are you sure you want to delete this story?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () => {
//             deleteVideo.mutate(currentStory.id, {
//               onSuccess: () => {
//                 router.replace("/(drawer)/(tabs)");
//               },
//             });
//           },
//         },
//       ]
//     );
//   };

//   const toggleViewers = () => {
//     setPaused(!showViewers);
//     if (!showViewers) {
//       player.pause();
//     } else {
//       player.play();
//     }
//     setShowViewers(!showViewers);
//   };

//   if (!userStory || storyList.length === 0 || !currentStory) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "#fff" }}>Loading...</Text>
//       </View>
//     );
//   }
//   const isDeleting = deleteVideo.isPending;
//   return (
//     <View style={styles.container}>
//       <VideoView
//         player={player}
//         style={styles.video}
//         contentFit="cover"
//         allowsFullscreen={false}
//         allowsPictureInPicture={false}
//         nativeControls={false}
//       />

//       {/* Top bar with progress */}
//       <View style={styles.topBar}>
//         <View style={styles.progressRow}>
//           {storyList.map((_, i) => (
//             <View key={i} style={styles.progressBackground}>
//               <Animated.View
//                 style={[
//                   styles.progressFill,
//                   i === currentIndex
//                     ? { flex: progress }
//                     : i < currentIndex
//                       ? { flex: 1 }
//                       : { flex: 0 },
//                 ]}
//               />
//             </View>
//           ))}
//         </View>

//         {/* User info */}
//         <View style={styles.userRow}>
//           <TouchableOpacity
//             style={{ flexDirection: "row", alignItems: "center" }}
//             onPress={() => {
//               if (!isOwnStory) {
//                 router.push(`/profile/${userStory.username}`);
//               } else {
//                 router.push(`/(drawer)/(tabs)/profile`);
//               }
//             }}
//           >
//             <Image
//               source={{ uri: userStory.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
//               style={styles.profileImg}
//             />
//             <Text style={styles.username}>
//               {isOwnStory ? "Your Story" : userStory.username}
//             </Text>
//             <Text style={styles.timeText}>
//               <Text>{timeAgo(currentStory.created_at)}</Text>
//             </Text>
//           </TouchableOpacity>

//           {/* Show time posted for own story */}
//           {/* {isOwnStory && (
//             <Text style={styles.timeText}>
//             <Text>{timeAgo(currentStory.created_at)}</Text>
//             </Text>
//           )} */}
//         </View>
//       </View>

//       {/* Tap left/right - Only for others' stories */}
//       {/* {!isOwnStory && ( */}
//       <View style={styles.touchLayer}>
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           onPress={(e) =>
//             e.nativeEvent.locationX < width / 2
//               ? handlePrevious()
//               : handleNext()
//           }
//           onLongPress={handleLongPressIn}
//           onPressOut={handleLongPressOut}
//           delayLongPress={150}
//         />
//       </View>
//       {/* )} */}

//       {/* Own Story Controls */}
//       {isOwnStory && (
//         <>
//           {/* Swipe up to see viewers */}
//           <TouchableOpacity
//             style={styles.viewersButton}
//             onPress={toggleViewers}
//           >
//             <Ionicons name="eye" size={20} color="#fff" />
//             <Text style={styles.viewersText}>
//               {formatCount(views?.length || 0)}
//             </Text>
//           </TouchableOpacity>

//           {/* Bottom action buttons */}
//           <View style={styles.bottomActions}>
//             {/*   <TouchableOpacity style={styles.actionBtn} onPress={handleDelete}>
//               <Ionicons name="trash-outline" size={24} color="#fff" />
//             </TouchableOpacity> */}

//             <TouchableOpacity style={styles.actionBtn} onPress={handleDelete} disabled={isDeleting}>
//               {isDeleting ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Ionicons name="trash-outline" size={24} color="#fff" />
//               )}
//             </TouchableOpacity>

//             {/* Share functionality  */}
//             {/* <TouchableOpacity
//               style={styles.actionBtn}
//               onPress={() => {
//               }}
//             >
//               <Ionicons name="paper-plane-outline" size={24} color="#fff" />
//             </TouchableOpacity> */}

//             {/* More options */}
//             {/* <TouchableOpacity
//               style={styles.actionBtn}
//               onPress={() => {

//               }}
//             >
//               <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
//             </TouchableOpacity> */}
//           </View>
//         </>
//       )}

//       {/* Viewers List Modal */}
//       {showViewers && isOwnStory && (
//         <View style={styles.viewersModal}>
//           <View style={styles.viewersHeader}>
//             <Text style={styles.viewersTitle}>Viewers</Text>
//             <TouchableOpacity onPress={toggleViewers}>
//               <Ionicons name="close" size={24} color="#fff" />
//             </TouchableOpacity>
//           </View>

//           <ScrollView style={styles.viewersList}>

// {views.length > 0 ? (
//   views.map((viewer:any, index:any) => (
//     <TouchableOpacity key={index} style={styles.viewerItem}  onPress={() => router.push(`/profile/${viewer.username.toLowerCase()}`)}>
//       <Image
//         source={{ uri: viewer.profilePic ||  "https://cdn-icons-png.flaticon.com/512/847/847969.png"  }}
//         style={styles.viewerImage}
//       />
//       <View style={styles.viewerInfo}>
//         <Text style={styles.viewerName}>{viewer.username}</Text>
//         <Text style={styles.viewerTime}>{timeAgo(viewer.viewedAt)}</Text>
//       </View>
//     </TouchableOpacity>
//   ))
// ) : (
//   <View style={styles.noViewers}>
//     <Ionicons name="eye-off-outline" size={48} color="#666" />
//     <Text style={styles.noViewersText}>No views yet</Text>
//   </View>
// )}
//           </ScrollView>
//         </View>
//       )}

//       {/* Mute/Unmute Button */}
//       <TouchableOpacity
//         style={{ position: "absolute", top: 55, right: 50 }}
//         onPress={() => setIsMuted(!isMuted)}
//       >
//         <Ionicons
//           name={isMuted ? "volume-mute" : "volume-high"}
//           size={26}
//           color="#fff"
//         />
//       </TouchableOpacity>

//       {/* Close button */}
//       <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
//         <View style={{ position: "absolute", top: 55, right: 10 }}>
//           <TouchableOpacity onPress={() => router.back()}>
//             <Ionicons name="close" size={26} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   video: { position: "absolute", width, height },
//   topBar: { position: "absolute", top: 40, left: 10, right: 10 },
//   progressRow: { flexDirection: "row", gap: 5, marginBottom: 10 },
//   progressBackground: {
//     flex: 1,
//     height: 3,
//     backgroundColor: "rgba(255,255,255,0.3)",
//     borderRadius: 2,
//     overflow: "hidden",
//   },
//   progressFill: { backgroundColor: "#fff" },
//   userRow: { flexDirection: "row", alignItems: "center" },
//   profileImg: { width: 35, height: 35, borderRadius: 20, marginRight : 10 },
//   username: { color: "#fff", fontSize: 16, fontWeight: "600",marginRight : 6 },
//   timeText: { color: "#ccc", fontSize: 12, marginLeft: "10%" },
//   touchLayer: { position: "absolute", width, height, flexDirection: "row" },
//   viewersButton: {
//     position: "absolute",
//     bottom: 60,
//     left: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.6)",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     gap: 8,
//   },
//   viewersText: { color: "#fff", fontSize: 16, fontWeight: "600" },
//   bottomActions: {
//     position: "absolute",
//     bottom: 60,
//     right: 10,
//     gap: 10,

//   },
//   actionBtn: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   viewersModal: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: height * 0.6,
//     backgroundColor: "rgba(0,0,0,0.95)",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingTop: 20,
//   },
//   viewersHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   viewersTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
//   viewersList: { flex: 1, paddingHorizontal: 20 },
//   viewerItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     gap: 12,
//   },
//   viewerImage: { width: 44, height: 44, borderRadius: 22 },
//   viewerInfo: { flex: 1 },
//   viewerName: { color: "#fff", fontSize: 15, fontWeight: "600" },
//   viewerTime: { color: "#999", fontSize: 13, marginTop: 2 },
//   noViewers: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingTop: 60,
//   },
//   noViewersText: { color: "#666", fontSize: 16, marginTop: 12 },
// });


import { GetCurrentUser } from "@/src/api/profile-api";
import { markViewed } from "@/src/api/story-api";
import { useStoriesQuery } from "@/src/hooks/storyMutation";
import { useDeleteVideo } from "@/src/hooks/videosMutation";
import { useSocketManager } from "@/src/socket/socket";
import { useViewStore } from "@/src/store/viewStore";
import { formatCount } from "@/src/utils/formatCount";
import { timeAgo } from "@/src/utils/timeAgo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function StoryViewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Local state for viewed stories
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const [paused, setPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);



  // Stories
  const {
    data: userStories = [],
    isLoading: storiesLoading,
    isError: storiesError,
    refetch: refetchStories,
  } = useStoriesQuery();

  const userStory = userStories.find((u: any) =>
    u.stories.some((s: any) => s.id === id)
  );

  console.log("userStoryuserStoryuserStoryuserStoryuserStoryuserStory", userStory);

  const storyList = userStory?.stories || [];
  const currentStory = storyList[currentIndex];
  const isOwnStory = userStory?.self === true;

  const player = useVideoPlayer("");

  const { data: currentUser, isLoading: currentUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });

  const socket = useSocketManager(currentUser?.id);

  const storyId = currentStory?.id;
  const { setViews, resetViews, setNewStory, views, addSingleView } = useViewStore() as any;

  // Mark story as viewed locally
  const markStoryViewedLocal = (storyId: string) => {
    setViewedStories((prev) => new Set(prev).add(storyId));
  };

  useEffect(() => {
    if (!player) return;

    const sub = player.addListener("statusChange", (event) => {
      console.log("🎥 VIDEO STATUS:", event.status);

      if (event.status === "loading") {
        setIsVideoLoading(true);
        setShowThumbnail(true);
        setIsVideoReady(false);
      }

      if (event.status === "readyToPlay") {
        setIsVideoLoading(false);
        setShowThumbnail(false);
        setIsVideoReady(true);
      }
    });

    return () => {
      sub.remove();
    };
  }, [player]);

  // useEffect(() => {
  //   setShowThumbnail(true);
  // }, [currentStory?.videoUrl]);


  useEffect(() => {
    if (player) {
      player.volume = isMuted ? 0 : 1.0;
    }
  }, [isMuted, player]);

  // Set initial index only once on mount
  useEffect(() => {
    if (userStory && id) {
      const idx = userStory.stories.findIndex((s: any) => s.id === id);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [id]);

  useEffect(() => {
    if (!currentStory?.videoUrl || !player) return;
    const loadVideo = async () => {
      try {
        if (player.replaceAsync) {
          await player.replaceAsync(currentStory.videoUrl);
        } else {
          player.replace(currentStory.videoUrl);
        }
        player.volume = isMuted ? 0 : 1.0;
        if (!paused) player.play();
      } catch (err) {
        console.log("Video load error:", err);
      }
    };

    loadVideo();
  }, [currentStory?.videoUrl]);

  // Socket effect for story views
  useEffect(() => {
    if (!socket || !storyId) return;

    console.log("📤 Emitting getStoryViews", storyId);
    setNewStory(storyId);

    socket.emit("getStoryViews", { storyId });

    const handleStoryViews = (data: any) => {
      console.log("📥 storyViews EVENT RECEIVED:", data);

      const formatted = data.views
        .filter((v: any) => v.user_id !== currentUser?.id)
        .map((v: any) => ({
          view_id: v.view_id,
          username: v.username,
          profilePic: v.profilepic,
          viewedAt: v.createdat,
        }));

      setViews(formatted);
    };

    socket.off("storyViews");
    socket.on("storyViews", handleStoryViews);

    socket.on("story:newView", (viewer: any) => {
      if (viewer.user_id !== currentUser?.id) {
        addSingleView(viewer);
      }
    });

    return () => {
      console.log("🚪 Cleanup: leaving room", storyId);
      socket.off("storyViews", handleStoryViews);
      socket.emit("leaveRoom", { roomId: `story:${storyId}` });
      socket.off("story:newView");
      resetViews();
    };
  }, [socket, storyId]);

  // Progress animation
  useEffect(() => {
    if (!currentStory || !socket || !currentUser) return;
    if (!isVideoReady) return;

    // Don't send view count for own story
    if (!isOwnStory) {
      markViewed(storyId);
      socket.emit("viewStory", {
        userId: currentUser.id,
        storyId,
      });
    }

    // Mark locally
    markStoryViewedLocal(currentStory.id);

    progress.stopAnimation();
    progress.setValue(0);

    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: currentStory.duration * 1000,
      useNativeDriver: false,
    });

    anim.start(({ finished }) => {
      if (finished) handleNext();
    });

    return () => anim.stop();
  }, [currentIndex, isVideoReady]);

  const handleNext = () => {
    if (currentIndex < storyList.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }

    console.log("arbaaz khan 11111 arbaaz", userStory?.usernamer)
    const currentUserIndex = userStories.findIndex(
      (u: any) => u.username === userStory?.username
    );

    // Move to next user
    if (currentUserIndex < userStories.length - 1) {
      const nextUser = userStories[currentUserIndex + 1];
      const nextStory =
        nextUser.stories.find((s: any) => !viewedStories.has(s.id)) || nextUser.stories[0];

      router.replace(`/story/${nextStory.id}`);
    } else {
      // End of last user
      router.back();
    }
  };

  // const handleNext = () => {
  //   console.log("Current index:", currentIndex);
  //   console.log("Story list length:", storyList.length);

  //   if (currentIndex < storyList.length - 1) {
  //     setCurrentIndex(i => i + 1);
  //     return;
  //   }

  //   const currentUserIndex = userStories.findIndex(
  //     u => u.username === userStory?.username
  //   );

  //   console.log("Current user index:", currentUserIndex);

  //   if (currentUserIndex < userStories.length - 1) {
  //     const nextUser = userStories[currentUserIndex + 1];
  //     const nextStory =
  //       nextUser.stories.find((s: any) => !viewedStories.has(s.id)) ||
  //       nextUser.stories[0];

  //     console.log("Next user:", nextUser.username);
  //     console.log("Next story ID:", nextStory.id);

  //     const path = `/story/${nextStory.id}`;
  //     console.log("Router replace →", path);

  //     router.replace(path);
  //   } else {
  //     console.log("End of stories → back()");
  //     router.back();
  //   }
  // };


  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      return;
    }

    const currentUserIndex = userStories.findIndex(
      (u: any) => u.username === userStory?.username
    );

    if (currentUserIndex > 0) {
      const prevUser = userStories[currentUserIndex - 1];
      const prevStory = prevUser.stories[prevUser.stories.length - 1];

      router.replace(`/story/${prevStory.id}`);
    } else {
      router.back();
    }
  };

  const handleLongPressIn = () => {
    setPaused(true);
    player.pause();
  };

  const handleLongPressOut = () => {
    setPaused(false);
    player.play();
  };

  const deleteVideo = useDeleteVideo();

  const handleDelete = () => {
    Alert.alert(
      "Delete Story",
      "Are you sure you want to delete this story?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteVideo.mutate(currentStory.id, {
              onSuccess: () => {
                // Invalidate stories query to refresh the list
                queryClient.invalidateQueries({ queryKey: ["stories"] });
                router.replace("/(drawer)/(tabs)");
              },
            });
          },
        },
      ]
    );
  };

  const toggleViewers = () => {
    setPaused(!showViewers);
    if (!showViewers) {
      player.pause();
    } else {
      player.play();
    }
    setShowViewers(!showViewers);
  };

  if (!userStory || storyList.length === 0 || !currentStory) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Loading...</Text>
      </View>
    );
  }

  const isDeleting = deleteVideo.isPending;

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
      />



      {showThumbnail && (
        <Image
          source={{
            uri: currentStory?.thumbnailUrl || currentStory?.posterUrl,
          }}
          style={styles.video}
          resizeMode="cover"
        />
      )}

      {isVideoLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Top bar with progress */}
      <View style={styles.topBar}>
        <View style={styles.progressRow}>
          {storyList.map((_: any, i: number) => (
            <View key={i} style={styles.progressBackground}>
              <Animated.View
                style={[
                  styles.progressFill,
                  i === currentIndex
                    ? { flex: progress }
                    : i < currentIndex
                      ? { flex: 1 }
                      : { flex: 0 },
                ]}
              />
            </View>
          ))}
        </View>

        {/* User info */}
        <View style={styles.userRow}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              if (!isOwnStory) {
                router.push(`/profile/${userStory.username}`);
              } else {
                router.push(`/(drawer)/(tabs)/profile`);
              }
            }}
          >
            <Image
              source={{
                uri:
                  userStory.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              style={styles.profileImg}
            />
            <Text style={styles.username}>
              {isOwnStory ? "Your Story" : userStory.username}
            </Text>
            <Text style={styles.timeText}>
              <Text>{timeAgo(currentStory.created_at)}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tap left/right */}
      <View style={styles.touchLayer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={(e) =>
            e.nativeEvent.locationX < width / 2 ? handlePrevious() : handleNext()
          }
          onLongPress={handleLongPressIn}
          onPressOut={handleLongPressOut}
          delayLongPress={150}
        />
      </View>

      {/* Own Story Controls */}
      {isOwnStory && (
        <>
          <TouchableOpacity style={styles.viewersButton} onPress={toggleViewers}>
            <Ionicons name="eye" size={20} color="#fff" />
            <Text style={styles.viewersText}>{formatCount(views?.length || 0)}</Text>
          </TouchableOpacity>

          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="trash-outline" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Viewers List Modal */}
      {showViewers && isOwnStory && (
        <View style={styles.viewersModal}>
          <View style={styles.viewersHeader}>
            <Text style={styles.viewersTitle}>Viewers</Text>
            <TouchableOpacity onPress={toggleViewers}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.viewersList}>
            {views.length > 0 ? (
              views.map((viewer: any, index: any) => (
                <TouchableOpacity
                  key={index}
                  style={styles.viewerItem}
                  onPress={() => router.push(`/profile/${viewer.username.toLowerCase()}`)}
                >
                  <Image
                    source={{
                      uri:
                        viewer.profilePic ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                    }}
                    style={styles.viewerImage}
                  />
                  <View style={styles.viewerInfo}>
                    <Text style={styles.viewerName}>{viewer.username}</Text>
                    <Text style={styles.viewerTime}>{timeAgo(viewer.viewedAt)}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noViewers}>
                <Ionicons name="eye-off-outline" size={48} color="#666" />
                <Text style={styles.noViewersText}>No views yet</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Mute/Unmute Button */}
      <TouchableOpacity
        style={{ position: "absolute", top: 55, right: 50 }}
        onPress={() => setIsMuted(!isMuted)}
      >
        <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={26} color="#fff" />
      </TouchableOpacity>

      {/* Close button */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View style={{ position: "absolute", top: 55, right: 10 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  video: { position: "absolute", width, height },
  topBar: { position: "absolute", top: 40, left: 10, right: 10 },
  progressRow: { flexDirection: "row", gap: 5, marginBottom: 10 },
  progressBackground: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { backgroundColor: "#fff" },
  userRow: { flexDirection: "row", alignItems: "center" },
  profileImg: { width: 35, height: 35, borderRadius: 20, marginRight: 10 },
  username: { color: "#fff", fontSize: 16, fontWeight: "600", marginRight: 6 },
  timeText: { color: "#ccc", fontSize: 12, marginLeft: "10%" },
  touchLayer: { position: "absolute", width, height, flexDirection: "row" },
  viewersButton: {
    position: "absolute",
    bottom: 60,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  viewersText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  bottomActions: {
    position: "absolute",
    bottom: 60,
    right: 10,
    gap: 10,
  },
  actionBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  viewersModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    backgroundColor: "rgba(0,0,0,0.95)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  viewersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  viewersTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  viewersList: { flex: 1, paddingHorizontal: 20 },
  viewerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  viewerImage: { width: 44, height: 44, borderRadius: 22 },
  viewerInfo: { flex: 1 },
  viewerName: { color: "#fff", fontSize: 15, fontWeight: "600" },
  viewerTime: { color: "#999", fontSize: 13, marginTop: 2 },
  noViewers: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  noViewersText: { color: "#666", fontSize: 16, marginTop: 12 },
  loaderOverlay: {
    position: "absolute",
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

}); 