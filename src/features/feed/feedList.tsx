// import { getAdminVideosFeed } from "@/src/api/admin-feed-api";
// import { useAppTheme } from "@/src/constants/themeHelper";
// import { useFeedStore } from "@/src/store/useFeedStore";
// import { useIsFocused } from "@react-navigation/native";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { router } from "expo-router";
// import { useCallback, useState } from "react";
// import { ActivityIndicator, FlatList, Text, View } from "react-native";
// import { FeedItem } from "./feedItem";

// export const FeedList = () => {
//   const theme = useAppTheme();
//   const isFocused = useIsFocused();
//   const { isMuted, toggleMute } = useFeedStore();
//   const [activeIndex, setActiveIndex] = useState(0);

//   const {
//   data,
//   fetchNextPage,
//   hasNextPage,
//   isFetchingNextPage,
//   isLoading,
//   isError,
//   refetch,
// } = useInfiniteQuery({
//   queryKey: ["admin-videos-feed"],
//   queryFn: async ({ pageParam = 1 }) => {
//     const res = await getAdminVideosFeed(pageParam, 20);
//     return res.data || [];
//   },
//   initialPageParam: 1,

//   getNextPageParam: (lastPage) =>
//     lastPage.hasNextPage ? lastPage.page + 1 : undefined,

//   select: (data) =>
//     data.pages.flatMap((page) =>
//       page.data.map((video: any) => ({
//         id: video.id,
//         title: video.title,
//         caption: video.caption,
//         videoUrl: video.videoUrl,
//         thumbnailUrl: video.thumbnailUrl,
//         duration: video.duration,
//         type: video.type,
//         created_at: video.created_at,
//         user: video.user,
//         username: video.user?.username || "Unknown",
//         profilePic: video.user?.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
//         likes: video.likesCount || 0,
//         comments: video.commentsCount || 0,
//         shares: 0,
//         views: video.viewsCount || 0,
//         liked: video.isLiked || false,
//         saved: false,
//         hashtags: video.hashtags || [],
//         audio: video.audio,
//       })),
//     ),
// });

//   // ✅ Like Handler
//   const handleLike = useCallback((id: string) => {
//     // optimistic UI example (optional – best with mutation)
//     feedVideos.forEach(() => { });
//   }, []);

//   const handleSave = useCallback((id: string) => { }, []);
//   const handleComment = useCallback(
//     (id: string) => router.push(`../../../comment/${id}`),
//     []
//   );
//   const handleShare = useCallback((id: string) => { }, []);

//   const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
//     if (viewableItems.length > 0) {
//       setActiveIndex(viewableItems[0].index);
//     }
//   }, []);

//   const viewabilityConfig = { itemVisiblePercentThreshold: 70 };

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
//         <ActivityIndicator size="large" color={theme.text} />
//         <Text style={{ color: theme.text, marginTop: 10 }}>Loading videos...</Text>
//       </View>
//     );
//   }

//   if (isError) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
//         <Text style={{ color: "red" }}>Failed to load videos</Text>
//         <Text style={{ color: theme.text }} onPress={() => refetch()}>
//           Tap to retry
//         </Text>
//       </View>
//     );
//   }

//   if (feedVideos.length === 0) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
//         <Text style={{ color: theme.text }}>No videos available</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={data}
//       keyExtractor={(item) => item.id}
//       renderItem={({ item, index }) => (
//         <FeedItem
//           item={item}
//           isActive={index === activeIndex}
//           isFocused={isFocused}
//           onLike={handleLike}
//           onSave={handleSave}
//           onComment={handleComment}
//           onShare={handleShare}
//           theme={theme}
//           isMuted={isMuted}
//           toggleMute={toggleMute}
//         />
//       )}
//       onViewableItemsChanged={onViewableItemsChanged}
//       viewabilityConfig={viewabilityConfig}

//       onEndReached={() => {
//         if (hasNextPage && !isFetchingNextPage) {
//           fetchNextPage();
//         }
//       }}
//       onEndReachedThreshold={0.6}

//       ListFooterComponent={
//         isFetchingNextPage ? (
//           <ActivityIndicator color={theme.text} />
//         ) : null
//       }

//       removeClippedSubviews
//       maxToRenderPerBatch={3}
//       windowSize={5}
//       initialNumToRender={2}
//       showsVerticalScrollIndicator={false}
//     />

//   );
// };

import { getAdminVideosFeed } from "@/src/api/admin-feed-api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useFeedStore } from "@/src/store/useFeedStore";
import { useIsFocused } from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { FeedItem } from "./feedItem";

export const FeedList = () => {
  const theme = useAppTheme();
  const isFocused = useIsFocused();
  const { isMuted, toggleMute } = useFeedStore();
  const [activeIndex, setActiveIndex] = useState(0);

  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 80,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["admin-videos-feed"],
    queryFn: ({ pageParam = 1 }) =>
      getAdminVideosFeed(pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
  });

  const feedVideos =
    data?.pages.flatMap(page => page.data) ?? [];

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
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#000" }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text onPress={() => refetch()} style={{ color: "red" }}>
          Retry
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <FlatList
        data={feedVideos}
        keyExtractor={(item) => item.id}
        // keyExtractor={(item, index) => item?.id ? String(item.id) : `feed-item-${index}`}
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
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
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

// <FlatList
//   data={feedVideos}
//   keyExtractor={(item) => item.id}
//   renderItem={({ item, index }) => (

//     <FeedItem
//       item={item}
//       isActive={index === activeIndex}
//       isFocused={isFocused}
//       // onLike={handleLike}
//       onComment={handleComment}
//       theme={theme}
//       isMuted={isMuted}
//       toggleMute={toggleMute}
//     />
//   )}
//   pagingEnabled
//   windowSize={5}
//   initialNumToRender={1}
//   maxToRenderPerBatch={2}
//   removeClippedSubviews
//   showsVerticalScrollIndicator={false}
//   viewabilityConfig={viewConfigRef.current}
//   onViewableItemsChanged={onViewableItemsChanged}
//   onEndReached={() => {
//     if (hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }}
//   onEndReachedThreshold={0.5}
//   ListFooterComponent={
//     isFetchingNextPage ? (
//       <ActivityIndicator color={theme.text} />
//     ) : null
//   }
// />