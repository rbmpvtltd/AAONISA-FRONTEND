import { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';

const SkeletonBox = ({ width, height, borderRadius = 8, style = {} }: any) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [animatedValue]);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: '#2a2a2a',
                    opacity,
                },
                style,
            ]}
        />
    );
};

const ReelsSkeleton = () => {
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

    const AVATAR_SIZE = SCREEN_WIDTH * 0.08;
    const ACTION_ICON_SIZE = SCREEN_WIDTH * 0.08;
    const bottomContentBottom = SCREEN_HEIGHT * 0.12;
    const rightActionsBottom = SCREEN_HEIGHT * 0.12;

    return (
        <View style={styles.container}>
            {/* Top Navigation Bar Skeleton */}
            <View style={styles.topBar}>
                <View style={styles.tabsContainer}>
                    <SkeletonBox width={70} height={20} borderRadius={12} style={{ marginHorizontal: 10 }} />
                    <SkeletonBox width={70} height={20} borderRadius={12} style={{ marginHorizontal: 10 }} />
                    <SkeletonBox width={90} height={20} borderRadius={12} style={{ marginHorizontal: 10 }} />
                </View>
            </View>

            {/* Main Video Area Skeleton */}
            <View style={styles.videoSkeleton}>
                <SkeletonBox width={SCREEN_WIDTH} height={SCREEN_HEIGHT} borderRadius={0} />
            </View>

            {/* Bottom Content Skeleton */}
            <View style={[styles.bottomContent, { bottom: bottomContentBottom, left: SCREEN_WIDTH * 0.04, right: SCREEN_WIDTH * 0.20 }]}>
                {/* User Info */}
                <View style={styles.userInfo}>
                    <SkeletonBox
                        width={AVATAR_SIZE}
                        height={AVATAR_SIZE}
                        borderRadius={AVATAR_SIZE / 2}
                        style={{ marginRight: 8 }}
                    />
                    <SkeletonBox width={120} height={16} borderRadius={8} />
                </View>

                {/* Caption Lines */}
                <View style={{ marginBottom: 8 }}>
                    <SkeletonBox width="90%" height={14} borderRadius={6} style={{ marginBottom: 6 }} />
                    <SkeletonBox width="70%" height={14} borderRadius={6} />
                </View>

                {/* Music Info */}
                <View style={styles.musicInfo}>
                    <SkeletonBox width={16} height={16} borderRadius={4} style={{ marginRight: 8 }} />
                    <SkeletonBox width={150} height={14} borderRadius={6} />
                </View>

                {/* Time Ago */}
                <SkeletonBox width={80} height={12} borderRadius={6} style={{ marginTop: 8 }} />
            </View>

            {/* Right Actions Skeleton */}
            <View style={[styles.rightActions, { bottom: rightActionsBottom, right: SCREEN_WIDTH * 0.04 }]}>
                {/* Like */}
                <View style={styles.actionButton}>
                    <SkeletonBox
                        width={ACTION_ICON_SIZE}
                        height={ACTION_ICON_SIZE}
                        borderRadius={ACTION_ICON_SIZE / 2}
                    />
                    <SkeletonBox width={30} height={12} borderRadius={6} style={{ marginTop: 4 }} />
                </View>

                {/* Comment */}
                <View style={styles.actionButton}>
                    <SkeletonBox
                        width={ACTION_ICON_SIZE}
                        height={ACTION_ICON_SIZE}
                        borderRadius={ACTION_ICON_SIZE / 2}
                    />
                    <SkeletonBox width={30} height={12} borderRadius={6} style={{ marginTop: 4 }} />
                </View>

                {/* Share */}
                <View style={styles.actionButton}>
                    <SkeletonBox
                        width={ACTION_ICON_SIZE}
                        height={ACTION_ICON_SIZE}
                        borderRadius={ACTION_ICON_SIZE / 2}
                    />
                    <SkeletonBox width={30} height={12} borderRadius={6} style={{ marginTop: 4 }} />
                </View>

                {/* More Options */}
                <View style={styles.actionButton}>
                    <SkeletonBox
                        width={ACTION_ICON_SIZE * 0.8}
                        height={ACTION_ICON_SIZE * 0.8}
                        borderRadius={(ACTION_ICON_SIZE * 0.8) / 2}
                    />
                </View>
            </View>

            {/* Progress Bar Skeleton */}
            <View style={styles.progressBar}>
                <SkeletonBox width={SCREEN_WIDTH} height={2} borderRadius={0} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    topBar: {
        position: 'absolute',
        top: 35,
        left: 0,
        right: 0,
        zIndex: 999,
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingVertical: 10,
    },
    tabsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    videoSkeleton: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    bottomContent: {
        position: 'absolute',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    musicInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    rightActions: {
        position: 'absolute',
        alignItems: 'center',
    },
    actionButton: {
        alignItems: 'center',
        marginBottom: 24,
    },
    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default ReelsSkeleton;