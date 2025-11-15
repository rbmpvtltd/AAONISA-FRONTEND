import { GetCurrentUser } from '@/src/api/profile-api';
import BottomDrawer from '@/src/components/ui/BottomDrawer';
import BookmarkPanel from '@/src/features/bookmark/bookmarkPanel';
import { useLikeMutation } from '@/src/hooks/userLikeMutation';
import { useBookmarkStore } from '@/src/store/useBookmarkStore';
import { useReelsStore } from '@/src/store/useReelsStore';
import { useIsFocused } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
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
import React = require('react');

const ReelItem = ({
  item,
  index,
  currentIndex,
  isMuted,
  handleToggleMute,
  showIcon,
  fadeAnim,
  toggleLike,
  likeMutation,
  currentUserId,
  addComment,
  addShare,
  activeTab,
  setActiveTab,
}: any) => {
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const [showOptions, setShowOptions] = React.useState(false);
  const bottomContentBottom = SCREEN_HEIGHT * 0.12;
  const rightActionsBottom = SCREEN_HEIGHT * 0.12;
  const topBarPaddingTop = SCREEN_HEIGHT * 0.05;
  const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
  const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;
  const {
    openBookmarkPanel,
  } = useBookmarkStore();
  const videoKey = currentIndex === index ? `video-${item.id}-active` : `video-${item.id}`;
  const [likesCount, setLikesCount] = useState(item.likesCount ?? 0);
  const [showFullCaption, setShowFullCaption] = useState(false);


  const [liked, setLiked] = useState(
    Array.isArray(item.likes)
      ? item.likes.some((like: any) => like.user_id === currentUserId)
      : false
  );
  console.log("REEL id:", item.id || item.uuid);

  // create player
  const player = useVideoPlayer(
    typeof item.videoUrl === "string" ? { uri: item.videoUrl } : item.videoUrl,
    (p) => {
      p.loop = true;
    }
  );

  useEffect(() => {
    player.volume = isMuted ? 0 : 1;
  }, [isMuted]);


  // autoplay control
  useEffect(() => {
    if (!player) return;

    requestAnimationFrame(() => {
      if (currentIndex === index) {
        player.play();
      } else {
        player.pause();
      }
    });
  }, [currentIndex, index]);

  // mute/unmute

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

  // const handlePressIn = () => {
  //   requestAnimationFrame(() => player.pause());
  // };

  // const handlePressOut = () => {
  //   requestAnimationFrame(() => player.play());
  // };


  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);

    const prevCount = likesCount;

    // optimistic update
    setLikesCount(newLiked ? prevCount + 1 : Math.max(0, prevCount - 1));

    try {
      await likeMutation.mutateAsync(item.uuid || item.id);
    } catch (error) {
      // revert
      setLiked(!newLiked);
      setLikesCount(prevCount);
    }
  };

  console.log("item.likes", item.likesCount);
  console.log("comment count", item.commentsCount);

  const reelId = item.uuid || item.id;

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
          {['Explore', 'News', 'Followings'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
            >
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
            source={{ uri: item.user.profilePic }}
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: AVATAR_SIZE / 2,
              marginRight: 8,
            }}
          />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
        {/* <Text style={styles.caption}>{item.caption}</Text> */}

        <View style={{ marginBottom: 8 }}>
          {/* Caption Text */}
          <Text
            style={styles.caption}
            numberOfLines={showFullCaption ? undefined : 2}
          >
            {item.caption}
          </Text>

          {/* More Button */}
          {!showFullCaption && item.caption?.length > 100 && (
            <TouchableOpacity onPress={() => setShowFullCaption(true)}>
              <Text style={{ color: "#ccc", marginTop: 4 }}>More</Text>
            </TouchableOpacity>
          )}

          {/* Less Button */}
          {showFullCaption && item.caption?.length > 100 && (
            <TouchableOpacity onPress={() => setShowFullCaption(false)}>
              <Text style={{ color: "#ccc", marginTop: 4 }}>Less</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.musicInfo}>
          <Text style={styles.musicIcon}>♪</Text>
          <Text style={styles.musicText}>
            Original Sound - {item.user.username}
          </Text>
        </View>
      </View>

      {/* Right Actions */}
      <View style={[styles.rightActions, { bottom: rightActionsBottom }]}>

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
            {/* {Array.isArray(item.likes) ? item.likesCount : 0} */}
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/comment/${reelId}`)}
        >
          <Ionicons name="chatbubble-outline" size={ACTION_ICON_SIZE} color="#fff" />
          <Text style={styles.actionText}>
            {item.commentsCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => addShare(item.id)}>
          <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color="#fff" />
          <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
        </TouchableOpacity>
        {/* 
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.actionButton} onPress={() => setShowOptions(true)}>
          <Ionicons name="ellipsis-vertical" size={ACTION_ICON_SIZE * 0.8} color="#fff" />
        </TouchableOpacity>
      </View>

      <BottomDrawer
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onSave={() => {
          openBookmarkPanel(item.id);
          setShowOptions(false);
        }}
        onReport={() => console.log("Reported:", item.id)}
        reelId={item.id}
        reelUrl={item.videoUrl} // add this too for share/download
      />

    </View>
  );
};

const ReelsFeed = () => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const isFocused = useIsFocused();
  const { id } = useLocalSearchParams();
  const likeMutation = useLikeMutation();

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
    autoScroll,
    fetchReelsByCategory,
  } = useReelsStore();

  useEffect(() => {
    // jab activeTab Followings hai aur data empty aaya
    if (activeTab === 'Followings' && reels.length === 0) {
      console.log("No followings found, switching to Explore...");
      setActiveTab('Explore');
    }
  }, [reels, activeTab]);


  useEffect(() => {
    fetchReelsByCategory(activeTab.toLowerCase() as any);
  }, [activeTab]);


  // auto scroll 
  useEffect(() => {
    let interval: any;

    if (autoScroll && reels.length > 0) {
      interval = setInterval(() => {
        const nextIndex =
          currentIndex + 1 < reels.length ? currentIndex + 1 : 0;

        setCurrentIndex(nextIndex);

        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        updateURL(nextIndex);
      }, 10000);
    }

    return () => clearInterval(interval);
  }, [autoScroll, reels, currentIndex]);



  // NEW: URL update function
  const updateURL = (index: number) => {
    if (reels[index]) {
      const reelId = reels[index].id || reels[index].uuid;

      router.setParams({ id: reelId });
      updateReelURL(reelId);
      // console.log("reelId updated",router.setParams({ id: reelId }));
    }
  };

  useEffect(() => {
    if (id && reels.length > 0) {
      const index = reels.findIndex((r) => r.id == id);
      if (index !== -1) {
        setCurrentIndex(index);
        setTimeout(() => {
          try {
            // flatListRef.current?.scrollToIndex({ index, animated: false });
            if (index >= 0 && index < reels.length) {
   flatListRef.current?.scrollToIndex({ index, animated: false });
}

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
  // const currentUserId = useProfileStore(state => state.userId);

  const { data: currentUser, isLoading: currentUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });

  const currentUserId = currentUser?.userProfile?.id

  console.log("reeeeeeeeeeeeeeeeeeeeeelss", reels);


  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        ref={flatListRef}
        // data={reels || []}
        data={Array.isArray(reels) ? reels.filter(r => r?.id) : []}
        keyExtractor={(item, index) => (item?.id ? String(item.id) : `key-${index}`)}
        renderItem={({ item, index }) => {
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
              // toggleLike={toggleLike}
              toggleLike={(id: string) => likeMutation.mutate(id)}
              likeMutation={likeMutation}
              addComment={addComment}
              addShare={addShare}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )
        }}
        // keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
      <BookmarkPanel
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  overlayBackground: {
    flex: 1,
  },
  bottomDrawer: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.4,
    borderBottomColor: '#333',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },

});

export default ReelsFeed;
