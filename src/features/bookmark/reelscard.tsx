// import { ResizeMode, Video } from "expo-av";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useMemo } from "react";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { useBookmarkStore } from "../../store/useBookmarkStore"; // <-- apne path ke hisab se adjust karo

// const ReelsCard = () => {
//   const router = useRouter();
//   const { reelId } = useLocalSearchParams<{ reelId: string }>();

//   const getReelById = useBookmarkStore((s) => s.getReelById);

//   const reel = useMemo(() => getReelById(reelId!), [reelId]);

//   if (!reel) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "#fff", fontSize: 16 }}> Reel Not Found</Text>

//         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
//           <Text style={{ color: "#000" }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Video
//         source={{ uri: reel.videoUrl }}
//         style={styles.video}
//         resizeMode={ResizeMode.COVER}
//         shouldPlay
//         isMuted={false}
//         useNativeControls
//       />

//       <Text style={styles.caption}>ID: {reel.uuid}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000", justifyContent: "center" },
//   video: { width: "100%", height: "90%" },
//   caption: { color: "#fff", textAlign: "center", marginTop: 5 },
//   center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
//   backBtn: {
//     marginTop: 10,
//     backgroundColor: "#fff",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6
//   }
// });

// export default ReelsCard;

import BottomDrawer from "@/src/components/ui/BottomDrawer";
import { getTimeAgo } from "@/src/hooks/ReelsUploadTime";
import { useBookmarkStore } from "@/src/store/useBookmarkStore";
import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useMemo, useRef, useState } from "react";
import {
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
import Ionicons from "react-native-vector-icons/Ionicons";

type ReelType = {
  id : string;
  caption: string;
  created_at: string;
  videoUrl: string;
  user?: any;
  likes : boolean;
  comments : string;
};


export default function SingleReel({ currentUserId, likeMutation }: any) {
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();

  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const getReelById = useBookmarkStore((s) => s.getReelById);

  console.log("rrrrrrrrrrrrrrr", getReelById(reelId));

  //  Load reel using ID
  // const reel = useMemo(() => getReelById(reelId!), [reelId]);
  const reel = useMemo(() => getReelById(reelId!), [reelId]) as ReelType | null;
console.log("hhhhhh", reel?.comments);


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

  console.log("========================",reel)
  // --------------------------
  // BELOW = FULL REEL CARD UI
  // --------------------------

  const [isMuted, setIsMuted] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // const [likesCount, setLikesCount] = useState(reel.likesCount ?? 0);
  // const [liked, setLiked] = useState(
  //   reel.likes?.some((l: any) => l.user_id === currentUserId)
  // );
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Video Player
  const player = useVideoPlayer(
    typeof reel.videoUrl === "string" ? { uri: reel.videoUrl } : reel.videoUrl,
    (p) => {
      p.loop = true;
      p.play()
    }
  );

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
        {/* <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => router.push(`/profile/${reel.user.username}`)}
        > */}
        {/* <Image source={{ uri: reel.user.profilePic }} style={styles.avatar} /> */}
        {/* <Text style={styles.username}>{reel.user.username}</Text> */}

        <Image source={{ uri: "https://avatar.iran.liara.run/public" }} style={styles.avatar} />
        <Text style={styles.username}>ADNAN CHOUHAN</Text>
        {/* </TouchableOpacity> */}

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
        <View style={styles.musicRow}>
          <Text style={styles.musicIcon}>♪</Text>
          {/* <Text style={styles.musicText}>Original Sound - GBSHCHBCHHJHJHJH</Text> */}
          {/* <Text style={styles.musicText}>Original Sound - {reel.user.username}</Text> */}
        </View>

        <Text style={{ color: "#ccc", fontSize: 12, marginTop: 4 }}>
          {getTimeAgo(reel?.created_at)}
        </Text>

      </View>

      {/* SIDE ACTION BUTTONS */}
      <View style={styles.rightActions}>
        {/* LIKE */}
        {/* <TouchableOpacity style={styles.actionButton} onPress={handleLike}> */}
        <Ionicons
          name={"heart-outline"}
          size={35}
          color={"white"}
        />
        {/* <Text style={styles.actionText}>{reel.likes}</Text> */}
        <Text style={styles.actionText}>16</Text>
        {/* </TouchableOpacity> */}

        {/* COMMENTS */}
        <TouchableOpacity
          style={styles.actionButton}
        onPress={() => router.push(`/comment/${reel.id}`)}
        >
          <Ionicons name="chatbubble-outline" size={35} color="#fff" />
          <Text style={styles.actionText}>16</Text>
          {/* <Text style={styles.actionText}>{reel.commentsCount}</Text> */}

        </TouchableOpacity>

        {/* SHARE */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={35} color="#fff" />
          <Text style={styles.actionText}>16</Text>
          {/* <Text style={styles.actionText}>{reel.shares}</Text> */}
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
        onSave={() => { }}
        onReport={() => console.log("Reported")}
        reelId={reel.id}
        reelUrl={reel.videoUrl}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContent: {
    position: "absolute",
    left: 15,
    right: 70,
    bottom: 140,
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
    bottom: 130,
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