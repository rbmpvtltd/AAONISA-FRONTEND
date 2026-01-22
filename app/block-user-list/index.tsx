import { UnblockUser } from "@/src/api/profile-api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useBlockedUsers } from "@/src/hooks/blockUser-Mutaion";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

interface BlockedUser {
    id: string;
    username: string;
    email?: string;
    phone_no?: string;
    userProfile?: {
        ProfilePicture?: string;
        name?: string;
    };
}

function BlockedUsersList() {
    const theme = useAppTheme();
    const router = useRouter();
    const queryClient = useQueryClient();

    // Fetch blocked users
    const {
        data: blockedUsers,
        isLoading,
        isError,
    } = useBlockedUsers();
    // Unblock mutation
    const unblockMutation = useMutation({
        mutationFn: (username: string) => UnblockUser(username),
        onSuccess: async (_, username) => {
            console.log("✅ Unblock successful");
            await queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
            await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

            Toast.show({
                type: 'success',
                text1: 'User Unblocked',
                text2: `You have unblocked @${username}`,
                position: 'top',
                visibilityTime: 3000,
            });
        },
        onError: (error) => {
            console.error("❌ Unblock failed:", error);
            Toast.show({
                type: 'error',
                text1: 'Unblock Failed',
                text2: 'Something went wrong. Please try again.',
                position: 'top',
                visibilityTime: 3000,
            });
        }
    });

    const handleUnblock = (user: BlockedUser) => {
        Alert.alert(
            "Unblock User",
            `Are you sure you want to unblock @${user.username}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Unblock",
                    style: "destructive",
                    onPress: () => {
                        console.log("🎯 Unblocking user:", user.username);
                        unblockMutation.mutate(user.username);
                    }
                }
            ]
        );
    };

    const renderBlockedUser = ({ item }: { item: BlockedUser }) => {
        const profilePicture = item.userProfile?.ProfilePicture ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png";
        const displayName = item.userProfile?.name || item.username;

        return (
            <View style={[styles.userItem, {
                backgroundColor: theme.background,
                borderBottomColor: '#333'
            }]}>
                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => router.push(`/profile/${item.username}`)}
                >
                    <Image
                        source={{ uri: profilePicture }}
                        style={styles.avatar}
                    />
                    <View style={styles.userDetails}>
                        <Text style={[styles.username, { color: theme.text }]}>
                            {item.username}
                        </Text>
                        {displayName !== item.username && (
                            <Text style={[styles.displayName, { color: theme.subtitle }]}>
                                {displayName}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.unblockButton, {
                        backgroundColor: theme.searchBg || '#262626',
                        borderColor: theme.inputBorder || '#444'
                    }]}
                    onPress={() => handleUnblock(item)}
                    disabled={unblockMutation.isPending}
                >
                    <Text style={[styles.unblockText, { color: theme.text }]}>
                        {unblockMutation.isPending ? "Unblock" : "Unblock"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                        Blocked Accounts
                    </Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.text} />
                </View>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                        Blocked Accounts
                    </Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.centered}>
                    <Text style={[styles.emptyText, { color: theme.subtitle }]}>
                        Failed to load blocked users
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: '#333' }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    Blocked Accounts
                </Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <Text style={[styles.infoText, { color: theme.subtitle }]}>
                    Once you block someone, that person can no longer see things you post on your profile,
                    start a conversation with you or add you as a friend.
                </Text>
            </View>

            {/* Blocked Users List */}
            {!blockedUsers || blockedUsers.length === 0 ? (
                <View style={styles.centered}>
                    <Ionicons
                        name="person-remove-outline"
                        size={64}
                        color={theme.subtitle}
                        style={{ marginBottom: 16 }}
                    />
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>
                        No Blocked Accounts
                    </Text>
                    <Text style={[styles.emptyText, { color: theme.subtitle }]}>
                        When you block someone, they'll appear here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={blockedUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={renderBlockedUser}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    infoSection: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
    },
    infoText: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
    },
    listContent: {
        paddingVertical: 8,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    username: {
        fontSize: 14,
        fontWeight: '600',
    },
    displayName: {
        fontSize: 13,
        marginTop: 2,
    },
    unblockButton: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
    },
    unblockText: {
        fontSize: 14,
        fontWeight: '600',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default BlockedUsersList