// import { Ionicons } from "@expo/vector-icons";
// import Slider from "@react-native-community/slider";
// import { Audio, AVPlaybackStatus, ResizeMode, Video } from "expo-av";
// import React, { useEffect, useRef, useState } from "react";
// import {
//     Alert,
//     Dimensions,
//     ScrollView,
//     Text,
//     TouchableOpacity,
//     View
// } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import FinalUpload from "./finalUpload";
// import MusicScreen from "./musicPanel";
// import TextOverlay, { OverlayMetadata } from "./textOverlay";
// import TwoPointSlider from "./trimSlider";
// const SCREEN_WIDTH = Dimensions.get("window").width;
// const TRIM_HANDLE_WIDTH = 20;

// type FilterType = "none" | "warm" | "cool" | "grayscale" | "vintage" | "sepia" | "bright" | "dark";

// const getFilterStyle = (filter: FilterType) => {
//     switch (filter) {
//         case "warm": return { backgroundColor: "rgba(255,165,0,0.2)" };
//         case "cool": return { backgroundColor: "rgba(0,0,255,0.2)" };
//         case "grayscale": return { backgroundColor: "rgba(128,128,128,0.3)" };
//         case "vintage": return { backgroundColor: "rgba(255,192,203,0.2)" };
//         case "sepia": return { backgroundColor: "rgba(112,66,20,0.2)" };
//         case "bright": return { backgroundColor: "rgba(255,255,255,0.2)" };
//         case "dark": return { backgroundColor: "rgba(0,0,0,0.3)" };
//         default: return { backgroundColor: "transparent" };
//     }
// };


// interface MusicOption {
//     id: string;
//     title: string;
//     artist: string;
//     uri?: string; // from API
// }

// const musicOptions = [
//     { id: "1", title: "Song A", artist: "Artist A", uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
//     { id: "2", title: "Song B", artist: "Artist B", uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
//     { id: "3", title: "Song C", artist: "Artist C", uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
// ];
// interface VideoPreviewProps {
//     videoUri: string;
//     contentType: "story" | "reels" | "news";
//     musicOptions: MusicOption[];
//     onDiscard: () => void;
//     onUpload: (
//         trimStart: number,
//         trimEnd: number,
//         selectedMusicId: string | null,
//         musicVolume: number
//     ) => void;
// }

// export const VideoPreview: React.FC<VideoPreviewProps> = ({
//     videoUri,
//     contentType,
//     musicOptions,
//     onDiscard,
//     onUpload,
// }) => {
//     const videoRef = useRef<Video>(null);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [videoVolume, setVideoVolume] = useState(100);
//     const [musicVolume, setMusicVolume] = useState(50);
//     const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
//     const soundRef = useRef<Audio.Sound | null>(null);
//     const [overlays, setOverlays] = useState<OverlayMetadata[]>([]);

//     const [trimStart, setTrimStart] = useState(0);
//     const [trimEnd, setTrimEnd] = useState(0);
//     const [videoDuration, setVideoDuration] = useState(0);
//     const [currentTime, setCurrentTime] = useState(0);

//     const [filter, setFilter] = useState<FilterType>("none");
//     const [isSelectingFilter, setIsSelectingFilter] = useState(false);
//     const [isSelectingMusic, setIsSelectingMusic] = useState(false);
//     const [isTrimming, setIsTrimming] = useState(false);
//     const [isFinalUploading, setIsUploading] = useState(false);

//     const prevMusicVolume = useRef(50);

//     const updateOverlay = (updated: OverlayMetadata) => {
//         setOverlays((prev) =>
//             prev.map((o) => (o.id === updated.id ? updated : o))
//         );
//     };
//     const storyUploading = () => {
//         Alert.alert("Story uploaded successfully!");
//     }
//     const removeOverlay = (id: string) => {
//         setOverlays((prev) => prev.filter((o) => o.id !== id));
//     };

//     const addOverlay = (text = "#example") => {
//         setOverlays((prev) => [
//             ...prev,
//             {
//                 id: Date.now().toString(),
//                 text,
//                 x: SCREEN_WIDTH * 0.30,
//                 y: -140,
//                 scale: 1,
//                 rotation: 0,
//                 fontSize: 24,
//                 color: "#FFFFFF",
//             },
//         ]);
//     };

//     // ---------------- VIDEO & MUSIC SYNC ----------------
//     const togglePlayback = async () => {
//         if (!videoRef.current) return;
//         const status = await videoRef.current.getStatusAsync();
//         if (!("isLoaded" in status) || !status.isLoaded) return;

//         if (status.isPlaying) {
//             await videoRef.current.pauseAsync();
//             setIsPlaying(false);
//             if (soundRef.current) await soundRef.current.pauseAsync();
//         } else {
//             await videoRef.current.playAsync();
//             setIsPlaying(true);
//             if (soundRef.current) await soundRef.current.playAsync();
//         }
//     };

//     // Only update music position when video is playing
//     const handleVideoProgress = async (status: AVPlaybackStatus) => {
//         if (!status.isLoaded) return;
//         const time = status.positionMillis / 1000;
//         setCurrentTime(time);
//         if (time >= trimEnd) {
//             if (videoRef.current) await videoRef.current.setPositionAsync(trimStart * 1000);
//         }
//     };
//     let volumeTimeout: NodeJS.Timeout | number | null = null;

//     // ---------------- VOLUME ----------------
//     const adjustVideoVolume = async (vol: number) => {
//         if (!videoRef.current) return;
//         const status = await videoRef.current.getStatusAsync();
//         if (!status.isLoaded) return;
//         const wasPlaying = isPlaying;
//         await videoRef.current.setVolumeAsync(vol / 100);
//         if (wasPlaying) await videoRef.current.playAsync();
//     };

//     const adjustMusicVolume = async (vol: number) => {
//         setMusicVolume(vol);
//         if (soundRef.current) await soundRef.current.setVolumeAsync(vol / 100);
//         prevMusicVolume.current = vol;
//     };

//     useEffect(() => {
//         if (videoRef.current) {
//             videoRef.current.setPositionAsync(trimStart * 1000);
//         }
//         if (videoUri) setTrimEnd(videoDuration);
//     }, [videoUri, videoDuration, trimStart]);

//     // ------------------- RESET -------------------
//     const resetPreview = async () => {
//         setIsPlaying(false);
//         setVideoVolume(100);
//         setMusicVolume(50);
//         setSelectedMusicId(null);
//         setIsTrimming(false);
//         setTrimStart(0);
//         setTrimEnd(videoDuration);
//         setFilter("none");
//         setIsSelectingFilter(false);
//         if (soundRef.current) await soundRef.current.unloadAsync();
//     };

//     return (
//         <GestureHandlerRootView style={{ flex: 1 }}>
//             <View style={{ flex: 1, backgroundColor: "black" }}>
//                 {/* Top-right close button */}

//                 {!isFinalUploading ? (
//                     <>
//                         {/* Your existing VideoPreview UI goes here */}
//                         <TouchableOpacity
//                             style={{ position: "absolute", top: 32, right: 22, zIndex: 100 }}
//                             onPress={onDiscard}
//                         >
//                             <Ionicons name="close" size={32} color="white" />
//                         </TouchableOpacity>
//                         {/* Next (Upload) button below the close button */}
//                         <TouchableOpacity
//                             style={{
//                                 position: "absolute",
//                                 top: 80, // just below the close button
//                                 right: 26,
//                                 zIndex: 100,
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                             }}
//                             onPress={() => contentType==="story" ? storyUploading() :  setIsUploading(true)}
//                         >
//                             <Ionicons name="cloud-upload-outline" size={24} color="white" />
//                         </TouchableOpacity>
//                         {/* Video */}
//                         <Video
//                             ref={videoRef}
//                             source={{ uri: videoUri }}
//                             style={{ flex: 1, width: "100%" }}
//                             resizeMode={ResizeMode.CONTAIN}
//                             shouldPlay={false}
//                             onLoad={(status) => {
//                                 if (status.isLoaded && status.durationMillis) {
//                                     const durationSec = status.durationMillis / 1000;
//                                     setVideoDuration(durationSec);

//                                     // Trim logic
//                                     const maxDuration = contentType === "story" ? 30 : 120;
//                                     setTrimEnd(Math.min(maxDuration, durationSec));

//                                     // ---------------- Duration Check ----------------
//                                     if (durationSec < 10) {
//                                         console.warn("Video too short! Discarding...");
//                                         onDiscard(); // Back to previous screen
//                                     }
//                                 }
//                             }}
//                             onPlaybackStatusUpdate={handleVideoProgress}
//                             volume={videoVolume / 100}
//                         />

//                         {/* Filter Overlay */}
//                         <View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }, getFilterStyle(filter)]} />

//                         {/* Play/Pause */}
//                         <TouchableOpacity
//                             style={{ position: "absolute", top: "45%", left: SCREEN_WIDTH / 2 - 25 }}
//                             onPress={togglePlayback}
//                         >
//                             <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={50} color="white" />
//                         </TouchableOpacity>

//                         {/* Controls to open panels */}
//                         {!isSelectingMusic && !isSelectingFilter && !isTrimming && (
//                             <View
//                                 style={{
//                                     position: "absolute",
//                                     bottom: 120,
//                                     width: "100%",
//                                     flexDirection: "row",
//                                     justifyContent: "space-around",
//                                     paddingHorizontal: 30,
//                                     zIndex: 110,
//                                 }}
//                             >
//                                 <TouchableOpacity onPress={() => setIsSelectingMusic(true)}>
//                                     <Ionicons name="musical-notes" size={32} color="white" />
//                                 </TouchableOpacity>
//                                 <TouchableOpacity onPress={() => setIsTrimming(true)}>
//                                     <Ionicons name="cut" size={32} color="white" />
//                                 </TouchableOpacity>
//                                 <TouchableOpacity onPress={() => setIsSelectingFilter(true)}>
//                                     <Ionicons name="color-filter-outline" size={32} color="white" />
//                                 </TouchableOpacity>
//                                 {contentType === "story" && !isFinalUploading && (
//                                     <>
//                                         <TouchableOpacity
//                                             style={{ marginBottom: 12 }}
//                                             onPress={() => addOverlay("#example")}
//                                         >
//                                             <Ionicons name="pricetag-outline" size={32} color="white" />
//                                         </TouchableOpacity>

//                                         <TouchableOpacity
//                                             onPress={() => addOverlay("@mention")}
//                                         >
//                                             <Ionicons name="at-outline" size={32} color="white" />
//                                         </TouchableOpacity>
//                                         <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
//                                             {overlays.map((overlay) => (
//                                                 <TextOverlay
//                                                     key={overlay.id}
//                                                     overlay={overlay}
//                                                     onUpdate={updateOverlay}
//                                                     onRemove={removeOverlay}
//                                                 />
//                                             ))}
//                                         </View>
//                                     </>
//                                 )}
//                             </View>
//                         )}

//                         {/* Trim Panel */}
//                         {isTrimming && (
//                             <View style={{ position: "absolute", bottom: 0, width: "100%", backgroundColor: "#111" }}>
//                                 {/* Buttons Row */}
//                                 <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
//                                     <TouchableOpacity onPress={resetPreview}>
//                                         <Ionicons name="close-circle" size={28} color="white" />
//                                     </TouchableOpacity>

//                                     <View style={{ flexDirection: "row" }}>
//                                         <TouchableOpacity onPress={() => setIsTrimming(false)}>
//                                             <Ionicons name="checkmark-circle" size={28} color="white" />
//                                         </TouchableOpacity>
//                                     </View>
//                                 </View>

//                                 {/* Trim bar */}
//                                 <TwoPointSlider
//                                     startSec={trimStart}
//                                     endSec={trimEnd}
//                                     minTrim={10}
//                                     totalTime={videoDuration}
//                                     onTrimChange={(start, end) => {
//                                         setTrimStart(start);
//                                         setTrimEnd(end);
//                                     }}
//                                 />
//                             </View>
//                         )}

//                         {/* Volume Sliders */}
//                         {!isSelectingMusic && !isSelectingFilter && !isTrimming && (
//                             <View style={{ position: "absolute", bottom: 10, width: "100%", flexDirection: "row", justifyContent: "space-around" }}>
//                                 <View style={{ alignItems: "center" }}>
//                                     <Text style={{ color: "white" }}>Video Vol</Text>
//                                     <Slider
//                                         style={{ width: 140, height: 40 }}
//                                         minimumValue={0}
//                                         maximumValue={100}
//                                         value={videoVolume}
//                                         onValueChange={adjustVideoVolume}
//                                         onSlidingComplete={(vol) => {
//                                             setVideoVolume(vol);
//                                             if (vol === 0 || vol === 100) {
//                                                 adjustVideoVolume(vol);
//                                             };
//                                         }}
//                                         minimumTrackTintColor="#0095f6"
//                                         maximumTrackTintColor="#ccc"
//                                     />
//                                 </View>
//                                 <View style={{ alignItems: "center" }}>
//                                     <Text style={{ color: "white" }}>Music Vol</Text>
//                                     <Slider
//                                         style={{ width: 140, height: 40 }}
//                                         minimumValue={0}
//                                         maximumValue={100}
//                                         value={musicVolume}
//                                         onValueChange={adjustMusicVolume}
//                                         minimumTrackTintColor="#0095f6"
//                                         maximumTrackTintColor="#ccc"
//                                     />
//                                 </View>
//                             </View>
//                         )}

//                         {/* Music Selection Overlay */}
//                         {isSelectingMusic && (
//                             <MusicScreen setIsSelectingMusic={setIsSelectingMusic} setSelectedMusicId={setSelectedMusicId} musicOptions={musicOptions} isSelectingMusic={isSelectingMusic} selectedMusicId={selectedMusicId} soundRef={soundRef} />

//                         )}

//                         {isSelectingFilter && (
//                             <View style={{
//                                 position: "absolute",
//                                 bottom: 0,
//                                 width: "100%",
//                                 maxHeight: 220,
//                                 backgroundColor: "rgba(0,0,0,0.7)",
//                                 paddingVertical: 12
//                             }}>
//                                 <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 }}>
//                                     <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Filters</Text>
//                                     <TouchableOpacity onPress={() => setIsSelectingFilter(false)}>
//                                         <Ionicons name="close-circle" size={28} color="white" />
//                                     </TouchableOpacity>
//                                 </View>

//                                 <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginTop: 10 }}>
//                                     {(["none", "warm", "cool", "grayscale", "vintage", "sepia", "bright", "dark"] as FilterType[]).map((f) => (
//                                         <TouchableOpacity
//                                             key={f}
//                                             style={{
//                                                 marginRight: 12,
//                                                 alignItems: "center",
//                                             }}
//                                             onPress={() => setFilter(f)}
//                                         >
//                                             <View style={{
//                                                 width: 60,
//                                                 height: 60,
//                                                 borderRadius: 12,
//                                                 borderWidth: filter === f ? 3 : 0,
//                                                 borderColor: "#0095f6",
//                                                 overflow: "hidden",
//                                                 justifyContent: "center",
//                                                 alignItems: "center",
//                                                 backgroundColor: "#222"
//                                             }}>
//                                                 <View style={[{ width: "100%", height: "100%" }, getFilterStyle(f)]} />
//                                             </View>
//                                             <Text style={{ color: "white", fontSize: 12, marginTop: 4, textTransform: "capitalize" }}>{f}</Text>
//                                         </TouchableOpacity>
//                                     ))}
//                                 </ScrollView>
//                             </View>
//                         )}


//                     </>
//                 ) : (
//                     <FinalUpload
//                         contentType={contentType}
//                         onCancel={() => setIsUploading(false)}
//                         onUpload={(data) => {
//                             // Handle final upload
//                             console.log("Upload data:", data);
//                             console.log("Trim:", trimStart, trimEnd);
//                             console.log("Selected music:", selectedMusicId, "Volume:", musicVolume);

//                             // Call your API / backend here
//                             onUpload(trimStart, trimEnd, selectedMusicId, musicVolume);

//                             // Reset state if needed
//                             setIsUploading(false);
//                         }}
//                     />
//                 )}

//             </View></GestureHandlerRootView>
//     );
// };
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Audio, AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OverlayMetadata, useUploadStore } from "../../src/store/reelUploadStore";
import FinalUpload from "./finalUpload";
import MusicScreen from "./musicPanel";
import TextOverlay from "./textOverlay";
import TwoPointSlider from "./trimSlider";

const SCREEN_WIDTH = Dimensions.get("window").width;

type FilterType = "none" | "warm" | "cool" | "grayscale" | "vintage" | "sepia" | "bright" | "dark";

const getFilterStyle = (filter: any) => {
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
  uri?: string;
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

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoUri,
  contentType,
  musicOptions,
  onDiscard,
  onUpload,
}) => {
  const videoRef = useRef<Video>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSelectingMusic, setIsSelectingMusic] = useState(false);
  const [isSelectingFilter, setIsSelectingFilter] = useState(false);
  const [isTrimming, setIsTrimming] = useState(false);
  const [isFinalUploading, setIsUploading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // ------------------- Zustand Store -------------------
  const {
    videoVolume,
    setVideoVolume: setVideoVolumeStore,
    musicVolume,
    setMusicVolume: setMusicVolumeStore,
    selectedMusic,
    selectMusic,
    overlays,
    addOverlay,
    updateOverlay,
    removeOverlay,
    trimStart,
    trimEnd,
    setTrimRange,
    videoDuration,
    setVideoDuration,
    filter,
    setFilter,
    resetAll,
  } = useUploadStore();

  // ------------------- Overlay Handlers -------------------
  const handleAddOverlay = (text = "#example") => {
    addOverlay({
      id: Date.now().toString(),
      text,
      x: SCREEN_WIDTH * 0.3,
      y: -140,
      scale: 1,
      rotation: 0,
      fontSize: 24,
      color: "#FFFFFF",
    });
  };

  const handleUpdateOverlay = (overlay: OverlayMetadata) => {
    updateOverlay(overlay);
  };

  const handleRemoveOverlay = (id: string) => {
    removeOverlay(id);
  };

  // ------------------- Video Playback -------------------
  const togglePlayback = async () => {
    if (!videoRef.current) return;
    const status = await videoRef.current.getStatusAsync();
    if (!("isLoaded" in status) || !status.isLoaded) return;

    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
      if (soundRef.current) await soundRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
      if (soundRef.current) await soundRef.current.playAsync();
    }
  };

  const handleVideoProgress = async (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    const time = status.positionMillis / 1000;
    setCurrentTime(time);
    if (time >= trimEnd) {
      if (videoRef.current) await videoRef.current.setPositionAsync(trimStart * 1000);
    }
  };

  // ------------------- Volume -------------------
  const adjustVideoVolume = async (vol: number) => {
    setVideoVolumeStore(vol);
    if (!videoRef.current) return;
    const status = await videoRef.current.getStatusAsync();
    if (!status.isLoaded) return;
    await videoRef.current.setVolumeAsync(vol / 100);
  };

  const adjustMusicVolume = async (vol: number) => {
    setMusicVolumeStore(vol);
    if (soundRef.current) await soundRef.current.setVolumeAsync(vol / 100);
  };

  // ------------------- Reset / Discard -------------------
  const resetPreview = async () => {
    setIsPlaying(false);
    setIsTrimming(false);
    setIsSelectingFilter(false);
    setIsSelectingMusic(false);
    resetAll();
    if (soundRef.current) await soundRef.current.unloadAsync();
  };

  // ------------------- Lifecycle -------------------
  useEffect(() => {
    if (videoRef.current) videoRef.current.setPositionAsync(trimStart * 1000);
  }, [videoUri, trimStart]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {!isFinalUploading ? (
          <>
            {/* Close Button */}
            <TouchableOpacity
              style={{ position: "absolute", top: 32, right: 22, zIndex: 100 }}
              onPress={onDiscard}
            >
              <Ionicons name="close" size={32} color="white" />
            </TouchableOpacity>

            {/* Upload Button */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 80,
                right: 26,
                zIndex: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => contentType === "story" ? Alert.alert("Story uploaded!") : setIsUploading(true)}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="white" />
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
                  const durationSec = status.durationMillis / 1000;
                  setVideoDuration(durationSec);
                  const maxDuration = contentType === "story" ? 30 : 120;
                  setTrimRange(0, Math.min(maxDuration, durationSec));
                  if (durationSec < 10) onDiscard();
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

            {/* Controls */}
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

                {contentType === "story" && (
                  <>
                    <TouchableOpacity onPress={() => handleAddOverlay("#example")}>
                      <Ionicons name="pricetag-outline" size={32} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleAddOverlay("@mention")}>
                      <Ionicons name="at-outline" size={32} color="white" />
                    </TouchableOpacity>
                    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                      {overlays.map((overlay:any) => (
                        <TextOverlay
                          key={overlay.id}
                          overlay={overlay}
                        />
                      ))}
                    </View>
                  </>
                )}
              </View>
            )}

            {/* Trim Panel */}
            {isTrimming && (
              <View style={{ position: "absolute", bottom: 0, width: "100%", backgroundColor: "#111" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                  <TouchableOpacity onPress={resetPreview}>
                    <Ionicons name="close-circle" size={28} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsTrimming(false)}>
                    <Ionicons name="checkmark-circle" size={28} color="white" />
                  </TouchableOpacity>
                </View>
                <TwoPointSlider
                  startSec={trimStart}
                  endSec={trimEnd}
                  minTrim={10}
                  totalTime={videoDuration}
                  onTrimChange={setTrimRange}
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

            {/* Music Selection */}
            {isSelectingMusic && (
              <MusicScreen
                setIsSelectingMusic={setIsSelectingMusic}
                setSelectedMusicId={(id:any) => {
                  const music = musicOptions.find((m) => m.id === id);
                  if (music)
                    selectMusic({ id: music.id, uri: music.uri ?? null, startMs: 0, endMs: videoDuration, volume: musicVolume });
                }}
                musicOptions={musicOptions}
                isSelectingMusic={isSelectingMusic}
                selectedMusicId={selectedMusic.id}
                soundRef={soundRef}
              />
            )}

            {/* Filter Selection */}
            {isSelectingFilter && (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  maxHeight: 220,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  paddingVertical: 12,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 }}>
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Filters</Text>
                  <TouchableOpacity onPress={() => setIsSelectingFilter(false)}>
                    <Ionicons name="close-circle" size={28} color="white" />
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginTop: 10 }}>
                  {(["none", "warm", "cool", "grayscale", "vintage", "sepia", "bright", "dark"] as FilterType[]).map((f) => (
                    <TouchableOpacity key={f} style={{ marginRight: 12, alignItems: "center" }} onPress={() => setFilter(f)}>
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 12,
                          borderWidth: filter === f ? 3 : 0,
                          borderColor: "#0095f6",
                          overflow: "hidden",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#222",
                        }}
                      >
                        <View style={[{ width: "100%", height: "100%" }, getFilterStyle(f)]} />
                      </View>
                      <Text style={{ color: "white", fontSize: 12, marginTop: 4, textTransform: "capitalize" }}>{f}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        ) : (
          <FinalUpload
            contentType={contentType}
            onCancel={() => setIsUploading(false)}
            onUpload={(data) => {
              onUpload(trimStart, trimEnd, selectedMusic.id, musicVolume);
              setIsUploading(false);
            }}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};
