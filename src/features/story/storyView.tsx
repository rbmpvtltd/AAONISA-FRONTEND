// import { useStoryStore } from "@/src/store/useStoryStore";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { VideoView, useVideoPlayer } from "expo-video";
// import React, { useEffect, useRef, useState } from "react";
// import {
//     Animated,
//     Dimensions,
//     Image,
//     PanResponder,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const { width, height } = Dimensions.get("window");

// export default function StoryViewPage() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const storyId = Number(id);

//   const { stories } = useStoryStore();
//   const [currentIndex, setCurrentIndex] = useState(
//     stories.findIndex((s) => s.id === storyId)
//   );
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

//   const currentStory = stories[currentIndex];
//   const currentMedia = currentStory?.media[currentMediaIndex];

//   const player = useVideoPlayer(currentMedia?.uri ?? "", (player) => {
//     player.play();
//   });

//   const [paused, setPaused] = useState(false);
//   const progress = useRef(new Animated.Value(0)).current;
//   const animationRef = useRef<Animated.CompositeAnimation | null>(null);

//   //  Animate progress bar
//   const startProgress = () => {
//     progress.setValue(0);
//     animationRef.current = Animated.timing(progress, {
//       toValue: 1,
//       duration: (currentMedia?.duration ?? 8) * 1000,
//       useNativeDriver: false,
//     });
//     animationRef.current.start(({ finished }) => {
//       if (finished) handleNext();
//     });
//   };

//   useEffect(() => {
//     if (!currentStory) return;
//     if (currentMedia?.type === "video") {
//       player.replace(currentMedia.uri);
//       player.play();
//     }
//     startProgress();
//   }, [currentIndex, currentMediaIndex]);

//   //  Gesture navigation
//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20,
//       onPanResponderRelease: (_, g) => {
//         if (g.dx > 50) handlePrevious();
//         else if (g.dx < -50) handleNext();
//       },
//     })
//   ).current;

//   const handleNext = () => {
//     const medias = currentStory.media;
//     if (currentMediaIndex < medias.length - 1) {
//       setCurrentMediaIndex(currentMediaIndex + 1);
//     } else if (currentIndex < stories.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//       setCurrentMediaIndex(0);
//     } else {
//       router.back();
//     }
//   };

//   const handlePrevious = () => {
//     if (currentMediaIndex > 0) {
//       setCurrentMediaIndex(currentMediaIndex - 1);
//     } else if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//       setCurrentMediaIndex(0);
//     } else {
//       router.back();
//     }
//   };

//   const handleLongPressIn = async () => {
//     setPaused(true);
//     animationRef.current?.stop();
//     try {
//       await player.pause();
//     } catch {}
//   };

//   const handleLongPressOut = async () => {
//     setPaused(false);
//     startProgress();
//     try {
//       await player.play();
//     } catch {}
//   };

//   if (!currentStory || !currentMedia) return null;

//   // 🔹 Interpolated progress width
//   const progressWidth = progress.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0%", "100%"],
//   });

//   return (
//     <View style={styles.container} {...panResponder.panHandlers}>
//       {/* 🔹 Media Display */}
//       {currentMedia.type === "video" ? (
//         <VideoView
//           key={currentMedia.uri}
//           style={styles.video}
//           player={player}
//           contentFit="cover"
//           allowsFullscreen={false}
//           allowsPictureInPicture={false}
//           nativeControls={false}
//         />
//       ) : (
//         <Image
//           key={currentMedia.uri}
//           source={{ uri: currentMedia.uri }}
//           style={styles.video}
//           resizeMode="cover"
//         />
//       )}

//       {/* 🔹 Top Section */}
//       <View style={styles.topBar}>
//         {/* Progress Bar */}
//         <View style={styles.progressContainer}>
//           {currentStory.media.map((_, i) => (
//             <View key={i} style={styles.progressBarBg}>
//               <Animated.View
//                 style={[
//                   styles.progressBarFill,
//                   i === currentMediaIndex
//                     ? { width: progressWidth }
//                     : i < currentMediaIndex
//                     ? { width: "100%" }
//                     : { width: "0%" },
//                 ]}
//               />
//             </View>
//           ))}
//         </View>

//         {/* User Info */}
//         <View style={styles.userInfo}>
//           <Image
//             source={{ uri: currentStory.profilePic }}
//             style={styles.profileImg}
//           />
//           <Text style={styles.username}>{currentStory.username}</Text>
//         </View>

//         <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
//           <Ionicons name="close" size={28} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Tap Layers */}
//       <View style={styles.touchLayer}>
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           onPress={(e) => {
//             const x = e.nativeEvent.locationX;
//             if (x < width / 2) handlePrevious();
//             else handleNext();
//           }}
//           onLongPress={handleLongPressIn}
//           onPressOut={handleLongPressOut}
//           delayLongPress={150}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   video: { position: "absolute", width, height },
//   topBar: {
//     position: "absolute",
//     top: 40,
//     left: 10,
//     right: 10,
//   },
//   progressContainer: {
//     flexDirection: "row",
//     gap: 5,
//     marginBottom: 10,
//   },
//   progressBarBg: {
//     flex: 1,
//     height: 3,
//     backgroundColor: "rgba(255,255,255,0.3)",
//     borderRadius: 2,
//     overflow: "hidden",
//   },
//   progressBarFill: {
//     backgroundColor: "#fff",
//     height: 3,
//   },
//   userInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   profileImg: { width: 35, height: 35, borderRadius: 20 },
//   username: { color: "#fff", fontSize: 16, fontWeight: "600" },
//   closeBtn: { position: "absolute", right: 0, top: 0 },
//   touchLayer: {
//     position: "absolute",
//     width,
//     height,
//     flexDirection: "row",
//   },
// });
