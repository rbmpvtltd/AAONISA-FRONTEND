// import { useRouter } from "expo-router";
// import { useVideoPlayer, VideoView } from "expo-video";
// import React, { useMemo } from "react";
// import {
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const { width } = Dimensions.get("window");
// const numColumns = 3;
// const spacing = 2;
// const columnWidth = Math.floor((width - spacing * (numColumns - 1)) / numColumns);

// type VideoItem = {
//   id: string;
//   source: any;
// };

// const videos: VideoItem[] = [
//   {
//     id: "1", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2017.mp4",
//     }
//   },
//   {
//     id: "2", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2016.mp4",
//     }
//   },
//   {
//     id: "3", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback10.mp4",
//     }
//   },
//   {
//     id: "4", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
//     }
//   },
//   {
//     id: "5", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback12.mp4",
//     }
//   },
//   {
//     id: "6", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback13.mp4",
//     }
//   },
//   {
//     id: "7", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback18.mp4",
//     }
//   },
//   {
//     id: "8", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback3.mp4",
//     }
//   },
//   {
//     id: "9", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback5.mp4",
//     }
//   },
//   {
//     id: "10", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback7.mp4",
//     }
//   },
//    {
//     id: "11", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2017.mp4",
//     }
//   },
//   {
//     id: "12", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2016.mp4",
//     }
//   },
//   {
//     id: "13", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback10.mp4",
//     }
//   },
//   {
//     id: "14", source: {
//       uri:
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
//     }
//   },
// ];

// const ExploreScreen = () => {
//   const router = useRouter();

//   const columns: VideoItem[][] = useMemo(() => {
//     const cols: VideoItem[][] = Array.from({ length: numColumns }, () => []);
//     videos.forEach((item, i) => {
//       cols[i % numColumns].push(item);
//     });
//     return cols;
//   }, []);

//   return (

    
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.row}>
//         {columns.map((column, colIndex) => (
//           <View key={colIndex} style={styles.column}>
//             {column.map((item: VideoItem) => (
//               <ExploreItem key={item.id} item={item} router={router} />
//             ))}
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// const ExploreItem = ({
//   item,
//   router,
// }: {
//   item: VideoItem;
//   router: any;
// }) => {
//   const player = useVideoPlayer(item.source, (player) => {
//     player.loop = true;
//     player.muted = true;
//     player.play();
//   });

//   const height = Math.floor(Math.random() * (300 - 200 + 1)) + 200;

//   return (
//     <TouchableOpacity
//       activeOpacity={0.9}
//       onPress={() =>
//         router.push({
//           pathname: "/(drawer)/(tabs)/reels",
//           params: { id: item.id },
//         })
//       }
//       style={{ marginBottom: spacing }}
//     >
//       <VideoView
//         style={{
//           width: columnWidth,
//           height,
//           borderRadius: 6,
//           overflow: "hidden",
//         }}
//         player={player}
//         allowsFullscreen={false}
//         allowsPictureInPicture={false}
//         nativeControls={false}
//       />
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     backgroundColor: "#000",
//     padding: spacing,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   column: {
//     flexDirection: "column",
//     gap: spacing,
//   },
// });

// export default ExploreScreen;


import { useAppTheme } from "@/src/constants/themeHelper";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchUserProfiel } from "../../../../src/api/profile-api";

const { width } = Dimensions.get("window");
const numColumns = 3;
const spacing = 2;
const columnWidth = Math.floor((width - spacing * (numColumns - 1)) / numColumns);

// Dummy Videos
const allVideos = [
  { id: "1", uri: "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2017.mp4" },
  { id: "2", uri: "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2016.mp4" },
  { id: "3", uri: "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback10.mp4" },
  { id: "4", uri: "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4" },
  { id: "5", uri: "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback12.mp4" },
  { id: "6", uri: "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback13.mp4" },
  { id: "7", uri: "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback18.mp4" },
  { id: "8", uri: "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback3.mp4" },
  { id: "9", uri: "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback5.mp4" },
  { id: "10", uri: "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback7.mp4" },
];

export default function ExploreScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search Users API
  const {
    data: searchResults = [],
    isLoading: searchLoading,
  } = useQuery({
    queryKey: ["searchUsers", debouncedQuery],
    queryFn: () => SearchUserProfiel(debouncedQuery),
    enabled: !!debouncedQuery,
    staleTime: 1000 * 60,
  });

  // Column Grid
  const columns = useMemo(() => {
    const cols: typeof allVideos[] = Array.from({ length: numColumns }, () => []);
    allVideos.forEach((item, i) => {
      cols[i % numColumns].push(item);
    });
    return cols;
  }, []);

  const clearSearch = () => setSearchQuery("");
 return (
    <SafeAreaView style={{flex:1}} edges={["top"]}>
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Search"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchLoading && <ActivityIndicator size="small" color="#888" style={styles.loading} />}
        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* SEARCH RESULTS (if searching) */}
      {debouncedQuery ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                router.push(`/profile/${item.username}`);
              }}
              style={styles.userItem}
            >

              <Image
                source={{ uri: item.userProfile?.ProfilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
                style={styles.avatar}
              />
              <View style={styles.textContainer}>
                <Text style={[styles.username, { color: theme.text }]}>{item.username}</Text>
                {item.name && <Text style={[styles.name, { color: theme.subtitle }]}>{item.name}</Text>}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            searchLoading ? null : (
              <Text style={styles.emptyText}>No users found</Text>
            )
          }
          contentContainerStyle={styles.resultsContainer}
        />
      ) : (
        /* VIDEO GRID */
        <ScrollView contentContainerStyle={styles.gridContainer}>
          <View style={styles.row}>
            {columns.map((column, colIndex) => (
              <View key={colIndex} style={styles.column}>
                {column.map((item) => (
                  <VideoGridItem key={item.id} item={item} router={router} />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
    </SafeAreaView>
  );
}

// Video Item
const VideoGridItem = React.memo(({ item, router }: { item: any; router: any }) => {
  const player = useVideoPlayer(item.uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const height = useMemo(() => Math.floor(Math.random() * 100) + 200, []);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push({ pathname: "/(drawer)/(tabs)/reels", params: { id: item.id } })}
      style={{ marginBottom: spacing }}
    >
      <VideoView
        style={{
          width: columnWidth,
          height,
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: "#000",
        }}
        player={player}
        contentFit="cover"
        allowsFullscreen={false}
        nativeControls={false}
      />
    </TouchableOpacity>
  );
});

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16 },
  loading: { marginLeft: 8 },
  resultsContainer: { paddingHorizontal: 12 },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    marginBottom: 8,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  textContainer: { marginLeft: 12 },
  username: { fontSize: 16, fontWeight: "600" },
  name: { fontSize: 14, marginTop: 2 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#888", fontSize: 16 },
  gridContainer: { padding: spacing },
  row: { flexDirection: "row", justifyContent: "space-between" },
  column: { gap: spacing },
});