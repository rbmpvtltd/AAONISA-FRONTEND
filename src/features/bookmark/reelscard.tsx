import { ResizeMode, Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useBookmarkStore } from "../../store/useBookmarkStore"; // <-- apne path ke hisab se adjust karo

const ReelsCard = () => {
  const router = useRouter();
  const { reelId } = useLocalSearchParams<{ reelId: string }>();

  const getReelById = useBookmarkStore((s) => s.getReelById);

  const reel = useMemo(() => getReelById(reelId!), [reelId]);

  if (!reel) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff", fontSize: 16 }}>❌ Reel Not Found</Text>

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: "#000" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: reel.videoUrl }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isMuted={false}
        useNativeControls
      />

      <Text style={styles.caption}>ID: {reel.uuid}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center" },
  video: { width: "100%", height: "90%" },
  caption: { color: "#fff", textAlign: "center", marginTop: 5 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  backBtn: {
    marginTop: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  }
});

export default ReelsCard;
