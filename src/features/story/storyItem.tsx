import { Story } from "@/src/store/useStoryStore";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const StoryItem = React.memo(
    ({ story, onPress, theme }: { story: Story; onPress: (id: number) => void; theme: any }) => (
        <TouchableOpacity style={styles.storyContainer} onPress={() => onPress(story.id)}>
            <View
                style={[
                    styles.storyBorder,
                    { borderColor:  "#ff8501" },
                ]}
            >
                <Image source={{ uri: story.profilePic }} style={styles.storyImage} />
            </View>
            <Text style={[styles.storyUsername, { color: theme.text }]} numberOfLines={1}>
                {story.username}
            </Text>
        </TouchableOpacity>
    )
);

const styles = StyleSheet.create({
    storyContainer: { alignItems: "center", marginRight: 15, width: 70 },
    storyBorder: { borderWidth: 3, padding: 2, borderRadius: 40, marginBottom: 4 },
    storyImage: { width: 60, height: 60, borderRadius: 30 },
    storyUsername: { fontSize: 12, textAlign: "center" },
});
