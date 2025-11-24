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
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const StoryList = ({ theme }: { theme: any }) => {
  const { userStories } = useStoryStore();

  if (!userStories || userStories.length === 0) return null;

  const handlePress = (userId: string) => {
    const user = userStories.find(u => u.username === userId);
    if (!user) return;

    // find first unviewed story, otherwise open first story
    const story = user.stories.find(s => !s.viewed) || user.stories[0];
    console.log(story);
    router.push(`/story/${story.id}`);
  };

  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
      {userStories.map((user) => {
        const seen = !user.stories.some((s) => !s.viewed); // all viewed?
        
        return (
          <TouchableOpacity
            key={user.username}
            style={styles.storyContainer}
            onPress={() => handlePress(user.username)}
          >
            <View
              style={[
                styles.storyBorder,
                { borderColor: seen ? "#999" : "#ff8501" },
              ]}
            >
              <Image source={{ uri: user.profilePic }} style={styles.storyImage} />
            </View>
            <Text style={[styles.storyUsername, { color: theme.text }]} numberOfLines={1}>
              {user.username}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  storyContainer: { alignItems: "center", marginHorizontal: 10, width: 70 },
  storyBorder: { borderWidth: 3, padding: 2, borderRadius: 40, marginBottom: 4 },
  storyImage: { width: 60, height: 60, borderRadius: 30 },
  storyUsername: { fontSize: 12, textAlign: "center" },
});