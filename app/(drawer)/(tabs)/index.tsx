// import { getAllBookmarks, getAllStories } from "@/src/api/tab-api";
// import { useAppTheme } from "@/src/constants/themeHelper";
// import { FeedList } from "@/src/features/feed/feedList";
// import { StoryList } from "@/src/features/story/storyList";
// import { useBookmarkStore } from "@/src/store/useBookmarkStore";
// import { useFeedStore } from "@/src/store/useFeedStore";
// import { useStoryStore } from "@/src/store/useStoryStore";
// import { useIsFocused } from "@react-navigation/native";
// import { useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, Text, View } from "react-native";
// import { FlatList, GestureHandlerRootView, RefreshControl } from "react-native-gesture-handler";

// const HomePage = () => {
//   const theme = useAppTheme();
//   const isFocused = useIsFocused();
//   const { setUserStories } = useStoryStore();
//   const { setPhotos, toggleMute } = useFeedStore();
//   const { setCategories } = useBookmarkStore();
//   const [refreshing, setRefreshing] = useState(false);


//   // const currentUserId = "your_username";
//   // const currentUserProfilePic = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500";


//   // Stories
//   const {
//     data: stories,
//     isLoading: storiesLoading,
//     isError: storiesError,
//     error: storiesErrorData,
//     refetch: refetchStories,
//   } = useQuery({
//     queryKey: ["stories"],
//     queryFn: //getAllStories,
//       async () => {
//         try {
//           const data = await getAllStories();
//           return data || []; // Return empty array if undefined
//         } catch (error) {
//           console.error("Stories fetch error:", error);
//           return []; // Return empty array on error to prevent undefined
//         }
//       },
//     staleTime: 0,
//     refetchOnMount: true,
//     retry: 1, // Retry once on failure
//   });
//   // Bookmarks
//   const {
//     data: bookmarks,
//     isLoading: bookmarksLoading,
//     isError: bookmarksError,
//     error: bookmarksErrorData,
//     refetch: refetchBookmarks,
//   } = useQuery({
//     queryKey: ["bookmarks"],
//     queryFn:         // getAllBookmarks,
//       async () => {
//         try {
//           const data = await getAllBookmarks();
//           console.log("a rhe h bookmarks", data)
//           return data || [];
//         } catch (error) {
//           console.error("Bookmarks fetch error:", error);
//           return [];
//         }
//       },
//     staleTime: 0,
//     refetchOnMount: true,
//     retry: 1, // Retry once on failure
//   });
//   useEffect(() => {
//     if (stories && stories.length > 0) {
//       setUserStories(stories);
//     }
//   }, [stories, setUserStories]);

//   // useEffect(() => {
//   //   if (bookmarks && bookmarks.length > 0) {
//   //     setCategories((prev) => [...prev, ...bookmarks]);
//   //   }
//   // }, [bookmarks, setCategories]);

//   // useEffect(() => {
//   //   if (bookmarks) {
//   //     setCategories(() => bookmarks);
//   //   }
//   // }, [bookmarks, setCategories]);


//   useEffect(() => {
//     if (!isFocused) {
//       setPhotos((prev) => prev.map((p) => ({ ...p, isPlaying: false })));
//       toggleMute();
//     }
//   }, [isFocused, setPhotos, toggleMute]);

//   if (storiesLoading || bookmarksLoading) {
//     return (
//       <GestureHandlerRootView
//         style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}
//       >
//         <ActivityIndicator size="large" color={theme.text} />
//         <Text style={{ color: theme.text, marginTop: 10 }}>Loading...</Text>
//       </GestureHandlerRootView>
//     );
//   }

//   if (storiesError || bookmarksError) {
//     return (
//       <GestureHandlerRootView
//         style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}
//       >
//         <View style={{ padding: 20, alignItems: "center" }}>
//           <Text style={{ color: theme.text, fontSize: 16, marginBottom: 10 }}>
//             Failed to load data
//           </Text>
//           <Text style={{ color: theme.text, fontSize: 12, marginBottom: 20, textAlign: "center" }}>
//             {storiesError ? "Stories: Authentication required" : ""}
//             {storiesError && bookmarksError ? "\n" : ""}
//             {bookmarksError ? "Bookmarks: Authentication required" : ""}
//           </Text>
//           <Text
//             style={{ color: theme.text, fontSize: 14 }}
//             onPress={() => {
//               refetchStories();
//               refetchBookmarks();
//             }}
//           >
//             Tap to Retry
//           </Text>
//         </View>
//       </GestureHandlerRootView>
//     );
//   }

//   if (storiesLoading || bookmarksLoading) {
//     return (
//       <GestureHandlerRootView
//         style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}
//       >
//         <ActivityIndicator size="large" color={theme.text} />
//         <Text style={{ color: theme.text, marginTop: 10 }}>Loading...</Text>
//       </GestureHandlerRootView>
//     );
//   }
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     try {
//       await Promise.all([refetchStories(), refetchBookmarks()]);
//       // Agar feed bhi refetch karni hai to uske store function bhi call kar sakte ho
//     } catch (err) {
//       console.error("Refresh error:", err);
//     } finally {
//       setRefreshing(false);
//     }
//   };


//   return (
//     <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
//       {/* <StoryList theme={theme} currentUserId = {currentUserId} currentUserProfilePic={currentUserProfilePic} />
//         <FeedList /> */}
//       <FlatList
//         data={[{ id: "header" }]} // Dummy data
//         renderItem={() => <FeedList />}
//         keyExtractor={(item) => item.id}
//         ListHeaderComponent={
//           <StoryList
//             theme={theme}
//           // currentUserId={currentUserId}
//           // currentUserProfilePic={currentUserProfilePic}
//           />
//         }
//         showsVerticalScrollIndicator={false}
//         style={{ backgroundColor: theme.background }}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             tintColor={theme.text}
//             colors={[theme.text]}
//             progressBackgroundColor={theme.background}
//           />
//         }
//       />

//     </GestureHandlerRootView>
//   );
// };
// export default HomePage;


import { getAllBookmarks } from "@/src/api/tab-api";
import { FeedListSkeleton } from "@/src/components/homeFeedSkeleton";
import { StoryListSkeleton } from "@/src/components/storySkeleton";
import { useAppTheme } from "@/src/constants/themeHelper";
import { FeedList } from "@/src/features/feed/feedList";
import { StoryList } from "@/src/features/story/storyList";
import { useStoriesQuery } from "@/src/hooks/storyMutation";
import { useBookmarkStore } from "@/src/store/useBookmarkStore";
import { useFeedStore } from "@/src/store/useFeedStore";
import { useIsFocused } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { FlatList, GestureHandlerRootView, RefreshControl } from "react-native-gesture-handler";

const HomePage = () => {
  const theme = useAppTheme();
  const isFocused = useIsFocused();
  const { setPhotos, toggleMute } = useFeedStore();
  const { setCategories } = useBookmarkStore();
  const [refreshing, setRefreshing] = useState(false);


  // useFocusEffect(
  //   useCallback(() => {
  //     // 🔁 Jab bhi Home tab focus ho
  //     refetchStories();
  //     refetchBookmarks();

  //     return () => {
  //       // optional cleanup
  //     };
  //   }, [])
  // );

  const queryClient = useQueryClient();
  // Stories
  const {
    data: stories = [],
    isLoading: storiesLoading,
    isError: storiesError,
    refetch: refetchStories,
  } = useStoriesQuery();

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
        // console.log("a rhe h bookmarks", data);
        return data || [];
      } catch (error) {
        console.error("Bookmarks fetch error:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 10,
    refetchOnMount: true,
    retry: 1,
  });

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
      <GestureHandlerRootView>
        <StoryListSkeleton />
        <FeedListSkeleton theme={theme} count={5} />
      </GestureHandlerRootView>
    );
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Clear admin feed cache to force new random data
      queryClient.removeQueries({ queryKey: ["admin-videos-feed"] });

      // Refetch stories and bookmarks
      await Promise.all([
        refetchStories(),
        refetchBookmarks(),
      ]);

      // console.log("✅ Refresh complete - new random feed will load");
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };


  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        data={[{ id: "header" }]}
        renderItem={() => <FeedList />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<StoryList theme={theme}/>}

        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.background }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.text}
            colors={[theme.text]}
            progressBackgroundColor={theme.background}
          />
        }
      />
    </GestureHandlerRootView>


    // <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
    //   {/* STORIES */}
    //   <StoryList theme={theme} stories={stories} />

    //   {/* FEED (ONLY vertical scroll) */}
    //   <FeedList
    //   />
    // </GestureHandlerRootView>
  );
};

export default HomePage;                                                 