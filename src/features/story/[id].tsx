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

//   const currentStory = stories[currentIndex];
//   const [paused, setPaused] = useState(false);
//   const progress = useRef(new Animated.Value(0)).current;

//   const player = useVideoPlayer(currentStory?.videoUrl ?? "", (player) => {
//     player.play();
//   });

//   // ⏳ Story Progress Animation
//   useEffect(() => {
//     if (!currentStory) return;

//     progress.setValue(0);
//     Animated.timing(progress, {
//       toValue: 1,
//       duration: (currentStory?.duration ?? 7000),
//       useNativeDriver: false,
//     }).start(({ finished }) => {
//       if (finished) handleNext();
//     });
//   }, [currentIndex]);

//   // 👆 Swipe gesture (left/right)
//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20,
//       onPanResponderRelease: (_, g) => {
//         if (g.dx > 50) handlePrevious();
//         else if (g.dx < -50) handleNext();
//       },
//     })
//   ).current;

//   // ➡️ Next Story
//   const handleNext = () => {
//     if (currentIndex < stories.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else router.back();
//   };

//   // ⬅️ Previous Story
//   const handlePrevious = () => {
//     if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
//     else router.back();
//   };

// //   🔄 Pause/Resume (Long Press)
//   const handleLongPressIn = async () => {
//     setPaused(true);
//     player.pause();
//     // Animated.timing(progress).stop();
//   };

//   const handleLongPressOut = async () => {
//     setPaused(false);
//     player.play();
//     Animated.timing(progress, {
//       toValue: 1,
//       duration: (currentStory?.duration ?? 7000),
//       useNativeDriver: false,
//     }).start(({ finished }) => finished && handleNext());
//   };

//   // 🖱 Tap left/right
//   const handleTap = (evt: any) => {
//     const x = evt.nativeEvent.locationX;
//     if (x < width / 2) handlePrevious();
//     else handleNext();
//   };

//   if (!currentStory) return null;

//   return (
//     <View style={styles.container} {...panResponder.panHandlers}>
//       {/* 🎥 Story Video */}
//       <VideoView
//         key={currentStory.id}
//         player={player}
//         style={styles.video}
//         contentFit="cover"
//         allowsFullscreen={false}
//         allowsPictureInPicture={false}
//       />

//       {/* 🔝 Top UI (progress + user info + close btn) */}
//       <View style={styles.topBar}>
//         {/* Progress Bars */}
//         <View style={styles.progressRow}>
//           {stories.map((_, i) => (
//             <View key={i} style={styles.progressBackground}>
//               <Animated.View
//                 style={[
//                   styles.progressFill,
//                   i === currentIndex
//                     ? {
//                         flex: progress,
//                       }
//                     : i < currentIndex
//                     ? { flex: 1 }
//                     : { flex: 0 },
//                 ]}
//               />
//             </View>
//           ))}
//         </View>

//         {/* User Info */}
//         <View style={styles.userRow}>
//           <Image source={{ uri: currentStory.profilePic }} style={styles.profileImg} />
//           <Text style={styles.username}>{currentStory.username}</Text>
//         </View>

//         {/* Close Button */}
//         <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
//           <Ionicons name="close" size={26} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Invisible Touch Areas */}
//       <View style={styles.touchLayer}>
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           onPress={handleTap}
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
//   progressRow: {
//     flexDirection: "row",
//     gap: 5,
//     marginBottom: 10,
//   },
//   progressBackground: {
//     flex: 1,
//     height: 3,
//     backgroundColor: "rgba(255,255,255,0.3)",
//     borderRadius: 2,
//     overflow: "hidden",
//   },
//   progressFill: {
//     backgroundColor: "#fff",
//   },
//   userRow: {
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


import { useStoryStore } from "@/src/store/useStoryStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function StoryViewPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userStory } = useStoryStore();
  const [currentIndex, setCurrentIndex] = useState(
    userStory ? userStory.stories.findIndex((s) => s.id === Number(id)) : 0
  );

  const currentStory = userStory?.stories[currentIndex];
  const progress = useRef(new Animated.Value(0)).current;
  const [paused, setPaused] = useState(false);

  const player = useVideoPlayer(currentStory?.videoUrl ?? "", (player) => player.play());

  useEffect(() => {
    if (!currentStory) return;
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: currentStory.duration,
      useNativeDriver: false,
    }).start(({ finished }) => finished && handleNext());
  }, [currentIndex]);

  const handleNext = () => {
    if (userStory && currentIndex < userStory.stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else router.back();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
    else router.back();
  };

  const handleLongPressIn = () => {
    setPaused(true);
    player.pause();
  };
  const handleLongPressOut = () => {
    setPaused(false);
    player.play();
  };

  if (!currentStory || !userStory) return null;

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

      {/* Top info */}
      <View style={styles.topBar}>
        <View style={styles.progressRow}>
          {userStory.stories.map((_, i) => (
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

        <View style={styles.userRow}>
          <Image source={{ uri: userStory.profilePic }} style={styles.profileImg} />
          <Text style={styles.username}>{userStory.username}</Text>
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tap left/right areas */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
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
  closeBtn: { position: "absolute", right: 0, top: 0 },
  touchLayer: { position: "absolute", width, height, flexDirection: "row" },
});
