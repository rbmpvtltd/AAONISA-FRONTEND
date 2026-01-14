// // import { getAdminVideosFeed } from "@/src/api/admin-feed-api";
// // import { useAppTheme } from "@/src/constants/themeHelper";
// // import { useFeedStore } from "@/src/store/useFeedStore";
// // import { useIsFocused } from "@react-navigation/native";
// // import { useInfiniteQuery } from "@tanstack/react-query";
// // import { router } from "expo-router";
// // import { useCallback, useState } from "react";
// // import { ActivityIndicator, FlatList, Text, View } from "react-native";
// // import { FeedItem } from "./feedItem";

// // export const FeedList = () => {
// //   const theme = useAppTheme();
// //   const isFocused = useIsFocused();
// //   const { isMuted, toggleMute } = useFeedStore();
// //   const [activeIndex, setActiveIndex] = useState(0);

// //   const {
// //   data,
// //   fetchNextPage,
// //   hasNextPage,
// //   isFetchingNextPage,
// //   isLoading,
// //   isError,
// //   refetch,
// // } = useInfiniteQuery({
// //   queryKey: ["admin-videos-feed"],
// //   queryFn: async ({ pageParam = 1 }) => {
// //     const res = await getAdminVideosFeed(pageParam, 20);
// //     return res.data || [];
// //   },
// //   initialPageParam: 1,

// //   getNextPageParam: (lastPage) =>
// //     lastPage.hasNextPage ? lastPage.page + 1 : undefined,

// //   select: (data) =>
// //     data.pages.flatMap((page) =>
// //       page.data.map((video: any) => ({
// //         id: video.id,
// //         title: video.title,
// //         caption: video.caption,
// //         videoUrl: video.videoUrl,
// //         thumbnailUrl: video.thumbnailUrl,
// //         duration: video.duration,
// //         type: video.type,
// //         created_at: video.created_at,
// //         user: video.user,
// //         username: video.user?.username || "Unknown",
// //         profilePic: video.user?.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
// //         likes: video.likesCount || 0,
// //         comments: video.commentsCount || 0,
// //         shares: 0,
// //         views: video.viewsCount || 0,
// //         liked: video.isLiked || false,
// //         saved: false,
// //         hashtags: video.hashtags || [],
// //         audio: video.audio,
// //       })),
// //     ),
// // });

// //   // ✅ Like Handler
// //   const handleLike = useCallback((id: string) => {
// //     // optimistic UI example (optional – best with mutation)
// //     feedVideos.forEach(() => { });
// //   }, []);

// //   const handleSave = useCallback((id: string) => { }, []);
// //   const handleComment = useCallback(
// //     (id: string) => router.push(`../../../comment/${id}`),
// //     []
// //   );
// //   const handleShare = useCallback((id: string) => { }, []);

// //   const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
// //     if (viewableItems.length > 0) {
// //       setActiveIndex(viewableItems[0].index);
// //     }
// //   }, []);

// //   const viewabilityConfig = { itemVisiblePercentThreshold: 70 };

// //   if (isLoading) {
// //     return (
// //       <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
// //         <ActivityIndicator size="large" color={theme.text} />
// //         <Text style={{ color: theme.text, marginTop: 10 }}>Loading videos...</Text>
// //       </View>
// //     );
// //   }

// //   if (isError) {
// //     return (
// //       <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
// //         <Text style={{ color: "red" }}>Failed to load videos</Text>
// //         <Text style={{ color: theme.text }} onPress={() => refetch()}>
// //           Tap to retry
// //         </Text>
// //       </View>
// //     );
// //   }

// //   if (feedVideos.length === 0) {
// //     return (
// //       <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
// //         <Text style={{ color: theme.text }}>No videos available</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <FlatList
// //       data={data}
// //       keyExtractor={(item) => item.id}
// //       renderItem={({ item, index }) => (
// //         <FeedItem
// //           item={item}
// //           isActive={index === activeIndex}
// //           isFocused={isFocused}
// //           onLike={handleLike}
// //           onSave={handleSave}
// //           onComment={handleComment}
// //           onShare={handleShare}
// //           theme={theme}
// //           isMuted={isMuted}
// //           toggleMute={toggleMute}
// //         />
// //       )}
// //       onViewableItemsChanged={onViewableItemsChanged}
// //       viewabilityConfig={viewabilityConfig}

// //       onEndReached={() => {
// //         if (hasNextPage && !isFetchingNextPage) {
// //           fetchNextPage();
// //         }
// //       }}
// //       onEndReachedThreshold={0.6}

// //       ListFooterComponent={
// //         isFetchingNextPage ? (
// //           <ActivityIndicator color={theme.text} />
// //         ) : null
// //       }

// //       removeClippedSubviews
// //       maxToRenderPerBatch={3}
// //       windowSize={5}
// //       initialNumToRender={2}
// //       showsVerticalScrollIndicator={false}
// //     />

// //   );
// // };

// import { getAdminVideosFeed } from "@/src/api/admin-feed-api";
// import { useAppTheme } from "@/src/constants/themeHelper";
// import { useFeedStore } from "@/src/store/useFeedStore";
// import { useIsFocused } from "@react-navigation/native";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { router } from "expo-router";
// import { useCallback, useRef, useState } from "react";
// import { ActivityIndicator, FlatList, Text, View } from "react-native";
// import { FeedItem } from "./feedItem";

// export const FeedList = () => {
//   const theme = useAppTheme();
//   const isFocused = useIsFocused();
//   const { isMuted, toggleMute } = useFeedStore();
//   const [activeIndex, setActiveIndex] = useState(0);

//   const viewConfigRef = useRef({
//     itemVisiblePercentThreshold: 80,
//   });

//   // const [randomSeed] = useState(() => Math.random());
//   const [randomSeed, setRandomSeed] = useState(Date.now());

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//     refetch,
//   } = useInfiniteQuery({
//     queryKey: ["admin-videos-feed", randomSeed],
//     enabled: isFocused,

//     queryFn: async ({ pageParam = 1 }) => {
//       console.log("🔥 FETCH admin feed page:", pageParam);

//       const useRandom = pageParam === 1;
//       const res = await getAdminVideosFeed(pageParam, 10, useRandom);

//       const rawData = Array.isArray(res?.data) ? res.data : [];

//       const parsed = rawData
//         .filter((item: any) => item?.id && item?.videoUrl)
//         .map((item: any) => ({
//           ...item,
//           likes: item.likesCount || 0,
//           comments: item.commentsCount || 0,
//           shares: item.sharesCount || 0,
//           isLiked: item.isLiked || false,
//         }));

//       console.log(`✅ Parsed ${parsed.length} admin reels (random: ${useRandom})`);

//       return {
//         reels: parsed,
//         nextPage: parsed.length < 10 ? null : pageParam + 1,
//       };
//     },

//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => lastPage.nextPage,

//     staleTime: 0,
//     gcTime: 10000,
//   });


//   const feedVideos =
//     data?.pages.flatMap(page => page.reels) ?? [];

//   const onViewableItemsChanged = useCallback(
//     ({ viewableItems }: any) => {
//       if (!viewableItems.length) return;

//       const index = viewableItems[0]?.index;
//       if (index !== activeIndex) {
//         setActiveIndex(index);
//       }
//     },
//     [activeIndex]
//   );


//   const handleComment = useCallback(
//     (id: string) => router.push(`../../../comment/${id}`),
//     []
//   );

//   const handleEndReached = useCallback(() => {
//     console.log(`🎯 End! hasNext: ${hasNextPage}`);
//     if (hasNextPage && !isFetchingNextPage) {
//       console.log("🚀 Loading page", (data?.pages || []).length + 1);
//       fetchNextPage();
//     }
//   }, [hasNextPage, isFetchingNextPage, fetchNextPage, data]);


//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#000" }}>
//         <ActivityIndicator color={theme.text} />
//       </View>
//     );
//   }

//   if (isError) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text onPress={() => refetch()} style={{ color: "red" }}>
//           Retry
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: "#000" }}>
//       <FlatList
//         data={feedVideos}
//         // keyExtractor={(item) => item.id}
//         keyExtractor={(item, index) => item?.id ? String(item.id) : `feed-item-${index}`}
//         renderItem={({ item, index }) => (
//           <FeedItem
//             item={item}
//             isActive={index === activeIndex}
//             isFocused={isFocused}
//             onComment={handleComment}
//             theme={theme}
//             isMuted={isMuted}
//             toggleMute={toggleMute}
//           />
//         )}
//         pagingEnabled
//         windowSize={5}
//         initialNumToRender={1}
//         maxToRenderPerBatch={2}
//         removeClippedSubviews
//         showsVerticalScrollIndicator={false}
//         viewabilityConfig={viewConfigRef.current}
//         onViewableItemsChanged={onViewableItemsChanged}
//         onEndReached={handleEndReached}
//         onEndReachedThreshold={0.8}
//       // onEndReached={() => {
//       //   if (hasNextPage && !isFetchingNextPage) {
//       //     fetchNextPage();
//       //   }
//       // }}
//       // onEndReachedThreshold={0.5}

//       // ListFooterComponent={
//       //   isFetchingNextPage ? (
//       //     <View style={{ padding: 30, alignItems: "center" }}>
//       //       <ActivityIndicator size="large" color="#fff" />
//       //       <Text style={{ color: "#fff", marginTop: 10 }}>
//       //         Loading more...
//       //       </Text>
//       //     </View>
//       //   ) : null
//       // }
//       />

//       {isFetchingNextPage && (
//         <View
//           style={{
//             position: "absolute",
//             bottom: 60,
//             alignSelf: "center",
//             backgroundColor: "rgba(0,0,0,0.6)",
//             padding: 12,
//             borderRadius: 30,
//           }}
//         >
//           <ActivityIndicator color="#fff" />
//         </View>
//       )}
//     </View>

//   );
// };

// // <FlatList
// //   data={feedVideos}
// //   keyExtractor={(item) => item.id}
// //   renderItem={({ item, index }) => (

// //     <FeedItem
// //       item={item}
// //       isActive={index === activeIndex}
// //       isFocused={isFocused}
// //       // onLike={handleLike}
// //       onComment={handleComment}
// //       theme={theme}
// //       isMuted={isMuted}
// //       toggleMute={toggleMute}
// //     />
// //   )}
// //   pagingEnabled
// //   windowSize={5}
// //   initialNumToRender={1}
// //   maxToRenderPerBatch={2}
// //   removeClippedSubviews
// //   showsVerticalScrollIndicator={false}
// //   viewabilityConfig={viewConfigRef.current}
// //   onViewableItemsChanged={onViewableItemsChanged}
// //   onEndReached={() => {
// //     if (hasNextPage && !isFetchingNextPage) {
// //       fetchNextPage();
// //     }
// //   }}
// //   onEndReachedThreshold={0.5}
// //   ListFooterComponent={
// //     isFetchingNextPage ? (
// //       <ActivityIndicator color={theme.text} />
// //     ) : null
// //   }
// // />



import { getAdminVideosFeed } from "@/src/api/admin-feed-api";
import { FeedListSkeleton } from "@/src/components/homeFeedSkeleton";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useFeedStore } from "@/src/store/useFeedStore";
import { useIsFocused } from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { FeedItem } from "./feedItem";

export const FeedList = () => {
  const theme = useAppTheme();
  const isFocused = useIsFocused();
  const { isMuted, toggleMute, setScrollToTop } = useFeedStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 80,
  });

  const [randomSeed, setRandomSeed] = useState(Date.now());

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["admin-videos-feed", randomSeed],
    enabled: isFocused,

    queryFn: async ({ pageParam = 1 }) => {
      console.log("FETCH admin feed page:", pageParam);

      const useRandom = pageParam === 1;
      const res = await getAdminVideosFeed(pageParam, 10, useRandom);

      const rawData = Array.isArray(res?.data) ? res.data : [];

      const parsed = rawData
        .filter((item: any) => item?.id && item?.videoUrl)
        .map((item: any) => ({
          ...item,
          likes: item.likesCount || 0,
          comments: item.commentsCount || 0,
          shares: item.sharesCount || 0,
          isLiked: item.isLiked || false,
        }));

      console.log(` Parsed ${parsed.length} admin reels (random: ${useRandom})`);

      return {
        reels: parsed,
        nextPage: parsed.length < 10 ? null : pageParam + 1,
      };
    },

    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,

    staleTime: 0,
    gcTime: 10000,
  });

  // Feed videos ko pehle declare karo
  const feedVideos = data?.pages.flatMap(page => page.reels) ?? [];

  // Scroll to top function
  const scrollToTopHandler = useCallback(() => {
    if (flatListRef.current && feedVideos.length > 0) {
      try {
        // Paginated FlatList ke liye scrollToIndex
        flatListRef.current.scrollToIndex({
          index: 0,
        });
        setActiveIndex(0);
        console.log("Scrolled to first video");
      } catch (error) {
        console.log("ScrollToIndex failed, trying scrollToOffset");
        // Fallback
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        setActiveIndex(0);
      }
    }
  }, [feedVideos.length]);

  // Register scroll to top handler in store
  useEffect(() => {
    setScrollToTop(scrollToTopHandler);
  }, [scrollToTopHandler, setScrollToTop]);

  // Refresh data when tab becomes focused
  useEffect(() => {
    if (isFocused) {
      console.log("🔄 Home tab focused - Refreshing feed");
      setRandomSeed(Date.now());
      refetch();
    }
  }, [isFocused]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      if (!viewableItems.length) return;

      const index = viewableItems[0]?.index;
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    },
    [activeIndex]
  );

  const handleComment = useCallback(
    (id: string) => router.push(`../../../comment/${id}`),
    []
  );

  const handleEndReached = useCallback(() => {
    console.log(`End! hasNext: ${hasNextPage}`);
    if (hasNextPage && !isFetchingNextPage) {
      console.log("Loading page", (data?.pages || []).length + 1);
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data]);

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#000" }}>
  //       <ActivityIndicator color={theme.text} />
  //     </View>
  //   );
  // }

  if (isLoading || isError) {
    return (
      <FeedListSkeleton theme={theme} count={5} />);
  }

  // if (isError) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text onPress={() => refetch()} style={{ color: "red" }}>
  //         Retry
  //       </Text>
  //     </View>
  //   );
  // }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <FlatList
        ref={flatListRef}
        data={feedVideos}
        keyExtractor={(item, index) => item?.id ? String(item.id) : `feed-item-${index}`}
        renderItem={({ item, index }) => (
          <FeedItem
            item={item}
            isActive={index === activeIndex}
            isFocused={isFocused}
            onComment={handleComment}
            theme={theme}
            isMuted={isMuted}
            toggleMute={toggleMute}
          />
        )}
        pagingEnabled
        windowSize={5}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewableItemsChanged}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.8}

        onScrollToIndexFailed={(info) => {
          console.log("ScrollToIndex failed:", info);
          // Retry after small delay
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true
            });
          }, 100);
        }}
      />

      {isFetchingNextPage && (
        <View
          style={{
            position: "absolute",
            bottom: 60,
            alignSelf: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: 12,
            borderRadius: 30,
          }}
        >
          <ActivityIndicator color="#fff" />
        </View>
      )}
    </View>
  );
};