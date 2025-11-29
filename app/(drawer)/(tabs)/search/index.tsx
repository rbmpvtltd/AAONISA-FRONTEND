
// import { Ionicons } from "@expo/vector-icons";
// import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "expo-router";
// import { useVideoPlayer, VideoView } from "expo-video";
// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Dimensions,
//   Image,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import { SearchUserProfiel } from "@/src/api/profile-api";
// import { getCategoryReel } from "@/src/api/reels-api";
// import { useAppTheme } from "@/src/constants/themeHelper";

// const { width, height: WINDOW_HEIGHT } = Dimensions.get("window");
// const numColumns = 3;
// const spacing = 8;
// const columnWidth = Math.floor((width - spacing * (numColumns + 1)) / numColumns);
// const DEFAULT_THUMBNAIL = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

// type VideoItem = { id: string | number; videoUrl?: string; thumbnailUrl?: string; height?: number; title?: string };
// type ExplorePage = { data: VideoItem[]; hasMore: boolean };

// export default function ExploreMergedScreen() {
//   const theme = useAppTheme();
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");

//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
//     return () => clearTimeout(t);
//   }, [searchQuery]);

//   // --- Search API ---
//   const { data: searchResults = [], isLoading: searchLoading } = useQuery({
//     queryKey: ["searchUsers", debouncedQuery],
//     queryFn: async () => {
//       if (!debouncedQuery) return [];
//       return SearchUserProfiel(debouncedQuery);
//     },
//     enabled: !!debouncedQuery,
//     staleTime: 1000 * 60 * 2,
//   });

//   // --- Infinite explore videos API ---
//   const { data, isLoading: videoLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, } = useInfiniteQuery<ExplorePage, Error, import("@tanstack/react-query").InfiniteData<ExplorePage>, string[], number>({
//     queryKey: ["exploreVideos"],
//     queryFn: async ({ pageParam = 1 }) => getCategoryReel("explore", pageParam, 18),
//     getNextPageParam: (lastPage, allPages) => lastPage.hasMore ? allPages.length + 1 : undefined,
//     initialPageParam: 1,
//   });

//   const videos = useMemo(() => data?.pages?.flatMap(p => p.data) ?? [], [data]);
//   const columns = useMemo(() => {
//     const cols: VideoItem[][] = Array.from({ length: numColumns }, () => []);
//     videos.forEach((v, i) => cols[i % numColumns].push(v));
//     return cols;
//   }, [videos]);

//   const cardRefs = useRef(new Map<string | number, View>());
//   const scrollViewRef = useRef<ScrollView | null>(null);
//   const [visibleIds, setVisibleIds] = useState<Array<string | number>>([]);
//   const LOAD_MORE_THRESHOLD = 480;

//   // --- Check which videos are visible ---
//   const checkVisible = useCallback((scrollY: number) => {
//     const visible: Array<string | number> = [];
//     const topVisible = scrollY;
//     const bottomVisible = scrollY + WINDOW_HEIGHT;

//     for (const [id, ref] of Array.from(cardRefs.current.entries())) {
//       try {
//         ref?.measure?.((fx, fy, w, h, px, py) => {
//           const itemTop = py;
//           const itemBottom = py + h;
//           const visibleRatio =
//             Math.max(0, Math.min(itemBottom, bottomVisible) - Math.max(itemTop, topVisible)) / Math.max(1, h);
//           if (visibleRatio >= 0.3) visible.push(id);
//         });
//       } catch {}
//     }

//     setTimeout(() => {
//       setVisibleIds(prev => {
//         const next = Array.from(new Set(visible));
//         const same = prev.length === next.length && prev.every((v, i) => v === next[i]);
//         return same ? prev : next;
//       });
//     }, 50);
//   }, []);

//   const onScroll = useCallback(
//     (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//       const y = e.nativeEvent.contentOffset.y;
//       const contentHeight = e.nativeEvent.contentSize.height;
//       const layoutHeight = e.nativeEvent.layoutMeasurement.height;

//       checkVisible(y);

//       if (hasNextPage && y + layoutHeight + LOAD_MORE_THRESHOLD >= contentHeight) {
//         fetchNextPage();
//       }
//     },
//     [checkVisible, fetchNextPage, hasNextPage]
//   );

//   if (videoLoading) return <LoadingScreen theme={theme} />;
//   if (isError) return <ErrorScreen theme={theme} refetch={refetch} />;

//   return (
//     <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
//       <View style={[styles.container, { backgroundColor: theme.background }]}>
//         <SearchBar theme={theme} searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchLoading={searchLoading} router={router} />

//         <View style={{ flex: 1 }}>
//           <SearchResults theme={theme} searchResults={searchResults} router={router} style={{ display: debouncedQuery ? "flex" : "none" }} />

//           <ScrollView
//             ref={scrollViewRef}
//             contentContainerStyle={{ padding: spacing }}
//             onScroll={onScroll}
//             scrollEventThrottle={100}
//             showsVerticalScrollIndicator={false}
//             style={{ display: debouncedQuery ? "none" : "flex" }}
//           >
//             <View style={styles.masonryRow}>
//               {columns.map((col, colIndex) => (
//                 <View style={styles.column} key={`col-${colIndex}`}>
//                   {col.map((item) => (
//                     <MasonryCard
//                       key={String(item.id)}
//                       item={item}
//                       router={router}
//                       theme={theme}
//                       registerRef={(r: any) => {
//                         if (!r) cardRefs.current.delete(item.id);
//                         else cardRefs.current.set(item.id, r);
//                       }}
//                       isPlayable={visibleIds.includes(item.id)} // Safe boolean prop
//                     />
//                   ))}
//                 </View>
//               ))}
//             </View>

//             {isFetchingNextPage && <ActivityIndicator size="small" color={theme.text} style={{ padding: 12 }} />}
//           </ScrollView>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// // ---------------- Components ----------------

// const LoadingScreen = ({ theme }: any) => (
//   <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
//     <View style={styles.loadingWrap}>
//       <ActivityIndicator size="large" color={theme.text} />
//     </View>
//   </SafeAreaView>
// );

// const ErrorScreen = ({ theme, refetch }: any) => (
//   <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
//     <View style={styles.center}>
//       <Text style={[styles.errorText, { color: theme.text }]}>Failed to load explore feed.</Text>
//       <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
//         <Text style={{ color: theme.buttonBg }}>Retry</Text>
//       </TouchableOpacity>
//     </View>
//   </SafeAreaView>
// );

// const SearchBar = ({ theme, searchQuery, setSearchQuery, searchLoading, router }: any) => (
//   <View style={[styles.searchContainer, { backgroundColor: theme.searchBg }]}>
//     <Ionicons name="search" size={20} color={theme.text} style={styles.searchIcon} />
//     <TextInput
//       style={[styles.input, { color: theme.text }]}
//       placeholder="Search users"
//       placeholderTextColor={theme.text}
//       value={searchQuery}
//       onChangeText={setSearchQuery}
//       autoCapitalize="none"
//       returnKeyType="search"
//     />
//     {searchQuery ? (
//       <TouchableOpacity onPress={() => setSearchQuery("")}>
//         <Ionicons name="close-circle" size={20} color={theme.text} />
//       </TouchableOpacity>
//     ) : null}
//     {searchLoading && <ActivityIndicator size="small" color={theme.text} style={styles.loading} />}
//   </View>
// );

// const SearchResults = ({ theme, searchResults, router, style }: any) => (
//   <ScrollView style={style} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 40 }}>
//     {searchResults.map((u: any) => (
//       <TouchableOpacity key={u.id} style={[styles.userItem, { backgroundColor: theme.buttonBg }]} onPress={() => router.push(`/profile/${u.username}`)}>
//         <Image source={{ uri: u.userProfile?.ProfilePicture || DEFAULT_THUMBNAIL }} style={styles.avatar} />
//         <View style={styles.textContainer}>
//           <Text style={[styles.username, { color: theme.text }]}>{u.username}</Text>
//           {u.name && <Text style={[styles.name, { color: theme.subtitle }]}>{u.name}</Text>}
//         </View>
//       </TouchableOpacity>
//     ))}
//   </ScrollView>
// );

// const MasonryCard = React.memo(({ item, router, theme, registerRef, isPlayable }: any) => {
//   const [showThumbnail, setShowThumbnail] = useState(true);

//   const player = useVideoPlayer(item.videoUrl || "", p => {
//     p.muted = true;
//     p.loop = true; // continuous loop
//   });

//   // Play/pause based on visibility
//   useEffect(() => {
//     if (!player) return;
//     if (isPlayable) player.play();
//     else player.pause();
//   }, [isPlayable, player]);

//   // Hide thumbnail when video is ready
//   useEffect(() => {
//     if (!player) return;
//     const sub = player.addListener?.("statusChange", (status: any) => {
//       if (status?.isLoaded && !status.isBuffering) setShowThumbnail(false);
//     });
//     return () => sub?.remove?.();
//   }, [player]);

//   const viewRef = useRef<View | null>(null);
//   useEffect(() => {
//     registerRef(viewRef.current);
//     return () => registerRef(null);
//   }, [registerRef]);

//   const itemHeight = useMemo(
//     () => item.height || Math.max(160, Math.round((columnWidth * 16) / 9) + Math.round(Math.random() * 80) - 40),
//     [item.height]
//   );

//   return (
//     <TouchableOpacity
//       activeOpacity={0.95}
//       onPress={() => router.push({ pathname: "/(drawer)/(tabs)/reels", params: { id: String(item.id) } })}
//       style={{ marginBottom: spacing }}
//     >
//       <View ref={viewRef} style={{ width: columnWidth, height: itemHeight, borderRadius: 10, overflow: "hidden", backgroundColor: "#000" }}>
//         {showThumbnail && <Image source={{ uri: item.thumbnailUrl || DEFAULT_THUMBNAIL }} style={{ width: "100%", height: "100%", position: "absolute" }} resizeMode="cover" />}
//         <VideoView player={player} style={{ width: "100%", height: "100%", position: "absolute" }} contentFit="cover" nativeControls={false} />
//       </View>
//     </TouchableOpacity>
//   );
// });

// const styles = StyleSheet.create({
//   safe: { flex: 1 },
//   container: { flex: 1 },
//   loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
//   center: { justifyContent: "center", alignItems: "center", padding: 20 },
//   errorText: { fontSize: 16 },
//   retryBtn: { marginTop: 12, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
//   searchContainer: { flexDirection: "row", alignItems: "center", marginHorizontal: 10, marginTop: 12, borderRadius: 10, paddingHorizontal: 12, height: 44, marginBottom: 8 },
//   searchIcon: { marginRight: 8 },
//   input: { flex: 1, fontSize: 16 },
//   loading: { marginLeft: 8 },
//   userItem: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, marginBottom: 8 },
//   avatar: { width: 50, height: 50, borderRadius: 25 },
//   textContainer: { marginLeft: 12 },
//   username: { fontSize: 16, fontWeight: "600" },
//   name: { fontSize: 14, marginTop: 2 },
//   masonryRow: { flexDirection: "row", justifyContent: "space-between", gap: spacing },
//   column: { width: columnWidth, gap: spacing },
// });
import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchUserProfiel } from "@/src/api/profile-api";
import { getCategoryReel } from "@/src/api/reels-api";
import { useAppTheme } from "@/src/constants/themeHelper";

const { width } = Dimensions.get("window");
const numColumns = 3;
const spacing = 8;
const columnWidth = Math.floor((width - spacing * (numColumns + 1)) / numColumns);

const DEFAULT_THUMBNAIL = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export default function ExploreScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Search users API
  const {
    data: searchResults = [],
    isLoading: searchLoading,
  } = useQuery({
    queryKey: ["searchUsers", debouncedQuery],
    queryFn: () => (debouncedQuery ? SearchUserProfiel(debouncedQuery) : []),
    enabled: !!debouncedQuery,
  });

  // Infinite explore feed API
  const {
    data,
    isLoading: videoLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["exploreVideos"],
    queryFn: ({ pageParam = 1 }) => getCategoryReel("explore", pageParam, 18),
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const videos = useMemo(
    () => data?.pages?.flatMap((p) => p.data) ?? [],
    [data]
  );

  // Masonry column distribution
  const columns = useMemo(() => {
    // Initialize empty columns WITH height tracking
    const cols: { items: any[]; height: number }[] = Array.from(
      { length: numColumns },
      () => ({ items: [], height: 0 })
    );

    videos.forEach((item: any) => {
      const aspectHeight =
        item.height ||
        Math.max(160, Math.round((columnWidth * 16) / 9));

      // Find shortest column
      let shortest = cols[0];
      for (let c of cols) {
        if (c.height < shortest.height) shortest = c;
      }

      // Push item into shortest column
      shortest.items.push(item);
      shortest.height += aspectHeight + spacing;
    });

    return cols.map((c) => c.items);
  }, [videos]);



  if (videoLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.text} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <View style={styles.center}>
          <Text style={{ color: theme.text, fontSize: 16 }}>
            Failed to load explore feed.
          </Text>
          <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 10 }}>
            <Text style={{ color: theme.buttonBg }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>

        {/* SEARCH BAR */}
        <View style={[styles.searchContainer, { backgroundColor: theme.searchBg }]}>
          <Ionicons name="search" size={20} color={theme.text} style={styles.searchIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Search users"
            placeholderTextColor={theme.text}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text.trim().toLocaleLowerCase())}
            autoCapitalize="none"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.text} />
            </TouchableOpacity>
          ) : null}
          {searchLoading && <ActivityIndicator size="small" color={theme.text} style={styles.loading} />}
        </View>

        {/* SEARCH RESULTS */}
        {debouncedQuery ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: 40 }}>

            {/*  NO RESULTS FOUND */}
            {!searchLoading && searchResults.length === 0 ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="search-outline" size={50} color={theme.subtitle} />
                <Text style={{ color: theme.subtitle, marginTop: 10, fontSize: 16 }}>
                  No results found
                </Text>
              </View>
            ) : null}

            {/*  SEARCH RESULTS LIST */}
            {searchResults.map((u: any) => (
              <TouchableOpacity
                key={u.id}
                style={[styles.userItem, { backgroundColor: theme.buttonBg }]}
                onPress={() => router.push(`/profile/${u.username}`)}
              >
                <Image
                  source={{ uri: u.userProfile?.ProfilePicture || DEFAULT_THUMBNAIL }}
                  style={styles.avatar}
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.username, { color: theme.text }]}>
                    {u.username}
                  </Text>
                  {u.name && (
                    <Text style={[styles.name, { color: theme.subtitle }]}>
                      {u.name}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <>
            {/* EXPLORE GRID */}
            <ScrollView
              contentContainerStyle={{ padding: spacing }}
              onScroll={({ nativeEvent }) => {
                const { contentSize, contentOffset, layoutMeasurement } = nativeEvent;
                if (
                  hasNextPage &&
                  contentOffset.y + layoutMeasurement.height + 300 >= contentSize.height
                ) {
                  fetchNextPage();
                }
              }}
              scrollEventThrottle={100}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.masonryRow}>
                {columns.map((col, colIndex) => (
                  <View key={colIndex} style={styles.column}>
                    {col.map((item) => (
                      <ThumbnailCard
                        key={item.id}
                        item={item}
                        router={router}
                      />
                    ))}
                  </View>
                ))}
              </View>

              {isFetchingNextPage && (
                <ActivityIndicator size="small" color={theme.text} style={{ padding: 12 }} />
              )}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// --------------------- THUMBNAIL CARD ---------------------

const ThumbnailCard = ({ item, router }: any) => {
  const itemHeight =
    item.height || Math.max(160, Math.round((columnWidth * 16) / 9));

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      // onPress={() =>
      //   router.push({
      //     pathname: "/(drawer)/(tabs)/reels",
      //     params: { id: String(item.id) },
      //   })
      // }
      // onPress={() =>
      //   router.push({
      //     pathname: "/reels/[id]",
      //     params: { id: String(item.id) },
      //   })
      // }
      onPress={() => {
        console.log("Navigating to video:", item.id);
        router.push({
          pathname: "/(drawer)/(tabs)/reels",
          params: { videoId: item.id }
        });
      }}
      style={{ marginBottom: spacing }}
    >
      <Image
        source={{ uri: item.thumbnailUrl || DEFAULT_THUMBNAIL }}
        style={{
          width: columnWidth,
          height: itemHeight,
          borderRadius: 10,
          backgroundColor: "#111",
        }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

// --------------------- STYLES ---------------------

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 8,
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16 },
  loading: { marginLeft: 8 },

  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  textContainer: { marginLeft: 12 },
  username: { fontSize: 16, fontWeight: "600" },
  name: { fontSize: 14, marginTop: 2 },

  masonryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing,
  },
  column: {
    width: columnWidth,
    gap: spacing,
  },
});
