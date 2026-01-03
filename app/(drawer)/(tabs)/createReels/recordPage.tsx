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

    const toggleCameraFacing = () => {
        setFacing((prev) => (prev === "back" ? "front" : "back"));
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
    //     try {
    //         setIsRecording(true);

    //         // If audio is selected, play it during recording
    //         if (preSelectedAudio?.uri) {
    //             const { sound } = await Audio.Sound.createAsync(
    //                 { uri: preSelectedAudio.uri },
    //                 { shouldPlay: true, volume: 1.0, isLooping: true }
    //             );
    //             audioSoundRef.current = sound;
    //             await sound.playAsync();
    //         }

    //         // Start camera recording here
    //         // ... your existing camera recording code

    //         const startRecording = async () => {
    //             if (!cameraRef.current) {
    //                 // Alert.alert('Error', 'Camera not ready.');
    //                 Toast.show({ type: "error", text1: 'Error', text2: 'Camera not ready.' })
    //                 return;
    //             }

    //             try {
    //                 setIsRecording(true);
    //                 setRecordTime(0);
    //                 recordingStartTimeRef.current = Date.now();

    //                 timerIntervalRef.current = setInterval(() => {
    //                     if (recordingStartTimeRef.current) {
    //                         const elapsedSec = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
    //                         setRecordTime(elapsedSec);
    //                     }
    //                 }, 1000);

    //                 const durationMiliSecs = contentType === 'story' ? 30000 : 120000;

    //                 autoStopTimeoutRef.current = setTimeout(() => {
    //                     if (cameraRef.current) cameraRef.current.stopRecording();
    //                 }, durationMiliSecs);
    //                 const maxDurationSec = contentType === 'story' ? 30 : 120;
    //                 const options = { maxDuration: maxDurationSec, quality: '720p', mute: false };
    //                 const video = await cameraRef.current.recordAsync(options);

    //                 const elapsed = Date.now() - (recordingStartTimeRef.current ?? 0);
    //                 if (elapsed < 2000) {
    //                     // Alert.alert('Too short', 'Please record at least 2 seconds.');
    //                     Toast.show({ type: "info", text1: 'Too short', text2: 'Please record at least 2 seconds.' })
    //                     return;
    //                 }

    //                 if (!video) throw new Error('Video is null');

    //                 onImagePick(video.uri);
    //                 // Alert.alert('Video recorded successfully.');
    //                 Toast.show({ type: "success", text1: 'Video recorded successfully.' })
    //             } catch (err: any) {
    //                 // Alert.alert('Error', err.message || 'Recording failed');
    //                 Toast.show({ type: "error", text1: 'Error', text2: err.message || 'Recording failed' })
    //             } finally {
    //                 setIsRecording(false);
    //                 recordingStartTimeRef.current = null;

    //                 if (autoStopTimeoutRef.current) {
    //                     clearTimeout(autoStopTimeoutRef.current);
    //                     autoStopTimeoutRef.current = null;
    //                 }

    //                 if (timerIntervalRef.current) {
    //                     clearInterval(timerIntervalRef.current);
    //                     timerIntervalRef.current = null;
    //                 }

    //                 setRecordTime(0);
    //             }
    //         };


    //     } catch (error) {
    //         console.error('Error starting recording with audio:', error);
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
            recordingStartTimeRef.current = Date.now();

            // ✅ 1. PLAY AUDIO IF SELECTED
            if (preSelectedAudio?.uri) {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: preSelectedAudio.uri },
                    { shouldPlay: true, volume: 1.0, isLooping: false } // ❌ NO LOOP
                );
                audioSoundRef.current = sound;
                await sound.playAsync();

                console.log('🎵 Audio started playing');
            }

            // ✅ 2. START TIMER
            timerIntervalRef.current = setInterval(() => {
                if (recordingStartTimeRef.current) {
                    const elapsedSec = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
                    setRecordTime(elapsedSec);
                }
            }, 1000);

            // ✅ 3. CALCULATE MAX DURATION
            let maxDurationSec: number;

            if (preSelectedAudio && audioDuration) {
                // 🎵 If audio is selected, record for audio duration
                maxDurationSec = audioDuration;
                console.log('📹 Recording will stop after', maxDurationSec, 'seconds (audio length)');
            } else {
                // 📹 Default duration based on content type
                maxDurationSec = contentType === 'story' ? 30 : 120;
                console.log('📹 Recording will stop after', maxDurationSec, 'seconds (default)');
            }

            // ✅ 4. AUTO-STOP TIMER
            autoStopTimeoutRef.current = setTimeout(() => {
                console.log('⏱️ Auto-stopping recording...');
                if (cameraRef.current) {
                    cameraRef.current.stopRecording();
                }
            }, maxDurationSec * 1000);

            // ✅ 5. START CAMERA RECORDING
            const video = await cameraRef.current.recordAsync({
                maxDuration: maxDurationSec,
                quality: '720p',
                mute: false
            });

            // ✅ 6. CHECK MINIMUM DURATION
            const elapsed = Date.now() - (recordingStartTimeRef.current ?? 0);
            if (elapsed < 2000) {
                Toast.show({
                    type: "info",
                    text1: 'Too short',
                    text2: 'Please record at least 2 seconds.'
                });
                return;
            }

            if (!video) throw new Error('Video is null');

            // ✅ 7. SUCCESS - SEND VIDEO URI
            console.log('✅ Recording completed:', video.uri);
            onImagePick(video.uri);
            Toast.show({ type: "success", text1: 'Video recorded successfully!' });

        } catch (err: any) {
            console.error('❌ Recording error:', err);
            Toast.show({
                type: "error",
                text1: 'Error',
                text2: err.message || 'Recording failed'
            });
        } finally {
            // ✅ CLEANUP
            await stopRecordingWithAudio();
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

    // const stopRecordingWithAudio = async () => {
    //     try {
    //         setIsRecording(false);

    //         // Stop and unload audio
    //         if (audioSoundRef.current) {
    //             await audioSoundRef.current.stopAsync();
    //             await audioSoundRef.current.unloadAsync();
    //             audioSoundRef.current = null;
    //         }

    //         // Stop camera recording here
    //         // ... your existing camera stop code
    //         const stopRecording = () => {
    //             if (!cameraRef.current) return;

    //             cameraRef.current.stopRecording();

    //             if (autoStopTimeoutRef.current) {
    //                 clearTimeout(autoStopTimeoutRef.current);
    //                 autoStopTimeoutRef.current = null;
    //             }

    //             if (timerIntervalRef.current) {
    //                 clearInterval(timerIntervalRef.current);
    //                 timerIntervalRef.current = null;
    //             }
    //         };

    //     } catch (error) {
    //         console.error('Error stopping recording:', error);
    //     }
    // };

    // useEffect(() => {
    //     return () => {
    //         if (audioSoundRef.current) {
    //             audioSoundRef.current.unloadAsync();
    //         }
    //     };
    // }, []);

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
                        onPress={() => { setContentType(type); }}
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
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
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
                <TouchableOpacity style={styles.button} onPress={pickVideo}>
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
