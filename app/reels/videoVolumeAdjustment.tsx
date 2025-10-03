// import { Ionicons } from "@expo/vector-icons";
// import Slider from "@react-native-community/slider";
// import { ResizeMode, Video } from "expo-av";
// import React, { useRef, useState } from "react";
// import { Dimensions, Text, TouchableOpacity, View } from "react-native";

// const SCREEN_WIDTH = Dimensions.get("window").width;

// export default function SmoothVolumeJugaad() {
//   const videoRef = useRef<Video>(null);
//   const [videoVolume, setVideoVolume] = useState(50);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const lastPosition = useRef(0);

//   // Long video for testing
//   const videoUri = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

//   const togglePlayback = async () => {
//     if (!videoRef.current) return;
//     const status = await videoRef.current.getStatusAsync();
//     if (!status.isLoaded) return;

//     if (status.isPlaying) {
//       await videoRef.current.pauseAsync();
//       setIsPlaying(false);
//     } else {
//       await videoRef.current.playAsync();
//       setIsPlaying(true);
//     }
//   };

//   // Keep track of last position continuously
//   const handleStatusUpdate = (status: any) => {
//     if (!status.isLoaded) return;
//     lastPosition.current = status.positionMillis;
//   };

//   // Apply volume while slightly seeking ahead for smoothness
//   const onVolumeSlideComplete = async (vol: number) => {
//     if (!videoRef.current) return;
//     setVideoVolume(vol);
//     const status = await videoRef.current.getStatusAsync();
//     if (!status.isLoaded) return;
//     const wasPlaying = isPlaying;
//     await videoRef.current.pauseAsync();
//     await videoRef.current.setVolumeAsync(vol / 100);
//     if (wasPlaying) await videoRef.current.playAsync();
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
//       <TouchableOpacity onPress={togglePlayback}>
//         <Video
//           ref={videoRef}
//           source={{ uri: videoUri }}
//           style={{ width: SCREEN_WIDTH, height: 250 }}
//           resizeMode={ResizeMode.CONTAIN}
//           shouldPlay={false}
//           volume={videoVolume / 100}
//           onPlaybackStatusUpdate={handleStatusUpdate}
//         />
//       </TouchableOpacity>

//       <Ionicons
//         name={isPlaying ? "pause-circle" : "play-circle"}
//         size={50}
//         color="white"
//         style={{ position: "absolute", top: 100, left: SCREEN_WIDTH / 2 - 25 }}
//       />

//       <Text style={{ color: "white", marginTop: 20 }}>Volume: {Math.round(videoVolume)}</Text>

//       <Slider
//         style={{ width: SCREEN_WIDTH - 40, height: 40, marginTop: 10 }}
//         minimumValue={0}
//         maximumValue={100}
//         value={videoVolume}
//         onValueChange={onVolumeSlideComplete} // for slider UI
//         minimumTrackTintColor="#0095f6"
//         maximumTrackTintColor="#ccc"
//       />
//     </View>
//   );
// }
