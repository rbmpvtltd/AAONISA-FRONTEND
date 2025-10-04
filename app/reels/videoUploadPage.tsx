import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Audio, AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FinalUpload from "./finalUpload";
import MusicScreen from "./musicPanel";
import TextOverlay, { OverlayMetadata } from "./textOverlay";
import TwoPointSlider from "./trimSlider";
const SCREEN_WIDTH = Dimensions.get("window").width;
const TRIM_HANDLE_WIDTH = 20;

type FilterType = "none" | "warm" | "cool" | "grayscale" | "vintage" | "sepia" | "bright" | "dark";

const getFilterStyle = (filter: FilterType) => {
    switch (filter) {
        case "warm": return { backgroundColor: "rgba(255,165,0,0.2)" };
        case "cool": return { backgroundColor: "rgba(0,0,255,0.2)" };
        case "grayscale": return { backgroundColor: "rgba(128,128,128,0.3)" };
        case "vintage": return { backgroundColor: "rgba(255,192,203,0.2)" };
        case "sepia": return { backgroundColor: "rgba(112,66,20,0.2)" };
        case "bright": return { backgroundColor: "rgba(255,255,255,0.2)" };
        case "dark": return { backgroundColor: "rgba(0,0,0,0.3)" };
        default: return { backgroundColor: "transparent" };
    }
};


interface MusicOption {
    id: string;
    title: string;
    artist: string;
    uri?: string; // from API
}

interface VideoPreviewProps {
    videoUri: string;
    contentType: "story" | "reels" | "news";
    musicOptions: MusicOption[];
    onDiscard: () => void;
    onUpload: (
        trimStart: number,
        trimEnd: number,
        selectedMusicId: string | null,
        musicVolume: number
    ) => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
    videoUri,
    contentType,
    musicOptions,
    onDiscard,
    onUpload,
}) => {
    const videoRef = useRef<Video>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoVolume, setVideoVolume] = useState(100);
    const [musicVolume, setMusicVolume] = useState(50);
    const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
    const [musicSound, setMusicSound] = useState<Audio.Sound | null>(null);
    const [overlays, setOverlays] = useState<OverlayMetadata[]>([]);

    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const [filter, setFilter] = useState<FilterType>("none");
    const [isSelectingFilter, setIsSelectingFilter] = useState(false);
    const [isSelectingMusic, setIsSelectingMusic] = useState(false);
    const [isTrimming, setIsTrimming] = useState(false);
    const [isFinalUploading, setIsUploading] = useState(false);

    const prevMusicVolume = useRef(50);

    // ---------------- MUSIC MANAGEMENT ----------------
    const playMusic = async (music: MusicOption) => {
        if (!music.uri) return;

        try {
            // If same music is already playing, just return
            if (selectedMusicId === music.id && musicSound) return;

            // Stop previous music if exists
            if (musicSound) {
                await musicSound.stopAsync();
                await musicSound.unloadAsync();
            }

            const sound = new Audio.Sound();
            await sound.loadAsync({ uri: music.uri });
            await sound.setIsLoopingAsync(true);
            await sound.setVolumeAsync(musicVolume / 100);

            // Sync music with video
            if (videoRef.current) {
                const status = await videoRef.current.getStatusAsync();
                if ("isLoaded" in status && status.isLoaded) {
                    await sound.setPositionAsync(status.positionMillis);
                    if (status.isPlaying) await sound.playAsync();
                }
            }

            setMusicSound(sound);
        } catch (err) {
            console.warn("Music playback error:", err);
        }
    };

    const stopMusic = async () => {
        if (!musicSound) return;
        try {
            await musicSound.stopAsync();
            await musicSound.unloadAsync();
        } catch (err) {
            console.warn("Failed to stop music:", err);
        } finally {
            setMusicSound(null);
            setSelectedMusicId(null);
        }
    };

    const selectMusic = async (id: string | null) => {
        if (id === null) {
            await stopMusic(); // unselect music
            return;
        }
        const track = musicOptions.find((m) => m.id === id);
        if (!track) return;

        setSelectedMusicId(id);
        setIsSelectingMusic(false);
        await playMusic(track);
    };

    // ---------------- VIDEO & MUSIC SYNC ----------------
    const togglePlayback = async () => {
        if (!videoRef.current) return;
        const status = await videoRef.current.getStatusAsync();
        if (!("isLoaded" in status) || !status.isLoaded) return;

        if (status.isPlaying) {
            await videoRef.current.pauseAsync();
            setIsPlaying(false);
            if (musicSound) await musicSound.pauseAsync();
        } else {
            await videoRef.current.playAsync();
            setIsPlaying(true);
            if (musicSound) await musicSound.playAsync();
        }
    };

    // Only update music position when video is playing
    const handleVideoProgress = async (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        const time = status.positionMillis / 1000;
        setCurrentTime(time);
        if (time >= trimEnd) {
            if (videoRef.current) await videoRef.current.setPositionAsync(trimStart * 1000);
        }
    };
    let volumeTimeout: NodeJS.Timeout | number | null = null;

    // ---------------- VOLUME ----------------
    const adjustVideoVolume = async (vol: number) => {
        if (!videoRef.current) return;
        const status = await videoRef.current.getStatusAsync();
        if (!status.isLoaded) return;
        const wasPlaying = isPlaying;
        await videoRef.current.setVolumeAsync(vol / 100);
        if (wasPlaying) await videoRef.current.playAsync();
    };

    const adjustMusicVolume = async (vol: number) => {
        setMusicVolume(vol);
        if (musicSound) await musicSound.setVolumeAsync(vol / 100);
        prevMusicVolume.current = vol;
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.setPositionAsync(trimStart * 1000);
        }
        if (videoUri) setTrimEnd(videoDuration);
    }, [videoUri, videoDuration, trimStart]);

    // ------------------- RESET -------------------
    const resetPreview = async () => {
        setIsPlaying(false);
        setVideoVolume(100);
        setMusicVolume(50);
        setSelectedMusicId(null);
        setIsTrimming(false);
        setTrimStart(0);
        setTrimEnd(videoDuration);
        setFilter("none");
        setIsSelectingFilter(false);
        if (musicSound) await musicSound.unloadAsync();
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: "black" }}>
            {/* Top-right close button */}

            {!isFinalUploading ? (
                <>
                    {/* Your existing VideoPreview UI goes here */}
                    <TouchableOpacity
                        style={{ position: "absolute", top: 32, right: 22, zIndex: 100 }}
                        onPress={onDiscard}
                    >
                        <Ionicons name="close" size={32} color="white" />
                    </TouchableOpacity>
                    {/* Next (Upload) button below the close button */}
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            top: 80, // just below the close button
                            right: 26,
                            zIndex: 100,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onPress={() => setIsUploading(true)}
                    >
                        <Ionicons name="cloud-upload-outline" size={24} color="white" />
                    </TouchableOpacity>
                    {/* Video */}
                    <Video
                        ref={videoRef}
                        source={{ uri: videoUri }}
                        style={{ flex: 1, width: "100%" }}
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay={false}
                        onLoad={(status) => {
                            if (status.isLoaded && status.durationMillis) {
                                setVideoDuration(status.durationMillis / 1000);
                                const maxDuration = contentType === "story" ? 30 : 120;
                                setTrimEnd(Math.min(maxDuration, status.durationMillis / 1000));
                            }
                        }}
                        onPlaybackStatusUpdate={handleVideoProgress}
                        volume={videoVolume / 100}
                    />
                    {/* Filter Overlay */}
                    <View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }, getFilterStyle(filter)]} />

                    {/* Play/Pause */}
                    <TouchableOpacity
                        style={{ position: "absolute", top: "45%", left: SCREEN_WIDTH / 2 - 25 }}
                        onPress={togglePlayback}
                    >
                        <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={50} color="white" />
                    </TouchableOpacity>

                    {/* Controls to open panels */}
                    {!isSelectingMusic && !isSelectingFilter && !isTrimming && (
                        <View
                            style={{
                                position: "absolute",
                                bottom: 120,
                                width: "100%",
                                flexDirection: "row",
                                justifyContent: "space-around",
                                paddingHorizontal: 30,
                                zIndex: 110,
                            }}
                        >
                            <TouchableOpacity onPress={() => setIsSelectingMusic(true)}>
                                <Ionicons name="musical-notes" size={32} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsTrimming(true)}>
                                <Ionicons name="cut" size={32} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsSelectingFilter(true)}>
                                <Ionicons name="color-filter-outline" size={32} color="white" />
                            </TouchableOpacity>
                            {contentType === "story" && !isFinalUploading && (
                        <>  
                            <TouchableOpacity
                                    style={{ marginBottom: 12 }}
                                    onPress={() =>
                                        setOverlays((prev) => [
                                            ...prev,
                                            {
                                                id: Date.now().toString(),
                                                text: "#example",
                                                x: 50,
                                                y: 100,
                                                scale: 1,
                                                rotation: 0,
                                                fontSize: 24,
                                                color: "white",
                                            },
                                        ])
                                    }
                                >
                                    <Ionicons name="pricetag-outline" size={32} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() =>
                                        setOverlays((prev) => [
                                            ...prev,
                                            {
                                                id: Date.now().toString(),
                                                text: "@mention",
                                                x: 50,
                                                y: 200,
                                                scale: 1,
                                                rotation: 0,
                                                fontSize: 24,
                                                color: "white",
                                            },
                                        ])
                                    }
                                >
                                    <Ionicons name="at-outline" size={32} color="white" />
                                </TouchableOpacity>
                            {overlays.map((overlay) => (
                                <TextOverlay
                                    key={overlay.id}
                                    overlay={overlay}
                                    onUpdate={(updated) => {
                                        setOverlays((prev) =>
                                            prev.map((o) => (o.id === updated.id ? updated : o))
                                        );
                                    }}
                                />
                            ))}
                        </>
                    )}
                        </View>
                    )}

                    {/* Trim Panel */}
                    {isTrimming && (
                        <View style={{ position: "absolute", bottom: 0, width: "100%", backgroundColor: "#111" }}>
                            {/* Buttons Row */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                                <TouchableOpacity onPress={resetPreview}>
                                    <Ionicons name="close-circle" size={28} color="white" />
                                </TouchableOpacity>

                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => setIsTrimming(false)}>
                                        <Ionicons name="checkmark-circle" size={28} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Trim bar */}
                            <TwoPointSlider
                                startSec={trimStart}
                                endSec={trimEnd}
                                minTrim={10}
                                totalTime={videoDuration}
                                onTrimChange={(start, end) => {
                                    setTrimStart(start);
                                    setTrimEnd(end);
                                }}
                            />
                        </View>
                    )}

                    {/* Volume Sliders */}
                    {!isSelectingMusic && !isSelectingFilter && !isTrimming && (
                        <View style={{ position: "absolute", bottom: 10, width: "100%", flexDirection: "row", justifyContent: "space-around" }}>
                            <View style={{ alignItems: "center" }}>
                                <Text style={{ color: "white" }}>Video Vol</Text>
                                <Slider
                                    style={{ width: 140, height: 40 }}
                                    minimumValue={0}
                                    maximumValue={100}
                                    value={videoVolume}
                                    onValueChange={adjustVideoVolume}
                                    onSlidingComplete={(vol) => {
                                        setVideoVolume(vol);
                                        if (vol === 0 || vol === 100) {
                                            adjustVideoVolume(vol);
                                        };
                                    }}
                                    minimumTrackTintColor="#0095f6"
                                    maximumTrackTintColor="#ccc"
                                />
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <Text style={{ color: "white" }}>Music Vol</Text>
                                <Slider
                                    style={{ width: 140, height: 40 }}
                                    minimumValue={0}
                                    maximumValue={100}
                                    value={musicVolume}
                                    onValueChange={adjustMusicVolume}
                                    minimumTrackTintColor="#0095f6"
                                    maximumTrackTintColor="#ccc"
                                />
                            </View>
                        </View>
                    )}

                    {/* Music Selection Overlay */}
                    {isSelectingMusic && (
                        <MusicScreen />

                    )}

                    {isSelectingFilter && (
                        <View style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            maxHeight: 220,
                            backgroundColor: "rgba(0,0,0,0.7)",
                            paddingVertical: 12
                        }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 }}>
                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Filters</Text>
                                <TouchableOpacity onPress={() => setIsSelectingFilter(false)}>
                                    <Ionicons name="close-circle" size={28} color="white" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginTop: 10 }}>
                                {(["none", "warm", "cool", "grayscale", "vintage", "sepia", "bright", "dark"] as FilterType[]).map((f) => (
                                    <TouchableOpacity
                                        key={f}
                                        style={{
                                            marginRight: 12,
                                            alignItems: "center",
                                        }}
                                        onPress={() => setFilter(f)}
                                    >
                                        <View style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 12,
                                            borderWidth: filter === f ? 3 : 0,
                                            borderColor: "#0095f6",
                                            overflow: "hidden",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#222"
                                        }}>
                                            <View style={[{ width: "100%", height: "100%" }, getFilterStyle(f)]} />
                                        </View>
                                        <Text style={{ color: "white", fontSize: 12, marginTop: 4, textTransform: "capitalize" }}>{f}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                        

                </>
            ) : (
                <FinalUpload
                    contentType={contentType}
                    onCancel={() => setIsUploading(false)}
                    onUpload={(data) => {
                        // Handle final upload
                        console.log("Upload data:", data);
                        console.log("Trim:", trimStart, trimEnd);
                        console.log("Selected music:", selectedMusicId, "Volume:", musicVolume);

                        // Call your API / backend here
                        onUpload(trimStart, trimEnd, selectedMusicId, musicVolume);

                        // Reset state if needed
                        setIsUploading(false);
                    }}
                />
            )}

        </View></GestureHandlerRootView>
    );
};
