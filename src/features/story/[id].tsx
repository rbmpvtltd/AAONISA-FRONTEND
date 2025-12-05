// import { markViewed } from "@/app/story/api";
// import { markViewed } from "@/app/(story)/api";
// import { useStoryStore } from "@/src/store/useStoryStore";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { VideoView, useVideoPlayer } from "expo-video";
// import React, { useEffect, useRef, useState } from "react";
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

//   // ✅ Find user by story Id (no owner needed)
//   const userStory = userStories.find((user) =>
//     user.stories.some((story) => story.id === id)
//   );

//   const storyList = userStory?.stories || [];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (userStory) {
//       const idx = userStory.stories.findIndex((s) => s.id === id);
//       if (idx !== -1) setCurrentIndex(idx);
//     }
//   }, [userStory, id]);

//   const currentStory = storyList[currentIndex];

//   const progress = useRef(new Animated.Value(0)).current;
//   const [paused, setPaused] = useState(false);

//   const player = useVideoPlayer(currentStory?.videoUrl ?? "", (player) =>
//     player.play()
//   );

//   useEffect(() => {
//     if (!currentStory) return;

//     // Backend mark read
//     markViewed(currentStory.id);

//     // Local state update
//     markStoryViewed(currentStory.id);

//     progress.setValue(0);
//     Animated.timing(progress, {
//       toValue: 1,
//       duration: currentStory.duration,
//       useNativeDriver: false,
//     }).start(({ finished }) => finished && handleNext());
//   }, [currentIndex]);

//   const handleNext = () => {
//     if (currentIndex < storyList.length - 1) {
//       setCurrentIndex((i) => i + 1);
//     } else router.back();
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) setCurrentIndex((i) => i - 1);
//     else router.back();
//   };

//   const handleLongPressIn = () => {
//     setPaused(true);
//     player.pause();
//   };
//   const handleLongPressOut = () => {
//     setPaused(false);
//     player.play();
//   };

//   // UI safety
//   if (!userStory) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "#fff" }}>Story not found</Text>
//       </View>
//     );
//   }

//   if (!currentStory) return null;

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

//       {/* Top info */}
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
//                     ? { flex: 1 }
//                     : { flex: 0 },
//                 ]}
//               />
//             </View>
//           ))}
//         </View>

//         <View style={styles.userRow}>
//           <Image
//             source={{ uri: userStory.profilePic }}
//             style={styles.profileImg}
//           />
//           <Text style={styles.username}>{userStory.username}</Text>
//         </View>

//         <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
//           <Ionicons name="close" size={26} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Tap Areas */}
//       <View style={styles.touchLayer}>
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

// ============================================================================

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

//   // ✅ find user that contains this story
//   const userStory = userStories.find((u) =>
//     u.stories.some((s) => s.id === id)
//   );

//   const storyList = userStory?.stories || [];
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (userStory && id) {
//       const idx = userStory.stories.findIndex((s) => s.id === id);
//       if (idx !== -1) setCurrentIndex(idx);
//     }
//   }, [userStory, id]);

//   const currentStory = storyList[currentIndex];

//   const progress = useRef(new Animated.Value(0)).current;
//   const [paused, setPaused] = useState(false);

//   // ✅ stable player
//   const player = useVideoPlayer(currentStory?.videoUrl ?? "");

//   useEffect(() => {
//     if (!currentStory) return;

//     player.replace(currentStory.videoUrl);
//     if (!paused) player.play();
//   }, [currentStory, paused]);

//   // ✅ correct animation logic
//   useEffect(() => {
//     if (!currentStory) return;

//     markStoryViewed(currentStory.id);

//     progress.stopAnimation();
//     progress.setValue(0);

//     const anim = Animated.timing(progress, {
//       toValue: 1,
//       duration: currentStory.duration * 1000, // ✅ seconds to ms
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
//     } else {
//       router.back();
//     }
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex((i) => i - 1);
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

//   if (!userStory || !currentStory) {
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

//       {/* Header */}
//       <View style={styles.topBar}>
//         {/* Progress bars */}
//         <View style={styles.progressRow}>
//           {storyList.map((_, i) => (
//             <View key={i} style={styles.progressBackground}>
//               <Animated.View
//                 style={[
//                   styles.progressFill,
//                   i === currentIndex
//                     ? { flex: progress }
//                     : i < currentIndex
//                     ? { flex: 1 }
//                     : { flex: 0 },
//                 ]}
//               />
//             </View>
//           ))}
//         </View>

//         {/* User */}
//         <View style={styles.userRow}>
//           <Image source={{ uri: userStory.profilePic }} style={styles.profileImg} />
//           <Text style={styles.username}>{userStory.username}</Text>
//         </View>

//         <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
//           <Ionicons name="close" size={26} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Touch navigation */}
//       <View style={styles.touchLayer}>
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

// // ==========================================================================================================

import { useStoryStore } from "@/src/store/useStoryStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";
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
  const { userStories, markStoryViewed } = useStoryStore();

  const userStory = userStories.find((u) =>
    u.stories.some((s) => s.id === id)
  );

  const storyList = userStory?.stories || [];
//  console.log("ddddddddddddduuuuuu", storyList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const [paused, setPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMuteIcon, setShowMuteIcon] = useState(false);
  const [globalUserIndex, setGlobalUserIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);

  const player = useVideoPlayer("");

  useEffect(() => {
    if (player) {
      player.volume = isMuted ? 0 : 1.0;
    }
  }, [isMuted, player]);


  const currentStory = storyList[currentIndex];
//  console.log('====================================');
//  console.log(currentStory.duration);
//  console.log('====================================');

  //  Set initial index only once on mount
  useEffect(() => {
    if (userStory && id) {
      const idx = userStory.stories.findIndex((s) => s.id === id);
      if (idx !== -1) {
        console.log(" Initial story index:", idx);
        setCurrentIndex(idx);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  
  //  Progress animation
  useEffect(() => {
    if (!currentStory) return;

    markStoryViewed(currentStory.id);

    progress.stopAnimation();
    progress.setValue(0);


    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: (currentStory.duration) * 1000,
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
    // console.log(" Pause story");
    setPaused(true);
    player.pause();
  };

  const handleLongPressOut = () => {
    setPaused(false);
    player.play();
  };

  if (!userStory || storyList.length === 0 || !currentStory) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Loading...</Text>
      </View>
    );
  }


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
              router.push(`/profile/${userStory.username}`);
            }}
          >
            <Image source={{ uri: userStory.profilePic }} style={styles.profileImg} />
            <Text style={styles.username}>{userStory.username}</Text>
          </TouchableOpacity>
        </View>

        {/* Close */}
        {/* <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity> */}
      </View>

      {/* Tap left/right */}
      <View style={styles.touchLayer} >
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

      {/* Close button ko alag, upar layer me dikhaye */}
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
  closeBtn: { position: "absolute", right: 0, top: 0 },
  touchLayer: { position: "absolute", width, height, flexDirection: "row" },
});

