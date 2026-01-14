import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GetCurrentUser, SearchUserProfiel } from "@/src/api/profile-api";
import { ExploreSkeleton, SearchUserSkeleton } from "@/src/components/explorePageSkeleton";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useReelsByCategory } from "@/src/hooks/useReelsByCategory";

const { width, height } = Dimensions.get("window");
const numColumns = 3;
const spacing = 8;
const columnWidth = Math.floor((width - spacing * (numColumns + 1)) / numColumns);

const DEFAULT_THUMBNAIL = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const BOTTOM_PADDING = 100;
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


  const { data: currentUser, isLoading: currentUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });

  // Search users API
  const {
    data: searchResults = [],
    isLoading: searchLoading,
  } = useQuery({
    queryKey: ["searchUsers", debouncedQuery],
    queryFn: () => (debouncedQuery ? SearchUserProfiel(debouncedQuery) : []),
    enabled: !!debouncedQuery,
  });

  // Filter out current user from search results
  const filteredSearchResults = useMemo(() => {
    if (!currentUser || !searchResults) return [];

    return searchResults.filter((user: any) =>
      user.username !== currentUser.username
    );
  }, [searchResults, currentUser]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: videoLoading,
    isError,
    refetch,
    isRefetching,
  } = useReelsByCategory('explore');

  const videos = data?.pages.flatMap((p: any) => p.reels) || [];

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


  // if (isError) {
  //   return (
  //     <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
  //       <View style={styles.center}>
  //         <Text style={{ color: theme.text, fontSize: 16 }}>
  //           Failed to load explore feed.
  //         </Text>
  //         <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 10 }}>
  //           <Text style={{ color: theme.buttonBg }}>Retry</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  if (isError && videos.length === 0) {
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
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: theme.background }]}>
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
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: BOTTOM_PADDING }}>

            {/*  NO RESULTS FOUND */}
            {!searchLoading && filteredSearchResults.length === 0 ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="search-outline" size={50} color={theme.subtitle} />
                <Text style={{ color: theme.subtitle, marginTop: 10, fontSize: 16 }}>
                  No results found
                </Text>
              </View>
            ) : null}

            {/*  SEARCH RESULTS LIST */}
            {searchLoading ? (
              <SearchUserSkeleton />
            ) : (filteredSearchResults.map((u: any) => (
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
            )))}
          </ScrollView>
        ) : (
          <>
            {/* EXPLORE GRID */}
            <ScrollView
              contentContainerStyle={{ padding: spacing, paddingBottom: BOTTOM_PADDING }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  tintColor={theme.text}      // iOS
                  colors={[theme.text]}       // Android
                />
              }
              onScroll={({ nativeEvent }) => {
                const { contentSize, contentOffset, layoutMeasurement } = nativeEvent;
                if (
                  hasNextPage && !isFetchingNextPage &&
                  contentOffset.y + layoutMeasurement.height + 200 >= contentSize.height
                ) {
                  fetchNextPage();
                }
              }}
              scrollEventThrottle={100}
              showsVerticalScrollIndicator={false}
            >
              {videoLoading && videos.length === 0 ? (
                <ExploreSkeleton />
              ) : (
                <View style={styles.masonryRow}>
                  {columns.map((col, colIndex) => (
                    <View key={`col-${colIndex}`} style={styles.column}>
                      {col.map((item, itemIndex) => (
                        <ThumbnailCard
                          key={`${item.id}-${colIndex}-${itemIndex}`}
                          item={item}
                          router={router}
                        />
                      ))}
                    </View>
                  ))}

                </View>
              )}
              {isFetchingNextPage && !isRefetching && (
                <ActivityIndicator size="large" color={theme.text} style={{ padding: 12 }} />
              )}

              {isError && videos.length > 0 && !isFetchingNextPage && (
                <TouchableOpacity
                  onPress={() => fetchNextPage()}
                  style={{
                    paddingVertical: 16,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: theme.subtitle }}>
                    Tap to retry loading more
                  </Text>
                </TouchableOpacity>
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
      activeOpacity={0.85}
      onPress={() => {
        console.log("Navigating to video:", item.id);
        router.push({
          pathname: "/(drawer)/(tabs)/reels",
          params: { videoId: item.id || item.uuid, tab: 'Explore' }
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

