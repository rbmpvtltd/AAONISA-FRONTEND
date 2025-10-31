import { useStoryStore } from "@/src/store/useStoryStore";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, View } from "react-native";
import { StoryItem } from "./storyItem";

export const StoryList = ({ theme }: { theme: any }) => {
    const { stories, setStories } = useStoryStore();

    const handleStoryPress = useCallback(
        (id: number) => {
            setStories((prev) => prev.map((s) => (s.id === id ? { ...s, viewed: true } : s)));
            router.push(`/story`);
            // Alert.alert("Story", "Open story viewer for story " + id);
        },
        [setStories]
    );

    const renderStory = ({ item }: any) => (
        <StoryItem story={item} onPress={handleStoryPress} theme={theme} />
    );

    return (
        <View style={{ paddingVertical: 10 }}>
            <FlatList
                data={stories}
                horizontal
                renderItem={renderStory}
                keyExtractor={(item) => `${item.id}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />
        </View>
    );
};
