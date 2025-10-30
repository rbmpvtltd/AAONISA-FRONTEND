import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export const FeedItem = React.memo(
    ({
        item,
        isActive,
        isFocused,
        onLike,
        onSave,
        onComment,
        onShare,
        theme,
        isMuted,
        toggleMute,
    }: any) => {
        //  Player setup (controls hidden)
        const player = useVideoPlayer(item.imageUrl, (p) => {
            p.loop = true;
            p.volume = isMuted ? 0 : 1;
            // p.showControls = false; // hide fullscreen/seek controls
        });

        //  Play/pause logic
        useEffect(() => {
            if (isActive && isFocused) player.play();
            else player.pause();
        }, [isActive, isFocused]);

        // Mute/unmute
        useEffect(() => {
            player.volume = isMuted ? 0 : 1;
        }, [isMuted]);

        return (
            <View style={[styles.reel, { backgroundColor: theme.background }]}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: theme.overlay }]}>
                    <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
                    <View style={styles.userInfo}>
                        <Text style={[styles.username, { color: "#fff" }]}>{item.username}</Text>
                        <Text style={{ color: "#fff", fontSize: 10 }}>{item.title.slice(0, 30)}</Text>
                    </View>
                </View>

                {/* Video */}
                <View style={{ width: "100%", height: "80%" }}>
                    <VideoView
                        style={{ width: "100%", height: "100%" }}
                        player={player}
                        contentFit="cover"
                        nativeControls={true} //  disable default player UI
                    />
                    <TouchableOpacity onPress={toggleMute} style={styles.volumeBtn}>
                        <Icon name={isMuted ? "volume-mute" : "volume-high"} size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Bottom actions */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={() => onLike(item.id)} style={styles.actionBtn}>
                        <Icon
                            name={item.liked ? "heart" : "heart-outline"}
                            size={29}
                            color={item.liked ? "red" : theme.text}
                        />
                        <Text style={[styles.countText, { color: theme.text }]}>{item.likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onComment(item.id)} style={styles.actionBtn}>
                        <Icon name="chatbubble-outline" size={25} color={theme.text} />
                        <Text style={[styles.countText, { color: theme.text }]}>{item.comments ?? 0}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onShare(item.id)} style={styles.actionBtn}>
                        <Icon name="share-social-outline" size={25} color={theme.text} />
                        <Text style={[styles.countText, { color: theme.text }]}>{item.shares ?? 0}</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity onPress={() => onSave(item.id)} style={{ marginLeft: "auto" }}>
                        <Icon
                            name={item.saved ? "bookmark" : "bookmark-outline"}
                            size={25}
                            color={theme.text}
                        />
                    </TouchableOpacity> */}
                </View>

                <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
            </View>
        );
    }
);

const styles = StyleSheet.create({
    reel: { height: 700 },
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
    profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    userInfo: { flex: 1 },
    username: { fontSize: 16, fontWeight: "600" },
    title: { padding: 10, fontSize: 16 },
    actionsRow: {
        flexDirection: "row",
        gap: 15,
        paddingHorizontal: 20,
        paddingVertical: 8,
        alignItems: "center",
    },
    actionBtn: {
        flexDirection: "row", 
        alignItems: "center",
        gap: 5, 
    },
    countText: {
        fontSize: 14,
        fontWeight: "500",
    },
    volumeBtn: {
        position: "absolute",
        bottom: 60,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.3)",
        padding: 5,
        borderRadius: 20,
    },
});
