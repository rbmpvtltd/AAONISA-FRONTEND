import { getAllBookmarks, getAllStories } from "@/src/api/tab-api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { FeedList } from "@/src/features/feed/feedList";
import { StoryList } from "@/src/features/story/storyList";
import { useBookmarkStore } from "@/src/store/useBookmarkStore";
import { useFeedStore } from "@/src/store/useFeedStore";
import { useStoryStore } from "@/src/store/useStoryStore";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";

const HomePage = () => {
  const theme = useAppTheme();
  const isFocused = useIsFocused();
  const { setUserStories } = useStoryStore();
  const { setPhotos, toggleMute } = useFeedStore();
  const { setCategories } = useBookmarkStore();

  const currentUserId = "your_username";
  const currentUserProfilePic = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500";


  // Stories
  const {
    data: stories,
    isLoading: storiesLoading,
    isError: storiesError,
    error: storiesErrorData,
    refetch: refetchStories,
  } = useQuery({
    queryKey: ["stories"],
    queryFn: getAllStories,
    // async () => {
    // try {
    // const data = await getAllStories();
    //       return data || []; // Return empty array if undefined
    //     } catch (error) {
    //       console.error("Stories fetch error:", error);
    //       return []; // Return empty array on error to prevent undefined
    //     }
    //   },
    //   staleTime: 0,
    //   refetchOnMount: true,
    //   retry: 1, // Retry once on failure
  });
console.log('====================================');
console.log("stories",stories);
console.log('====================================');
  // Bookmarks
  const {
    data: bookmarks,
    isLoading: bookmarksLoading,
    isError: bookmarksError,
    error: bookmarksErrorData,
    refetch: refetchBookmarks,
  } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: getAllBookmarks,
    //  async () => {
    //   try {
    //     const data = await getAllBookmarks();
    //     console.log("",data)
    //     return data || []; // Return empty array if undefined
    //   } catch (error) {
    //     console.error("Bookmarks fetch error:", error);
    //     return []; // Return empty array on error to prevent undefined
    //   }
    // },
    // staleTime: 0,
    // refetchOnMount: true,
    // retry: 1, // Retry once on failure
  });

  console.log("stories data resivede", stories);

  useEffect(() => {
    if (stories && stories.length > 0) {
      setUserStories(stories);
    }
  }, [stories, setUserStories]);

  useEffect(() => {
    if (bookmarks && bookmarks.length > 0) {
      setCategories((prev) => [...prev, ...bookmarks]);
    }
  }, [bookmarks, setCategories]);

  useEffect(() => {
    if (!isFocused) {
      setPhotos((prev) => prev.map((p) => ({ ...p, isPlaying: false })));
      toggleMute();
    }
  }, [isFocused, setPhotos, toggleMute]);

  if (storiesLoading || bookmarksLoading) {
    return (
      <GestureHandlerRootView
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}
      >
        <ActivityIndicator size="large" color={theme.text} />
        <Text style={{ color: theme.text, marginTop: 10 }}>Loading...</Text>
      </GestureHandlerRootView>
    );
  }

  if (storiesError || bookmarksError) {
    return (
      <GestureHandlerRootView
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}
      >
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: theme.text, fontSize: 16, marginBottom: 10 }}>
            Failed to load data
          </Text>
          <Text style={{ color: theme.text, fontSize: 12, marginBottom: 20, textAlign: "center" }}>
            {storiesError ? "Stories: Authentication required" : ""}
            {storiesError && bookmarksError ? "\n" : ""}
            {bookmarksError ? "Bookmarks: Authentication required" : ""}
          </Text>
          <Text
            style={{ color: theme.text, fontSize: 14 }}
            onPress={() => {
              refetchStories();
              refetchBookmarks();
            }}
          >
            Tap to Retry
          </Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* <StoryList theme={theme} currentUserId = {currentUserId} currentUserProfilePic={currentUserProfilePic} />
      <FeedList /> */}
      <FlatList
        data={[{ id: "header" }]} // Dummy data
        renderItem={() => <FeedList />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <StoryList
            theme={theme}
            currentUserId={currentUserId}
            currentUserProfilePic={currentUserProfilePic}
          />
        }
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.background }}
      />

    </GestureHandlerRootView>
  );
};
export default HomePage;