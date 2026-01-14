import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, View } from "react-native";

const { width, height } = Dimensions.get("window");
const numColumns = 3;
const spacing = 8;
const columnWidth = Math.floor((width - spacing * (numColumns + 1)) / numColumns);

const SkeletonBox = ({
    width,
    height,
    radius = 10,
    style,
}: any) => {
    const opacity = useRef(new Animated.Value(0.35)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.6,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.35,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
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

export const ExploreSkeleton = () => {
    return (
        <View style={{ flexDirection: "row", gap: spacing, padding: spacing }}>
            {Array.from({ length: numColumns }).map((_, col) => (
                <View key={col} style={{ width: columnWidth, gap: spacing }}>
                    {Array.from({ length: 7 }).map((_, i) => {
                        const height =
                            i % 3 === 0
                                ? Math.round(columnWidth * 1.5)
                                : Math.round((columnWidth * 16) / 9);

                        return (
                            <SkeletonBox
                                key={i}
                                width={columnWidth}
                                height={height}
                                radius={12}
                            />
                        );
                    })}
                </View>
            ))}
        </View>
    );
};

export const SearchUserSkeleton = () => (
    <>
        {Array.from({ length: 7 }).map((_, i) => (
            <View
                key={i}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 14,
                    borderRadius: 14,
                    marginBottom: 10,
                    backgroundColor: "#1e1e1e",
                }}
            >
                <SkeletonBox width={48} height={48} radius={24} />
                <View style={{ marginLeft: 12 }}>
                    <SkeletonBox width={140} height={14} radius={6} />
                    <View style={{ height: 8 }} />
                    <SkeletonBox width={90} height={12} radius={6} />
                </View>
            </View>
        ))}
    </>
);
