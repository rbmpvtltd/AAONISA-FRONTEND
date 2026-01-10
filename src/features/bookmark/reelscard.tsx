import AudioBottomSheet from "@/app/(drawer)/(tabs)/reels/AudioBottomSheet";
import BottomDrawer from "@/src/components/ui/BottomDrawer";
import ReportDrawer from "@/src/components/ui/ReportDrawer";
import { getTimeAgo } from "@/src/hooks/ReelsUploadTime";
import { useBookmarkStore } from "@/src/store/useBookmarkStore";
import { useReelsStore } from "@/src/store/useReelsStore";
import { formatCount } from "@/src/utils/formatCount";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";

export const useReelFromBookmarks = (reelId?: string) => {
  const qc = useQueryClient();

  if (!reelId) return null;

  const categories = qc.getQueryData<any[]>(["bookmarks"]);

  if (!categories) return null;

  for (const cat of categories) {
    const reel = cat.reels?.find(
      (r: any) => r.uuid === reelId || r.id === reelId
    );
    if (reel) return reel;
  }

  return null;
};

type ReelType = {
  id: string;
  uuid: string;
  caption: string;
  created_at: string;
  videoUrl: string;
  user?: {
    username: string;
    userProfile: string;
  };
  likes: {
    count: number;
  };
  comments: any[];
};


export default function SingleReel({ currentUserId, likeMutation }: any) {
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const { addShare } = useReelsStore();
  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const { openBookmarkPanel } = useBookmarkStore();
  const [showReportDrawer, setShowReportDrawer] = useState(false);
  const reel = useReelFromBookmarks(reelId);
  console.log("hhhhhh", reel?.comments);
  const [showAudioSheet, setShowAudioSheet] = useState(false);
  const profilePicture = reel.user?.userProfile?.ProfilePicture || reel.userProfile?.ProfilePicture;


  //  Reel Not Found UI
  if (!reel) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff", fontSize: 16 }}> Reel Not Found</Text>

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: "#000" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log("========================", reel)
  // --------------------------
  // BELOW = FULL REEL CARD UI
  // --------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [likesCount, setLikesCount] = useState(reel.likes?.count ?? 0);
  const [liked, setLiked] = useState(
    // reel.likes.some((l: any) => l.user_id === currentUserId)
    Array.isArray(reel.likes) ? reel.likes.some((l: any) => l.user_id === currentUserId) : false

  );
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  // Video Player
  const player = useVideoPlayer(
    typeof reel.videoUrl === "string" ? { uri: reel.videoUrl } : reel.videoUrl,
    (p) => {
      p.loop = true;
      p.play()
    }
  );

  useEffect(() => {
    if (!player) return;

    const listener = player.addListener("statusChange", () => {
      if (player.status === "loading") {
        setIsLoading(true);   // loader ON
      }

      if (player.status === "readyToPlay") {
        setIsLoading(false);  // loader OFF
      }

      if (player.status === "readyToPlay" && player.duration != null) {
        // console.log("duration", player.duration);
        setDuration(player.duration);
      }
    });

    return () => listener.remove();
  }, [player]);

  useEffect(() => {
    player.volume = isMuted ? 0 : 1;
  }, [isMuted]);



  // Toggle Mute with Fade Icon
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
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
  };

  // Like System
  // const handleLike = async () => {
  //   const newLiked = !liked;

  //   setLiked(newLiked);
  //   setLikesCount((p: number) => (newLiked ? p + 1 : p - 1));

  //   try {
  //     await likeMutation.mutateAsync(reel.uuid || reel.id);
  //   } catch (err) {
  //     setLiked(!newLiked);
  //     setLikesCount((p: number) => (newLiked ? p - 1 : p + 1));
  //   }
  // };
  const handleLike = async () => {
    const newLiked = !liked;

    // UI update
    setLiked(newLiked);
    setLikesCount((prev: number) => newLiked ? prev + 1 : Math.max(0, prev - 1));

    try {
      await likeMutation.mutateAsync(reel.uuid || reel.id);
    } catch (err) {
      // revert on error
      setLiked(!newLiked);
      setLikesCount((prev: number) => newLiked ? prev - 1 : prev + 1);
    }
  };

  return (
    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: "black" }}>
      {/* VIDEO */}
      <Pressable style={{ flex: 1 }} onPress={toggleMute}>
        <VideoView
          style={{ position: "absolute", width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          player={player}
          contentFit="cover"
          nativeControls={false}

        />
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

        {showIcon && (
          <Animated.View style={[styles.centerIcon, { opacity: fadeAnim }]}>
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-high"}
              size={40}
              color="#fff"
            />
          </Animated.View>
        )}
      </Pressable>

      {/* USER INFO + CAPTION */}
      <View style={[styles.bottomContent]}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => router.push(`/profile/${reel.user?.username}`)}
        >

          <Image source={{ uri: reel.user?.userProfile ? reel.user?.userProfile : "https://cdn-icons-png.flaticon.com/512/847/847969.png" }} style={styles.avatar} />
          <Text style={styles.username}>{reel.user?.username}</Text>
        </TouchableOpacity>
        {/* CAPTION */}
        {!showFullCaption ? (
          <>
            <Text style={styles.caption} numberOfLines={2}>
              {reel?.caption}
              {/* HELLO EVERYONE */}
            </Text>
            {reel.caption?.length > 100 && (
              <TouchableOpacity onPress={() => setShowFullCaption(true)}>
                <Text style={styles.more}>More</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={{ maxHeight: 200 }}>
            <ScrollView nestedScrollEnabled>
              <Text style={styles.caption}>{reel.caption}</Text>
            </ScrollView>

            <TouchableOpacity onPress={() => setShowFullCaption(false)}>
              <Text style={styles.more}>Less</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MUSIC ROW */}
        {/* <View style={styles.musicRow}>
          <Text style={styles.musicIcon}>♪</Text> */}
        {/* <Text style={styles.musicText}>Original Sound - GBSHCHBCHHJHJHJH</Text> */}
        {/* <Text style={styles.musicText}>Original Sound - {reel.user.username}</Text> */}
        {/* </View> */}


        <Pressable
          style={styles.musicRow}
          onPress={() => setShowAudioSheet(true)}
        // activeOpacity={0.7}
        >
          {/* <Text style={styles.musicIcon}>♪</Text> */}
          <Ionicons name="musical-notes" size={16} color="#fff" />
          <Text style={styles.musicText} numberOfLines={1}>
            {reel.audio?.isOriginal === false
              ? reel.audio?.name || "Unknown Audio"
              : "Original Sound"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="#fff"
            style={{ marginLeft: 4 }}
          />
        </Pressable>


        <Text style={{ color: "#ccc", fontSize: 12, marginTop: 4 }}>
          {getTimeAgo(reel?.created_at)}
        </Text>

      </View>

      {/* SIDE ACTION BUTTONS */}
      <View style={styles.rightActions}>
        {/* LIKE */}
        {/* <TouchableOpacity style={styles.actionButton} onPress={handleLike}> */}
        {/* <Ionicons name="heart-outline" size={35} color="white" /> */}
        {/* <Text style={styles.actionText}>{reel.likes?.count || 0}</Text> */}
        <TouchableOpacity
          style={styles.actionButton}
          disabled={likeMutation.isPending}
          onPress={handleLike}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={35}
            color={liked ? '#FF0000' : '#fff'}
          />
          <Text style={styles.actionText}>
            {likesCount}
          </Text>
        </TouchableOpacity>

        {/* </TouchableOpacity> */}

        {/* COMMENTS */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/comment/${reel.uuid || reel.id}`)}
        >
          <Ionicons name="chatbubble-outline" size={35} color="#fff" />
          <Text style={styles.actionText}>{reel.comments?.length || 0}</Text>
        </TouchableOpacity>


        {/* SHARE */}
        <TouchableOpacity style={styles.actionButton} onPress={() => {
          addShare(reel.id || reel.uuid);
          router.push({
            pathname: `/chat`,
            params: { shareMode: "true", reelId: reel.id || reel.uuid },
          });
        }}>
          <Ionicons name="paper-plane-outline" size={35} color="#fff" />
          <Text style={styles.actionText}>{formatCount(reel.sharesCount || 0)}</Text>
        </TouchableOpacity>


        {/* OPTIONS */}
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowOptions(true)}>
          <Ionicons name="ellipsis-vertical" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* OPTIONS DRAWER */}
      <BottomDrawer
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        // onSave={() => { }}
        onSave={() => {
          openBookmarkPanel(reel.id || reel.uuid);
          setShowOptions(false);
        }}
        // onReport={() => console.log("Reported")}
        onReport={() => setShowReportDrawer(true)}
        reelId={reel.uuid || reel.id}
        reelUrl={reel.id || reel.uuid}
      />


      <ReportDrawer
        visible={showReportDrawer}
        onClose={() => setShowReportDrawer(false)}
        onSelect={(reason: string) => {
          console.log("Reported for:", reason);
          setShowReportDrawer(false);
        }}
        videoId={reel.id || reel.uuid}
      />


      <AudioBottomSheet
        visible={showAudioSheet}
        onClose={() => setShowAudioSheet(false)}
        audioData={{
          isOriginal: reel.audio?.isOriginal ?? true,
          name: reel.audio?.name,
          artist: reel.audio?.artist,
          coverImage: reel.audio?.coverImage || reel.thumbnailUrl,
          duration: reel.duration ? `${Math.floor(reel.duration / 60)}:${String(reel.duration % 60).padStart(2, '0')}` : undefined,
          usedCount: reel.audio?.usedCount,
          videos: reel.audio?.videos || [],
          audioUrl: reel.videoUrl,  // ✅ Add audio URL for preview
        }}
        uploaderInfo={{
          username: reel.user?.username,
          profilePic: profilePicture || reel.user?.profilePic,
        }}
        onUseAudio={async () => {
          console.log('🎵 Use Audio clicked from profile:', reel);

          try {
            router.push({
              pathname: '/(drawer)/(tabs)/createReels',
              params: {
                // Audio metadata
                preSelectedAudio: 'true',
                audioId: reel.audio?.id || `audio_${reel.uuid}`,
                audioUrl: reel.videoUrl,
                audioName: reel.audio?.isOriginal === false
                  ? reel.audio?.name
                  : 'Original Sound',
                isOriginal: String(reel.audio?.isOriginal ?? true),

                // Source info
                sourceVideoId: reel.uuid,
                sourceUsername: reel.user?.username,
                duration: String(reel.duration || 0),

                // For display
                // thumbnailUrl: reel.thumbnailUrl,
                coverImage: reel.thumbnailUrl || reel.audio?.coverImage,
              }
            });
          } catch (error) {
            console.error('❌ Audio use error:', error);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Failed to use audio. Please try again.'
            });
          }
        }}
        onVideoPress={(videoId) => {
          console.log('Video clicked:', videoId);
          setShowAudioSheet(false);
          // Navigate to that video
          router.push({
            pathname: `/(drawer)/(tabs)/reels`,
            params: { videoId, tab: 'Explore' }
          });
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  bottomContent: {
    position: "absolute",
    left: 15,
    right: 70,
    bottom: 80
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, marginRight: 10,
  },
  username: { color: "#fff", fontSize: 16, fontWeight: "600" },
  caption: { color: "#fff", fontSize: 14, marginTop: 6 },
  more: { color: "#aaa", marginTop: 4 },
  musicRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  musicIcon: { color: "#fff", marginRight: 6 },
  musicText: { color: "#fff" },
  rightActions: {
    position: "absolute",
    right: 20,
    bottom: 80,
    alignItems: "center",
  },
  actionButton: { alignItems: "center", marginBottom: 25 },
  actionText: { color: "#fff", marginTop: 3, fontSize: 13 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  backBtn: {
    marginTop: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  centerIcon: {
    position: "absolute",
    top: "45%",
    left: "45%",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 15,
    borderRadius: 50,
  },
});