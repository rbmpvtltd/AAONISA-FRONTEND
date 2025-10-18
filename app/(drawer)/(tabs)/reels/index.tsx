// // // import { useReelsStore } from '@/src/store/useReelsStore';
// // // import { useIsFocused } from '@react-navigation/native';
// // // import { router, useRouter } from "expo-router";
// // // import { useVideoPlayer, VideoView } from 'expo-video';
// // // import React, { useEffect, useRef } from 'react';
// // // import {
// // //   Animated,
// // //   FlatList,
// // //   Image,
// // //   Pressable,
// // //   StatusBar,
// // //   StyleSheet,
// // //   Text,
// // //   TouchableOpacity,
// // //   useWindowDimensions,
// // //   View,
// // // } from "react-native";
// // // import Ionicons from 'react-native-vector-icons/Ionicons';

// // // const ReelItem = ({
// // //   item,
// // //   index,
// // //   currentIndex,
// // //   isMuted,
// // //   handleToggleMute,
// // //   showIcon,
// // //   fadeAnim,
// // //   toggleLike,
// // //   addComment,
// // //   addShare,
// // //   activeTab,
// // //   setActiveTab,
// // // }: any) => {
// // //   const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  
// // //   // Dynamic sizing
// // //   const bottomContentBottom = SCREEN_HEIGHT * 0.12; 
// // //   const rightActionsBottom = SCREEN_HEIGHT * 0.12;
// // //   const topBarPaddingTop = SCREEN_HEIGHT * 0.05;   
// // //   const AVATAR_SIZE = SCREEN_WIDTH * 0.08;        
// // //   const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;   

// // //   const videoKey = currentIndex === index ? `video-${item.id}-active` : `video-${item.id}`;

// // //   // create player
// // //   const player = useVideoPlayer(
// // //     typeof item.videoUrl === "string" ? { uri: item.videoUrl } : item.videoUrl,
// // //     (playerInstance) => {
// // //       playerInstance.loop = true;
// // //       playerInstance.volume = isMuted ? 0 : 1;
// // //     }
// // //   );

// // //   // autoplay control
// // //   useEffect(() => {
// // //     if (currentIndex === index) {
// // //       player.currentTime = 0;
// // //       player.play();
// // //     } else {
// // //       player.pause();
// // //     }
// // //   }, [currentIndex, index]);

// // //   // mute/unmute
// // //   useEffect(() => {
// // //     player.volume = isMuted ? 0 : 1;
// // //   }, [isMuted]);

// // //   const formatNumber = (num: number): string => {
// // //     if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
// // //     if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
// // //     return num.toString();
// // //   };

// // //   // hold-to-pause logic
// // //   const videoPosition = useRef(0);

// // //   const handlePressIn = () => {
// // //     // videoPosition.current = await player.currentTime || 0; 
// // //     player.pause();
// // //   };

// // //   const handlePressOut = () => {
// // //     // player.currentTime = videoPosition.current; 
// // //     player.play();
// // //   };

// // //   return (
// // //     <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>

// // //       <Pressable
// // //         style={{ flex: 1 }}
// // //         onPress={handleToggleMute}
// // //         onPressIn={handlePressIn}
// // //         onPressOut={handlePressOut}
// // //       >
// // //         <VideoView
// // //           style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
// // //           player={player}
// // //           contentFit="cover"
// // //           allowsFullscreen={false}
// // //           allowsPictureInPicture={false}
// // //           nativeControls={false}
// // //         />

// // //         {/* Audio Icon Overlay */}
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

// // //       {/* Top Bar */}
// // //       <View style={[styles.topBar, { paddingTop: topBarPaddingTop }]}>
// // //         <View style={styles.tabsContainer}>
// // //           {['Followings', 'News', 'Explore'].map((tab) => (
// // //             <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)}>
// // //               <Text
// // //                 style={[
// // //                   styles.tabText,
// // //                   activeTab === tab && styles.activeTabText,
// // //                 ]}
// // //               >
// // //                 {tab}
// // //               </Text>
// // //             </TouchableOpacity>
// // //           ))}
// // //         </View>
// // //       </View>

// // //       {/* Bottom Content */}
// // //       <View style={[styles.bottomContent, { bottom: bottomContentBottom }]}>
// // //         <View style={styles.userInfo}>
// // //           <Image
// // //             source={{ uri: item.user.avatar }}
// // //             style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, marginRight: 8 }}
// // //           />
// // //           <Text style={styles.username}>@{item.user.username}</Text>
// // //         </View>
// // //         <Text style={styles.caption}>{item.caption}</Text>
// // //         <View style={styles.musicInfo}>
// // //           <Text style={styles.musicIcon}>♪</Text>
// // //           <Text style={styles.musicText}>
// // //             Original Sound - {item.user.username}
// // //           </Text>
// // //         </View>
// // //       </View>

// // //       {/* Right Actions */}
// // //       <View style={[styles.rightActions, { bottom: rightActionsBottom }]}>
// // //         <TouchableOpacity style={styles.actionButton}>
// // //           <Image
// // //             source={{ uri: item.user.avatar }}
// // //             style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, borderWidth: 2, borderColor: '#fff' }}
// // //           />
// // //         </TouchableOpacity>

// // //         <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
// // //           <Ionicons
// // //             name={item.isLiked ? 'heart' : 'heart-outline'}
// // //             size={ACTION_ICON_SIZE}
// // //             color={item.isLiked ? 'red' : '#fff'}
// // //           />
// // //           <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
// // //         </TouchableOpacity>

// // //         <TouchableOpacity style={styles.actionButton}  onPress={() => router.push(`/comment/${item.id}`)}>
// // //           <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
// // //           <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
// // //         </TouchableOpacity>

// // //         <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.id)}>
// // //           <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
// // //           <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
// // //         </TouchableOpacity>

// // //         <TouchableOpacity style={styles.actionButton}>
// // //           <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
// // //         </TouchableOpacity>
// // //       </View>
// // //     </View>
// // //   );
// // // };

// // // const ReelsFeed = () => {
// // //   const { height: SCREEN_HEIGHT } = useWindowDimensions();
// // //   const flatListRef = useRef<FlatList>(null);
// // //   const isFocused = useIsFocused();

// // //   const {
// // //     reels,
// // //     toggleLike,
// // //     addComment,
// // //     addShare,
// // //     currentIndex,
// // //     setCurrentIndex,
// // //     activeTab,
// // //     setActiveTab,
// // //     isMuted,
// // //     toggleMute,
// // //     showIcon,
// // //     setShowIcon,
// // //     fadeAnim,
// // //   } = useReelsStore();
// // // const router = useRouter();

// // //   useEffect(() => {
// // //     if (!isFocused) {
// // //       if (!isMuted) toggleMute();
// // //     } else {
// // //       if (isMuted) toggleMute();
// // //     }
// // //   }, [isFocused]);

// // //   const handleToggleMute = () => {
// // //     toggleMute();
// // //     setShowIcon(true);

// // //     Animated.timing(fadeAnim, {
// // //       toValue: 1,
// // //       duration: 200,
// // //       useNativeDriver: true,
// // //     }).start(() => {
// // //       setTimeout(() => {
// // //         Animated.timing(fadeAnim, {
// // //           toValue: 0,
// // //           duration: 500,
// // //           useNativeDriver: true,
// // //         }).start(() => setShowIcon(false));
// // //       }, 1200);
// // //     });
// // //   };

// // //   const handleScroll = (event: any) => {
// // //     const offsetY = event.nativeEvent.contentOffset.y;
// // //     const index = Math.round(offsetY / SCREEN_HEIGHT);
// // //     if (index !== currentIndex) {
// // //       setCurrentIndex(index);
// // //     }
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <StatusBar hidden />
// // //       <FlatList
// // //         ref={flatListRef}
// // //         data={reels}
// // //         renderItem={({ item, index }) => (
// // //           <ReelItem
// // //             item={item}
// // //             index={index}
// // //             currentIndex={currentIndex}
// // //             isMuted={isMuted}
// // //             handleToggleMute={handleToggleMute}
// // //             showIcon={showIcon}
// // //             fadeAnim={fadeAnim}
// // //             toggleLike={toggleLike}
// // //             addComment={addComment}
// // //             addShare={addShare}
// // //             activeTab={activeTab}
// // //             setActiveTab={setActiveTab}
// // //           />
// // //         )}
// // //         keyExtractor={(item) => item.id}
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

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: 'black' },
// // //   centerIcon: {
// // //     position: "absolute",
// // //     top: "45%",
// // //     left: "40%",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     backgroundColor: "rgba(0,0,0,0.3)",
// // //     borderRadius: 50,
// // //     padding: 10,
// // //   },
// // //   topBar: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     paddingHorizontal: 16,
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //   },
// // //   bottomContent: { position: 'absolute', left: '4%', right: '20%' },
// // //   userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
// // //   username: { color: '#fff', fontSize: 16, fontWeight: '600' },
// // //   caption: { color: '#fff', fontSize: 14, marginBottom: 8 },
// // //   musicInfo: { flexDirection: 'row', alignItems: 'center' },
// // //   musicIcon: { fontSize: 16, marginRight: 8, color: '#fff' },
// // //   musicText: { color: '#fff', fontSize: 14 },
// // //   rightActions: { position: 'absolute', right: '4%', alignItems: 'center' },
// // //   actionButton: { alignItems: 'center', marginBottom: 24 },
// // //   actionText: { color: '#fff', fontSize: 12, fontWeight: '600' },
// // //   tabsContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     backgroundColor: 'rgba(0,0,0,0.3)',
// // //     borderRadius: 20,
// // //     paddingVertical: 6,
// // //     paddingHorizontal: 12,
// // //   },
// // //   tabText: {
// // //     color: '#ccc',
// // //     fontSize: 16,
// // //     marginHorizontal: 8,
// // //     fontWeight: '500',
// // //     textShadowColor: 'rgba(0, 0, 0, 0.8)',
// // //     textShadowOffset: { width: 1, height: 1 },
// // //     textShadowRadius: 2,
// // //   },
// // //   activeTabText: {
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //   },
// // // });

// // // export default ReelsFeed;

// // // ==================================================================

// import { useReelsStore } from '@/src/store/useReelsStore';
// import { useIsFocused } from '@react-navigation/native';
// import { router, useLocalSearchParams } from "expo-router";
// import { useVideoPlayer, VideoView } from 'expo-video';
// import React, { useEffect, useRef } from 'react';
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
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const ReelItem = ({
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
//   useEffect(() => {
//     if (currentIndex === index) {
//       player.currentTime = 0;
//       player.play();
//     } else {
//       player.pause();
//     }
//   }, [currentIndex, index]);

//   // mute/unmute
//   useEffect(() => {
//     player.volume = isMuted ? 0 : 1;
//   }, [isMuted]);

//   const formatNumber = (num: number): string => {
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
//       <View style={[styles.topBar, { paddingTop: topBarPaddingTop }]}>
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
//       </View>

//       {/* Bottom Content */}
//       <View style={[styles.bottomContent, { bottom: bottomContentBottom }]}>
//         <View style={styles.userInfo}>
//           <Image
//             source={{ uri: item.user.avatar }}
//             style={{
//               width: AVATAR_SIZE,
//               height: AVATAR_SIZE,
//               borderRadius: AVATAR_SIZE / 2,
//               marginRight: 8,
//             }}
//           />
//           <Text style={styles.username}>@{item.user.username}</Text>
//         </View>
//         <Text style={styles.caption}>{item.caption}</Text>
//         <View style={styles.musicInfo}>
//           <Text style={styles.musicIcon}>♪</Text>
//           <Text style={styles.musicText}>
//             Original Sound - {item.user.username}
//           </Text>
//         </View>
//       </View>

//       {/* Right Actions */}
//       <View style={[styles.rightActions, { bottom: rightActionsBottom }]}>
//         <TouchableOpacity style={styles.actionButton}>
//           <Image
//             source={{ uri: item.user.avatar }}
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

//         <TouchableOpacity style={styles.actionButton}>
//           <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const ReelsFeed = () => {
//   const { height: SCREEN_HEIGHT } = useWindowDimensions();
//   const flatListRef = useRef<FlatList>(null);
//   const isFocused = useIsFocused();
//   const { id } = useLocalSearchParams(); 

//   const {
//     reels,
//     toggleLike,
//     addComment,
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
//   } = useReelsStore();

//   useEffect(() => {
//     if (id && reels.length > 0) {
//       const index = reels.findIndex((r) => r.id == id);
//       if (index !== -1) {
//         setCurrentIndex(index);
//         setTimeout(() => {
//           try {
//             flatListRef.current?.scrollToIndex({ index, animated: false });
//           } catch (error) {
//             console.warn("Scroll error:", error);
//           }
//         }, 100);
//       }
//     }
//   }, [id, reels]);

//   useEffect(() => {
//     if (!isFocused) {
//       if (!isMuted) toggleMute();
//     } else {
//       if (isMuted) toggleMute();
//     }
//   }, [isFocused]);

//   // mute/unmute animation
//   const handleToggleMute = () => {
//     toggleMute();
//     setShowIcon(true);

//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 200,
//       useNativeDriver: true,
//     }).start(() => {
//       setTimeout(() => {
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 500,
//           useNativeDriver: true,
//         }).start(() => setShowIcon(false));
//       }, 1200);
//     });
//   };

//   const handleScroll = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     const index = Math.round(offsetY / SCREEN_HEIGHT);
//     if (index !== currentIndex) setCurrentIndex(index);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />
//       <FlatList
//         ref={flatListRef}
//         data={reels}
//         renderItem={({ item, index }) => (
//           <ReelItem
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
//         keyExtractor={(item) => item.id.toString()}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         snapToInterval={SCREEN_HEIGHT}
//         decelerationRate="fast"
//         getItemLayout={(_, index) => ({
//           length: SCREEN_HEIGHT,
//           offset: SCREEN_HEIGHT * index,
//           index,
//         })}
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
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
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
// });

// export default ReelsFeed;


//=====================================================================


import { useReelsStore } from '@/src/store/useReelsStore';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const ReelItem = ({
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
  activeTab,
  setActiveTab,
}: any) => {
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();

  const bottomContentBottom = SCREEN_HEIGHT * 0.12;
  const rightActionsBottom = SCREEN_HEIGHT * 0.12;
  const topBarPaddingTop = SCREEN_HEIGHT * 0.05;
  const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
  const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;

  const videoKey = currentIndex === index ? `video-${item.id}-active` : `video-${item.id}`;

  // create player
  const player = useVideoPlayer(
    typeof item.videoUrl === "string" ? { uri: item.videoUrl } : item.videoUrl,
    (playerInstance) => {
      playerInstance.loop = true;
      playerInstance.volume = isMuted ? 0 : 1;
    }
  );

  // autoplay control
  useEffect(() => {
    if (currentIndex === index) {
      player.currentTime = 0;
      player.play();
    } else {
      player.pause();
    }
  }, [currentIndex, index]);

  // mute/unmute
  useEffect(() => {
    player.volume = isMuted ? 0 : 1;
  }, [isMuted]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const videoPosition = useRef(0);

  const handlePressIn = () => {
    player.pause();
  };

  const handlePressOut = () => {
    player.play();
  };

  return (
    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
      <Pressable
        style={{ flex: 1 }}
        onPress={handleToggleMute}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <VideoView
          style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          player={player}
          contentFit="cover"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />

        {/* Audio Icon Overlay */}
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

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: topBarPaddingTop }]}>
        <View style={styles.tabsContainer}>
          {['Followings', 'News', 'Explore'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Content */}
      <View style={[styles.bottomContent, { bottom: bottomContentBottom }]}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user.avatar }}
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: AVATAR_SIZE / 2,
              marginRight: 8,
            }}
          />
          <Text style={styles.username}>@{item.user.username}</Text>
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <View style={styles.musicInfo}>
          <Text style={styles.musicIcon}>♪</Text>
          <Text style={styles.musicText}>
            Original Sound - {item.user.username}
          </Text>
        </View>
      </View>

      {/* Right Actions */}
      <View style={[styles.rightActions, { bottom: rightActionsBottom }]}>
        <TouchableOpacity style={styles.actionButton}>
          <Image
            source={{ uri: item.user.avatar }}
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: AVATAR_SIZE / 2,
              borderWidth: 2,
              borderColor: '#fff',
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
          <Ionicons
            name={item.isLiked ? 'heart' : 'heart-outline'}
            size={ACTION_ICON_SIZE}
            color={item.isLiked ? 'red' : '#fff'}
          />
          <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/comment/${item.id}`)}
        >
          <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
          <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.id)}>
          <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
          <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ReelsFeed = () => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const isFocused = useIsFocused();
  const { id } = useLocalSearchParams(); 

  const {
    reels,
    toggleLike,
    addComment,
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
    updateReelURL, //NEW: URL update function
  } = useReelsStore();

  // NEW: URL update function
  const updateURL = (index: number) => {
    if (reels[index]) {
      const reelId = reels[index].id;
      
      // Method 1: Expo Router setParams (Recommended)
      router.setParams({ id: reelId });
      
      // Method 2: Store mein bhi update karo for logging
      updateReelURL(reelId);
      
      console.log('🎬 Reel Changed:', reelId, 'URL Updated');
    }
  };

  useEffect(() => {
    if (id && reels.length > 0) {
      const index = reels.findIndex((r) => r.id == id);
      if (index !== -1) {
        setCurrentIndex(index);
        setTimeout(() => {
          try {
            flatListRef.current?.scrollToIndex({ index, animated: false });
          } catch (error) {
            console.warn("Scroll error:", error);
          }
        }, 100);
      }
    }
  }, [id, reels]);

  useEffect(() => {
    if (!isFocused) {
      if (!isMuted) toggleMute();
    } else {
      if (isMuted) toggleMute();
    }
  }, [isFocused]);

  //  UPDATED: Scroll handler with URL update
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / SCREEN_HEIGHT);
    
    if (index !== currentIndex) {
      setCurrentIndex(index);
      updateURL(index); // URL update karo
    }
  };

  // mute/unmute animation
  const handleToggleMute = () => {
    toggleMute();
    setShowIcon(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowIcon(false));
      }, 1200);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={({ item, index }) => (
          <ReelItem
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
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        // NEW: Extra safety for URL update
        onMomentumScrollEnd={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          const index = Math.round(offsetY / SCREEN_HEIGHT);
          if (index !== currentIndex && reels[index]) {
            updateURL(index);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  centerIcon: {
    position: "absolute",
    top: "45%",
    left: "40%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 50,
    padding: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomContent: { position: 'absolute', left: '4%', right: '20%' },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  username: { color: '#fff', fontSize: 16, fontWeight: '600' },
  caption: { color: '#fff', fontSize: 14, marginBottom: 8 },
  musicInfo: { flexDirection: 'row', alignItems: 'center' },
  musicIcon: { fontSize: 16, marginRight: 8, color: '#fff' },
  musicText: { color: '#fff', fontSize: 14 },
  rightActions: { position: 'absolute', right: '4%', alignItems: 'center' },
  actionButton: { alignItems: 'center', marginBottom: 24 },
  actionText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tabText: {
    color: '#ccc',
    fontSize: 16,
    marginHorizontal: 8,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  activeTabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ReelsFeed;
