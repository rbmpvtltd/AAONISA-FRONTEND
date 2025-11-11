// // // // // import BottomDrawer from '@/src/components/ui/BottomDrawer';
// // // // // import { useBookmarkStore } from '@/src/store/useBookmarkStore';
// // // // // import { useReelsStore } from '@/src/store/useReelsStore';
// // // // // import { useProfileStore } from '@/src/store/userProfileStore';
// // // // // import { useIsFocused } from '@react-navigation/native';
// // // // // import { router, useLocalSearchParams } from "expo-router";
// // // // // import { useVideoPlayer, VideoView } from 'expo-video';
// // // // // import React, { useEffect, useRef, useState } from 'react';
// // // // // // import { BookmarkButton } from '@/src/features/bookmark/bookmarkButton';
// // // // // import BookmarkPanel from '@/src/features/bookmark/bookmarkPanel';
// // // // // import {
// // // // //   Animated,
// // // // //   FlatList,
// // // // //   Image,
// // // // //   NativeScrollEvent,
// // // // //   NativeSyntheticEvent,
// // // // //   Pressable,
// // // // //   StatusBar,
// // // // //   StyleSheet,
// // // // //   Text,
// // // // //   TouchableOpacity,
// // // // //   useWindowDimensions,
// // // // //   View
// // // // // } from "react-native";
// // // // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // // // import { likeDislike, markViewed } from '../../src/api/profile-api';

// // // // // const UserReelItem = ({
// // // // //   item,
// // // // //   index,
// // // // //   currentIndex,
// // // // //   isMuted,
// // // // //   handleToggleMute,
// // // // //   showIcon,
// // // // //   fadeAnim,
// // // // //   toggleLike,
// // // // //   addComment,
// // // // //   addShare,
// // // // //   activeTab,
// // // // //   setActiveTab,
// // // // // }: any) => {
// // // // //   const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
// // // // //     const {
// // // // //     categories,
// // // // //     panelVisible,
// // // // //     openBookmarkPanel,
// // // // //     closePanel,
// // // // //     addCategory,
// // // // //     saveToCategory
// // // // //   } = useBookmarkStore();
// // // // //   const bottomContentBottom = SCREEN_HEIGHT * 0.12;
// // // // //   const rightActionsBottom = SCREEN_HEIGHT * 0.12;
// // // // //   const topBarPaddingTop = SCREEN_HEIGHT * 0.05;
// // // // //   const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
// // // // //   const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;
// // // // //   const { username, profilePicture } = useProfileStore();
// // // // //   const [showOptions, setShowOptions] = React.useState(false);
// // // // //   const videoKey = currentIndex === index ? `video-${item.uuid}-active` : `video-${item.uuid}`;
// // // // //   const [viewed, setViewed] = useState(false);

// // // // //   let reelId = item.uuid;
// // // // //   // create player
// // // // //   const player = useVideoPlayer(
// // // // //     typeof item.videoUrl === "string" ? { uri: item.videoUrl } : item.videoUrl,
// // // // //     (playerInstance) => {
// // // // //       playerInstance.loop = true;
// // // // //       playerInstance.volume = isMuted ? 0 : 1;
// // // // //     }
// // // // //   );

// // // // //   // autoplay control
// // // // //   // useEffect(() => {
// // // // //   //   if (currentIndex === index) {
// // // // //   //     player.currentTime = 0;
// // // // //   //     player.play();
// // // // //   //   } else {
// // // // //   //     player.pause();
// // // // //   //   }
// // // // //   // }, [currentIndex, index]);

// // // // //   //   useEffect(() => {
// // // // //   //   if (currentIndex === index) {
// // // // //   //     player.currentTime = 0;
// // // // //   //     player.play();
// // // // //   //     player.volume = isMuted ? 0 : 1;
// // // // //   //   } else {
// // // // //   //     player.pause();
// // // // //   //     player.volume = 0; // ensure muted when off-screen
// // // // //   //   }
// // // // //   // }, [currentIndex, index, isMuted]);


// // // // //   // useEffect(() => {
// // // // //   //   if (currentIndex === index) {
// // // // //   //     player.currentTime = 0;
// // // // //   //     player.play();
// // // // //   //     player.volume = isMuted ? 0 : 1;
// // // // //   //   } else {
// // // // //   //     player.pause();
// // // // //   //     player.volume = 0;
// // // // //   //   }
// // // // //   //   // Cleanup: jab component unmount ho ya index change ho
// // // // //   //   return () => {
// // // // //   //     player.pause();
// // // // //   //     player.volume = 0;
// // // // //   //   };
// // // // //   // }, [currentIndex, index, isMuted]);


// // // // //   useEffect(() => {
// // // // //     let isMounted = true;

// // // // //     const controlPlayback = async () => {
// // // // //       try {
// // // // //         if (!isMounted || !player) return;

// // // // //         if (currentIndex === index) {
// // // // //           player.currentTime = 0;
// // // // //           await player.play();
// // // // //           player.volume = isMuted ? 0 : 1;
// // // // //         } else {
// // // // //           await player.pause();
// // // // //           player.volume = 0;
// // // // //         }
// // // // //       } catch (error) {
// // // // //         console.warn('Playback control error:', (error as Error)?.message);
// // // // //       }
// // // // //     };

// // // // //     controlPlayback();

// // // // //     return () => {
// // // // //       isMounted = false;
// // // // //       try {
// // // // //         player.pause?.();
// // // // //       } catch { }
// // // // //     };
// // // // //   }, [currentIndex, index, isMuted]);


// // // // //   // mute/unmute
// // // // //   useEffect(() => {
// // // // //     player.volume = isMuted ? 0 : 1;
// // // // //   }, [isMuted]);


// // // // // useEffect(() => {
// // // // //   let frameId: number;

// // // // //   const checkTime = () => {
// // // // //     try {
// // // // //       // current video only
// // // // //       if (currentIndex === index && player?.playing) {
// // // // //         const time = player.currentTime;
// // // // //         if (!viewed && time >= 10) {
// // // // //           setViewed(true);
// // // // //           markViewed(item.uuid);
// // // // //         }
// // // // //       }
// // // // //     } catch (e) {}
// // // // //     frameId = requestAnimationFrame(checkTime);
// // // // //   };
// // // // //   frameId = requestAnimationFrame(checkTime);
// // // // //   return () => cancelAnimationFrame(frameId);
// // // // // }, [player, currentIndex, index, viewed]);

// // // // // // Reset on swipe
// // // // // useEffect(() => {
// // // // //   setViewed(false);
// // // // // }, [currentIndex]);


// // // // //   const formatNumber = (num: number): string => {
// // // // //     if (typeof num !== 'number' || isNaN(num)) return '0';
// // // // //     if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
// // // // //     if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
// // // // //     return num.toString();
// // // // //   };

// // // // //   const videoPosition = useRef(0);

// // // // //   const handlePressIn = () => {
// // // // //     player.pause();
// // // // //   };

// // // // //   const handlePressOut = () => {
// // // // //     player.play();
// // // // //   };
// // // // //   return (
// // // // //     <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
// // // // //       <Pressable
// // // // //         style={{ flex: 1 }}
// // // // //         onPress={handleToggleMute}
// // // // //         onPressIn={handlePressIn}
// // // // //         onPressOut={handlePressOut}
// // // // //       >
// // // // //         <VideoView
// // // // //           style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
// // // // //           key={`video-${item.uuid}-${index}`}
// // // // //           player={player}
// // // // //           contentFit="cover"
// // // // //           allowsFullscreen={false}
// // // // //           allowsPictureInPicture={false}
// // // // //           nativeControls={false}
// // // // //         />

// // // // //         {/* Audio Icon Overlay */}
// // // // //         {showIcon && (
// // // // //           <Animated.View style={[styles.centerIcon, { opacity: fadeAnim }]}>
// // // // //             <Ionicons
// // // // //               name={isMuted ? "volume-mute" : "volume-high"}
// // // // //               size={ACTION_ICON_SIZE}
// // // // //               color="#fff"
// // // // //             />
// // // // //           </Animated.View>
// // // // //         )}
// // // // //       </Pressable>

// // // // //       {/* Bottom Content */}
// // // // //       <View style={[styles.bottomContent, { bottom: bottomContentBottom }]}>
// // // // //         <View style={styles.userInfo}>
// // // // //           <Image
// // // // //             source={{ uri: item.profilePicture }}
// // // // //             style={{
// // // // //               width: AVATAR_SIZE,
// // // // //               height: AVATAR_SIZE,
// // // // //               borderRadius: AVATAR_SIZE / 2,
// // // // //               marginRight: 8,
// // // // //               borderWidth: 2,
// // // // //               borderColor: '#fff',
// // // // //             }}
// // // // //           />
// // // // //           <Text style={styles.username}>{username}</Text>
// // // // //         </View>
// // // // //         <Text style={styles.username}>{item.title}</Text>
// // // // //         <Text style={styles.caption}>{item.caption}</Text>
// // // // //         <View style={styles.musicInfo}>
// // // // //           <Text style={styles.musicIcon}>♪</Text>
// // // // //           <Text style={styles.musicText}>
// // // // //             Original Sound - hello
// // // // //           </Text>
// // // // //         </View>
// // // // //       </View>

// // // // //       {/* Right Actions */}
// // // // //       <View style={[styles.rightActions, { bottom: rightActionsBottom }]}>
// // // // //         <TouchableOpacity style={styles.actionButton}>
// // // // //           <Image
// // // // //             source={{ uri: item.profilePicture }}
// // // // //             style={{
// // // // //               width: AVATAR_SIZE,
// // // // //               height: AVATAR_SIZE,
// // // // //               borderRadius: AVATAR_SIZE / 2,
// // // // //               borderWidth: 2,
// // // // //               borderColor: '#fff',
// // // // //             }}
// // // // //           />
// // // // //         </TouchableOpacity>

// // // // //         <TouchableOpacity style={styles.actionButton} onPress={() => {toggleLike(item.uuid);likeDislike(reelId)}}>
// // // // //           <Ionicons
// // // // //             name={item.isLiked ? 'heart' : 'heart-outline'}
// // // // //             size={ACTION_ICON_SIZE}
// // // // //             color={item.isLiked ? 'red' : '#fff'}
// // // // //           />
// // // // //           <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
// // // // //         </TouchableOpacity>

// // // // //         <TouchableOpacity
// // // // //           style={styles.actionButton}
// // // // //           onPress={() => router.push(`/comment/${item.id}`)}
// // // // //         >
// // // // //           <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
// // // // //           <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
// // // // //         </TouchableOpacity>

// // // // //         <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.id)}>
// // // // //           <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
// // // // //           <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
// // // // //         </TouchableOpacity>

// // // // //         {/* <TouchableOpacity style={styles.actionButton}>
// // // // //           <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
// // // // //         </TouchableOpacity> */}

// // // // //         <TouchableOpacity style={styles.actionButton} onPress={() => setShowOptions(true)}>
// // // // //           <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
// // // // //         </TouchableOpacity>
// // // // //       </View>
          
// // // // //       <BookmarkPanel />


// // // // //       <BottomDrawer
// // // // //         visible={showOptions}
// // // // //         onClose={() => setShowOptions(false)}
// // // // //         onSave={() => { openBookmarkPanel(item.uuid); setShowOptions(false); }}
// // // // //         onReport={() => console.log("Reported")}
// // // // //         onShare={() => console.log("Shared")}
// // // // //       />
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // const UserReelsFeed = () => {
// // // // //   const { height: SCREEN_HEIGHT } = useWindowDimensions();
// // // // //   const flatListRef = useRef<FlatList>(null);
// // // // //   const isFocused = useIsFocused();
// // // // //   const { id } = useLocalSearchParams();
// // // // //   // const { videos } = useProfileStore(); 
// // // // //   const [isMuted, setIsMuted] = useState(false);
// // // // //   const { videos, toggleLike, addComment, addShare } = useProfileStore();


// // // // //   const {
// // // // //     // reels,
// // // // //     // toggleLike,
// // // // //     // addComment,
// // // // //     // addShare,
// // // // //     // currentIndex,
// // // // //     // setCurrentIndex,
// // // // //     activeTab,
// // // // //     setActiveTab,
// // // // //     // isMuted,
// // // // //     toggleMute,
// // // // //     showIcon,
// // // // //     setShowIcon,
// // // // //     fadeAnim,
// // // // //     autoScroll,
// // // // //     reels,
// // // // //     updateReelURL, //NEW: URL update function
// // // // //   } = useReelsStore();

// // // // //   const [currentIndex, setCurrentIndex] = useState(0);

// // // // //   // const {toggleLike, addComment, addShare } = useProfileStore();


// // // // // useEffect(() => {
// // // // //   let interval: any;

// // // // //   if (autoScroll && reels.length > 0) {
// // // // //     interval = setInterval(() => {
// // // // //       const nextIndex =
// // // // //         currentIndex + 1 < reels.length ? currentIndex + 1 : 0;

// // // // //       setCurrentIndex(nextIndex);

// // // // //       flatListRef.current?.scrollToIndex({
// // // // //         index: nextIndex,
// // // // //         animated: true,
// // // // //       });

// // // // //       updateURL(nextIndex);
// // // // //     }, 10000);
// // // // //   }

// // // // //   return () => clearInterval(interval);
// // // // // }, [autoScroll, reels, currentIndex]);

// // // // //   // NEW: URL update function
// // // // //   const updateURL = (index: number) => {
// // // // //     if (videos[index]) {
// // // // //       const reelId = videos[index].uuid;
// // // // //       // Method 1: Expo Router setParams (Recommended)
// // // // //       router.setParams({ id: reelId });
// // // // //       // Method 2: Store mein bhi update karo for logging
// // // // //       updateReelURL(reelId);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     if (videos.length > 0) {
// // // // //       setTimeout(() => {
// // // // //         flatListRef.current?.scrollToIndex({ index: currentIndex, animated: false });
// // // // //       }, 100);
// // // // //     }
// // // // //   }, [videos]);

// // // // //   useEffect(() => {
// // // // //     if (id && videos.length > 0) {
// // // // //       const index = videos.findIndex((r) => r.uuid == id);
// // // // //       if (index !== -1) {
// // // // //         setCurrentIndex(index);
// // // // //         setTimeout(() => {
// // // // //           try {
// // // // //             flatListRef.current?.scrollToIndex({ index, animated: false });
// // // // //           } catch (error) {
// // // // //             console.warn("Scroll error:", error);
// // // // //           }
// // // // //         }, 100);
// // // // //       }
// // // // //     }
// // // // //   }, [id, videos]);

// // // // //   // useEffect(() => {
// // // // //   //   if (!isFocused) {
// // // // //   //     if (!isMuted) toggleMute();
// // // // //   //   } else {
// // // // //   //     if (isMuted) toggleMute();
// // // // //   //   }
// // // // //   // }, [isFocused]);

// // // // //   useEffect(() => {
// // // // //     if (!isFocused) {
// // // // //       setIsMuted(true); // mute all
// // // // //     } else {
// // // // //       setIsMuted(false);
// // // // //     }
// // // // //   }, [isFocused]);

// // // // //   useEffect(() => {
// // // // //     if (!isFocused) {
// // // // //       flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
// // // // //     }
// // // // //   }, [isFocused]);


// // // // //   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
// // // // //     const offsetY = event.nativeEvent.contentOffset.y;
// // // // //     const index = Math.round(offsetY / SCREEN_HEIGHT);
// // // // //     setCurrentIndex(index);
// // // // //   };

// // // // //   const handleToggleMute = () => {
// // // // //     setIsMuted(!isMuted);
// // // // //     setShowIcon(true);

// // // // //     Animated.timing(fadeAnim, {
// // // // //       toValue: 1,
// // // // //       duration: 200,
// // // // //       useNativeDriver: true,
// // // // //     }).start(() => {
// // // // //       setTimeout(() => {
// // // // //         Animated.timing(fadeAnim, {
// // // // //           toValue: 0,
// // // // //           duration: 500,
// // // // //           useNativeDriver: true,
// // // // //         }).start(() => setShowIcon(false));
// // // // //       }, 1200);
// // // // //     });
// // // // //   };

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       <StatusBar hidden />
// // // // //       <FlatList
// // // // //         ref={flatListRef}
// // // // //         data={videos}
// // // // //         renderItem={({ item, index }) => (
// // // // //           <UserReelItem
// // // // //             item={item}
// // // // //             index={index}
// // // // //             currentIndex={currentIndex}
// // // // //             isMuted={isMuted}
// // // // //             handleToggleMute={handleToggleMute}
// // // // //             showIcon={showIcon}
// // // // //             fadeAnim={fadeAnim}
// // // // //             toggleLike={toggleLike}
// // // // //             addComment={addComment}
// // // // //             addShare={addShare}
// // // // //             activeTab={activeTab}
// // // // //             setActiveTab={setActiveTab}
// // // // //           />
// // // // //         )}
// // // // //         // keyExtractor={(item) => item.id.toString()}
// // // // //         keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
// // // // //         pagingEnabled
// // // // //         showsVerticalScrollIndicator={false}
// // // // //         onScroll={handleScroll}
// // // // //         scrollEventThrottle={16}
// // // // //         snapToInterval={SCREEN_HEIGHT}
// // // // //         decelerationRate="fast"
// // // // //         getItemLayout={(_, index) => ({
// // // // //           length: SCREEN_HEIGHT,
// // // // //           offset: SCREEN_HEIGHT * index,
// // // // //           index,
// // // // //         })}
// // // // //         // NEW: Extra safety for URL update
// // // // //         onMomentumScrollEnd={(event) => {
// // // // //           const offsetY = event.nativeEvent.contentOffset.y;
// // // // //           const index = Math.round(offsetY / SCREEN_HEIGHT);
// // // // //           if (index !== currentIndex && videos[index]) {
// // // // //             setCurrentIndex(index);
// // // // //             updateURL(index);
// // // // //           }
// // // // //         }}
// // // // //       />
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: { flex: 1, backgroundColor: 'black' },
// // // // //   centerIcon: {
// // // // //     position: "absolute",
// // // // //     top: "45%",
// // // // //     left: "40%",
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //     backgroundColor: "rgba(0,0,0,0.3)",
// // // // //     borderRadius: 50,
// // // // //     padding: 10,
// // // // //   },
// // // // //   // topBar: {
// // // // //   //   flexDirection: 'row',
// // // // //   //   justifyContent: 'center',
// // // // //   //   paddingHorizontal: 16,
// // // // //   //   position: 'absolute',
// // // // //   //   top: 0,
// // // // //   //   left: 0,
// // // // //   //   right: 0,
// // // // //   // },
// // // // //   bottomContent: { position: 'absolute', left: '4%', right: '20%' },
// // // // //   userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
// // // // //   username: { color: '#fff', fontSize: 16, fontWeight: '600' },
// // // // //   caption: { color: '#fff', fontSize: 14, marginBottom: 8 },
// // // // //   musicInfo: { flexDirection: 'row', alignItems: 'center' },
// // // // //   musicIcon: { fontSize: 16, marginRight: 8, color: '#fff' },
// // // // //   musicText: { color: '#fff', fontSize: 14 },
// // // // //   rightActions: { position: 'absolute', right: '4%', alignItems: 'center' },
// // // // //   actionButton: { alignItems: 'center', marginBottom: 24 },
// // // // //   actionText: { color: '#fff', fontSize: 12, fontWeight: '600' },
// // // // //   tabsContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     backgroundColor: 'rgba(0,0,0,0.3)',
// // // // //     borderRadius: 20,
// // // // //     paddingVertical: 6,
// // // // //     paddingHorizontal: 12,
// // // // //   },
// // // // //   tabText: {
// // // // //     color: '#ccc',
// // // // //     fontSize: 16,
// // // // //     marginHorizontal: 8,
// // // // //     fontWeight: '500',
// // // // //     textShadowColor: 'rgba(0, 0, 0, 0.8)',
// // // // //     textShadowOffset: { width: 1, height: 1 },
// // // // //     textShadowRadius: 2,
// // // // //   },
// // // // //   activeTabText: {
// // // // //     color: '#fff',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '700',
// // // // //   },
// // // // // });

// // // // // export default UserReelsFeed;


// // // // // UserReelsFeed.tsx


// // // // import BookmarkPanel from '@/src/features/bookmark/bookmarkPanel';
// // // // import { useProfileStore } from '@/src/store/userProfileStore';
// // // // import { router } from "expo-router";
// // // // import { useVideoPlayer, VideoView } from 'expo-video';
// // // // import { useEffect, useState } from 'react';
// // // // import {
// // // //   Animated,
// // // //   Image,
// // // //   Pressable,
// // // //   StyleSheet,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   useWindowDimensions,
// // // //   View
// // // // } from "react-native";
// // // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // // import { markViewed } from '../../src/api/profile-api';

// // // // const UserReelItem = ({
// // // //   item,
// // // //   index,
// // // //   currentIndex,
// // // //   isMuted,
// // // //   handleToggleMute,
// // // //   showIcon,
// // // //   fadeAnim,
// // // //   toggleLike,
// // // //   addComment,
// // // //   addShare,
// // // // }: any) => {
// // // //   const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
// // // //   const { username } = useProfileStore();
// // // //   console.log("username in userrellfeed page", username);
  
// // // //   const [showOptions, setShowOptions] = useState(false);
// // // //   const [viewed, setViewed] = useState(false);

// // // //   const videoSource = typeof item.videoUrl === "string" ? { uri: item.videoUrl } : item.videoUrl;
// // // //   if (!videoSource?.uri) return <Text style={{color:'white'}}>Video not available</Text>;

// // // //   const player = useVideoPlayer(videoSource, (p) => {
// // // //     p.loop = true;
// // // //     p.volume = isMuted ? 0 : 1;
// // // //   });

// // // //   // Autoplay & pause based on currentIndex
// // // //   useEffect(() => {
// // // //     if (!player) return;
// // // //     const controlPlayback = async () => {
// // // //       try {
// // // //         if (currentIndex === index) {
// // // //           await player.play();
// // // //           player.volume = isMuted ? 0 : 1;
// // // //         } else {
// // // //           await player.pause();
// // // //           player.volume = 0;
// // // //         }
// // // //       } catch (e) {
// // // //         console.warn("Playback error:", e);
// // // //       }
// // // //     };
// // // //     controlPlayback();
// // // //   }, [currentIndex, index, isMuted, player]);

// // // //   // Mute/unmute
// // // //   useEffect(() => {
// // // //     if (!player) return;
// // // //     player.volume = isMuted ? 0 : 1;
// // // //   }, [isMuted, player]);

// // // //   // Mark viewed after 10s
// // // //   useEffect(() => {
// // // //     let frameId: number;

// // // //     const checkTime = () => {
// // // //       if (currentIndex === index && player?.playing) {
// // // //         const time = player.currentTime;
// // // //         if (!viewed && time >= 10) {
// // // //           setViewed(true);
// // // //           markViewed(item.uuid);
// // // //         }
// // // //       }
// // // //       frameId = requestAnimationFrame(checkTime);
// // // //     };
// // // //     frameId = requestAnimationFrame(checkTime);

// // // //     return () => cancelAnimationFrame(frameId);
// // // //   }, [player, currentIndex, index, viewed]);

// // // //   // Reset viewed on swipe
// // // //   useEffect(() => {
// // // //     setViewed(false);
// // // //   }, [currentIndex]);

// // // //   const formatNumber = (num: number) => {
// // // //     if (!num || isNaN(num)) return '0';
// // // //     if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
// // // //     if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
// // // //     return num.toString();
// // // //   };

// // // //   const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
// // // //   const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;

// // // //   return (
// // // //     <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
// // // //       <Pressable
// // // //         style={{ flex: 1 }}
// // // //         onPress={handleToggleMute}
// // // //       >
// // // //         {player && <VideoView
// // // //           style={{ flex: 1 }}
// // // //           key={`video-${item.uuid}-${index}`}
// // // //           player={player}
// // // //           contentFit="cover"
// // // //           allowsFullscreen={false}
// // // //           allowsPictureInPicture={false}
// // // //           nativeControls={false}
// // // //         />}

// // // //         {showIcon && (
// // // //           <Animated.View style={[styles.centerIcon, { opacity: fadeAnim }]}>
// // // //             <Ionicons
// // // //               name={isMuted ? "volume-mute" : "volume-high"}
// // // //               size={ACTION_ICON_SIZE}
// // // //               color="#fff"
// // // //             />
// // // //           </Animated.View>
// // // //         )}
// // // //       </Pressable>

// // // //       {/* Bottom Info */}
// // // //       <View style={[styles.bottomContent, { bottom: SCREEN_HEIGHT * 0.12 }]}>
// // // //         <View style={styles.userInfo}>
// // // //           <Image
// // // //             source={{ uri: item.profilePicture }}
// // // //             style={{
// // // //               width: AVATAR_SIZE,
// // // //               height: AVATAR_SIZE,
// // // //               borderRadius: AVATAR_SIZE / 2,
// // // //               marginRight: 8,
// // // //               borderWidth: 2,
// // // //               borderColor: '#fff',
// // // //             }}
// // // //           />
// // // //           <Text style={styles.username}>{username}</Text>
// // // //         </View>
// // // //         <Text style={styles.username}>{item.title}</Text>
// // // //         <Text style={styles.caption}>{item.caption}</Text>
// // // //       </View>

// // // //       {/* Right Actions */}
// // // //       <View style={[styles.rightActions, { bottom: SCREEN_HEIGHT * 0.12 }]}>
// // // //         <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.uuid)}>
// // // //           <Ionicons
// // // //             name={item.isLiked ? 'heart' : 'heart-outline'}
// // // //             size={ACTION_ICON_SIZE}
// // // //             color={item.isLiked ? 'red' : '#fff'}
// // // //           />
// // // //           <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
// // // //         </TouchableOpacity>

// // // //         <TouchableOpacity
// // // //           style={styles.actionButton}
// // // //           onPress={() => router.push(`/comment/${item.id}`)}
// // // //         >
// // // //           <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
// // // //           <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
// // // //         </TouchableOpacity>

// // // //         <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.id)}>
// // // //           <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
// // // //           <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
// // // //         </TouchableOpacity>

// // // //         <TouchableOpacity style={styles.actionButton} onPress={() => console.log("Options")}>
// // // //           <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       <BookmarkPanel />
// // // //     </View>
// // // //   );
// // // // };



// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, backgroundColor: 'black' },
// // // //   centerIcon: {
// // // //     position: "absolute",
// // // //     top: "45%",
// // // //     left: "40%",
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     backgroundColor: "rgba(0,0,0,0.3)",
// // // //     borderRadius: 50,
// // // //     padding: 10,
// // // //   },
// // // //   bottomContent: { position: 'absolute', left: '4%', right: '20%' },
// // // //   userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
// // // //   username: { color: '#fff', fontSize: 16, fontWeight: '600' },
// // // //   caption: { color: '#fff', fontSize: 14, marginBottom: 8 },
// // // //   rightActions: { position: 'absolute', right: '4%', alignItems: 'center' },
// // // //   actionButton: { alignItems: 'center', marginBottom: 24 },
// // // //   actionText: { color: '#fff', fontSize: 12, fontWeight: '600' },
// // // // });

// // // // // export default UserReelsFeed;

// // // import { GetProfileUsername, markViewed } from "@/src/api/profile-api";
// // // import BookmarkPanel from "@/src/features/bookmark/bookmarkPanel";
// // // import { useReelsStore } from "@/src/store/useReelsStore";
// // // import { useProfileStore } from "@/src/store/userProfileStore";
// // // import { useIsFocused } from "@react-navigation/native";
// // // import { useQuery } from "@tanstack/react-query";
// // // import { router, useLocalSearchParams } from "expo-router";
// // // import { useVideoPlayer, VideoView } from "expo-video";
// // // import { useEffect, useRef, useState } from "react";
// // // import {
// // //   Animated,
// // //   FlatList,
// // //   Image,
// // //   NativeScrollEvent,
// // //   NativeSyntheticEvent,
// // //   Pressable,
// // //   StatusBar,
// // //   StyleSheet,
// // //   Text,
// // //   TouchableOpacity,
// // //   useWindowDimensions,
// // //   View,
// // // } from "react-native";
// // // import Ionicons from "react-native-vector-icons/Ionicons";

// // // // --------------------------------------------------
// // // // TYPES
// // // // --------------------------------------------------
// // // interface ReelItemType {
// // //   uuid: string;
// // //   id: string;
// // //   videoUrl: string;
// // //   title: string;
// // //   caption: string;
// // //   likes: number;
// // //   comments: number;
// // //   shares: number;
// // //   isLiked: boolean;
// // //   username: string;
// // //   profilePicture: string;
// // // }

// // // interface UserReelItemProps {
// // //   item: ReelItemType;
// // //   index: number;
// // //   currentIndex: number;
// // //   isMuted: boolean;
// // //   handleToggleMute: () => void;
// // //   fadeAnim: Animated.Value;
// // //   showIcon: boolean;
// // //   toggleLike: (id: string) => void;
// // //   addComment: (id: string) => void;
// // //   addShare: (id: string) => void;
// // // }

// // // // --------------------------------------------------
// // // // REEL ITEM COMPONENT
// // // // --------------------------------------------------
// // // const UserReelItem = ({
// // //   item,
// // //   index,
// // //   currentIndex,
// // //   isMuted,
// // //   handleToggleMute,
// // //   fadeAnim,
// // //   showIcon,
// // //   toggleLike,
// // //   addComment,
// // //   addShare,
// // // }: UserReelItemProps) => {
// // //   const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

// // //   const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
// // //   const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;

// // //   const player = useVideoPlayer(
// // //     { uri: item.videoUrl },
// // //     (p) => {
// // //       p.loop = true;
// // //       p.volume = isMuted ? 0 : 1;
// // //     }
// // //   );

// // //   // Auto play control
// // //   useEffect(() => {
// // //     if (!player) return;

// // //     if (currentIndex === index) {
// // //       player.play();
// // //       player.volume = isMuted ? 0 : 1;
// // //     } else {
// // //       player.pause();
// // //       player.volume = 0;
// // //     }
// // //   }, [currentIndex, index, isMuted, player]);

// // //   // Watchtime tracking
// // //   useEffect(() => {
// // //     let frameId: number;

// // //     const trackTime = () => {
// // //       if (currentIndex === index && player?.playing && player.currentTime >= 10) {
// // //         markViewed(item.uuid);
// // //       }
// // //       frameId = requestAnimationFrame(trackTime);
// // //     };

// // //     frameId = requestAnimationFrame(trackTime);

// // //     return () => cancelAnimationFrame(frameId);
// // //   }, [player, currentIndex, index]);

// // //   return (
// // //     <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: "black" }}>
// // //       <Pressable style={{ flex: 1 }} onPress={handleToggleMute}>
// // //         <VideoView
// // //           style={{ flex: 1 }}
// // //           player={player}
// // //           nativeControls={false}
// // //           contentFit="cover"
// // //         />

// // //         {showIcon && (
// // //           <Animated.View style={[styles.centerIcon, { opacity: fadeAnim }]}>
// // //             <Ionicons
// // //               name={isMuted ? "volume-mute" : "volume-high"}
// // //               size={ACTION_ICON_SIZE}
// // //               color="#fff"
// // //             />
// // //           </Animated.View>
// // //         )}
// // //       </Pressable>

// // //       {/* Bottom Info */}
// // //       <View style={[styles.bottomContent, { bottom: SCREEN_HEIGHT * 0.12 }]}>
// // //         <View style={styles.userInfo}>
// // //           <Image
// // //             source={{ uri: item.profilePicture }}
// // //             style={{
// // //               width: AVATAR_SIZE,
// // //               height: AVATAR_SIZE,
// // //               borderRadius: AVATAR_SIZE / 2,
// // //               marginRight: 8,
// // //               borderWidth: 2,
// // //               borderColor: "#fff",
// // //             }}
// // //           />
// // //           <Text style={styles.username}>{item.username}</Text>
// // //         </View>

// // //         <Text style={styles.username}>{item.title}</Text>
// // //         <Text style={styles.caption}>{item.caption}</Text>
// // //       </View>

// // //       {/* Right side buttons */}
// // //       <View style={[styles.rightActions, { bottom: SCREEN_HEIGHT * 0.12 }]}>
// // //         <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.uuid)}>
// // //           <Ionicons
// // //             name={item.isLiked ? "heart" : "heart-outline"}
// // //             size={ACTION_ICON_SIZE}
// // //             color={item.isLiked ? "red" : "#fff"}
// // //           />
// // //           <Text style={styles.actionText}>{item.likes}</Text>
// // //         </TouchableOpacity>

// // //         <TouchableOpacity
// // //           style={styles.actionButton}
// // //           onPress={() => router.push(`/comment/${item.uuid}`)}
// // //         >
// // //           <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
// // //         </TouchableOpacity>

// // //         <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.uuid)}>
// // //           <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
// // //         </TouchableOpacity>

// // //         <TouchableOpacity style={styles.actionButton}>
// // //           <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE} color="#fff" />
// // //         </TouchableOpacity>
// // //       </View>

// // //       <BookmarkPanel />
// // //     </View>
// // //   );
// // // };

// // // // --------------------------------------------------
// // // // MAIN USER REELS FEED PAGE
// // // // --------------------------------------------------
// // // const UserReelsFeed = () => {
// // //   const { height: SCREEN_HEIGHT } = useWindowDimensions();
// // //   const flatListRef = useRef<FlatList<ReelItemType>>(null);

// // //   const isFocused = useIsFocused();
// // //   const { id, username } = useLocalSearchParams();
// // //   const [isMuted, setIsMuted] = useState(false);
// // // console.log("param id , username",id);

// // //   const { fadeAnim, showIcon, autoScroll, updateReelURL } = useReelsStore();
// // //   const { toggleLike, addComment, addShare } = useProfileStore();

// // //   // Backend fetch
// // //   const { data: profile } = useQuery({
// // //     queryKey: ["userReels", username],
// // //     queryFn: () => GetProfileUsername(username as string),
// // //     enabled: !!username,
// // //   });

// // //  console.log("data resived in userreelfeedpage",profile);
 
// // //   console.log("username risevid in userreelspage", username);
  
// // //   const videos = profile?.videos || [];
// // //   const [currentIndex, setCurrentIndex] = useState<number>(0);

// // //   // Scroll to ID reel
// // //   useEffect(() => {
// // //     if (!id || videos.length === 0) return;

// // //     const index = videos.findIndex((v:any) => v.uuid === id);

// // //     if (index !== -1) {
// // //       setCurrentIndex(index);
// // //       setTimeout(() => {
// // //         flatListRef.current?.scrollToIndex({ index, animated: false });
// // //       }, 100);
// // //     }
// // //   }, [id, videos]);

// // //   console.log("user id  resive in userreelfeed page", id);
// // //     console.log("user video  resive in userreelfeed page", videos);
  

// // //   // Auto scroll
// // //   useEffect(() => {
// // //     if (!autoScroll || videos.length === 0) return;

// // //     const interval = setInterval(() => {
// // //       const next = currentIndex + 1 < videos.length ? currentIndex + 1 : 0;

// // //       setCurrentIndex(next);
// // //       flatListRef.current?.scrollToIndex({ index: next, animated: true });

// // //       router.setParams({ id: videos[next].uuid });
// // //       updateReelURL(videos[next].uuid);
// // //     }, 10000);

// // //     return () => clearInterval(interval);
// // //   }, [autoScroll, currentIndex, videos]);

// // //   const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
// // //     const offsetY = e.nativeEvent.contentOffset.y;
// // //     const index = Math.round(offsetY / SCREEN_HEIGHT);
// // //     setCurrentIndex(index);
// // //   };

// // //   const handleToggleMute = () => setIsMuted(!isMuted);

// // //   return (
// // //     <View style={styles.container}>
// // //       <StatusBar hidden />

// // //       <FlatList
// // //         ref={flatListRef}
// // //         data={videos}
// // //         renderItem={({ item, index }) => (
// // //           <UserReelItem
// // //             item={item}
// // //             index={index}
// // //             currentIndex={currentIndex}
// // //             isMuted={isMuted}
// // //             handleToggleMute={handleToggleMute}
// // //             fadeAnim={fadeAnim}
// // //             showIcon={showIcon}
// // //             toggleLike={toggleLike}
// // //             addComment={addComment}
// // //             addShare={addShare}
// // //           />
// // //         )}
// // //         keyExtractor={(item) => item.uuid}
// // //         pagingEnabled
// // //         showsVerticalScrollIndicator={false}
// // //         onScroll={handleScroll}
// // //         scrollEventThrottle={16}
// // //         snapToInterval={SCREEN_HEIGHT}
// // //         decelerationRate="fast"
// // //       />
// // //     </View>
// // //   );
// // // };

// // // export default UserReelsFeed;

// // // // --------------------------------------------------
// // // // STYLES
// // // // --------------------------------------------------
// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: "black" },

// // //   centerIcon: {
// // //     position: "absolute",
// // //     top: "45%",
// // //     left: "40%",
// // //     padding: 10,
// // //     borderRadius: 50,
// // //     backgroundColor: "rgba(0,0,0,0.3)",
// // //   },

// // //   bottomContent: {
// // //     position: "absolute",
// // //     left: "4%",
// // //     right: "20%",
// // //   },

// // //   userInfo: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     marginBottom: 12,
// // //   },

// // //   username: { color: "#fff", fontSize: 16, fontWeight: "600" },

// // //   caption: { color: "#fff", fontSize: 14, marginBottom: 8 },

// // //   rightActions: {
// // //     position: "absolute",
// // //     right: "4%",
// // //     alignItems: "center",
// // //   },

// // //   actionButton: { alignItems: "center", marginBottom: 24 },
// // //   actionText: { color: "#fff", fontSize: 12 },
// // // });


// // import { GetProfileUsername, markViewed } from "@/src/api/profile-api";
// // import BookmarkPanel from "@/src/features/bookmark/bookmarkPanel";
// // import { useReelsStore } from "@/src/store/useReelsStore";
// // import { useProfileStore } from "@/src/store/userProfileStore";
// // import { useQuery } from "@tanstack/react-query";
// // import { router, useLocalSearchParams } from "expo-router";
// // import { useVideoPlayer, VideoView } from "expo-video";
// // import { useEffect, useRef, useState } from "react";

// // import {
// //   Animated,
// //   FlatList,
// //   Image,
// //   NativeScrollEvent,
// //   NativeSyntheticEvent,
// //   Pressable,
// //   StatusBar,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   useWindowDimensions,
// //   View,
// // } from "react-native";
// // import Ionicons from "react-native-vector-icons/Ionicons";

// // interface ReelItemType {
// //   uuid: string;
// //   id: string;
// //   videoUrl: string;
// //   title: string;
// //   caption: string;
// //   likes: number;
// //   comments: number;
// //   shares: number;
// //   isLiked: boolean;
// //   username: string;
// //   profilePicture: string;
// // }

// // interface UserReelItemProps {
// //   item: ReelItemType;
// //   index: number;
// //   currentIndex: number;
// //   isMuted: boolean;
// //   handleToggleMute: () => void;
// //   fadeAnim: Animated.Value;
// //   showIcon: boolean;
// //   toggleLike: (id: string) => void;
// //   addComment: (id: string) => void;
// //   addShare: (id: string) => void;
// // }


// // const UserReelItem = ({
// //   item,
// //   index,
// //   currentIndex,
// //   isMuted,
// //   handleToggleMute,
// //   fadeAnim,
// //   showIcon,
// //   toggleLike,
// //   addComment,
// //   addShare,
// // }: UserReelItemProps) => {
// //   const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
// //   const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
// //   const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;

// //   const player = useVideoPlayer(
// //     { uri: item.videoUrl },
// //     (p) => {
// //       p.loop = true;
// //       p.volume = isMuted ? 0 : 1;
// //     }
// //   );

// //   useEffect(() => {
// //     if (!player) return;
// //     if (currentIndex === index) {
// //       player.play();
// //       player.volume = isMuted ? 0 : 1;
// //     } else {
// //       player.pause();
// //       player.volume = 0;
// //     }
// //   }, [currentIndex, index, isMuted, player]);

// //   useEffect(() => {
// //     let frameId: number;

// //     const trackTime = () => {
// //       if (currentIndex === index && player?.playing && player.currentTime >= 10) {
// //         markViewed(item.uuid);
// //       }
// //       frameId = requestAnimationFrame(trackTime);
// //     };

// //     frameId = requestAnimationFrame(trackTime);

// //     return () => cancelAnimationFrame(frameId);
// //   }, [player, currentIndex, index]);


  
// //   return (
// //     <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: "black" }}>
// //       <Pressable style={{ flex: 1 }} onPress={handleToggleMute}>
// //         <VideoView style={{ flex: 1 }} player={player} nativeControls={false} contentFit="cover" />
// //         {showIcon && (
// //           <Animated.View style={[styles.centerIcon, { opacity: fadeAnim }]}>
// //             <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={ACTION_ICON_SIZE} color="#fff" />
// //           </Animated.View>
// //         )}
// //       </Pressable>

// //       <View style={[styles.bottomContent, { bottom: SCREEN_HEIGHT * 0.12 }]}>
// //         <View style={styles.userInfo}>
// //           <Image
// //             source={{ uri: item.profilePicture }}
// //             style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, marginRight: 8, borderWidth: 2, borderColor: "#fff" }}
// //           />
// //           <Text style={styles.username}>{item.username}</Text>
// //         </View>
// //         <Text style={styles.username}>{item.title}</Text>
// //         <Text style={styles.caption}>{item.caption}</Text>
// //       </View>

// //       <View style={[styles.rightActions, { bottom: SCREEN_HEIGHT * 0.12 }]}>
// //         <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.uuid)}>
// //           <Ionicons name={item.isLiked ? "heart" : "heart-outline"} size={ACTION_ICON_SIZE} color={item.isLiked ? "red" : "#fff"} />
// //           <Text style={styles.actionText}>{item.likes}</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/comment/${item.uuid}`)}>
// //           <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.uuid)}>
// //           <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.actionButton}>
// //           <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE} color="#fff" />
// //         </TouchableOpacity>
// //       </View>

// //       <BookmarkPanel />
// //     </View>
// //   );
// // };


// // const UserReelsFeed = () => {
// //   const { height: SCREEN_HEIGHT } = useWindowDimensions();
// //   const flatListRef = useRef<FlatList<ReelItemType>>(null);
// // const { username, id } = useLocalSearchParams();
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [currentIndex, setCurrentIndex] = useState<number>(0);
// // console.log("username",username, id);

// //   const { fadeAnim, showIcon, autoScroll, updateReelURL } = useReelsStore();
// //   const { toggleLike, addComment, addShare } = useProfileStore();

// //   const { data: profile } = useQuery({
// //     queryKey: ["userReels", username],
// //     queryFn: () => GetProfileUsername(username as string),
// //     enabled: !!username,
// //   });

// //   const videos = profile?.videos || [];

// //   useEffect(() => {
// //     if (!id || videos.length === 0) return;
// //     const index = videos.findIndex((v: any) => v.uuid === id);
// //     if (index !== -1) {
// //       setCurrentIndex(index);
// //       setTimeout(() => {
// //         flatListRef.current?.scrollToIndex({ index, animated: false });
// //       }, 100);
// //     }
// //   }, [id, videos]);

// //   useEffect(() => {
// //     if (!autoScroll || videos.length === 0) return;
// //     const interval = setInterval(() => {
// //       const next = currentIndex + 1 < videos.length ? currentIndex + 1 : 0;
// //       setCurrentIndex(next);
// //       flatListRef.current?.scrollToIndex({ index: next, animated: true });
// //       router.setParams({ id: videos[next].uuid });
// //       updateReelURL(videos[next].uuid);
// //     }, 10000);
// //     return () => clearInterval(interval);
// //   }, [autoScroll, currentIndex, videos]);

// //   const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
// //     const offsetY = e.nativeEvent.contentOffset.y;
// //     const index = Math.round(offsetY / SCREEN_HEIGHT);
// //     setCurrentIndex(index);
// //   };

// //   const handleToggleMute = () => setIsMuted(!isMuted);

// // if (!username) 
// //   return (
// //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
// //       <Text style={{ color: "white" }}>Loading...</Text>
// //     </View>
// //   );


// //   return (
// //     <View style={styles.container}>
// //       <StatusBar hidden />
// //       <FlatList
// //         ref={flatListRef}
// //         data={videos}
// //         renderItem={({ item, index }) => (
// //           <UserReelItem
// //             item={item}
// //             index={index}
// //             currentIndex={currentIndex}
// //             isMuted={isMuted}
// //             handleToggleMute={handleToggleMute}
// //             fadeAnim={fadeAnim}
// //             showIcon={showIcon}
// //             toggleLike={toggleLike}
// //             addComment={addComment}
// //             addShare={addShare}
// //           />
// //         )}
// //         keyExtractor={(item) => item.uuid}
// //         pagingEnabled
// //         showsVerticalScrollIndicator={false}
// //         onScroll={handleScroll}
// //         scrollEventThrottle={16}
// //         snapToInterval={SCREEN_HEIGHT}
// //         decelerationRate="fast"
// //       />
// //     </View>
// //   );
// // };

// // export default UserReelsFeed;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "black" },
// //   centerIcon: {
// //     position: "absolute",
// //     top: "45%",
// //     left: "40%",
// //     padding: 10,
// //     borderRadius: 50,
// //     backgroundColor: "rgba(0,0,0,0.3)",
// //   },
// //   bottomContent: { position: "absolute", left: "4%", right: "20%" },
// //   userInfo: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
// //   username: { color: "#fff", fontSize: 16, fontWeight: "600" },
// //   caption: { color: "#fff", fontSize: 14, marginBottom: 8 },
// //   rightActions: { position: "absolute", right: "4%", alignItems: "center" },
// //   actionButton: { alignItems: "center", marginBottom: 24 },
// //   actionText: { color: "#fff", fontSize: 12 },
// // });

// // // ===========================================
// // import { GetProfileUsername, markViewed } from "@/src/api/profile-api";
// // import BookmarkPanel from "@/src/features/bookmark/bookmarkPanel";
// // import { useReelsStore } from "@/src/store/useReelsStore";
// // import { useProfileStore } from "@/src/store/userProfileStore";
// // import { useQuery } from "@tanstack/react-query";
// // import { router, useLocalSearchParams } from "expo-router";
// // import { useVideoPlayer, VideoView } from "expo-video";
// // import { useEffect, useRef, useState } from "react";
// // import {
// //   Animated,
// //   FlatList,
// //   Image,
// //   Pressable,
// //   StatusBar,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   useWindowDimensions,
// //   View,
// // } from "react-native";
// // import Ionicons from "react-native-vector-icons/Ionicons";

// // interface ReelItemType {
// //   uuid: string;
// //   videoUrl: string;
// //   title: string;
// //   caption: string;
// //   likes: number;
// //   comments: number;
// //   shares: number;
// //   isLiked: boolean;
// //   username: string;
// //   profilePicture: string;
// // }

// // const UserReelItem = ({
// //   item,
// //   index,
// //   currentIndex,
// //   isMuted,
// //   handleToggleMute,
// //   fadeAnim,
// //   showIcon,
// //   toggleLike,
// //   addComment,
// //   addShare,
// // }: any) => {
// //   const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
// //   const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
// //   const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;

// //   const player = useVideoPlayer(
// //     { uri: item.videoUrl },
// //     (p) => {
// //       p.loop = true;
// //       p.volume = isMuted ? 0 : 1;
// //     }
// //   );

// //   useEffect(() => {
// //     if (!player) return;
// //     if (currentIndex === index) player.play();
// //     else player.pause();
// //   }, [currentIndex]);

// //   // markViewed only once
// //   useEffect(() => {
// //     let viewed = false;
// //     const checkView = () => {
// //       if (
// //         currentIndex === index &&
// //         player?.playing &&
// //         player.currentTime >= 10 &&
// //         !viewed
// //       ) {
// //         viewed = true;
// //         markViewed(item.uuid);
// //       }

// //       requestAnimationFrame(checkView);
// //     };
// //     requestAnimationFrame(checkView);
// //   }, []);

// //   return (
// //     <View
// //       style={{
// //         width: SCREEN_WIDTH,
// //         height: SCREEN_HEIGHT,
// //         backgroundColor: "black",
// //       }}
// //     >
// //       <Pressable style={{ flex: 1 }} onPress={handleToggleMute}>
// //         <VideoView
// //           style={{ flex: 1 }}
// //           player={player}
// //           nativeControls={false}
// //           contentFit="cover"
// //         />
// //         {showIcon && (
// //           <Animated.View
// //             style={[styles.centerIcon, { opacity: fadeAnim }]}
// //           >
// //             <Ionicons
// //               name={isMuted ? "volume-mute" : "volume-high"}
// //               size={ACTION_ICON_SIZE}
// //               color="#fff"
// //             />
// //           </Animated.View>
// //         )}
// //       </Pressable>

// //       <View
// //         style={[styles.bottomContent, { bottom: SCREEN_HEIGHT * 0.12 }]}
// //       >
// //         <View style={styles.userInfo}>
// //           <Image
// //             source={{ uri: item.profilePicture }}
// //             style={{
// //               width: AVATAR_SIZE,
// //               height: AVATAR_SIZE,
// //               borderRadius: AVATAR_SIZE / 2,
// //               marginRight: 8,
// //               borderWidth: 2,
// //               borderColor: "#fff",
// //             }}
// //           />
// //           <Text style={styles.username}>{item.username}</Text>
// //         </View>
// //         <Text style={styles.username}>{item.title}</Text>
// //         <Text style={styles.caption}>{item.caption}</Text>
// //       </View>

// //       <View
// //         style={[styles.rightActions, { bottom: SCREEN_HEIGHT * 0.12 }]}
// //       >
// //         <TouchableOpacity
// //           style={styles.actionButton}
// //           onPress={() => toggleLike(item.uuid)}
// //         >
// //           <Ionicons
// //             name={item.isLiked ? "heart" : "heart-outline"}
// //             size={ACTION_ICON_SIZE}
// //             color={item.isLiked ? "red" : "#fff"}
// //           />
// //           <Text style={styles.actionText}>{item.likes}</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={styles.actionButton}
// //           onPress={() => router.push(`/comment/${item.uuid}`)}
// //         >
// //           <Ionicons
// //             name="chatbubble-outline"
// //             size={ACTION_ICON_SIZE}
// //             color="#fff"
// //           />
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={styles.actionButton}
// //           onPress={() => addShare(item.uuid)}
// //         >
// //           <Ionicons
// //             name="share-social-outline"
// //             size={ACTION_ICON_SIZE}
// //             color="#fff"
// //           />
// //         </TouchableOpacity>

// //         <TouchableOpacity style={styles.actionButton}>
// //           <Ionicons
// //             name="ellipsis-vertical"
// //             size={ACTION_ICON_SIZE}
// //             color="#fff"
// //           />
// //         </TouchableOpacity>
// //       </View>

// //       <BookmarkPanel />
// //     </View>
// //   );
// // }; // FIXED CLOSING

// // // -------------------------------
// // // MAIN FEED COMPONENT
// // // -------------------------------

// // const UserReelsFeed = () => {
// //   const { height: SCREEN_HEIGHT } = useWindowDimensions();
// //   const flatListRef = useRef<any>(null);

// //   const { username, id } = useLocalSearchParams();
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   const { fadeAnim, showIcon } = useReelsStore();
// //   const { videos, setVideos, toggleLike, addComment, addShare } =
// //     useProfileStore();

// //   const { data: profile } = useQuery({
// //     queryKey: ["userReels", username],
// //     queryFn: () => GetProfileUsername(username as string),
// //     enabled: !!username,
// //   });

// //   useEffect(() => {
// //     if (profile?.videos) setVideos(profile.videos);
// //   }, [profile]);

// //   useEffect(() => {
// //     if (!id || videos.length === 0) return;
// //     const index = videos.findIndex((v) => v.uuid === id);
// //     if (index !== -1) {
// //       setCurrentIndex(index);
// //       flatListRef.current?.scrollToIndex({ index, animated: false });
// //     }
// //   }, [id, videos]);

// //   const handleScroll = (e: any) => {
// //     const index = Math.round(
// //       e.nativeEvent.contentOffset.y / SCREEN_HEIGHT
// //     );
// //     setCurrentIndex(index);
// //   };

// //   if (!username)
// //     return (
// //       <View style={styles.center}>
// //         <Text style={{ color: "white" }}>Loading...</Text>
// //       </View>
// //     );

// //   return (
// //     <View style={styles.container}>
// //       <StatusBar hidden />
// //       <FlatList
// //         ref={flatListRef}
// //         data={videos}
// //         renderItem={({ item, index }) => (
// //           <UserReelItem
// //             item={item}
// //             index={index}
// //             currentIndex={currentIndex}
// //             isMuted={isMuted}
// //             handleToggleMute={() => setIsMuted(!isMuted)}
// //             fadeAnim={fadeAnim}
// //             showIcon={showIcon}
// //             toggleLike={toggleLike}
// //             addComment={addComment}
// //             addShare={addShare}
// //           />
// //         )}
// //         keyExtractor={(item) => item.uuid}
// //         pagingEnabled
// //         onScroll={handleScroll}
// //         scrollEventThrottle={16}
// //         snapToInterval={SCREEN_HEIGHT}
// //       />
// //     </View>
// //   );
// // };

// // export default UserReelsFeed;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "black" },
// //   center: { flex: 1, justifyContent: "center", alignItems: "center" },

// //   centerIcon: {
// //     position: "absolute",
// //     top: "45%",
// //     left: "40%",
// //     padding: 10,
// //     borderRadius: 50,
// //     backgroundColor: "rgba(0,0,0,0.3)",
// //   },

// //   bottomContent: { position: "absolute", left: "4%", right: "20%" },
// //   userInfo: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
// //   username: { color: "#fff", fontSize: 16, fontWeight: "600" },
// //   caption: { color: "#fff", fontSize: 14, marginBottom: 8 },

// //   rightActions: { position: "absolute", right: "4%", alignItems: "center" },
// //   actionButton: { alignItems: "center", marginBottom: 24 },
// //   actionText: { color: "#fff", fontSize: 12 },
// // });

// // *******************************
// // last time 3pm   11/11/25
// // // *****************************
// import { GetProfileUsername, markViewed } from "@/src/api/profile-api";
// import BookmarkPanel from "@/src/features/bookmark/bookmarkPanel";
// import { useReelsStore } from "@/src/store/useReelsStore";
// import { useProfileStore } from "@/src/store/userProfileStore";
// import { useQuery } from "@tanstack/react-query";
// import { router, useLocalSearchParams } from "expo-router";
// import { useVideoPlayer, VideoView } from "expo-video";
// import { useEffect, useRef, useState } from "react";

// import {
//   Animated,
//   FlatList,
//   Image,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useWindowDimensions,
//   View,
// } from "react-native";

// import Ionicons from "react-native-vector-icons/Ionicons";

// interface ReelItemType {
//   uuid: string;
//   videoUrl: string;
//   title: string;
//   caption: string;
//   likes: number;
//   comments: number;
//   shares: number;
//   isLiked: boolean;
//   username: string;
//   profilePicture: string;
// }
// const UserReelItem = ({
//   item,
//   index,
//   currentIndex,
//   isMuted,
//   handleToggleMute,
//   fadeAnim,
//   showIcon,
//   toggleLike,
//   addComment,
//   addShare,
// }: any) => {
//   const { width: W, height: H } = useWindowDimensions();
//   const AVATAR = W * 0.08;
//   const ICON = W * 0.08;

//   const player = useVideoPlayer(
//     { uri: item.videoUrl },
//     (p) => {
//       p.loop = true;
//       p.volume = isMuted ? 0 : 1;
//     }
//   );

//   useEffect(() => {
//     if (!player) return;
//     if (currentIndex === index) player.play();
//     else player.pause();
//   }, [currentIndex]);

//   useEffect(() => {
//     let viewed = false;
//     let active = true;

//     const loop = () => {
//       if (!active) return;
//       if (
//         currentIndex === index &&
//         player?.playing &&
//         player.currentTime >= 10 &&
//         !viewed
//       ) {
//         viewed = true;
//         markViewed(item.uuid);
//       }
//       requestAnimationFrame(loop);
//     };

//     requestAnimationFrame(loop);

//     return () => {
//       active = false;
//     };
//   }, [currentIndex]);

//   useEffect(() => {
//     return () => {
//       try {
//         player?.pause();
//         // player?.stop();
//       } catch {}
//     };
//   }, []);

//   return (
//     <View style={{ width: W, height: H, backgroundColor: "black" }}>
//       <Pressable style={{ flex: 1 }} onPress={handleToggleMute}>
//         {player && (
//           <VideoView
//             style={{ flex: 1 }}
//             player={player}
//             contentFit="cover"
//             nativeControls={false}
//           />
//         )}

//         {showIcon && (
//           <Animated.View style={[styles.centerIcon, { opacity: fadeAnim }]}>
//             <Ionicons
//               name={isMuted ? "volume-mute" : "volume-high"}
//               size={ICON}
//               color="#fff"
//             />
//           </Animated.View>
//         )}
//       </Pressable>

//       <View style={[styles.bottomContent, { bottom: H * 0.12 }]}>
//         <View style={styles.userInfo}>
//           <Image
//             source={{ uri: item.profilePicture }}
//             style={{
//               width: AVATAR,
//               height: AVATAR,
//               borderRadius: AVATAR / 2,
//               marginRight: 8,
//               borderWidth: 2,
//               borderColor: "#fff",
//             }}
//           />
//           <Text style={styles.username}>{item.username}</Text>
//         </View>

//         <Text style={styles.username}>{item.title}</Text>
//         <Text style={styles.caption}>{item.caption}</Text>
//       </View>

//       <View style={[styles.rightActions, { bottom: H * 0.12 }]}>
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => toggleLike(item.uuid)}
//         >
//           <Ionicons
//             name={item.isLiked ? "heart" : "heart-outline"}
//             size={ICON}
//             color={item.isLiked ? "red" : "#fff"}
//           />
//           <Text style={styles.actionText}>{item.likes}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => router.push(`/comment/${item.uuid}`)}
//         >
//           <Ionicons name="chatbubble-outline" size={ICON} color="#fff" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => addShare(item.uuid)}
//         >
//           <Ionicons name="share-social-outline" size={ICON} color="#fff" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton}>
//           <Ionicons name="ellipsis-vertical" size={ICON} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       <BookmarkPanel />
//     </View>
//   );
// };


// // export default UserReelsFeed;
// const UserReelsFeed = () => {
//   const { height: H } = useWindowDimensions();
//   const flatListRef = useRef<any>(null);

//   const { username, id } = useLocalSearchParams();

//   const [isMuted, setIsMuted] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const { fadeAnim, showIcon } = useReelsStore();
//   const { videos, setVideos, toggleLike, addComment, addShare } =
//     useProfileStore();

//   const { data: profile } = useQuery({
//     queryKey: ["userReels", username],
//     queryFn: () => GetProfileUsername(username as string),
//     enabled: !!username,
//   });

//   useEffect(() => {
//     if (!profile?.videos) return;

//     const cleaned = profile.videos.map((v: any) => ({
//       ...v,
//       likes: Array.isArray(v.likes)
//         ? v.likes.length
//         : typeof v.likes === "object"
//         ? 0
//         : v.likes,

//       comments: Array.isArray(v.comments)
//         ? v.comments.length
//         : typeof v.comments === "object"
//         ? 0
//         : v.comments,

//       shares: Array.isArray(v.shares)
//         ? v.shares.length
//         : typeof v.shares === "object"
//         ? 0
//         : v.shares,
//     }));

//     setVideos(cleaned);
//   }, [profile]);

//   useEffect(() => {
//     if (!id || videos.length === 0) return;

//     const index = videos.findIndex((v) => v.uuid === id);
//     if (index !== -1) {
//       setCurrentIndex(index);
//       flatListRef.current?.scrollToIndex({ index, animated: false });
//     }
//   }, [id, videos]);

//   const handleScroll = (e: any) => {
//     const index = Math.round(e.nativeEvent.contentOffset.y / H);
//     setCurrentIndex(index);
//   };

//   if (!username)
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "#fff" }}>Loading…</Text>
//       </View>
//     );

//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />

//       <FlatList
//   ref={flatListRef}
//   data={videos}
//   keyExtractor={(item) => item.uuid}
//   renderItem={({ item, index }) => (
//     <UserReelItem
//       item={item}
//       index={index}
//       currentIndex={currentIndex}
//       isMuted={isMuted}
//       handleToggleMute={() => setIsMuted(!isMuted)}
//       fadeAnim={fadeAnim}
//       showIcon={showIcon}
//       toggleLike={toggleLike}
//       addComment={addComment}
//       addShare={addShare}
//     />
//   )}
//   pagingEnabled
//   snapToInterval={H}
//   onScroll={handleScroll}
//   scrollEventThrottle={16}
//   showsVerticalScrollIndicator={false}
//   removeClippedSubviews={false}
//   windowSize={3}
//   maxToRenderPerBatch={2}
//   initialNumToRender={1}

//   getItemLayout={(data, index) => ({
//     length: H,
//     offset: H * index,
//     index,
//   })}

//   onScrollToIndexFailed={(info) => {
//     flatListRef.current?.scrollToOffset({
//       offset: info.index * H,
//       animated: false,
//     });
//   }}
// />

//     </View>
//   );
// };

// export default UserReelsFeed;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "black" },
// //   center: { flex: 1, justifyContent: "center", alignItems: "center" },

// //   centerIcon: {
// //     position: "absolute",
// //     top: "45%",
// //     left: "40%",
// //     padding: 10,
// //     borderRadius: 50,
// //     backgroundColor: "rgba(0,0,0,0.3)",
// //   },

// //   bottomContent: { position: "absolute", left: "4%", right: "20%" },
// //   userInfo: { flexDirection: "row", alignItems: "center", marginBottom: 12 },

// //   username: { color: "#fff", fontSize: 16, fontWeight: "600" },
// //   caption: { color: "#fff", fontSize: 14, marginBottom: 8 },

// //   rightActions: { position: "absolute", right: "4%", alignItems: "center" },

// //   actionButton: { alignItems: "center", marginBottom: 24 },
// //   actionText: { color: "#fff", fontSize: 12 },
// // });


// import BottomDrawer from '@/src/components/ui/BottomDrawer';
// import { useReelsStore } from '@/src/store/useReelsStore';
// import { useProfileStore } from '@/src/store/userProfileStore';
// import { useIsFocused } from '@react-navigation/native';
// import { router, useLocalSearchParams } from "expo-router";
// import { useVideoPlayer, VideoView } from 'expo-video';
// import React, { useEffect, useRef, useState } from 'react';
// import {
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
// import Ionicons from 'react-native-vector-icons/Ionicons';


// const UserReelItem = ({
//   item,
//   index,
//   currentIndex,
//   isMuted,
//   handleToggleMute,
//   showIcon,
//   fadeAnim,
//   toggleLike,
//   addComment,
//   addShare,
//   activeTab,
//   setActiveTab,
// }: any) => {
//   const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();

//   const bottomContentBottom = SCREEN_HEIGHT * 0.12;
//   const rightActionsBottom = SCREEN_HEIGHT * 0.12;
//   const topBarPaddingTop = SCREEN_HEIGHT * 0.05;
//   const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
//   const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;
//   const { username, ProfilePicture } = useProfileStore();
//   const [showOptions, setShowOptions] = React.useState(false);


//   const videoKey = currentIndex === index ? `video-${item.id}-active` : `video-${item.id}`;

//   // create player
//   const player = useVideoPlayer(
//     typeof item.videoUrl === "string" ? { uri: item.videoUrl } : item.videoUrl,
//     (playerInstance) => {
//       playerInstance.loop = true;
//       playerInstance.volume = isMuted ? 0 : 1;
//     }
//   );

//   // autoplay control
//   // useEffect(() => {
//   //   if (currentIndex === index) {
//   //     player.currentTime = 0;
//   //     player.play();
//   //   } else {
//   //     player.pause();
//   //   }
//   // }, [currentIndex, index]);

//   //   useEffect(() => {
//   //   if (currentIndex === index) {
//   //     player.currentTime = 0;
//   //     player.play();
//   //     player.volume = isMuted ? 0 : 1;
//   //   } else {
//   //     player.pause();
//   //     player.volume = 0; // ensure muted when off-screen
//   //   }
//   // }, [currentIndex, index, isMuted]);


//   // useEffect(() => {
//   //   if (currentIndex === index) {
//   //     player.currentTime = 0;
//   //     player.play();
//   //     player.volume = isMuted ? 0 : 1;
//   //   } else {
//   //     player.pause();
//   //     player.volume = 0;
//   //   }
//   //   // Cleanup: jab component unmount ho ya index change ho
//   //   return () => {
//   //     player.pause();
//   //     player.volume = 0;
//   //   };
//   // }, [currentIndex, index, isMuted]);


//   useEffect(() => {
//     let isMounted = true;

//     const controlPlayback = async () => {
//       try {
//         if (!isMounted || !player) return;

//         if (currentIndex === index) {
//           player.currentTime = 0;
//           await player.play();
//           player.volume = isMuted ? 0 : 1;
//         } else {
//           await player.pause();
//           player.volume = 0;
//         }
//       } catch (error) {
//         console.warn('Playback control error:', (error as Error)?.message);
//       }
//     };

//     controlPlayback();

//     return () => {
//       isMounted = false;
//       try {
//         player.pause?.();
//       } catch { }
//     };
//   }, [currentIndex, index, isMuted]);


//   // mute/unmute
//   useEffect(() => {
//     player.volume = isMuted ? 0 : 1;
//   }, [isMuted]);

//   const formatNumber = (num: number): string => {
//     if (typeof num !== 'number' || isNaN(num)) return '0';
//     if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
//     if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
//     return num.toString();
//   };

//   const videoPosition = useRef(0);

//   const handlePressIn = () => {
//     player.pause();
//   };

//   const handlePressOut = () => {
//     player.play();
//   };

//   return (
//     <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
//       <Pressable
//         style={{ flex: 1 }}
//         onPress={handleToggleMute}
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//       >
//         <VideoView
//           style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
//           key={`video-${item.id}-${index}`}
//           player={player}
//           contentFit="cover"
//           allowsFullscreen={false}
//           allowsPictureInPicture={false}
//           nativeControls={false}
//         />

//         {/* Audio Icon Overlay */}
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

//       {/* Top Bar */}
//       {/* <View style={[styles.topBar, { paddingTop: topBarPaddingTop }]}>
//         <View style={styles.tabsContainer}>
//           {['Followings', 'News', 'Explore'].map((tab) => (
//             <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)}>
//               <Text
//                 style={[
//                   styles.tabText,
//                   activeTab === tab && styles.activeTabText,
//                 ]}
//               >
//                 {tab}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View> */}

//       {/* Bottom Content */}
//       <View style={[styles.bottomContent, { bottom: bottomContentBottom }]}>
//         <View style={styles.userInfo}>
//           <Image
//             source={{ uri: item.profilePicture }}
//             style={{
//               width: AVATAR_SIZE,
//               height: AVATAR_SIZE,
//               borderRadius: AVATAR_SIZE / 2,
//               marginRight: 8,
//               borderWidth: 2,
//               borderColor: '#fff',
//             }}
//           />
//           <Text style={styles.username}>{username}</Text>
//         </View>
//         <Text style={styles.username}>{item.title}</Text>
//         <Text style={styles.caption}>{item.caption}</Text>
//         <View style={styles.musicInfo}>
//           <Text style={styles.musicIcon}>♪</Text>
//           <Text style={styles.musicText}>
//             Original Sound - hello
//           </Text>
//         </View>
//       </View>

//       {/* Right Actions */}
//       <View style={[styles.rightActions, { bottom: rightActionsBottom }]}>
//         <TouchableOpacity style={styles.actionButton}>
//           <Image
//             source={{ uri: item.profilePicture }}
//             style={{
//               width: AVATAR_SIZE,
//               height: AVATAR_SIZE,
//               borderRadius: AVATAR_SIZE / 2,
//               borderWidth: 2,
//               borderColor: '#fff',
//             }}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
//           <Ionicons
//             name={item.isLiked ? 'heart' : 'heart-outline'}
//             size={ACTION_ICON_SIZE}
//             color={item.isLiked ? 'red' : '#fff'}
//           />
//           <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => router.push(`/comment/${item.id}`)}
//         >
//           <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
//           <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.id)}>
//           <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
//           <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
//         </TouchableOpacity>

//         {/* <TouchableOpacity style={styles.actionButton}>
//           <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
//         </TouchableOpacity> */}

//         <TouchableOpacity style={styles.actionButton} onPress={() => setShowOptions(true)}>
//           <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
//         </TouchableOpacity>
//       </View>


//       <BottomDrawer
//         visible={showOptions}
//         onClose={() => setShowOptions(false)}
//         onSave={() => { router.push("/(drawer)/(tabs)/reels/bookmark"); setShowOptions(false) }}
//         onReport={() => console.log("Reported")}
//         onShare={() => console.log("Shared")}
//       />
//     </View>
//   );
// };



// const UserReelsFeed = () => {
//   const { height: SCREEN_HEIGHT } = useWindowDimensions();
//   const flatListRef = useRef<FlatList>(null);
//   const isFocused = useIsFocused();

//   const { id, username } = useLocalSearchParams();

//   // ──────────────────────────────────────────────────────────────
//   // 1. ROUTE PARAMS → id + username
//   // ──────────────────────────────────────────────────────────────
//   const { id, username } = useLocalSearchParams();

//   const [isMuted, setIsMuted] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const {
//     videos,
//     toggleLike,
//     addComment,
//     addShare,
//     activeTab,
//     setActiveTab,
//     toggleMute,
//     showIcon,
//     setShowIcon,
//     fadeAnim,
//     updateReelURL,
//   } = useReelsStore();

//   // ──────────────────────────────────────────────────────────────
//   // 2. Find the start index from the incoming `id`
//   // ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!videos.length || !id) return;
//     const startIdx = videos.findIndex(v => v.id === id);
//     if (startIdx > -1) {
//       setCurrentIndex(startIdx);
//       setTimeout(() => {
//         flatListRef.current?.scrollToIndex({ index: startIdx, animated: false });
//       }, 100);
//     }
//   }, [id, videos]);

//   // ──────────────────────────────────────────────────────────────
//   // 3. URL sync when user swipes
//   // ──────────────────────────────────────────────────────────────
//   const updateURL = (idx: number) => {
//     if (!videos[idx]) return;
//     const reel = videos[idx];
//     // /p/username/reelId
//     router.setParams({ id: reel.id, username: reel.username });
//     updateReelURL(reel.id);
//   };

//   // ──────────────────────────────────────────────────────────────
//   // 4. Scroll handling
//   // ──────────────────────────────────────────────────────────────
//   const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const y = e.nativeEvent.contentOffset.y;
//     const idx = Math.round(y / SCREEN_HEIGHT);
//     if (idx !== currentIndex && videos[idx]) {
//       setCurrentIndex(idx);
//       updateURL(idx);
//     }
//   };

//   const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const y = e.nativeEvent.contentOffset.y;
//     const idx = Math.round(y / SCREEN_HEIGHT);
//     setCurrentIndex(idx);
//   };

//   // ──────────────────────────────────────────────────────────────
//   // 5. Mute / focus handling (unchanged)
//   // ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     setIsMuted(!isFocused);
//   }, [isFocused]);

//   const handleToggleMute = () => {
//     setIsMuted(prev => !prev);
//     setShowIcon(true);
//     Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => {
//       setTimeout(() => {
//         Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() =>
//           setShowIcon(false)
//         );
//       }, 1200);
//     });
//   };

//   // ──────────────────────────────────────────────────────────────
//   // 6. Render
//   // ──────────────────────────────────────────────────────────────
//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />
//       <FlatList
//         ref={flatListRef}
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
//             toggleLike={toggleLike}
//             addComment={addComment}
//             addShare={addShare}
//             activeTab={activeTab}
//             setActiveTab={setActiveTab}
//           />
//         )}
//         keyExtractor={(item, i) => item.id?.toString() ?? i.toString()}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         snapToInterval={SCREEN_HEIGHT}
//         decelerationRate="fast"
//         getItemLayout={(_, i) => ({
//           length: SCREEN_HEIGHT,
//           offset: SCREEN_HEIGHT * i,
//           index: i,
//         })}
//         onMomentumScrollEnd={onMomentumEnd}
//       />
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   centerIcon: {
//     position: "absolute",
//     top: "45%",
//     left: "40%",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.3)",
//     borderRadius: 50,
//     padding: 10,
//   },
//   // topBar: {
//   //   flexDirection: 'row',
//   //   justifyContent: 'center',
//   //   paddingHorizontal: 16,
//   //   position: 'absolute',
//   //   top: 0,
//   //   left: 0,
//   //   right: 0,
//   // },
//   bottomContent: { position: 'absolute', left: '4%', right: '20%' },
//   userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   username: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   caption: { color: '#fff', fontSize: 14, marginBottom: 8 },
//   musicInfo: { flexDirection: 'row', alignItems: 'center' },
//   musicIcon: { fontSize: 16, marginRight: 8, color: '#fff' },
//   musicText: { color: '#fff', fontSize: 14 },
//   rightActions: { position: 'absolute', right: '4%', alignItems: 'center' },
//   actionButton: { alignItems: 'center', marginBottom: 24 },
//   actionText: { color: '#fff', fontSize: 12, fontWeight: '600' },
//   tabsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     borderRadius: 20,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },
//   tabText: {
//     color: '#ccc',
//     fontSize: 16,
//     marginHorizontal: 8,
//     fontWeight: '500',
//     textShadowColor: 'rgba(0, 0, 0, 0.8)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   activeTabText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
// });

// export default UserReelsFeed;


// import { GetProfileUsername } from '@/src/api/profile-api';
// import BottomDrawer from '@/src/components/ui/BottomDrawer';
// import { useReelsStore } from '@/src/store/useReelsStore';
// import { useProfileStore } from '@/src/store/userProfileStore';
// import { useIsFocused } from '@react-navigation/native';
// import { useQuery } from '@tanstack/react-query';
// import { router, useLocalSearchParams } from "expo-router";
// import { useVideoPlayer, VideoView } from 'expo-video';
// import React, { useEffect, useRef, useState } from 'react';

// import {
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
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const UserReelItem = ({
//   item,
//   index,
//   currentIndex,
//   isMuted,
//   handleToggleMute,
//   showIcon,
//   fadeAnim,
//   toggleLike,
//   addComment,
//   addShare,
//   activeTab,
//   setActiveTab,
// }: any) => {
//   const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();

//   const bottomContentBottom = SCREEN_HEIGHT * 0.12;
//   const rightActionsBottom = SCREEN_HEIGHT * 0.12;
//   const topBarPaddingTop = SCREEN_HEIGHT * 0.05;
//   const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
//   const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;
//   const { username, ProfilePicture } = useProfileStore();
//   const [showOptions, setShowOptions] = React.useState(false);

//   const videoKey = currentIndex === index ? `video-${item.id}-active` : `video-${item.id}`;

//   // create player
//   const player = useVideoPlayer(
//     typeof item.videoUrl === "string" ? { uri: item.videoUrl } : item.videoUrl,
//     (playerInstance) => {
//       playerInstance.loop = true;
//       playerInstance.volume = isMuted ? 0 : 1;
//     }
//   );

//   useEffect(() => {
//     let isMounted = true;

//     const controlPlayback = async () => {
//       try {
//         if (!isMounted || !player) return;

//         if (currentIndex === index) {
//           player.currentTime = 0;
//           await player.play();
//           player.volume = isMuted ? 0 : 1;
//         } else {
//           await player.pause();
//           player.volume = 0;
//         }
//       } catch (error) {
//         console.warn('Playback control error:', (error as Error)?.message);
//       }
//     };

//     controlPlayback();

//     return () => {
//       isMounted = false;
//       try {
//         player.pause?.();
//       } catch { }
//     };
//   }, [currentIndex, index, isMuted]);

//   // mute/unmute
//   useEffect(() => {
//     player.volume = isMuted ? 0 : 1;
//   }, [isMuted]);

//   const formatNumber = (num: number): string => {
//     if (typeof num !== 'number' || isNaN(num)) return '0';
//     if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
//     if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
//     return num.toString();
//   };

//   const videoPosition = useRef(0);

//   const handlePressIn = () => {
//     player.pause();
//   };

//   const handlePressOut = () => {
//     player.play();
//   };

//   return (
//     <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
//       <Pressable
//         style={{ flex: 1 }}
//         onPress={handleToggleMute}
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//       >
//         <VideoView
//           style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
//           key={`video-${item.id}-${index}`}
//           player={player}
//           contentFit="cover"
//           allowsFullscreen={false}
//           allowsPictureInPicture={false}
//           nativeControls={false}
//         />

//         {/* Audio Icon Overlay */}
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

//       {/* Bottom Content */}
//       <View style={[styles.bottomContent, { bottom: bottomContentBottom }]}>
//         <View style={styles.userInfo}>
//           <Image
//             source={{ uri: item.profilePicture }}
//             style={{
//               width: AVATAR_SIZE,
//               height: AVATAR_SIZE,
//               borderRadius: AVATAR_SIZE / 2,
//               marginRight: 8,
//               borderWidth: 2,
//               borderColor: '#fff',
//             }}
//           />
//           <Text style={styles.username}>{username}</Text>
//         </View>
//         <Text style={styles.username}>{item.title}</Text>
//         <Text style={styles.caption}>{item.caption}</Text>
//         <View style={styles.musicInfo}>
//           <Text style={styles.musicIcon}>♪</Text>
//           <Text style={styles.musicText}>
//             Original Sound - hello
//           </Text>
//         </View>
//       </View>

//       {/* Right Actions */}
//       <View style={[styles.rightActions, { bottom: rightActionsBottom }]}>
//         <TouchableOpacity style={styles.actionButton}>
//           <Image
//             source={{ uri: item.profilePicture }}
//             style={{
//               width: AVATAR_SIZE,
//               height: AVATAR_SIZE,
//               borderRadius: AVATAR_SIZE / 2,
//               borderWidth: 2,
//               borderColor: '#fff',
//             }}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.uuid)}>
//           <Ionicons
//             name={item.isLiked ? 'heart' : 'heart-outline'}
//             size={ACTION_ICON_SIZE}
//             color={item.isLiked ? 'red' : '#fff'}
//           />
//           <Text style={styles.actionText}>{formatNumber(item.likes || 0)}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => router.push(`/comment/${item.uuid}`)}
//         >
//           <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
//           <Text style={styles.actionText}>{formatNumber(item.comments || 0)}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.uuid)}>
//           <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
//           <Text style={styles.actionText}>{formatNumber(item.shares || 0)}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton} onPress={() => setShowOptions(true)}>
//           <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       <BottomDrawer
//         visible={showOptions}
//         onClose={() => setShowOptions(false)}
//         onSave={() => { router.push("/(drawer)/(tabs)/reels/bookmark"); setShowOptions(false) }}
//         onReport={() => console.log("Reported")}
//         onShare={() => console.log("Shared")}
//       />
//     </View>
//   );
// };

// const UserReelsFeed = () => {
//   const { height: SCREEN_HEIGHT } = useWindowDimensions();
//   const flatListRef = useRef<FlatList>(null);
//   const isFocused = useIsFocused();

//   // FIXED: Single useLocalSearchParams call
//   const { id, username } = useLocalSearchParams();

//   console.log("id username here in user post", id ,username);
  
//   const [isMuted, setIsMuted] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);

// const {
//   data: profile,
//   isLoading: profileLoading,
//   isError: profileError,
// } = useQuery({
//   queryKey: ["userProfile", username],
//   queryFn: () => GetProfileUsername(username || ""),
//   enabled: !!username,
// });

// const videos = profile?.videos ?? [];

//   const {
//     toggleLike,
//     addComment,
//     addShare,
//     activeTab,
//     setActiveTab,
//     toggleMute,
//     showIcon,
//     setShowIcon,
//     fadeAnim,
//     updateReelURL,
//   } = useReelsStore();

//   // ──────────────────────────────────────────────────────────────
//   // 2. Find the start index from the incoming `id`
//   // ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//   if (!Array.isArray(videos) || videos.length === 0 || !id) return;
//     const startIdx = videos.findIndex(v => r.uuid === id);
//     if (startIdx > -1) {
//       setCurrentIndex(startIdx);
//       setTimeout(() => {
//         flatListRef.current?.scrollToIndex({ index: startIdx, animated: false });
//       }, 100);
//     }
//   }, [id, videos]);

//   // ──────────────────────────────────────────────────────────────
//   // 3. URL sync when user swipes
//   // ──────────────────────────────────────────────────────────────
//   const updateURL = (idx: number) => {
//     if (!videos[idx]) return;
//     const reel = videos[idx];
//     router.setParams({ id: reel.uuid, username: username || reel.username });
//     updateReelURL(reel.uuid);
//   };


//   // ──────────────────────────────────────────────────────────────
//   // 4. Scroll handling
//   // ──────────────────────────────────────────────────────────────
//   const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const y = e.nativeEvent.contentOffset.y;
//     const idx = Math.round(y / SCREEN_HEIGHT);
//     if (idx !== currentIndex && videos[idx]) {
//       setCurrentIndex(idx);
//       updateURL(idx);
//     }
//   };

//   const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const y = e.nativeEvent.contentOffset.y;
//     const idx = Math.round(y / SCREEN_HEIGHT);
//     setCurrentIndex(idx);
//   };

//   // ──────────────────────────────────────────────────────────────
//   // 5. Mute / focus handling
//   // ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     setIsMuted(!isFocused);
//   }, [isFocused]);

//   const handleToggleMute = () => {
//     setIsMuted(prev => !prev);
//     setShowIcon(true);
//     Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => {
//       setTimeout(() => {
//         Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() =>
//           setShowIcon(false)
//         );
//       }, 1200);
//     });
//   };

//   // ──────────────────────────────────────────────────────────────
//   // 6. Render
//   // ──────────────────────────────────────────────────────────────
//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />
//       <FlatList
//         ref={flatListRef}
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
//             toggleLike={toggleLike}
//             addComment={addComment}
//             addShare={addShare}
//             activeTab={activeTab}
//             setActiveTab={setActiveTab}
//           />
//         )}
//         keyExtractor={(item, i) => item.uuid?.toString() ?? i.toString()}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         snapToInterval={SCREEN_HEIGHT}
//         decelerationRate="fast"
//         getItemLayout={(_, i) => ({
//           length: SCREEN_HEIGHT,
//           offset: SCREEN_HEIGHT * i,
//           index: i,
//         })}
//         onMomentumScrollEnd={onMomentumEnd}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   centerIcon: {
//     position: "absolute",
//     top: "45%",
//     left: "40%",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.3)",
//     borderRadius: 50,
//     padding: 10,
//   },
//   bottomContent: { position: 'absolute', left: '4%', right: '20%' },
//   userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   username: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   caption: { color: '#fff', fontSize: 14, marginBottom: 8 },
//   musicInfo: { flexDirection: 'row', alignItems: 'center' },
//   musicIcon: { fontSize: 16, marginRight: 8, color: '#fff' },
//   musicText: { color: '#fff', fontSize: 14 },
//   rightActions: { position: 'absolute', right: '4%', alignItems: 'center' },
//   actionButton: { alignItems: 'center', marginBottom: 24 },
//   actionText: { color: '#fff', fontSize: 12, fontWeight: '600' },
//   tabsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     borderRadius: 20,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },
//   tabText: {
//     color: '#ccc',
//     fontSize: 16,
//     marginHorizontal: 8,
//     fontWeight: '500',
//     textShadowColor: 'rgba(0, 0, 0, 0.8)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   activeTabText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   videoContainer: {
//     width: '100%',
//     height: 300,
//     marginVertical: 5,
//   },
//   postVideo: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 10,
//   },
// });

// export default UserReelsFeed;

// // All Your Imports
// import { GetProfileUsername } from '@/src/api/profile-api';
// import BottomDrawer from '@/src/components/ui/BottomDrawer';
// import { useReelsStore } from '@/src/store/useReelsStore';
// import { useProfileStore } from '@/src/store/userProfileStore';
// import { useIsFocused } from '@react-navigation/native';
// import { useQuery } from '@tanstack/react-query';
// import { router, useLocalSearchParams } from "expo-router";
// import { useVideoPlayer, VideoView } from 'expo-video';
// import React, { useEffect, useRef, useState } from 'react';


// import {
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
//   toggleLike,
//   addComment,
//   addShare,
// }: any) => {
//   const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
//   const { username } = useProfileStore();
//   const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
//   const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;
//    const [showOptions, setShowOptions] = React.useState(false);
//   const player = useVideoPlayer(
//     { uri: item.videoUrl },
//     (instance) => {
//       instance.loop = true;
//       instance.volume = isMuted ? 0 : 1;
//     }
//   );

//   // Handle play/pause based on scroll
//   useEffect(() => {
//     if (currentIndex === index) {
//       player.currentTime = 0;
//       player.play();
//       player.volume = isMuted ? 0 : 1;
//     } else {
//       try {
//         player.pause();
//       } catch { }
//       player.volume = 0;
//     }
//   }, [currentIndex, index, isMuted]);

//   return (
  
//   <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
//   <Pressable
//     style={{ flex: 1 }}
//     onPress={handleToggleMute}
//   >
//     <VideoView
//       style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
//       key={`video-${item.id}-${index}`}
//       player={player}
//       contentFit="cover"
//     />

//     {/* Volume Icon */}
//     {showIcon && (
//       <Animated.View style={[styles.centerIcon, { opacity: fadeAnim }]}>
//         <Ionicons
//           name={isMuted ? "volume-mute" : "volume-high"}
//           size={ACTION_ICON_SIZE}
//           color="#fff"
//         />
//       </Animated.View>
//     )}
//   </Pressable>

//   {/* Bottom Info */}
//   <View style={[styles.bottomContent, { bottom: SCREEN_HEIGHT * 0.12 }]}>
//     <View style={styles.userInfo}>
//       <Image
//         source={{ uri: item.profilePicture }}
//         style={{
//           width: AVATAR_SIZE,
//           height: AVATAR_SIZE,
//           borderRadius: AVATAR_SIZE / 2,
//           borderWidth: 2,
//           borderColor: '#fff',
//         }}
//       />
//       <Text style={styles.username}>{item.user?.username || username}</Text>
//     </View>
//     <Text style={styles.username}>{item.title}</Text>
//     <Text style={styles.caption}>{item.caption}</Text>
//   </View>

//   {/* Right Actions */}
//   <View style={[styles.rightActions, { bottom: SCREEN_HEIGHT * 0.12 }]}>
//     <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
//       <Ionicons
//         name={item.isLiked ? 'heart' : 'heart-outline'}
//         size={ACTION_ICON_SIZE}
//         color={item.isLiked ? 'red' : '#fff'}
//       />
//       {/* Use .length to avoid object rendering */}
//       <Text style={styles.actionText}>{item.likes?.length || 0}</Text>
//     </TouchableOpacity>

//     <TouchableOpacity
//       style={styles.actionButton}
//       onPress={() => router.push(`/comment/${item.id}`)}
//     >
//       <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
//       <Text style={styles.actionText}>{item.comments?.length || 0}</Text>
//     </TouchableOpacity>

//     <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.id)}>
//       <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
//       <Text style={styles.actionText}>{item.shares?.length || 0}</Text>
//     </TouchableOpacity>

//     <TouchableOpacity style={styles.actionButton} onPress={() => setShowOptions(true)}>
//       <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
//     </TouchableOpacity>

//     {/* Bottom Drawer */}
//     <BottomDrawer
//       visible={showOptions}
//       onClose={() => setShowOptions(false)}
//       onSave={() => {
//         router.push("/(drawer)/(tabs)/reels/bookmark");
//         setShowOptions(false);
//       }}
//       onReport={() => console.log("Reported")}
//       onShare={() => console.log("Shared")}
//     />
//   </View>
// </View>

//   );
// };


// // Full Feed Component
// const UserReelsFeed = () => {
//   const { height: SCREEN_HEIGHT } = useWindowDimensions();
//   const flatListRef = useRef<FlatList>(null);
//   const isFocused = useIsFocused();

//   const { id, username } = useLocalSearchParams();

//   const [isMuted, setIsMuted] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Fetch profile + videos
//   const { data: profile } = useQuery({
//     queryKey: ["userProfile", username],
//     queryFn: () => GetProfileUsername(username as string || ""),
//     enabled: !!username,
//   });

//   const videos = profile?.videos ?? [];

//   // Zustand actions (no data)
//   const {
//     toggleLike,
//     addComment,
//     addShare,
//     showIcon,
//     setShowIcon,
//     fadeAnim,
//     updateReelURL,
//   } = useReelsStore();


//   // Find start index from URL param id
//   useEffect(() => {
//     if (!videos.length || !id) return;

//     const startIdx = videos.findIndex((v: any) => v.id === id);

//     if (startIdx > -1) {
//       setCurrentIndex(startIdx);
//       setTimeout(() => {
//         flatListRef.current?.scrollToIndex({ index: startIdx, animated: false });
//       }, 50);
//     }
//   }, [id, videos]);


//   // Sync URL when swiping
//   const updateURL = (idx: number) => {
//     const reel = videos[idx];
//     if (!reel) return;

//     router.setParams({ id: reel.id, username: username });
//     updateReelURL(reel.id);
//   };


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
//             toggleLike={toggleLike}
//             addComment={addComment}
//             addShare={addShare}
//           />
//         )}
//         keyExtractor={(item, i) => item.id?.toString() ?? i.toString()}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         snapToInterval={SCREEN_HEIGHT}
//         onMomentumScrollEnd={onMomentumEnd}
//         decelerationRate="fast"
//       />
//     </View>
//   );
// };


// // Styles
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   centerIcon: {
//     position: "absolute",
//     top: "45%",
//     left: "40%",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.3)",
//     borderRadius: 50,
//     padding: 10,
//   },
//   bottomContent: { position: 'absolute', left: '4%', right: '20%' },
//   userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   username: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   caption: { color: '#fff', fontSize: 14, marginBottom: 8 },
//   rightActions: { position: 'absolute', right: '4%', alignItems: 'center' },
//   actionButton: { alignItems: 'center', marginBottom: 24 },
//   actionText: { color: '#fff', fontSize: 12, fontWeight: '600' },
// });

// export default UserReelsFeed;

// All Your Imports
import { GetProfileUsername } from '@/src/api/profile-api';
import BottomDrawer from '@/src/components/ui/BottomDrawer';
import { useReelsStore } from '@/src/store/useReelsStore';
import { useProfileStore } from '@/src/store/userProfileStore';
import { useIsFocused } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
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
  toggleLike,
  addComment,
  addShare,
}: any) => {
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const { username } = useProfileStore();
  const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
  const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;
  const [showOptions, setShowOptions] = React.useState(false);
  
  const player = useVideoPlayer(
    { uri: item.videoUrl },
    (instance) => {
      instance.loop = true;
      instance.volume = isMuted ? 0 : 1;
    }
  );

  // Handle play/pause based on scroll
  useEffect(() => {
    if (currentIndex === index) {
      player.currentTime = 0;
      player.play();
      player.volume = isMuted ? 0 : 1;
    } else {
      try {
        player.pause();
      } catch { }
      player.volume = 0;
    }
  }, [currentIndex, index, isMuted]);

  return (
    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
      {/* Video Player */}
      <Pressable
        style={{ flex: 1 }}
        onPress={handleToggleMute}
      >
        <VideoView
          style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          key={`video-${item.id}-${index}`}
          player={player}
          contentFit="cover"
        />

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
      </Pressable>

      {/* Bottom Info */}
      <View style={[styles.bottomContent, { bottom: SCREEN_HEIGHT * 0.12 }]}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.profilePicture }}
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: AVATAR_SIZE / 2,
              borderWidth: 2,
              borderColor: '#fff',
            }}
          />
          <Text style={styles.username}>@{item.user?.username || username}</Text>
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
      </View>

      {/* Right Actions - Improved Layout */}
      <View style={[styles.rightActions, { bottom: SCREEN_HEIGHT * 0.12 }]}>
        <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
          <Ionicons
            name={item.isLiked ? 'heart' : 'heart-outline'}
            size={ACTION_ICON_SIZE}
            color={item.isLiked ? 'red' : '#fff'}
          />
          <Text style={styles.actionText}>{item.likes?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/comment/${item.id}`)}
        >
          <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
          <Text style={styles.actionText}>{item.comments?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.id)}>
          <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
          <Text style={styles.actionText}>{item.shares?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { marginTop: 8 }]} 
          onPress={() => setShowOptions(true)}
        >
          <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Drawer - Perfectly Styled */}
      <BottomDrawer
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onSave={() => {
          router.push("/(drawer)/(tabs)/reels/bookmark");
          setShowOptions(false);
        }}
        onReport={() => console.log("Reported")}
        onShare={() => console.log("Shared")}
      />
    </View>
  );
};

// Full Feed Component
const UserReelsFeed = () => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const isFocused = useIsFocused();

  const { id, username } = useLocalSearchParams();

  const [isMuted, setIsMuted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch profile + videos
  const { data: profile } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => GetProfileUsername(username as string || ""),
    enabled: !!username,
  });

  const videos = profile?.videos ?? [];

  // Zustand actions (no data)
  const {
    toggleLike,
    addComment,
    addShare,
    showIcon,
    setShowIcon,
    fadeAnim,
    updateReelURL,
  } = useReelsStore();

  // Find start index from URL param id
  useEffect(() => {
    if (!videos.length || !id) return;

    const startIdx = videos.findIndex((v: any) => v.id === id);

    if (startIdx > -1) {
      setCurrentIndex(startIdx);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: startIdx, animated: false });
      }, 50);
    }
  }, [id, videos]);

  // Sync URL when swiping
  const updateURL = (idx: number) => {
    const reel = videos[idx];
    if (!reel) return;

    router.setParams({ id: reel.id, username: username });
    updateReelURL(reel.id);
  };

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
            toggleLike={toggleLike}
            addComment={addComment}
            addShare={addShare}
          />
        )}
        keyExtractor={(item, i) => item.id?.toString() ?? i.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        onMomentumScrollEnd={onMomentumEnd}
        decelerationRate="fast"
      />
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
