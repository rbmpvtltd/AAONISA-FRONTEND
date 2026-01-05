// import { GetCurrentUser } from '@/src/api/profile-api';
// import BottomDrawer from '@/src/components/ui/BottomDrawer';
// import ReportDrawer from '@/src/components/ui/ReportDrawer';
// import BookmarkPanel from '@/src/features/bookmark/bookmarkPanel';
// import { createReelGesture } from '@/src/hooks/ReelGestures';
// import { getTimeAgo } from '@/src/hooks/ReelsUploadTime';
// import { useMarkViewedMutation } from '@/src/hooks/useMarkViewedMutation';
// import { useReelsByCategory } from '@/src/hooks/useReelsByCategory';
// import { useLikeMutation } from '@/src/hooks/userLikeMutation';
// import { useBookmarkStore } from '@/src/store/useBookmarkStore';
// import { useReelsStore } from '@/src/store/useReelsStore';
// import { formatCount } from '@/src/utils/formatCount';
// import { useIsFocused } from '@react-navigation/native';
// import { useQuery } from '@tanstack/react-query';
// import { router, useLocalSearchParams } from "expo-router";
// import { useVideoPlayer, VideoView } from 'expo-video';
// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Animated,
//   FlatList,
//   Image,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useWindowDimensions,
//   View
// } from "react-native";
// import { GestureDetector, ScrollView } from 'react-native-gesture-handler';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import VideoProgressBar from './videoProgressBar';

// const ReelItem = ({
//   item,
//   index,
//   currentIndex,
//   isMuted,
//   handleToggleMute,
//   showIcon,
//   fadeAnim,
//   toggleLike,
//   likeMutation,
//   currentUserId,
//   // addComment,
//   addShare,
//   activeTab,
//   setActiveTab,
// }: any) => {
//   const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
//   const [showOptions, setShowOptions] = React.useState(false);
//   const bottomContentBottom = SCREEN_HEIGHT * 0.12;
//   const rightActionsBottom = SCREEN_HEIGHT * 0.12;
//   const topBarPaddingTop = SCREEN_HEIGHT * 0.05;
//   const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
//   const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;
//   const { openBookmarkPanel, } = useBookmarkStore();
//   const videoKey = currentIndex === index ? `video-${item.id}-active` : `video-${item.id}`;
//   const [likesCount, setLikesCount] = useState(item.likesCount ?? 0);
//   const [showFullCaption, setShowFullCaption] = useState(false);
//   const [showBottomDrawer, setShowBottomDrawer] = useState(false);
//   const [showReportDrawer, setShowReportDrawer] = useState(false);
//   const isFocused = useIsFocused();
//   const [duration, setDuration] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showThumbnail, setShowThumbnail] = useState(true);
//   const markViewedMutation = useMarkViewedMutation(item.id);
//   const [viewed, setViewed] = useState(false);
//   const [paused, setPaused] = useState(false);

//   const [liked, setLiked] = useState(item.isLiked ?? false);
//   console.log("REEL id:", item.id || item.uuid);

//   // create player
//   const player = useVideoPlayer(
//     typeof item.videoUrl === "string" ? { uri: item.videoUrl } : item.videoUrl,
//     (p) => {
//       p.loop = true;
//     }
//   );


//   useEffect(() => {
//     player.volume = isMuted ? 0 : 1;
//   }, [isMuted]);

//   useEffect(() => {
//     if (!player) return;

//     if (!isFocused) {
//       player.pause();
//       return;
//     }

//     if (currentIndex === index) {
//       player.play();
//       player.volume = isMuted ? 0 : 1;
//       // player.play();
//       // player.volume = isMuted ? 0 : 1;
//     } else {
//       player.pause();
//       player.volume = 0;
//     }
//   }, [isFocused, currentIndex, index, isMuted]);

//   useEffect(() => {
//     if (!player) return;

//     const listener = player.addListener("statusChange", () => {
//       if (player.status === "loading") {
//         setIsLoading(true);   // loader ON
//       }

//       if (player.status === "readyToPlay") {
//         setIsLoading(false);  // loader OFF
//       }

//       if (player.status === "readyToPlay" && player.duration != null) {
//         // console.log("duration", player.duration);
//         setDuration(player.duration);
//       }
//     });

//     return () => listener.remove();
//   }, [player]);
//   // mute/unmute

//   const formatNumber = (num: number): string => {
//     if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
//     if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
//     return num.toString();
//   };

//   const videoPosition = useRef(0);

//   const handleLike = async () => {
//     const newLiked = !liked;

//     // UI update
//     setLiked(newLiked);
//     setLikesCount((prev: number) => newLiked ? prev + 1 : Math.max(0, prev - 1));

//     try {
//       await likeMutation.mutateAsync(item.uuid || item.id);
//     } catch (err) {
//       // revert on error
//       setLiked(!newLiked);
//       setLikesCount((prev: number) => newLiked ? prev - 1 : prev + 1);
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

//   const reelId = item.uuid || item.id;

//   const handleLongPressIn = () => {
//     setPaused(true);
//     player.pause();
//   };

//   const handleLongPressOut = () => {
//     setPaused(false);
//     player.play();
//   };


//   const composedGesture = createReelGesture({
//     onTap: handleToggleMute,
//     onLongPressIn: handleLongPressIn,
//     onLongPressOut: handleLongPressOut,
//   });

//   return (
//     <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
//       {/* <Pressable
//         style={{ flex: 1 }}
//         onPress={handleToggleMute}
//         onLongPress={handleLongPressIn}
//         onPressOut={handleLongPressOut}
//         delayLongPress={150}
//       >

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
//           player={player}
//           contentFit="cover"
//           allowsFullscreen={false}
//           allowsPictureInPicture={false}
//           nativeControls={false}
//         />

//         {showIcon && (
//           <Animated.View style={[styles.centerIcon, { opacity: fadeAnim }]}>
//             <Ionicons
//               name={isMuted ? "volume-mute" : "volume-high"}
//               size={ACTION_ICON_SIZE}
//               color="#fff"
//             />
//           </Animated.View>
//         )}

//       </Pressable> */}

//       <GestureDetector gesture={composedGesture}>
//         <Animated.View style={{ flex: 1 }}>

//           {isLoading && (
//             <View
//               style={{
//                 position: "absolute",
//                 top: "45%",
//                 left: "45%",
//                 zIndex: 9999,
//               }}
//             >
//               <ActivityIndicator size="large" color="#fff" />
//             </View>
//           )}

//           <VideoView
//             style={{
//               position: 'absolute',
//               width: SCREEN_WIDTH,
//               height: SCREEN_HEIGHT,
//             }}
//             player={player}
//             contentFit="cover"
//             allowsFullscreen={false}
//             allowsPictureInPicture={false}
//             nativeControls={false}
//           />

//           {showIcon && (
//             <Animated.View style={[styles.centerIcon, { opacity: fadeAnim }]}>
//               <Ionicons
//                 name={isMuted ? "volume-mute" : "volume-high"}
//                 size={ACTION_ICON_SIZE}
//                 color="#fff"
//               />
//             </Animated.View>
//           )}

//         </Animated.View>
//       </GestureDetector>


//       {/* Bottom Content */}
//       <View style={[styles.bottomContent, { bottom: bottomContentBottom }]}>
//         <View style={styles.userInfo}>
//           <TouchableOpacity
//             style={{ flexDirection: 'row', alignItems: 'center' }}
//             onPress={() => {
//               router.push(`/profile/${item.user.username}`);
//             }}
//           >
//             <Image
//               source={{
//                 uri: item.user.profilePic ? item.user.profilePic
//                   : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
//               }}
//               style={{
//                 width: AVATAR_SIZE,
//                 height: AVATAR_SIZE,
//                 borderRadius: AVATAR_SIZE / 2,
//                 marginRight: 8,
//               }}
//             />

//             <Text style={styles.username}>{item.user.username}</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ marginBottom: 8 }}>
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
//             <View style={{ maxHeight: 200 }}>
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
//             Original Sound - {item.user.username}
//           </Text>
//         </View>

//         <Text style={{ color: "#ccc", fontSize: 12, marginTop: 4 }}>
//           {getTimeAgo(item.created_at)}
//         </Text>
//       </View>

//       {/* Right Actions */}
//       <View style={[styles.rightActions, { bottom: rightActionsBottom }]}>

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
//             {formatCount(likesCount)}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => router.push(`/comment/${reelId}`)}
//         >
//           <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
//           <Text style={styles.actionText}>
//             {formatCount(item.commentsCount)}
//           </Text>
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
//           <Text style={styles.actionText}>{formatCount(item.shares)}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton} onPress={() => setShowOptions(true)}>
//           <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       <VideoProgressBar
//         player={player}
//         isActive={currentIndex === index && isFocused}
//         paused={paused}
//       />

//       <BottomDrawer
//         visible={showOptions}
//         onClose={() => setShowOptions(false)}
//         onSave={() => {
//           openBookmarkPanel(item.id || item.uuid);
//           setShowOptions(false);
//         }}
//         // onReport={() => console.log("Reported:", item.id || item.uuid)}
//         onReport={() => setShowReportDrawer(true)}
//         reelId={item.id || item.uuid}
//         reelUrl={item.videoUrl} // add this too for share/download
//       />

//       <ReportDrawer
//         visible={showReportDrawer}
//         onClose={() => setShowReportDrawer(false)}
//         onSelect={(reason: string) => {
//           console.log("User reported for:", reason);
//           setShowReportDrawer(false);
//         }}
//         videoId={item.id || item.uuid}
//       />
//     </View>
//   );
// };

// const ReelsFeed = () => {
//   const { height: SCREEN_HEIGHT } = useWindowDimensions();
//   const flatListRef = useRef<FlatList>(null);
//   const isFocused = useIsFocused();
//   const { id, videoId, tab } = useLocalSearchParams();
//   const likeMutation = useLikeMutation();
//   const hasScrolledToVideo = useRef(false);
//   const {
//     // toggleLike,
//     // addComment,
//     addShare,
//     currentIndex,
//     setCurrentIndex,
//     activeTab,
//     setActiveTab,
//     isMuted,
//     toggleMute,
//     showIcon,
//     setShowIcon,
//     fadeAnim,
//     updateReelURL,

//     //NEW: URL update function
//     autoScroll,
//   } = useReelsStore();

//   useEffect(() => {
//     if (tab && typeof tab === 'string') {
//       const tabName = tab.charAt(0).toUpperCase() + tab.slice(1);
//       if (['Explore', 'News', 'Followings'].includes(tabName)) {
//         setActiveTab(tabName as any);
//       }
//     }
//   }, [tab]);

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//     refetch,
//   } = useReelsByCategory(activeTab.toLowerCase());

//   const reels = data?.pages.flatMap((p: any) => p.reels) || [];



//   // URL update function
//   const updateURL = (index: number) => {
//     if (!reels[index]) return;

//     const reelId = reels[index].id || reels[index].uuid;

//     if (String(id) === String(reelId)) return;

//     router.setParams({ id: reelId, videoId: reelId, tab: activeTab });
//     updateReelURL(reelId);
//   };

//   // useEffect(() => {
//   //   if (!autoScroll || reels.length === 0) return;

//   //   const interval = setInterval(() => {
//   //     const nextIndex =
//   //       currentIndex + 1 < reels.length ? currentIndex + 1 : 0;

//   //     setCurrentIndex(nextIndex);

//   //     flatListRef.current?.scrollToIndex({
//   //       index: nextIndex,
//   //       animated: true,
//   //     });

//   //     updateURL(nextIndex);
//   //   }, 10000);

//   //   return () => clearInterval(interval);
//   // }, [autoScroll, reels.length]);


//   // auto scroll logic 
//   useEffect(() => {
//     if (!autoScroll || reels.length === 0) return;

//     // current video ki duration lo
//     const currentVideoDuration = reels[currentIndex]?.duration;

//     if (!currentVideoDuration) return;

//     const timer = setTimeout(() => {
//       const nextIndex =
//         currentIndex + 1 < reels.length ? currentIndex + 1 : 0;

//       setCurrentIndex(nextIndex);

//       flatListRef.current?.scrollToIndex({
//         index: nextIndex,
//         animated: true,
//       });

//       updateURL(nextIndex);
//     }, currentVideoDuration * 1000);

//     return () => clearTimeout(timer);
//   }, [autoScroll, reels.length, currentIndex]);


//   useEffect(() => {
//     if (videoId && reels.length > 0 && flatListRef.current) {
//       const targetIndex = reels.findIndex(
//         (reel) => String(reel.id) === String(videoId) || String(reel.uuid) === String(videoId)
//       );

//       if (targetIndex !== -1) {
//         console.log('🎯 Found video at index:', targetIndex);

//         setTimeout(() => {
//           setCurrentIndex(targetIndex);
//           flatListRef.current?.scrollToIndex({
//             index: targetIndex,
//             animated: false,
//           });

//           updateReelURL(reels[targetIndex].id || reels[targetIndex].uuid);
//         }, 100);
//       } else {
//         console.log('⚠️ Video not found in current feed');
//       }
//     }
//   }, [videoId, reels.length]);


//   // Add this to your state
//   // const [isManualNavigation, setIsManualNavigation] = useState(false);

//   // // Modified auto-scroll effect
//   // useEffect(() => {
//   //   if (!autoScroll || reels.length === 0 || isManualNavigation) return;

//   //   const currentVideoDuration = reels[currentIndex]?.duration;

//   //   if (!currentVideoDuration) return; 

//   //   const timer = setTimeout(() => {
//   //     const nextIndex =
//   //       currentIndex + 1 < reels.length ? currentIndex + 1 : 0;

//   //     setCurrentIndex(nextIndex);

//   //     flatListRef.current?.scrollToIndex({
//   //       index: nextIndex,
//   //       animated: true,
//   //     });

//   //     updateURL(nextIndex);
//   //   }, currentVideoDuration * 1000); 

//   //   return () => clearTimeout(timer);
//   // }, [autoScroll, reels.length, currentIndex, isManualNavigation]);

//   // // Modified videoId effect
//   // useEffect(() => {
//   //   if (videoId && reels.length > 0 && flatListRef.current) {
//   //     const targetIndex = reels.findIndex(
//   //       (reel) => String(reel.id) === String(videoId) || String(reel.uuid) === String(videoId)
//   //     );

//   //     if (targetIndex !== -1) {
//   //       console.log('🎯 Found video at index:', targetIndex);

//   //       setIsManualNavigation(true); // Prevent auto-scroll

//   //       setTimeout(() => {
//   //         setCurrentIndex(targetIndex);
//   //         flatListRef.current?.scrollToIndex({
//   //           index: targetIndex,
//   //           animated: false,
//   //         });

//   //         updateReelURL(reels[targetIndex].id || reels[targetIndex].uuid);

//   //         // Re-enable auto-scroll after a delay
//   //         setTimeout(() => {
//   //           setIsManualNavigation(false);
//   //         }, 500);
//   //       }, 100);
//   //     } else {
//   //       console.log('⚠️ Video not found in current feed');
//   //     }
//   //   }
//   // }, [videoId, reels.length]);

//   const handleScroll = (event: any) => {
//     const index = Math.round(event.nativeEvent.contentOffset.y / SCREEN_HEIGHT);

//     if (index !== currentIndex && reels[index]) {
//       setCurrentIndex(index);
//       // updateReelURL(index);
//     }
//   };

//   // mute/unmute animation
//   const handleToggleMute = () => {
//     toggleMute();
//     setShowIcon(true);

//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 150,
//       useNativeDriver: true,
//     }).start(() => {
//       setTimeout(() => {
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 400,
//           useNativeDriver: true,
//         }).start(() => setShowIcon(false));
//       }, 800);
//     });
//   };
//   // const currentUserId = useProfileStore(state => state.userId);

//   const { data: currentUser, isLoading: currentUserLoading } = useQuery({
//     queryKey: ["currentUser"],
//     queryFn: GetCurrentUser,
//   });

//   const currentUserId = currentUser?.userProfile?.id

//   if (isLoading)
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );

//   if (isError)
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Error loading reels</Text>
//       </View>
//     );


//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />
//       {/* Top Bar */}
//       <View style={styles.topBar}>
//         <View style={styles.tabsContainer}>
//           {['Explore', 'News', 'Followings'].map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               onPress={() => setActiveTab(tab as any)}
//             >
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
//       </View>


//       <FlatList
//         ref={flatListRef}
//         // data={reels || []}
//         data={Array.isArray(reels) ? reels.filter(r => r?.id) : []}
//         keyExtractor={(item, index) => (item?.id ? String(item.id) : `key-${index}`)}
//         renderItem={({ item, index }) => {
//           if (!item) return null;
//           return (
//             <ReelItem
//               item={item}
//               index={index}
//               currentIndex={currentIndex}
//               isMuted={isMuted}
//               handleToggleMute={handleToggleMute}
//               showIcon={showIcon}
//               fadeAnim={fadeAnim}
//               currentUserId={currentUserId}
//               // toggleLike={toggleLike}
//               // toggleLike={(id: string) => likeMutation.mutate(id)}
//               likeMutation={likeMutation}
//               // addComment={addComment}
//               addShare={addShare}
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//             />
//           )
//         }}
//         // keyExtractor={(item) => item.id.toString()}
//         pagingEnabled
//         snapToInterval={SCREEN_HEIGHT}
//         showsVerticalScrollIndicator={false}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         decelerationRate="fast"
//         getItemLayout={(_, index) => ({
//           length: SCREEN_HEIGHT,
//           offset: SCREEN_HEIGHT * index,
//           index,
//         })}

//         // NEW: Extra safety for URL update
//         onMomentumScrollEnd={(event) => {
//           const offsetY = event.nativeEvent.contentOffset.y;
//           const index = Math.round(offsetY / SCREEN_HEIGHT);
//           if (index !== currentIndex && reels[index]) {
//             setCurrentIndex(index);
//             updateURL(index);
//           }
//         }}
//         onEndReached={() => {
//           if (hasNextPage) fetchNextPage();
//         }}
//         onEndReachedThreshold={0.4}
//         ListFooterComponent={
//           isFetchingNextPage ? (
//             <View style={{ padding: 20 }}>
//               <Text style={{ color: "#fff" }}>Loading more...</Text>
//             </View>
//           ) : null
//         }

//         onScrollToIndexFailed={(info) => {
//           console.log('Scroll to index failed:', info);
//           // Wait for render then retry
//           setTimeout(() => {
//             flatListRef.current?.scrollToIndex({
//               index: info.index,
//               animated: false,
//             });
//           }, 100);
//         }}
//       />

//       <BookmarkPanel
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   topBar: {
//     position: 'absolute',
//     top: 40,
//     left: 0,
//     right: 0,
//     zIndex: 999,
//     alignItems: 'center',
//   },
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
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     zIndex: 999,
//   },
//   overlayBackground: {
//     flex: 1,
//   },
//   bottomDrawer: {
//     backgroundColor: '#1a1a1a',
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//   },
//   optionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 0.4,
//     borderBottomColor: '#333',
//   },
//   optionText: {
//     color: '#fff',
//     fontSize: 16,
//     marginLeft: 12,
//   },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: "black",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   loadingText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   errorContainer: {
//     flex: 1,
//     backgroundColor: "black",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },

//   errorText: {
//     color: "red",
//     fontSize: 16,
//     textAlign: "center",
//     fontWeight: "600",
//   },


// });

// export default ReelsFeed;


// ====ARBAAZ CHOUHAN
import { GetCurrentUser } from '@/src/api/profile-api';
import BottomDrawer from '@/src/components/ui/BottomDrawer';
import ReportDrawer from '@/src/components/ui/ReportDrawer';
import BookmarkPanel from '@/src/features/bookmark/bookmarkPanel';
import { createReelGesture } from '@/src/hooks/ReelGestures';
import { getTimeAgo } from '@/src/hooks/ReelsUploadTime';
import { useLike } from '@/src/hooks/useLike';
import { useMarkViewedMutation } from '@/src/hooks/useMarkViewedMutation';
import { useReelsByCategory } from '@/src/hooks/useReelsByCategory';
import { useLikeMutation } from '@/src/hooks/userLikeMutation';
import { useBookmarkStore } from '@/src/store/useBookmarkStore';
import { useReelsStore } from '@/src/store/useReelsStore';
import { formatCount } from '@/src/utils/formatCount';
import { useIsFocused } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import { GestureDetector, Pressable, ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AudioBottomSheet from './AudioBottomSheet';
import VideoProgressBar from './videoProgressBar';


const ReelItem = ({
  item,
  index,
  currentIndex,
  isMuted,
  handleToggleMute,
  showIcon,
  fadeAnim,
  likeMutation,
  currentUserId,
  addShare,
  activeTab,
  setActiveTab,
}: any) => {
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const [showOptions, setShowOptions] = useState(false);
  const bottomContentBottom = SCREEN_HEIGHT * 0.12;
  const rightActionsBottom = SCREEN_HEIGHT * 0.12;
  const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
  const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;
  const { openBookmarkPanel } = useBookmarkStore();

  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showBottomDrawer, setShowBottomDrawer] = useState(false);
  const [showReportDrawer, setShowReportDrawer] = useState(false);
  const isFocused = useIsFocused();
  const [duration, setDuration] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const markViewedMutation = useMarkViewedMutation(item.id || item.uuid);
  const [viewed, setViewed] = useState(false);
  const [paused, setPaused] = useState(false);
  const isMountedRef = useRef(true);



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


  const TOP_OFFSET = 100; // StatusBar (40) + Tabs (60)
  const VIDEO_HEIGHT = SCREEN_HEIGHT - TOP_OFFSET;
  const [showAudioSheet, setShowAudioSheet] = useState(false);

  //  Single useEffect for mount/unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  console.log("REEL id:", item.id || item.uuid);
  // 🎯 Only create player for current and adjacent videos (preload ±2)
  const shouldLoadVideo = Math.abs(currentIndex - index) <= 2;

  // Create player conditionally
  const player = useVideoPlayer(
    shouldLoadVideo && typeof item.videoUrl === "string"
      ? { uri: item.videoUrl }
      : item.videoUrl,
    (p) => {
      p.loop = true;
    }
  );

  // Combined Play/Pause + Volume + Cleanup logic
  useEffect(() => {
    if (!player || !shouldLoadVideo) return;

    const shouldPlay = isFocused && currentIndex === index;

    try {
      if (shouldPlay) {
        player.play();
        player.volume = isMuted ? 0 : 1;
      } else {
        player.pause();
        player.volume = 0;
      }
    } catch (error) {
      console.log("Player control error:", error);
    }

    // Safe cleanup
    return () => {
      try {
        if (player && isMountedRef.current) {
          player.pause();
          player.volume = 0;
        }
      } catch (error) {
        console.log("Cleanup error:", error);
      }
    };
  }, [isFocused, currentIndex, index, isMuted, player, shouldLoadVideo]);

  useEffect(() => {
    if (!player) return;

    const listener = player.addListener("statusChange", () => {
      if (!isMountedRef.current) return;

      try {
        if (player.status === "loading") {
          setIsLoading(true);
          setShowThumbnail(true);
        }

        if (player.status === "readyToPlay") {
          setIsLoading(false);
          setTimeout(() => {
            if (isMountedRef.current) {
              setShowThumbnail(false);
            }
          }, 300);

          if (player.duration != null) {
            setDuration(player.duration);
          }
        }
      } catch (error) {
        console.log("Status change error:", error);
      }
    });

    return () => listener.remove();
  }, [player]);

  // View tracking (10 seconds)
  useEffect(() => {
    if (!shouldLoadVideo) return;

    let frameId: number;
    const checkTime = () => {
      if (!isMountedRef.current) return;

      try {
        if (currentIndex === index && player?.playing) {
          const time = player.currentTime;
          if (!viewed && time >= 10) {
            setViewed(true);
            markViewedMutation.mutate(item.uuid || item.id);
            console.log(`✅ Viewed: ${item.uuid || item.id} at ${time}s`);
          }
        }
      } catch (e) {
        console.log("View tracking error:", e);
      }

      if (isMountedRef.current) {
        frameId = requestAnimationFrame(checkTime);
      }
    };

    frameId = requestAnimationFrame(checkTime);
    return () => cancelAnimationFrame(frameId);
  }, [player, currentIndex, index, viewed, shouldLoadVideo, item.uuid, markViewedMutation]);

  const reelId = item.uuid || item.id;

  // Long press handlers for pause/resume
  const handleLongPressIn = () => {
    setPaused(true);
    if (player) player.pause();
  };

  const handleLongPressOut = () => {
    setPaused(false);
    if (player) player.play();
  };

  const composedGesture = createReelGesture({
    onTap: handleToggleMute,
    onLongPressIn: handleLongPressIn,
    onLongPressOut: handleLongPressOut,
  });

  return (
    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={{ flex: 1 }}>

          {/* 🖼️ THUMBNAIL - Shows while loading or when video not ready */}
          {showThumbnail && item.thumbnailUrl && (
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={{
                position: 'absolute',
                width: SCREEN_WIDTH,
                height: VIDEO_HEIGHT,
                zIndex: 1,
                // opacity: showThumbnail ? 0 : 1,
                top: TOP_OFFSET,
              }}
              resizeMode="cover"
              fadeDuration={0} // Instant load for better UX
            />
          )}

          {/* ⏳ Loading Spinner */}
          {isLoading && (
            <View style={{
              position: "absolute",
              top: "45%",
              left: "45%",
              zIndex: 9999,
            }}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

          {shouldLoadVideo && (
            <VideoView
              style={{
                position: 'absolute',
                width: SCREEN_WIDTH,
                // height: SCREEN_HEIGHT,
                zIndex: showThumbnail ? 0 : 2,

                top: TOP_OFFSET,
                height: VIDEO_HEIGHT,
              }}
              player={player}
              contentFit="cover"
              allowsFullscreen={false}
              allowsPictureInPicture={false}
              nativeControls={false}
            />
          )}

          {showIcon && (
            <Animated.View style={[styles.centerIcon, { opacity: fadeAnim, zIndex: 10 }]}>
              <Ionicons
                name={isMuted ? "volume-mute" : "volume-high"}
                size={ACTION_ICON_SIZE}
                color="#fff"
              />
            </Animated.View>
          )}
        </Animated.View>
      </GestureDetector>

      <View style={[styles.bottomContent, { bottom: bottomContentBottom }]}>
        <View style={styles.userInfo}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => router.push(`/profile/${item.user.username}`)}
          >
            <Image
              source={{
                uri: item.user.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: AVATAR_SIZE / 2,
                marginRight: 8,
              }}
            />
            <Text style={styles.username}>{item.user.username}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 8 }}>
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

          {showFullCaption && (
            <View style={{ maxHeight: 200 }}>
              <ScrollView nestedScrollEnabled={true}>
                <Text style={styles.caption}>{item.caption}</Text>
              </ScrollView>
              {item.caption?.length > 100 && (
                <TouchableOpacity onPress={() => setShowFullCaption(false)}>
                  <Text style={{ color: "#ccc", marginTop: 4 }}>Less</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* <View style={styles.musicInfo}>
          <Text style={styles.musicIcon}>♪</Text>
          <Text style={styles.musicText}>
            {item.audio?.name || "Original Sound"}
          </Text>
        </View> */}

        <Pressable
          style={styles.musicInfo}
          onPress={() => setShowAudioSheet(true)}
        // activeOpacity={0.7}
        >
          {/* <Text style={styles.musicIcon}>♪</Text> */}
          <Ionicons name="musical-notes" size={16} color="#fff" />
          <Text style={styles.musicText} numberOfLines={1}>
            {item.audio?.isOriginal === false
              ? item.audio?.name || "Unknown Audio"
              : "Original Sound"}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#fff" style={{ marginLeft: 4 }} />
        </Pressable>

        <Text style={{ color: "#ccc", fontSize: 12, marginTop: 4 }}>
          {getTimeAgo(item.created_at)}
        </Text>
      </View>

      {/* Right Side Actions - Like, Comment, Share, Options */}
      <View style={[styles.rightActions, { bottom: rightActionsBottom }]}>
        {/* Like Button */}
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
          <Text style={styles.actionText}>{formatCount(likesCount)}</Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/comment/${reelId}`)}
        >
          <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
          <Text style={styles.actionText}>{formatCount(item.commentsCount)}</Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            addShare(item.id || item.uuid);
            router.push({
              pathname: `/chat`,
              params: { shareMode: "true", reelId: item.id || item.uuid },
            });
          }}
        >
          <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
          <Text style={styles.actionText}>{formatCount(item.sharesCount || 0)}</Text>
        </TouchableOpacity>

        {/* More Options Button */}
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowOptions(true)}>
          <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Video Progress Bar */}
      <VideoProgressBar
        player={player}
        isActive={currentIndex === index && isFocused}
        paused={paused}
      />

      {/* Bottom Options Drawer */}
      <BottomDrawer
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onSave={() => {
          openBookmarkPanel(item.id || item.uuid);
          setShowOptions(false);
        }}
        onReport={() => setShowReportDrawer(true)}
        reelId={item.id || item.uuid}
        reelUrl={item.videoUrl}
      />

      {/* Report Drawer */}
      <ReportDrawer
        visible={showReportDrawer}
        onClose={() => setShowReportDrawer(false)}
        onSelect={(reason: string) => {
          console.log("Reported for:", reason);
          setShowReportDrawer(false);
        }}
        videoId={item.id || item.uuid}
      />

      <AudioBottomSheet
        visible={showAudioSheet}
        onClose={() => setShowAudioSheet(false)}
        audioData={{
          isOriginal: item.audio?.isOriginal ?? true,
          name: item.audio?.name,
          artist: item.audio?.artist,
          coverImage: item.audio?.coverImage || item.thumbnailUrl,
          duration: item.audio?.duration,
          usedCount: item.audio?.usedCount,
          videos: item.audio?.videos || [],
          audioUrl: item.videoUrl,  // ✅ Add audio URL for preview
        }}
        uploaderInfo={{
          username: item.user.username,
          profilePic: item.user.profilePic,
        }}

        onUseAudio={async () => {
          console.log('🎵 Use Audio clicked:', item);

          try {
            router.push({
              pathname: '/(drawer)/(tabs)/createReels',
              params: {
                // Audio metadata
                audioId: item.audio?.id || `audio_${item.id}`,
                audioUrl: item.videoUrl,
                audioName: item.audio?.isOriginal === false
                  ? item.audio?.name
                  : 'Original Sound',
                audioArtist: item.audio?.isOriginal === false
                  ? item.audio?.artist
                  : item.user.username,
                isOriginal: String(item.audio?.isOriginal ?? true),

                // ✅ NEW: Add these fields
                preSelectedAudio: 'true',  // Flag to indicate audio is pre-selected
                coverImage: item.thumbnailUrl || item.audio?.coverImage,
              }
            });
          } catch (error) {
            console.error('❌ Audio use error:', error);
            alert('Failed to use audio. Please try again.');
          }
        }}

        onVideoPress={(videoId) => {
          console.log('Video clicked:', videoId);
          setShowAudioSheet(false);
          // Navigate to that specific video
          router.push({
            pathname: '/(drawer)/(tabs)/reels',
            params: { videoId, tab: activeTab }
          });
        }}
      />
    </View>
  );
};

const ReelsFeed = () => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const isFocused = useIsFocused();
  const { id, videoId, tab } = useLocalSearchParams();
  const likeMutation = useLikeMutation();
  const queryClient = useQueryClient();
  const {
    addShare,
    currentIndex,
    setCurrentIndex,
    activeTab,
    setActiveTab,
    isMuted,
    toggleMute,
    showIcon,
    setShowIcon,
    fadeAnim,
    updateReelURL,
    autoScroll,
  } = useReelsStore();

  useEffect(() => {
    if (tab && typeof tab === 'string') {
      const tabName = tab.charAt(0).toUpperCase() + tab.slice(1);
      if (['Explore', 'News', 'Followings'].includes(tabName)) {
        setActiveTab(tabName as any);
      }
    }
  }, [tab, setActiveTab]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useReelsByCategory(activeTab.toLowerCase());

  const reels = data?.pages.flatMap((p: any) => p.reels) || [];


  const onRefresh = useCallback(async () => {
    console.log("🔄 Pull to refresh triggered");

    // Reset to top
    setCurrentIndex(0);

    // Clear query cache completely
    const key = ["reels", activeTab.toLowerCase()];
    queryClient.removeQueries({ queryKey: key });

    // Fetch fresh data (with random=true)
    await refetch();

    // Scroll to top
    flatListRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });

    console.log("✅ Refresh complete - new random videos loaded");
  }, [activeTab, setCurrentIndex, queryClient, refetch]);



  // URL update function
  const updateURL = useCallback((index: number) => {
    if (!reels[index]) return;
    const reelId = reels[index].id || reels[index].uuid;
    if (String(id) === String(reelId)) return;
    router.setParams({ id: reelId, videoId: reelId, tab: activeTab });
    updateReelURL(reelId);
  }, [reels, id, activeTab, updateReelURL]);

  // Auto-scroll logic (based on video duration)
  // useEffect(() => {
  //   if (!autoScroll || reels.length === 0) return;

  //   const currentVideoDuration = reels[currentIndex]?.duration;
  //   if (!currentVideoDuration) return;

  //   const timer = setTimeout(() => {
  //     const nextIndex = currentIndex + 1 < reels.length ? currentIndex + 1 : 0;
  //     setCurrentIndex(nextIndex);
  //     flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  //     updateURL(nextIndex);
  //   }, currentVideoDuration * 1000);

  //   return () => clearTimeout(timer);
  // }, [autoScroll, reels.length, currentIndex, setCurrentIndex, updateURL]);

  useEffect(() => {
    if (!autoScroll || reels.length === 0) return;

    const currentReel = reels[currentIndex];
    const duration = currentReel?.duration;

    if (!duration || duration <= 0) return;

    console.log(`⏱️ Auto-scroll in ${duration}s`);

    const timer = setTimeout(() => {
      const nextIndex = currentIndex + 1 < reels.length ? currentIndex + 1 : 0;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      updateURL(nextIndex);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [autoScroll, currentIndex, reels]);

  // Direct video navigation (from deep link or notification)
  useEffect(() => {
    if (videoId && reels.length > 0 && flatListRef.current) {
      const targetIndex = reels.findIndex(
        (reel) => String(reel.id) === String(videoId) || String(reel.uuid) === String(videoId)
      );

      if (targetIndex !== -1) {
        console.log('🎯 Navigating to video at index:', targetIndex);
        setTimeout(() => {
          setCurrentIndex(targetIndex);
          flatListRef.current?.scrollToIndex({ index: targetIndex, animated: false });
          updateReelURL(reels[targetIndex].id || reels[targetIndex].uuid);
        }, 100);
      } else {
        console.log('⚠️ Video not found in feed');
      }
    }
  }, [videoId, reels.length, setCurrentIndex, updateReelURL]);

  // Handle scroll events
  const handleScroll = useCallback((event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / SCREEN_HEIGHT);
    if (index !== currentIndex && reels[index]) {
      setCurrentIndex(index);
    }
  }, [SCREEN_HEIGHT, currentIndex, reels, setCurrentIndex]);

  // Mute/Unmute animation
  const handleToggleMute = useCallback(() => {
    toggleMute();
    setShowIcon(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setShowIcon(false));
      }, 800);
    });
  }, [toggleMute, setShowIcon, fadeAnim]);

  // Get current user info
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });

  const currentUserId = currentUser?.userProfile?.id;

  // Render individual reel item
  const renderItem = useCallback(({ item, index }: any) => {
    if (!item) return null;
    return (
      <ReelItem
        item={item}
        index={index}
        currentIndex={currentIndex}
        isMuted={isMuted}
        handleToggleMute={handleToggleMute}
        showIcon={showIcon}
        fadeAnim={fadeAnim}
        currentUserId={currentUserId}
        likeMutation={likeMutation}
        addShare={addShare}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    );
  }, [currentIndex, isMuted, handleToggleMute, showIcon, fadeAnim, currentUserId, likeMutation, addShare, activeTab, setActiveTab]);

  // Key extractor for FlatList
  const keyExtractor = useCallback((item: any, index: number) => {
    return item?.id ? String(item.id) : `reel-${index}`;
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading Reels...</Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="red" />
        <Text style={styles.errorText}>Failed to load reels</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Top Navigation Bar with Tabs */}
      <View style={styles.topBarBackground} />
      <View style={styles.topBar}>
        <View style={styles.tabsContainer}>
          {['Explore', 'News', 'Followings'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Main FlatList with Performance Optimizations */}
      <FlatList
        ref={flatListRef}
        data={Array.isArray(reels) ? reels.filter(r => r?.id) : []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}

        // Paging & Snapping
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"

        // INSTAGRAM STYLE PULL TO REFRESH
        // refreshing={isRefetching}
        refreshing={isRefetching && currentIndex === 0}
        onRefresh={onRefresh}

        // Scroll Handling
        onScroll={handleScroll}
        scrollEventThrottle={16}

        // 🚀 CRITICAL PERFORMANCE OPTIMIZATIONS
        windowSize={5}                    // Render 5 screens worth
        maxToRenderPerBatch={3}           // Batch render 3 items
        initialNumToRender={2}            // Start with 2 items
        removeClippedSubviews={true}      // Remove off-screen views
        updateCellsBatchingPeriod={100}   // Batch updates every 100ms

        // Item Layout (Required for scrollToIndex)
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}

        // Momentum scroll end - Update URL
        onMomentumScrollEnd={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          const index = Math.round(offsetY / SCREEN_HEIGHT);
          if (index !== currentIndex && reels[index]) {
            setCurrentIndex(index);
            updateURL(index);
          }
        }}

        // Infinite scroll
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}

        // Loading footer
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.footerText}>Loading more...</Text>
            </View>
          ) : null
        }

        // Handle scroll failures
        onScrollToIndexFailed={(info) => {
          console.warn('Scroll failed:', info);
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
            });
          }, 100);
        }}
      />

      {/* Bookmark Panel (Global) */}
      <BookmarkPanel />
    </View>
  );
};

// ============ STYLES ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  topBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,  // StatusBar (40) + Tabs area (60)
    backgroundColor: 'black',
    zIndex: 998,  // Behind tabs but above video
  },
  topBar: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },

  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  tabText: {
    color: '#ccc',
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: '500',
  },

  activeTabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  centerIcon: {
    position: "absolute",
    top: "45%",
    left: "42%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 50,
    padding: 12,
  },

  bottomContent: {
    position: 'absolute',
    left: '4%',
    right: '20%'
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },

  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },

  caption: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },

  musicInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  musicIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#fff'
  },

  musicText: {
    color: '#fff',
    fontSize: 13
  },

  rightActions: {
    position: 'absolute',
    right: '4%',
    alignItems: 'center'
  },

  actionButton: {
    alignItems: 'center',
    marginBottom: 24
  },

  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },

  errorContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  errorText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },

  retryText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  footerLoader: {
    padding: 20,
    backgroundColor: 'black',
    alignItems: 'center',
  },

  footerText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
  },
});

export default ReelsFeed;