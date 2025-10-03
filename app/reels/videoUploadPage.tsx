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

// const getFilterStyle = (filter: FilterType) => {
//     switch (filter) {
//         case "warm":
//             return { backgroundColor: "rgba(255,165,0,0.2)" };
//         case "cool":
//             return { backgroundColor: "rgba(0,0,255,0.2)" };
//         case "grayscale":
//             return { backgroundColor: "rgba(128,128,128,0.3)" };
//         case "vintage":
//             return { backgroundColor: "rgba(255,192,203,0.2)" };
//         default:
//             return { backgroundColor: "transparent" };
//     }
// };

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

    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const [filter, setFilter] = useState<FilterType>("none");
    const [isSelectingFilter, setIsSelectingFilter] = useState(false);
    const [isSelectingMusic, setIsSelectingMusic] = useState(false);
    const [isTrimming, setIsTrimming] = useState(false);

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
        <View style={{ flex: 1, backgroundColor: "black" }}>
            {/* Top-right close button */}
            <TouchableOpacity
                style={{ position: "absolute", top: 32, right: 22, zIndex: 100 }}
                onPress={onDiscard}
            >
                <Ionicons name="close" size={32} color="white" />
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
                <View style={{ position: "absolute", bottom: 0, width: "100%", maxHeight: 300, backgroundColor: "#000" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>Select Music</Text>
                        <TouchableOpacity onPress={() => setIsSelectingMusic(false)}>
                            <Ionicons name="close-circle" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {musicOptions.map((m) => (
                            <TouchableOpacity
                                key={m.id}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    padding: 10,
                                    backgroundColor: selectedMusicId === m.id ? "#222" : "transparent",
                                }}
                                onPress={() => selectMusic(m.id)}
                            >
                                <Ionicons name="musical-notes" size={28} color="white" />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ color: "white" }}>{m.title}</Text>
                                    <Text style={{ color: "gray" }}>{m.artist}</Text>
                                </View>
                                {selectedMusicId === m.id && <Ionicons name="checkmark-circle" size={28} color="#0095f6" />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Filter Overlay */}
            {/* {isSelectingFilter && (
                <View style={{ position: "absolute", bottom: 0, width: "100%", maxHeight: 200, backgroundColor: "rgba(0,0,0,0.5)", paddingVertical: 10 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>Filters</Text>
                        <TouchableOpacity onPress={() => setIsSelectingFilter(false)}>
                            <Ionicons name="close-circle" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 10 }}>
                        {(["none", "warm", "cool", "grayscale", "vintage"] as FilterType[]).map((f) => (
                            <TouchableOpacity
                                key={f}
                                style={{
                                    marginRight: 10,
                                    padding: 5,
                                    borderColor: filter === f ? "#0095f6" : "transparent",
                                    borderWidth: 2,
                                    borderRadius: 6,
                                }}
                                onPress={() => setFilter(f)}
                            >
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 6,
                                        backgroundColor: "transparent",
                                        overflow: "hidden",
                                    }}
                                >
                                    <View style={[{ flex: 1, backgroundColor: "transparent" }, getFilterStyle(f)]} />
                                </View>
                                <Text style={{ color: "white", textAlign: "center", marginTop: 4 }}>{f}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )} */}
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

        </View>
    );
};
