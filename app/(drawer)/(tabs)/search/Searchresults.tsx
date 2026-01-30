import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SearchUserSkeleton } from "@/src/components/explorePageSkeleton";
import { useAppTheme } from "@/src/constants/themeHelper";

const DEFAULT_THUMBNAIL = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const BOTTOM_PADDING = 100;

interface UserProfile {
    ProfilePicture?: string;
    name?: string;
}

interface SearchUser {
    id: string;
    username: string;
    userProfile?: UserProfile;
    role?: string;
}

interface SearchResultsProps {
    results: SearchUser[];
    isLoading: boolean;
    onUserPress: (user: SearchUser) => void;
}

export const SearchResults = ({
    results,
    isLoading,
    onUserPress,
}: SearchResultsProps) => {
    const theme = useAppTheme();

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal: 12,
                paddingBottom: BOTTOM_PADDING,
            }}
        >
            {/* NO RESULTS FOUND */}
            {!isLoading && results.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={50} color={theme.subtitle} />
                    <Text style={[styles.emptyText, { color: theme.subtitle }]}>
                        No results found
                    </Text>
                </View>
            )}

            {/* LOADING SKELETON */}
            {isLoading && <SearchUserSkeleton />}

            {/* SEARCH RESULTS LIST */}
            {!isLoading &&
                results.map((user) => (
                    <TouchableOpacity
                        key={user.id}
                        style={styles.userItem}
                        onPress={() => onUserPress(user)}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={{
                                uri: user.userProfile?.ProfilePicture || DEFAULT_THUMBNAIL,
                            }}
                            style={styles.avatar}
                        />
                        <View style={styles.textContainer}>
                            <View style={styles.usernameRow}>
                                <Text style={[styles.username, { color: theme.text }]}>
                                    {user.username}
                                </Text>
                                {user.role === "admin" && (
                                    <MaterialIcons
                                        name="verified"
                                        size={18}
                                        color="#0095F6"
                                        style={styles.verifiedIcon}
                                    />
                                )}
                            </View>
                            {user.userProfile?.name && (
                                <Text style={[styles.name, { color: theme.subtitle }]}>
                                    {user.userProfile.name}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 25,
    },
    textContainer: {
        marginLeft: 12,
    },
    usernameRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    username: {
        fontSize: 16,
        fontWeight: "600",
    },
    verifiedIcon: {
        marginLeft: 4,
        marginTop: 1,
    },
    name: {
        fontSize: 13,
        marginTop: 2,
    },
});