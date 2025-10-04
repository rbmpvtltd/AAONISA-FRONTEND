import { useReelsStore } from '@/src/store/useReelsStore';
import { useIsFocused } from '@react-navigation/native';
import { Video } from 'expo-av';
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

const ReelsFeed = () => {
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();

  const videoRefs = useRef<(Video | null)[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const isFocused = useIsFocused();

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
  } = useReelsStore();

  // mute when screen is unfocused
  useEffect(() => {
    if (!isFocused) {
      if (!isMuted) toggleMute();
    } else {
      if (isMuted) toggleMute();
    }
  }, [isFocused]);

  // custom toggle mute with animation
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

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / SCREEN_HEIGHT);
    if (index !== currentIndex) {
      if (videoRefs.current[currentIndex]) {
        videoRefs.current[currentIndex]?.stopAsync?.();
        videoRefs.current[currentIndex]?.setPositionAsync?.(0);
      }
      setCurrentIndex(index);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const renderReelItem = ({ item }: any) => (
    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
      <Pressable style={{ flex: 1 }} onPress={handleToggleMute}>
        <Video
          ref={(ref) => (videoRefs.current[reels.findIndex(r => r.id === item.id)] = ref)}
          source={typeof item.videoUrl === "string" ? { uri: item.videoUrl } : item.videoUrl}
          style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          resizeMode="cover"
          shouldPlay={currentIndex === reels.findIndex((r) => r.id === item.id)}
          isLooping
          isMuted={isMuted}
        />

        {/* Audio Icon Overlay */}
        {showIcon && (
          <Animated.View
            style={[
              styles.centerIcon,
              { opacity: fadeAnim },
            ]}
          >
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-high"}
              size={32}
              color="#fff"
            />
          </Animated.View>
        )}
      </Pressable>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.tabsContainer}>
          {['Followers', 'News', 'Explore'].map((tab) => (
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
      <View style={styles.bottomContent}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
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
      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Image source={{ uri: item.user.avatar }} style={styles.actionAvatar} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
          <Ionicons
            name={item.isLiked ? 'heart' : 'heart-outline'}
            size={32}
            color={item.isLiked ? 'red' : '#fff'}
          />
          <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => addComment(item.id)}>
          <Ionicons name="chatbubble-outline" size={32} color="#fff" />
          <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.id)}>
          <Ionicons name="share-social-outline" size={32} color="#fff" />
          <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-vertical" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={renderReelItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={useWindowDimensions().height}
        decelerationRate="fast"
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
    paddingTop: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomContent: { position: 'absolute', bottom: 100, left: 16, right: 80 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  username: { color: '#fff', fontSize: 16, fontWeight: '600' },
  caption: { color: '#fff', fontSize: 14, marginBottom: 8 },
  musicInfo: { flexDirection: 'row', alignItems: 'center' },
  musicIcon: { fontSize: 16, marginRight: 8, color: '#fff' },
  musicText: { color: '#fff', fontSize: 14 },
  rightActions: { position: 'absolute', right: 16, bottom: 100, alignItems: 'center' },
  actionButton: { alignItems: 'center', marginBottom: 24 },
  actionAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#fff' },
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
    textDecorationLine: 'underline',
  },
});

export default ReelsFeed;

// =====================================================================

// import { useReelsStore } from '@/src/store/useReelsStore';
// import { useIsFocused } from '@react-navigation/native';
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

// const ReelItem = ({ item, index, currentIndex, isMuted, handleToggleMute, showIcon, fadeAnim, toggleLike, addComment, addShare, activeTab, setActiveTab }: any) => {
//   const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
//     const videoKey = currentIndex === index ? `video-${item.id}-active` : `video-${item.id}`;


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
//       player.play();
//     } else {
//       player.pause();
//       // player.seek(0);
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

//   return (
//     <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
//       {/* <Pressable style={{ flex: 1 }} onPress={handleToggleMute}>
//         <VideoView
//           style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
//           player={player}
//           contentFit="cover"
//           allowsFullscreen={false}
//           allowsPictureInPicture={false}
//         /> */}

//         {/* Audio Icon Overlay */}
//         {/* {showIcon && (
//           <Animated.View
//             style={[styles.centerIcon, { opacity: fadeAnim }]}
//           >
//             <Ionicons
//               name={isMuted ? "volume-mute" : "volume-high"}
//               size={32}
//               color="#fff"
//             />
//           </Animated.View>
//         )}
//       </Pressable> */}

//        <Pressable style={{ flex: 1 }} onPress={handleToggleMute}>
//         <VideoView
//           key={videoKey} 
//           style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
//          source={typeof item.videoUrl === "string" ? { uri: item.videoUrl } : item.videoUrl} 
//           contentFit="cover"
//           shouldPlay={currentIndex === index}
//           isMuted={isMuted}
//           isLooping
//           allowsFullscreen={false}
//           allowsPictureInPicture={false}
//         />

//         {showIcon && (
//           <Animated.View
//             style={[styles.centerIcon, { opacity: fadeAnim }]}
//           >
//             <Ionicons
//               name={isMuted ? "volume-mute" : "volume-high"}
//               size={32}
//               color="#fff"
//             />
//           </Animated.View>
//         )}
//       </Pressable>

//       {/* Top Bar */}
//       <View style={styles.topBar}>
//         <View style={styles.tabsContainer}>
//           {['Followers', 'News', 'Explore'].map((tab) => (
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
//       <View style={styles.bottomContent}>
//         <View style={styles.userInfo}>
//           <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
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
//       <View style={styles.rightActions}>
//         <TouchableOpacity style={styles.actionButton}>
//           <Image source={{ uri: item.user.avatar }} style={styles.actionAvatar} />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
//           <Ionicons
//             name={item.isLiked ? 'heart' : 'heart-outline'}
//             size={32}
//             color={item.isLiked ? 'red' : '#fff'}
//           />
//           <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton} onPress={() => addComment(item.id)}>
//           <Ionicons name="chatbubble-outline" size={32} color="#fff" />
//           <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.id)}>
//           <Ionicons name="share-social-outline" size={32} color="#fff" />
//           <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton}>
//           <Ionicons name="ellipsis-vertical" size={28} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const ReelsFeed = () => {
//   const { height: SCREEN_HEIGHT } = useWindowDimensions();
//   const flatListRef = useRef<FlatList>(null);
//   const isFocused = useIsFocused();

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

//   // mute when screen is unfocused
//   useEffect(() => {
//     if (!isFocused) {
//       if (!isMuted) toggleMute();
//     } else {
//       if (isMuted) toggleMute();
//     }
//   }, [isFocused]);

//   // custom toggle mute with animation
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
//     if (index !== currentIndex) {
//       setCurrentIndex(index);
//     }
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
//         keyExtractor={(item) => item.id}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         snapToInterval={SCREEN_HEIGHT}
//         decelerationRate="fast"
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
//     paddingTop: 50,
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//   },
//   bottomContent: { position: 'absolute', bottom: 100, left: 16, right: 80 },
//   userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
//   username: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   caption: { color: '#fff', fontSize: 14, marginBottom: 8 },
//   musicInfo: { flexDirection: 'row', alignItems: 'center' },
//   musicIcon: { fontSize: 16, marginRight: 8, color: '#fff' },
//   musicText: { color: '#fff', fontSize: 14 },
//   rightActions: { position: 'absolute', right: 16, bottom: 100, alignItems: 'center' },
//   actionButton: { alignItems: 'center', marginBottom: 24 },
//   actionAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#fff' },
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
//     textDecorationLine: 'underline',
//   },
// });

// export default ReelsFeed;


