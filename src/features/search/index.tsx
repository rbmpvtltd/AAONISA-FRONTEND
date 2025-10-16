import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const itemSize = width / 3;

// Local video assets
const videos = [
    { id: "1", source: require("@/assets/video/videoplayback9.mp4") },
    { id: "2", source: require("@/assets/video/videoplayback10.mp4") },
    { id: "3", source: require("@/assets/video/videoplayback11.mp4") },
    { id: "4", source: require("@/assets/video/videoplayback12.mp4") },
    { id: "5", source: require("@/assets/video/videoplayback13.mp4") },
    { id: "6", source: require("@/assets/video/videoplayback9.mp4") },
];

const ExploreScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <FlatList
                data={videos}
                numColumns={3}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ExploreItem item={item} router={router} />}
            />
        </View>
    );
};

export default ExploreScreen;

// 🎬 Small video preview component
const ExploreItem = ({ item, router }: any) => {
    const player = useVideoPlayer(item.source, (player) => {
        player.loop = true;
        player.muted = true;
        player.play();
    });

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
                router.push({
                    pathname: "/reels/[id]",
                    params: { id: item.id },
                })
            }
        >
            <VideoView
                style={{ width: itemSize, height: itemSize }}
                player={player}
                allowsFullscreen={false}
                allowsPictureInPicture={false}
                nativeControls={false}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
});
