import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera"; // assuming expo-camera
import { useEffect, useRef, useState } from "react";
import { PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// agar aap koi aur package use kar rahe ho toh yahan change kar lena
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

interface CameraScreenProps {
    onImagePick: (uri: string) => void;
    setContentType: (type: 'story' | 'reels' | 'news') => void;
    contentType: 'story' | 'reels' | 'news';
    preSelectedAudio?: {
        id: string;
        title: string;
        artist: string;
        uri: string;
    } | null;
}


const CameraScreen = ({ onImagePick, setContentType, contentType, preSelectedAudio }: CameraScreenProps) => {
    //   const cameraRef = useRef(null);
    const zoomSliderRef = useRef<View>(null)
    const audioSoundRef = useRef<Audio.Sound | null>(null);

    const [facing, setFacing] = useState<"front" | "back">("back");
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const [zoom, setZoom] = useState(0);
    const cameraRef = useRef<CameraView>(null);
    const recordingStartTimeRef = useRef<number | null>(null);
    const autoStopTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | number | null>(null);
    const [audioDuration, setAudioDuration] = useState<number | null>(null);


    // ✅ FIX 1: Reset zoom when component mounts or audio changes
    useEffect(() => {
        console.log('🎬 CameraScreen mounted - Resetting zoom to 0');
        setZoom(0); // Force reset zoom to 0
    }, [preSelectedAudio]); // Reset when audio changes

    // ✅ FIX 2: Reset zoom when content type changes
    useEffect(() => {
        console.log('📹 Content type changed:', contentType);
        setZoom(0); // Reset zoom when switching between story/reels/news
    }, [contentType]);

    const getContentTypeIcon = (type: string) => {
        switch (type) {
            case "story":
                return "camera-outline";
            case "reels":
                return "film-outline";
            case "news":
                return "newspaper-outline";
            default:
                return "ellipse-outline";
        }
    };

    useEffect(() => {
        const setupAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });
                console.log('🎵 Audio session initialized');
            } catch (error) {
                console.error('Audio setup error:', error);
            }
        };

        setupAudio();
    }, []);

    const toggleCameraFacing = () => {
        setFacing((prev) => (prev === "back" ? "front" : "back"));
        setZoom(0); // ✅ Reset zoom when flipping camera
    };

    useEffect(() => {
        const getAudioDuration = async () => {
            if (preSelectedAudio?.uri) {
                try {
                    const { sound, status } = await Audio.Sound.createAsync(
                        { uri: preSelectedAudio.uri },
                        { shouldPlay: false }
                    );

                    if (status.isLoaded && status.durationMillis) {
                        const durationInSeconds = Math.floor(status.durationMillis / 1000);
                        setAudioDuration(durationInSeconds);
                        console.log('🎵 Audio duration:', durationInSeconds, 'seconds');
                    }

                    await sound.unloadAsync();
                } catch (error) {
                    console.error('Error getting audio duration:', error);
                }
            }
        };

        getAudioDuration();
    }, [preSelectedAudio]);


    // const startRecordingWithAudio = async () => {
    //     if (!cameraRef.current) {
    //         Toast.show({ type: "error", text1: 'Error', text2: 'Camera not ready.' });
    //         return;
    //     }

    //     try {
    //         setIsRecording(true);
    //         setRecordTime(0);
    //         // recordingStartTimeRef.current = Date.now();
    //         const startTime = Date.now();
    //         recordingStartTimeRef.current = startTime;

    //         // 1️⃣ Play audio if selected
    //         if (preSelectedAudio?.uri) {
    //             const { sound } = await Audio.Sound.createAsync(
    //                 { uri: preSelectedAudio.uri },
    //                 { shouldPlay: true, volume: 1.0, isLooping: false }
    //             );
    //             audioSoundRef.current = sound;
    //             await sound.playAsync();
    //             console.log('🎵 Audio started playing');
    //         }

    //         // 2️⃣ Start timer
    //         // timerIntervalRef.current = setInterval(() => {
    //         //     if (recordingStartTimeRef.current) {
    //         //         const elapsedSec = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
    //         //         setRecordTime(elapsedSec);
    //         //     }
    //         // }, 1000);

    //         timerIntervalRef.current = setInterval(() => {
    //             setRecordTime(Math.floor((Date.now() - startTime) / 1000));
    //         }, 1000);

    //         // 3️⃣ Calculate max duration
    //         let maxDurationSec: number;
    //         if (preSelectedAudio && audioDuration) {
    //             maxDurationSec = audioDuration;
    //             console.log('📹 Recording will stop after', maxDurationSec, 'seconds (audio length)');
    //         } else {
    //             maxDurationSec = contentType === 'story' ? 30 : 120;
    //             console.log('📹 Recording will stop after', maxDurationSec, 'seconds (default)');
    //         }

    //         // 4️⃣ Auto-stop timer
    //         autoStopTimeoutRef.current = setTimeout(() => {
    //             console.log('⏱️ Auto-stopping recording...');
    //             if (cameraRef.current) {
    //                 cameraRef.current.stopRecording();
    //             }
    //         }, maxDurationSec * 100);

    //         // 5️⃣ Start camera recording
    //         // const maxDurationSec = contentType === 'story' ? 30 : 120;
    //         const options = { maxDuration: maxDurationSec, quality: '720p', mute: false };
    //         const video = await cameraRef.current.recordAsync(options);

    //         // 6️⃣ Calculate elapsed time
    //         // const elapsed = Date.now() - (recordingStartTimeRef.current ?? 0);
    //         const elapsedMs = Date.now() - startTime;
    //         const elapsedSec = Math.floor(elapsedMs / 1000);

    //         // ✅ IMPORTANT: Cleanup FIRST(before checking duration)
    //         await stopRecordingWithAudio();

    //         // 7️⃣ Check minimum duration(10 seconds)
    //         if (elapsedSec < 10000) {
    //             console.log('❌ Video too short:', elapsedSec / 1000, 'seconds');
    //             Toast.show({
    //                 type: "error",
    //                 text1: 'Video too short!',
    //                 text2: 'Please record at least 10 seconds.'
    //             });
    //             return; // ✅ Exit WITHOUT calling onImagePick
    //         }

    //         // 8️⃣ Check if video exists
    //         if (!video) {
    //             throw new Error('Video is null');
    //         }

    //         // 9️⃣ SUCCESS - Send video(only if >= 10 seconds)
    //         console.log('✅ Recording completed:', video.uri);
    //         console.log('✅ Duration:', Math.floor(elapsedSec / 1000), 'seconds');

    //         onImagePick(video.uri); // ✅ This only runs if video >= 10 seconds

    //         Toast.show({
    //             type: "success",
    //             text1: 'Video recorded!',
    //             text2: `Duration: ${Math.floor(elapsedSec / 1000)} seconds`
    //         });
    //         console.log('====================================');
    //         console.log("assssssssssssssss");
    //         console.log('====================================');
    //         // Toast.show({
    //         //     type: "error",
    //         //     text1: 'Video too short!',
    //         //     text2: 'Please record at least 10 seconds.'
    //         // });
    //     } catch (err: any) {
    //         console.error('❌ Recording error:', err);
    //         await stopRecordingWithAudio(); // Cleanup on error
    //         Toast.show({
    //             type: "error",
    //             text1: 'Recording failed',
    //             text2: err.message || 'Please try again'
    //         });
    //     }
    // };

    const startRecordingWithAudio = async () => {
        if (!cameraRef.current) {
            Toast.show({ type: "error", text1: 'Error', text2: 'Camera not ready.' });
            return;
        }

        try {
            setIsRecording(true);
            setRecordTime(0);
            const startTime = Date.now();
            recordingStartTimeRef.current = startTime;

            // 1️⃣ Play audio if selected
            if (preSelectedAudio?.uri) {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: preSelectedAudio.uri },
                    { shouldPlay: true, volume: 1.0, isLooping: false }
                );
                audioSoundRef.current = sound;
                await sound.playAsync();
                console.log('🎵 Audio started playing');
            }

            // 2️⃣ Start timer
            timerIntervalRef.current = setInterval(() => {
                setRecordTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);

            // 3️⃣ Calculate max duration
            let maxDurationSec: number;
            if (preSelectedAudio && audioDuration) {
                maxDurationSec = audioDuration;
                console.log('📹 Recording will stop after', maxDurationSec, 'seconds (audio length)');
            } else {
                maxDurationSec = contentType === 'story' ? 30 : 120;
                console.log('📹 Recording will stop after', maxDurationSec, 'seconds (default)');
            }

            // 4️⃣ Auto-stop timer
            autoStopTimeoutRef.current = setTimeout(() => {
                console.log('⏱️ Auto-stopping recording...');
                if (cameraRef.current) {
                    cameraRef.current.stopRecording();
                }
            }, maxDurationSec * 1000);

            // 5️⃣ Start camera recording
            const options = { maxDuration: maxDurationSec, quality: '720p', mute: false };
            const video = await cameraRef.current.recordAsync(options);

            // 6️⃣ Calculate elapsed time
            const elapsedMs = Date.now() - startTime;
            const elapsedSec = Math.floor(elapsedMs / 1000);

            console.log(`📹 Recording stopped. Duration: ${elapsedSec} seconds`);

            // ✅ FIX: Check 10 SECONDS, not 10000
            if (elapsedSec < 10) {
                console.log('❌ Video too short:', elapsedSec, 'seconds');

                // Cleanup BAAD mein
                await stopRecordingWithAudio();

                Toast.show({
                    type: "error",
                    text1: 'Video too short!',
                    text2: 'Please record at least 10 seconds.'
                });
                return;
            }

            // 7️⃣ Cleanup
            await stopRecordingWithAudio();

            // 8️⃣ Check if video exists
            if (!video) {
                throw new Error('Video is null');
            }

            // 9️⃣ SUCCESS
            console.log('✅ Recording completed:', video.uri);
            console.log('✅ Duration:', elapsedSec, 'seconds');

            onImagePick(video.uri);

            Toast.show({
                type: "success",
                text1: 'Video recorded!',
                text2: `Duration: ${elapsedSec} seconds`
            });

        } catch (err: any) {
            console.error('❌ Recording error:', err);
            await stopRecordingWithAudio();
            Toast.show({
                type: "error",
                text1: 'Recording failed',
                text2: err.message || 'Please try again'
            });
        }
    };

    const stopRecordingWithAudio = async () => {
        console.log('🛑 Stopping recording...');

        setIsRecording(false);
        recordingStartTimeRef.current = null;

        // Stop audio
        if (audioSoundRef.current) {
            try {
                await audioSoundRef.current.stopAsync();
                await audioSoundRef.current.unloadAsync();
                audioSoundRef.current = null;
                console.log('🎵 Audio stopped');
            } catch (e) {
                console.log('Error stopping audio:', e);
            }
        }

        // Stop camera
        if (cameraRef.current) {
            try {
                cameraRef.current.stopRecording();
                console.log('📹 Camera stopped');
            } catch (e) {
                console.log('Error stopping camera:', e);
            }
        }

        // Clear timers
        if (autoStopTimeoutRef.current) {
            clearTimeout(autoStopTimeoutRef.current);
            autoStopTimeoutRef.current = null;
        }

        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }

        setRecordTime(0);
    };

    useEffect(() => {
        return () => {
            if (audioSoundRef.current) {
                audioSoundRef.current.unloadAsync();
            }
            if (autoStopTimeoutRef.current) {
                clearTimeout(autoStopTimeoutRef.current);
            }
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, []);


    const pickVideo = async () => {
        try {
            // Permission check
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                // alert("Permission to access gallery is required!");
                Toast.show({ type: "info", text1: 'Permission to access gallery is required!' })
                return;
            }

            // Open gallery with only video filter
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["videos"],
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled) {
                const videoUri = result.assets[0].uri;
                console.log("Picked video:", videoUri);
                onImagePick(videoUri);
            } else {
                console.log("User cancelled video picker");
            }
        } catch (err) {
            console.error("Error picking video:", err);
        }
    };

    const zoomPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                if (zoomSliderRef.current) {
                    zoomSliderRef.current.measure((x, y, width, height, pageX, pageY) => {
                        const touchY = evt.nativeEvent.pageY;
                        const relativeY = touchY - pageY;
                        const sliderHeight = height;

                        const newZoom = Math.max(0, Math.min(1, 1 - (relativeY / sliderHeight)));
                        setZoom(newZoom);
                    });
                }
            },
        })
    ).current;

    return (
        <View style={{ flex: 1, backgroundColor: "black" }}>
            {/* Content Type Selector */}
            <View style={styles.contentTypeContainer}>
                {(["story", "reels", "news"] as const).map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.contentTypeButton,
                            contentType === type && styles.contentTypeButtonActive,
                        ]}
                        onPress={() => {
                            setContentType(type);
                            setZoom(0);
                        }}
                    >
                        <Ionicons
                            name={getContentTypeIcon(type)}
                            size={20}
                            color={contentType === type ? "#0095f6" : "white"}
                        />
                        <Text
                            style={[
                                styles.contentTypeText,
                                contentType === type && styles.contentTypeTextActive,
                            ]}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Camera View */}
            <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
                zoom={zoom}
                mode="video"
            />

            {/* Timer Display */}
            {isRecording && (
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>
                        {recordTime}/{audioDuration || (contentType === "story" ? "30" : "120")}
                    </Text>
                </View>
            )}

            {/* Audio Indicator */}
            {preSelectedAudio && (
                <View style={styles.audioIndicator}>
                    <Ionicons name="musical-notes" size={20} color="#0095f6" />
                    <Text style={styles.audioName}>{preSelectedAudio.title}</Text>
                    {audioDuration && (
                        <Text style={styles.audioDuration}> • {audioDuration}s</Text>
                    )}
                </View>
            )}


            {/* Vertical Zoom Slider */}
            <View
                ref={zoomSliderRef}
                style={styles.zoomSliderContainer}
                {...zoomPanResponder.panHandlers}
            >
                <View style={styles.zoomSliderTrack}>
                    <View
                        style={[
                            styles.zoomSliderProgress,
                            { height: `${zoom * 100}%` },
                        ]}
                    />
                </View>
                <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
            </View>

            {/* Controls */}
            <View style={styles.buttonContainer}>
                {/* Flip Camera */}
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing} disabled={isRecording}>
                    <Ionicons name="camera-reverse-outline" size={30} color="white" />
                </TouchableOpacity>

                {/* Record Button */}
                {/* <TouchableOpacity
                    style={[styles.recordButton, isRecording && styles.recordingButton]}
                    onPress={isRecording ? stopRecording : startRecording}
                /> */}
                <TouchableOpacity
                    onPress={isRecording ? stopRecordingWithAudio : startRecordingWithAudio}
                    style={[
                        styles.recordButton,
                        isRecording && styles.recordingButton
                    ]}
                    disabled={isRecording && !cameraRef.current}
                >
                    {/* Button content */}
                </TouchableOpacity>



                {/* Gallery */}
                <TouchableOpacity style={styles.button} onPress={pickVideo} disabled={isRecording} >
                    <Ionicons name="images-outline" size={30} color="white" />
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default CameraScreen;

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
    contentTypeContainer: {
        position: "absolute",
        top: 50,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        zIndex: 10,
        paddingHorizontal: 20,
    },
    audioIndicator: {
        position: 'absolute',
        top: 120,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#0095f6',
    },
    audioName: {
        color: 'white',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    audioDuration: {
        color: '#0095f6',
        fontSize: 12,
        fontWeight: '600',
    },
    contentTypeButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    contentTypeButtonActive: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderColor: "#0095f6",
    },
    contentTypeText: {
        color: "white",
        marginLeft: 6,
        fontWeight: "500",
    },
    contentTypeTextActive: {
        color: "#0095f6",
        fontWeight: "bold",
    },
    buttonContainer: {
        position: "absolute",
        bottom: 40,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        backgroundColor: "transparent",
        paddingHorizontal: 80,
    },
    button: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 10,
        borderRadius: 30,
    },
    recordButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderWidth: 4,
        borderColor: "white",
    },
    recordingButton: {
        backgroundColor: "red",
        borderColor: "red",
    },
    timerContainer: {
        position: "absolute",
        top: 100,
        alignSelf: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    timerText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    zoomSliderContainer: {
        position: "absolute",
        right: 20,
        top: "30%",
        bottom: "30%",
        alignItems: "center",
        justifyContent: "center",
        width: 50,
    },
    zoomSliderTrack: {
        width: 4,
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 2,
        justifyContent: "flex-end",
    },
    zoomSliderProgress: {
        width: "100%",
        backgroundColor: "#0095f6",
        borderRadius: 2,
    },
    zoomText: {
        color: "white",
        marginTop: 10,
        fontWeight: "bold",
        fontSize: 12,
    },
});


