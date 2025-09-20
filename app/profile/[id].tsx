import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAppTheme } from "../themeHelper";

// ===== Types =====
interface User {
    id: string;
    userName: string;
    name: string;
    bio: string;
    profilePicture: string;
    posts: number;
    followers: number;
    following: number;
    likes: number;
    views: number;
}

interface Post {
    id: string;
    image: string;
}

const { width, height } = Dimensions.get("window");
const imageSize = width / 3;
const profilePicSize = width * 0.22;
const fontScale = width / 380;

const user: User = {
    id: "u1",
    userName: "mr._adnan_47",
    name: "Adnan Chouhan",
    bio: "Hello everyOne, I am Adnan Chouhan.",
    profilePicture:
        "https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2928",
    posts: 120,
    followers: 5600,
    following: 180,
    likes: 1511,
    views: 2452,
};

const posts: Post[] = Array.from({ length: 16 }).map((_, i) => ({
    id: (i + 1).toString(),
    image: `https://placekitten.com/${300 + i}/${300}`,
}));

const TopHeader: React.FC<{ userName: string; theme: any }> = ({ userName, theme }) => (
    <View style={[styles.topHeader]}>
        <Text style={[styles.topHeaderText, { color: theme.text }]}>{userName}</Text>
        <MaterialIcons name="menu" size={24} color={theme.text} />
    </View>
);

const ProfileHeader: React.FC<{ user: User; theme: any }> = ({ user, theme }) => (
    <View style={styles.header}>
        <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
        <View style={styles.stats}>
            {[
                { label: "Posts", value: user.posts },
                { label: "Followers", value: user.followers },
                { label: "Following", value: user.following },
            ].map((item) => (
                <View style={styles.stat} key={item.label}>
                    <Text style={[styles.statNumber, { color: theme.text }]}>{item.value}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtitle }]}>{item.label}</Text>
                </View>
            ))}
            <View style={{ flexDirection: "row" }}>
                <View style={styles.likesViews}>
                    <Text style={[styles.statLabel, { color: theme.subtitle }]}>Likes</Text>
                    <Text style={[styles.statNumber, { color: theme.text }]}>{user.likes}</Text>
                </View>
                <View style={styles.likesViews}>
                    <Text style={[styles.statLabel, { color: theme.subtitle }]}>Views</Text>
                    <Text style={[styles.statNumber, { color: theme.text }]}>{user.views}</Text>
                </View>
            </View>
        </View>
    </View>
);

const UserInfo: React.FC<{ user: User; theme: any }> = ({ user, theme }) => (
    <View style={styles.userInfo}>
        <Text style={[styles.username, { color: theme.text }]}>{user.name}</Text>
        <Text style={[styles.bio, { color: theme.subtitle }]}>{user.bio}</Text>
    </View>
);

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

const PostGrid: React.FC<{ posts: Post[] }> = ({ posts }) => (
    <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={() => (
            <Image
                source={{
                    uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
                }}
                style={styles.postImage}
            />
        )}
        showsVerticalScrollIndicator={false}
    />
);

const ProfileScreen: React.FC = () => {
    const theme = useAppTheme(); 

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <TopHeader userName={user.userName} theme={theme} />
            <ProfileHeader user={user} theme={theme} />
            <UserInfo user={user} theme={theme} />
            <Tabs theme={theme} />
            <PostGrid posts={posts} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    postImage: {
        width: imageSize,
        height: imageSize,
        margin: 1,
    },
});

export default ProfileScreen;
