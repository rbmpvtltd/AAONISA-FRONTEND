import { useAppTheme } from "@/src/constants/themeHelper";
import { useFeedStore } from "@/src/store/useFeedStore";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { FeedItem } from "./feedItem"; // fixed import

export const FeedList = () => {
    const theme = useAppTheme();
    const isFocused = useIsFocused();
    const { photos, addPhotos, setPhotos, setPage, setLoading, loading, isMuted, toggleMute } =
        useFeedStore();

    const [activeIndex, setActiveIndex] = useState(0);

    const videoAssets = [
        require("../../../assets/video/videoplayback9.mp4"),
        require("../../../assets/video/videoplayback10.mp4"),
        require("../../../assets/video/videoplayback11.mp4"),
        require("../../../assets/video/videoplayback12.mp4"),
        require("../../../assets/video/videoplayback13.mp4"),
    ];

    useEffect(() => {
        if (photos.length > 0) return;

        const dummyData = Array.from({ length: 10 }).map((_, i) => ({
            id: i + 1,
            title: "Feed Video " + (i + 1),
            imageUrl: videoAssets[i % videoAssets.length],
            profilePic: `https://randomuser.me/api/portraits/men/${(i + 10) % 100}.jpg`,
            username: "user_" + (i + 1),
            likes: Math.floor(Math.random() * 100),
            liked: false,
            saved: false,
            // comments: [],
            comments: Math.floor(Math.random() * 50), //  number
    shares: Math.floor(Math.random() * 20),    //  number

        }));

        addPhotos(dummyData);
        setPage(1);
    }, []);

    const handleLike = useCallback(
        (id: number) =>
            setPhotos((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
                        : p
                )
            ),
        [setPhotos]
    );

    const handleSave = useCallback(
        (id: number) => setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))),
        [setPhotos]
    );

    const handleComment = useCallback((id: number) => router.push(`../../../comment/${id}`), []);
    const handleShare = useCallback((id: number) => console.log("Share", id), []);

    // Insta-style scroll autoplay (not full page)
    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
    }, []);

    const viewabilityConfig = { itemVisiblePercentThreshold: 70 };

    return (
        <FlatList
            data={photos}
            renderItem={({ item, index }) => (
                <FeedItem
                    item={item}
                    isActive={index === activeIndex}
                    isFocused={isFocused}
                    onLike={handleLike}
                    onSave={handleSave}
                    onComment={handleComment}
                    onShare={handleShare}
                    theme={theme}
                    isMuted={isMuted}
                    toggleMute={toggleMute}
                />
            )}
            keyExtractor={(item) => `${item.id}`}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
                loading ? (
                    <View style={{ paddingVertical: 20 }}>
                        <ActivityIndicator size="large" color={theme.text} />
                    </View>
                ) : null
            }
        />
    );
};
