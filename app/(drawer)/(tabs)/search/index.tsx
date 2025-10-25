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

type VideoItem = {
  id: string;
  source: any;
};

const videos: VideoItem[] = [
  {
    id: "1", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2017.mp4",
    }
  },
  {
    id: "2", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2016.mp4",
    }
  },
  {
    id: "3", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback10.mp4",
    }
  },
  {
    id: "4", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
    }
  },
  {
    id: "5", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback12.mp4",
    }
  },
  {
    id: "6", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback13.mp4",
    }
  },
  {
    id: "7", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback18.mp4",
    }
  },
  {
    id: "8", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback3.mp4",
    }
  },
  {
    id: "9", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback5.mp4",
    }
  },
  {
    id: "10", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback7.mp4",
    }
  },
   {
    id: "11", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2017.mp4",
    }
  },
  {
    id: "12", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2016.mp4",
    }
  },
  {
    id: "13", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback10.mp4",
    }
  },
  {
    id: "14", source: {
      uri:
        "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
    }
  },
];

const ExploreScreen = () => {
  const router = useRouter();

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
