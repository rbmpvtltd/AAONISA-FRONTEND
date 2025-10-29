import { useAppTheme } from "@/src/constants/themeHelper";
import { useProfileStore } from "@/src/store/userProfileStore";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import {
    Dimensions,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const imageSize = width / 3;
const profilePicSize = width * 0.22;
const fontScale = width / 380;

const TopHeader: React.FC<{ userName: string; theme: any }> = ({ userName, theme }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.topHeader}>
            <Text style={[styles.topHeaderText, { color: theme.text }]}>{userName}</Text>

            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                <MaterialIcons name="menu" size={26} color={theme.text} />
            </TouchableOpacity>
        </View>
    );
};

const ProfileHeader: React.FC<{ theme: any }> = ({ theme }) => {
    const { profilePicture, likes, views, followersCount, followingsCount, postsCount, } = useProfileStore();
    const router = useRouter();

    return (
        <View style={styles.header}>
            <Image
                source={
                    profilePicture
                        ? { uri: profilePicture }
                        : theme.userImage
                }
                style={styles.profilePicture}
            />

            <View style={styles.stats}>
                <View style={styles.stat}>
                    <Text style={[styles.statNumber, { color: theme.text }]}>{postsCount}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtitle }]}>Posts</Text>
                </View>

                <TouchableOpacity
                    style={styles.stat}
                    onPress={() => router.push("/profile/followers")}
                >
                    <Text style={[styles.statNumber, { color: theme.text }]}>{followersCount}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtitle }]}>Followers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.stat}
                    onPress={() => router.push("/profile/followings")}
                >
                    <Text style={[styles.statNumber, { color: theme.text }]}>{followingsCount}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtitle }]}>Following</Text>
                </TouchableOpacity>


                <View style={{ flexDirection: "row" }}>
                    <View style={styles.likesViews}>
                        <Text style={[styles.statLabel, { color: theme.subtitle }]}>Likes</Text>
                        <Text style={[styles.statNumber, { color: theme.text }]}>{likes}</Text>
                    </View>
                    <View style={styles.likesViews}>
                        <Text style={[styles.statLabel, { color: theme.subtitle }]}>Views</Text>
                        <Text style={[styles.statNumber, { color: theme.text }]}>{views}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const UserInfo: React.FC<{ theme: any }> = ({ theme }) => {
    const { name, bio, url, isFollowing, toggleFollow } = useProfileStore();

    const openUrl = () => {
        if (url) {
            const link = url.startsWith("http") ? url : `https://${url}`;
            Linking.openURL(link).catch(() => console.log("Failed to open URL"));;
        }
    };
    return (
        <View style={styles.userInfo}>
            <Text style={[styles.username, { color: theme.text }]}>{name || "Your Name"}</Text>
            <Text style={[styles.bio, { color: theme.subtitle }]}>{bio || "Your bio..."}</Text>
            {url ? (
                <Text
                    style={[styles.website, { color: "#3498db" }]}
                    onPress={openUrl}
                >
                    {url}
                </Text>
            ) : null}

            {/* <TouchableOpacity onPress={toggleFollow}>
                <Text
                    style={[
                        styles.followButton,
                        {
                            backgroundColor: theme.buttonBg,
                            color: "#fff",
                        },
                    ]}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </Text>
            </TouchableOpacity> */}
        </View>
    );
};

const Tabs: React.FC<{ theme: any }> = ({ theme }) => (
    <View style={[styles.tabs, { backgroundColor: theme.background }]}>
        <TouchableOpacity style={styles.tab}>
            <MaterialCommunityIcons name="view-grid-outline" size={22} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
            <Ionicons name="play-circle-outline" size={22} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
            <Ionicons name="person-circle-outline" size={22} color={theme.text} />
        </TouchableOpacity>
    </View>
);

const VideoItem = ({ videoUrl,id }: { videoUrl: string, id : string }) => {
    const router = useRouter();
    const player = useVideoPlayer(videoUrl, (player) => {
        player.loop = true;
        player.muted = true;  
        player.pause();
    });

    return (
           <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: "/(drawer)/(tabs)/profile/userReelsFeed",
                params : {id}
})} //  ID send ho rahi hai
            
        >
        <View style={styles.videoContainer}>
            <VideoView
                style={styles.postVideo}
                player={player}
                allowsFullscreen={false}
                allowsPictureInPicture={false}
                contentFit="cover"
                nativeControls={false}
            />
        </View>
        </TouchableOpacity>
    );
};

const PostGrid: React.FC = () => {
    const { videos } = useProfileStore();

    if (!videos || videos.length === 0) {
        return (
            <View style={{ alignItems: "center", marginTop: 50 }}>
                <Text>No videos uploaded yet.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={videos}
            keyExtractor={(item: any) => item.uuid}
            numColumns={3}
            renderItem={({ item }) => {
                if (item.videoUrl) {
                    return ( <VideoItem videoUrl={item.videoUrl} id = {item.id} />);
                }

                // fallback for image
                return (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.postImage}
                    />
                );
            }}
            showsVerticalScrollIndicator={false}
        />
    );
};


const ProfileScreen: React.FC = () => {
    const theme = useAppTheme();
    const { username } = useProfileStore();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <TopHeader userName={username || "Username"} theme={theme} />
            <ProfileHeader theme={theme} />
            <UserInfo theme={theme} />
            <Tabs theme={theme} />
            <PostGrid />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    topHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.015,
    },
    topHeaderText: {
        fontSize: 18 * fontScale,
        fontWeight: "bold",
    },
    header: {
        flexDirection: "row",
        padding: width * 0.04,
        alignItems: "center",
    },
    website: {
        fontSize: 14 * fontScale,
        marginTop: 5,
        textDecorationLine: "underline",
    },
    profilePicture: {
        width: profilePicSize,
        height: profilePicSize,
        borderRadius: profilePicSize / 2,
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        marginLeft: width * 0.05,
        flexWrap: "wrap",
    },
    stat: {
        alignItems: "center",
        marginHorizontal: width * 0.02,
    },
    likesViews: {
        alignItems: "center",
        flexDirection: "row",
        marginHorizontal: width * 0.02,
        marginTop: height * 0.01,
        gap: width * 0.02,
    },
    followButton: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: height * 0.01,
        gap: width * 0.02,
        backgroundColor: "#3498db",
        borderRadius: 5,
        padding: 10,
        textAlign: "center",
        fontSize: 16
    },
    statNumber: {
        fontSize: 16 * fontScale,
        fontWeight: "bold",
    },
    statLabel: {
        fontSize: 13 * fontScale,
    },
    userInfo: {
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.01,
    },
    username: {
        fontSize: 16 * fontScale,
        fontWeight: "bold",
    },
    bio: {
        fontSize: 13 * fontScale,
        marginTop: 5,
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: height * 0.012,
    },
    tab: {
        padding: width * 0.01,
    },
    videoContainer: {
        width: width / 3 - 3, 
        height: height * 0.32, 
        margin: 1.5,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#000",
    },
    postVideo: {
        width: "100%",
        height: "100%",
    },
    postImage: {
        width: width / 3 - 3,
        height: width / 3 - 3,
        margin: 1.5,
        resizeMode: "cover",
    },

});

export default ProfileScreen;
