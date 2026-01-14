import { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

/* ---------- Base Skeleton ---------- */

const Skeleton = ({
    width,
    height,
    radius = 6,
    style,
}: {
    width: number;
    height: number;
    radius?: number;
    style?: any;
}) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.6,
                    duration: 700,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 700,
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

/* ---------- Story Item Skeleton ---------- */

const StoryItemSkeleton = () => {
    return (
        <View style={styles.storyContainer}>
            {/* Story Circle */}
            <Skeleton width={66} height={66} radius={33} />

            {/* Username */}
            <Skeleton
                width={50}
                height={10}
                radius={4}
                style={{ marginTop: 6 }}
            />
        </View>
    );
};

/* ---------- Story List Skeleton ---------- */

export const StoryListSkeleton = ({ count = 6 }: { count?: number }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {Array.from({ length: count }).map((_, i) => (
                <StoryItemSkeleton key={i} />
            ))}
        </ScrollView>
    );
};

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    storyContainer: {
        alignItems: "center",
        marginHorizontal: 10,
        width: 70,
    },
});
