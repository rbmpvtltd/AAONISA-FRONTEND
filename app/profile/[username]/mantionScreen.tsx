import { useAppTheme } from "@/src/constants/themeHelper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { VideoItem } from ".";

const POSTS_PER_ROW = 3;
const POST_SPACING = 2;

type MentionedScreenProps = {
  mentionedVideos?: any[];
  username: string;
};

export const MentionedScreen: React.FC<MentionedScreenProps> = ({
  mentionedVideos = [],
  username,
}) => {
  const theme = useAppTheme();
  const router = useRouter();

  const handlePressVideo = (index: number) => {
    const video = mentionedVideos[index];
    if (!video) return;
    router.push(`/p/${username}/${video.uuid}`);
  };

  // Agar koi mentioned videos nahi hain
  if (!mentionedVideos || mentionedVideos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="person-circle-outline" size={64} color="#777" />

        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          No tagged reels yet
        </Text>

        <Text style={[styles.emptySubtitle, { color: theme.subtitle }]}>
          Reels you're tagged in will appear here.
        </Text>
      </View>
    );
  }

  // Agar mentioned videos hain to grid format mein dikhao
  return (
    <FlatList
      data={mentionedVideos}
      keyExtractor={(item: any) => item.uuid}
      numColumns={POSTS_PER_ROW}
      columnWrapperStyle={styles.row}
      renderItem={({ item, index }) => (
        <VideoItem
          image={item.thumbnailUrl}
          id={item.uuid}
          username={username}
          index={index}
          onPressItem={handlePressVideo}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.gridContainer,
        { backgroundColor: theme.background },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
  row: {
    gap: POST_SPACING,
    paddingHorizontal: POST_SPACING,
    marginBottom: POST_SPACING,
  },
  gridContainer: {
    paddingBottom: 20,
  },
});