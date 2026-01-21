// import { useStoriesQuery } from "@/src/hooks/storyMutation";
// import { getCachedVideo } from "@/src/utils/videoCache";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { VideoView, useVideoPlayer } from "expo-video";
// import { useEffect, useMemo, useRef, useState } from "react";
// import {
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const EMPTY_VIDEO =
//   "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Blank.mp4";

// export default function StoryViewer() {
//   const router = useRouter();
//   const { ownerId, startIndex } = useLocalSearchParams<{
//     ownerId: string;
//     startIndex: string;
//   }>();

//   const { data: userStories = [], isLoading } = useStoriesQuery();

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const autoTimer = useRef<NodeJS.Timeout | number>(null);

//   /** ---------------- FIND STORIES ---------------- */
//   const currentUserStories = useMemo(() => {
//     return userStories.find((u: any) => u.owner === ownerId);
//   }, [userStories, ownerId]);

//   const storyList = currentUserStories?.stories ?? [];

//   const prevStory = storyList[currentIndex - 1];
//   const currentStory = storyList[currentIndex];
//   const nextStory = storyList[currentIndex + 1];
//   const [showThumbnail, setShowThumbnail] = useState(true);

//   /** ---------------- PLAYERS ---------------- */
//   const prevPlayer = useVideoPlayer(EMPTY_VIDEO);
//   const currentPlayer = useVideoPlayer(EMPTY_VIDEO);
//   const nextPlayer = useVideoPlayer(EMPTY_VIDEO);

//   /** ---------------- INITIAL INDEX ---------------- */
//   useEffect(() => {
//     if (startIndex && !isNaN(Number(startIndex))) {
//       setCurrentIndex(Number(startIndex));
//     }
//   }, [startIndex]);
//   useEffect(() => {
//   const sub = currentPlayer.addListener("statusChange", (e) => {
//     if (e.status === "readyToPlay") {
//       setShowThumbnail(false);
//     }
//     if (e.status === "loading") {
//       setShowThumbnail(true);
//     }
//   });

//   return () => sub.remove();
// }, []);

//   useEffect(() => {
//   let cancelled = false;

//   async function load() {
//     if (!currentStory) return;
//     setShowThumbnail(true);
//     const currentPath = await getCachedVideo(currentStory.videoUrl);
//     if (!cancelled) {
//       currentPlayer.replace(currentPath);
//       currentPlayer.play();
//     }

//     if (nextStory?.videoUrl) {
//       const nextPath = await getCachedVideo(nextStory.videoUrl);
//       if (!cancelled) nextPlayer.replace(nextPath);
//     }

//     if (prevStory?.videoUrl) {
//       const prevPath = await getCachedVideo(prevStory.videoUrl);
//       if (!cancelled) prevPlayer.replace(prevPath);
//     }
//   }

//   load();
//   return () => {
//     cancelled = true;
//   };
// }, [currentIndex]);

//   /** ---------------- CONTROLS ---------------- */
//   const handleNext = () => {
//     if (currentIndex < storyList.length - 1) {
//       setCurrentIndex(i => i + 1);
//     } else {
//       router.back();
//     }
//   };

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(i => i - 1);
//     }
//   };

//   const pause = () => {
//     currentPlayer.pause();
//     if (autoTimer.current) clearTimeout(autoTimer.current);
//   };

//   const resume = () => {
//     currentPlayer.play();
//     autoTimer.current = setTimeout(() => {
//       handleNext();
//     }, (currentStory?.duration ?? 5) * 1000);
//   };

//   /** ---------------- GUARDS ---------------- */
//   if (isLoading) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "white" }}>Loading…</Text>
//       </View>
//     );
//   }

//   if (!currentStory) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "white" }}>No story</Text>
//       </View>
//     );
//   }

//   /** ---------------- UI ---------------- */
//   return (
//     <View style={styles.container}>
//       {/* PRELOAD */}
//       {prevStory && (
//         <VideoView
//           player={prevPlayer}
//           style={styles.hidden}
//           contentFit="cover"
//         />
//       )}

//       {/* CURRENT */}
//       <VideoView
//         player={currentPlayer}
//         style={styles.video}
//         contentFit="cover"
//       />
    
//       {/* PRELOAD */}
//       {nextStory && (
//         <VideoView
//           player={nextPlayer}
//           style={styles.hidden}
//           contentFit="cover"
//         />
//       )}
        
//       {/* TOUCH LAYERS */}
//       <View style={styles.touchLayer}>
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           onPress={handlePrev}
//           onLongPress={pause}
//           onPressOut={resume}
//           delayLongPress={150}
//         />
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           onPress={handleNext}
//           onLongPress={pause}
//           onPressOut={resume}
//           delayLongPress={150}
//         />
//       </View>
      
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   center: {
//     flex: 1,
//     backgroundColor: "black",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   video: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//   },
//   hidden: {
//     position: "absolute",
//     width: 1,
//     height: 1,
//     opacity: 0,
//   },
//   touchLayer: {
//     ...StyleSheet.absoluteFillObject,
//     flexDirection: "row",
//   },
// });
import { useStoriesQuery } from "@/src/hooks/storyMutation";
import { getCachedVideo } from "@/src/utils/videoCache";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const EMPTY_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Blank.mp4";

export default function StoryViewer() {
  const router = useRouter();
  const { ownerId, startIndex } = useLocalSearchParams<{
    ownerId: string;
    startIndex: string;
  }>();

  const { data: userStories = [], isLoading } = useStoriesQuery();

  const progress = useRef(new Animated.Value(0)).current;

  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showThumbnail, setShowThumbnail] = useState(true);

  /** ---------------- USERS ---------------- */
  useEffect(() => {
    const idx = userStories.findIndex((u: any) => u.owner === ownerId);
    if (idx !== -1) setCurrentUserIndex(idx);
  }, [userStories, ownerId]);

  useEffect(() => {
    if (startIndex && !isNaN(Number(startIndex))) {
      setCurrentIndex(Number(startIndex));
    }
  }, [startIndex]);

  const currentUserStories = userStories[currentUserIndex];
  const storyList = currentUserStories?.stories ?? [];

  const prevStory = storyList[currentIndex - 1];
  const currentStory = storyList[currentIndex];
  const nextStory = storyList[currentIndex + 1];

  /** ---------------- PLAYERS ---------------- */
  const prevPlayer = useVideoPlayer(EMPTY_VIDEO);
  const currentPlayer = useVideoPlayer(EMPTY_VIDEO);
  const nextPlayer = useVideoPlayer(EMPTY_VIDEO);

  /** ---------------- THUMBNAIL LISTENER ---------------- */
  useEffect(() => {
    const sub = currentPlayer.addListener("statusChange", e => {
      if (e.status === "readyToPlay") setShowThumbnail(false);
      if (e.status === "loading") setShowThumbnail(true);
    });
    return () => sub.remove();
  }, []);

  /** ---------------- LOAD VIDEOS ---------------- */
  useEffect(() => {
    let cancelled = false;
    setShowThumbnail(true);

    async function load() {
      if (!currentStory) return;

      const currentPath = await getCachedVideo(currentStory.videoUrl);
      if (!cancelled) {
        currentPlayer.replace(currentPath);
        currentPlayer.play();
      }

      if (nextStory?.videoUrl) {
        const p = await getCachedVideo(nextStory.videoUrl);
        if (!cancelled) nextPlayer.replace(p);
      }

      if (prevStory?.videoUrl) {
        const p = await getCachedVideo(prevStory.videoUrl);
        if (!cancelled) prevPlayer.replace(p);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentIndex, currentUserIndex]);

  /** ---------------- PROGRESS ---------------- */
  useEffect(() => {
    if (!currentStory) return;

    progress.stopAnimation();
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: (currentStory.duration ?? 5) * 1000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) handleNext();
    });

    return () => progress.stopAnimation();
  }, [currentIndex, currentUserIndex]);

  /** ---------------- NAVIGATION ---------------- */
  const handleNext = () => {
    if (currentIndex < storyList.length - 1) {
      setCurrentIndex(i => i + 1);
      return;
    }

    // move to next user
    if (currentUserIndex < userStories.length - 1) {
      setCurrentUserIndex(i => i + 1);
      setCurrentIndex(0);
      return;
    }

    router.back();
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      return;
    }

    // move to previous user
    if (currentUserIndex > 0) {
      const prevUser = userStories[currentUserIndex - 1];
      setCurrentUserIndex(i => i - 1);
      setCurrentIndex(prevUser.stories.length - 1);
    } else {
      router.back();
    }
  };

  const pause = () => {
    currentPlayer.pause();
    progress.stopAnimation();
  };

  const resume = () => {
    currentPlayer.play();
    Animated.timing(progress, {
      toValue: 1,
      duration: (currentStory?.duration ?? 5) * 1000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) handleNext();
    });
  };

  /** ---------------- GUARDS ---------------- */
  if (isLoading || !currentStory) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Loading…</Text>
      </View>
    );
  }

  /** ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      {/* PROGRESS */}
      <View style={styles.progressRow}>
        {storyList.map((_: any, i: number) => (
          <View key={i} style={styles.progressBg}>
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

      {/* VIDEO */}
      <VideoView player={currentPlayer} style={styles.video} contentFit="cover" />

      {showThumbnail && currentStory.thumbnailUrl && (
        <Image
          source={{ uri: currentStory.thumbnailUrl }}
          style={styles.video}
          resizeMode="cover"
        />
      )}

      {/* TOUCH */}
      <View style={styles.touchLayer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={handlePrev}
          onLongPress={pause}
          onPressOut={resume}
          delayLongPress={150}
        />
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={handleNext}
          onLongPress={pause}
          onPressOut={resume}
          delayLongPress={150}
        />
      </View>
    </View>
  );
}

/** ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  center: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  touchLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  progressRow: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    flexDirection: "row",
    gap: 4,
    zIndex: 10,
  },
  progressBg: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
  },
});
