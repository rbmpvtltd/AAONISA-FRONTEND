import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useMemo } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const numColumns = 3;
const spacing = 2;
const columnWidth = Math.floor((width - spacing * (numColumns - 1)) / numColumns);

// ✅ Type define kar do
type VideoItem = {
  id: string;
  source: any;
};

// ✅ Videos list
const videos: VideoItem[] = [
  { id: "1", source: require("@/assets/video/videoplayback9.mp4") },
  { id: "2", source: require("@/assets/video/videoplayback10.mp4") },
  { id: "3", source: require("@/assets/video/videoplayback11.mp4") },
  { id: "4", source: require("@/assets/video/videoplayback12.mp4") },
  { id: "5", source: require("@/assets/video/videoplayback13.mp4") },
  { id: "6", source: require("@/assets/video/videoplayback9.mp4") },
  { id: "7", source: require("@/assets/video/videoplayback10.mp4") },
  { id: "8", source: require("@/assets/video/videoplayback11.mp4") },
  { id: "9", source: require("@/assets/video/videoplayback12.mp4") },
  { id: "10", source: require("@/assets/video/videoplayback13.mp4") },
  //  { id: "11", source: require("@/assets/video/videoplayback9.mp4") },
  // { id: "12", source: require("@/assets/video/videoplayback10.mp4") },
  // { id: "13", source: require("@/assets/video/videoplayback11.mp4") },
  // { id: "14", source: require("@/assets/video/videoplayback12.mp4") },
  // { id: "15", source: require("@/assets/video/videoplayback13.mp4") },
  // { id: "16", source: require("@/assets/video/videoplayback9.mp4") },
  // { id: "17", source: require("@/assets/video/videoplayback10.mp4") },
  // { id: "18", source: require("@/assets/video/videoplayback11.mp4") },
  // { id: "19", source: require("@/assets/video/videoplayback12.mp4") },
  // { id: "20", source: require("@/assets/video/videoplayback13.mp4") },
  //   { id: "21", source: require("@/assets/video/videoplayback9.mp4") },
  // { id: "22", source: require("@/assets/video/videoplayback10.mp4") },
  // { id: "23", source: require("@/assets/video/videoplayback11.mp4") },
  // { id: "24", source: require("@/assets/video/videoplayback12.mp4") },
  // { id: "25", source: require("@/assets/video/videoplayback13.mp4") },
  // { id: "26", source: require("@/assets/video/videoplayback9.mp4") },
  // { id: "27", source: require("@/assets/video/videoplayback10.mp4") },
  // { id: "28", source: require("@/assets/video/videoplayback11.mp4") },
  // { id: "29", source: require("@/assets/video/videoplayback12.mp4") },
  // { id: "30", source: require("@/assets/video/videoplayback13.mp4") },
];

const ExploreScreen = () => {
  const router = useRouter();

  // ✅ Columns ka type clearly define karo
  const columns: VideoItem[][] = useMemo(() => {
    const cols: VideoItem[][] = Array.from({ length: numColumns }, () => []);
    videos.forEach((item, i) => {
      cols[i % numColumns].push(item);
    });
    return cols;
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.row}>
        {columns.map((column, colIndex) => (
          <View key={colIndex} style={styles.column}>
            {column.map((item: VideoItem) => (
              <ExploreItem key={item.id} item={item} router={router} />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// ✅ ExploreItem component me type fix
const ExploreItem = ({
  item,
  router,
}: {
  item: VideoItem;
  router: any;
}) => {
  const player = useVideoPlayer(item.source, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  // Insta-style variable height
  const height = Math.floor(Math.random() * (300 - 200 + 1)) + 200;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/(drawer)/(tabs)/reels",
          params: { id: item.id },
        })
      }
      style={{ marginBottom: spacing }}
    >
      <VideoView
        style={{
          width: columnWidth,
          height,
          borderRadius: 6,
          overflow: "hidden",
        }}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#000",
    padding: spacing,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "column",
    gap: spacing,
  },
});

export default ExploreScreen;
