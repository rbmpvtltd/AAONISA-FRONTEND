// // import { markViewed } from "@/app/story/api";
// // import { markViewed } from "@/app/(story)/api";
// // import { useStoryStore } from "@/src/store/useStoryStore";
// // import { Ionicons } from "@expo/vector-icons";
// // import { useLocalSearchParams, useRouter } from "expo-router";
// // import { VideoView, useVideoPlayer } from "expo-video";
// // import React, { useEffect, useRef, useState } from "react";
// // import {
// //   Animated,
// //   Dimensions,
// //   Image,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";

// // const { width, height } = Dimensions.get("window");

// // export default function StoryViewPage() {
// //   const router = useRouter();
// //   const { id } = useLocalSearchParams<{ id: string }>();
// //   const { userStories, markStoryViewed } = useStoryStore();

// //   // ✅ Find user by story Id (no owner needed)
// //   const userStory = userStories.find((user) =>
// //     user.stories.some((story) => story.id === id)
// //   );

// //   const storyList = userStory?.stories || [];

// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   useEffect(() => {
// //     if (userStory) {
// //       const idx = userStory.stories.findIndex((s) => s.id === id);
// //       if (idx !== -1) setCurrentIndex(idx);
// //     }
// //   }, [userStory, id]);

// //   const currentStory = storyList[currentIndex];

// //   const progress = useRef(new Animated.Value(0)).current;
// //   const [paused, setPaused] = useState(false);

// //   const player = useVideoPlayer(currentStory?.videoUrl ?? "", (player) =>
// //     player.play()
// //   );

// //   useEffect(() => {
// //     if (!currentStory) return;

// //     // Backend mark read
// //     markViewed(currentStory.id);

// //     // Local state update
// //     markStoryViewed(currentStory.id);

// //     progress.setValue(0);
// //     Animated.timing(progress, {
// //       toValue: 1,
// //       duration: currentStory.duration,
// //       useNativeDriver: false,
// //     }).start(({ finished }) => finished && handleNext());
// //   }, [currentIndex]);

// //   const handleNext = () => {
// //     if (currentIndex < storyList.length - 1) {
// //       setCurrentIndex((i) => i + 1);
// //     } else router.back();
// //   };

// //   const handlePrevious = () => {
// //     if (currentIndex > 0) setCurrentIndex((i) => i - 1);
// //     else router.back();
// //   };

// //   const handleLongPressIn = () => {
// //     setPaused(true);
// //     player.pause();
// //   };
// //   const handleLongPressOut = () => {
// //     setPaused(false);
// //     player.play();
// //   };

// //   // UI safety
// //   if (!userStory) {
// //     return (
// //       <View style={styles.center}>
// //         <Text style={{ color: "#fff" }}>Story not found</Text>
// //       </View>
// //     );
// //   }

// //   if (!currentStory) return null;

// //   return (
// //     <View style={styles.container}>
// //       <VideoView
// //         player={player}
// //         style={styles.video}
// //         contentFit="cover"
// //         allowsFullscreen={false}
// //         allowsPictureInPicture={false}
// //         nativeControls={false}
// //       />

// //       {/* Top info */}
// //       <View style={styles.topBar}>
// //         <View style={styles.progressRow}>
// //           {storyList.map((_, i) => (
// //             <View key={i} style={styles.progressBackground}>
// //               <Animated.View
// //                 style={[
// //                   styles.progressFill,
// //                   i === currentIndex
// //                     ? { flex: progress }
// //                     : i < currentIndex
// //                     ? { flex: 1 }
// //                     : { flex: 0 },
// //                 ]}
// //               />
// //             </View>
// //           ))}
// //         </View>

// //         <View style={styles.userRow}>
// //           <Image
// //             source={{ uri: userStory.profilePic }}
// //             style={styles.profileImg}
// //           />
// //           <Text style={styles.username}>{userStory.username}</Text>
// //         </View>

// //         <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
// //           <Ionicons name="close" size={26} color="#fff" />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Tap Areas */}
// //       <View style={styles.touchLayer}>
// //         <TouchableOpacity
// //           style={{ flex: 1 }}
// //           onPress={(e) =>
// //             e.nativeEvent.locationX < width / 2 ? handlePrevious() : handleNext()
// //           }
// //           onLongPress={handleLongPressIn}
// //           onPressOut={handleLongPressOut}
// //           delayLongPress={150}
// //         />
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#000" },
// //   center: { flex: 1, justifyContent: "center", alignItems: "center" },
// //   video: { position: "absolute", width, height },
// //   topBar: { position: "absolute", top: 40, left: 10, right: 10 },
// //   progressRow: { flexDirection: "row", gap: 5, marginBottom: 10 },
// //   progressBackground: {
// //     flex: 1,
// //     height: 3,
// //     backgroundColor: "rgba(255,255,255,0.3)",
// //     borderRadius: 2,
// //     overflow: "hidden",
// //   },
// //   progressFill: { backgroundColor: "#fff" },
// //   userRow: { flexDirection: "row", alignItems: "center", gap: 10 },
// //   profileImg: { width: 35, height: 35, borderRadius: 20 },
// //   username: { color: "#fff", fontSize: 16, fontWeight: "600" },
// //   closeBtn: { position: "absolute", right: 0, top: 0 },
// //   touchLayer: { position: "absolute", width, height, flexDirection: "row" },
// // });

// // ============================================================================

// // import { useStoryStore } from "@/src/store/useStoryStore";
// // import { Ionicons } from "@expo/vector-icons";
// // import { useLocalSearchParams, useRouter } from "expo-router";
// // import { VideoView, useVideoPlayer } from "expo-video";
// // import { useEffect, useRef, useState } from "react";
// // import {
// //   Animated,
// //   Dimensions,
// //   Image,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";

// // const { width, height } = Dimensions.get("window");

// // export default function StoryViewPage() {
// //   const router = useRouter();
// //   const { id } = useLocalSearchParams<{ id: string }>();
// //   const { userStories, markStoryViewed } = useStoryStore();

// //   // ✅ find user that contains this story
// //   const userStory = userStories.find((u) =>
// //     u.stories.some((s) => s.id === id)
// //   );

// //   const storyList = userStory?.stories || [];
// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   useEffect(() => {
// //     if (userStory && id) {
// //       const idx = userStory.stories.findIndex((s) => s.id === id);
// //       if (idx !== -1) setCurrentIndex(idx);
// //     }
// //   }, [userStory, id]);

// //   const currentStory = storyList[currentIndex];

// //   const progress = useRef(new Animated.Value(0)).current;
// //   const [paused, setPaused] = useState(false);

// //   // ✅ stable player
// //   const player = useVideoPlayer(currentStory?.videoUrl ?? "");

// //   useEffect(() => {
// //     if (!currentStory) return;

// //     player.replace(currentStory.videoUrl);
// //     if (!paused) player.play();
// //   }, [currentStory, paused]);

// //   // ✅ correct animation logic
// //   useEffect(() => {
// //     if (!currentStory) return;

// //     markStoryViewed(currentStory.id);

// //     progress.stopAnimation();
// //     progress.setValue(0);

// //     const anim = Animated.timing(progress, {
// //       toValue: 1,
// //       duration: currentStory.duration * 1000, // ✅ seconds to ms
// //       useNativeDriver: false,
// //     });

// //     anim.start(({ finished }) => {
// //       if (finished) handleNext();
// //     });

// //     return () => anim.stop();
// //   }, [currentIndex]);

// //   const handleNext = () => {
// //     if (currentIndex < storyList.length - 1) {
// //       setCurrentIndex((i) => i + 1);
// //     } else {
// //       router.back();
// //     }
// //   };

// //   const handlePrevious = () => {
// //     if (currentIndex > 0) {
// //       setCurrentIndex((i) => i - 1);
// //     } else {
// //       router.back();
// //     }
// //   };

// //   const handleLongPressIn = () => {
// //     setPaused(true);
// //     player.pause();
// //   };

// //   const handleLongPressOut = () => {
// //     setPaused(false);
// //     player.play();
// //   };

// //   if (!userStory || !currentStory) {
// //     return (
// //       <View style={styles.center}>
// //         <Text style={{ color: "#fff" }}>Loading...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <VideoView
// //         player={player}
// //         style={styles.video}
// //         contentFit="cover"
// //         allowsFullscreen={false}
// //         allowsPictureInPicture={false}
// //         nativeControls={false}
// //       />

// //       {/* Header */}
// //       <View style={styles.topBar}>
// //         {/* Progress bars */}
// //         <View style={styles.progressRow}>
// //           {storyList.map((_, i) => (
// //             <View key={i} style={styles.progressBackground}>
// //               <Animated.View
// //                 style={[
// //                   styles.progressFill,
// //                   i === currentIndex
// //                     ? { flex: progress }
// //                     : i < currentIndex
// //                     ? { flex: 1 }
// //                     : { flex: 0 },
// //                 ]}
// //               />
// //             </View>
// //           ))}
// //         </View>

// //         {/* User */}
// //         <View style={styles.userRow}>
// //           <Image source={{ uri: userStory.profilePic }} style={styles.profileImg} />
// //           <Text style={styles.username}>{userStory.username}</Text>
// //         </View>

// //         <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
// //           <Ionicons name="close" size={26} color="#fff" />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Touch navigation */}
// //       <View style={styles.touchLayer}>
// //         <TouchableOpacity
// //           style={{ flex: 1 }}
// //           onPress={(e) =>
// //             e.nativeEvent.locationX < width / 2 ? handlePrevious() : handleNext()
// //           }
// //           onLongPress={handleLongPressIn}
// //           onPressOut={handleLongPressOut}
// //           delayLongPress={150}
// //         />
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#000" },
// //   center: { flex: 1, justifyContent: "center", alignItems: "center" },
// //   video: { position: "absolute", width, height },
// //   topBar: { position: "absolute", top: 40, left: 10, right: 10 },
// //   progressRow: { flexDirection: "row", gap: 5, marginBottom: 10 },
// //   progressBackground: {
// //     flex: 1,
// //     height: 3,
// //     backgroundColor: "rgba(255,255,255,0.3)",
// //     borderRadius: 2,
// //     overflow: "hidden",
// //   },
// //   progressFill: { backgroundColor: "#fff" },
// //   userRow: { flexDirection: "row", alignItems: "center", gap: 10 },
// //   profileImg: { width: 35, height: 35, borderRadius: 20 },
// //   username: { color: "#fff", fontSize: 16, fontWeight: "600" },
// //   closeBtn: { position: "absolute", right: 0, top: 0 },
// //   touchLayer: { position: "absolute", width, height, flexDirection: "row" },
// // });

// // // ==========================================================================================================

// import { useStoryStore } from "@/src/store/useStoryStore";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { VideoView, useVideoPlayer } from "expo-video";
// import { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   Dimensions,
//   Image,
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
//   );

//   const storyList = userStory?.stories || [];
//   //  console.log("ddddddddddddduuuuuu", storyList);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const progress = useRef(new Animated.Value(0)).current;
//   const [paused, setPaused] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [showMuteIcon, setShowMuteIcon] = useState(false);
//   const [globalUserIndex, setGlobalUserIndex] = useState(0);
//   const [storyIndex, setStoryIndex] = useState(0);

//   const player = useVideoPlayer("");

//   useEffect(() => {
//     if (player) {
//       player.volume = isMuted ? 0 : 1.0;
//     }
//   }, [isMuted, player]);


//   const currentStory = storyList[currentIndex];
//   //  console.log('====================================');
//   //  console.log(currentStory.duration);
//   //  console.log('====================================');

//   //  Set initial index only once on mount
//  useEffect(() => {
//     if (userStory && id) {
//       const idx = userStory.stories.findIndex((s) => s.id === id);
//       if (idx !== -1) {
//         console.log("🔄 Setting story index:", idx, "for id:", id);
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

//   //  Progress animation
//   useEffect(() => {
//     if (!currentStory) return;

//     markStoryViewed(currentStory.id);

//     progress.stopAnimation();
//     progress.setValue(0);


//     const anim = Animated.timing(progress, {
//       toValue: 1,
//       duration: (currentStory.duration) * 1000,
//       useNativeDriver: false,
//     });

//     anim.start(({ finished }) => {
//       if (finished) handleNext();
//     });

//     return () => anim.stop();
//   }, [currentIndex]);

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
//     // console.log(" Pause story");
//     setPaused(true);
//     player.pause();
//   };

//   const handleLongPressOut = () => {
//     setPaused(false);
//     player.play();
//   };

//   if (!userStory || storyList.length === 0 || !currentStory) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "#fff" }}>Loading...</Text>
//       </View>
//     );
//   }


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
//               router.push(`/profile/${userStory.username}`);
//             }}
//           >
//             <Image source={{ uri: userStory.profilePic }} style={styles.profileImg} />
//             <Text style={styles.username}>{userStory.username}</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Close */}
//         {/* <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
//           <Ionicons name="close" size={26} color="#fff" />
//         </TouchableOpacity> */}
//       </View>

//       {/* Tap left/right */}
//       <View style={styles.touchLayer} >
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           onPress={(e) =>
//             e.nativeEvent.locationX < width / 2 ? handlePrevious() : handleNext()
//           }
//           onLongPress={handleLongPressIn}
//           onPressOut={handleLongPressOut}
//           delayLongPress={150}
//         />
//       </View>

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

//       {/* Close button ko alag, upar layer me dikhaye */}
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
//   userRow: { flexDirection: "row", alignItems: "center", gap: 10 },
//   profileImg: { width: 35, height: 35, borderRadius: 20 },
//   username: { color: "#fff", fontSize: 16, fontWeight: "600" },
//   closeBtn: { position: "absolute", right: 0, top: 0 },
//   touchLayer: { position: "absolute", width, height, flexDirection: "row" },
// });

import { useDeleteVideo } from "@/src/hooks/videosMutation";
import { useStoryStore } from "@/src/store/useStoryStore";
import { timeAgo } from "@/src/utils/timeAgo";
import { Ionicons } from "@expo/vector-icons";
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userStories, markStoryViewed } = useStoryStore();

  const userStory = userStories.find((u) =>
    u.stories.some((s) => s.id === id)
  );

  const storyList = userStory?.stories || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const [paused, setPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showViewers, setShowViewers] = useState(false);

  const player = useVideoPlayer("");

  const currentStory = storyList[currentIndex];
  const isOwnStory = userStory?.self === true;

  useEffect(() => {
    if (player) {
      player.volume = isMuted ? 0 : 1.0;
    }
  }, [isMuted, player]);

  // Set initial index only once on mount
  useEffect(() => {
    if (userStory && id) {
      const idx = userStory.stories.findIndex((s) => s.id === id);
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

  // Progress animation
  useEffect(() => {
    if (!currentStory) return;

    markStoryViewed(currentStory.id);

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
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < storyList.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }

    const currentUserIndex = userStories.findIndex((u) => u.username === userStory?.username);

    // Move to next user
    if (currentUserIndex < userStories.length - 1) {
      const nextUser = userStories[currentUserIndex + 1];
      const nextStory =
        nextUser.stories.find((s) => !s.viewed) || nextUser.stories[0];

      router.replace(`/story/${nextStory.id}`);
    } else {
      // End of last user
      router.back();
    }
  };


  const handlePrevious = () => {
    // SELF story → LEFT tap ignored
    // if (userStory?.self) return;

    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      return;
    }

    const currentUserIndex = userStories.findIndex(
      (u) => u.username === userStory?.username
    );

    if (currentUserIndex > 0) {
      const prevUser = userStories[currentUserIndex - 1];
      const prevStory =
        prevUser.stories[prevUser.stories.length - 1];

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

      {/* Top bar with progress */}
      <View style={styles.topBar}>
        <View style={styles.progressRow}>
          {storyList.map((_, i) => (
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
              source={{ uri: userStory.profilePic }}
              style={styles.profileImg}
            />
            <Text style={styles.username}>
              {isOwnStory ? "Your Story" : userStory.username}
            </Text>
            <Text style={styles.timeText}>
              <Text>{timeAgo(currentStory.created_at)}</Text>
            </Text>
          </TouchableOpacity>

          {/* Show time posted for own story */}
          {/* {isOwnStory && (
            <Text style={styles.timeText}>
            <Text>{timeAgo(currentStory.created_at)}</Text>
            </Text>
          )} */}
        </View>
      </View>

      {/* Tap left/right - Only for others' stories */}
      {/* {!isOwnStory && ( */}
      <View style={styles.touchLayer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={(e) =>
            e.nativeEvent.locationX < width / 2
              ? handlePrevious()
              : handleNext()
          }
          onLongPress={handleLongPressIn}
          onPressOut={handleLongPressOut}
          delayLongPress={150}
        />
      </View>
      {/* )} */}

      {/* Own Story Controls */}
      {isOwnStory && (
        <>
          {/* Swipe up to see viewers */}
          <TouchableOpacity
            style={styles.viewersButton}
            onPress={toggleViewers}
          >
            <Ionicons name="eye" size={20} color="#fff" />
            <Text style={styles.viewersText}>
              {currentStory.viewers?.length || 0}
            </Text>
          </TouchableOpacity>

          {/* Bottom action buttons */}
          <View style={styles.bottomActions}>
            {/*   <TouchableOpacity style={styles.actionBtn} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.actionBtn} onPress={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="trash-outline" size={24} color="#fff" />
              )}
            </TouchableOpacity>

            {/* Share functionality  */}
            {/* <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
              }}
            >
              <Ionicons name="paper-plane-outline" size={24} color="#fff" />
            </TouchableOpacity> */}

            {/* More options */}
            {/* <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
               
              }}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </TouchableOpacity> */}
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
            {currentStory.viewers && currentStory.viewers.length > 0 ? (
              currentStory.viewers.map((viewer: any, index: number) => (
                <View key={index} style={styles.viewerItem}>
                  <Image
                    source={{ uri: viewer.profilePic }}
                    style={styles.viewerImage}
                  />
                  <View style={styles.viewerInfo}>
                    <Text style={styles.viewerName}>{viewer.username}</Text>
                    <Text style={styles.viewerTime}>{viewer.viewedAt}</Text>
                  </View>
                </View>
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
        <Ionicons
          name={isMuted ? "volume-mute" : "volume-high"}
          size={26}
          color="#fff"
        />
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
  userRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  profileImg: { width: 35, height: 35, borderRadius: 20 },
  username: { color: "#fff", fontSize: 16, fontWeight: "600" },
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
});