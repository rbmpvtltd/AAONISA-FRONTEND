import { useAppTheme } from "@/src/constants/themeHelper";
import { Photo, usePhotoStore } from "@/src/store/useFeedStore";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

const { height, width: windowWidth } = Dimensions.get("window");
const ITEM_HEIGHT = height * 0.7;

type Story = {
  id: number;
  username: string;
  profilePic: string;
  viewed: boolean;
};

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

const StoryItem = React.memo(
  ({ story, onPress, theme }: { story: Story; onPress: (id: number) => void; theme: any }) => (
    <TouchableOpacity style={styles.storyContainer} onPress={() => onPress(story.id)}>
      <View
        style={[
          styles.storyBorder,
          { borderColor: story.viewed ? theme.inputBorder : "#ff8501" },
        ]}
      >
        <Image source={{ uri: story.profilePic }} style={styles.storyImage} />
      </View>
      <Text style={[styles.storyUsername, { color: theme.text }]} numberOfLines={1}>
        {story.username}
      </Text>
    </TouchableOpacity>
  )
);

const HomePage: React.FC = () => {
  const theme = useAppTheme();
  const { photos, stories, page, loading,
    addPhotos, addStories, setPhotos,
    setStories, setPage, setLoading } = usePhotoStore();

  // const fetchPhotos = async () => {
  //   if (loading || photos.length >= 100) return;
  //   setLoading(true);
  //   try {
  //     const res = await fetch(
  //       `https://jsonplaceholder.typicode.com/photos?_start=${page}&_limit=10`
  //     );
  //     const data = await res.json();
  //     const updated: Photo[] = data.map((d: any) => ({
  //       id: d.id,
  //       title: d.title,
  //       imageUrl: d.url,
  //       profilePic: `https://randomuser.me/api/portraits/men/${d.id % 100}.jpg`,
  //       username: "user_" + d.id,
  //       likes: Math.floor(Math.random() * 100),
  //       liked: false,
  //       saved: false,
  //       comments: [],
  //     }));
  //     addPhotos(updated);
  //     setPage(page + 10);
  //   } catch (err) {
  //     console.error("Error fetching photos ===> ", err);
  //   }
  //   setLoading(false);
  // };
  


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
      console.error(err);
    }
    setLoading(false);
  };


  const fetchStories = async () => {
    const arr: Story[] = Array.from({ length: 30 }).map((_, i) => ({
      id: i + 1,
      username: "story_" + (i + 1),
      profilePic: `https://randomuser.me/api/portraits/men/${(i + 1) * 3 % 100}.jpg`,
      viewed: false,
    }));
    addStories(arr);
  };


  useEffect(() => {
    fetchPhotos();
    fetchStories();
  }, []);

  const handleLike = useCallback(
    (id: number) => {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
            : p
        )
      );
    },
    [setPhotos]
  );

  const handleSave = useCallback(
    (id: number) => {
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
      );
    },
    [setPhotos]
  );

  const handleComment = useCallback((id: number) => {
    Alert.alert("Comments", "Open comment section for photo " + id);
  }, []);

  const handleShare = useCallback((id: number) => {
    Alert.alert("Share", "Sharing photo " + id);
  }, []);

  const handleStoryPress = useCallback((id: number) => {
    setStories(prev =>
      prev.map(s => s.id === id ? { ...s, viewed: true } : s)
    );
    Alert.alert("Story", "Open story viewer for story " + id);
  }, [setStories]);


  const renderStory = useCallback(
    ({ item }: { item: Story }) => (
      <StoryItem story={item} onPress={handleStoryPress} theme={theme} />
    ),
    [handleStoryPress, theme]
  );

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
    // <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
    <GestureHandlerRootView>
      {/* Stories Section */}
      <View style={{ paddingVertical: 10 }}>
        {/* <FlatList
            data={stories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderStory}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          /> */}

        <FlatList
          data={stories}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderStory}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />

      </View>

      {/* Feed Section */}
      {/* <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          pagingEnabled
          snapToAlignment="start"
          decelerationRate="fast"
          onEndReached={fetchPhotos}
          onEndReachedThreshold={0.7}
          ListFooterComponent={
            loading ? <ActivityIndicator size="large" color={theme.text} /> : null
          }
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
        /> */}

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        pagingEnabled={false}
        snapToInterval={undefined}
        snapToAlignment={undefined}
        decelerationRate="fast"
        onEndReached={fetchPhotos}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="large" color={theme.text} /> 
            </View>
          ) : null
        }
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={11}
        removeClippedSubviews = {true}
      />

    </GestureHandlerRootView>
    // </SafeAreaView>
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

  storyContainer: {
    alignItems: "center",
    marginRight: 15,
    width: 70,
  },
  storyBorder: {
    borderWidth: 3,
    padding: 2,
    borderRadius: 40,
    marginBottom: 4,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyUsername: {
    fontSize: 12,
    textAlign: "center",
  },
});

export default HomePage;
