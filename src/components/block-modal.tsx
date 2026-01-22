import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Alert, Animated, Dimensions, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { blockUser, UnblockUser } from "../api/profile-api";
import { useAppTheme } from "../constants/themeHelper";

const { width } = Dimensions.get('window');
const MENU_WIDTH = Math.min(280, width * 0.75);

interface ProfileActionsModalProps {
    visible: boolean;
    onClose: () => void;
    username: string;
    isBlocked: boolean;
    onReport?: () => void;
    onShare?: () => void;
    onCopyProfile?: () => void;
}

export const ProfileActionsModal = ({
    visible,
    onClose,
    username,
    isBlocked,
    onReport,
    onShare,
}: ProfileActionsModalProps) => {
    const theme = useAppTheme();
    const queryClient = useQueryClient();
    const slideAnim = useRef(new Animated.Value(MENU_WIDTH + 50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
                    velocity: 2,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 280,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 70,
                    friction: 7,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: MENU_WIDTH + 50,
                    duration: 220,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 220,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const blockMutation = useMutation({
        mutationFn: (username: string) => blockUser(username),
        onSuccess: async () => {
            console.log("✅ Block successful, invalidating queries...");
            await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            await queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
            await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });

            Toast.show({
                type: 'success',
                text1: '🚫 User Blocked',
                text2: `@${username} has been blocked`,
                position: 'top',
                visibilityTime: 2500,
            });

            onClose();
        },
        onError: (error) => {
            console.error("❌ Block failed:", error);
            Toast.show({
                type: 'error',
                text1: 'Unable to Block',
                text2: 'Please try again',
                position: 'top',
                visibilityTime: 2500,
            });
        }
    });

    const unblockMutation = useMutation({
        mutationFn: (username: string) => UnblockUser(username),
        onSuccess: async () => {
            console.log("✅ Unblock successful, invalidating queries...");
            await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            await queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
            await queryClient.invalidateQueries({ queryKey: ["userProfile", username] });

            Toast.show({
                type: 'success',
                text1: '✓ User Unblocked',
                text2: `@${username} has been unblocked`,
                position: 'top',
                visibilityTime: 2500,
            });
            onClose();
        },
        onError: (error) => {
            console.error("❌ Unblock failed:", error);

            Toast.show({
                type: 'error',
                text1: 'Unable to Unblock',
                text2: 'Please try again',
                position: 'top',
                visibilityTime: 2500,
            });
        }
    });

    const handleBlockToggle = () => {
        onClose();
        setTimeout(() => {
            Alert.alert(
                isBlocked ? "Unblock @" + username + "?" : "Block @" + username + "?",
                isBlocked
                    ? "They will be able to see your posts and message you."
                    : "They won't be able to find your profile or see your posts.",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: isBlocked ? "Unblock" : "Block",
                        style: isBlocked ? "default" : "destructive",
                        onPress: () => {
                            console.log(`🎯 ${isBlocked ? 'Unblocking' : 'Blocking'} user:`, username);
                            if (isBlocked) {
                                unblockMutation.mutate(username);
                            } else {
                                blockMutation.mutate(username);
                            }
                        },
                    },
                ]
            );
        }, 300);
    };

    // const handleReport = () => {
    //     onClose();
    //     setTimeout(() => {
    //         if (onReport) {
    //             onReport();
    //         } else {
    //             Alert.alert(
    //                 "Report @" + username,
    //                 "Why are you reporting this account?",
    //                 [
    //                     { text: "Cancel", style: "cancel" },
    //                     { text: "Spam", onPress: () => console.log("Reported as Spam") },
    //                     { text: "Harassment", onPress: () => console.log("Reported as Harassment") },
    //                     { text: "Inappropriate", style: "destructive", onPress: () => console.log("Reported as Inappropriate") },
    //                 ]
    //             );
    //         }
    //     }, 300);
    // };

    const handleShare = () => {
        onClose();
        if (onShare) {
            onShare();
        } else {
            Toast.show({
                type: 'info',
                text1: 'Share Profile',
                text2: `Sharing @${username}'s profile`,
                position: 'top',
                visibilityTime: 2000,
            });
        }
    };

    // const handleCopyProfile = () => {
    //     onClose();
    //     if (onCopyProfile) {
    //         onCopyProfile();
    //     } else {
    //         Toast.show({
    //             type: 'success',
    //             text1: 'Link Copied',
    //             text2: 'Profile URL copied to clipboard',
    //             position: 'top',
    //             visibilityTime: 2000,
    //         });
    //     }
    // };

    const isLoading = blockMutation.isPending || unblockMutation.isPending;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
            </Pressable>

            <Animated.View
                style={[
                    styles.menuContainer,
                    {
                        transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
                    },
                ]}
            >
                <View style={[styles.menu, { backgroundColor: theme.background }]}>

                    {/* Header */}
                    {/* <View style={styles.header}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {username[0]?.toUpperCase()}
                            </Text>
                        </View>
                        <Text style={[styles.username, { color: theme.text }]}>
                            @{username}
                        </Text>
                    </View> */}

                    {/* Actions List */}
                    <View style={styles.actionsList}>
                        {/* Share Profile */}
                        {/* <TouchableOpacity
                            style={styles.actionItem}
                            onPress={handleShare}
                            activeOpacity={0.6}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                                <Text style={styles.iconText}>📤</Text>
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={[styles.actionText, { color: theme.text }]}>
                                    Share Profile
                                </Text>
                                <Text style={styles.subText}>
                                    Send to friends
                                </Text>
                            </View>
                        </TouchableOpacity> */}

                        <View style={styles.divider} />

                        {/* Copy Profile Link */}
                        {/* <TouchableOpacity
                            style={styles.actionItem}
                            onPress={handleCopyProfile}
                            activeOpacity={0.6}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                                <Text style={styles.iconText}>🔗</Text>
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={[styles.actionText, { color: theme.text }]}>
                                    Copy Profile URL
                                </Text>
                                <Text style={styles.subText}>
                                    Copy link to clipboard
                                </Text>
                            </View>
                        </TouchableOpacity> */}

                        <View style={styles.divider} />

                        {/* Report User */}
                        {/* <TouchableOpacity
                            style={styles.actionItem}
                            onPress={handleReport}
                            activeOpacity={0.6}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                                <Text style={styles.iconText}>⚠️</Text>
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={[styles.actionText, { color: '#FF9800' }]}>
                                    Report User
                                </Text>
                                <Text style={styles.subText}>
                                    Report inappropriate content
                                </Text>
                            </View>
                        </TouchableOpacity> */}

                        <View style={styles.divider} />

                        {/* Block/Unblock User */}
                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={handleBlockToggle}
                            disabled={isLoading}
                            activeOpacity={0.6}
                        >
                            <View style={[
                                styles.actionIcon,
                                { backgroundColor: isBlocked ? '#E8F5E9' : '#FFEBEE' }
                            ]}>
                                <Text style={styles.iconText}>
                                    {isLoading ? '⏳' : isBlocked ? '✓' : '🚫'}
                                </Text>
                            </View>
                            <View style={styles.actionContent}>
                                <Text
                                    style={[
                                        styles.actionText,
                                        { color: isBlocked ? "#4CAF50" : "#ED4956" },
                                    ]}
                                >
                                    {isLoading
                                        ? "Please wait..."
                                        : isBlocked
                                            ? "Unblock User"
                                            : "Block User"}
                                </Text>
                                <Text style={styles.subText}>
                                    {isBlocked
                                        ? "They will be able to see your profile"
                                        : "They won't be able to find you"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={[styles.divider, { marginVertical: 8 }]} />

                    {/* Cancel */}
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={onClose}
                        activeOpacity={0.6}
                    >
                        <Text style={[styles.cancelText, { color: theme.text }]}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Modal>
    );

};

const styles = StyleSheet.create({
    overlay: { flex: 1 },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.6)",
    },

    menuContainer: {
        position: "absolute",
        top: 90,
        right: 16,
        width: MENU_WIDTH,
    },

    menu: {
        borderRadius: 22,
        overflow: "hidden",
        elevation: 30,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
    },

    header: {
        paddingVertical: 22,
        alignItems: "center",
    },

    avatar: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#4A90E2",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    avatarText: {
        fontSize: 24,
        fontWeight: "700",
        color: "#fff",
    },

    username: {
        fontSize: 17,
        fontWeight: "700",
    },

    actionsList: {
        paddingHorizontal: 16,
    },

    actionItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        gap: 14,
    },

    actionIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },

    iconText: {
        fontSize: 20,
    },

    actionContent: {
        flex: 1,
    },

    actionText: {
        fontSize: 16,
        fontWeight: "600",
    },

    subText: {
        marginTop: 2,
        fontSize: 13,
        color: "#8E8E93",
    },

    divider: {
        height: 1,
        // backgroundColor: "#E5E5EA",


        marginLeft: 58,
    },

    cancelBtn: {
        paddingVertical: 16,
        alignItems: "center",
    },

    cancelText: {
        fontSize: 16,
        fontWeight: "600",
    },
});