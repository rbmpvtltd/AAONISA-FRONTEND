import { useStoryStore } from "@/src/store/useStoryStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Individual Story Item Component - Memoized
const StoryItem = memo(({
  user,
  theme,
  isCurrentUser = false,
  onPress
}: {
  user: any;
  theme: any;
  isCurrentUser?: boolean;
  onPress: () => void;
}) => {
  const seen = !user.stories.some((s: any) => !s.viewed);
  const hasStories = user.stories && user.stories.length > 0;

  return (
    <TouchableOpacity
      style={styles.storyContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isCurrentUser ? (
        <>
          <View style={[
            styles.storyBorder,
            {
              borderColor: hasStories
                ? (seen ? "#999" : "#ff8501")
                : "transparent"
            },
          ]}>
            <Image
              source={{ uri: user.profilePic }}
              style={styles.storyImage}
            />
            {!hasStories && (
              <View style={styles.addButton}>
                <Ionicons name="add" size={16} color="#fff" />
              </View>
            )}
          </View>
        </>
      ) : (
        // Other users' stories
        <View
          style={[
            styles.storyBorder,
            { borderColor: seen ? "#999" : "#ff8501" },
          ]}
        >
          <Image
            source={{ uri: user.profilePic }}
            style={styles.storyImage}
          />
        </View>
      )}

      <Text
        style={[styles.storyUsername, { color: theme.text }]}
        numberOfLines={1}
      >
        {isCurrentUser ? "Your Story" : user.username}
      </Text>
    </TouchableOpacity>
  );
});

StoryItem.displayName = "StoryItem";

export const StoryList = memo(({
  theme,
  currentUserId,
  currentUserProfilePic
}: {
  theme: any;
  currentUserId: string;
  currentUserProfilePic: string;
}) => {
  const { userStories } = useStoryStore();

  // Memoize current user stories using 'self' property
  const currentUserStories = useMemo(
    () => userStories?.find(u => u.self === true),
    [userStories]
  );

  // Memoize has own stories check
  const hasOwnStories = useMemo(
    () => currentUserStories && currentUserStories.stories.length > 0,
    [currentUserStories]
  );

  // Memoize other users' stories (where self is false)
  const otherUsersStories = useMemo(
    () => userStories?.filter(u => u.self === false) || [],
    [userStories]
  );

  // Handler for your story press
  const handleYourStoryPress = useCallback(() => {
    if (hasOwnStories && currentUserStories) {
      const story = currentUserStories.stories.find(s => !s.viewed) || currentUserStories.stories[0];
      router.push(`/story/${story.id}`);
    } else {
      router.push("/(drawer)/(tabs)/createReels");
    }
  }, [hasOwnStories, currentUserStories]);

  // Handler for other users' story press
  const handlePress = useCallback((ownerId: string) => {
    const user = userStories?.find(u => u.owner === ownerId);
    if (!user) return;

    const story = user.stories.find(s => !s.viewed) || user.stories[0];
    router.push(`/story/${story.id}`);
    console.log('====================================');
    console.log(`/story/${story.id}`);
    console.log('====================================');
  }, [userStories]);

  // Create current user object for StoryItem
  const currentUserData = useMemo(() => ({
    profilePic: currentUserStories?.profilePic || currentUserProfilePic,
    username: currentUserStories?.username || "Your Story",
    stories: currentUserStories?.stories || [],
    owner: currentUserStories?.owner || currentUserId,
    self: true,
  }), [currentUserStories, currentUserProfilePic, currentUserId]);

  return (
    <View style={styles.container}>
      {/* Your Story - Always appears first */}
      <StoryItem
        user={currentUserData}
        theme={theme}
        isCurrentUser={true}
        onPress={handleYourStoryPress}
      />

      {/* Other users' stories */}
      {otherUsersStories.map((user) => (
        <StoryItem
          key={user.owner}
          user={user}
          theme={theme}
          onPress={() => handlePress(user.owner)}
        />
      ))}
    </View>
  );
});

StoryList.displayName = "StoryList";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  storyContainer: {
    alignItems: "center",
    marginHorizontal: 10,
    width: 70,
  },
  storyBorder: {
    borderWidth: 3,
    padding: 2,
    borderRadius: 40,
    marginBottom: 4,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyUsername: {
    fontSize: 12,
    textAlign: "center",
  },
  yourStoryWrapper: {
    position: "relative",
    borderWidth: 3,
    borderColor: "transparent",
    padding: 2,
    borderRadius: 40,
    marginBottom: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#0095f6",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
});