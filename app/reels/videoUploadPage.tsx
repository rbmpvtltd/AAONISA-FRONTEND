import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Audio, AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Dimensions,
    PanResponder,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TRIM_HANDLE_WIDTH = 20;

type FilterType = "none" | "warm" | "cool" | "grayscale" | "vintage";

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

const getFilterStyle = (filter: FilterType) => {
    switch (filter) {
        case "warm":
            return { backgroundColor: "rgba(255,165,0,0.2)" };
        case "cool":
            return { backgroundColor: "rgba(0,0,255,0.2)" };
        case "grayscale":
            return { backgroundColor: "rgba(128,128,128,0.3)" };
        case "vintage":
            return { backgroundColor: "rgba(255,192,203,0.2)" };
        default:
            return { backgroundColor: "transparent" };
    }
};

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

    const [isMuted, setIsMuted] = useState(false);
    const prevVideoVolume = useRef(100);
    const prevMusicVolume = useRef(50);

    // ------------------- VIDEO PLAYBACK -------------------
    const togglePlayback = async () => {
        if (!videoRef.current) return;
        const status = await videoRef.current.getStatusAsync();
        if ("isLoaded" in status && status.isLoaded) {
            if (status.isPlaying) {
                await videoRef.current.pauseAsync();
                setIsPlaying(false);
            } else {
                await videoRef.current.playAsync();
                setIsPlaying(true);
            }
        }
    };

    const handleVideoProgress = async (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        const time = status.positionMillis / 1000;
        setCurrentTime(time);

        if (time >= trimEnd) {
            if (videoRef.current) await videoRef.current.setPositionAsync(trimStart * 1000);
            if (musicSound) await musicSound.setPositionAsync(trimStart * 1000);
        } else {
            if (musicSound) await musicSound.setPositionAsync(status.positionMillis);
        }
    };

    // ------------------- VOLUME -------------------
    const adjustVideoVolume = async (vol: number) => {
        setVideoVolume(vol);
        if (videoRef.current && !isMuted) {
            await videoRef.current.setVolumeAsync(vol / 100);
        }
        prevVideoVolume.current = vol;
    };

    const adjustMusicVolume = async (vol: number) => {
        setMusicVolume(vol);
        if (musicSound && !isMuted) {
            await musicSound.setVolumeAsync(vol / 100);
        }
        prevMusicVolume.current = vol;
    };

    // ------------------- MUTE/UNMUTE -------------------
    const toggleMute = async () => {
        setIsMuted((m) => {
            const nextMute = !m;
            if (nextMute) {
                // Save previous volumes before muting
                prevVideoVolume.current = videoVolume;
                prevMusicVolume.current = musicVolume;
                setVideoVolume(0);
                setMusicVolume(0);
                if (videoRef.current) videoRef.current.setVolumeAsync(0);
                if (musicSound) musicSound.setVolumeAsync(0);
            } else {
                setVideoVolume(prevVideoVolume.current);
                setMusicVolume(prevMusicVolume.current);
                if (videoRef.current) videoRef.current.setVolumeAsync(prevVideoVolume.current / 100);
                if (musicSound) musicSound.setVolumeAsync(prevMusicVolume.current / 100);
            }
            return nextMute;
        });
    };

    // ------------------- MUSIC -------------------
    const playMusic = async (music: MusicOption) => {
        if (!music.uri) return;
        try {
            if (musicSound) await musicSound.unloadAsync();
            const sound = new Audio.Sound();
            await sound.loadAsync({ uri: music.uri });
            await sound.setIsLoopingAsync(true);
            await sound.setVolumeAsync(musicVolume / 100);
            await sound.playAsync();
            setMusicSound(sound);
        } catch (err) {
            console.warn("Music playback error", err);
        }
    };

    const selectMusic = async (id: string) => {
        const track = musicOptions.find((m) => m.id === id);
        if (!track) return;
        setSelectedMusicId(id);
        setIsSelectingMusic(false);
        await playMusic(track);
    };

    // ------------------- TRIM HANDLES -------------------
    let initialStart = trimStart;
    let initialEnd = trimEnd;

    const leftHandlePanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                initialStart = trimStart;
            },
            onPanResponderMove: async (_, gesture) => {
                const delta = (gesture.dx / SCREEN_WIDTH) * videoDuration;
                let newStart = initialStart + delta;
                if (newStart < 0) newStart = 0;
                if (newStart > trimEnd - 10) newStart = trimEnd - 10; // Minimum duration 10s
                setTrimStart(newStart);
                if (videoRef.current) await videoRef.current.setPositionAsync(newStart * 1000);
                if (musicSound) await musicSound.setPositionAsync(newStart * 1000);
            },
        })
    ).current;

    const rightHandlePanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                initialEnd = trimEnd;
            },
            onPanResponderMove: async (_, gesture) => {
                const delta = (gesture.dx / SCREEN_WIDTH) * videoDuration;
                let newEnd = initialEnd + delta;
                if (newEnd > videoDuration) newEnd = videoDuration;
                if (newEnd < trimStart + 10) newEnd = trimStart + 10; // Minimum duration 10s
                setTrimEnd(newEnd);
                if (videoRef.current) await videoRef.current.setPositionAsync(trimStart * 1000);
                if (musicSound) await musicSound.setPositionAsync(trimStart * 1000);
            },
        })
    ).current;

    // ------------------- TRIM VALIDATION -------------------
    const checkTrimLength = () => {
        if (trimEnd - trimStart < 10) {
            Alert.alert("Trim too short", "Trim duration cannot be less than 10 seconds.");
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (videoUri) setTrimEnd(videoDuration);
    }, [videoUri, videoDuration]);

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
        setIsMuted(false);
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

            {/* Mute/Unmute Button */}
            {!isSelectingMusic && !isSelectingFilter && !isTrimming && (
            <TouchableOpacity
                style={{ position: "absolute", bottom: 70, right: 20, zIndex: 100 }}
                onPress={toggleMute}
            >
                <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={28} color="white" />
            </TouchableOpacity>
            )}
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
                <View style={{ position: "absolute", bottom: 0, width: "100%", backgroundColor: "#111", padding: 10 }}>
                    {/* Buttons Row */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                        <TouchableOpacity onPress={resetPreview}>
                            <Ionicons name="close-circle" size={28} color="white" />
                        </TouchableOpacity>

                        <View style={{ flexDirection: "row" }}>
                            {/* Shared alert button */}
                            <TouchableOpacity
                                onPress={() => Alert.alert("Shared Alert", "Here is a shared message!")}
                                style={{ marginRight: 12 }}
                            >
                                <Ionicons name="alert-circle" size={28} color="#FFE066" />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setIsSelectingMusic(true)} style={{ marginRight: 15 }}>
                                <Ionicons name="musical-notes" size={28} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsSelectingFilter(true)} style={{ marginRight: 15 }}>
                                <Ionicons name="color-filter-outline" size={28} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    if (!checkTrimLength()) return;
                                    onUpload(trimStart, trimEnd, selectedMusicId, musicVolume);
                                }}
                            >
                                <Ionicons name="cloud-upload" size={28} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Trim bar */}
                    <View style={{ height: 50, backgroundColor: "#333", borderRadius: 8 }}>
                        <View
                            style={{
                                position: "absolute",
                                left: (trimStart / videoDuration) * SCREEN_WIDTH,
                                width: ((trimEnd - trimStart) / videoDuration) * SCREEN_WIDTH,
                                height: 50,
                                backgroundColor: "#555",
                                borderRadius: 8,
                            }}
                        />
                        {/* Left handle */}
                        <View
                            style={{
                                position: "absolute",
                                left: (trimStart / videoDuration) * SCREEN_WIDTH - TRIM_HANDLE_WIDTH / 2,
                                width: TRIM_HANDLE_WIDTH,
                                height: 50,
                                backgroundColor: "#0095f6",
                                borderRadius: 8,
                                shadowColor: "#0095f6",
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 4,
                            }}
                            {...leftHandlePanResponder.panHandlers}
                        />
                        {/* Right handle */}
                        <View
                            style={{
                                position: "absolute",
                                left: (trimEnd / videoDuration) * SCREEN_WIDTH - TRIM_HANDLE_WIDTH / 2,
                                width: TRIM_HANDLE_WIDTH,
                                height: 50,
                                backgroundColor: "#0095f6",
                                borderRadius: 8,
                                shadowColor: "#0095f6",
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 4,
                            }}
                            {...rightHandlePanResponder.panHandlers}
                        />
                    </View>

                    {/* Time indicators */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                        <Text style={{ color: "white" }}>{trimStart.toFixed(1)}s</Text>
                        <Text style={{ color: "white" }}>{(trimEnd - trimStart).toFixed(1)}s</Text>
                        <Text style={{ color: "white" }}>{trimEnd.toFixed(1)}s</Text>
                    </View>
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
            {isSelectingFilter && (
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
            )}
        </View>
    );
};
