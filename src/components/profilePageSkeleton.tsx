import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View, ViewStyle } from "react-native";

interface SkeletonProps {
    width: number;
    height: number;
    radius?: number;
    style?: ViewStyle | ViewStyle[];
}

const { width, height } = Dimensions.get("window");
const profilePicSize = width * 0.22;
const POSTS_PER_ROW = 3;
const POST_SPACING = 2; // Instagram uses very small gaps
const POST_SIZE = (width - (POST_SPACING * (POSTS_PER_ROW + 1))) / POSTS_PER_ROW;


const Skeleton: React.FC<SkeletonProps> = ({
    width,
    height,
    radius = 6,
    style,
}) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.6,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        loop.start();
        return () => loop.stop();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius: radius,
                    backgroundColor: "#2a2a2a",
                    opacity,
                },
                style,
            ]}
        />
    );
};

export const CurrentUserTopHeaderSkeleton: React.FC<{ theme: any; isOwnProfile: boolean }> = ({ theme, isOwnProfile }) => {
    return (
        <View style={styles.topHeader}>
            <Skeleton width={120} height={20} />
            {isOwnProfile && (
                <View style={{ opacity: 0.3 }}>
                    {/* <Skeleton width={25} height={25} /> */}
                    <MaterialIcons name="menu" size={26} color={theme.text} />
                </View>
            )}
        </View>
    );
};

export function TopHeaderSkeleton(theme: any) {
    return (
        <View style={styles.topHeader}>
            <Skeleton width={120} height={20} />
        </View>
    );
};

export function ProfileHeaderSkeleton() {
    return (
        <View style={styles.header}>
            <Skeleton
                width={profilePicSize}
                height={profilePicSize}
                radius={profilePicSize / 2}
            />

            <View style={{ flex: 1, marginLeft: width * 0.05 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={{ alignItems: "center" }}>
                            <Skeleton width={40} height={14} />
                            <View style={{ height: 6 }} />
                            <Skeleton width={50} height={12} />
                        </View>
                    ))}
                </View>

                <View style={{ flexDirection: "row", marginTop: 12 }}>
                    <Skeleton width={60} height={14} />
                    <View style={{ width: 12 }} />
                    <Skeleton width={60} height={14} />
                </View>
            </View>
        </View>
    );
};



export function UserInfoSkeleton() {
    return (
        <View style={styles.userInfo}>
            <Skeleton width={140} height={16} />
            <View style={{ height: 8 }} />
            <Skeleton width={220} height={13} />
            <View style={{ height: 6 }} />
            <Skeleton width={180} height={13} />

            <View style={{ flexDirection: "row", marginTop: 14, gap: 10 }}>
                <Skeleton width={140} height={36} radius={6} />
                <Skeleton width={140} height={36} radius={6} />
            </View>
        </View>
    );
};


export const CurrentUserInfoSkeleton: React.FC<{ isOwnProfile: boolean }> = ({ isOwnProfile }) => {
    return (
        <View style={styles.userInfo}>
            <Skeleton width={140} height={16} />
            <View style={{ height: 8 }} />
            <Skeleton width={220} height={13} />
            <View style={{ height: 6 }} />
            <Skeleton width={180} height={13} />

            {/* Only show buttons skeleton if NOT own profile */}
            {!isOwnProfile && (
                <View style={{ flexDirection: "row", marginTop: 14, gap: 10 }}>
                    <Skeleton width={140} height={36} radius={6} />
                    <Skeleton width={140} height={36} radius={6} />
                </View>
            )}
        </View>
    );
};

export function TabsSkeleton(theme: any) {
    return (
        <View style={[styles.tabs, { backgroundColor: theme.background }]}>
            <View style={styles.tab}>
                <View style={{ opacity: 0.3 }}>
                    <Ionicons name="play-circle-outline" size={22} color={theme.text} />
                </View>
            </View>
            <View style={styles.tab}>
                <View style={{ opacity: 0.3 }}>
                    <Ionicons name="person-circle-outline" size={22} color={theme.text} />
                </View>
            </View>
        </View>
    );
};
export function PostGridSkeleton() {
    return (
        <View>
            {Array.from({ length: 4 }).map((_, rowIndex) => (
                <View key={rowIndex} style={[styles.row, { flexDirection: 'row', justifyContent: 'flex-start', }]}>
                    {Array.from({ length: POSTS_PER_ROW }).map((_, colIndex) => (
                        <Skeleton
                            key={colIndex}
                            width={POST_SIZE}
                            height={POST_SIZE}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
    topHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.015,
    },
    header: {
        flexDirection: "row",
        padding: width * 0.04,
        alignItems: "center",
    },
    userInfo: {
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.01,
    },
    row: {
        gap: POST_SPACING,
        paddingHorizontal: POST_SPACING,
        marginBottom: POST_SPACING,
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

});