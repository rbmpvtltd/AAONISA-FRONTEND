
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


// ===== Types =====
interface User {
    id: string;
    idName: string;
    name: string;
    bio: string;
    avatar: string;
    postsCount: number;
    followers: number;
    following: number;
    likes: number;
    views: number;
}

interface Post {
    id: string;
    image: string;
}

const user: User = {
    id: "u1",
    idName: "mr._adnan_47",
    name: "Adnan Chouhan",
    bio: "Hello everyOne, I am Adnan Chouhan.",
    avatar:
        "https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2928",
    postsCount: 120,
    followers: 5600,
    following: 180,
    likes: 1511,
    views: 2452,
};

const posts: Post[] = Array.from({ length: 16 }).map((_, i) => ({
    id: (i + 1).toString(),
    image: `https://placekitten.com/${300 + i}/${300}`,
}));

// ===== Components =====

// --- Top Header (Username + Menu) ---
const TopHeader: React.FC<{ idName: string }> = ({ idName }) => (
    <View style={styles.topHeader}>
        <Text style={styles.topHeaderText}>{idName}</Text>
        <View style={styles.topHeaderIcons}>
            <MaterialIcons name="menu" size={24} color="#black" />
        </View>
    </View>
);

// const ProfileHeader: React.FC<{ user: User }> = ({ user }) => (
//     <View style={styles.header}>
//         <Image source={{ uri: user.avatar }} style={styles.avatar} />
//         <View style={styles.stats}>
//             <View style={styles.stat}>
//                 <Text style={styles.statNumber}>{user.postsCount}</Text>
//                 <Text style={styles.statLabel}>Posts</Text>
//             </View>
//             <View style={styles.stat}>
//                 <Text style={styles.statNumber}>{user.followers}</Text>
//                 <Text style={styles.statLabel}>Followers</Text>
//             </View>
//             <View style={styles.stat}>
//                 <Text style={styles.statNumber}>{user.following}</Text>
//                 <Text style={styles.statLabel}>Following</Text>
//             </View>
//         </View>
//     </View>
// );

const ProfileHeader: React.FC<{ user: User }> = ({ user }) => (
    <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.stats}>
            <View style={styles.stat}>
                <Text style={styles.statNumber}>{user.postsCount}</Text>
                <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
                <Text style={styles.statNumber}>{user.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
                <Text style={styles.statNumber}>{user.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.likesViews}>
                    <Text style={styles.statLabel}>Likes</Text>
                    <Text style={styles.statNumber}>{user.likes}</Text>
                </View>
                <View style={styles.likesViews}>
                    <Text style={styles.statLabel}>Views</Text>
                    <Text style={styles.statNumber}>{user.views}</Text>
                </View>
            </View>
        </View>
    </View>
);


const UserInfo: React.FC<{ user: User }> = ({ user }) => (
    <View style={styles.userInfo}>
        <Text style={styles.username}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
    </View>
);

// --- Tabs (Posts, Reels, Tagged) ---
const Tabs: React.FC = () => (
    <View style={styles.tabs}>
        <TouchableOpacity style={styles.tab}>
            {/* <Ionicons name="grid-outline" size={22} color="#000" /> */}
            <MaterialCommunityIcons name="view-grid-outline" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
            <Ionicons name="play-circle-outline" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
            <Ionicons name="person-circle-outline" size={22} color="#000" />
        </TouchableOpacity>
    </View>
);

const PostGrid: React.FC<{ posts: Post[] }> = ({ posts }) => {
    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
                <Image
                    source={{ uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" }}
                    style={styles.postImage}
                />
            )}
            showsVerticalScrollIndicator={false}
        />
    );
};

// ===== Main Screen =====
const ProfileScreen: React.FC = () => {
    return (
        // <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <TopHeader idName={user.idName} />
            <ProfileHeader user={user} />
            <UserInfo user={user} />
            <Tabs />
            <PostGrid posts={posts} />
        </View>
        // </SafeAreaView>             

    );
};

// ===== Styles =====
const { width } = Dimensions.get("window");
const imageSize = width / 3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#fff",
    },
    topHeaderText: {
        color: "#black",
        fontSize: 18,
        fontWeight: "bold",
    },
    topHeaderIcons: {
        flexDirection: "row",
        alignItems: "center",
    },
    // header: {
    //     flexDirection: "row",
    //     padding: 15,
    //     alignItems: "center",
    // },
    // avatar: {
    //     width: 80,
    //     height: 80,
    //     borderRadius: 40,
    // },
    // stats: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     flex: 1,
    //     marginLeft: 20,
    // },
    // stat: {
    //     alignItems: "center",
    // },
    // statNumber: {
    //     fontSize: 18,
    //     fontWeight: "bold",
    //     color: "#black",
    // },
    // statLabel: {
    //     fontSize: 14,
    //     color: "#aaa",
    // },
    header: {
        flexDirection: "row",
        padding: 15,
        alignItems: "center",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        marginLeft: 20,
        flexWrap: "wrap",
    },
    stat: {
        alignItems: "center",
        marginHorizontal: 8,
    },
    likesViews: {
        alignItems: "center",
        flexDirection: "row",
        marginHorizontal: 8,
        marginTop: 10,
        gap: 10
    },
    statNumber: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    statLabel: {
        fontSize: 14,
        color: "#aaa",
    },
    userInfo: {
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#black",
    },
    bio: {
        fontSize: 14,
        color: "#aaa",
        marginTop: 5,
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        // borderTopWidth: 0.5,
        // borderTopColor: "#333",
        // borderBottomWidth: 0.5,
        // borderBottomColor: "#333",
        paddingVertical: 8,
        backgroundColor: "#fff",
    },
    tab: {
        padding: 5,
    },
    postImage: {
        width: imageSize,
        height: imageSize,
        margin: 1,
    },
});

export default ProfileScreen;