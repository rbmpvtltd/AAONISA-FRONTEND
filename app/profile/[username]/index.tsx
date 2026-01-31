// // import { useAppTheme } from "@/src/constants/themeHelper";
// // import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// // import { DrawerActions } from "@react-navigation/native";
// // import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // import { router, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
// // import { useVideoPlayer, VideoView } from "expo-video";
// // import { useEffect, useState } from "react";
// // import {
// //     ActivityIndicator,
// //     Dimensions,
// //     FlatList,
// //     Image,
// //     Linking,
// //     StyleSheet,
// //     Text,
// //     TouchableOpacity,
// //     View
// // } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import { followUser, GetCurrentUser, GetProfileUsername, UnfollowUser } from "../../../src/api/profile-api";

// // const { width, height } = Dimensions.get("window");
// // const imageSize = width / 3;
// // const profilePicSize = width * 0.22;
// // const fontScale = width / 380;

// // export const TopHeader: React.FC<{ userName: string; theme: any; isOwnProfile: boolean }> = ({ userName, theme, isOwnProfile }) => {
// //     const navigation = useNavigation();

// //     return (
// //         <View style={styles.topHeader}>
// //             <Text style={[styles.topHeaderText, { color: theme.text }]}>{userName}</Text>

// //             {isOwnProfile && (
// //                 <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
// //                     <MaterialIcons name="menu" size={26} color={theme.text} />
// //                 </TouchableOpacity>
// //             )}
// //         </View>
// //     );
// // };

// // export const ProfileHeader: React.FC<{ theme: any; profile: any }> = ({ theme, profile }) => {
// //     if (!profile?.userProfile) return null;

// //     const router = useRouter();
// //     const user = profile.username;
// //     console.log("username resive here", user);

// //     // backend data destructuring
// //     const profilePicture = profile.userProfile.ProfilePicture || null;
// //     console.log("new profilePicture", profilePicture);

// //     const followersCount = profile.followers?.length || 0;
// //     const followingsCount = profile.followings?.length || 0;

// //     // if your backend doesn’t send posts/likes/views yet
// //     const postsCount = profile.videos?.length || 0;
// //     console.log("video", postsCount);


// //     const likes = profile.likes || 0;
// //     const views = profile.views || 0;

// //     return (
// //         <View style={styles.header}>
// //             <Image
// //                 source={{
// //                     uri: profilePicture
// //                         ? profilePicture
// //                         : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
// //                 }}
// //                 style={styles.profilePicture}
// //             />



// //             <View style={styles.stats}>
// //                 <View style={styles.stat}>
// //                     <Text style={[styles.statNumber, { color: theme.text }]}>{postsCount}</Text>
// //                     <Text style={[styles.statLabel, { color: theme.subtitle }]}>Posts</Text>
// //                 </View>

// //                 <TouchableOpacity
// //                     style={styles.stat}
// //                     // onPress={() => router.push( `/profile/followers`)}
// //                     onPress={() => router.push(`/profile/${profile.username}/followers`)}
// //                 >
// //                     <Text style={[styles.statNumber, { color: theme.text }]}>{followersCount}</Text>
// //                     <Text style={[styles.statLabel, { color: theme.subtitle }]}>Followers</Text>
// //                 </TouchableOpacity>

// //                 <TouchableOpacity
// //                     style={styles.stat}
// //                     onPress={() => router.push(`/profile/${profile.username}/followings`)}
// //                 >
// //                     <Text style={[styles.statNumber, { color: theme.text }]}>{followingsCount}</Text>
// //                     <Text style={[styles.statLabel, { color: theme.subtitle }]}>Following</Text>
// //                 </TouchableOpacity>

// //                 <View style={{ flexDirection: "row" }}>
// //                     <View style={styles.likesViews}>
// //                         <Text style={[styles.statLabel, { color: theme.subtitle }]}>Likes</Text>
// //                         <Text style={[styles.statNumber, { color: theme.text }]}>{likes}</Text>
// //                     </View>
// //                     <View style={styles.likesViews}>
// //                         <Text style={[styles.statLabel, { color: theme.subtitle }]}>Views</Text>
// //                         <Text style={[styles.statNumber, { color: theme.text }]}>{views}</Text>
// //                     </View>
// //                 </View>
// //             </View>
// //         </View>
// //     );
// // };


// // export const UserInfo: React.FC<{
// //     theme: any;
// //     profile: any;
// //     isFollowing: boolean;
// //     isOwnProfile: boolean;
// //     onFollowToggle: () => void;
// // }> = ({ theme, profile, isFollowing, isOwnProfile, onFollowToggle }) => {
// //     if (!profile) return null;

// //     const user = profile.userProfile;
// //     console.log("user is here", user);

// //     const openUrl = () => {
// //         if (user?.url) {
// //             const link = user.url.startsWith("http") ? user.url : `https://${user.url}`;
// //             Linking.openURL(link).catch(() => console.log("Failed to open URL"));
// //         }
// //     };
// // console.log("iiiiiiiiiiiiiiiiiii", profile.id);

// //     return (
// //         <View style={styles.userInfo}>
// //             <Text style={[styles.username, { color: theme.text }]}>
// //                 {user?.name || "Your Name"}
// //             </Text>
// //             <Text style={[styles.bio, { color: theme.subtitle }]}>
// //                 {user?.bio || "Your bio..."}
// //             </Text>

// //             {user?.url ? (
// //                 <Text style={[styles.website, { color: "#3498db" }]} onPress={openUrl}>
// //                     {user.url}
// //                 </Text>
// //             ) : null}

// //             {/* 🔹 Follow / Unfollow Button */}
// //             {/* {!isOwnProfile && (
// //                 <TouchableOpacity onPress={onFollowToggle} style={[styles.followButton, { backgroundColor: isFollowing ? theme.buttonBg : theme.buttonBg }]}>
// //                     <Text style={{ color: "#fff", fontWeight: "600" }}>
// //                         {isFollowing ? "Following" : "Follow"}
// //                     </Text>
// //                 </TouchableOpacity>
// //             )} */}

// //             {!isOwnProfile && (
// //                 <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>

// //                     {/* Follow Button */}
// //                     <TouchableOpacity
// //                         onPress={onFollowToggle}
// //                         style={[styles.followButton, { flex: 1 }]}
// //                     >
// //                         <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
// //                             {isFollowing ? "Following" : "Follow"}
// //                         </Text>
// //                     </TouchableOpacity>

// //                     {/* Message Button */}
// //                     <TouchableOpacity
// //                         // onPress={() => router.push(`/chat/${profile.id}`)}
// //                           onPress={() => router.push({
// //                             pathname: "/chat/[id]",
// //                             params: {
// //                                 id: profile.id,
// //                             }
// //                         })}
// //                         style={[styles.messageButton, {
// //                             flex: 1,
// //                             backgroundColor: theme.searchBg,

// //                         }]}
// //                     >
// //                         <Text style={{ color: theme.text, fontWeight: "600", textAlign: "center" }}>
// //                             Message
// //                         </Text>
// //                     </TouchableOpacity>

// //                 </View>
// //             )}
// //         </View>
// //     );
// // };


// // export const Tabs: React.FC<{ theme: any }> = ({ theme }) => (
// //     <View style={[styles.tabs, { backgroundColor: theme.background }]}>
// //         <TouchableOpacity style={styles.tab}>
// //             <MaterialCommunityIcons name="view-grid-outline" size={22} color={theme.text} />
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.tab}>
// //             <Ionicons name="play-circle-outline" size={22} color={theme.text} />
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.tab}>
// //             <Ionicons name="person-circle-outline" size={22} color={theme.text} />
// //         </TouchableOpacity>
// //     </View>
// // );

// // type VideoItemProps = {
// //     videoUrl?: string;
// //     image?: string;
// //     id: string;
// //     username: string;
// //     index: number;
// //     onPressItem: (index: number) => void;
// // };
// // export const VideoItem: React.FC<VideoItemProps> = ({
// //     videoUrl,
// //     image,
// //     id,
// //     username,
// //     index,
// //     onPressItem,
// // }) => {
// //     const [isLoading, setIsLoading] = useState(true);
// //     const player = videoUrl
// //         ? useVideoPlayer(videoUrl, (p) => {
// //             p.loop = true;
// //             p.muted = true;
// //             p.pause();
// //         })
// //         : null;

// //     useEffect(() => {
// //         if (player) {
// //             player.pause();
// //             player.currentTime = 0;
// //         }
// //     }, [player]);

// //     return (
// //         <TouchableOpacity
// //             activeOpacity={0.9}
// //             onPress={() => onPressItem(index)}
// //         >
// //             <View style={styles.videoContainer}>
// //                 {videoUrl && player ? (
// //                     <VideoView
// //                         style={styles.postVideo}
// //                         player={player}
// //                         allowsFullscreen={false}
// //                         allowsPictureInPicture={false}
// //                         contentFit="cover"
// //                         nativeControls={false}
// //                     />
// //                 ) : image ? (
// //                     <Image source={{ uri: image }} style={styles.postImage} />
// //                 ) : null}
// //             </View>
// //         </TouchableOpacity>
// //     );
// // };

// // export const PostGrid: React.FC<{ videos: any[]; username: string }> = ({ videos, username }) => {
// //     const router = useRouter();
// //     const handlePressVideo = (index: number) => {
// //         const video = videos[index];
// //         if (!video) return;

// //         router.push(`/p/${username}/${video.uuid}`);
// //     };

// //     if (!videos || videos.length === 0) {
// //         return (
// //             <View style={{ alignItems: "center", marginTop: 50 }}>
// //                 <Text>No videos uploaded yet.</Text>
// //             </View>
// //         );
// //     }

// //     return (
// //         <FlatList

// //             data={videos}
// //             keyExtractor={(item: any) => item.uuid}
// //             numColumns={3}
// //             renderItem={({ item, index }) =>
// //                 item.videoUrl ? (
// //                     <VideoItem
// //                         // videoUrl={item.videoUrl}
// //                          image={item.thumbnailUrl}
// //                         id={item.uuid}
// //                         username={username}
// //                         index={index}
// //                         onPressItem={handlePressVideo}
// //                     />
// //                 ) : (
// //                     <Image source={{ uri: item.image }} style={styles.postImage} />
// //                 )
// //             }
// //             showsVerticalScrollIndicator={false}
// //         />
// //     );
// // };

// // export const ProfileScreen: React.FC = () => {
// //     const theme = useAppTheme();
// //     const queryClient = useQueryClient();
// //     const { username } = useLocalSearchParams<{ username?: string }>();
// //     const [isFollowing, setIsFollowing] = useState(false);

// //     // Fetch current user
// //     const {
// //         data: currentUser,
// //         isLoading: currentUserLoading,
// //         isError: currentUserError,
// //     } = useQuery({
// //         queryKey: ["currentUser"],
// //         queryFn: GetCurrentUser,
// //     });

// //     // Fetch profile data for username
// //     const {
// //         data: profile,
// //         isLoading: profileLoading,
// //         isError: profileError,
// //     } = useQuery({
// //         queryKey: ["userProfile", username],
// //         queryFn: () => GetProfileUsername(username || ""),
// //         enabled: !!username,
// //     });

// //     console.log("pppppppppppp", profile);

// //     // Check initial following status
// //     useEffect(() => {
// //         if (profile?.followers && currentUser?.id) {
// //             const alreadyFollowing = profile.followers.some(
// //                 (follower: any) => follower.id === currentUser.id
// //             );
// //             setIsFollowing(alreadyFollowing);
// //         }
// //     }, [profile?.followers, currentUser?.id]);

// //     // Follow mutation
// //     //   const followMutation = useMutation({
// //     //     mutationFn: (id: string) => followUser(id),
// //     //     onMutate: () => setIsFollowing(true),
// //     //     onError: () => setIsFollowing(false),
// //     //     onSuccess: async () => {
// //     //       await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
// //     //       await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
// //     //     },
// //     //   });

// //     //   // Unfollow mutation
// //     //   const unfollowMutation = useMutation({
// //     //     mutationFn: (id: string) => UnfollowUser(id),
// //     //     onMutate: () => setIsFollowing(false),
// //     //     onError: () => setIsFollowing(true),
// //     //     onSuccess: async () => {

// //     //     },
// //     //   });

// //     const followMutation = useMutation({
// //         mutationFn: (id: string) => followUser(id),
// //         onMutate: () => setIsFollowing(true),
// //         onError: () => setIsFollowing(false),
// //         onSuccess: async () => {
// //             await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
// //             await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
// //             await queryClient.invalidateQueries({ queryKey: ["userProfile", currentUser?.username] }); // ← YE ADD KIYA
// //         },
// //     });

// //     const unfollowMutation = useMutation({
// //         mutationFn: (id: string) => UnfollowUser(id),
// //         onMutate: () => setIsFollowing(false),
// //         onError: () => setIsFollowing(true),
// //         onSuccess: async () => {
// //             await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
// //             await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
// //             await queryClient.invalidateQueries({ queryKey: ["userProfile", currentUser?.username] }); // ← YE BHI
// //         },
// //     });
// //     // Handle follow toggle
// //     const handleFollowToggle = () => {
// //         if (!profile?.id) return;
// //         if (isFollowing) {
// //             unfollowMutation.mutate(profile.id);
// //         } else {
// //             followMutation.mutate(profile.id);
// //         }
// //     };

// //     // Loader
// //     if (currentUserLoading || profileLoading) {
// //         return (
// //             <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
// //                 <ActivityIndicator size="large" color={theme.text} />
// //             </View>
// //         );
// //     }

// //     // Determine if viewing own profile
// //     const isOwnProfile =
// //         currentUser?.username === profile?.username ||
// //         currentUser?.id === profile?.id;

// //     return (
// //         <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
// //             <TopHeader
// //                 userName={username || "Username"}
// //                 theme={theme}
// //                 isOwnProfile={isOwnProfile}
// //             />
// //             <ProfileHeader theme={theme} profile={profile} />

// //             {/* <ProfileHeader theme={theme} profile={profile} /> */}
// //             <UserInfo
// //                 theme={theme}
// //                 profile={profile}
// //                 isOwnProfile={isOwnProfile}
// //                 onFollowToggle={handleFollowToggle}
// //                 isFollowing={isFollowing}
// //             />
// //             <Tabs theme={theme} />
// //             <PostGrid videos={profile?.videos || []} username={profile?.username} />
// //         </SafeAreaView>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: { flex: 1 },
// //     topHeader: {
// //         flexDirection: "row",
// //         justifyContent: "space-between",
// //         alignItems: "center",
// //         paddingHorizontal: width * 0.04,
// //         paddingVertical: height * 0.015,
// //     },
// //     topHeaderText: {
// //         fontSize: 18 * fontScale,
// //         fontWeight: "bold",
// //     },
// //     header: {
// //         flexDirection: "row",
// //         padding: width * 0.04,
// //         alignItems: "center",
// //     },
// //     website: {
// //         fontSize: 14 * fontScale,
// //         marginTop: 5,
// //         textDecorationLine: "underline",
// //     },
// //     profilePicture: {
// //         width: profilePicSize,
// //         height: profilePicSize,
// //         borderRadius: profilePicSize / 2,
// //     },
// //     stats: {
// //         flexDirection: "row",
// //         justifyContent: "space-between",
// //         flex: 1,
// //         marginLeft: width * 0.05,
// //         flexWrap: "wrap",
// //     },
// //     stat: {
// //         alignItems: "center",
// //         marginHorizontal: width * 0.02,
// //     },
// //     likesViews: {
// //         alignItems: "center",
// //         flexDirection: "row",
// //         marginHorizontal: width * 0.02,
// //         marginTop: height * 0.01,
// //         gap: width * 0.02,
// //     },
// //     followButton: {
// //         flexDirection: "row",
// //         justifyContent: "center",
// //         marginTop: height * 0.01,
// //         // gap: width * 0.02,
// //         backgroundColor: "#3498db",
// //         borderRadius: 5,
// //         padding: 10,
// //         textAlign: "center",
// //         fontSize: 16
// //     },
// //     messageButton: {
// //         marginTop: height * 0.01,
// //         borderRadius: 5,
// //         paddingVertical: 10,
// //         justifyContent: "center",
// //     },
// //     statNumber: {
// //         fontSize: 16 * fontScale,
// //         fontWeight: "bold",
// //     },
// //     statLabel: {
// //         fontSize: 13 * fontScale,
// //     },
// //     userInfo: {
// //         paddingHorizontal: width * 0.04,
// //         marginBottom: height * 0.01,
// //     },
// //     username: {
// //         fontSize: 16 * fontScale,
// //         fontWeight: "bold",
// //     },
// //     bio: {
// //         fontSize: 13 * fontScale,
// //         marginTop: 5,
// //     },
// //     tabs: {
// //         flexDirection: "row",
// //         justifyContent: "space-around",
// //         paddingVertical: height * 0.012,
// //     },
// //     tab: {
// //         padding: width * 0.01,
// //     },
// //     videoContainer: {
// //         width: width / 3 - 3,
// //         height: height * 0.32,
// //         margin: 1.5,
// //         borderRadius: 8,
// //         overflow: "hidden",
// //         backgroundColor: "#000",
// //     },
// //     postVideo: {
// //         width: "100%",
// //         height: "100%",
// //     },
// //     postImage: {
// //         width: width / 3 - 3,
// //         height: width / 3 - 3,
// //         margin: 1.5,
// //         resizeMode: "cover",
// //     },

// // });

// // export default ProfileScreen;

// // ==================================================

import { ProfileActionsModal } from "@/src/components/block-modal";
import { PostGridSkeleton, ProfileHeaderSkeleton, TabsSkeleton, TopHeaderSkeleton, UserInfoSkeleton } from "@/src/components/profilePageSkeleton";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useStoriesQuery } from "@/src/hooks/storyMutation";
import { formatCount } from "@/src/utils/formatCount";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
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
import { followUser, getblockedUsers, GetCurrentUser, GetProfileUsername, UnfollowUser } from "../../../src/api/profile-api";
import { MentionedScreen } from "./mantionScreen";

const { width, height } = Dimensions.get("window");
const imageSize = width / 3;
const profilePicSize = width * 0.22;
const fontScale = width / 380;

// Instagram style post dimensions
const POSTS_PER_ROW = 3;
const PAGE_SIZE = 9;
const POST_SPACING = 2; // Instagram uses very small gaps
const POST_SIZE = (width - (POST_SPACING * (POSTS_PER_ROW + 1))) / POSTS_PER_ROW;


// interface ProfileActionsModalProps {
//     visible: boolean;
//     onClose: () => void;
//     userId: string;
//     isBlocked: boolean;
// }

// export default ProfileActionsModal;

export const TopHeader: React.FC<{ userName: string; theme: any; userRole: string; isOwnProfile: boolean, onMorePress: () => void }> = ({ userName, userRole, theme, isOwnProfile, onMorePress }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.topHeader}>
            <View style={styles.usernameRow}>
                <Text style={[styles.topHeaderText, { color: theme.text }]}>{userName}</Text>
                {userRole === "admin" && (
                    // < MaterialIcons
                    //     name="verified"
                    //     size={18}
                    //     color="#0095F6" // Instagram blue
                    //     style={styles.verifiedIcon}
                    // />
                    <Image
                        source={require("@/assets/images/blue-tick.png")}
                        style={styles.verifiedBadge}
                        resizeMode="contain"
                    />
                )}

            </View>

            {/* {isOwnProfile && (
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <MaterialIcons name="menu" size={26} color={theme.text} />
                </TouchableOpacity>
            )}

            {!isOwnProfile && (
                <TouchableOpacity onPress={() => setShowActions(true)}>
                    <Ionicons name="ellipsis-vertical" size={26} color={theme.text} />
                </TouchableOpacity>
            )}; */}

            {isOwnProfile ? (
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <MaterialIcons name="menu" size={26} color={theme.text} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={onMorePress}>
                    <Ionicons name="ellipsis-vertical" size={26} color={theme.text} />
                </TouchableOpacity>
            )}

        </View>
    );
};



export const ProfileHeader: React.FC<{ theme: any; profile: any }> = ({ theme, profile }) => {
    if (!profile?.userProfile) return null;

    const router = useRouter();
    const user = profile.username;

    const profilePicture = profile.userProfile?.ProfilePicture || null;
    const followersCount = profile.followersWithFlag?.length || 0;
    const followingsCount = profile.followingsWithFlag?.length || 0;
    const postsCount = profile.videos?.length || 0;
    // const likes = profile.likes || 0;
    // const views = profile.views || 0;
    const totalLikes = profile.videos?.reduce((sum: number, video: any) => sum + (video.likes?.length || 0), 0) || 0;
    const totalViews = profile.videos?.reduce((sum: number, video: any) => sum + (video.views?.length || 0), 0) || 0;

    // Stories
    const {
        data: userStories,
    } = useStoriesQuery();

    // console.log(userStories, 'userStories');

    const userStoryContainer = userStories?.find((item: any) => item.owner === profile.id);
    const hasStory = userStoryContainer && userStoryContainer.stories?.length > 0;

    // console.log("arbaaz chouhan", hasStory, userStoryContainer?.owner, userStories?.length);
    // console.log("story arbaaz chouhan", userStoryContainer ? `/story/${userStoryContainer.owner}` : 'no story');

    // ✅ Handle profile pic press
    const handleProfilePicPress = () => {
        if (hasStory && userStoryContainer) {
            router.push({
                pathname: `/story/[id]`,
                params: {
                    id: userStoryContainer?.stories?.[0]?.id
                }
            });
            const path = `/story/${userStoryContainer?.stories?.[0]?.id}`;
            // console.log("🚀 Navigating to:", path);
        } else {
            // Open full screen profile picture
            // router.push({
            //     pathname: "/profile/profile-picture",
            //     params: {
            //         username: profile.username,
            //         imageUrl: profilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            //     }
            // });

            router.push({
                pathname: "/profile/[username]/profile-picture",
                params: {
                    username: profile.username,
                    imageUrl: profilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
            });
        }
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={handleProfilePicPress}
                activeOpacity={0.8}
            >
                <View style={[
                    styles.profilePictureContainer,
                    // hasStory && {
                    //     borderWidth: 10,
                    //     borderColor: '#E1306C',
                    //     padding: 2,
                    // }
                ]}>
                    <Image
                        source={{
                            uri: profilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                        }}
                        style={styles.profilePicture}
                    />
                </View>
            </TouchableOpacity>

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
    followsMe: boolean;
    isOwnProfile: boolean;
    onFollowToggle: () => void;
}> = ({ theme, profile, isFollowing, isOwnProfile, onFollowToggle, followsMe }) => {
    if (!profile) return null;

    const user = profile.userProfile;

    const openUrl = () => {
        if (user?.url) {
            const link = user.url.startsWith("http") ? user.url : `https://${user.url}`;
            Linking.openURL(link).catch(() => console.log("Failed to open URL"));
        }
    };


    let buttonText = 'Follow';
    if (isFollowing) {
        buttonText = 'Following';
    } else if (followsMe) {
        buttonText = 'Follow Back';
    }

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
                        style={[
                            styles.followButton,
                            {
                                flex: 1,
                                backgroundColor: isFollowing ? theme.inputBorder : '#0095f6',
                                borderWidth: isFollowing ? 1 : 0,
                                borderColor: isFollowing ? theme.subtitle : 'transparent',
                            }
                        ]}
                    >
                        <Text style={{
                            color: isFollowing ? theme.text : "#fff",
                            fontWeight: "600",
                            textAlign: "center"
                        }}>
                            {buttonText}
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
    image: string;
    uuid: string;
    onPressItem: (uuid: string) => void;
};

export const VideoItem: React.FC<VideoItemProps> = ({
    image,
    uuid,
    onPressItem,
}) => {
    const theme = useAppTheme();

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPressItem(uuid)}
            style={[styles.postContainer, {
                backgroundColor: theme.searchBg,
            }]}
        >
            <Image
                source={{ uri: image }}
                style={[styles.postMedia]}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );
};


export const PostGrid: React.FC<{ videos: any[]; username: string }> = ({
    videos,
    username,
}) => {
    const router = useRouter();
    const theme = useAppTheme();

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const displayedVideos = videos.slice(0, page * PAGE_SIZE);

    const loadMore = () => {
        if (loadingMore) return;
        if (displayedVideos.length >= videos.length) return;

        setLoadingMore(true);
        setTimeout(() => {
            setPage(prev => prev + 1);
            setLoadingMore(false);
        }, 800);
    };

    const handlePressVideo = (uuid: string) => {
        console.log('🎯 Navigating to:', `/p/${username}/${uuid}`);
        router.push(`/p/${username}/${uuid}`);
    };

    if (!videos?.length) {
        return (
            <View style={{ alignItems: "center", marginTop: 50 }}>
                <Text style={{ color: theme.text }}>
                    No videos uploaded yet.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={displayedVideos}
            keyExtractor={(item) => item.uuid}
            numColumns={POSTS_PER_ROW}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
                <VideoItem
                    image={item.thumbnailUrl}
                    uuid={item.uuid}
                    onPressItem={handlePressVideo}
                />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                loadingMore ? (
                    <ActivityIndicator
                        style={{ marginVertical: 20 }}
                        size="large"
                        color={theme.text}
                    />
                ) : null
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 20,
                backgroundColor: theme.background,
            }}
        />
    );
};


export const ProfileScreen: React.FC = () => {
    const theme = useAppTheme();
    const queryClient = useQueryClient();
    const { username } = useLocalSearchParams<{ username?: string }>();
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");
    const [followsMe, setFollowsMe] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const {
        data: currentUser,
        isLoading: currentUserLoading,
        isError: currentUserError,
    } = useQuery({
        queryKey: ["currentUser"],
        queryFn: GetCurrentUser,
    });

    const {
        data: blockedUsers,
        isLoading: blockedUsersLoading,
    } = useQuery({
        queryKey: ["blockedUsers"],
        queryFn: getblockedUsers,
        enabled: !!currentUser?.id,
    });


    // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", currentUser);

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

        refetchOnMount: true,        // cached UI instantly    // ad
        refetchOnWindowFocus: true,   // background refresh     // ad
    });


    // console.log('====================================');
    // console.log("blockedUsersIds", blockedUsers);
    // console.log('====================================');

    useEffect(() => {
        if (profile && blockedUsers && Array.isArray(blockedUsers)) {
            console.log("🔍 Checking block status...");
            console.log("Profile ID:", profile.id);
            console.log("Blocked Users:", blockedUsers);

            const blocked = blockedUsers.some(
                (blockedUser: any) => blockedUser.id === profile.id
            );

            console.log("✅ Is Blocked:", blocked);
            setIsBlocked(blocked);
        } else {
            setIsBlocked(false);
        }
    }, [profile?.id, blockedUsers]);

    // console.log("profile 111111111=======>", profile?.mentionedVideos);


    // useEffect(() => {
    //     if (profile?.followers && currentUser?.id) {
    //         const alreadyFollowing = profile.followers.some(
    //             (follower: any) => follower.id === currentUser.id
    //         );
    //         setIsFollowing(alreadyFollowing);
    //     }
    // }, [profile?.followers, currentUser?.id]);

    // useEffect(() => {
    //     if (profile?.followersWithFlag && currentUser?.id) {
    //         const alreadyFollowing = profile.followersWithFlag.some(
    //             (f: any) => f.id === currentUser.id
    //         );
    //         setIsFollowing(alreadyFollowing);
    //     }
    // }, [profile?.followersWithFlag, currentUser?.id]);

    useEffect(() => {
        if (profile && currentUser?.id) {
            // Check if I follow this profile
            const alreadyFollowing = profile.followersWithFlag?.some(
                (f: any) => f.id === currentUser.id
            ) || false;

            // Check if this profile follows me
            const profileFollowsMe = profile.followingsWithFlag?.some(
                (f: any) => f.id === currentUser.id
            ) || false;

            setIsFollowing(alreadyFollowing);
            setFollowsMe(profileFollowsMe);
        }
    }, [profile, currentUser?.id]);
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
            // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            //     <ActivityIndicator size="large" color={theme.text} />
            // </View>

            <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
                <TopHeaderSkeleton theme={theme} />
                <ProfileHeaderSkeleton />
                <UserInfoSkeleton />
                <TabsSkeleton theme={theme} />
                <PostGridSkeleton />
            </SafeAreaView>
        );
    }

    const isOwnProfile =
        currentUser?.username === profile?.username ||
        currentUser?.id === profile?.id;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <TopHeader
                userName={username || "Username"}
                userRole={profile?.role}
                theme={theme}
                isOwnProfile={isOwnProfile}
                onMorePress={() => setShowActions(true)}
            />

            {/* <ProfileActionsModal
                visible={showActions}
                onClose={() => setShowActions(false)}
                userId={profile?.username || ""}
                isBlocked={profile?.username === currentUser?.username}
            /> */}

            <ProfileActionsModal
                visible={showActions}
                onClose={() => setShowActions(false)}
                username={profile?.username || ""}
                isBlocked={isBlocked}
            />
            <ProfileHeader theme={theme} profile={profile} />
            <UserInfo
                theme={theme}
                profile={profile}
                isOwnProfile={isOwnProfile}
                onFollowToggle={handleFollowToggle}
                isFollowing={isFollowing}
                followsMe={followsMe}
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
    verifiedBadge: {
        width: 18,
        height: 18,
        marginLeft: 2,
        marginTop: 2,
    },
    header: {
        flexDirection: "row",
        padding: width * 0.04,
        alignItems: "center",
    },
    usernameRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    verifiedIcon: {
        marginLeft: 4,
        marginTop: 1, // perfect vertical align
    },
    profilePictureContainer: {
        width: profilePicSize,
        height: profilePicSize,
        borderRadius: profilePicSize / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilePicture: {
        width: profilePicSize,
        height: profilePicSize,
        borderRadius: profilePicSize / 2,
    },
    website: {
        fontSize: 14 * fontScale,
        marginTop: 5,
        textDecorationLine: "underline",
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

