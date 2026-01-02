// import { GetCurrentUser, GetProfileUsername } from '@/src/api/profile-api';
// import BottomDrawer from '@/src/components/ui/BottomDrawer';
// import ReportDrawer from '@/src/components/ui/ReportDrawer';
// import BookmarkPanel from '@/src/features/bookmark/bookmarkPanel';
// import { getTimeAgo } from '@/src/hooks/ReelsUploadTime';
// import { useMarkViewedMutation } from '@/src/hooks/useMarkViewedMutation';
// import { useLikeMutation } from '@/src/hooks/userLikeMutation';
// import { useDeleteVideo } from '@/src/hooks/videosMutation';
// import { useBookmarkStore } from '@/src/store/useBookmarkStore';
// import { useReelsStore } from '@/src/store/useReelsStore';
// import { useProfileStore } from '@/src/store/userProfileStore';
// import { useIsFocused } from '@react-navigation/native';
// import { useQuery } from '@tanstack/react-query';
// import { router, useLocalSearchParams } from "expo-router";
// import { useVideoPlayer, VideoView } from 'expo-video';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   FlatList,
//   Image,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useWindowDimensions,
//   View
// } from "react-native";
// import { ScrollView } from 'react-native-gesture-handler';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// // Reel Item Component
// const UserReelItem = ({
//   item,
//   index,
//   currentIndex,
//   isMuted,
//   handleToggleMute,
//   showIcon,
//   fadeAnim,
//   likeMutation,
//   // toggleLike,
//   // addComment,
//   currentUserId,
//   addShare,
//   reelUsername,
//   profilePicture,
//   owner,
// }: any) => {
//   const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
//   const {
//     categories,
//     panelVisible,
//     openBookmarkPanel,
//     closePanel,
//     addCategory,
//     saveToCategory
//   } = useBookmarkStore();
//   const { username } = useProfileStore();
//   const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
//   const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;
//   const [showOptions, setShowOptions] = React.useState(false);
//   const markViewedMutation = useMarkViewedMutation();
//   const [viewed, setViewed] = useState(false);
//   const [showFullCaption, setShowFullCaption] = useState(false);
//   const [showBottomDrawer, setShowBottomDrawer] = useState(false);
//   const [showReportDrawer, setShowReportDrawer] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const [liked, setLiked] = useState(
//     Array.isArray(item.likes)
//       ? item.likes.some((like: any) => like.user_id === currentUserId)
//       : false
//   );

//   const player = useVideoPlayer({ uri: item.videoUrl }, (instance) => {
//     instance.loop = true;
//     instance.volume = isMuted ? 0 : 1;

//     // VIDEO LOADED EVENT
//     instance.addListener("statusChange", (event) => {
//       if (event.status === "loading") {
//         setIsLoading(true);
//       }

//       if (event.status === "readyToPlay") {
//         setIsLoading(false); // video is fully ready
//       }
//     });

//   });

//   // Handle play/pause based on scroll safely
//   useEffect(() => {
//     if (!player) return;

//     if (currentIndex === index) {
//       if (player.currentTime < 0.5) player.currentTime = 0;
//       player.play();
//       player.volume = isMuted ? 0 : 1;
//     } else {
//       try { player.pause(); } catch { }
//       player.volume = 0;
//     }
//   }, [currentIndex, index, isMuted]);

//   const handleLike = async () => {
//     const newLiked = !liked;
//     setLiked(newLiked);

//     try {
//       await likeMutation.mutateAsync(item.uuid);
//     } catch (error) {
//       console.log("Like failed:", error);
//       setLiked(!newLiked);
//     }
//   };


//   useEffect(() => {
//     let frameId: number;

//     const checkTime = () => {
//       try {
//         // Only mark when current reel is active and playing
//         if (currentIndex === index && player?.playing) {
//           const time = player.currentTime;
//           if (!viewed && time >= 10) {
//             setViewed(true);
//             markViewedMutation.mutate(item.uuid);
//             console.log(` User viewed reel: ${item.uuid} | Time watched: ${time}s`);
//           }
//         }
//       } catch (e) {
//         console.log("View check error:", e);
//       }

//       frameId = requestAnimationFrame(checkTime);
//     };

//     frameId = requestAnimationFrame(checkTime);
//     return () => cancelAnimationFrame(frameId);
//   }, [player, currentIndex, index, viewed]);

//   // console.log("username in profile", reelUsername);
//   // console.log("user item.ProfilePicture ", profilePicture);
//   // console.log("user comment resived", item.comments);
//   // console.log("user audio", item.audio);

//   // console.log("=============================");
//   // console.log("item :", item)
//   // console.log("=============================");


//   const deleteVideo = useDeleteVideo();
//   const handleDeleteReel = () => {
//     Alert.alert(
//       "Delete Reel",
//       "Are you sure you want to delete this reel?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () => {
//             deleteVideo.mutate(item.uuid, {
//               onSuccess: () => {
//                 router.replace("/(drawer)/(tabs)/profile");
//                 Alert.alert("Success", "Reel deleted successfully!");
//               },
//             });
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
//       {/* Video Player */}
//       <Pressable
//         style={{ flex: 1 }}
//         onPress={handleToggleMute}
//       >
//         {/* <View style={{ flex: 1 }}> */}
//         {isLoading && (
//           <View style={{
//             position: "absolute",
//             top: "45%",
//             left: "45%",
//             zIndex: 9999
//           }}>
//             <ActivityIndicator size="large" color="#fff" />
//           </View>
//         )}

//         <VideoView
//           style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
//           key={`video-${item.id}-${index}`}
//           player={player}
//           allowsFullscreen={false}
//           allowsPictureInPicture={false}
//           contentFit="cover"
//           nativeControls={false}
//         />

//         {/* Volume Icon */}
//         {showIcon && (
//           <Animated.View style={[styles.centerIcon, { opacity: fadeAnim }]}>
//             <Ionicons
//               name={isMuted ? "volume-mute" : "volume-high"}
//               size={ACTION_ICON_SIZE}
//               color="#fff"
//             />
//           </Animated.View>
//         )}
//       </Pressable>

//       {/* Bottom Info */}
//       <View style={[styles.bottomContent, { bottom: SCREEN_HEIGHT * 0.12 }]}>
//         <View style={styles.userInfo}>
//           <TouchableOpacity
//             style={{ flexDirection: 'row', alignItems: 'center' }}
//             onPress={() => {
//               router.push(`/profile`);
//             }}
//           >
//             <Image
//               source={{ uri: profilePicture ? profilePicture : "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
//               style={{
//                 width: AVATAR_SIZE,
//                 height: AVATAR_SIZE,
//                 borderRadius: AVATAR_SIZE / 2,
//                 borderWidth: 2,
//                 borderColor: '#fff',
//               }}
//             />

//             <Text style={styles.username}>{reelUsername}</Text>
//           </TouchableOpacity>
//         </View>
//         {/* <Text style={styles.caption}>{item.caption}</Text> */}
//         <View style={{ marginBottom: 8 }}>
//           {/* NORMAL caption (2 lines only) */}
//           {!showFullCaption && (
//             <>
//               <Text style={styles.caption} numberOfLines={2}>
//                 {item.caption}
//               </Text>

//               {item.caption?.length > 100 && (
//                 <TouchableOpacity onPress={() => setShowFullCaption(true)}>
//                   <Text style={{ color: "#ccc", marginTop: 4 }}>More</Text>
//                 </TouchableOpacity>
//               )}
//             </>
//           )}

//           {/* EXPANDED caption with SCROLL like Instagram */}
//           {showFullCaption && (
//             <View style={{ maxHeight: 220 }}>
//               {/* caption scrollable */}
//               <ScrollView nestedScrollEnabled={true}>
//                 <Text style={styles.caption}>{item.caption}</Text>
//               </ScrollView>

//               {/* LESS button */}
//               {item.caption?.length > 100 && (
//                 <TouchableOpacity onPress={() => setShowFullCaption(false)}>
//                   <Text style={{ color: "#ccc", marginTop: 4 }}>Less</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}
//         </View>
//         <View style={styles.musicInfo}>
//           <Text style={styles.musicIcon}>♪</Text>
//           <Text style={styles.musicText}>
//             {item.audio || "Original Sound"}
//           </Text>
//         </View>

//         <Text style={{ color: "#ccc", fontSize: 12, marginTop: 4 }}>
//           {getTimeAgo(item.created_at)}
//         </Text>

//       </View>

//       {/* Right Actions - Improved Layout */}
//       <View style={[styles.rightActions, { bottom: SCREEN_HEIGHT * 0.12 }]}>
//         <TouchableOpacity
//           style={styles.actionButton}
//           disabled={likeMutation.isPending}
//           onPress={handleLike}
//         >
//           <Ionicons
//             name={liked ? 'heart' : 'heart-outline'}
//             size={ACTION_ICON_SIZE}
//             color={liked ? '#FF0000' : '#fff'}
//           />
//           <Text style={styles.actionText}>
//             {Array.isArray(item.likes) ? item.likes.length : 0}
//           </Text>
//         </TouchableOpacity>


//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => router.push(`/comment/${item.uuid}`)}
//         >
//           <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
//           <Text style={styles.actionText}>{item.comments?.length || 0}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton} onPress={() => {
//           addShare(item.id);
//           router.push({
//             pathname: `/chat`,
//             params: {
//               shareMode: "true",
//               reelId: item.id
//             }
//           });
//         }}>
//           <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
//           <Text style={styles.actionText}>{item.shares?.length || 0}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.actionButton, { marginTop: 8 }]}
//           onPress={() => setShowOptions(true)}
//         >
//           <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Bottom Drawer - Perfectly Styled */}
//       <BookmarkPanel />
//       <BottomDrawer
//         visible={showOptions}
//         onClose={() => setShowOptions(false)}
//         onSave={() => { openBookmarkPanel(item.uuid || item.id); setShowOptions(false); }}
//         onDelete={owner ? handleDeleteReel : undefined}
//         onReport={() => setShowReportDrawer(true)}
//         onShare={() => console.log("Shared")}
//         reelId={item.id}
//         reelUrl={item.videoUrl}
//         isOwner={owner}
//       />

//       <ReportDrawer
//         visible={showReportDrawer}
//         onClose={() => setShowReportDrawer(false)}
//         onSelect={(reason: string) => {
//           console.log("User reported for:", reason);
//           setShowReportDrawer(false);
//         }}
//       />
//     </View>
//   );
// };

// // Feed Component
// const UserReelsFeed = () => {
//   const { height: SCREEN_HEIGHT } = useWindowDimensions();
//   const flatListRef = useRef<FlatList>(null);
//   const isFocused = useIsFocused();
//   const likeMutation = useLikeMutation();

//   const { id, username } = useLocalSearchParams();

//   const [isMuted, setIsMuted] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // NEW: Track video durations
//   // const [videoDurations, setVideoDurations] = useState<Record<string, number>>({});

//   // Fetch profile + videos
//   const { data: profile } = useQuery({
//     queryKey: ["userProfile", username],
//     queryFn: () => GetProfileUsername(username as string || ""),
//     enabled: !!username,
//   });


//   const { data: currentUser, isLoading: currentUserLoading } = useQuery({
//     queryKey: ["currentUser"],
//     queryFn: GetCurrentUser,
//   });


//   const owner = profile?.userProfile.username === currentUser?.userProfile.username;
//   // console.log('====================================');
//   // console.log("owner", owner)
//   // console.log('====================================');
//   console.log("profile.videos.audio", profile?.videos?.audio);

//   const videos = profile?.videos ?? [];

//   // Zustand actions (no data)
//   const {
//     // toggleLike,
//     // addComment,
//     addShare,
//     showIcon,
//     setShowIcon,
//     fadeAnim,
//     updateReelURL,
//     autoScroll,
//   } = useReelsStore();


//   // NEW: Callback to receive duration from child
//   // const handleDurationReady = (videoId: string, duration: number) => {
//   //   setVideoDurations(prev => ({
//   //     ...prev,
//   //     [videoId]: duration
//   //   }));
//   // };

//   // Find start index from URL param id
//   useEffect(() => {
//     if (!videos.length || !id) return;

//     // uuid se match karo
//     const startIdx = videos.findIndex((v: any) => v.uuid === id);

//     if (startIdx > -1) {
//       setCurrentIndex(startIdx);
//       // Thoda delay do taaki FlatList ready ho
//       setTimeout(() => {
//         flatListRef.current?.scrollToIndex({
//           index: startIdx,
//           animated: false,
//           viewPosition: 0,
//         });
//       }, 100);
//     }
//   }, [id, videos]);

//   // Sync URL when swiping
//   const updateURL = (idx: number) => {
//     const reel = videos[idx];
//     if (!reel) return;
//     router.replace(`/p/${username}/${reel.uuid}`);

//     router.setParams({ id: reel.id, username: username });
//     updateReelURL(reel.id);
//   };

//   console.log("durection resived", videos[currentIndex]?.duration);

//   useEffect(() => {
//     if (!autoScroll || videos.length === 0) return;

//     // current video ki duration lo
//     const currentVideoDuration = videos[currentIndex]?.duration;

//     if (!currentVideoDuration) return;

//     const timer = setTimeout(() => {
//       const nextIndex =
//         currentIndex + 1 < videos.length ? currentIndex + 1 : 0;

//       setCurrentIndex(nextIndex);

//       flatListRef.current?.scrollToIndex({
//         index: nextIndex,
//         animated: true,
//       });

//       updateURL(nextIndex);
//     }, currentVideoDuration * 1000);

//     return () => clearTimeout(timer);
//   }, [autoScroll, videos.length, currentIndex]);


//   // Scroll handling
//   const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const y = e.nativeEvent.contentOffset.y;
//     const idx = Math.round(y / SCREEN_HEIGHT);

//     if (idx !== currentIndex && videos[idx]) {
//       setCurrentIndex(idx);
//       updateURL(idx);
//     }
//   };

//   // Mute on blur
//   useEffect(() => {
//     setIsMuted(!isFocused);
//   }, [isFocused]);

//   // Toggle mute with animation
//   const handleToggleMute = () => {
//     setIsMuted(prev => !prev);
//     setShowIcon(true);

//     Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true })
//       .start(() => {
//         setTimeout(() => {
//           Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true })
//             .start(() => setShowIcon(false));
//         }, 1200);
//       });
//   };

//   // Render
//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />

//       <FlatList
//         ref={flatListRef}
//         onScrollToIndexFailed={(info) => {
//           const wait = new Promise(resolve => setTimeout(resolve, 500));
//           wait.then(() => {
//             flatListRef.current?.scrollToIndex({
//               index: info.index,
//               animated: false,
//             });
//           });
//         }}
//         data={videos}
//         renderItem={({ item, index }) => (
//           <UserReelItem
//             item={item}
//             index={index}
//             currentIndex={currentIndex}
//             isMuted={isMuted}
//             handleToggleMute={handleToggleMute}
//             showIcon={showIcon}
//             fadeAnim={fadeAnim}
//             // toggleLike={(uuid: string) => likeMutation.mutate(uuid)}
//             // addComment={addComment}
//             addShare={addShare}
//             likeMutation={likeMutation}
//             reelUsername={profile?.username}
//             profilePicture={profile?.userProfile?.ProfilePicture}
//             owner={owner}
//             currentUserId={currentUser?.userProfile?.id}
//           />
//         )}
//         keyExtractor={(item) => item.uuid}
//         // keyExtractor={(item, i) => item.id?.toString() ?? i.toString()}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         snapToInterval={SCREEN_HEIGHT}
//         onMomentumScrollEnd={onMomentumEnd}
//         decelerationRate="fast"
//       />

//       {/* <B9 */}
//     </View>
//   );
// };

// // Improved Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black'
//   },
//   centerIcon: {
//     position: "absolute",
//     top: "45%",
//     left: "40%",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.6)",
//     borderRadius: 50,
//     padding: 16,
//     width: 70,
//     height: 70,
//   },
//   bottomContent: {
//     position: 'absolute',
//     left: '4%',
//     right: '20%',
//     paddingHorizontal: 12,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8
//   },
//   username: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   caption: {
//     color: '#fff',
//     fontSize: 14,
//     marginBottom: 8,
//     lineHeight: 18,
//   },
//   musicInfo: { flexDirection: 'row', alignItems: 'center' },
//   musicIcon: { fontSize: 16, marginRight: 8, color: '#fff' },
//   musicText: { color: '#fff', fontSize: 14 },
//   rightActions: {
//     position: 'absolute',
//     right: '4%',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//   },
//   actionButton: {
//     alignItems: 'center',
//     marginBottom: 20,
//     paddingVertical: 4,
//   },
//   actionText: {
//     color: '#fff',
//     fontSize: 13,
//     fontWeight: '600',
//     marginTop: 4,
//   },
// });

// export default UserReelsFeed;

import VideoProgressBar from '@/app/(drawer)/(tabs)/reels/videoProgressBar';
import { GetCurrentUser, GetProfileUsername } from '@/src/api/profile-api';
import BottomDrawer from '@/src/components/ui/BottomDrawer';
import ReportDrawer from '@/src/components/ui/ReportDrawer';
import BookmarkPanel from '@/src/features/bookmark/bookmarkPanel';
import { createReelGesture } from '@/src/hooks/ReelGestures';
import { getTimeAgo } from '@/src/hooks/ReelsUploadTime';
import { useLike } from '@/src/hooks/useLike';
import { useMarkViewedMutation } from '@/src/hooks/useMarkViewedMutation';
import { useLikeMutation } from '@/src/hooks/userLikeMutation';
import { useDeleteVideo } from '@/src/hooks/videosMutation';
import { useBookmarkStore } from '@/src/store/useBookmarkStore';
import { useReelsStore } from '@/src/store/useReelsStore';
import { useProfileStore } from '@/src/store/userProfileStore';
import { formatCount } from '@/src/utils/formatCount';
import { useIsFocused } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import { GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Reel Item Component
const UserReelItem = ({
  item,
  index,
  currentIndex,
  isMuted,
  handleToggleMute,
  showIcon,
  fadeAnim,
  likeMutation,
  // toggleLike,
  // addComment,
  currentUserId,
  addShare,
  reelUsername,
  profilePicture,
  currentUserProfile,
  owner,
}: any) => {
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const {
    categories,
    panelVisible,
    openBookmarkPanel,
    closePanel,
    addCategory,
    saveToCategory
  } = useBookmarkStore();
  const { username } = useProfileStore();
  const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
  const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;
  const [showOptions, setShowOptions] = React.useState(false);
  const markViewedMutation = useMarkViewedMutation(item.id);
  const [viewed, setViewed] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showBottomDrawer, setShowBottomDrawer] = useState(false);
  const [showReportDrawer, setShowReportDrawer] = useState(false);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  // const [likesCount, setLikesCount] = useState(item.likesCount ?? 0);
  // const [liked, setLiked] = useState(item.isLiked);
  const {
    liked,
    likesCount,
    handleLike,
  } = useLike({
    isLiked: item.isLiked,
    likesCount: item.likesCount,
    id: item.uuid || item.id,
    likeMutation,
  });



  const shouldLoadVideo = Math.abs(currentIndex - index) <= 2;

  const player = useVideoPlayer(
    shouldLoadVideo ? { uri: item.videoUrl } : null,
    (instance) => {
      if (!instance) return;

      instance.loop = true;
      instance.volume = isMuted ? 0 : 1;

      // VIDEO LOADED EVENT
      instance.addListener("statusChange", (event) => {
        if (event.status === "loading") {
          setIsLoading(true);
          setShowThumbnail(true);
        }

        if (event.status === "readyToPlay") {
          setIsLoading(false);
          setTimeout(() => setShowThumbnail(false), 300);
        }
      });

    });

  // Handle play/pause based on scroll safely
  useEffect(() => {
    if (!player) return;

    if (!isFocused) {
      player.pause();
      return;
    }

    if (currentIndex === index) {
      if (player.currentTime < 0.5) player.currentTime = 0;
      player.play();
      player.volume = isMuted ? 0 : 1;
    } else {
      try { player.pause(); } catch { }
      player.volume = 0;
    }
  }, [isFocused, currentIndex, index, isMuted]);

  // const handleLike = async () => {
  //   const newLiked = !liked;

  //   // UI update
  //   setLiked(newLiked);
  //   setLikesCount((prev: number) => newLiked ? prev + 1 : Math.max(0, prev - 1));

  //   try {
  //     await likeMutation.mutateAsync(item.uuid || item.id);
  //   } catch (err) {
  //     // revert on error
  //     setLiked(!newLiked);
  //     setLikesCount((prev: number) => newLiked ? prev - 1 : prev + 1);
  //   }
  // };

  useEffect(() => {
    if (!shouldLoadVideo) return;

    let frameId: number;

    const checkTime = () => {
      try {
        // Only mark when current reel is active and playing
        if (currentIndex === index && player?.playing) {
          const time = player.currentTime;
          if (!viewed && time >= 10) {
            setViewed(true);
            markViewedMutation.mutate(item.uuid);
            console.log(` User viewed reel: ${item.uuid} | Time watched: ${time}s`);
          }
        }
      } catch (e) {
        console.log("View check error:", e);
      }

      frameId = requestAnimationFrame(checkTime);
    };

    frameId = requestAnimationFrame(checkTime);
    return () => cancelAnimationFrame(frameId);
  }, [player, currentIndex, shouldLoadVideo, index, viewed]);


  const handleLongPressIn = () => {
    setPaused(true);
    player.pause();
  };

  const handleLongPressOut = () => {
    setPaused(false);
    player.play();
  };


  const deleteVideo = useDeleteVideo();
  const handleDeleteReel = () => {
    Alert.alert(
      "Delete Reel",
      "Are you sure you want to delete this reel?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteVideo.mutate(item.uuid, {
              onSuccess: () => {
                router.replace("/(drawer)/(tabs)/profile");
                // Alert.alert("Success", "Reel deleted successfully!");
                Toast.show({ type: "success", text1: "Success", text2: "Reel deleted successfully!" })
              },
            });
          },
        },
      ]
    );
  };

  const reelGesture = createReelGesture({
    onTap: handleToggleMute,
    onLongPressIn: handleLongPressIn,
    onLongPressOut: handleLongPressOut,
  });


  // const reelGesture = React.useMemo(() => {
  //   return createReelGesture({
  //     onTap: handleToggleMute,
  //     onLongPressIn: handleLongPressIn,
  //     onLongPressOut: handleLongPressOut,
  //   });
  // }, []);


  console.log("item.comments?.length ", item.comments?.length);

  const isOwnProfile = item.userProfile?.id === currentUserId;

  return (
    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>

      {/* Video Player */}
      {/* <Pressable
        style={{ flex: 1 }}
        onPress={handleToggleMute}
        onLongPress={handleLongPressIn}
        onPressOut={handleLongPressOut}
        delayLongPress={150}
      > */}

      <GestureDetector gesture={reelGesture}>
        <Animated.View style={{ flex: 1 }}>

          {showThumbnail && item.thumbnailUrl && (
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={{
                position: 'absolute',
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT,
                zIndex: 1,
              }}
              resizeMode="cover"
              fadeDuration={0}
            />
          )}

          {/* <View style={{ flex: 1 }}> */}
          {isLoading && (
            <View style={{
              position: "absolute",
              top: "45%",
              left: "45%",
              zIndex: 9999
            }}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

          {shouldLoadVideo && (
            <VideoView
              style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
              key={`video-${item.id}-${index}`}
              player={player}
              allowsFullscreen={false}
              allowsPictureInPicture={false}
              contentFit="cover"
              nativeControls={false}
            />
          )}
          {/* Volume Icon */}
          {showIcon && (
            <Animated.View style={[styles.centerIcon, { opacity: fadeAnim }]}>
              <Ionicons
                name={isMuted ? "volume-mute" : "volume-high"}
                size={ACTION_ICON_SIZE}
                color="#fff"
              />
            </Animated.View>
          )}
          {/* </Pressable> */}
        </Animated.View>
      </GestureDetector>

      {/* Bottom Info */}
      <View style={[styles.bottomContent, { bottom: SCREEN_HEIGHT * 0.12 }]}>
        <View style={styles.userInfo}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            // onPress={() => {
            //   router.push(`/profile`);
            // }}
            onPress={() => {
              if (isOwnProfile) {
                router.push('/profile');
              } else {
                router.push(`/profile/${reelUsername}`);
              }
            }}
          >
            <Image
              source={{ uri: profilePicture ? profilePicture : "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: AVATAR_SIZE / 2,
                borderWidth: 2,
                borderColor: '#fff',
              }}
            />

            <Text style={styles.username}>{reelUsername}</Text>
          </TouchableOpacity>
        </View>
        {/* <Text style={styles.caption}>{item.caption}</Text> */}
        <View style={{ marginBottom: 8 }}>
          {/* NORMAL caption (2 lines only) */}
          {!showFullCaption && (
            <>
              <Text style={styles.caption} numberOfLines={2}>
                {item.caption}
              </Text>

              {item.caption?.length > 100 && (
                <TouchableOpacity onPress={() => setShowFullCaption(true)}>
                  <Text style={{ color: "#ccc", marginTop: 4 }}>More</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* EXPANDED caption with SCROLL like Instagram */}
          {showFullCaption && (
            <View style={{ maxHeight: 220 }}>
              {/* caption scrollable */}
              <ScrollView nestedScrollEnabled={true}>
                <Text style={styles.caption}>{item.caption}</Text>
              </ScrollView>

              {/* LESS button */}
              {item.caption?.length > 100 && (
                <TouchableOpacity onPress={() => setShowFullCaption(false)}>
                  <Text style={{ color: "#ccc", marginTop: 4 }}>Less</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <View style={styles.musicInfo}>
          <Text style={styles.musicIcon}>♪</Text>
          <Text style={styles.musicText}>
            {item.audio?.name || "Original Sound"}
          </Text>
        </View>

        <Text style={{ color: "#ccc", fontSize: 12, marginTop: 4 }}>
          {getTimeAgo(item.created_at)}
        </Text>

      </View>

      {/* Right Actions - Improved Layout */}
      <View style={[styles.rightActions, { bottom: SCREEN_HEIGHT * 0.12 }]}>
        <TouchableOpacity
          style={styles.actionButton}
          disabled={likeMutation.isPending}
          onPress={handleLike}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={ACTION_ICON_SIZE}
            color={liked ? '#FF0000' : '#fff'}
          />
          <Text style={styles.actionText}>
            {formatCount(likesCount)}
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/comment/${item.uuid}`)}
        >
          <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
          <Text style={styles.actionText}>{formatCount(item.comments?.length || 0)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => {
          addShare(item.id);
          router.push({
            pathname: `/chat`,
            params: {
              shareMode: "true",
              reelId: item.id
            }
          });
        }}>
          <Ionicons name="paper-plane-outline" size={ACTION_ICON_SIZE} color="#fff" />
          <Text style={styles.actionText}>{formatCount(item.shares?.length || 0)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { marginTop: 8 }]}
          onPress={() => setShowOptions(true)}
        >
          <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
        </TouchableOpacity>
      </View>

      <VideoProgressBar
        player={player}
        isActive={currentIndex === index && isFocused}
        paused={paused}
      />


      {/* Bottom Drawer - Perfectly Styled */}
      <BookmarkPanel />
      <BottomDrawer
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onSave={() => { openBookmarkPanel(item.uuid || item.id); setShowOptions(false); }}
        onDelete={owner ? handleDeleteReel : undefined}
        onReport={() => setShowReportDrawer(true)}
        // onShare={() => console.log("Shared")}
        reelId={item.id}
        reelUrl={item.videoUrl}
        isOwner={owner}
      />

      <ReportDrawer
        visible={showReportDrawer}
        onClose={() => setShowReportDrawer(false)}
        onSelect={(reason: string) => {
          console.log("User reported for:", reason);
          setShowReportDrawer(false);
        }}
      />
    </View>
  );
};

// Feed Component
const UserReelsFeed = () => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const isFocused = useIsFocused();
  const likeMutation = useLikeMutation();

  const { id, username } = useLocalSearchParams();

  const [isMuted, setIsMuted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // NEW: Track video durations
  // const [videoDurations, setVideoDurations] = useState<Record<string, number>>({});

  // Fetch profile + videos
  const { data: profile } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => GetProfileUsername(username as string || ""),
    enabled: !!username,

    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 6,
  });

  const { data: currentUser, isLoading: currentUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });


  // const owner = profile?.userProfile.username === currentUser?.userProfile.username;

  const owner = currentUser?.id === profile?.id ||
    currentUser?.userProfile?.id === profile?.userProfile?.id;

  console.log('====================================');
  console.log("currentUser ID:", currentUser?.id);
  console.log("profile ID:", profile?.id);
  console.log("owner:", owner);
  console.log('====================================');


  const videos = profile?.videos ?? [];

  // Zustand actions (no data)
  const {
    // toggleLike,
    // addComment,
    addShare,
    showIcon,
    setShowIcon,
    fadeAnim,
    updateReelURL,
    autoScroll,
  } = useReelsStore();


  // NEW: Callback to receive duration from child
  // const handleDurationReady = (videoId: string, duration: number) => {
  //   setVideoDurations(prev => ({
  //     ...prev,
  //     [videoId]: duration
  //   }));
  // };

  // Find start index from URL param id
  useEffect(() => {
    if (!videos.length || !id) return;

    // uuid se match karo
    const startIdx = videos.findIndex((v: any) => v.uuid === id);

    if (startIdx > -1) {
      setCurrentIndex(startIdx);
      // Thoda delay do taaki FlatList ready ho
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: startIdx,
          animated: false,
          viewPosition: 0,
        });
      }, 100);
    }
  }, [id, videos]);

  // Sync URL when swiping
  const updateURL = (idx: number) => {
    const reel = videos[idx];
    if (!reel) return;
    // router.replace(`/p/${username}/${reel.uuid}`);

    router.setParams({ id: reel.id, username: username });
    updateReelURL(reel.id);
  };

  useEffect(() => {
    if (!autoScroll || videos.length === 0) return;

    // current video ki duration lo
    const currentVideoDuration = videos[currentIndex]?.duration;

    if (!currentVideoDuration) return;

    const timer = setTimeout(() => {
      const nextIndex =
        currentIndex + 1 < videos.length ? currentIndex + 1 : 0;

      setCurrentIndex(nextIndex);

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      updateURL(nextIndex);
    }, currentVideoDuration * 1000);

    return () => clearTimeout(timer);
  }, [autoScroll, videos.length, currentIndex]);

  // Scroll handling
  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / SCREEN_HEIGHT);

    if (idx !== currentIndex && videos[idx]) {
      setCurrentIndex(idx);
      updateURL(idx);
    }
  };

  // Mute on blur
  useEffect(() => {
    setIsMuted(!isFocused);
  }, [isFocused]);

  // Toggle mute with animation
  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
    setShowIcon(true);

    Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true })
      .start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true })
            .start(() => setShowIcon(false));
        }, 1200);
      });
  };

  // Render
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <FlatList
        ref={flatListRef}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
            });
          });
        }}
        data={videos}
        renderItem={({ item, index }) => (
          <UserReelItem
            item={item}
            index={index}
            currentIndex={currentIndex}
            isMuted={isMuted}
            handleToggleMute={handleToggleMute}
            showIcon={showIcon}
            fadeAnim={fadeAnim}
            // toggleLike={(uuid: string) => likeMutation.mutate(uuid)}
            // addComment={addComment}
            addShare={addShare}
            likeMutation={likeMutation}
            reelUsername={profile?.username}
            profilePicture={profile?.userProfile?.ProfilePicture}
            owner={owner}
            currentUserId={currentUser?.userProfile?.id}
          />
        )}
        keyExtractor={(item) => item.uuid}
        // keyExtractor={(item, i) => item.id?.toString() ?? i.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        onMomentumScrollEnd={onMomentumEnd}
        decelerationRate="fast"
      />

      {/* <B9 */}
    </View>
  );
};

// Improved Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  centerIcon: {
    position: "absolute",
    top: "45%",
    left: "40%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 50,
    padding: 16,
    width: 70,
    height: 70,
  },
  bottomContent: {
    position: 'absolute',
    left: '4%',
    right: '20%',
    paddingHorizontal: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  musicInfo: { flexDirection: 'row', alignItems: 'center' },
  musicIcon: { fontSize: 16, marginRight: 8, color: '#fff' },
  musicText: { color: '#fff', fontSize: 14 },
  rightActions: {
    position: 'absolute',
    right: '4%',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default UserReelsFeed;