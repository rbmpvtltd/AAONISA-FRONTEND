import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera"; // assuming expo-camera
import React, { useRef, useState } from "react";
import { Alert, PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// agar aap koi aur package use kar rahe ho toh yahan change kar lena
import * as ImagePicker from "expo-image-picker";
const CameraScreen = ({ onImagePick,setContentType,contentType }: any) => {
    //   const cameraRef = useRef(null);
    const zoomSliderRef = useRef<View>(null)

    const [facing, setFacing] = useState<"front" | "back">("back");
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const [zoom, setZoom] = useState(0);
    const cameraRef = useRef<CameraView>(null);
    const recordingStartTimeRef = useRef<number | null>(null);
    const autoStopTimeoutRef = useRef<NodeJS.Timeout|number | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout|number | null>(null);
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

    const startRecording = async () => {
        if (!cameraRef.current) {
            Alert.alert('Error', 'Camera not ready.');
            return;
        }

        try {
            setIsRecording(true);
            setRecordTime(0);
            recordingStartTimeRef.current = Date.now();

            timerIntervalRef.current = setInterval(() => {
                if (recordingStartTimeRef.current) {
                    const elapsedSec = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
                    setRecordTime(elapsedSec);
                }
            }, 1000);
           
            const durationMiliSecs = contentType === 'story' ? 30000 : 120000;

            autoStopTimeoutRef.current = setTimeout(() => {
                if (cameraRef.current) cameraRef.current.stopRecording();
            }, durationMiliSecs);
            const maxDurationSec = contentType === 'story' ? 30 : 120;
            const options = { maxDuration: maxDurationSec, quality: '720p', mute: false };
            const video = await cameraRef.current.recordAsync(options);

            const elapsed = Date.now() - (recordingStartTimeRef.current ?? 0);
            if (elapsed < 2000) {
                Alert.alert('Too short', 'Please record at least 2 seconds.');
                return;
            }

            if (!video) throw new Error('Video is null');

            onImagePick(video.uri);
            Alert.alert('Success', 'Video saved at: ' + video.uri);
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Recording failed');
        } finally {
            setIsRecording(false);
            recordingStartTimeRef.current = null;

            if (autoStopTimeoutRef.current) {
                clearTimeout(autoStopTimeoutRef.current);
                autoStopTimeoutRef.current = null;
            }

            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }

            setRecordTime(0);
        }
    };

    const stopRecording = () => {
        if (!cameraRef.current) return;

        cameraRef.current.stopRecording();

        if (autoStopTimeoutRef.current) {
            clearTimeout(autoStopTimeoutRef.current);
            autoStopTimeoutRef.current = null;
        }

        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };
    const pickVideo = async () => {
        try {
            // Permission check
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access gallery is required!");
                return;
            }

            // Open gallery with only video filter
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
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
                        onPress={() => {setContentType(type);}}
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
                        {recordTime}/{contentType === "story" ? "30" : "120"}
                    </Text>
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
                <TouchableOpacity
                    style={[styles.recordButton, isRecording && styles.recordingButton]}
                    onPress={isRecording ? stopRecording : startRecording}
                />

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
