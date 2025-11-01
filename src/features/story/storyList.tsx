// import { useStoryStore } from "@/src/store/useStoryStore";
// import { router } from "expo-router";
// import React, { useCallback } from "react";
// import { FlatList, View } from "react-native";
// import { StoryItem } from "./storyItem";

// export const StoryList = ({ theme }: { theme: any }) => {
//     const { stories, setStories } = useStoryStore();

//     const handleStoryPress = useCallback(
//         (id: number) => {
//             setStories((prev) => prev.map((s) => (s.id === id ? { ...s, viewed: true } : s)));
//             router.push(`/story/${id}`);
//             // Alert.alert("Story", "Open story viewer for story " + id);
//         },
//         [setStories]
//     );

//     const renderStory = ({ item }: any) => (
//         <StoryItem story={item} onPress={handleStoryPress} theme={theme} />
//     );

//     return (
//         <View style={{ paddingVertical: 10 }}>
//             <FlatList
//                 data={stories}
//                 horizontal
//                 renderItem={renderStory}
//                 keyExtractor={(item) => `${item.id}`}
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={{ paddingHorizontal: 10 }}
//             />
//         </View>
//     );
// };

import { useStoryStore } from "@/src/store/useStoryStore";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const StoryList = ({ theme }: { theme: any }) => {
  const { userStory, markStoryViewed } = useStoryStore();

  const handlePress = useCallback(() => {
    if (!userStory) return;
    markStoryViewed(userStory.stories[0].id);
    router.push(`/story/${userStory.stories[0].id}`);
  }, [userStory]);

  if (!userStory) return null;

  return (
    <TouchableOpacity style={styles.storyContainer} onPress={handlePress}>
      <View
        style={[
          styles.storyBorder,
          { borderColor: userStory.stories.some((s) => !s.viewed) ? "#ff8501" : "#999" },
        ]}
      >
        <Image source={{ uri: userStory.profilePic }} style={styles.storyImage} />
      </View>
      <Text style={[styles.storyUsername, { color: theme.text }]} numberOfLines={1}>
        {userStory.username}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  storyContainer: { alignItems: "center", marginHorizontal: 15, width: 70 },
  storyBorder: { borderWidth: 3, padding: 2, borderRadius: 40, marginBottom: 4 },
  storyImage: { width: 60, height: 60, borderRadius: 30 },
  storyUsername: { fontSize: 12, textAlign: "center" },
});
