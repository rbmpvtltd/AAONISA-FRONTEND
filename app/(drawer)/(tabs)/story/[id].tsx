import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const stories = [
  { id: 1, video: require("@/assets/video/videoplayback9.mp4") },
  { id: 2, video: require("@/assets/video/videoplayback10.mp4") },
  { id: 3, video: require("@/assets/video/videoplayback11.mp4") },
];

export default function StoryPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(Number(id) - 1 || 0);
  const [paused, setPaused] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const player = useVideoPlayer(stories[currentIndex].video, (p) => {
    p.loop = false;
    p.volume = 1;
  });


  
  // progress animation
  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) handleNext();
    });
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.back(); 
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  // play/pause control
//   useEffect(() => {
//     if (paused) {
//       player.pause();
//       Animated.timing(progress).stop();
//     } else {
//       player.play();
//       startProgress();
//     }
//   }, [paused, currentIndex]);

  // load new story
  useEffect(() => {
    player.replace(stories[currentIndex].video);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      {/* Video View */}
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />

      {/* Progress Bars */}
      <View style={styles.progressContainer}>
        {stories.map((_, i) => (
          <View key={i} style={styles.progressBackground}>
            {i < currentIndex ? (
              <View style={styles.progressFilled} />
            ) : i === currentIndex ? (
              <Animated.View
                style={[
                  styles.progressFilled,
                  {
                    flex: progress,
                  },
                ]}
              />
            ) : null}
          </View>
        ))}
      </View>

      {/* Overlay tap zones */}
      <View style={styles.touchArea}>
        <Pressable
          style={styles.leftZone}
          onPress={handlePrev}
          onLongPress={() => setPaused(true)}
          onPressOut={() => setPaused(false)}
        />
        <Pressable
          style={styles.rightZone}
          onPress={handleNext}
          onLongPress={() => setPaused(true)}
          onPressOut={() => setPaused(false)}
        />
      </View>

      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Icon name="close" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Username placeholder */}
      <View style={styles.userInfo}>
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          user_{stories[currentIndex].id}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width,
    height,
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 30,
  },
  userInfo: {
    position: "absolute",
    top: 45,
    left: 20,
  },
  progressContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    height: 3,
    justifyContent: "space-between",
  },
  progressBackground: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFilled: {
    backgroundColor: "#fff",
    height: "100%",
    flex: 1,
  },
  touchArea: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  leftZone: {
    flex: 1,
  },
  rightZone: {
    flex: 1,
  },
});

