// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }

import { Link } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";


const { height } = Dimensions.get("window");
const ITEM_HEIGHT = height * 0.8;

interface Photo {
  id: number;
  title: string;
  imageUrl: string;
  profilePic: string;
  username: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  comments: string[];
}

// Pure UI Component (Only presentation, no state)
const PhotoItem = React.memo(
  ({ item, onLike, onSave, onComment, onShare }: {
    item: Photo;
    onLike: (id: number) => void;
    onSave: (id: number) => void;
    onComment: (id: number) => void;
    onShare: (id: number) => void;
  }) => (
    <View style={styles.reel}>
      {/* Header (Profile Info) */}
      <View style={styles.header}>
        <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={{ color: "white", fontSize: 10 }}>{item.title.slice(0, 30)}</Text>
        </View>
      </View>

      {/* Main Image */}
      <Image source={{ uri: item.profilePic }} style={styles.image} />

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={() => onLike(item.id)}>
          <Icon
            name={item.liked ? "heart" : "heart-outline"}
            size={29}
            color={item.liked ? "red" : "black"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onComment(item.id)}>
          <Icon name="chatbubble-outline" size={25} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onShare(item.id)}>
          <Icon name="share-social-outline" size={25} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onSave(item.id)} style={{ marginLeft: "auto" }}>
          <Icon
            name={item.saved ? "bookmark" : "bookmark-outline"}
            size={25}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Title / Caption */}
      <Text style={styles.title}>{item.title}</Text>
      <Link href="/about" style={{ marginBottom: 50, textAlign: 'center' }}>Go To Profile</Link>

    </View>
  )
);

const HomePage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // API Fetcher
  const fetchPhotos = async () => {
    if (loading || photos.length >= 100) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/photos?_start=${page}&_limit=10`
      );
      const data = await res.json();

      //  Normalize API response (future-proof for backend integration)
      const updated: Photo[] = data.map((d: any) => ({
        id: d.id,
        title: d.title,
        imageUrl: d.url,
        profilePic:
          "https://randomuser.me/api/portraits/men/" + (d.id % 100) + ".jpg", // dummy profile
        username: "user_" + d.id, // dummy username
        likes: Math.floor(Math.random() * 100),
        liked: false,
        saved: false,
        comments: [],
      }));

      setPhotos((prev) => [...prev, ...updated]);
      setPage((prev) => prev + 10);
    } catch (err) {
      console.error("Error fetching photos ===> ", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Handlers
  const handleLike = useCallback((id: number) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }, []);

  const handleSave = useCallback((id: number) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );
  }, []);

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
      />
    ),
    [handleLike, handleSave, handleComment, handleShare]
  );

  return (
    // <SafeAreaView style={{ flex: 1 }}>
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
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
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
    // </SafeAreaView>

    // <Audio />
    // <VideoScreen/>
    // <VideoUploader />
  );
};

const styles = StyleSheet.create({
  reel: {
    height: ITEM_HEIGHT,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
  },
  title: {
    color: "#000",
    padding: 10,
    fontSize: 16,
  },
  actionsRow: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    justifyContent: "flex-start",
  }
});

export default HomePage;