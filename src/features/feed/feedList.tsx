// import { useAppTheme } from "@/src/constants/themeHelper";
// import { useFeedStore } from "@/src/store/useFeedStore";
// import { useIsFocused } from "@react-navigation/native";
// import { router } from "expo-router";
// import React, { useCallback, useEffect, useState } from "react";
// import { ActivityIndicator, FlatList, View } from "react-native";
// import { FeedItem } from "./feedItem"; // fixed import

// export const FeedList = () => {
//     const theme = useAppTheme();
//     const isFocused = useIsFocused();
//     const { photos, addPhotos, setPhotos, setPage, setLoading, loading, isMuted, toggleMute } =
//         useFeedStore();

//     const [activeIndex, setActiveIndex] = useState(0);

//     const videoAssets = [
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2017.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2016.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback10.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback12.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback13.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback18.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback3.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback5.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback7.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback9.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2017.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2016.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback10.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback12.mp4",
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback13.mp4",
//     ];

//     useEffect(() => {
//         if (photos.length > 0) return;

//         const dummyData = Array.from({ length: 17 }).map((_, i) => ({
//             id: i + 1,
//             title: "Feed Video " + (i + 1),
//             imageUrl: videoAssets[i % videoAssets.length],
//             profilePic: `https://randomuser.me/api/portraits/men/${(i + 10) % 100}.jpg`,
//             username: "user_" + (i + 1),
//             likes: Math.floor(Math.random() * 100),
//             liked: false,
//             saved: false,
//             // comments: [],
//             comments: Math.floor(Math.random() * 50), //  number
//     shares: Math.floor(Math.random() * 20),    //  number

//         }));

//         addPhotos(dummyData);
//         setPage(1);
//     }, []);

//     const handleLike = useCallback(
//         (id: number) =>
//             setPhotos((prev) =>
//                 prev.map((p) =>
//                     p.id === id
//                         ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
//                         : p
//                 )
//             ),
//         [setPhotos]
//     );

//     const handleSave = useCallback(
//         (id: number) => setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))),
//         [setPhotos]
//     );

//     const handleComment = useCallback((id: number) => router.push(`../../../comment/${id}`), []);
//     const handleShare = useCallback((id: number) => console.log("Share", id), []);

//     // Insta-style scroll autoplay (not full page)
//     const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
//         if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
//     }, []);

//     const viewabilityConfig = { itemVisiblePercentThreshold: 70 };

//     return (
//         <FlatList
//             data={photos}
//             renderItem={({ item, index }) => (
//                 <FeedItem
//                     item={item}
//                     isActive={index === activeIndex}
//                     isFocused={isFocused}
//                     onLike={handleLike}
//                     onSave={handleSave}
//                     onComment={handleComment}
//                     onShare={handleShare}
//                     theme={theme}
//                     isMuted={isMuted}
//                     toggleMute={toggleMute}
//                 />
//             )}
//             keyExtractor={(item) => `${item.id}`}
//             onViewableItemsChanged={onViewableItemsChanged}
//             viewabilityConfig={viewabilityConfig}
//             showsVerticalScrollIndicator={false}
//             ListFooterComponent={
//                 loading ? (
//                     <View style={{ paddingVertical: 20 }}>
//                         <ActivityIndicator size="large" color={theme.text} />
//                     </View>
//                 ) : null
//             }
//         />
//     );
// };

// ==================================================================

import { useAppTheme } from "@/src/constants/themeHelper";
import { useFeedStore } from "@/src/store/useFeedStore";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { FeedItem } from "./feedItem";

export const FeedList = () => {
  const theme = useAppTheme();
  const isFocused = useIsFocused();
  const { setPhotos, addPhotos, setPage, setLoading, loading, isMuted, toggleMute } =
    useFeedStore();

  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [visibleVideos, setVisibleVideos] = useState<any[]>([]);
  const [page, setCurrentPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  const videoAssets = [
    "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2017.mp4",
    "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2016.mp4",
    "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback10.mp4",
    "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
    "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback12.mp4",
    "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback13.mp4",
    "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback18.mp4",
    "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback3.mp4",
    "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback5.mp4",
    "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback7.mp4",
    "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback9.mp4",
  ];

  useEffect(() => {
    // Prepare dummy full data (all videos)
    const dummyData = Array.from({ length: 25 }).map((_, i) => ({
      id: i + 1,
      title: "Feed Video " + (i + 1),
      imageUrl: videoAssets[i % videoAssets.length],
      profilePic: `https://randomuser.me/api/portraits/men/${(i + 10) % 100}.jpg`,
      username: "user_" + (i + 1),
      likes: Math.floor(Math.random() * 100),
      liked: false,
      saved: false,
      comments: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 20),
    }));

    setAllVideos(dummyData);
    setVisibleVideos(dummyData.slice(0, 10)); // show first 10
    setPage(1);
  }, []);

  // Like / Save handlers
  const handleLike = useCallback(
    (id: number) =>
      setVisibleVideos((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
            : p
        )
      ),
    []
  );

  const handleSave = useCallback(
    (id: number) =>
      setVisibleVideos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
      ),
    []
  );

  const handleComment = useCallback((id: number) => router.push(`../../../comment/${id}`), []);
  const handleShare = useCallback((id: number) => console.log("Share", id), []);

  // Active video detection
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
  }, []);

  const viewabilityConfig = { itemVisiblePercentThreshold: 70 };

  // Load more videos (pagination)
  const loadMoreVideos = async () => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const start = (nextPage - 1) * 10;
      const end = start + 10;
      const newItems = allVideos.slice(start, end);

      if (newItems.length > 0) {
        setVisibleVideos((prev) => [...prev, ...newItems]);
        setCurrentPage(nextPage);
      }

      setLoading(false);
    }, 1500); // simulate loading delay
  };

  return (
    <FlatList
      data={visibleVideos}
      renderItem={({ item, index }) => (
        <FeedItem
          item={item}
          isActive={index === activeIndex}
          isFocused={isFocused}
          onLike={handleLike}
          onSave={handleSave}
          onComment={handleComment}
          onShare={handleShare}
          theme={theme}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      )}
      keyExtractor={(item) => `${item.id}`}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={
        loading ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="large" color={theme.text} />
          </View>
        ) : null
      }
      onEndReached={loadMoreVideos}
      onEndReachedThreshold={0.4}
    />
  );
};
