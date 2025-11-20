import { useAppTheme } from "@/src/constants/themeHelper";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { followUser, GetCurrentUser, GetProfileUsername, UnfollowUser } from "../../../src/api/profile-api";

const { width, height } = Dimensions.get("window");
const imageSize = width / 3;
const profilePicSize = width * 0.22;
const fontScale = width / 380;

export const TopHeader: React.FC<{ userName: string; theme: any; isOwnProfile: boolean }> = ({ userName, theme, isOwnProfile }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.topHeader}>
            <Text style={[styles.topHeaderText, { color: theme.text }]}>{userName}</Text>

            {isOwnProfile && (
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <MaterialIcons name="menu" size={26} color={theme.text} />
                </TouchableOpacity>
            )}
        </View>
    );
};


export const ProfileHeader: React.FC<{ theme: any; profile: any }> = ({ theme, profile }) => {
    if (!profile?.userProfile) return null;

    const router = useRouter();
    const user = profile.username;
    console.log("username resive here", user);

    // backend data destructuring
    const profilePicture = profile.userProfile.ProfilePicture || null;
    console.log("new profilePicture", profilePicture);

    const followersCount = profile.followers?.length || 0;
    const followingsCount = profile.followings?.length || 0;

    // if your backend doesn’t send posts/likes/views yet
    const postsCount = profile.videos?.length || 0;
    console.log("video", postsCount);


    const likes = profile.likes || 0;
    const views = profile.views || 0;

    return (
        <View style={styles.header}>
            <Image
                source={{
                    uri: profilePicture
                        ? profilePicture
                        : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                }}
                style={styles.profilePicture}
            />



            <View style={styles.stats}>
                <View style={styles.stat}>
                    <Text style={[styles.statNumber, { color: theme.text }]}>{postsCount}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtitle }]}>Posts</Text>
                </View>

                <TouchableOpacity
                    style={styles.stat}
                    // onPress={() => router.push( `/profile/followers`)}
                    onPress={() => router.push(`/profile/${profile.username}/followers`)}
                >
                    <Text style={[styles.statNumber, { color: theme.text }]}>{followersCount}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtitle }]}>Followers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.stat}
                    onPress={() => router.push(`/profile/${profile.username}/followings`)}
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


export const UserInfo: React.FC<{
    theme: any;
    profile: any;
    isFollowing: boolean;
    isOwnProfile: boolean;
    onFollowToggle: () => void;
}> = ({ theme, profile, isFollowing, isOwnProfile, onFollowToggle }) => {
    if (!profile) return null;

    const user = profile.userProfile;
    console.log("user is here", user);

    const openUrl = () => {
        if (user?.url) {
            const link = user.url.startsWith("http") ? user.url : `https://${user.url}`;
            Linking.openURL(link).catch(() => console.log("Failed to open URL"));
        }
    };

    return (
        <View style={styles.userInfo}>
            <Text style={[styles.username, { color: theme.text }]}>
                {user?.name || "Your Name"}
            </Text>
            <Text style={[styles.bio, { color: theme.subtitle }]}>
                {user?.bio || "Your bio..."}
            </Text>

            {user?.url ? (
                <Text style={[styles.website, { color: "#3498db" }]} onPress={openUrl}>
                    {user.url}
                </Text>
            ) : null}

            {/* 🔹 Follow / Unfollow Button */}
            {/* {!isOwnProfile && (
                <TouchableOpacity onPress={onFollowToggle} style={[styles.followButton, { backgroundColor: isFollowing ? theme.buttonBg : theme.buttonBg }]}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                        {isFollowing ? "Following" : "Follow"}
                    </Text>
                </TouchableOpacity>
            )} */}

            {!isOwnProfile && (
                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>

                    {/* Follow Button */}
                    <TouchableOpacity
                        onPress={onFollowToggle}
                        style={[styles.followButton, { flex: 1 }]}
                    >
                        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
                            {isFollowing ? "Following" : "Follow"}
                        </Text>
                    </TouchableOpacity>

                    {/* Message Button */}
                    <TouchableOpacity
                        onPress={() => router.push(`/chat/${profile.id}`)}
                        style={[styles.messageButton, {
                            flex: 1,
                            backgroundColor: theme.searchBg,

                        }]}
                    >
                        <Text style={{ color: theme.text, fontWeight: "600", textAlign: "center" }}>
                            Message
                        </Text>
                    </TouchableOpacity>

                </View>
            )}
        </View>
    );
};


export const Tabs: React.FC<{ theme: any }> = ({ theme }) => (
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

type VideoItemProps = {
    videoUrl?: string;
    image?: string;
    id: string;
    username: string;
    index: number;
    onPressItem: (index: number) => void;
};
export const VideoItem: React.FC<VideoItemProps> = ({
    videoUrl,
    image,
    id,
    username,
    index,
    onPressItem,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const player = videoUrl
        ? useVideoPlayer(videoUrl, (p) => {
            p.loop = true;
            p.muted = true;
            p.pause();
        })
        : null;

    useEffect(() => {
        if (player) {
            player.pause();
            player.currentTime = 0;
        }
    }, [player]);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPressItem(index)}
        >
            <View style={styles.videoContainer}>
                {videoUrl && player ? (
                    <VideoView
                        style={styles.postVideo}
                        player={player}
                        allowsFullscreen={false}
                        allowsPictureInPicture={false}
                        contentFit="cover"
                        nativeControls={false}
                    />
                ) : image ? (
                    <Image source={{ uri: image }} style={styles.postImage} />
                ) : null}
            </View>
        </TouchableOpacity>
    );
};

export const PostGrid: React.FC<{ videos: any[]; username: string }> = ({ videos, username }) => {
    const router = useRouter();
    const handlePressVideo = (index: number) => {
        const video = videos[index];
        if (!video) return;

        router.push(`/p/${username}/${video.uuid}`);
    };

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
            renderItem={({ item, index }) =>
                item.videoUrl ? (
                    <VideoItem
                        videoUrl={item.videoUrl}
                        id={item.uuid}
                        username={username}
                        index={index}
                        onPressItem={handlePressVideo}
                    />
                ) : (
                    <Image source={{ uri: item.image }} style={styles.postImage} />
                )
            }
            showsVerticalScrollIndicator={false}
        />
    );
};




export const ProfileScreen: React.FC = () => {
    const theme = useAppTheme();
    const queryClient = useQueryClient();
    const { username } = useLocalSearchParams<{ username?: string }>();
    const [isFollowing, setIsFollowing] = useState(false);

    // Fetch current user
    const {
        data: currentUser,
        isLoading: currentUserLoading,
        isError: currentUserError,
    } = useQuery({
        queryKey: ["currentUser"],
        queryFn: GetCurrentUser,
    });

    // Fetch profile data for username
    const {
        data: profile,
        isLoading: profileLoading,
        isError: profileError,
    } = useQuery({
        queryKey: ["userProfile", username],
        queryFn: () => GetProfileUsername(username || ""),
        enabled: !!username,
    });

    // Check initial following status
    useEffect(() => {
        if (profile?.followers && currentUser?.id) {
            const alreadyFollowing = profile.followers.some(
                (follower: any) => follower.id === currentUser.id
            );
            setIsFollowing(alreadyFollowing);
        }
    }, [profile?.followers, currentUser?.id]);

    // Follow mutation
    //   const followMutation = useMutation({
    //     mutationFn: (id: string) => followUser(id),
    //     onMutate: () => setIsFollowing(true),
    //     onError: () => setIsFollowing(false),
    //     onSuccess: async () => {
    //       await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
    //       await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    //     },
    //   });

    //   // Unfollow mutation
    //   const unfollowMutation = useMutation({
    //     mutationFn: (id: string) => UnfollowUser(id),
    //     onMutate: () => setIsFollowing(false),
    //     onError: () => setIsFollowing(true),
    //     onSuccess: async () => {

    //     },
    //   });

    const followMutation = useMutation({
        mutationFn: (id: string) => followUser(id),
        onMutate: () => setIsFollowing(true),
        onError: () => setIsFollowing(false),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
            await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            await queryClient.invalidateQueries({ queryKey: ["userProfile", currentUser?.username] }); // ← YE ADD KIYA
        },
    });

    const unfollowMutation = useMutation({
        mutationFn: (id: string) => UnfollowUser(id),
        onMutate: () => setIsFollowing(false),
        onError: () => setIsFollowing(true),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
            await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            await queryClient.invalidateQueries({ queryKey: ["userProfile", currentUser?.username] }); // ← YE BHI
        },
    });
    // Handle follow toggle
    const handleFollowToggle = () => {
        if (!profile?.id) return;
        if (isFollowing) {
            unfollowMutation.mutate(profile.id);
        } else {
            followMutation.mutate(profile.id);
        }
    };

    // Loader
    if (currentUserLoading || profileLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={theme.text} />
            </View>
        );
    }



    // Determine if viewing own profile
    const isOwnProfile =
        currentUser?.username === profile?.username ||
        currentUser?.id === profile?.id;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <TopHeader
                userName={username || "Username"}
                theme={theme}
                isOwnProfile={isOwnProfile}
            />
            <ProfileHeader theme={theme} profile={profile} />

            {/* <ProfileHeader theme={theme} profile={profile} /> */}
            <UserInfo
                theme={theme}
                profile={profile}
                isOwnProfile={isOwnProfile}
                onFollowToggle={handleFollowToggle}
                isFollowing={isFollowing}
            />
            <Tabs theme={theme} />
            <PostGrid videos={profile?.videos || []} username={profile?.username} />
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
        // gap: width * 0.02,
        backgroundColor: "#3498db",
        borderRadius: 5,
        padding: 10,
        textAlign: "center",
        fontSize: 16
    },
    messageButton: {
        marginTop: height * 0.01,
        borderRadius: 5,
        paddingVertical: 10,
        justifyContent: "center",
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
