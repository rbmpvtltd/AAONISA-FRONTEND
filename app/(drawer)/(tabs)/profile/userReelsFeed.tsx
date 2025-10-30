import BottomDrawer from '@/src/components/ui/BottomDrawer';
import { useReelsStore } from '@/src/store/useReelsStore';
import { useProfileStore } from '@/src/store/userProfileStore';
import { useIsFocused } from '@react-navigation/native';
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
  activeTab,
  setActiveTab,
}: any) => {
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();

  const bottomContentBottom = SCREEN_HEIGHT * 0.12;
  const rightActionsBottom = SCREEN_HEIGHT * 0.12;
  const topBarPaddingTop = SCREEN_HEIGHT * 0.05;
  const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
  const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;
  const { username, profilePicture } = useProfileStore();
  const [showOptions, setShowOptions] = React.useState(false);


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
  // useEffect(() => {
  //   if (currentIndex === index) {
  //     player.currentTime = 0;
  //     player.play();
  //   } else {
  //     player.pause();
  //   }
  // }, [currentIndex, index]);

  //   useEffect(() => {
  //   if (currentIndex === index) {
  //     player.currentTime = 0;
  //     player.play();
  //     player.volume = isMuted ? 0 : 1;
  //   } else {
  //     player.pause();
  //     player.volume = 0; // ensure muted when off-screen
  //   }
  // }, [currentIndex, index, isMuted]);


  useEffect(() => {
    if (currentIndex === index) {
      player.currentTime = 0;
      player.play();
      player.volume = isMuted ? 0 : 1;
    } else {
      player.pause();
      player.volume = 0;
    }
    // Cleanup: jab component unmount ho ya index change ho
    return () => {
      player.pause();
      player.volume = 0;
    };
  }, [currentIndex, index, isMuted]);


  // mute/unmute
  useEffect(() => {
    player.volume = isMuted ? 0 : 1;
  }, [isMuted]);

  const formatNumber = (num: number): string => {
    if (typeof num !== 'number' || isNaN(num)) return '0';
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
      {/* <View style={[styles.topBar, { paddingTop: topBarPaddingTop }]}>
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
      </View> */}

      {/* Bottom Content */}
      <View style={[styles.bottomContent, { bottom: bottomContentBottom }]}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.profilePicture }}
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: AVATAR_SIZE / 2,
              marginRight: 8,
              borderWidth: 2,
              borderColor: '#fff',
            }}
          />
          <Text style={styles.username}>{username}</Text>
        </View>
        <Text style={styles.username}>{item.title}</Text>
        <Text style={styles.caption}>{item.caption}</Text>
        <View style={styles.musicInfo}>
          <Text style={styles.musicIcon}>♪</Text>
          <Text style={styles.musicText}>
            Original Sound - hello
          </Text>
        </View>
      </View>

      {/* Right Actions */}
      <View style={[styles.rightActions, { bottom: rightActionsBottom }]}>
        <TouchableOpacity style={styles.actionButton}>
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

        {/* <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.actionButton} onPress={() => setShowOptions(true)}>
          <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
        </TouchableOpacity>
      </View>


      <BottomDrawer
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onSave={() => { router.push("/(drawer)/(tabs)/reels/bookmark"); setShowOptions(false) }}
        onReport={() => console.log("Reported")}
        onShare={() => console.log("Shared")}
      />
    </View>
  );
};

const UserReelsFeed = () => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const isFocused = useIsFocused();
  const { id } = useLocalSearchParams();
  // const { videos } = useProfileStore(); 
  const [isMuted, setIsMuted] = useState(false);
  const { videos, toggleLike, addComment, addShare } = useProfileStore();


  const {
    // reels,
    // toggleLike,
    // addComment,
    // addShare,
    // currentIndex,
    // setCurrentIndex,
    activeTab,
    setActiveTab,
    // isMuted,
    toggleMute,
    showIcon,
    setShowIcon,
    fadeAnim,
    updateReelURL, //NEW: URL update function
  } = useReelsStore();

  const [currentIndex, setCurrentIndex] = useState(0);

  // const {toggleLike, addComment, addShare } = useProfileStore();


  // NEW: URL update function
  const updateURL = (index: number) => {
    if (videos[index]) {
      const reelId = videos[index].id;
      // Method 1: Expo Router setParams (Recommended)
      router.setParams({ id: reelId });
      // Method 2: Store mein bhi update karo for logging
      updateReelURL(reelId);
    }
  };

  useEffect(() => {
    if (videos.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: currentIndex, animated: false });
      }, 100);
    }
  }, [videos]);

  useEffect(() => {
    if (id && videos.length > 0) {
      const index = videos.findIndex((r) => r.id == id);
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
  }, [id, videos]);

  // useEffect(() => {
  //   if (!isFocused) {
  //     if (!isMuted) toggleMute();
  //   } else {
  //     if (isMuted) toggleMute();
  //   }
  // }, [isFocused]);

  useEffect(() => {
    if (!isFocused) {
      setIsMuted(true); // mute all
    } else {
      setIsMuted(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [isFocused]);


  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / SCREEN_HEIGHT);
    setCurrentIndex(index);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
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
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
        // keyExtractor={(item) => item.id.toString()}
        keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
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
          if (index !== currentIndex && videos[index]) {
            setCurrentIndex(index);
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
  // topBar: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   paddingHorizontal: 16,
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  // },
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

export default UserReelsFeed;