import { useEvent } from "expo";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useVideoPlayer, VideoView } from "expo-video";
import { FFmpegKit } from "ffmpeg-kit-react-native";
// import FFmpegKit from "ffmpeg-kit-react-native";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function VideoUploader() {
    const [video, setVideo] = useState<any>(null);
    const [audio, setAudio] = useState<any>(null);

    // Step 1: Pick Video
    const pickVideo = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "video/*",
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            setVideo(result.assets[0]);
            console.log("Selected Video:", result.assets[0]);
        } catch (error) {
            console.log("Error picking video:", error);
        }
    };

    // Step 2: Pick Audio & Auto Merge (removes old audio + adds new)
    const pickAudioAndMerge = async () => {
        if (!video) {
            Alert.alert("Error", "Please select a video first!");
            return;
        }

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "audio/*",
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const pickedAudio = result.assets[0];
            setAudio(pickedAudio);
            console.log("Selected Audio:", pickedAudio);

            const outputPath = `${FileSystem.cacheDirectory}final_with_music.mp4`;

            // Command: remove original audio (-an) and add new audio
            const cmd = `-i "${video.uri}" -i "${pickedAudio.uri}" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -shortest "${outputPath}"`;
            console.log("Running FFmpeg command:", cmd);

            await FFmpegKit.execute(cmd);

            Alert.alert("Success", "Old audio removed & new music added!");
            console.log("New video saved at:", outputPath);

            // Update video state with new processed file
            setVideo({ ...video, uri: outputPath, name: "final_with_music.mp4" });

        } catch (error) {
            console.error("FFmpeg error:", error);
            Alert.alert("Error", "Failed to replace audio!");
        }
    };

    // Video Player
    const player = useVideoPlayer(video?.uri, (player) => {
        player.loop = true;
        player.play();
    });

    const { isPlaying } = useEvent(player, "playingChange", {
        isPlaying: player.playing,
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
                <VideoView
                    style={styles.video}
                    player={player}
                    allowsFullscreen
                    allowsPictureInPicture
                />
                <Button
                    title={isPlaying ? "Pause" : "Play"}
                    onPress={() => (isPlaying ? player.pause() : player.play())}
                />

                <Button title="Pick Video" onPress={pickVideo} />
                {/* {video && <Text style={{ marginTop: 10 }}>🎬 {video.name}</Text>} */}

                <Button title="Add Music (Replace Old)" onPress={pickAudioAndMerge} />
                {/* {audio && <Text style={{ marginTop: 10 }}>🎵 {audio.name}</Text>} */}
            </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    video: {
        width: 350,
        height: 275,
    },
});
