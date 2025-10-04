    import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

    const MusicScreen = () => {
    const [isSelectingMusic, setIsSelectingMusic] = useState(false);
    const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
    const [soundDuration, setSoundDuration] = useState(0);
    const [soundPosition, setSoundPosition] = useState(0);
    const [range, setRange] = useState({ from: 0, to: 0 });
    const soundRef = useRef<Audio.Sound | null>(null);

    const [isBuffering, setIsBuffering] = useState(false);
    const [currentSongId, setCurrentSongId] = useState<string | null>(null);
    const bufferRef = useRef<number>(0);

    const [startInput, setStartInput] = useState({ min: "0", sec: "0" });
    const [endInput, setEndInput] = useState({ min: "0", sec: "0" });

    const musicOptions = [
        {
        id: "1",
        title: "Song A",
        artist: "Artist A",
        uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        {
        id: "2",
        title: "Song B",
        artist: "Artist B",
        uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        },
        {
        id: "3",
        title: "Song C",
        artist: "Artist C",
        uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        },
    ];

    useEffect(() => {
        return () => {
        if (soundRef.current) {
            soundRef.current.unloadAsync();
        }
        };
    }, []);

    const onPlaybackStatusUpdate = (status: any) => {
        if (!status.isLoaded) return;

        setSoundPosition(status.positionMillis ?? 0);
        setSoundDuration(status.durationMillis ?? 0);

        if (status.isPlaying && range.to > 0 && status.positionMillis > range.to) {
        soundRef.current?.setPositionAsync(range.from);
        }
    };

    const playMusic = async (id: string) => {
        const music = musicOptions.find((m) => m.id === id);
        if (!music) return;

        bufferRef.current += 1;
        const bufferId = bufferRef.current;

        setIsBuffering(true);
        setCurrentSongId(id);

        if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        }

        try {
        const { sound, status } = await Audio.Sound.createAsync(
            { uri: music.uri },
            { shouldPlay: false, volume: 1.0 },
            (status) => {
            // Debug states
            console.log("Playback Status:", status);

            if (!status.isLoaded) return;

            // ignore old buffer updates
            if (bufferId !== bufferRef.current) return;

            setSoundPosition(status.positionMillis ?? 0);
            setSoundDuration(status.durationMillis ?? 0);

            // looping range
            if (status.isPlaying && range.to > 0 && status.positionMillis > range.to) {
                soundRef.current?.setPositionAsync(range.from);
            }
            }
        );

        soundRef.current = sound;

        // Buffer ready, play only if latest selection
        if (bufferId === bufferRef.current) {
            setIsBuffering(false);
            await sound.playAsync();
            if (status.isLoaded) {
            const duration = status.durationMillis ?? 0;
            setRange({ from: 0, to: duration });
            setSoundDuration(duration);
            setSoundPosition(0);
            setStartInput({ min: "0", sec: "0" });
            setEndInput({
                min: String(Math.floor(duration / 60000)),
                sec: String(Math.floor((duration / 1000) % 60)),
            });
            }
        }
        } catch (err) {
        console.log("Error buffering/play:", err);
        if (bufferId === bufferRef.current) setIsBuffering(false);
        }
    };

    const handleSelectMusic = (id: string) => {
        setSelectedMusicId(id);
        playMusic(id);
    };

    const handleDeselect = async () => {
        setSelectedMusicId(null);
        setRange({ from: 0, to: 0 });
        setSoundPosition(0);
        setSoundDuration(0);
        setIsBuffering(false);
        if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        }
    };

    const handleSeek = async (value: number) => {
        if (soundRef.current) {
        await soundRef.current.setPositionAsync(value);
        setSoundPosition(value);
        }
    };

    const formatTime = (millis: number) => {
        const totalSec = Math.floor(millis / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const applyRangeFromInputs = () => {
        const fromMs =
        parseInt(startInput.min || "0") * 60000 +
        parseInt(startInput.sec || "0") * 1000;
        const toMs =
        parseInt(endInput.min || "0") * 60000 +
        parseInt(endInput.sec || "0") * 1000;

        if (fromMs >= 0 && toMs <= soundDuration && fromMs < toMs) {
        setRange({ from: fromMs, to: toMs });
        if (soundRef.current) {
            soundRef.current.setPositionAsync(fromMs);
            setSoundPosition(fromMs);
        }
        }
    };

    return (
        <View
        style={{
            flex: 1,
            backgroundColor: "#111",
            justifyContent: "center",
            alignItems: "center",
        }}
        >
        <TouchableOpacity
            onPress={() => setIsSelectingMusic(true)}
            style={{
            backgroundColor: "#0095f6",
            padding: 15,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            }}
        >
            <Ionicons name="musical-notes" size={24} color="white" />
            <Text
            style={{
                color: "white",
                marginLeft: 8,
                flexShrink: 1,
                flexWrap: "wrap",
            }}
            >
            Open Music Selector
            </Text>
        </TouchableOpacity>

        {isBuffering && (
            <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator size="small" color="#00f6ff" />
            <Text style={{ color: "white", marginLeft: 8 }}>Buffering...</Text>
            </View>
        )}

        {isSelectingMusic && (
            <View
            style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                maxHeight: 420,
                backgroundColor: "#000",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                overflow: "hidden",
            }}
            >
            {/* Header */}
            <View
                style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#222",
                }}
            >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                Select Music
                </Text>
                <TouchableOpacity onPress={() => setIsSelectingMusic(false)}>
                <Ionicons name="close-circle" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {/* Music List */}
            <ScrollView>
                {musicOptions.map((m) => {
                const isSelected = selectedMusicId === m.id;
                return (
                    <View
                    key={m.id}
                    style={{
                        marginVertical: 4,
                        marginHorizontal: 8,
                        borderRadius: 8,
                        borderWidth: isSelected ? 2 : 0,
                        borderColor: isSelected ? "#00f6ff" : "transparent",
                        backgroundColor: isSelected ? "#111" : "transparent",
                        padding: 10,
                    }}
                    >
                    <TouchableOpacity
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => handleSelectMusic(m.id)}
                    >
                        <Ionicons name="musical-notes" size={28} color="white" />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text
                            style={{ color: "white", fontSize: 15, flexWrap: "wrap" }}
                        >
                            {m.title}
                        </Text>
                        <Text style={{ color: "gray", fontSize: 13 }}>{m.artist}</Text>
                        </View>
                        {isSelected && (
                        <Ionicons name="checkmark-circle" size={28} color="#0095f6" />
                        )}
                    </TouchableOpacity>

                    {isSelected && (
                        <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 10,
                        }}
                        >
                        <TouchableOpacity onPress={handleDeselect}>
                            <Ionicons name="close-circle" size={26} color="red" />
                        </TouchableOpacity>
                        <Text
                            style={{
                            color: "#00f6ff",
                            fontSize: 8,
                            flexShrink: 1,
                            flexWrap: "wrap",
                            }}
                        >
                            Selected
                        </Text>
                        </View>
                    )}
                    </View>
                );
                })}
            </ScrollView>

            {/* Bottom Control Bar */}
            {selectedMusicId && (
                <View
                style={{
                    backgroundColor: "#1a1a1a",
                    padding: 12,
                    borderTopWidth: 1,
                    borderTopColor: "#333",
                }}
                >
                <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={0}
                    maximumValue={soundDuration}
                    value={soundPosition}
                    onSlidingComplete={handleSeek}
                    minimumTrackTintColor="#0095f6"
                    maximumTrackTintColor="#444"
                    thumbTintColor="#00f6ff"
                />
                <View
                    style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 4,
                    }}
                >
                    <Text style={{ color: "white" }}>{formatTime(soundPosition)}</Text>
                    <Text style={{ color: "white" }}>{formatTime(soundDuration)}</Text>
                </View>

                {/* Inputs for start/end */}
                <View
                    style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: 10,
                    alignItems: "center",
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: "white", marginRight: 4, fontSize: 8 }}>Start</Text>
                    <TextInput
                        style={{
                        backgroundColor: "#222",
                        color: "white",
                        padding: 4,
                        width: 35,
                        marginRight: 2,
                        textAlign: "center",
                        borderRadius: 4,
                        }}
                        keyboardType="numeric"
                        value={startInput.min}
                        onChangeText={(t) =>
                        setStartInput((p) => ({ ...p, min: t.replace(/[^0-9]/g, "") }))
                        }
                        placeholder="m"
                        placeholderTextColor="#777"
                    />
                    <Text style={{ color: "white" }}>:</Text>
                    <TextInput
                        style={{
                        backgroundColor: "#222",
                        color: "white",
                        padding: 4,
                        width: 35,
                        marginLeft: 2,
                        textAlign: "center",
                        borderRadius: 4,
                        }}
                        keyboardType="numeric"
                        value={startInput.sec}
                        onChangeText={(t) =>
                        setStartInput((p) => ({ ...p, sec: t.replace(/[^0-9]/g, "") }))
                        }
                        placeholder="s"
                        placeholderTextColor="#777"
                    />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: "white", marginRight: 4, fontSize: 8 }}>End</Text>
                    <TextInput
                        style={{
                        backgroundColor: "#222",
                        color: "white",
                        padding: 4,
                        width: 35,
                        marginRight: 2,
                        textAlign: "center",
                        borderRadius: 4,
                        }}
                        keyboardType="numeric"
                        value={endInput.min}
                        onChangeText={(t) =>
                        setEndInput((p) => ({ ...p, min: t.replace(/[^0-9]/g, "") }))
                        }
                        placeholder="m"
                        placeholderTextColor="#777"
                    />
                    <Text style={{ color: "white" }}>:</Text>
                    <TextInput
                        style={{
                        backgroundColor: "#222",
                        color: "white",
                        padding: 4,
                        width: 35,
                        marginLeft: 2,
                        textAlign: "center",
                        borderRadius: 4,
                        }}
                        keyboardType="numeric"
                        value={endInput.sec}
                        onChangeText={(t) =>
                        setEndInput((p) => ({ ...p, sec: t.replace(/[^0-9]/g, "") }))
                        }
                        placeholder="s"
                        placeholderTextColor="#777"
                    />
                    </View>

                    <TouchableOpacity
                    onPress={applyRangeFromInputs}
                    style={{
                        backgroundColor: "#0095f6",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 6,
                    }}
                    >
                    <Text style={{ color: "white", fontSize: 8 }}>Apply</Text>
                    </TouchableOpacity>
                </View>
                </View>
            )}
            </View>
        )}
        </View>
    );
    };

export default MusicScreen;

// // MusicScreen.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { Audio } from "expo-av";
// import React, { useEffect, useRef, useState } from "react";
// import { ActivityIndicator, Dimensions, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// // --- Custom Trim Slider for Music ---
// const SLIDER_WIDTH = Dimensions.get("window").width - 40;
// const THUMB_SIZE = 24;
// const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

// const MusicTrimSlider = ({
//   totalTime = 60,
//   minTrim = 3,
//   startSec = 0,
//   endSec = 60,
//   onTrimChange = (s: number, e: number) => {},
// }) => {
//   const [start, setStart] = useState(startSec);
//   const [end, setEnd] = useState(endSec);

//   const startRef = useRef(start);
//   const endRef = useRef(end);

//   const startBasePos = useRef(0);
//   const endBasePos = useRef(0);

//   const getPosFromSec = (sec: number) => (sec / totalTime) * SLIDER_WIDTH;
//   const getSecFromPos = (pos: number) => clamp(Math.round((pos / SLIDER_WIDTH) * totalTime), 0, totalTime);

//   useEffect(() => {
//     startRef.current = start;
//     endRef.current = end;
//     onTrimChange(start, end);
//   }, [start, end]);

//   const updateStart = (pos: number) => {
//     const nextStart = getSecFromPos(pos);
//     if (end - nextStart >= minTrim) setStart(nextStart);
//   };

//   const updateEnd = (pos: number) => {
//     const nextEnd = getSecFromPos(pos);
//     if (nextEnd - start >= minTrim) setEnd(nextEnd);
//   };

//   const startPan = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         startBasePos.current = getPosFromSec(startRef.current);
//       },
//       onPanResponderMove: (_, gesture) => {
//         const pos = clamp(startBasePos.current + gesture.dx, 0, getPosFromSec(endRef.current - minTrim));
//         updateStart(pos);
//       },
//     })
//   ).current;

//   const endPan = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         endBasePos.current = getPosFromSec(endRef.current);
//       },
//       onPanResponderMove: (_, gesture) => {
//         const pos = clamp(endBasePos.current + gesture.dx, getPosFromSec(startRef.current + minTrim), SLIDER_WIDTH);
//         updateEnd(pos);
//       },
//     })
//   ).current;

//   return (
//     <View style={styles.trimContainer}>
//       <View style={styles.timeRow}>
//         <Text style={styles.timeLabel}>{start}s</Text>
//         <Text style={styles.timeLabel}>{end}s</Text>
//       </View>

//       <View style={styles.sliderTrack}>
//         <View style={[styles.trimRegion, { left: getPosFromSec(start), width: getPosFromSec(end) - getPosFromSec(start) }]} />
//         <View {...startPan.panHandlers} style={[styles.thumb, { left: getPosFromSec(start) - THUMB_SIZE / 2 }]} />
//         <View {...endPan.panHandlers} style={[styles.thumb, { left: getPosFromSec(end) - THUMB_SIZE / 2 }]} />
//       </View>

//       <Text style={[styles.trimInfo, { width: SLIDER_WIDTH, textAlign: "center" }]}>{`Trim Length: ${end - start}s`}</Text>
//     </View>
//   );
// };

// // --- Music Screen ---
// const MusicScreen = () => {
//   const [isSelectingMusic, setIsSelectingMusic] = useState(false);
//   const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
//   const [soundPosition, setSoundPosition] = useState(0);
//   const [soundDuration, setSoundDuration] = useState(0);
//   const [range, setRange] = useState({ from: 0, to: 0 });

//   const [isBuffering, setIsBuffering] = useState(false);
//   const bufferRef = useRef<number>(0);

//   const soundRef = useRef<Audio.Sound | null>(null);

//   const musicOptions = [
//     { id: "1", title: "Song A", artist: "Artist A", uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
//     { id: "2", title: "Song B", artist: "Artist B", uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
//     { id: "3", title: "Song C", artist: "Artist C", uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
//   ];

//   useEffect(() => {
//     return () => {
//       if (soundRef.current) soundRef.current.unloadAsync();
//     };
//   }, []);

//   const onPlaybackStatusUpdate = (status: any) => {
//     if (!status.isLoaded) return;
//     setSoundPosition(status.positionMillis ?? 0);
//     setSoundDuration(status.durationMillis ?? 0);

//     if (status.isPlaying && range.to > 0 && status.positionMillis > range.to) {
//       soundRef.current?.setPositionAsync(range.from);
//     }
//   };

//   const playMusic = async (id: string) => {
//     const music = musicOptions.find((m) => m.id === id);
//     if (!music) return;

//     bufferRef.current += 1;
//     const bufferId = bufferRef.current;

//     setIsBuffering(true);
//     setSelectedMusicId(id);

//     if (soundRef.current) {
//       await soundRef.current.unloadAsync();
//       soundRef.current = null;
//     }

//     try {
//       const { sound, status } = await Audio.Sound.createAsync(
//         { uri: music.uri },
//         { shouldPlay: false, volume: 1.0 },
//         (status) => {
//           if (!status.isLoaded) return;
//           if (bufferId !== bufferRef.current) return;
//           onPlaybackStatusUpdate(status);
//         }
//       );

//       soundRef.current = sound;

//       if (bufferId === bufferRef.current) {
//         setIsBuffering(false);
//         await sound.playAsync();
//         if(!status.isLoaded) return;
//         const duration = status.durationMillis ?? 0;
//         setRange({ from: 0, to: duration });
//         setSoundDuration(duration);
//         setSoundPosition(0);
//       }
//     } catch (err) {
//       console.log("Play error:", err);
//       if (bufferId === bufferRef.current) setIsBuffering(false);
//     }
//   };

//   const handleDeselect = async () => {
//     setSelectedMusicId(null);
//     setRange({ from: 0, to: 0 });
//     setSoundPosition(0);
//     setSoundDuration(0);
//     setIsBuffering(false);
//     if (soundRef.current) {
//       await soundRef.current.unloadAsync();
//       soundRef.current = null;
//     }
//   };

//   const handleSeek = async (value: number) => {
//     if (soundRef.current) {
//       await soundRef.current.setPositionAsync(value);
//       setSoundPosition(value);
//     }
//   };

//   const formatTime = (ms: number) => {
//     const totalSec = Math.floor(ms / 1000);
//     const m = Math.floor(totalSec / 60);
//     const s = totalSec % 60;
//     return `${m}:${s < 10 ? "0" : ""}${s}`;
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "#111", justifyContent: "center", alignItems: "center" }}>
//       <TouchableOpacity
//         onPress={() => setIsSelectingMusic(true)}
//         style={{ backgroundColor: "#0095f6", padding: 15, borderRadius: 8, flexDirection: "row", alignItems: "center" }}
//       >
//         <Ionicons name="musical-notes" size={24} color="white" />
//         <Text style={{ color: "white", marginLeft: 8, flexShrink: 1, flexWrap: "wrap" }}>Open Music Selector</Text>
//       </TouchableOpacity>

//       {isBuffering && (
//         <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
//           <ActivityIndicator size="small" color="#00f6ff" />
//           <Text style={{ color: "white", marginLeft: 8 }}>Buffering...</Text>
//         </View>
//       )}

//       {isSelectingMusic && (
//         <View style={{ position: "absolute", bottom: 0, width: "100%", maxHeight: 420, backgroundColor: "#000", borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: "hidden" }}>
//           {/* Header */}
//           <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, borderBottomColor: "#222" }}>
//             <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Select Music</Text>
//             <TouchableOpacity onPress={() => setIsSelectingMusic(false)}>
//               <Ionicons name="close-circle" size={28} color="white" />
//             </TouchableOpacity>
//           </View>

//           {/* Music List */}
//           <ScrollView>
//             {musicOptions.map((m) => {
//               const isSelected = selectedMusicId === m.id;
//               return (
//                 <View key={m.id} style={{ marginVertical: 4, marginHorizontal: 8, borderRadius: 8, borderWidth: isSelected ? 2 : 0, borderColor: isSelected ? "#00f6ff" : "transparent", backgroundColor: isSelected ? "#111" : "transparent", padding: 10 }}>
//                   <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => playMusic(m.id)}>
//                     <Ionicons name="musical-notes" size={28} color="white" />
//                     <View style={{ marginLeft: 10, flex: 1 }}>
//                       <Text style={{ color: "white", fontSize: 15, flexWrap: "wrap" }}>{m.title}</Text>
//                       <Text style={{ color: "gray", fontSize: 13 }}>{m.artist}</Text>
//                     </View>
//                     {isSelected && <Ionicons name="checkmark-circle" size={28} color="#0095f6" />}
//                   </TouchableOpacity>

//                   {isSelected && (
//                     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
//                       <TouchableOpacity onPress={handleDeselect}>
//                         <Ionicons name="close-circle" size={26} color="red" />
//                       </TouchableOpacity>
//                       <Text style={{ color: "#00f6ff", fontSize: 8, flexShrink: 1, flexWrap: "wrap" }}>Selected</Text>
//                     </View>
//                   )}
//                 </View>
//               );
//             })}
//           </ScrollView>

//           {/* Bottom Control + Trim Slider */}
//           {selectedMusicId && (
//             <View style={{ backgroundColor: "#1a1a1a", padding: 12, borderTopWidth: 1, borderTopColor: "#333" }}>
//               <MusicTrimSlider
//                 totalTime={soundDuration / 1000}
//                 startSec={range.from / 1000}
//                 endSec={range.to / 1000}
//                 onTrimChange={(startSec, endSec) => {
//                   const fromMs = startSec * 1000;
//                   const toMs = endSec * 1000;
//                   setRange({ from: fromMs, to: toMs });
//                   if (soundRef.current) soundRef.current.setPositionAsync(fromMs);
//                   setSoundPosition(fromMs);
//                 }}
//               />

//               <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
//                 <Text style={{ color: "white" }}>{formatTime(soundPosition)}</Text>
//                 <Text style={{ color: "white" }}>{formatTime(soundDuration)}</Text>
//               </View>

//               <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
//                 <TouchableOpacity
//                   style={{ backgroundColor: "#0095f6", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}
//                   onPress={async () => {
//                     if (soundRef.current) {
//                       const status = await soundRef.current.getStatusAsync();
//                       if(status.isLoaded === false) return
//                       if (status.isPlaying) await soundRef.current.pauseAsync();
//                       else await soundRef.current.playAsync();
//                     }
//                   }}
//                 >
//                   <Text style={{ color: "white", fontSize: 12 }}>Play/Pause</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={{ backgroundColor: "#ff4d4d", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}
//                   onPress={handleDeselect}
//                 >
//                   <Text style={{ color: "white", fontSize: 12 }}>Stop</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   trimContainer: { marginTop: 8, alignItems: "center", width: SLIDER_WIDTH + 10 },
//   timeRow: { width: SLIDER_WIDTH, flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
//   sliderTrack: { width: SLIDER_WIDTH, height: 24, borderRadius: 12, position: "relative", justifyContent: "center", backgroundColor: "#333", marginBottom: 8 },
//   trimRegion: { position: "absolute", top: 5, height: 14, borderRadius: 7, backgroundColor: "#349afe33" },
//   thumb: { width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: THUMB_SIZE / 2, backgroundColor: "#1976d2", borderWidth: 2, borderColor: "white", position: "absolute", top: 0, zIndex: 2 },
//   timeLabel: { fontSize: 14, color: "#ccc" },
//   trimInfo: { marginTop: 4, color: "#1976d2", fontSize: 10 },
// });

// export default MusicScreen;
