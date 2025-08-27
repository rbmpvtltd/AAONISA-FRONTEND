// import { useEvent } from "expo";
// import * as DocumentPicker from "expo-document-picker";
// import * as FileSystem from "expo-file-system";
// import { useVideoPlayer, VideoView } from "expo-video";
// import { FFmpegKit } from "ffmpeg-kit-react-native";
// import React, { useState } from "react";
// import { Alert, Button, StyleSheet, Text, View } from "react-native";

// export default function VideoUploader() {
//     const [video, setVideo] = useState<any>(null);
//     const [audio, setAudio] = useState<any>(null);

//     // Step 1: Pick Video
//     const pickVideo = async () => {
//         try {
//             const result = await DocumentPicker.getDocumentAsync({
//                 type: "video/*", // only videos
//                 copyToCacheDirectory: true,
//             });

//             if (result.canceled) {
//                 console.log("User cancelled video picking");
//                 return;
//             }

//             setVideo(result.assets[0]); // store the selected video
//             console.log("Selected Video:", result.assets[0]);
//         } catch (error) {
//             console.log("Error picking video:", error);
//         }
//     };

//     // Step 2: Pick Audio
//     const pickAudio = async () => {
//         try {
//             const result = await DocumentPicker.getDocumentAsync({
//                 type: "audio/*", // only audio files
//                 copyToCacheDirectory: true,
//             });

//             if (result.canceled) {
//                 console.log("User cancelled audio picking");
//                 return;
//             }

//             setAudio(result.assets[0]);
//             console.log("Selected Audio:", result.assets[0]);
//         } catch (error) {
//             console.log("Error picking audio:", error);
//         }
//     };

//     // Step 3: Remove audio from existing video
//     const removeAudioFromVideo = async () => {
//         if (!video) {
//             Alert.alert("Error", "Please select a video first!");
//             return;
//         }

//         const outputPath = `${FileSystem.cacheDirectory}video_no_audio.mp4`;
//         const cmd = `-i "${video.uri}" -c copy -an "${outputPath}"`;

//         console.log("Running FFmpeg command:", cmd);

//         try {
//             await FFmpegKit.execute(cmd);
//             console.log("Audio removed successfully:", outputPath);
//             Alert.alert("Success", "Audio removed from video!");
//             setVideo({ ...video, uri: outputPath, name: "video_no_audio.mp4" });
//         } catch (err) {
//             console.error("FFmpeg error:", err);
//             Alert.alert("Error", "Failed to remove audio!");
//         }
//     };

//     // Step 4: Merge Audio with Video
//     const mergeAudioWithVideo = async () => {
//         if (!video || !audio) {
//             alert("Please select both video and audio first!");
//             return;
//         }

//         const outputPath = `${FileSystem.cacheDirectory}output.mp4`;

//         const cmd = `-i "${video.uri}" -i "${audio.uri}" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -shortest "${outputPath}"`;
//         console.log("Running FFmpeg command:", cmd);

//         try {
//             await FFmpegKit.execute(cmd);
//             console.log("Audio replaced successfully:", outputPath);

//             // Upload merged video
//             let formData = new FormData();
//             formData.append("file", {
//                 uri: outputPath,
//                 name: "final_video.mp4",
//                 type: "video/mp4",
//             } as any);

//             const response = await fetch("https://your-server.com/upload", {
//                 method: "POST",
//                 body: formData,
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             const data = await response.json();
//             console.log("Upload success:", data);
//             alert("Video with new audio uploaded successfully!");
//         } catch (err) {
//             console.error("FFmpeg error:", err);
//             alert("Failed to merge audio with video!");
//         }
//     };

//     // Video Player
//     const player = useVideoPlayer(video?.uri, (player) => {
//         player.loop = true;
//         player.play();
//     });

//     const { isPlaying } = useEvent(player, "playingChange", {
//         isPlaying: player.playing,
//     });

//     return (
//         <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
//             <VideoView
//                 style={styles.video}
//                 player={player}
//                 allowsFullscreen
//                 allowsPictureInPicture
//             />
//             <Button
//                 title={isPlaying ? "Pause" : "Play"}
//                 onPress={() => {
//                     if (isPlaying) {
//                         player.pause();
//                     } else {
//                         player.play();
//                     }
//                 }}
//             />

//             <Button title="Pick Video" onPress={pickVideo} />
//             {video && <Text style={{ marginTop: 10 }}>🎬 {video.name}</Text>}

//             <Button title="Add Music" onPress={pickAudio} />
//             {audio && <Text style={{ marginTop: 10 }}>🎵 {audio.name}</Text>}

//             <Button
//                 title="Remove Audio from Video"
//                 onPress={removeAudioFromVideo}
//                 disabled={!video}
//             />

//             <Button
//                 title="Merge Audio & Upload"
//                 onPress={mergeAudioWithVideo}
//                 disabled={!video || !audio}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     contentContainer: {
//         flex: 1,
//         padding: 10,
//         alignItems: "center",
//         justifyContent: "center",
//         paddingHorizontal: 50,
//     },
//     video: {
//         width: 350,
//         height: 275,
//     },
//     controlsContainer: {
//         padding: 10,
//     },
// });

import { useEvent } from "expo";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useVideoPlayer, VideoView } from "expo-video";
import { FFmpegKit } from "ffmpeg-kit-react-native";
// import FFmpegKit from "ffmpeg-kit-react-native";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";

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
    );
}

const styles = StyleSheet.create({
    video: {
        width: 350,
        height: 275,
    },
});



