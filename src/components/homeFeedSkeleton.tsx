import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    View,
    ViewStyle
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

interface SkeletonProps {
    width: number | string;
    height: number | string;
    radius?: number;
    style?: ViewStyle | ViewStyle[];
}

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
                    width: width as any,
                    height: height as any,
                    borderRadius: radius,
                    backgroundColor: "#2a2a2a",
                    opacity,
                },
                style,
            ]}
        />
    );
};

export const FeedItemSkeleton: React.FC<{ theme: any }> = ({ theme }) => {
    return (
        <View style={[styles.reel, { backgroundColor: theme.background }]}>
            {/* Header Skeleton */}
            <View style={[styles.header, { backgroundColor: theme.overlay }]}>
                {/* Profile Picture */}
                <Skeleton width={40} height={40} radius={20} />

                {/* Username */}
                <View style={{ marginLeft: 10, flex: 1 }}>
                    <Skeleton width={120} height={16} radius={4} />
                </View>
            </View>

            {/* Video Container Skeleton */}
            <View style={styles.videoContainer}>
                <Skeleton
                    width="100%"
                    height="100%"
                    radius={0}
                    style={{ backgroundColor: "#1a1a1a" }}
                />

                {/* Play button overlay */}
                <View style={styles.playButtonOverlay}>
                    {/* <Skeleton width={60} height={60} radius={30} /> */}
                    <Icon name="play" size={40} color="white" />
                </View>

                {/* Volume button skeleton */}
                <View style={styles.volumeBtn}>
                    {/* <Skeleton width={24} height={24} radius={12} /> */}
                    <Icon name="volume-mute" size={24} color="white" />

                </View>
            </View>

            {/* Actions Row Skeleton */}
            <View style={styles.actionsRow}>
                <View style={styles.leftActions}>
                    {/* Like button */}
                    <View style={styles.actionBtn}>
                        {/* <Skeleton width={22} height={22} radius={4} /> */}
                        <Icon name="heart" size={22} color="red" />
                        <Skeleton width={30} height={14} radius={4} style={{ marginLeft: 6 }} />
                    </View>

                    {/* Comment button */}
                    <View style={styles.actionBtn}>
                        {/* <Skeleton width={22} height={22} radius={4} /> */}
                        <Icon name="chatbubble-outline" size={22} color={theme.text} />
                        <Skeleton width={30} height={14} radius={4} style={{ marginLeft: 6 }} />
                    </View>

                    {/* Share button */}
                    <View style={styles.actionBtn}>
                        {/* <Skeleton width={22} height={22} radius={4} /> */}
                        <Icon name="paper-plane-outline" size={22} color={theme.text} />
                        <Skeleton width={30} height={14} radius={4} style={{ marginLeft: 6 }} />
                    </View>
                </View>
            </View>

            {/* Caption Skeleton */}
            <View style={styles.captionContainer}>
                <Skeleton width="95%" height={16} radius={4} />
                <Skeleton width="85%" height={16} radius={4} style={{ marginTop: 8 }} />
                <Skeleton width="70%" height={16} radius={4} style={{ marginTop: 8 }} />
            </View>
        </View>
    );
};

// Multiple Feed Items Skeleton (for loading list)
export const FeedListSkeleton: React.FC<{ theme: any; count?: number }> = ({
    theme,
    count = 3
}) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <FeedItemSkeleton key={index} theme={theme} />
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    reel: {
        height: 700,
        position: "relative",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    videoContainer: {
        width: "100%",
        height: "80%",
        position: "relative",
    },
    playButtonOverlay: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginLeft: -30,
        marginTop: -30,
    },
    volumeBtn: {
        position: "absolute",
        bottom: 80,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 8,
        borderRadius: 20,
        zIndex: 5,
    },
    actionsRow: {
        flexDirection: "row",
        gap: 15,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "space-between",
    },
    leftActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
    },
    captionContainer: {
        paddingHorizontal: 10,
        paddingBottom: 10,
        flex: 1,
    },
});