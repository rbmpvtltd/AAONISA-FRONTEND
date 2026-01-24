import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import { useAppTheme } from "../constants/themeHelper";

const NotificationSkeletonItem = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const { width } = useWindowDimensions();
    const theme = useAppTheme();


    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    return (
        <View style={styles.container}>
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: theme.searchBg }]} />

            {/* Text */}
            <View style={styles.textContainer}>
                <View style={[styles.lineShort, { backgroundColor: theme.searchBg }]} />
                <View style={[styles.lineLong, { backgroundColor: theme.searchBg }]} />
            </View>

            {/* Shimmer Overlay */}
            <Animated.View
                style={[
                    styles.shimmer,
                    { backgroundColor: theme.searchBg },
                    { transform: [{ translateX }] },
                ]}
            />
        </View>
    );
};

export default NotificationSkeletonItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 16,
        overflow: "hidden",
        alignItems: "center",
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 25,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        gap: 8,
    },
    lineShort: {
        width: "60%",
        height: 12,
        borderRadius: 6,
    },
    lineLong: {
        width: "40%",
        height: 10,
        borderRadius: 6,
    },
    shimmer: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "40%",
    },
});
