// import { useReelsStore } from '@/src/store/useReelsStore';
// import { AVPlaybackStatus, Video } from 'expo-av';
// import React, { useRef, useState } from 'react';


// import {
//   FlatList,
//   Image,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useWindowDimensions,
//   View
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();

// const ReelsFeed = () => {
//   const videoRef = useRef<AVPlaybackStatus | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [activeTab, setActiveTab] = useState<'Followers' | 'News' | 'Explore'>('Followers');
//   const flatListRef = useRef<FlatList>(null);

//   const { reels, toggleLike, addComment, addShare } = useReelsStore();

//   const handleScroll = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     const index = Math.round(offsetY / SCREEN_HEIGHT);
//     if (index !== currentIndex) {
//       setCurrentIndex(index);
//     }
//   };

//   const formatNumber = (num: number): string => {
//     if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
//     if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
//     return num.toString();
//   };

//   const renderReelItem = ({ item }: any) => (
//     <View style={styles.itemContainer}>
//       {/* Thumbnail */}
//       {/* <Image source={{ uri: item.thumbnail }} style={styles.video} /> */}

//       {/* <Video
//   source={{ uri: item.videoUrl }}
//   style={styles.video}
//   resizeMode="cover"
//   repeat
//   paused={currentIndex !== reels.findIndex(r => r.id === item.id)} 
//   muted={false}
// /> */}

// {/* <Video
//   source={typeof item.videoUrl === "string" ? { uri: item.videoUrl } : item.videoUrl}
//   style={styles.video}
//   resizeMode="cover"
//   shouldPlay={currentIndex === reels.findIndex(r => r.id === item.id)} 
//   isLooping
//   isMuted
// /> */}

// <Video
//   source={
//     typeof item.videoUrl === "string"
//       ? { uri: item.videoUrl }
//       : item.videoUrl
//   }
//   style={styles.video}
//   resizeMode="cover"
//   paused={currentIndex !== reels.findIndex(r => r.id === item.id)} // sirf active reel chalegi
//   repeat={true} // loop ke liye
//   muted={false} // audio ke liye
//   onEnd={() => {
//     // Jab user scroll karke wapas aaye to video dubara start ho
//     videoRef.current?.seek(0);
//   }}
//   ref={videoRef}
// />


//       {/* Top Bar */}
// <View style={styles.topBar}>
//   {/* Tabs */}
//   <View style={styles.tabsContainer}>
//     {['Followers', 'News', 'Explore'].map((tab) => (
//       <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)}>
//         <Text
//           style={[
//             styles.tabText,
//             activeTab === tab && styles.activeTabText,
//           ]}
//         >
//           {tab}
//         </Text>
//       </TouchableOpacity>
//     ))}
//   </View>
// </View>


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

//       {/* Right Side Actions */}
//       <View style={styles.rightActions}>
//         {/* Avatar */}
//         <TouchableOpacity style={styles.actionButton}>
//           <Image source={{ uri: item.user.avatar }} style={styles.actionAvatar} />
//         </TouchableOpacity>

//         {/* Like */}
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => toggleLike(item.id)}
//         >
//           <Ionicons
//             name={item.isLiked ? 'heart' : 'heart-outline'}
//             size={32}
//             color={item.isLiked ? 'red' : 'white'}
//           />
//           <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
//         </TouchableOpacity>

//         {/* Comment */}
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => addComment(item.id)}
//         >
//           <Ionicons name="chatbubble-outline" size={32} color="white" />
//           <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
//         </TouchableOpacity>

//         {/* Share */}
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => addShare(item.id)}
//         >
//           <Ionicons name="share-social-outline" size={32} color="white" />
//           <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
//         </TouchableOpacity>

//         {/* More */}
//         <TouchableOpacity style={styles.actionButton}>
//           <Ionicons name="ellipsis-vertical" size={28} color="white" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />
//       <FlatList
//         ref={flatListRef}
//         data={reels}
//         renderItem={renderReelItem}
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
//   container: { flex: 1, backgroundColor: '#000' },
//   itemContainer: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: '#000' },
//   video: { position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingTop: 50,
//   },
//   closeButton: { padding: 8 },
//   closeButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
//   topButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//   },
//   topButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
//   dotsButton: { padding: 8 },
//   dotsText: { color: 'white', fontSize: 18 },
//   bottomContent: { position: 'absolute', bottom: 100, left: 16, right: 80 },
//   userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
//   username: { color: 'white', fontSize: 16, fontWeight: '600' },
//   caption: { color: 'white', fontSize: 14, marginBottom: 8 },
//   musicInfo: { flexDirection: 'row', alignItems: 'center' },
//   musicIcon: { fontSize: 16, marginRight: 8, color: 'white' },
//   musicText: { color: 'white', fontSize: 14 },
//   rightActions: { position: 'absolute', right: 16, bottom: 100, alignItems: 'center' },
//   actionButton: { alignItems: 'center', marginBottom: 24 },
//   actionAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'white' },
//   actionText: { color: 'white', fontSize: 12, fontWeight: '600' },
//   tabsContainer: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'center',
//   flex: 1,
// },
// tabText: {
//   color: 'gray',
//   fontSize: 16,
//   marginHorizontal: 8,
//   fontWeight: '500',
// },
// activeTabText: {
//   color: 'white',
//   fontSize: 16,
//   fontWeight: '700',
//   textDecorationLine: 'underline', 
// },
// });

// export default ReelsFeed;

/// ======================================================================================================

import { useReelsStore } from '@/src/store/useReelsStore';
import { AVPlaybackStatus, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();

const ReelsFeed = () => {
  const videoRef = useRef<AVPlaybackStatus | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'Followers' | 'News' | 'Explore'>('Followers');
  const flatListRef = useRef<FlatList>(null);

  const { reels, toggleLike, addComment, addShare } = useReelsStore();

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / SCREEN_HEIGHT);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const renderReelItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <Video
        source={
          typeof item.videoUrl === "string"
            ? { uri: item.videoUrl }
            : item.videoUrl
        }
        style={styles.video}
        resizeMode="cover"
        shouldPlay={currentIndex === reels.findIndex(r => r.id === item.id)} 
        isLooping
        isMuted={false}
      />

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
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  itemContainer: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' },
  video: { position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
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
