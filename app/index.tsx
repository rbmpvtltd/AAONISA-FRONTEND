// import React, { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Icon from "react-native-vector-icons/Ionicons";
// import { useAppTheme } from "./themeHelper"; // ✅ import theme hook

// const { height } = Dimensions.get("window");
// const windowWidth = Dimensions.get("window").width;
// const ITEM_HEIGHT = height * 0.8;

// interface Photo {
//   id: number;
//   title: string;
//   imageUrl: string;
//   profilePic: string;
//   username: string;
//   likes: number;
//   liked: boolean;
//   saved: boolean;
//   comments: string[];
// }

// const PhotoItem = React.memo(
//   ({
//     item,
//     onLike,
//     onSave,
//     onComment,
//     onShare,
//     theme,
//   }: {
//     item: Photo;
//     onLike: (id: number) => void;
//     onSave: (id: number) => void;
//     onComment: (id: number) => void;
//     onShare: (id: number) => void;
//     theme: ReturnType<typeof useAppTheme>;
//   }) => (
//     <View style={[styles.reel, { backgroundColor: theme.background }]}>
//       {/* Header */}
//       <View style={[styles.header, { backgroundColor: theme.overlay }]}>
//         <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
//         <View style={styles.userInfo}>
//           <Text style={[styles.username, { color: theme.text }]}>{item.username}</Text>
//           <Text style={{ color: theme.text, fontSize: 10 }}>
//             {item.title.slice(0, 30)}
//           </Text>
//         </View>
//       </View>

//       {/* Main Image */}
//       <Image source={{ uri: item.profilePic }} style={styles.image} />

//       {/* Actions */}
//       <View style={styles.actionsRow}>
//         <TouchableOpacity onPress={() => onLike(item.id)}>
//           <Icon
//             name={item.liked ? "heart" : "heart-outline"}
//             size={29}
//             color={item.liked ? "red" : theme.text}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => onComment(item.id)}>
//           <Icon name="chatbubble-outline" size={25} color={theme.text} />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => onShare(item.id)}>
//           <Icon name="share-social-outline" size={25} color={theme.text} />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => onSave(item.id)} style={{ marginLeft: "auto" }}>
//           <Icon
//             name={item.saved ? "bookmark" : "bookmark-outline"}
//             size={25}
//             color={theme.text}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Title */}
//       <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
//     </View>
//   )
// );

// const HomePage: React.FC = () => {
//   const theme = useAppTheme(); // ✅ get system theme
//   const [photos, setPhotos] = useState<Photo[]>([]);
//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const fetchPhotos = async () => {
//     if (loading || photos.length >= 100) return;
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `https://jsonplaceholder.typicode.com/photos?_start=${page}&_limit=10`
//       );
//       const data = await res.json();
//       const updated: Photo[] = data.map((d: any) => ({
//         id: d.id,
//         title: d.title,
//         imageUrl: d.url,
//         profilePic: `https://randomuser.me/api/portraits/men/${d.id % 100}.jpg`,
//         username: "user_" + d.id,
//         likes: Math.floor(Math.random() * 100),
//         liked: false,
//         saved: false,
//         comments: [],
//       }));
//       setPhotos((prev) => [...prev, ...updated]);
//       setPage((prev) => prev + 10);
//     } catch (err) {
//       console.error("Error fetching photos ===> ", err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchPhotos();
//   }, []);

//   const handleLike = useCallback((id: number) => {
//     setPhotos((prev) =>
//       prev.map((p) =>
//         p.id === id
//           ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
//           : p
//       )
//     );
//   }, []);

//   const handleSave = useCallback((id: number) => {
//     setPhotos((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
//     );
//   }, []);

//   const handleComment = useCallback((id: number) => {
//     Alert.alert("Comments", "Open comment section for photo " + id);
//   }, []);

//   const handleShare = useCallback((id: number) => {
//     Alert.alert("Share", "Sharing photo " + id);
//   }, []);

//   const renderItem = useCallback(
//     ({ item }: { item: Photo }) => (
//       <PhotoItem
//         item={item}
//         onLike={handleLike}
//         onSave={handleSave}
//         onComment={handleComment}
//         onShare={handleShare}
//         theme={theme}
//       />
//     ),
//     [handleLike, handleSave, handleComment, handleShare, theme]
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
//       <GestureHandlerRootView>
//         <FlatList
//           data={photos}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderItem}
//           pagingEnabled
//           snapToAlignment="start"
//           decelerationRate="fast"
//           onEndReached={fetchPhotos}
//           onEndReachedThreshold={0.7}
//           ListFooterComponent={loading ? <ActivityIndicator size="large" color={theme.text} /> : null}
//           initialNumToRender={5}
//           maxToRenderPerBatch={5}
//           windowSize={5}
//           removeClippedSubviews
//           getItemLayout={(_, index) => ({
//             length: ITEM_HEIGHT,
//             offset: ITEM_HEIGHT * index,
//             index,
//           })}
//         />
//       </GestureHandlerRootView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   reel: {
//     height: ITEM_HEIGHT,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//   },
//   profileImage: {
//     width: windowWidth > 500 ? 50 : 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   username: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   image: {
//     width: "100%",
//     height: "80%",
//     resizeMode: "cover",
//   },
//   title: {
//     padding: 10,
//     fontSize: 16,
//   },
//   actionsRow: {
//     flexDirection: "row",
//     width: "100%",
//     gap: 10,
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     alignItems: "center",
//   },
//   userInfo: {
//     flex: 1,
//     justifyContent: "flex-start",
//   },
// });

// export default HomePage;


import { Photo, usePhotoStore } from "@/src/store/useFeedStore";
import React, { useCallback, useEffect } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useAppTheme } from "../src/constants/themeHelper";

const { height } = Dimensions.get("window");
const windowWidth = Dimensions.get("window").width;
const ITEM_HEIGHT = height * 0.8;

const PhotoItem = React.memo(
  ({
    item,
    onLike,
    onSave,
    onComment,
    onShare,
    theme,
  }: {
    item: Photo;
    onLike: (id: number) => void;
    onSave: (id: number) => void;
    onComment: (id: number) => void;
    onShare: (id: number) => void;
    theme: ReturnType<typeof useAppTheme>;
  }) => (
    <View style={[styles.reel, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.overlay }]}>
        <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={[styles.username, { color: theme.text }]}>{item.username}</Text>
          <Text style={{ color: theme.text, fontSize: 10 }}>{item.title.slice(0, 30)}</Text>
        </View>
      </View>

      <Image source={{ uri: item.profilePic }} style={styles.image} />

      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={() => onLike(item.id)}>
          <Icon
            name={item.liked ? "heart" : "heart-outline"}
            size={29}
            color={item.liked ? "red" : theme.text}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onComment(item.id)}>
          <Icon name="chatbubble-outline" size={25} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onShare(item.id)}>
          <Icon name="share-social-outline" size={25} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onSave(item.id)} style={{ marginLeft: "auto" }}>
          <Icon
            name={item.saved ? "bookmark" : "bookmark-outline"}
            size={25}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
    </View>
  )
);

const HomePage: React.FC = () => {
  const theme = useAppTheme();
  const { photos, page, loading, addPhotos, setPhotos, setPage, setLoading } = usePhotoStore();

  const fetchPhotos = async () => {
    if (loading || photos.length >= 100) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/photos?_start=${page}&_limit=10`
      );
      const data = await res.json();
      const updated: Photo[] = data.map((d: any) => ({
        id: d.id,
        title: d.title,
        imageUrl: d.url,
        profilePic: `https://randomuser.me/api/portraits/men/${d.id % 100}.jpg`,
        username: "user_" + d.id,
        likes: Math.floor(Math.random() * 100),
        liked: false,
        saved: false,
        comments: [],
      }));
      addPhotos(updated);
      setPage(page + 10);
    } catch (err) {
      console.error("Error fetching photos ===> ", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleLike = useCallback((id: number) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }, [setPhotos]);

  const handleSave = useCallback((id: number) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );
  }, [setPhotos]);

  const handleComment = useCallback((id: number) => {
    Alert.alert("Comments", "Open comment section for photo " + id);
  }, []);

  const handleShare = useCallback((id: number) => {
    Alert.alert("Share", "Sharing photo " + id);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Photo }) => (
      <PhotoItem
        item={item}
        onLike={handleLike}
        onSave={handleSave}
        onComment={handleComment}
        onShare={handleShare}
        theme={theme}
      />
    ),
    [handleLike, handleSave, handleComment, handleShare, theme]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <GestureHandlerRootView>
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          pagingEnabled
          snapToAlignment="start"
          decelerationRate="fast"
          onEndReached={fetchPhotos}
          onEndReachedThreshold={0.7}
          ListFooterComponent={loading ? <ActivityIndicator size="large" color={theme.text} /> : null}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  reel: { height: ITEM_HEIGHT },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  profileImage: {
    width: windowWidth > 500 ? 50 : 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: { fontSize: 16, fontWeight: "600" },
  image: { width: "100%", height: "80%", resizeMode: "cover" },
  title: { padding: 10, fontSize: 16 },
  actionsRow: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: "center",
  },
  userInfo: { flex: 1, justifyContent: "flex-start" },
});

export default HomePage;


