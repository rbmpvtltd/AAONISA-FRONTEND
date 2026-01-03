// import { useAppTheme } from "@/src/constants/themeHelper";
// import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// import { DrawerActions } from "@react-navigation/native";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { router, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
// import { useVideoPlayer, VideoView } from "expo-video";
// import { useEffect, useState } from "react";
// import {
//     ActivityIndicator,
//     Dimensions,
//     FlatList,
//     Image,
//     Linking,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { followUser, GetCurrentUser, GetProfileUsername, UnfollowUser } from "../../../src/api/profile-api";

// const { width, height } = Dimensions.get("window");
// const imageSize = width / 3;
// const profilePicSize = width * 0.22;
// const fontScale = width / 380;

// export const TopHeader: React.FC<{ userName: string; theme: any; isOwnProfile: boolean }> = ({ userName, theme, isOwnProfile }) => {
//     const navigation = useNavigation();

//     return (
//         <View style={styles.topHeader}>
//             <Text style={[styles.topHeaderText, { color: theme.text }]}>{userName}</Text>

//             {isOwnProfile && (
//                 <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
//                     <MaterialIcons name="menu" size={26} color={theme.text} />
//                 </TouchableOpacity>
//             )}
//         </View>
//     );
// };

// export const ProfileHeader: React.FC<{ theme: any; profile: any }> = ({ theme, profile }) => {
//     if (!profile?.userProfile) return null;

//     const router = useRouter();
//     const user = profile.username;
//     console.log("username resive here", user);

//     // backend data destructuring
//     const profilePicture = profile.userProfile.ProfilePicture || null;
//     console.log("new profilePicture", profilePicture);

//     const followersCount = profile.followers?.length || 0;
//     const followingsCount = profile.followings?.length || 0;

//     // if your backend doesn’t send posts/likes/views yet
//     const postsCount = profile.videos?.length || 0;
//     console.log("video", postsCount);


//     const likes = profile.likes || 0;
//     const views = profile.views || 0;

//     return (
//         <View style={styles.header}>
//             <Image
//                 source={{
//                     uri: profilePicture
//                         ? profilePicture
//                         : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
//                 }}
//                 style={styles.profilePicture}
//             />



//             <View style={styles.stats}>
//                 <View style={styles.stat}>
//                     <Text style={[styles.statNumber, { color: theme.text }]}>{postsCount}</Text>
//                     <Text style={[styles.statLabel, { color: theme.subtitle }]}>Posts</Text>
//                 </View>

//                 <TouchableOpacity
//                     style={styles.stat}
//                     // onPress={() => router.push( `/profile/followers`)}
//                     onPress={() => router.push(`/profile/${profile.username}/followers`)}
//                 >
//                     <Text style={[styles.statNumber, { color: theme.text }]}>{followersCount}</Text>
//                     <Text style={[styles.statLabel, { color: theme.subtitle }]}>Followers</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={styles.stat}
//                     onPress={() => router.push(`/profile/${profile.username}/followings`)}
//                 >
//                     <Text style={[styles.statNumber, { color: theme.text }]}>{followingsCount}</Text>
//                     <Text style={[styles.statLabel, { color: theme.subtitle }]}>Following</Text>
//                 </TouchableOpacity>

//                 <View style={{ flexDirection: "row" }}>
//                     <View style={styles.likesViews}>
//                         <Text style={[styles.statLabel, { color: theme.subtitle }]}>Likes</Text>
//                         <Text style={[styles.statNumber, { color: theme.text }]}>{likes}</Text>
//                     </View>
//                     <View style={styles.likesViews}>
//                         <Text style={[styles.statLabel, { color: theme.subtitle }]}>Views</Text>
//                         <Text style={[styles.statNumber, { color: theme.text }]}>{views}</Text>
//                     </View>
//                 </View>
//             </View>
//         </View>
//     );
// };


// export const UserInfo: React.FC<{
//     theme: any;
//     profile: any;
//     isFollowing: boolean;
//     isOwnProfile: boolean;
//     onFollowToggle: () => void;
// }> = ({ theme, profile, isFollowing, isOwnProfile, onFollowToggle }) => {
//     if (!profile) return null;

//     const user = profile.userProfile;
//     console.log("user is here", user);

//     const openUrl = () => {
//         if (user?.url) {
//             const link = user.url.startsWith("http") ? user.url : `https://${user.url}`;
//             Linking.openURL(link).catch(() => console.log("Failed to open URL"));
//         }
//     };
// console.log("iiiiiiiiiiiiiiiiiii", profile.id);

//     return (
//         <View style={styles.userInfo}>
//             <Text style={[styles.username, { color: theme.text }]}>
//                 {user?.name || "Your Name"}
//             </Text>
//             <Text style={[styles.bio, { color: theme.subtitle }]}>
//                 {user?.bio || "Your bio..."}
//             </Text>

//             {user?.url ? (
//                 <Text style={[styles.website, { color: "#3498db" }]} onPress={openUrl}>
//                     {user.url}
//                 </Text>
//             ) : null}

//             {/* 🔹 Follow / Unfollow Button */}
//             {/* {!isOwnProfile && (
//                 <TouchableOpacity onPress={onFollowToggle} style={[styles.followButton, { backgroundColor: isFollowing ? theme.buttonBg : theme.buttonBg }]}>
//                     <Text style={{ color: "#fff", fontWeight: "600" }}>
//                         {isFollowing ? "Following" : "Follow"}
//                     </Text>
//                 </TouchableOpacity>
//             )} */}

//             {!isOwnProfile && (
//                 <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>

//                     {/* Follow Button */}
//                     <TouchableOpacity
//                         onPress={onFollowToggle}
//                         style={[styles.followButton, { flex: 1 }]}
//                     >
//                         <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
//                             {isFollowing ? "Following" : "Follow"}
//                         </Text>
//                     </TouchableOpacity>

//                     {/* Message Button */}
//                     <TouchableOpacity
//                         // onPress={() => router.push(`/chat/${profile.id}`)}
//                           onPress={() => router.push({
//                             pathname: "/chat/[id]",
//                             params: {
//                                 id: profile.id,
//                             }
//                         })}
//                         style={[styles.messageButton, {
//                             flex: 1,
//                             backgroundColor: theme.searchBg,

//                         }]}
//                     >
//                         <Text style={{ color: theme.text, fontWeight: "600", textAlign: "center" }}>
//                             Message
//                         </Text>
//                     </TouchableOpacity>

//                 </View>
//             )}
//         </View>
//     );
// };


// export const Tabs: React.FC<{ theme: any }> = ({ theme }) => (
//     <View style={[styles.tabs, { backgroundColor: theme.background }]}>
//         <TouchableOpacity style={styles.tab}>
//             <MaterialCommunityIcons name="view-grid-outline" size={22} color={theme.text} />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tab}>
//             <Ionicons name="play-circle-outline" size={22} color={theme.text} />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tab}>
//             <Ionicons name="person-circle-outline" size={22} color={theme.text} />
//         </TouchableOpacity>
//     </View>
// );

// type VideoItemProps = {
//     videoUrl?: string;
//     image?: string;
//     id: string;
//     username: string;
//     index: number;
//     onPressItem: (index: number) => void;
// };
// export const VideoItem: React.FC<VideoItemProps> = ({
//     videoUrl,
//     image,
//     id,
//     username,
//     index,
//     onPressItem,
// }) => {
//     const [isLoading, setIsLoading] = useState(true);
//     const player = videoUrl
//         ? useVideoPlayer(videoUrl, (p) => {
//             p.loop = true;
//             p.muted = true;
//             p.pause();
//         })
//         : null;

//     useEffect(() => {
//         if (player) {
//             player.pause();
//             player.currentTime = 0;
//         }
//     }, [player]);

//     return (
//         <TouchableOpacity
//             activeOpacity={0.9}
//             onPress={() => onPressItem(index)}
//         >
//             <View style={styles.videoContainer}>
//                 {videoUrl && player ? (
//                     <VideoView
//                         style={styles.postVideo}
//                         player={player}
//                         allowsFullscreen={false}
//                         allowsPictureInPicture={false}
//                         contentFit="cover"
//                         nativeControls={false}
//                     />
//                 ) : image ? (
//                     <Image source={{ uri: image }} style={styles.postImage} />
//                 ) : null}
//             </View>
//         </TouchableOpacity>
//     );
// };

// export const PostGrid: React.FC<{ videos: any[]; username: string }> = ({ videos, username }) => {
//     const router = useRouter();
//     const handlePressVideo = (index: number) => {
//         const video = videos[index];
//         if (!video) return;

//         router.push(`/p/${username}/${video.uuid}`);
//     };

//     if (!videos || videos.length === 0) {
//         return (
//             <View style={{ alignItems: "center", marginTop: 50 }}>
//                 <Text>No videos uploaded yet.</Text>
//             </View>
//         );
//     }

//     return (
//         <FlatList

//             data={videos}
//             keyExtractor={(item: any) => item.uuid}
//             numColumns={3}
//             renderItem={({ item, index }) =>
//                 item.videoUrl ? (
//                     <VideoItem
//                         // videoUrl={item.videoUrl}
//                          image={item.thumbnailUrl}
//                         id={item.uuid}
//                         username={username}
//                         index={index}
//                         onPressItem={handlePressVideo}
//                     />
//                 ) : (
//                     <Image source={{ uri: item.image }} style={styles.postImage} />
//                 )
//             }
//             showsVerticalScrollIndicator={false}
//         />
//     );
// };

// export const ProfileScreen: React.FC = () => {
//     const theme = useAppTheme();
//     const queryClient = useQueryClient();
//     const { username } = useLocalSearchParams<{ username?: string }>();
//     const [isFollowing, setIsFollowing] = useState(false);

//     // Fetch current user
//     const {
//         data: currentUser,
//         isLoading: currentUserLoading,
//         isError: currentUserError,
//     } = useQuery({
//         queryKey: ["currentUser"],
//         queryFn: GetCurrentUser,
//     });

//     // Fetch profile data for username
//     const {
//         data: profile,
//         isLoading: profileLoading,
//         isError: profileError,
//     } = useQuery({
//         queryKey: ["userProfile", username],
//         queryFn: () => GetProfileUsername(username || ""),
//         enabled: !!username,
//     });

//     console.log("pppppppppppp", profile);

//     // Check initial following status
//     useEffect(() => {
//         if (profile?.followers && currentUser?.id) {
//             const alreadyFollowing = profile.followers.some(
//                 (follower: any) => follower.id === currentUser.id
//             );
//             setIsFollowing(alreadyFollowing);
//         }
//     }, [profile?.followers, currentUser?.id]);

//     // Follow mutation
//     //   const followMutation = useMutation({
//     //     mutationFn: (id: string) => followUser(id),
//     //     onMutate: () => setIsFollowing(true),
//     //     onError: () => setIsFollowing(false),
//     //     onSuccess: async () => {
//     //       await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
//     //       await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
//     //     },
//     //   });

//     //   // Unfollow mutation
//     //   const unfollowMutation = useMutation({
//     //     mutationFn: (id: string) => UnfollowUser(id),
//     //     onMutate: () => setIsFollowing(false),
//     //     onError: () => setIsFollowing(true),
//     //     onSuccess: async () => {

//     //     },
//     //   });

//     const followMutation = useMutation({
//         mutationFn: (id: string) => followUser(id),
//         onMutate: () => setIsFollowing(true),
//         onError: () => setIsFollowing(false),
//         onSuccess: async () => {
//             await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
//             await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
//             await queryClient.invalidateQueries({ queryKey: ["userProfile", currentUser?.username] }); // ← YE ADD KIYA
//         },
//     });

//     const unfollowMutation = useMutation({
//         mutationFn: (id: string) => UnfollowUser(id),
//         onMutate: () => setIsFollowing(false),
//         onError: () => setIsFollowing(true),
//         onSuccess: async () => {
//             await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
//             await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
//             await queryClient.invalidateQueries({ queryKey: ["userProfile", currentUser?.username] }); // ← YE BHI
//         },
//     });
//     // Handle follow toggle
//     const handleFollowToggle = () => {
//         if (!profile?.id) return;
//         if (isFollowing) {
//             unfollowMutation.mutate(profile.id);
//         } else {
//             followMutation.mutate(profile.id);
//         }
//     };

//     // Loader
//     if (currentUserLoading || profileLoading) {
//         return (
//             <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//                 <ActivityIndicator size="large" color={theme.text} />
//             </View>
//         );
//     }

//     // Determine if viewing own profile
//     const isOwnProfile =
//         currentUser?.username === profile?.username ||
//         currentUser?.id === profile?.id;

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
//             <TopHeader
//                 userName={username || "Username"}
//                 theme={theme}
//                 isOwnProfile={isOwnProfile}
//             />
//             <ProfileHeader theme={theme} profile={profile} />

//             {/* <ProfileHeader theme={theme} profile={profile} /> */}
//             <UserInfo
//                 theme={theme}
//                 profile={profile}
//                 isOwnProfile={isOwnProfile}
//                 onFollowToggle={handleFollowToggle}
//                 isFollowing={isFollowing}
//             />
//             <Tabs theme={theme} />
//             <PostGrid videos={profile?.videos || []} username={profile?.username} />
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     topHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingHorizontal: width * 0.04,
//         paddingVertical: height * 0.015,
//     },
//     topHeaderText: {
//         fontSize: 18 * fontScale,
//         fontWeight: "bold",
//     },
//     header: {
//         flexDirection: "row",
//         padding: width * 0.04,
//         alignItems: "center",
//     },
//     website: {
//         fontSize: 14 * fontScale,
//         marginTop: 5,
//         textDecorationLine: "underline",
//     },
//     profilePicture: {
//         width: profilePicSize,
//         height: profilePicSize,
//         borderRadius: profilePicSize / 2,
//     },
//     stats: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         flex: 1,
//         marginLeft: width * 0.05,
//         flexWrap: "wrap",
//     },
//     stat: {
//         alignItems: "center",
//         marginHorizontal: width * 0.02,
//     },
//     likesViews: {
//         alignItems: "center",
//         flexDirection: "row",
//         marginHorizontal: width * 0.02,
//         marginTop: height * 0.01,
//         gap: width * 0.02,
//     },
//     followButton: {
//         flexDirection: "row",
//         justifyContent: "center",
//         marginTop: height * 0.01,
//         // gap: width * 0.02,
//         backgroundColor: "#3498db",
//         borderRadius: 5,
//         padding: 10,
//         textAlign: "center",
//         fontSize: 16
//     },
//     messageButton: {
//         marginTop: height * 0.01,
//         borderRadius: 5,
//         paddingVertical: 10,
//         justifyContent: "center",
//     },
//     statNumber: {
//         fontSize: 16 * fontScale,
//         fontWeight: "bold",
//     },
//     statLabel: {
//         fontSize: 13 * fontScale,
//     },
//     userInfo: {
//         paddingHorizontal: width * 0.04,
//         marginBottom: height * 0.01,
//     },
//     username: {
//         fontSize: 16 * fontScale,
//         fontWeight: "bold",
//     },
//     bio: {
//         fontSize: 13 * fontScale,
//         marginTop: 5,
//     },
//     tabs: {
//         flexDirection: "row",
//         justifyContent: "space-around",
//         paddingVertical: height * 0.012,
//     },
//     tab: {
//         padding: width * 0.01,
//     },
//     videoContainer: {
//         width: width / 3 - 3,
//         height: height * 0.32,
//         margin: 1.5,
//         borderRadius: 8,
//         overflow: "hidden",
//         backgroundColor: "#000",
//     },
//     postVideo: {
//         width: "100%",
//         height: "100%",
//     },
//     postImage: {
//         width: width / 3 - 3,
//         height: width / 3 - 3,
//         margin: 1.5,
//         resizeMode: "cover",
//     },

// });

// export default ProfileScreen;

// ==================================================

import { useAppTheme } from "@/src/constants/themeHelper";
import { formatCount } from "@/src/utils/formatCount";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
import { MentionedScreen } from "./mantionScreen";

const { width, height } = Dimensions.get("window");
const imageSize = width / 3;
const profilePicSize = width * 0.22;
const fontScale = width / 380;

// Instagram style post dimensions
const POSTS_PER_ROW = 3;
const POST_SPACING = 2; // Instagram uses very small gaps
const POST_SIZE = (width - (POST_SPACING * (POSTS_PER_ROW + 1))) / POSTS_PER_ROW;

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

    const profilePicture = profile.userProfile.ProfilePicture || null;
    const followersCount = profile.followersWithFlag?.length || 0;
    const followingsCount = profile.followingsWithFlag?.length || 0;
    const postsCount = profile.videos?.length || 0;
    // const likes = profile.likes || 0;
    // const views = profile.views || 0;
    const totalLikes = profile.videos?.reduce((sum: number, video: any) => sum + (video.likes?.length || 0), 0) || 0;
    const totalViews = profile.videos?.reduce((sum: number, video: any) => sum + (video.views?.length || 0), 0) || 0;

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
                    <Text style={[styles.statNumber, { color: theme.text }]}>{formatCount(postsCount)}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtitle }]}>Posts</Text>
                </View>

                <TouchableOpacity
                    style={styles.stat}
                    onPress={() => router.push(`/profile/${profile.username}/followers`)}
                >
                    <Text style={[styles.statNumber, { color: theme.text }]}>{formatCount(followersCount)}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtitle }]}>Followers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.stat}
                    onPress={() => router.push(`/profile/${profile.username}/followings`)}
                >
                    <Text style={[styles.statNumber, { color: theme.text }]}>{formatCount(followingsCount)}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtitle }]}>Following</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row" }}>
                    <View style={styles.likesViews}>
                        <Text style={[styles.statLabel, { color: theme.subtitle }]}>Likes</Text>
                        <Text style={[styles.statNumber, { color: theme.text }]}>{formatCount(totalLikes)}</Text>
                    </View>
                    <View style={styles.likesViews}>
                        <Text style={[styles.statLabel, { color: theme.subtitle }]}>Views</Text>
                        <Text style={[styles.statNumber, { color: theme.text }]}>{formatCount(totalViews)}</Text>
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

            {!isOwnProfile && (
                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={onFollowToggle}
                        style={[styles.followButton, { flex: 1 }]}
                    >
                        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
                            {isFollowing ? "Following" : "Follow"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: "/chat/[id]",
                            params: { id: profile.id }
                        })}
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

// export const Tabs: React.FC<{ theme: any }> = ({ theme }) => (
//     <View style={[styles.tabs, { backgroundColor: theme.background }]}>
//         {/* <TouchableOpacity style={styles.tab}>
//             <MaterialCommunityIcons name="view-grid-outline" size={22} color={theme.text} />
//         </TouchableOpacity> */}
//         <TouchableOpacity style={styles.tab}>
//             <Ionicons name="play-circle-outline" size={22} color={theme.text} />
//         </TouchableOpacity>

//             <TouchableOpacity style={styles.tab}>
//                 <Ionicons name="person-circle-outline" size={22} color={theme.text} />
//             </TouchableOpacity>
//     </View>
// );

export const Tabs: React.FC<{
    theme: any;
    // isOwnProfile: boolean;
    activeTab: "posts" | "reels";
    onChange: (tab: "posts" | "reels") => void;
}> = ({ theme, activeTab, onChange }) => (
    <View style={[styles.tabs, { backgroundColor: theme.background }]}>

        {/* POSTS TAB */}
        <TouchableOpacity style={styles.tab} onPress={() => onChange("posts")}>
            <Ionicons
                name="play-circle-outline"
                size={22}
                color={activeTab === "posts" ? theme.text : "#777"}
            />
        </TouchableOpacity>

        {/* REELS / PROFILE TAB (only owner) */}
        <TouchableOpacity style={styles.tab} onPress={() => onChange("reels")}>
            <Ionicons
                name="person-circle-outline"
                size={22}
                color={activeTab === "reels" ? theme.text : "#777"}
            />
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

    const theme = useAppTheme();

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
            style={[styles.postContainer, { backgroundColor: theme.background }]}
        >
            {image ? (
                <Image
                    source={{ uri: image }}
                    style={styles.postMedia}
                    resizeMode="cover"
                />
            ) : videoUrl && player ? (
                <VideoView
                    style={styles.postMedia}
                    player={player}
                    allowsFullscreen={false}
                    allowsPictureInPicture={false}
                    contentFit="cover"
                    nativeControls={false}
                />
            ) : null}
        </TouchableOpacity>
    );
};

export const PostGrid: React.FC<{ videos: any[]; username: string }> = ({ videos, username }) => {
    const router = useRouter();
    const theme = useAppTheme();

    const handlePressVideo = (index: number) => {
        const video = videos[index];
        if (!video) return;
        router.push(`/p/${username}/${video.uuid}`);
    };

    console.log("videos ==>", videos)

    if (!videos || videos.length === 0) {
        return (
            <View style={{ alignItems: "center", marginTop: 50, }}>
                <Text style={{ color: theme.text }}>No videos uploaded yet.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={videos}
            keyExtractor={(item: any) => item.uuid}
            numColumns={POSTS_PER_ROW}
            columnWrapperStyle={styles.row}
            renderItem={({ item, index }) => (
                <VideoItem
                    image={item.thumbnailUrl}
                    // videoUrl={item.videoUrl}
                    id={item.uuid}
                    username={username}
                    index={index}
                    onPressItem={handlePressVideo}
                />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, backgroundColor: theme.background }}
        />
    );
};

export const ProfileScreen: React.FC = () => {
    const theme = useAppTheme();
    const queryClient = useQueryClient();
    const { username } = useLocalSearchParams<{ username?: string }>();
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");


    const {
        data: currentUser,
        isLoading: currentUserLoading,
        isError: currentUserError,
    } = useQuery({
        queryKey: ["currentUser"],
        queryFn: GetCurrentUser,
    });

    const {
        data: profile,
        isLoading: profileLoading,
        isError: profileError,
    } = useQuery({
        queryKey: ["userProfile", username],
        queryFn: () => GetProfileUsername(username || ""),
        staleTime: 1000 * 60 * 30,   // 30 min (fresh)
        gcTime: 1000 * 60 * 60 * 6, // 6 hours cache in memory
        enabled: !!username,

        refetchOnMount: false,        // cached UI instantly    // ad
        refetchOnWindowFocus: true,   // background refresh     // ad
    });

    console.log("profile 111111111=======>", profile?.mentionedVideos);


    // useEffect(() => {
    //     if (profile?.followers && currentUser?.id) {
    //         const alreadyFollowing = profile.followers.some(
    //             (follower: any) => follower.id === currentUser.id
    //         );
    //         setIsFollowing(alreadyFollowing);
    //     }
    // }, [profile?.followers, currentUser?.id]);

    useEffect(() => {
        if (profile?.followersWithFlag && currentUser?.id) {
            const alreadyFollowing = profile.followersWithFlag.some(
                (f: any) => f.id === currentUser.id
            );
            setIsFollowing(alreadyFollowing);
        }
    }, [profile?.followersWithFlag, currentUser?.id]);

    // const followMutation = useMutation({
    //     mutationFn: (id: string) => followUser(id),
    //     onMutate: () => setIsFollowing(true),
    //     onError: () => setIsFollowing(false),
    //     onSuccess: async () => {
    //         await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
    //         await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    //         await queryClient.invalidateQueries({ queryKey: ["userProfile", currentUser?.username] });
    //     },
    // });

    // ad 23

    const followMutation = useMutation({
        mutationFn: (id: string) => followUser(id),

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["userProfile", username] });

            const previous = queryClient.getQueryData(["userProfile", username]);

            queryClient.setQueryData(["userProfile", username], (old: any) => ({
                ...old,
                followersWithFlag: [
                    ...(old?.followersWithFlag || []),
                    { ...currentUser, isFollowing: true },
                ],
            }));

            setIsFollowing(true);

            return { previous };
        },

        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["userProfile", username], context.previous);
            }
            setIsFollowing(false);
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
            await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
    });


    // const unfollowMutation = useMutation({
    //     mutationFn: (id: string) => UnfollowUser(id),
    //     onMutate: () => setIsFollowing(false),
    //     onError: () => setIsFollowing(true),
    //     onSuccess: async () => {
    //         await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
    //         await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    //         await queryClient.invalidateQueries({ queryKey: ["userProfile", currentUser?.username] });
    //     },
    // });


    // ad 23
    const unfollowMutation = useMutation({
        mutationFn: (id: string) => UnfollowUser(id),

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["userProfile", username] });

            const previous = queryClient.getQueryData(["userProfile", username]);

            queryClient.setQueryData(["userProfile", username], (old: any) => ({
                ...old,
                followersWithFlag: (old?.followersWithFlag || []).filter(
                    (f: any) => f.id !== currentUser?.id
                ),
            }));

            setIsFollowing(false);

            return { previous };
        },

        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["userProfile", username], context.previous);
            }
            setIsFollowing(true);
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
            await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
    });


    const handleFollowToggle = () => {
        if (!profile?.id) return;
        if (isFollowing) {
            unfollowMutation.mutate(profile.id);
        } else {
            followMutation.mutate(profile.id);
        }
    };

    if (currentUserLoading || profileLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={theme.text} />
            </View>
        );
    }

    const isOwnProfile =
        currentUser?.username === profile?.username ||
        currentUser?.id === profile?.id;

    console.log('vvvvvvvvvvvvvvvvvvvvvvvv', profile);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <TopHeader
                userName={username || "Username"}
                theme={theme}
                isOwnProfile={isOwnProfile}
            />
            <ProfileHeader theme={theme} profile={profile} />
            <UserInfo
                theme={theme}
                profile={profile}
                isOwnProfile={isOwnProfile}
                onFollowToggle={handleFollowToggle}
                isFollowing={isFollowing}
            />
            <Tabs theme={theme}
                //  isOwnProfile={isOwnProfile}
                activeTab={activeTab}
                onChange={setActiveTab} />

            {activeTab === "posts" ? (
                <PostGrid
                    key="posts"
                    videos={profile?.videos || []}
                    username={profile?.username}
                />
            ) : (
                //         <View
                //             key="reels"
                //             style={{ flex: 1, marginTop: 40, alignItems: "center" }}
                //         >
                //              <View
                //     style={{
                //       flex: 1,
                //       alignItems: "center",
                //       paddingHorizontal: 30,
                //     }}
                //   >
                //     <Ionicons
                //       name="person-circle-outline"
                //       size={64}
                //       color="#777"
                //     />

                //     <Text
                //       style={{
                //         color: theme.text,
                //         fontSize: 16,
                //         fontWeight: "600",
                //         marginTop: 12,
                //       }}
                //     >
                //       No tagged reels yet
                //     </Text>

                //     <Text
                //       style={{
                //         color: theme.subtitle,
                //         fontSize: 13,
                //         marginTop: 6,
                //         textAlign: "center",
                //       }}
                //     >
                //       Reels you’re tagged in will appear here.
                //     </Text>
                //   </View>

                //         </View>


                <MentionedScreen
                    key="reels"
                    mentionedVideos={profile?.mentionedVideos || []}
                    username={profile?.username}
                />
            )}

            {/* <PostGrid videos={profile?.videos || []} username={profile?.username} /> */}
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
        borderBottomWidth: 0.5,
        borderBottomColor: "#333",
    },
    tab: {
        padding: width * 0.01,
    },
    // Instagram style grid
    row: {
        gap: POST_SPACING,
        paddingHorizontal: POST_SPACING,
        marginBottom: POST_SPACING,
    },
    postContainer: {
        width: POST_SIZE,
        height: POST_SIZE,
    },
    postMedia: {
        width: "100%",
        height: "100%",
    },
});

export default ProfileScreen;