// // // import { useStoriesQuery } from "@/src/hooks/storyMutation";
// // // import { getCachedVideo } from "@/src/utils/videoCache";
// // // import { useLocalSearchParams, useRouter } from "expo-router";
// // // import { VideoView, useVideoPlayer } from "expo-video";
// // // import { useEffect, useMemo, useRef, useState } from "react";
// // // import {
// // //     StyleSheet,
// // //     Text,
// // //     TouchableOpacity,
// // //     View,
// // // } from "react-native";

// // // const EMPTY_VIDEO =
// // //   "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Blank.mp4";

// // // export default function StoryViewer() {
// // //   const router = useRouter();
// // //   const { ownerId, startIndex } = useLocalSearchParams<{
// // //     ownerId: string;
// // //     startIndex: string;
// // //   }>();

// // //   const { data: userStories = [], isLoading } = useStoriesQuery();

// // //   const [currentIndex, setCurrentIndex] = useState(0);
// // //   const autoTimer = useRef<NodeJS.Timeout | number>(null);

// // //   /** ---------------- FIND STORIES ---------------- */
// // //   const currentUserStories = useMemo(() => {
// // //     return userStories.find((u: any) => u.owner === ownerId);
// // //   }, [userStories, ownerId]);

// // //   const storyList = currentUserStories?.stories ?? [];

// // //   const prevStory = storyList[currentIndex - 1];
// // //   const currentStory = storyList[currentIndex];
// // //   const nextStory = storyList[currentIndex + 1];
// // //   const [showThumbnail, setShowThumbnail] = useState(true);

// // //   /** ---------------- PLAYERS ---------------- */
// // //   const prevPlayer = useVideoPlayer(EMPTY_VIDEO);
// // //   const currentPlayer = useVideoPlayer(EMPTY_VIDEO);
// // //   const nextPlayer = useVideoPlayer(EMPTY_VIDEO);

// // //   /** ---------------- INITIAL INDEX ---------------- */
// // //   useEffect(() => {
// // //     if (startIndex && !isNaN(Number(startIndex))) {
// // //       setCurrentIndex(Number(startIndex));
// // //     }
// // //   }, [startIndex]);
// // //   useEffect(() => {
// // //   const sub = currentPlayer.addListener("statusChange", (e) => {
// // //     if (e.status === "readyToPlay") {
// // //       setShowThumbnail(false);
// // //     }
// // //     if (e.status === "loading") {
// // //       setShowThumbnail(true);
// // //     }
// // //   });

// // //   return () => sub.remove();
// // // }, []);

// // //   useEffect(() => {
// // //   let cancelled = false;

// // //   async function load() {
// // //     if (!currentStory) return;
// // //     setShowThumbnail(true);
// // //     const currentPath = await getCachedVideo(currentStory.videoUrl);
// // //     if (!cancelled) {
// // //       currentPlayer.replace(currentPath);
// // //       currentPlayer.play();
// // //     }

// // //     if (nextStory?.videoUrl) {
// // //       const nextPath = await getCachedVideo(nextStory.videoUrl);
// // //       if (!cancelled) nextPlayer.replace(nextPath);
// // //     }

// // //     if (prevStory?.videoUrl) {
// // //       const prevPath = await getCachedVideo(prevStory.videoUrl);
// // //       if (!cancelled) prevPlayer.replace(prevPath);
// // //     }
// // //   }

// // //   load();
// // //   return () => {
// // //     cancelled = true;
// // //   };
// // // }, [currentIndex]);

// // //   /** ---------------- CONTROLS ---------------- */
// // //   const handleNext = () => {
// // //     if (currentIndex < storyList.length - 1) {
// // //       setCurrentIndex(i => i + 1);
// // //     } else {
// // //       router.back();
// // //     }
// // //   };

// // //   const handlePrev = () => {
// // //     if (currentIndex > 0) {
// // //       setCurrentIndex(i => i - 1);
// // //     }
// // //   };

// // //   const pause = () => {
// // //     currentPlayer.pause();
// // //     if (autoTimer.current) clearTimeout(autoTimer.current);
// // //   };

// // //   const resume = () => {
// // //     currentPlayer.play();
// // //     autoTimer.current = setTimeout(() => {
// // //       handleNext();
// // //     }, (currentStory?.duration ?? 5) * 1000);
// // //   };

// // //   /** ---------------- GUARDS ---------------- */
// // //   if (isLoading) {
// // //     return (
// // //       <View style={styles.center}>
// // //         <Text style={{ color: "white" }}>Loading…</Text>
// // //       </View>
// // //     );
// // //   }

// // //   if (!currentStory) {
// // //     return (
// // //       <View style={styles.center}>
// // //         <Text style={{ color: "white" }}>No story</Text>
// // //       </View>
// // //     );
// // //   }

// // //   /** ---------------- UI ---------------- */
// // //   return (
// // //     <View style={styles.container}>
// // //       {/* PRELOAD */}
// // //       {prevStory && (
// // //         <VideoView
// // //           player={prevPlayer}
// // //           style={styles.hidden}
// // //           contentFit="cover"
// // //         />
// // //       )}

// // //       {/* CURRENT */}
// // //       <VideoView
// // //         player={currentPlayer}
// // //         style={styles.video}
// // //         contentFit="cover"
// // //       />

// // //       {/* PRELOAD */}
// // //       {nextStory && (
// // //         <VideoView
// // //           player={nextPlayer}
// // //           style={styles.hidden}
// // //           contentFit="cover"
// // //         />
// // //       )}

// // //       {/* TOUCH LAYERS */}
// // //       <View style={styles.touchLayer}>
// // //         <TouchableOpacity
// // //           style={{ flex: 1 }}
// // //           onPress={handlePrev}
// // //           onLongPress={pause}
// // //           onPressOut={resume}
// // //           delayLongPress={150}
// // //         />
// // //         <TouchableOpacity
// // //           style={{ flex: 1 }}
// // //           onPress={handleNext}
// // //           onLongPress={pause}
// // //           onPressOut={resume}
// // //           delayLongPress={150}
// // //         />
// // //       </View>

// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: "black",
// // //   },
// // //   center: {
// // //     flex: 1,
// // //     backgroundColor: "black",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   video: {
// // //     position: "absolute",
// // //     width: "100%",
// // //     height: "100%",
// // //   },
// // //   hidden: {
// // //     position: "absolute",
// // //     width: 1,
// // //     height: 1,
// // //     opacity: 0,
// // //   },
// // //   touchLayer: {
// // //     ...StyleSheet.absoluteFillObject,
// // //     flexDirection: "row",
// // //   },
// // // });


// // import { useStoriesQuery } from "@/src/hooks/storyMutation";
// // import { getCachedVideo } from "@/src/utils/videoCache";
// // import { useLocalSearchParams, useRouter } from "expo-router";
// // import { VideoView, useVideoPlayer } from "expo-video";
// // import { useEffect, useRef, useState } from "react";
// // import {
// //   Animated,
// //   Image,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";

// // const EMPTY_VIDEO =
// //   "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Blank.mp4";

// // export default function StoryViewer() {
// //   const router = useRouter();
// //   const { ownerId, startIndex } = useLocalSearchParams<{
// //     ownerId: string;
// //     startIndex: string;
// //   }>();

// //   const { data: userStories = [], isLoading } = useStoriesQuery();

// //   const progress = useRef(new Animated.Value(0)).current;

// //   const [currentUserIndex, setCurrentUserIndex] = useState(0);
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [showThumbnail, setShowThumbnail] = useState(true);

// //   /** ---------------- USERS ---------------- */
// //   useEffect(() => {
// //     const idx = userStories.findIndex((u: any) => u.owner === ownerId);
// //     if (idx !== -1) setCurrentUserIndex(idx);
// //   }, [userStories, ownerId]);

// //   useEffect(() => {
// //     if (startIndex && !isNaN(Number(startIndex))) {
// //       setCurrentIndex(Number(startIndex));
// //     }
// //   }, [startIndex]);

// //   const currentUserStories = userStories[currentUserIndex];
// //   const storyList = currentUserStories?.stories ?? [];

// //   const prevStory = storyList[currentIndex - 1];
// //   const currentStory = storyList[currentIndex];
// //   const nextStory = storyList[currentIndex + 1];

// //   /** ---------------- PLAYERS ---------------- */
// //   const prevPlayer = useVideoPlayer(EMPTY_VIDEO);
// //   const currentPlayer = useVideoPlayer(EMPTY_VIDEO);
// //   const nextPlayer = useVideoPlayer(EMPTY_VIDEO);

// //   /** ---------------- THUMBNAIL LISTENER ---------------- */
// //   useEffect(() => {
// //     const sub = currentPlayer.addListener("statusChange", e => {
// //       if (e.status === "readyToPlay") setShowThumbnail(false);
// //       if (e.status === "loading") setShowThumbnail(true);
// //     });
// //     return () => sub.remove();
// //   }, []);

// //   /** ---------------- LOAD VIDEOS ---------------- */
// //   useEffect(() => {
// //     let cancelled = false;
// //     setShowThumbnail(true);

// //     async function load() {
// //       if (!currentStory) return;

// //       const currentPath = await getCachedVideo(currentStory.videoUrl);
// //       if (!cancelled) {
// //         currentPlayer.replace(currentPath);
// //         currentPlayer.play();
// //       }

// //       if (nextStory?.videoUrl) {
// //         const p = await getCachedVideo(nextStory.videoUrl);
// //         if (!cancelled) nextPlayer.replace(p);
// //         console.log('nextPlayer.replace(p)', nextPlayer.replace(p));
// //       }

// //       if (prevStory?.videoUrl) {
// //         const p = await getCachedVideo(prevStory.videoUrl);
// //         if (!cancelled) prevPlayer.replace(p);
// //       }
// //     }

// //     load();
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [currentIndex, currentUserIndex]);

// //   /** ---------------- PROGRESS ---------------- */
// //   useEffect(() => {
// //     if (!currentStory) return;

// //     progress.stopAnimation();
// //     progress.setValue(0);

// //     Animated.timing(progress, {
// //       toValue: 1,
// //       duration: (currentStory.duration ?? 5) * 1000,
// //       useNativeDriver: false,
// //     }).start(({ finished }) => {
// //       if (finished) handleNext();
// //     });

// //     return () => progress.stopAnimation();
// //   }, [currentIndex, currentUserIndex]);

// //   /** ---------------- NAVIGATION ---------------- */
// //   const handleNext = () => {
// //     if (currentIndex < storyList.length - 1) {
// //       setCurrentIndex(i => i + 1);
// //       return;
// //     }

// //     // move to next user
// //     if (currentUserIndex < userStories.length - 1) {
// //       setCurrentUserIndex(i => i + 1);
// //       setCurrentIndex(0);
// //       return;
// //     }

// //     router.back();
// //   };

// //   const handlePrev = () => {
// //     if (currentIndex > 0) {
// //       setCurrentIndex(i => i - 1);
// //       return;
// //     }

// //     // move to previous user
// //     if (currentUserIndex > 0) {
// //       const prevUser = userStories[currentUserIndex - 1];
// //       setCurrentUserIndex(i => i - 1);
// //       setCurrentIndex(prevUser.stories.length - 1);
// //     } else {
// //       router.back();
// //     }
// //   };

// //   const pause = () => {
// //     currentPlayer.pause();
// //     progress.stopAnimation();
// //   };

// //   const resume = () => {
// //     currentPlayer.play();
// //     Animated.timing(progress, {
// //       toValue: 1,
// //       duration: (currentStory?.duration ?? 5) * 1000,
// //       useNativeDriver: false,
// //     }).start(({ finished }) => {
// //       if (finished) handleNext();
// //     });
// //   };

// //   /** ---------------- GUARDS ---------------- */
// //   if (isLoading || !currentStory) {
// //     return (
// //       <View style={styles.center}>
// //         <Text style={{ color: "white" }}>Loading…</Text>
// //       </View>
// //     );
// //   }

// //   /** ---------------- UI ---------------- */
// //   return (
// //     <View style={styles.container}>
// //       {/* PROGRESS */}
// //       <View style={styles.progressRow}>
// //         {storyList.map((_: any, i: number) => (
// //           <View key={i} style={styles.progressBg}>
// //             <Animated.View
// //               style={[
// //                 styles.progressFill,
// //                 i === currentIndex
// //                   ? { flex: progress }
// //                   : i < currentIndex
// //                     ? { flex: 1 }
// //                     : { flex: 0 },
// //               ]}
// //             />
// //           </View>
// //         ))}
// //       </View>

// //       {/* VIDEO */}
// //       <VideoView player={currentPlayer} style={styles.video} contentFit="cover" />

// //       {showThumbnail && currentStory.thumbnailUrl && (
// //         <Image
// //           source={{ uri: currentStory.thumbnailUrl }}
// //           style={styles.video}
// //           resizeMode="cover"
// //         />
// //       )}

// //       {/* TOUCH */}
// //       <View style={styles.touchLayer}>
// //         <TouchableOpacity
// //           style={{ flex: 1 }}
// //           onPress={handlePrev}
// //           onLongPress={pause}
// //           onPressOut={resume}
// //           delayLongPress={150}
// //         />
// //         <TouchableOpacity
// //           style={{ flex: 1 }}
// //           onPress={handleNext}
// //           onLongPress={pause}
// //           onPressOut={resume}
// //           delayLongPress={150}
// //         />
// //       </View>
// //     </View>
// //   );
// // }

// // /** ---------------- STYLES ---------------- */
// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "black" },
// //   center: {
// //     flex: 1,
// //     backgroundColor: "black",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   video: {
// //     position: "absolute",
// //     width: "100%",
// //     height: "100%",
// //   },
// //   touchLayer: {
// //     ...StyleSheet.absoluteFillObject,
// //     flexDirection: "row",
// //   },
// //   progressRow: {
// //     position: "absolute",
// //     top: 40,
// //     left: 10,
// //     right: 10,
// //     flexDirection: "row",
// //     gap: 4,
// //     zIndex: 10,
// //   },
// //   progressBg: {
// //     flex: 1,
// //     height: 3,
// //     backgroundColor: "rgba(255,255,255,0.3)",
// //     borderRadius: 2,
// //     overflow: "hidden",
// //   },
// //   progressFill: {
// //     height: "100%",
// //     backgroundColor: "#fff",
// //   },
// // });

import { GetCurrentUser } from "@/src/api/profile-api";
import { markViewed } from "@/src/api/story-api";
import { useStoriesQuery } from "@/src/hooks/storyMutation";
import { useDeleteVideo } from "@/src/hooks/videosMutation";
import { useSocketManager } from "@/src/socket/socket";
import { useViewStore } from "@/src/store/viewStore";
import { formatCount } from "@/src/utils/formatCount";
import { timeAgo } from "@/src/utils/timeAgo";
import { getCachedVideo } from "@/src/utils/videoCache";
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
const EMPTY_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Blank.mp4";

export default function StoryViewer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { ownerId, startIndex } = useLocalSearchParams<{
    ownerId: string;
    startIndex: string;
  }>();

  const { data: userStories = [], isLoading } = useStoriesQuery();
  const progress = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef<Animated.CompositeAnimation | null>(null);

  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [paused, setPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

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
  const isOwnStory = currentUserStories?.self === true;

  const prevStory = storyList[currentIndex - 1];
  const currentStory = storyList[currentIndex];
  const nextStory = storyList[currentIndex + 1];

  /** ---------------- PLAYERS ---------------- */
  const prevPlayer = useVideoPlayer(EMPTY_VIDEO);
  const currentPlayer = useVideoPlayer(EMPTY_VIDEO);
  const nextPlayer = useVideoPlayer(EMPTY_VIDEO);

  /** ---------------- CURRENT USER & SOCKET ---------------- */
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });

  const socket = useSocketManager(currentUser?.id);
  const storyId = currentStory?.id;
  const { setViews, resetViews, setNewStory, views, addSingleView } = useViewStore() as any;

  /** ---------------- DELETE MUTATION ---------------- */
  const deleteVideo = useDeleteVideo();

  /** ---------------- THUMBNAIL & VIDEO STATUS LISTENER ---------------- */
  useEffect(() => {
    const sub = currentPlayer.addListener("statusChange", (e) => {
      console.log("🎥 VIDEO STATUS:", e.status);

      if (e.status === "loading") {
        setIsVideoLoading(true);
        setShowThumbnail(true);
        setIsVideoReady(false);
      }

      if (e.status === "readyToPlay") {
        setIsVideoLoading(false);
        setShowThumbnail(false);
        setIsVideoReady(true);
      }
    });
    return () => sub.remove();
  }, []);

  /** ---------------- VOLUME CONTROL ---------------- */
  useEffect(() => {
    if (currentPlayer) {
      currentPlayer.volume = isMuted ? 0 : 1.0;
    }
  }, [isMuted, currentPlayer]);

  /** ---------------- LOAD VIDEOS WITH CACHE ---------------- */
  useEffect(() => {
    let cancelled = false;
    setShowThumbnail(true);

    async function load() {
      if (!currentStory) return;

      const currentPath = await getCachedVideo(currentStory.videoUrl);
      if (!cancelled) {
        currentPlayer.replace(currentPath);
        currentPlayer.volume = isMuted ? 0 : 1.0;
        if (!paused) currentPlayer.play();
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

  /** ---------------- SOCKET EFFECT FOR STORY VIEWS ---------------- */
  useEffect(() => {
    if (!socket || !storyId || !currentUser) return;

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
  }, [socket, storyId, currentUser]);

  /** ---------------- PROGRESS ANIMATION - INSTAGRAM STYLE ---------------- */
  useEffect(() => {
    if (!currentStory || !socket || !currentUser) return;
    if (!isVideoReady) return;

    // Mark story as viewed
    if (!isOwnStory) {
      markViewed(storyId);
      socket.emit("viewStory", {
        userId: currentUser.id,
        storyId,
      });
    }

    // Mark locally
    setViewedStories((prev) => new Set(prev).add(currentStory.id));

    // Reset progress
    progress.setValue(0);

    // Start new animation
    const duration = (currentStory.duration ?? 5) * 1000;
    progressAnim.current = Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    });

    progressAnim.current.start(({ finished }) => {
      if (finished) handleNext();
    });

    return () => {
      if (progressAnim.current) {
        progressAnim.current.stop();
      }
    };
  }, [currentIndex, currentUserIndex, isVideoReady]);

  /** ---------------- NAVIGATION ---------------- */
  const handleNext = () => {
    if (currentIndex < storyList.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }

    // Move to next user
    if (currentUserIndex < userStories.length - 1) {
      setCurrentUserIndex((i) => i + 1);
      setCurrentIndex(0);
      return;
    }

    router.back();
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      return;
    }

    // Move to previous user
    if (currentUserIndex > 0) {
      const prevUser = userStories[currentUserIndex - 1];
      setCurrentUserIndex((i) => i - 1);
      setCurrentIndex(prevUser.stories.length - 1);
    } else {
      router.back();
    }
  };

  const handleLongPressIn = () => {
    setPaused(true);
    currentPlayer.pause();

    // Pause progress animation - Instagram style
    if (progressAnim.current) {
      progressAnim.current.stop();
    }
  };

  const handleLongPressOut = () => {
    if (!paused) return;

    setPaused(false);
    currentPlayer.play();

    // Resume progress from where it stopped - Instagram style
    if (currentStory) {
      progress.stopAnimation((state: any) => {
        const currentProgress = state.value;
        const remainingProgress = 1 - currentProgress;
        const duration = (currentStory.duration ?? 5) * 1000;
        const remainingDuration = duration * remainingProgress;

        if (remainingDuration > 0) {
          progressAnim.current = Animated.timing(progress, {
            toValue: 1,
            duration: remainingDuration,
            useNativeDriver: false,
          });

          progressAnim.current.start(({ finished }) => {
            if (finished) handleNext();
          });
        }
      });
    }
  };

  /** ---------------- DELETE STORY ---------------- */
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
                queryClient.invalidateQueries({ queryKey: ["stories"] });
                router.back();
              },
            });
          },
        },
      ]
    );
  };

  /** ---------------- TOGGLE VIEWERS ---------------- */
  const toggleViewers = () => {
    const willShowViewers = !showViewers;
    setShowViewers(willShowViewers);

    if (willShowViewers) {
      // Pause everything
      setPaused(true);
      currentPlayer.pause();
      if (progressAnim.current) {
        progressAnim.current.stop();
      }
    } else {
      // Resume everything
      setPaused(false);
      currentPlayer.play();

      // Resume progress
      if (currentStory) {
        progress.stopAnimation((state: any) => {
          const currentProgress = state.value;
          const remainingProgress = 1 - currentProgress;
          const duration = (currentStory.duration ?? 5) * 1000;
          const remainingDuration = duration * remainingProgress;

          if (remainingDuration > 0) {
            progressAnim.current = Animated.timing(progress, {
              toValue: 1,
              duration: remainingDuration,
              useNativeDriver: false,
            });

            progressAnim.current.start(({ finished }) => {
              if (finished) handleNext();
            });
          }
        });
      }
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });


  const handleClose = () => {
    currentPlayer.pause();
    currentPlayer.volume = 0;
    router.back();
  };

  /** ---------------- GUARDS ---------------- */
  if (isLoading || !currentStory) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "white", marginTop: 10 }}>Loading…</Text>
      </View>
    );
  }

  const isDeleting = deleteVideo.isPending;



  /** ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      {/* VIDEO */}
      <VideoView
        player={currentPlayer}
        style={styles.video}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
      />

      {/* THUMBNAIL */}
      {showThumbnail && currentStory.thumbnailUrl && (
        <Image
          source={{ uri: currentStory.thumbnailUrl }}
          style={styles.video}
          resizeMode="cover"
        />
      )}

      {/* LOADING INDICATOR */}
      {isVideoLoading && !showThumbnail && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* TOP BAR WITH PROGRESS */}
      <View style={styles.topBar}>
        {/* PROGRESS */}
        <View style={styles.progressRow}>
          {storyList.map((_: any, i: number) => (
            <View key={i} style={styles.progressBg}>
              <Animated.View
                style={[
                  styles.progressFill,
                  i === currentIndex && { width: progressWidth },
                  i < currentIndex && { width: "100%" },
                  i > currentIndex && { width: "0%" },
                ]}
              />
            </View>
          ))}
        </View>


        {/* USER INFO */}
        <View style={styles.userRow}>
          <TouchableOpacity

            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              if (!isOwnStory) {
                router.push(`/profile/${currentUserStories.username}`);
              } else {
                router.push(`/(drawer)/(tabs)/profile`);
              }
            }}
          >
            <Image
              source={{
                uri:
                  currentUserStories.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              style={styles.profileImg}
            />
            <Text style={styles.username}>
              {isOwnStory ? "Your Story" : currentUserStories.username}
            </Text>
            <Text style={styles.timeText}>
              {timeAgo(currentStory.created_at)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TOUCH LAYER */}
      <View style={styles.touchLayer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={handlePrev}
          onLongPress={handleLongPressIn}
          onPressOut={handleLongPressOut}
          delayLongPress={150}
        />
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={handleNext}
          onLongPress={handleLongPressIn}
          onPressOut={handleLongPressOut}
          delayLongPress={150}
        />
      </View>

      {/* OWN STORY CONTROLS */}
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

      {/* VIEWERS LIST MODAL */}
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

      {/* MUTE/UNMUTE BUTTON */}
      <TouchableOpacity
        style={styles.muteButton}
        onPress={() => setIsMuted(!isMuted)}
      >
        <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={26} color="#fff" />
      </TouchableOpacity>

      {/* CLOSE BUTTON */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={26} color="#fff" />
      </TouchableOpacity>
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
  loaderOverlay: {
    position: "absolute",
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  topBar: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  touchLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    zIndex: 1,
  },
  progressRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 10,
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
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImg: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 6,
  },
  timeText: {
    color: "#ccc",
    fontSize: 12,
  },
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
    zIndex: 100,
  },
  viewersText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomActions: {
    position: "absolute",
    bottom: 60,
    right: 10,
    gap: 10,
    zIndex: 100,
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
    zIndex: 200,
  },
  viewersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  viewersTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  viewersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  viewerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  viewerImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  viewerInfo: {
    flex: 1,
  },
  viewerName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  viewerTime: {
    color: "#999",
    fontSize: 13,
    marginTop: 2,
  },
  noViewers: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  noViewersText: {
    color: "#666",
    fontSize: 16,
    marginTop: 12,
  },
  muteButton: {
    position: "absolute",
    top: 55,
    right: 50,
    zIndex: 100,
  },
  closeButton: {
    position: "absolute",
    top: 55,
    right: 10,
    zIndex: 100,
  },
});