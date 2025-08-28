// import React, { useCallback, useEffect, useState } from "react";
// import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native";

// const { height } = Dimensions.get("window");
// const ITEM_HEIGHT = height * 0.8;

// interface Photo {
//     id: number;
//     title: string;
//     url: string;
// }

// const PhotoItem = React.memo(({ item }: { item: Photo }) => (
//     <View style={styles.reel}>
//         <Image
//             source={{
//                 uri: "https://media.istockphoto.com/id/1177546746/photo/millennial-dissatisfied-serious-bearded-man-in-eyeglasses-squeezing-lips.jpg?s=612x612&w=0&k=20&c=gGQYBmqwiVoOTJWPdEC8bbv3R_M5lkl9Rs8a3zEhTQs=",
//             }}
//             style={styles.image}
//         />
//         <Text>likes</Text>
//         <Text style={styles.title}>{item.title}</Text>
//     </View>
// ));

// const HomePage: React.FC = () => {
//     const [photos, setPhotos] = useState<Photo[]>([]);
//     const [page, setPage] = useState(0);
//     const [loading, setLoading] = useState(false);

//     const fetchPhotos = async () => {
//         if (loading || photos.length >= 100) return;
//         setLoading(true);
//         try {
//             const res = await fetch(
//                 `https://jsonplaceholder.typicode.com/photos?_start=${page}&_limit=10`
//             );
//             const data = await res.json();
//             setPhotos((prev) => [...prev, ...data]);
//             setPage((prev) => prev + 10);
//         } catch (err) {
//             console.error("Error fetching photos ===> ", err);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchPhotos();
//     }, []);


//     const renderItem = useCallback(({ item }: { item: Photo }) => {
//         return <PhotoItem item={item} />;
//     }, []);

//     return (
//         <FlatList
//             data={photos}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderItem}
//             pagingEnabled
//             snapToAlignment="start"
//             decelerationRate="fast"
//             onEndReached={fetchPhotos}
//             onEndReachedThreshold={0.7}
//             ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}

//             initialNumToRender={5}
//             maxToRenderPerBatch={5}
//             windowSize={5}
//             removeClippedSubviews={true}
//             getItemLayout={(_, index) => ({
//                 length: ITEM_HEIGHT,
//                 offset: ITEM_HEIGHT * index,
//                 index,
//             })}
//         />
//     );
// };

// const styles = StyleSheet.create({
//     reel: {
//         height: ITEM_HEIGHT,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#000",
//     },
//     image: {
//         width: "100%",
//         height: "80%",
//         resizeMode: "cover",
//     },
//     title: {
//         color: "#fff",
//         padding: 10,
//         fontSize: 16,
//         textAlign: "center",
//     },
// });

// export default HomePage;


// import React, { useCallback, useEffect, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     Dimensions,
//     FlatList,
//     Image,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import Icon from 'react-native-vector-icons/Ionicons';
// const { height } = Dimensions.get("window");
// const ITEM_HEIGHT = height * 0.8;

// interface Photo {
//     id: number;
//     title: string;
//     url: string;
//     likes: number;
//     liked: boolean;
//     saved: boolean;
//     comments: string[];
// }

// const PhotoItem = React.memo(
//     ({ item, onLike, onSave, onComment, onShare }: any) => (
//         <View style={styles.reel}>
//             <View style={{ backgroundColor: "black", height: "10%", width: "100%", position: "absolute", alignItems: "center", justifyContent: "center" }} >
//                 <Image source={{ uri: "https://media.istockphoto.com/id/1177546746/photo/millennial-dissatisfied-serious-bearded-man-in-eyeglasses-squeezing-lips.jpg?s=612x612&w=0&k=20&c=gGQYBmqwiVoOTJWPdEC8bbv3R_M5lkl9Rs8a3zEhTQs=" }} style={{ width: 40, height: 40, position: "absolute", top: 10, left: 10, zIndex: 100, borderColor: "black", borderWidth: 2, borderRadius: 50, overflow: "hidden" }} />
//                 <Text style={{ color: "white", paddingLeft: 20, fontSize: 16, position: "absolute", zIndex: 100, left: 40, alignItems: "center", justifyContent: "center" }}>id Name</Text>
//             </View>
//             <Image source={{ uri: "https://media.istockphoto.com/id/1177546746/photo/millennial-dissatisfied-serious-bearded-man-in-eyeglasses-squeezing-lips.jpg?s=612x612&w=0&k=20&c=gGQYBmqwiVoOTJWPdEC8bbv3R_M5lkl9Rs8a3zEhTQs=" }} style={styles.image} />
//             <View style={styles.actionsRow}>
//                 <TouchableOpacity onPress={() => onLike(item.id)}>
//                     <Icon name={item.liked ? "heart" : "heart-outline"} size={27} color={item.liked ? "red" : "black"} />
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => onComment(item.id)}>
//                     <Icon name="chatbubble-outline" size={25} color="black" />
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => onShare(item.id)}>
//                     <Icon name="share-social-outline" size={25} color="black" />
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => onSave(item.id)} style={{ marginLeft: "auto" }}>
//                     <Icon name={item.saved ? "bookmark" : "bookmark-outline"} size={25} color="black" />
//                 </TouchableOpacity>
//             </View>

//             <Text style={styles.title}>{item.title}</Text>
//         </View >
//     )
// );

// const HomePage: React.FC = () => {
//     const [photos, setPhotos] = useState<Photo[]>([]);
//     const [page, setPage] = useState(0);
//     const [loading, setLoading] = useState(false);

//     const fetchPhotos = async () => {
//         if (loading || photos.length >= 100) return;
//         setLoading(true);
//         try {
//             const res = await fetch(
//                 `https://jsonplaceholder.typicode.com/photos?_start=${page}&_limit=10`
//             );
//             const data = await res.json();

//             const updated = data.map((d: any) => ({
//                 ...d,
//                 likes: Math.floor(Math.random() * 100),
//                 liked: false,
//                 saved: false,
//                 comments: [],
//             }));

//             setPhotos((prev) => [...prev, ...updated]);
//             setPage((prev) => prev + 10);
//         } catch (err) {
//             console.error("Error fetching photos ===> ", err);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchPhotos();
//     }, []);

//     const handleLike = useCallback((id: number) => {
//         setPhotos((prev) =>
//             prev.map((p) =>
//                 p.id === id
//                     ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
//                     : p
//             )
//         );
//     }, []);

//     const handleSave = useCallback((id: number) => {
//         setPhotos((prev) =>
//             prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
//         );
//     }, []);

//     const handleComment = useCallback((id: number) => {
//         Alert.alert("Comments", "Open comment section for photo " + id);
//     }, []);

//     const handleShare = useCallback((id: number) => {
//         Alert.alert("Share", "Sharing photo " + id);
//     }, []);

//     const renderItem = useCallback(
//         ({ item }: { item: Photo }) => (
//             <PhotoItem
//                 item={item}
//                 onLike={handleLike}
//                 onSave={handleSave}
//                 onComment={handleComment}
//                 onShare={handleShare}
//             />
//         ),
//         [handleLike, handleSave, handleComment, handleShare]
//     );

//     return (
//         <FlatList
//             data={photos}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderItem}
//             pagingEnabled
//             snapToAlignment="start"
//             decelerationRate="fast"
//             onEndReached={fetchPhotos}
//             onEndReachedThreshold={0.7}
//             ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
//             initialNumToRender={5}
//             maxToRenderPerBatch={5}
//             windowSize={5}
//             removeClippedSubviews={true}
//             getItemLayout={(_, index) => ({
//                 length: ITEM_HEIGHT,
//                 offset: ITEM_HEIGHT * index,
//                 index,
//             })}
//         />
//     );
// };

// const styles = StyleSheet.create({
//     reel: {
//         height: ITEM_HEIGHT,
//         justifyContent: "flex-start",
//         // alignItems: "center",
//         backgroundColor: "#fff",
//         position: "relative",
//     },
//     image: {
//         width: "100%",
//         height: "80%",
//         resizeMode: "cover",
//     },
//     title: {
//         color: "#000",
//         padding: 10,
//         fontSize: 16,
//         // textAlign: "center",
//     },
//     actionsRow: {
//         flexDirection: "row",
//         width: "100%",
//         gap: 10,
//         paddingHorizontal: 20,
//         paddingVertical: 8,
//         alignItems: "center",
//     },
//     icon: {
//         fontSize: 20,
//         marginLeft: 15,
//         color: "#fff",
//     },
// });

// export default HomePage;


import React, { useCallback, useEffect, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
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

// ✅ Pure UI Component (Only presentation, no state)
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
        </View>
    )
);

const HomePage: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    // ✅ API Fetcher
    const fetchPhotos = async () => {
        if (loading || photos.length >= 100) return;
        setLoading(true);

        try {
            const res = await fetch(
                `https://jsonplaceholder.typicode.com/photos?_start=${page}&_limit=10`
            );
            const data = await res.json();

            // ✅ Normalize API response (future-proof for backend integration)
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

    // ✅ Handlers
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
        <SafeAreaView style={{ flex: 1 }}>
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
        </SafeAreaView>

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
