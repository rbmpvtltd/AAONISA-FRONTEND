// import { useAppTheme } from "@/src/constants/themeHelper";
// import { FeedList } from "@/src/features/feed/feedList";
// import { StoryList } from "@/src/features/story/storyList";
// import { useFeedStore } from "@/src/store/useFeedStore";
// import { useStoryStore } from "@/src/store/useStoryStore";
// import { useIsFocused } from "@react-navigation/native";
// import React, { useEffect } from "react";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// const HomePage = () => {
//   const theme = useAppTheme();
//   const isFocused = useIsFocused();
//   const { addStories } = useStoryStore();
//   const { setPhotos, toggleMute } = useFeedStore();

//   useEffect(() => {
//     const arr = Array.from({ length: 20 }).map((_, i) => ({
//       id: i + 1,
//       username: "story_" + (i + 1),
//       profilePic: `https://randomuser.me/api/portraits/men/${(i + 1) * 3 % 100}.jpg`,
//       viewed: false,
//        videoUrl: 
// "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
//     duration: 8000, // ms
//     }));
//     addStories(arr);
//   }, []);

//   useEffect(() => {
//     if (!isFocused) {
//       setPhotos((prev) => prev.map((p) => ({ ...p, isPlaying: false })));
//       toggleMute();
//     }
//   }, [isFocused]);

//   return (
//     <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
//       <StoryList theme={theme} />
//       <FeedList />
//     </GestureHandlerRootView>
//   );
// };

// export default HomePage;

// import { useAppTheme } from "@/src/constants/themeHelper";
// import { FeedList } from "@/src/features/feed/feedList";
// import { StoryList } from "@/src/features/story/storyList";
// import { useBookmarkStore } from "@/src/store/useBookmarkStore";
// import { useFeedStore } from "@/src/store/useFeedStore";
// import { useStoryStore } from "@/src/store/useStoryStore";
// import { useIsFocused } from "@react-navigation/native";
// import { useEffect } from "react";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { getAllBookmarks, getAllStories } from "../../../src/api/tab-api";

// interface StoryUser {
//   username: string;
//   profilePic: string;
//   stories: Story[];
//   owner: string;
// }

// interface Story {
//   id: string;
//   videoUrl: string;
//   duration: number;
//   viewed: boolean;
// }
// const HomePage = () => {
//   const theme = useAppTheme();
//   const isFocused = useIsFocused();
//   const { setUserStories} = useStoryStore();
//   const { setPhotos, toggleMute } = useFeedStore();
//   const { setCategories } = useBookmarkStore();


//   useEffect(() => {
//     async function loadStories() {
//     try {
//       const stories = await getAllStories();
//       setUserStories(stories);
//     } catch (err) {
//       console.log("Stories fetch error", err);
//     }

//     try {
//       const bookmarks = await getAllBookmarks();
//       setCategories((prev) => [...prev, ...bookmarks]);
//     } catch (err) {
//       console.log("Bookmarks fetch error", err);
//     }
//   }

//   loadStories();
//     if (!isFocused) {
//       setPhotos((prev) => prev.map((p) => ({ ...p, isPlaying: false })));
//       toggleMute();
//     }
//   }, [isFocused, setUserStories]);

//   return (
//     <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
//       <StoryList theme={theme} />
//       <FeedList />
//     </GestureHandlerRootView>
//   );
// };

// export default HomePage;
// =============================================

// import { getAllBookmarks, getAllStories } from "@/src/api/tab-api";
// import { useAppTheme } from "@/src/constants/themeHelper";
// import { FeedList } from "@/src/features/feed/feedList";
// import { StoryList } from "@/src/features/story/storyList";
// import { useBookmarkStore } from "@/src/store/useBookmarkStore";
// import { useFeedStore } from "@/src/store/useFeedStore";
// import { useStoryStore } from "@/src/store/useStoryStore";
// import { useIsFocused } from "@react-navigation/native";
// import { useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";
// import { ActivityIndicator, Text } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// const HomePage = () => {
//   const theme = useAppTheme();
//   const isFocused = useIsFocused();
//   const { setUserStories } = useStoryStore();
//   const { setPhotos, toggleMute } = useFeedStore();
//    const { setCategories } = useBookmarkStore();

//   // Stories
//   const {
//     data: stories,isLoading:storiesLoading,isError:storiesError,refetch,} = useQuery({
//     queryKey: ["stories"],
//     queryFn: getAllStories,
//     staleTime: 0,
//     refetchOnMount: true,
//   });

//   // Bookmarks
//   const {
//     data: bookmarks,
//     isLoading: bookmarksLoading,
//     isError: bookmarksError,
//   } = useQuery({
//     queryKey: ["bookmarks"],
//     queryFn: getAllBookmarks,
//     staleTime: 0,
//     refetchOnMount: true,
//   });


//   useEffect(() => {
//     if (stories) {
//       setUserStories(stories);
//     }
//   }, [stories]);


// useEffect(() => {
//     if (bookmarks) {
//       setCategories((prev) => [...prev, ...bookmarks]);
//     }
//   }, [bookmarks]);


//   useEffect(() => {
//     if (!isFocused) {
//       setPhotos((prev) => prev.map((p) => ({ ...p, isPlaying: false })));
//       toggleMute();
//     }
//   }, [isFocused]);

//    if (storiesLoading || bookmarksLoading) {
//     return (
//       <GestureHandlerRootView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <ActivityIndicator size="large" color={theme.text} />
//       </GestureHandlerRootView>
//     );
//   }

//   if (storiesError || bookmarksError) {
//     return (
//       <GestureHandlerRootView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text style={{ color: theme.text }}>Failed to load data</Text>
//       </GestureHandlerRootView>
//     );
//   }
//   return (
//     <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
//       <StoryList theme={theme} />
//       <FeedList />
//     </GestureHandlerRootView>
//   );
// };

// export default HomePage;

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
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

    queryFn: async () => {
      try {
        const data = await getAllStories();
        return data || []; // Return empty array if undefined
      } catch (error) {
        console.error("Stories fetch error:", error);
        return []; // Return empty array on error to prevent undefined
      }
    },
    staleTime: 0,
    refetchOnMount: true,
    retry: 1, // Retry once on failure
  });

  // Bookmarks
  const {
    data: bookmarks,
    isLoading: bookmarksLoading,
    isError: bookmarksError,
    error: bookmarksErrorData,
    refetch: refetchBookmarks,
  } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      try {
        const data = await getAllBookmarks();
        console.log("",data)
        return data || []; // Return empty array if undefined
      } catch (error) {
        console.error("Bookmarks fetch error:", error);
        return []; // Return empty array on error to prevent undefined
      }
    },
    staleTime: 0,
    refetchOnMount: true,
    retry: 1, // Retry once on failure
  });

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
      <StoryList theme={theme} currentUserId = {currentUserId} currentUserProfilePic={currentUserProfilePic} />
      <FeedList />
    </GestureHandlerRootView>
  );
};

export default HomePage;