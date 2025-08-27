// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";

// type Photo = {
//     albumId: number;
//     id: number;
//     title: string;
//     url: string;
//     thumbnailUrl: string;
// };

// const HomePage: React.FC = () => {
//     const [photos, setPhotos] = useState<Photo[]>([]);
//     const [page, setPage] = useState<number>(1);
//     const [loading, setLoading] = useState<boolean>(false);

//     const fetchPhotos = async () => {
//         if (loading) return;
//         if (photos.length >= 100) return;

//         setLoading(true);
//         try {
//             const res = await fetch(
//                 `https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${page}`
//             );
//             const data: Photo[] = await res.json();

//             setPhotos(prev => [...prev, ...data]);
//             setPage(prev => prev + 1);
//         } catch (error) {
//             console.error("Error fetching photos:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPhotos();
//     }, []);

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 data={photos}
//                 keyExtractor={item => item.id.toString()}
//                 renderItem={({ item }) => {
//                     console.log("==================>", item?.url)
//                     return (
//                         <View style={styles.card}>
//                             <Text>{item?.id}</Text>
//                             <Image
//                                 source={{ uri: "https://media.istockphoto.com/id/1177546746/photo/millennial-dissatisfied-serious-bearded-man-in-eyeglasses-squeezing-lips.jpg?s=612x612&w=0&k=20&c=gGQYBmqwiVoOTJWPdEC8bbv3R_M5lkl9Rs8a3zEhTQs=" }}
//                                 style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: "#ddd", margin: 10 }}
//                                 resizeMode="cover"
//                             />
//                             <Text style={styles.title}>
//                                 {item.title}
//                             </Text>
//                         </View>
//                     )
//                 }}
//                 onEndReached={fetchPhotos}
//                 onEndReachedThreshold={0.5}
//                 ListFooterComponent={
//                     loading ? <ActivityIndicator size="large" color="blue" /> : null
//                 }
//             />
//         </View>

//     );
// };

// export default HomePage;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#f8f8f8",
//         paddingHorizontal: 10,
//         paddingTop: 10,
//     },
//     card: {
//         backgroundColor: "#fff",
//         marginVertical: 8,
//         padding: 10,
//         borderRadius: 8,
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     // image: {
//     //     width: 100,
//     //     height: 100,
//     //     borderRadius: 4,
//     //     marginRight: 10,
//     // },
//     title: {
//         flex: 1,
//         fontSize: 16,
//         color: "#333",
//     },
// });

import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native";

const { height } = Dimensions.get("window");

interface Photo {
    id: number;
    title: string;
    url: string;
}

const HomePage: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchPhotos = async () => {
        if (loading || photos.length >= 100) return;
        setLoading(true);
        try {
            const res = await fetch(
                `https://jsonplaceholder.typicode.com/photos?_start=${page}&_limit=10`
            );
            const data = await res.json();
            setPhotos((prev) => [...prev, ...data]);
            setPage(page + 10);

        } catch (err) {
            console.error("Error fetching photos ===> ", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const renderItem = ({ item }: { item: Photo }) => (
        <View style={styles.reel}>
            <Image source={{ uri: "https://media.istockphoto.com/id/1177546746/photo/millennial-dissatisfied-serious-bearded-man-in-eyeglasses-squeezing-lips.jpg?s=612x612&w=0&k=20&c=gGQYBmqwiVoOTJWPdEC8bbv3R_M5lkl9Rs8a3zEhTQs=" }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
        </View>
    );

    return (
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
        />
    );
};

const styles = StyleSheet.create({
    reel: {
        height: height * 0.8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    image: {
        width: "100%",
        height: "80%",
        resizeMode: "cover",
    },
    title: {
        color: "#fff",
        padding: 10,
        fontSize: 16,
        textAlign: "center",
    },
});

export default HomePage;




