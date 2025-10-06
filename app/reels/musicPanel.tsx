// import { Ionicons } from "@expo/vector-icons";
// import Slider from "@react-native-community/slider";
// import { Audio } from "expo-av";
// import React, { useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     ScrollView,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const MusicScreen = ({setIsSelectingMusic, setSelectedMusicId,musicOptions,isSelectingMusic,selectedMusicId,soundRef}:{setIsSelectingMusic:any, setSelectedMusicId:any,musicOptions:any,isSelectingMusic:any,selectedMusicId:any,soundRef:any}) => {
//   const [soundDuration, setSoundDuration] = useState(0);
//   const [soundPosition, setSoundPosition] = useState(0);
//   const [range, setRange] = useState({ from: 0, to: 0 });
//   const [isBuffering, setIsBuffering] = useState(false);
//   const currentJobRef = useRef<number>(0); // Unique token for active music job

//   const [startInput, setStartInput] = useState({ min: "0", sec: "0" });
//   const [endInput, setEndInput] = useState({ min: "0", sec: "0" });

  

//   // Cleanup sound on unmount
//   useEffect(() => {
//     // return () => {
//     //   cleanupSound();
//     // };
//   }, []);

//   // Safe cleanup function
//   const cleanupSound = async () => {
//     if (soundRef.current) {
//       try {
//         await soundRef.current.unloadAsync();
//       } catch (e) {
//         console.log("Error unloading sound:", e);
//       }
//       soundRef.current = null;
//     }
//     setIsBuffering(false);
//     setSoundPosition(0);
//     setSoundDuration(0);
//     setRange({ from: 0, to: 0 });
//   };

//   const onPlaybackStatusUpdate = (status: any, jobId: number) => {
//     // Ignore old jobs
//     if (jobId !== currentJobRef.current) return;

//     if (!status.isLoaded) return;

//     setSoundPosition(status.positionMillis ?? 0);
//     setSoundDuration(status.durationMillis ?? 0);

//     // Looping range
//     if (status.isPlaying && range.to > 0 && status.positionMillis > range.to) {
//       soundRef.current?.setPositionAsync(range.from);
//     }
//   };

//   const playMusic = async (id: string) => {
//     const music = musicOptions.find((m: any) => m.id === id);
//     if (!music) return;

//     const jobId = ++currentJobRef.current; // Increment job token
//     setIsBuffering(true);
//     setSelectedMusicId(id);

//     // Clean up previous sound
//     await cleanupSound();

//     try {
//       const { sound, status } = await Audio.Sound.createAsync(
//         { uri: music.uri },
//         { shouldPlay: false, volume: 1.0 },
//         (status) => onPlaybackStatusUpdate(status, jobId)
//       );

//       // Check if job is still valid
//       if (jobId !== currentJobRef.current) {
//         await sound.unloadAsync();
//         return;
//       }

//       soundRef.current = sound;
//       setIsBuffering(false);

//       await sound.playAsync();

//       if (status.isLoaded) {
//         const duration = status.durationMillis ?? 0;
//         setRange({ from: 0, to: duration });
//         setSoundDuration(duration);
//         setSoundPosition(0);

//         setStartInput({ min: "0", sec: "0" });
//         setEndInput({ min: String(Math.floor(duration / 60000)), sec: String(Math.floor((duration / 1000) % 60)) });
//       }
//     } catch (err) {
//       console.log("Error buffering/play:", err);
//       if (jobId === currentJobRef.current) setIsBuffering(false);
//     }
//   };

//   const handleDeselect = async () => {
//     setSelectedMusicId(null);
//     currentJobRef.current++; // invalidate current job
//     await cleanupSound();
//   };

//   const handleSeek = async (value: number) => {
//     if (soundRef.current) {
//       await soundRef.current.setPositionAsync(value);
//       setSoundPosition(value);
//     }
//   };

//   const formatTime = (millis: number) => {
//     const totalSec = Math.floor(millis / 1000);
//     const m = Math.floor(totalSec / 60);
//     const s = totalSec % 60;
//     return `${m}:${s < 10 ? "0" : ""}${s}`;
//   };

//   const applyRangeFromInputs = () => {
//     const fromMs = parseInt(startInput.min || "0") * 60000 + parseInt(startInput.sec || "0") * 1000;
//     const toMs = parseInt(endInput.min || "0") * 60000 + parseInt(endInput.sec || "0") * 1000;

//     if (fromMs >= 0 && toMs <= soundDuration && fromMs < toMs) {
//       setRange({ from: fromMs, to: toMs });
//       if (soundRef.current) {
//         soundRef.current.setPositionAsync(fromMs);
//         setSoundPosition(fromMs);
//       }
//     }
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "#111", justifyContent: "center", alignItems: "center" }}>
      
//       {isBuffering && (
//         <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
//           <ActivityIndicator size="small" color="#00f6ff" />
//           <Text style={{ color: "white", marginLeft: 8 }}>Buffering...</Text>
//         </View>
//       )}

//       {isSelectingMusic && (
//         <View style={{ position: "absolute", bottom: 0, width: "100%", maxHeight: 420, backgroundColor: "#000", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
//           {/* Header */}
//           <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, borderBottomColor: "#222" }}>
//             <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Select Music</Text>
//             <TouchableOpacity onPress={() => setIsSelectingMusic(false)}>
//               <Ionicons name="close-circle" size={28} color="white" />
//             </TouchableOpacity>
//           </View>

//           {/* Music List */}
//           <ScrollView>
//             {musicOptions.map((m:any) => {
//               const isSelected = selectedMusicId === m.id;
//               return (
//                 <View key={m.id} style={{ marginVertical: 4, marginHorizontal: 8, borderRadius: 8, borderWidth: isSelected ? 2 : 0, borderColor: isSelected ? "#00f6ff" : "transparent", backgroundColor: isSelected ? "#111" : "transparent", padding: 10 }}>
//                   <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => playMusic(m.id)}>
//                     <Ionicons name="musical-notes" size={28} color="white" />
//                     <View style={{ marginLeft: 10, flex: 1 }}>
//                       <Text style={{ color: "white", fontSize: 15 }}>{m.title}</Text>
//                       <Text style={{ color: "gray", fontSize: 13 }}>{m.artist}</Text>
//                     </View>
//                     {isSelected && <Ionicons name="checkmark-circle" size={28} color="#0095f6" />}
//                   </TouchableOpacity>
//                   {isSelected && (
//                     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10,flexWrap: "wrap" }}>
//                       <TouchableOpacity onPress={handleDeselect}>
//                         <Ionicons name="close-circle" size={26} color="red" />
//                       </TouchableOpacity>
//                       <Text style={{ color: "#00f6ff", fontSize: 8 }}>Selected</Text>
//                     </View>
//                   )}
//                 </View>
//               );
//             })}
//           </ScrollView>

//           {/* Bottom Control Bar */}
//           {selectedMusicId && (
//             <View style={{ backgroundColor: "#1a1a1a", padding: 12, borderTopWidth: 1, borderTopColor: "#333" }}>
//               <Slider
//                 style={{ width: "100%", height: 40 }}
//                 minimumValue={0}
//                 maximumValue={soundDuration}
//                 value={soundPosition}
//                 onSlidingComplete={handleSeek}
//                 minimumTrackTintColor="#0095f6"
//                 maximumTrackTintColor="#444"
//                 thumbTintColor="#00f6ff"
//               />
//               <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
//                 <Text style={{ color: "white" }}>{formatTime(soundPosition)}</Text>
//                 <Text style={{ color: "white" }}>{formatTime(soundDuration)}</Text>
//               </View>

//               {/* Inputs for start/end */}
//               <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10, alignItems: "center" }}>
//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                   <Text style={{ color: "white", marginRight: 4, fontSize: 8 }}>Start</Text>
//                   <TextInput
//                     style={{ backgroundColor: "#222", color: "white", padding: 4, width: 35, marginRight: 2, textAlign: "center", borderRadius: 4 }}
//                     keyboardType="numeric"
//                     value={startInput.min}
//                     onChangeText={(t) => setStartInput((p) => ({ ...p, min: t.replace(/[^0-9]/g, "") }))}
//                     placeholder="m"
//                     placeholderTextColor="#777"
//                   />
//                   <Text style={{ color: "white" }}>:</Text>
//                   <TextInput
//                     style={{ backgroundColor: "#222", color: "white", padding: 4, width: 35, marginLeft: 2, textAlign: "center", borderRadius: 4 }}
//                     keyboardType="numeric"
//                     value={startInput.sec}
//                     onChangeText={(t) => setStartInput((p) => ({ ...p, sec: t.replace(/[^0-9]/g, "") }))}
//                     placeholder="s"
//                     placeholderTextColor="#777"
//                   />
//                 </View>

//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                   <Text style={{ color: "white", marginRight: 4, fontSize: 8 }}>End</Text>
//                   <TextInput
//                     style={{ backgroundColor: "#222", color: "white", padding: 4, width: 35, marginRight: 2, textAlign: "center", borderRadius: 4 }}
//                     keyboardType="numeric"
//                     value={endInput.min}
//                     onChangeText={(t) => setEndInput((p) => ({ ...p, min: t.replace(/[^0-9]/g, "") }))}
//                     placeholder="m"
//                     placeholderTextColor="#777"
//                   />
//                   <Text style={{ color: "white" }}>:</Text>
//                   <TextInput
//                     style={{ backgroundColor: "#222", color: "white", padding: 4, width: 35, marginLeft: 2, textAlign: "center", borderRadius: 4 }}
//                     keyboardType="numeric"
//                     value={endInput.sec}
//                     onChangeText={(t) => setEndInput((p) => ({ ...p, sec: t.replace(/[^0-9]/g, "") }))}
//                     placeholder="s"
//                     placeholderTextColor="#777"
//                   />
//                 </View>

//                 <TouchableOpacity onPress={applyRangeFromInputs} style={{ backgroundColor: "#0095f6", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}>
//                   <Text style={{ color: "white", fontSize: 8 }}>Apply</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// export default MusicScreen;

// musicPanel.tsx
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useUploadStore } from "../../src/store/reelUploadStore";

interface MusicOption {
  id: string;
  title: string;
  artist: string;
  uri?: string;
}

interface MusicScreenProps {
  setIsSelectingMusic: (val: boolean) => void;
  musicOptions: MusicOption[];
  isSelectingMusic: boolean;
  soundRef: React.MutableRefObject<Audio.Sound | null>,
  setSelectedMusicId:any,
  selectedMusicId:any;
}

const MusicScreen: React.FC<MusicScreenProps> = ({
  setIsSelectingMusic,
  musicOptions,
  isSelectingMusic,
  soundRef,
}) => {
  const {
    selectedMusic,
    selectMusic,
    musicVolume,
    setMusicVolume,
  } = useUploadStore();

  const playMusic = async (uri: string | null) => {
    if (!uri) return;
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { volume: musicVolume / 100, shouldPlay: true }
    );
    soundRef.current = sound;
  };

  const handleSelectMusic = async (music: MusicOption) => {
    selectMusic({
      id: music.id,
      uri: music.uri ?? null,
      startMs: 0,
      endMs: 0, // or you can set max duration
      volume: musicVolume,
    });
    await playMusic(music.uri ?? null);
    setIsSelectingMusic(false);
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        maxHeight: 250,
        backgroundColor: "#111",
        paddingVertical: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginBottom: 8,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Music</Text>
        <TouchableOpacity onPress={() => setIsSelectingMusic(false)}>
          <Ionicons name="close-circle" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {musicOptions.map((music) => (
          <TouchableOpacity
            key={music.id}
            onPress={() => handleSelectMusic(music)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: selectedMusic.id === music.id ? "#333" : "transparent",
              marginBottom: 4,
              borderRadius: 8,
            }}
          >
            <Ionicons
              name={selectedMusic.id === music.id ? "musical-note" : "musical-notes"}
              size={24}
              color="white"
              style={{ marginRight: 12 }}
            />
            <View>
              <Text style={{ color: "white", fontWeight: "bold" }}>{music.title}</Text>
              <Text style={{ color: "white", fontSize: 12 }}>{music.artist}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MusicScreen;
