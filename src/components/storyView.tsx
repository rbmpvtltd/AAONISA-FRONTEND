// // import { usePhotoStore } from "@/src/store/useFeedStore";
// // import { Ionicons } from "@expo/vector-icons";
// // import { router, useLocalSearchParams } from "expo-router";
// // import React, { useEffect, useState } from "react";
// // import {
// //   Dimensions,
// //   Image,
// //   Pressable,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";
// // import Animated, {
// //   useAnimatedStyle,
// //   useSharedValue,
// //   withTiming,
// // } from "react-native-reanimated";

// // const { width, height } = Dimensions.get("window");

// // const StoryViewer = () => {
// //   const { id } = useLocalSearchParams();
// //   const storyId = Number(id);
// //   const { stories } = usePhotoStore();

// //   const [currentIndex, setCurrentIndex] = useState<number | null>(null);
// //   const progress = useSharedValue(0);

// //   // useEffect(() => {
// //   //   if (stories.length > 0 && currentIndex === null) {
// //   //     const index = stories.findIndex((s) => s.id === storyId);
// //   //     if (index !== -1) {
// //   //       setCurrentIndex(index);
// //   //     }
// //   //   }
// //   // }, [stories, storyId, currentIndex]);

// // useEffect(() => {
// //   if (stories.length > 0 && currentIndex === null) {
// //     const index = stories.findIndex((s) => s.id === storyId);
// //     setCurrentIndex(index !== -1 ? index : 0);
// //   }
// // }, [stories, storyId, currentIndex]);


// //   useEffect(() => {
// //     if (currentIndex !== null) {
// //       startProgress();
// //     }
// //   }, [currentIndex]);

// //   const startProgress = () => {
// //     progress.value = 0;
// //     progress.value = withTiming(1, { duration: 5000 }, (finished) => {
// //       if (finished) handleNext();
// //     });
// //   };

// //   const handleNext = () => {
// //     if (currentIndex === null) return;
// //     if (currentIndex < stories.length - 1) {
// //       setCurrentIndex(currentIndex + 1);
// //     } else {
// //       router.back();
// //     }
// //   };

// //   const handlePrev = () => {
// //     if (currentIndex === null) return;
// //     if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
// //     else router.back();
// //   };

// //   const progressStyle = useAnimatedStyle(() => ({
// //     transform: [{ scaleX: progress.value }],
// //   }));

// //   if (currentIndex === null || !stories[currentIndex]) return null;
// //   const currentStory = stories[currentIndex];


// // return (
// //     <View style={styles.container}>
// //       {/* Progress bar */}
// //       <View style={styles.progressContainer}>
// //         <Animated.View style={[styles.progressBar, progressStyle]} />
// //       </View>

// //       {/* Header */}
// //       <View style={styles.header}>
// //         <View style={styles.userInfo}>
// //           <Image source={{ uri: currentStory.profilePic }} style={styles.profileImage} />
// //           <Text style={styles.username}>{currentStory.username}</Text>
// //         </View>
// //         <TouchableOpacity onPress={() => router.back()}>
// //           <Ionicons name="close" size={30} color="white" />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Story image */}
// //       <Pressable style={{ flex: 1, flexDirection: "row" }}>
// //         <TouchableOpacity style={{ flex: 1 }} onPress={handlePrev} />
// //         <Image
// //           source={{ uri: currentStory.profilePic }}
// //           style={styles.storyImage}
// //           resizeMode="cover"
// //         />
// //         <TouchableOpacity style={{ flex: 1 }} onPress={handleNext} />
// //       </Pressable>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     backgroundColor: "black",
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   storyImage: {
// //     width,
// //     height,
// //     position: "absolute",
// //   },
// //   progressContainer: {
// //     height: 3,
// //     backgroundColor: "rgba(255,255,255,0.3)",
// //     width: "90%",
// //     marginTop: 40,
// //     alignSelf: "center",
// //     borderRadius: 10,
// //     overflow: "hidden",
// //   },
// //   progressBar: {
// //     height: "100%",
// //     backgroundColor: "white",
// //     transformOrigin: "left center",
// //   },
// //   header: {
// //     position: "absolute",
// //     top: 50,
// //     left: 15,
// //     right: 15,
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     zIndex: 10,
// //   },
// //   profileImage: { width: 35, height: 35, borderRadius: 20, marginRight: 10 },
// //   username: { color: "white", fontSize: 16, fontWeight: "600" },
// //   userInfo: { flexDirection: "row", alignItems: "center" },
// // });

// // export default StoryViewer;

// //===================================================================

// // import { usePhotoStore } from "@/src/store/useFeedStore";
// // import { Ionicons } from "@expo/vector-icons";
// // import { router, useLocalSearchParams } from "expo-router";
// // import React, { useEffect, useState } from "react";
// // import {
// //   Dimensions,
// //   Image,
// //   Pressable,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";
// // import Animated, {
// //   cancelAnimation,
// //   runOnJS,
// //   useAnimatedStyle,
// //   useSharedValue,
// //   withTiming,
// // } from "react-native-reanimated";

// // const { width, height } = Dimensions.get("window");
// // const STORY_DURATION = 5000; // 5 sec per story

// // const StoryViewer = () => {
// //   const { index } = useLocalSearchParams();
// //   const storyIndex = Number(index);
// // const [currentIndex, setCurrentIndex] = useState<number | null>(storyIndex);
// //   const { id } = useLocalSearchParams();
// //   const storyId = Number(id);
// //   const { stories } = usePhotoStore();

// //   // const [currentIndex, setCurrentIndex] = useState<number | null>(null);
// //   const progress = useSharedValue(0);

// //   useEffect(() => {
// //     if (stories.length > 0 && currentIndex === null) {
// //       const index = stories.findIndex((s) => s.id === storyId);
// //       setCurrentIndex(index !== -1 ? index : 0);
// //     }
// //   }, [stories, storyId, currentIndex]);

// //   const moveNext = () => {
// //     if (currentIndex === null) return;
// //     if (currentIndex < stories.length - 1) setCurrentIndex(currentIndex + 1);
// //     else router.back();
// //   };

// //   const handleNext = () => {
// //     cancelAnimation(progress);
// //     moveNext();
// //   };

// //   const handlePrev = () => {
// //     cancelAnimation(progress);
// //     if (currentIndex !== null && currentIndex > 0) setCurrentIndex(currentIndex - 1);
// //     else router.back();
// //   };

// //   useEffect(() => {
// //     if (currentIndex !== null && stories[currentIndex]) {
// //       progress.value = 0;
// //       cancelAnimation(progress);
// //       progress.value = withTiming(1, { duration: STORY_DURATION }, (finished) => {
// //         if (finished) {
// //           runOnJS(moveNext)(); // <-- Reanimated callback me runOnJS use karo
// //         }
// //       });
// //     }
// //     return () => cancelAnimation(progress);
// //   }, [currentIndex, stories]);

// //   if (currentIndex === null || !stories[currentIndex]) return null;
// //   const currentStory = stories[currentIndex];

// //   const progressStyle = useAnimatedStyle(() => ({
// //     transform: [{ scaleX: progress.value }],
// //   }));

// //   return (
// //     <View style={styles.container}>
// //       {/* Progress bar */}
// //       <View style={styles.progressContainer}>
// //         <Animated.View style={[styles.progressBar, progressStyle]} />
// //       </View>

// //       {/* Header */}
// //       <View style={styles.header}>
// //         <View style={styles.userInfo}>
// //           <Image source={{ uri: currentStory.profilePic }} style={styles.profileImage} />
// //           <Text style={styles.username}>{currentStory.username}</Text>
// //         </View>
// //         <TouchableOpacity onPress={() => router.back()}>
// //           <Ionicons name="close" size={30} color="white" />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Tap zones */}
// //       <Pressable style={{ flex: 1, flexDirection: "row" }}>
// //         <TouchableOpacity style={{ flex: 1 }} onPress={handlePrev} />
// //         <Image
// //           source={{ uri: currentStory.profilePic }}
// //           style={styles.storyImage}
// //           resizeMode="cover"
// //         />
// //         <TouchableOpacity style={{ flex: 1 }} onPress={handleNext} />
// //       </Pressable>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     backgroundColor: "black",
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   storyImage: {
// //     width,
// //     height,
// //     position: "absolute",
// //   },
// //   progressContainer: {
// //     height: 3,
// //     backgroundColor: "rgba(255,255,255,0.3)",
// //     width: "90%",
// //     marginTop: 40,
// //     alignSelf: "center",
// //     borderRadius: 10,
// //     overflow: "hidden",
// //   },
// //   progressBar: {
// //     height: "100%",
// //     backgroundColor: "white",
// //     transformOrigin: "left center",
// //   },
// //   header: {
// //     position: "absolute",
// //     top: 50,
// //     left: 15,
// //     right: 15,
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     zIndex: 10,
// //   },
// //   profileImage: { width: 35, height: 35, borderRadius: 20, marginRight: 10 },
// //   username: { color: "white", fontSize: 16, fontWeight: "600" },
// //   userInfo: { flexDirection: "row", alignItems: "center" },
// // });

// // export default StoryViewer;

// // ===========================================================================================

// import { usePhotoStore } from "@/src/store/useFeedStore";
// import { Ionicons } from "@expo/vector-icons";
// import { router, useLocalSearchParams } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Dimensions,
//   Image,
//   Pressable,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Animated, {
//   cancelAnimation,
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";
// import Video, { VideoRef } from "react-native-video"; // <-- react-native-video import

// const { width, height } = Dimensions.get("window");
// const STORY_DURATION = 5000; // fallback if video not ends

// const StoryViewer = () => {
//   const { index } = useLocalSearchParams();
//   const startIndex = Number(index);
//   const { stories, setStories } = usePhotoStore();

//   const [currentIndex, setCurrentIndex] = useState(startIndex);
//   const progress = useSharedValue(0);
//   const [paused, setPaused] = useState(false);
//   const videoRef = useRef<VideoRef | null>(null);

//   const moveNext = () => {
//     if (currentIndex < stories.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       router.back();
//     }
//   };

//   const movePrev = () => {
//     if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
//     else router.back();
//   };

//   const handlePause = (value: boolean) => {
//     setPaused(value);
//     if (value) cancelAnimation(progress);
//     else {
//       progress.value = withTiming(1, { duration: STORY_DURATION }, (finished) => {
//         if (finished) runOnJS(moveNext)();
//       });
//     }
//   };

//   useEffect(() => {
//     if (!stories[currentIndex]) return;

//     // Mark as viewed
//     setStories((prev) =>
//       prev.map((s, i) => (i === currentIndex ? { ...s, viewed: true } : s))
//     );

//     // Reset & play animation
//     progress.value = 0;
//     cancelAnimation(progress);
//     progress.value = withTiming(1, { duration: STORY_DURATION }, (finished) => {
//       if (finished) runOnJS(moveNext)();
//     });
//   }, [currentIndex]);

//   const currentStory = stories[currentIndex];
//   const progressStyle = useAnimatedStyle(() => ({
//     transform: [{ scaleX: progress.value }],
//   }));

//   if (!currentStory) return null;

//   return (
//     <View style={styles.container}>
//       {/* Progress bar */}
//       <View style={styles.progressContainer}>
//         <Animated.View style={[styles.progressBar, progressStyle]} />
//       </View>

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.userInfo}>
//           <Image source={{ uri: currentStory.profilePic }} style={styles.profileImage} />
//           <Text style={styles.username}>{currentStory.username}</Text>
//         </View>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="close" size={30} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Story Video */}
//       <Pressable
//         style={{ flex: 1, flexDirection: "row" }}
//         onLongPress={() => handlePause(true)}
//         onPressOut={() => handlePause(false)}
//       >
//         <TouchableOpacity style={{ flex: 1 }} onPress={movePrev} />
//         <Video
//           ref={videoRef}
//           source={{ uri: currentStory.videoUrl }}
//           style={styles.video}
//           resizeMode="cover" // react-native-video uses string values: 'cover', 'contain', 'stretch'
//           paused={paused} // play/pause
//           repeat={false} // loop
//           onEnd={moveNext} // video finished
//         />
//         <TouchableOpacity style={{ flex: 1 }} onPress={moveNext} />
//       </Pressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "black",
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   video: {
//     width,
//     height,
//     position: "absolute",
//   },
//   progressContainer: {
//     height: 3,
//     backgroundColor: "rgba(255,255,255,0.3)",
//     width: "90%",
//     marginTop: 40,
//     alignSelf: "center",
//     borderRadius: 10,
//     overflow: "hidden",
//   },
//   progressBar: {
//     height: "100%",
//     backgroundColor: "white",
//     transformOrigin: "left center",
//   },
//   header: {
//     position: "absolute",
//     top: 50,
//     left: 15,
//     right: 15,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     zIndex: 10,
//   },
//   profileImage: { width: 35, height: 35, borderRadius: 20, marginRight: 10 },
//   username: { color: "white", fontSize: 16, fontWeight: "600" },
//   userInfo: { flexDirection: "row", alignItems: "center" },
// });

// export default StoryViewer;
