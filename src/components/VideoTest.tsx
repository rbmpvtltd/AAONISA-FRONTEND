import { ResizeMode, Video } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import ZoomSlider from './zoomSlider';
export default function VideoTest() {
    const [permission, requestPermission] = useCameraPermissions();
    const [isRecording, setIsRecording] = useState(false);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [facing, setFacing] = useState<'front' | 'back'>('back');
    const [timer, setTimer] = useState(0); // Timer in seconds
    const [zoom, setZoom] = useState(0); // Zoom level (0 to 1)

    const cameraRef = useRef<CameraView>(null);
    const recordingStartTimeRef = useRef<number | null>(null);
    const autoStopTimeoutRef = useRef<number | null>(null);
    const timerIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (permission?.status === 'denied') {
            Alert.alert('Permission Denied', 'Camera access is required to record videos.');
        }
    }, [permission]);

    if (!permission) {
        return <View><Text>Requesting permissions...</Text></View>;
    }

    if (permission.status !== 'granted') {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button title="Grant Camera Permission" onPress={requestPermission} />
            </View>
        );
    }

    const startRecording = async () => {
        if (!cameraRef.current) {
            Alert.alert('Error', 'Camera not ready.');
            return;
        }

        try {
            setIsRecording(true);
            setTimer(0);
            recordingStartTimeRef.current = Date.now();

            timerIntervalRef.current = setInterval(() => {
                if (recordingStartTimeRef.current) {
                    const elapsedSec = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
                    setTimer(elapsedSec);
                }
            }, 1000);

            autoStopTimeoutRef.current = setTimeout(() => {
                if (cameraRef.current) cameraRef.current.stopRecording();
            }, 10000);

            const options = { maxDuration: 30, quality: '720p', mute: false };
            const video = await cameraRef.current.recordAsync(options);

            const elapsed = Date.now() - (recordingStartTimeRef.current ?? 0);
            if (elapsed < 2000) {
                Alert.alert('Too short', 'Please record at least 2 seconds.');
                return;
            }

            if (!video) throw new Error('Video is null');

            setVideoUri(video.uri);
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

            setTimer(0);
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

    const toggleCamera = () => {
        if (isRecording) return;
        setFacing(prev => (prev === 'back' ? 'front' : 'back'));
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Camera */}
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing={facing}
                mode="video"
                zoom={zoom} // Apply zoom level
            />

            {/* Timer display */}
            {isRecording && (
                <View style={{ position: 'absolute', top: 50, alignSelf: 'center' }}>
                    <Text style={{ color: 'red', fontSize: 24 }}>{timer}s</Text>
                </View>
            )}

            {/* Zoom Slider */}
            <View style={{ position: 'absolute', bottom: 150, left: 0, right: 0 }}>
                <ZoomSlider zoom={zoom} onZoomChange={setZoom} />
            </View>

            {/* Buttons */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 50,
                    left: 0,
                    right: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                }}
            >
                <Button
                    title={isRecording ? 'Recording...' : 'Start'}
                    onPress={startRecording}
                    disabled={isRecording}
                />
                <Button title="Stop" onPress={stopRecording} disabled={!isRecording} />
                <Button title="Switch Camera" onPress={toggleCamera} disabled={isRecording} />
            </View>

            {/* Recent Video Preview */}
            {videoUri && (
                <View style={{ position: 'absolute', top: 100, left: 20, width: 150, height: 200 }}>
                    <Text style={{ color: 'white' }}>Last Video:</Text>
                    <Video
                        source={{ uri: videoUri }}
                        style={{ width: 150, height: 150 }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                    />

                </View>
            )}
        </View>
    );
}
