// old code defult video player 
// import { useVideoPlayer, VideoView } from "expo-video";
// import React, { useEffect } from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";

// export const FeedItem = React.memo(
//     ({
//         item,
//         isActive,
//         isFocused,
//         onLike,
//         onSave,
//         onComment,
//         onShare,
//         theme,
//         isMuted,
//         toggleMute,
//     }: any) => {
//         //  Player setup (controls hidden)
//         const player = useVideoPlayer(item.imageUrl, (p) => {
//             p.loop = true;
//             p.volume = isMuted ? 0 : 1;
//             // p.showControls = false; // hide fullscreen/seek controls
//         });

//         //  Play/pause logic
//         useEffect(() => {
//             if (isActive && isFocused) player.play();
//             else player.pause();
//         }, [isActive, isFocused]);

//         // Mute/unmute
//         useEffect(() => {
//             player.volume = isMuted ? 0 : 1;
//         }, [isMuted]);

//         return (
//             <View style={[styles.reel, { backgroundColor: theme.background }]}>
//                 {/* Header */}
//                 <View style={[styles.header, { backgroundColor: theme.overlay }]}>
//                     <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
//                     <View style={styles.userInfo}>
//                         <Text style={[styles.username, { color: "#fff" }]}>{item.username}</Text>
//                         <Text style={{ color: "#fff", fontSize: 10 }}>{item.title.slice(0, 30)}</Text>
//                     </View>
//                 </View>

//                 {/* Video */}
//                 <View style={{ width: "100%", height: "80%" }}>
//                     <VideoView
//                         style={{ width: "100%", height: "100%" }}
//                         player={player}
//                         contentFit="cover"
//                         nativeControls={false} //  disable default player UI
//                     />
//                     <TouchableOpacity onPress={toggleMute} style={styles.volumeBtn}>
//                         <Icon name={isMuted ? "volume-mute" : "volume-high"} size={24} color="white" />
//                     </TouchableOpacity>
//                 </View>

//                 {/* Bottom actions */}
//                 <View style={styles.actionsRow}>
//                     <TouchableOpacity onPress={() => onLike(item.id)} style={styles.actionBtn}>
//                         <Icon
//                             name={item.liked ? "heart" : "heart-outline"}
//                             size={29}
//                             color={item.liked ? "red" : theme.text}
//                         />
//                         <Text style={[styles.countText, { color: theme.text }]}>{item.likes}</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={() => onComment(item.id)} style={styles.actionBtn}>
//                         <Icon name="chatbubble-outline" size={25} color={theme.text} />
//                         <Text style={[styles.countText, { color: theme.text }]}>{item.comments ?? 0}</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={() => onShare(item.id)} style={styles.actionBtn}>
//                         <Icon name="share-social-outline" size={25} color={theme.text} />
//                         <Text style={[styles.countText, { color: theme.text }]}>{item.shares ?? 0}</Text>
//                     </TouchableOpacity>

//                     {/* <TouchableOpacity onPress={() => onSave(item.id)} style={{ marginLeft: "auto" }}>
//                         <Icon
//                             name={item.saved ? "bookmark" : "bookmark-outline"}
//                             size={25}
//                             color={theme.text}
//                         />
//                     </TouchableOpacity> */}
//                 </View>

//                 <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
//             </View>
//         );
//     }
// );

// const styles = StyleSheet.create({
//     reel: { height: 700 },
//     header: {
//         flexDirection: "row",
//         alignItems: "center",
//         padding: 10,
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 10,
//     },
//     profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
//     userInfo: { flex: 1 },
//     username: { fontSize: 16, fontWeight: "600" },
//     title: { padding: 10, fontSize: 16 },
//     actionsRow: {
//         flexDirection: "row",
//         gap: 15,
//         paddingHorizontal: 20,
//         paddingVertical: 8,
//         alignItems: "center",
//     },
//     actionBtn: {
//         flexDirection: "row", 
//         alignItems: "center",
//         gap: 5, 
//     },
//     countText: {
//         fontSize: 14,
//         fontWeight: "500",
//     },
//     volumeBtn: {
//         position: "absolute",
//         bottom: 60,
//         right: 10,
//         backgroundColor: "rgba(0,0,0,0.3)",
//         padding: 5,
//         borderRadius: 20,
//     },
// });


// ================================================

// import { useVideoPlayer, VideoView } from "expo-video";
// import React, { useEffect, useState } from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";

// export const FeedItem = React.memo(
//     ({
//         item,
//         isActive,
//         isFocused,
//         onLike,
//         onSave,
//         onComment,
//         onShare,
//         theme,
//         isMuted,
//         toggleMute,
//     }: any) => {
//         const [isPlaying, setIsPlaying] = useState(false);
//         const [isFullscreen, setIsFullscreen] = useState(false);
//         const [showControls, setShowControls] = useState(true);

//         // Player setup
//         const player = useVideoPlayer(item.imageUrl, (p) => {
//             p.loop = true;
//             p.volume = isMuted ? 0 : 1;
//         });

//         // Play/pause logic based on active state
//         useEffect(() => {
//             if (isActive && isFocused) {
//                 player.play();
//                 setIsPlaying(true);
//             } else {
//                 player.pause();
//                 setIsPlaying(false);
//             }
//         }, [isActive, isFocused]);

//         // Mute/unmute
//         useEffect(() => {
//             player.volume = isMuted ? 0 : 1;
//         }, [isMuted]);

//         // Auto-hide controls after 3 seconds
//         useEffect(() => {
//             if (showControls) {
//                 const timer = setTimeout(() => {
//                     setShowControls(false);
//                 }, 3000);
//                 return () => clearTimeout(timer);
//             }
//         }, [showControls]);

//         // Toggle play/pause
//         const togglePlayPause = () => {
//             if (isPlaying) {
//                 player.pause();
//                 setIsPlaying(false);
//             } else {
//                 player.play();
//                 setIsPlaying(true);
//             }
//             setShowControls(true);
//         };

//         // Seek backward 5 seconds
//         const seekBackward = () => {
//             const currentTime = player.currentTime;
//             player.seekBy(-5);
//             setShowControls(true);
//         };

//         // Seek forward 5 seconds
//         const seekForward = () => {
//             const currentTime = player.currentTime;
//             player.seekBy(5);
//             setShowControls(true);
//         };

//         // Toggle fullscreen
//         const toggleFullscreen = () => {
//             setIsFullscreen(!isFullscreen);
//             setShowControls(true);
//         };

//         // Show controls on video tap
//         const handleVideoPress = () => {
//             setShowControls(true);
//         };

//         return (
//             <View style={[styles.reel, { backgroundColor: theme.background }]}>
//                 {/* Header */}
//                 {!isFullscreen && (
//                     <View style={[styles.header, { backgroundColor: theme.overlay }]}>
//                         <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
//                         <View style={styles.userInfo}>
//                             <Text style={[styles.username, { color: "#fff" }]}>{item.username}</Text>
//                             <Text style={{ color: "#fff", fontSize: 10 }}>{item.title.slice(0, 30)}</Text>
//                         </View>
//                     </View>
//                 )}

//                 {/* Video Container */}
//                 <View style={[
//                     isFullscreen ? styles.fullscreenContainer : styles.videoContainer
//                 ]}>
//                     <TouchableOpacity 
//                         activeOpacity={1} 
//                         onPress={handleVideoPress}
//                         style={{ flex: 1 }}
//                     >
//                         <VideoView
//                             style={{ width: "100%", height: "100%" }}
//                             player={player}
//                             contentFit={isFullscreen ? "contain" : "cover"}
//                             nativeControls={false}
//                         />
//                     </TouchableOpacity>

//                     {/* Custom Video Controls */}
//                     {showControls && (
//                         <View style={styles.controlsOverlay}>
//                             {/* Center Controls - Backward, Play/Pause, Forward */}
//                             <View style={styles.centerControls}>
//                                 {/* Seek Backward 5s */}
//                                 <TouchableOpacity onPress={seekBackward} style={styles.centerControlBtn}>
//                                     <Icon name="play-back" size={30} color="white" />
//                                     <Text style={styles.controlText}>5s</Text>
//                                 </TouchableOpacity>

//                                 {/* Play/Pause */}
//                                 <TouchableOpacity onPress={togglePlayPause} style={styles.centerPlayBtn}>
//                                     <Icon 
//                                         name={isPlaying ? "pause" : "play"} 
//                                         size={40} 
//                                         color="white" 
//                                     />
//                                 </TouchableOpacity>

//                                 {/* Seek Forward 5s */}
//                                 <TouchableOpacity onPress={seekForward} style={styles.centerControlBtn}>
//                                     <Icon name="play-forward" size={30} color="white" />
//                                     <Text style={styles.controlText}>5s</Text>
//                                 </TouchableOpacity>
//                             </View>

//                             {/* Fullscreen Toggle - Bottom Right */}
//                             <TouchableOpacity 
//                                 onPress={toggleFullscreen} 
//                                 style={styles.fullscreenBtn}
//                             >
//                                 <Icon 
//                                     name={isFullscreen ? "contract" : "expand"} 
//                                     size={24} 
//                                     color="white" 
//                                 />
//                             </TouchableOpacity>
//                         </View>
//                     )}

//                     {/* Volume Button */}
//                     <TouchableOpacity onPress={toggleMute} style={styles.volumeBtn}>
//                         <Icon name={isMuted ? "volume-mute" : "volume-high"} size={24} color="white" />
//                     </TouchableOpacity>
//                 </View>

//                 {/* Bottom Actions - Hide in Fullscreen */}
//                 {!isFullscreen && (
//                     <>
//                         <View style={styles.actionsRow}>
//                             <TouchableOpacity onPress={() => onLike(item.id)} style={styles.actionBtn}>
//                                 <Icon
//                                     name={item.liked ? "heart" : "heart-outline"}
//                                     size={29}
//                                     color={item.liked ? "red" : theme.text}
//                                 />
//                                 <Text style={[styles.countText, { color: theme.text }]}>{item.likes}</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity onPress={() => onComment(item.id)} style={styles.actionBtn}>
//                                 <Icon name="chatbubble-outline" size={25} color={theme.text} />
//                                 <Text style={[styles.countText, { color: theme.text }]}>{item.comments ?? 0}</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity onPress={() => onShare(item.id)} style={styles.actionBtn}>
//                                 <Icon name="share-social-outline" size={25} color={theme.text} />
//                                 <Text style={[styles.countText, { color: theme.text }]}>{item.shares ?? 0}</Text>
//                             </TouchableOpacity>
//                         </View>

//                         <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
//                     </>
//                 )}
//             </View>
//         );
//     }
// );

// const styles = StyleSheet.create({
//     reel: { 
//         height: 700,
//         position: "relative",
//     },
//     header: {
//         flexDirection: "row",
//         alignItems: "center",
//         padding: 10,
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 10,
//     },
//     profileImage: { 
//         width: 40, 
//         height: 40, 
//         borderRadius: 20, 
//         marginRight: 10 
//     },
//     userInfo: { 
//         flex: 1 
//     },
//     username: { 
//         fontSize: 16, 
//         fontWeight: "600" 
//     },
//     title: { 
//         padding: 10, 
//         fontSize: 16 
//     },
//     videoContainer: {
//         width: "100%",
//         height: "80%",
//         position: "relative",
//     },
//     fullscreenContainer: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         width: "100%",
//         height: "100%",
//         zIndex: 999,
//         backgroundColor: "#000",
//     },
//     controlsOverlay: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "rgba(0,0,0,0.3)",
//     },
//     centerControls: {
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         gap: 40,
//     },
//     centerControlBtn: {
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 10,
//     },
//     centerPlayBtn: {
//         width: 60,
//         height: 60,
//         borderRadius: 40,
//         backgroundColor: "rgba(0,0,0,0.6)",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     fullscreenBtn: {
//         position: "absolute",
//         bottom: 20,
//         right: 10,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         padding: 8,
//         borderRadius: 20,
//     },
//     controlText: {
//         color: "white",
//         fontSize: 11,
//         marginTop: 2,
//         fontWeight: "600",
//     },
//     actionsRow: {
//         flexDirection: "row",
//         gap: 15,
//         paddingHorizontal: 20,
//         paddingVertical: 8,
//         alignItems: "center",
//     },
//     actionBtn: {
//         flexDirection: "row", 
//         alignItems: "center",
//         gap: 5, 
//     },
//     countText: {
//         fontSize: 14,
//         fontWeight: "500",
//     },
//     volumeBtn: {
//         position: "absolute",
//         bottom: 80,
//         right: 10,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         padding: 8,
//         borderRadius: 20,
//         zIndex: 5,
//     },
// });

// ================================================


// import { useVideoPlayer, VideoView } from "expo-video";
// import React, { useEffect, useState } from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";

// export const FeedItem = React.memo(
//     ({
//         item,
//         isActive,
//         isFocused,
//         onLike,
//         onSave,
//         onComment,
//         onShare,
//         theme,
//         isMuted,
//         toggleMute,
//     }: any) => {
//         const [isPlaying, setIsPlaying] = useState(false);
//         const [isFullscreen, setIsFullscreen] = useState(false);
//         const [showControls, setShowControls] = useState(true);

//         // Player setup
//         const player = useVideoPlayer(item.imageUrl, (p) => {
//             p.loop = true;
//             p.volume = isMuted ? 0 : 1;
//         });

//         // Play/pause logic based on active state
//         useEffect(() => {
//             if (isActive && isFocused) {
//                 player.play();
//                 setIsPlaying(true);
//             } else {
//                 player.pause();
//                 setIsPlaying(false);
//             }
//         }, [isActive, isFocused]);

//         // Mute/unmute
//         useEffect(() => {
//             player.volume = isMuted ? 0 : 1;
//         }, [isMuted]);

//         // Auto-hide controls after 3 seconds
//         useEffect(() => {
//             if (showControls) {
//                 const timer = setTimeout(() => {
//                     setShowControls(false);
//                 }, 3000);
//                 return () => clearTimeout(timer);
//             }
//         }, [showControls]);

//         // Toggle play/pause
//         const togglePlayPause = () => {
//             if (isPlaying) {
//                 player.pause();
//                 setIsPlaying(false);
//             } else {
//                 player.play();
//                 setIsPlaying(true);
//             }
//             setShowControls(true);
//         };

//         // Seek backward 5 seconds
//         const seekBackward = () => {
//             const currentTime = player.currentTime;
//             player.seekBy(-5);
//             setShowControls(true);
//         };

//         // Seek forward 5 seconds
//         const seekForward = () => {
//             const currentTime = player.currentTime;
//             player.seekBy(5);
//             setShowControls(true);
//         };

//         // Toggle fullscreen
//         const toggleFullscreen = () => {
//             setIsFullscreen(!isFullscreen);
//             setShowControls(true);
//         };

//         // Show controls on video tap
//         const handleVideoPress = () => {
//             setShowControls(true);
//         };

//         return (
//             <View style={[styles.reel, { backgroundColor: theme.background }]}>
//                 {/* Header - Always visible */}
//                 <View style={[styles.header, { backgroundColor: theme.overlay }]}>
//                     <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
//                     <View style={styles.userInfo}>
//                         <Text style={[styles.username, { color: "#fff" }]}>{item.username}</Text>
//                         <Text style={{ color: "#fff", fontSize: 10 }}>{item.title.slice(0, 30)}</Text>
//                     </View>
//                 </View>

//                 {/* Video Container */}
//                 <View style={[
//                     styles.videoContainer,
//                     isFullscreen && styles.fullscreenVideo
//                 ]}>
//                     <TouchableOpacity 
//                         activeOpacity={1} 
//                         onPress={handleVideoPress}
//                         style={{ flex: 1 }}
//                     >
//                         <VideoView
//                             style={{ width: "100%", height: "100%" }}
//                             player={player}
//                             contentFit={isFullscreen ? "contain" : "cover"}
//                             nativeControls={false}
//                         />
//                     </TouchableOpacity>

//                     {/* Custom Video Controls */}
//                     {showControls && (
//                         <View style={styles.controlsOverlay}>
//                             {/* Center Controls - Backward, Play/Pause, Forward */}
//                             <View style={styles.centerControls}>
//                                 {/* Seek Backward 5s */}
//                                 <TouchableOpacity onPress={seekBackward} style={styles.centerControlBtn}>
//                                     <Icon name="play-back" size={30} color="white" />
//                                     <Text style={styles.controlText}>5s</Text>
//                                 </TouchableOpacity>

//                                 {/* Play/Pause */}
//                                 <TouchableOpacity onPress={togglePlayPause} style={styles.centerPlayBtn}>
//                                     <Icon 
//                                         name={isPlaying ? "pause" : "play"} 
//                                         size={40} 
//                                         color="white" 
//                                     />
//                                 </TouchableOpacity>

//                                 {/* Seek Forward 5s */}
//                                 <TouchableOpacity onPress={seekForward} style={styles.centerControlBtn}>
//                                     <Icon name="play-forward" size={30} color="white" />
//                                     <Text style={styles.controlText}>5s</Text>
//                                 </TouchableOpacity>
//                             </View>

//                             {/* Fullscreen Toggle - Bottom Right */}
//                             <TouchableOpacity 
//                                 onPress={toggleFullscreen} 
//                                 style={styles.fullscreenBtn}
//                             >
//                                 <Icon 
//                                     name={isFullscreen ? "contract" : "expand"} 
//                                     size={24} 
//                                     color="white" 
//                                 />
//                             </TouchableOpacity>
//                         </View>
//                     )}

//                     {/* Volume Button */}
//                     <TouchableOpacity onPress={toggleMute} style={styles.volumeBtn}>
//                         <Icon name={isMuted ? "volume-mute" : "volume-high"} size={24} color="white" />
//                     </TouchableOpacity>
//                 </View>

//                 {/* Bottom Actions - Always visible */}
//                 <View style={styles.actionsRow}>
//                     <TouchableOpacity onPress={() => onLike(item.id)} style={styles.actionBtn}>
//                         <Icon
//                             name={item.liked ? "heart" : "heart-outline"}
//                             size={29}
//                             color={item.liked ? "red" : theme.text}
//                         />
//                         <Text style={[styles.countText, { color: theme.text }]}>{item.likes}</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={() => onComment(item.id)} style={styles.actionBtn}>
//                         <Icon name="chatbubble-outline" size={25} color={theme.text} />
//                         <Text style={[styles.countText, { color: theme.text }]}>{item.comments ?? 0}</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={() => onShare(item.id)} style={styles.actionBtn}>
//                         <Icon name="share-social-outline" size={25} color={theme.text} />
//                         <Text style={[styles.countText, { color: theme.text }]}>{item.shares ?? 0}</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* Caption - Always visible */}
//                 <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
//             </View>
//         );
//     }
// );

// const styles = StyleSheet.create({
//     reel: { 
//         height: 700,
//         position: "relative",
//     },
//     header: {
//         flexDirection: "row",
//         alignItems: "center",
//         padding: 10,
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 10,
//     },
//     profileImage: { 
//         width: 40, 
//         height: 40, 
//         borderRadius: 20, 
//         marginRight: 10 
//     },
//     userInfo: { 
//         flex: 1 
//     },
//     username: { 
//         fontSize: 16, 
//         fontWeight: "600" 
//     },
//     title: { 
//         padding: 10, 
//         fontSize: 16 
//     },
//     videoContainer: {
//         width: "100%",
//         height: "80%",
//         position: "relative",
//     },
//     fullscreenVideo: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         height: "100%",
//         width: "100%",
//         zIndex: 5,
//     },
//     controlsOverlay: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "rgba(0,0,0,0.3)",
//     },
//     centerControls: {
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         gap: 40,
//     },
//     centerControlBtn: {
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 10,
//     },
//     centerPlayBtn: {
//         width: 60,
//         height: 60,
//         borderRadius: 40,
//         backgroundColor: "rgba(0,0,0,0.6)",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     fullscreenBtn: {
//         position: "absolute",
//         bottom: 20,
//         right: 10,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         padding: 8,
//         borderRadius: 20,
//     },
//     controlText: {
//         color: "white",
//         fontSize: 11,
//         marginTop: 2,
//         fontWeight: "600",
//     },
//     actionsRow: {
//         flexDirection: "row",
//         gap: 15,
//         paddingHorizontal: 20,
//         paddingVertical: 8,
//         alignItems: "center",
//     },
//     actionBtn: {
//         flexDirection: "row", 
//         alignItems: "center",
//         gap: 5, 
//     },
//     countText: {
//         fontSize: 14,
//         fontWeight: "500",
//     },
//     volumeBtn: {
//         position: "absolute",
//         bottom: 80,
//         right: 10,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         padding: 8,
//         borderRadius: 20,
//         zIndex: 5,
//     },
// });

// ================================================

import { useLike } from "@/src/hooks/useLike";
import { useMarkViewedMutation } from "@/src/hooks/useMarkViewedMutation";
import { useLikeMutation } from "@/src/hooks/userLikeMutation";
import { useBookmarkStore } from "@/src/store/useBookmarkStore";
import { formatCount } from "@/src/utils/formatCount";
import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, Linking, Pressable, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";


export const FeedItem = React.memo(
    ({
        item,
        isActive,
        isFocused,
        onLike,
        onSave,
        onComment,
        onShare,
        theme,
        isMuted,
        toggleMute,
        addShare
    }: any) => {
        const [isPlaying, setIsPlaying] = useState(false);
        const [isFullscreen, setIsFullscreen] = useState(false);
        const [showControls, setShowControls] = useState(true);
        const [showFullCaption, setShowFullCaption] = useState(false);
        const [showThumbnail, setShowThumbnail] = useState(true);
        const [captionLayout, setCaptionLayout] = useState({ lineCount: 0 });
        // Caption ke liye check karein ki 5+ lines hain ya nahi
        const shouldShowMore = captionLayout.lineCount > 5;
        const [bookmarked, setBookmarked] = useState(false);
        const [showShareDrawer, setShowShareDrawer] = useState(false);
        const isOwner = item.user?.id === item.ownerId;
        const [showBottomDrawer, setShowBottomDrawer] = useState(false);
        const [showReportDrawer, setShowReportDrawer] = useState(false);
        const { openBookmarkPanel } = useBookmarkStore();
        const likeMutation = useLikeMutation();

        // const [viewed, setViewed] = useState(false);
        const [viewed, setViewed] = useState(item.isViewed === true);

        const markViewedMutation = useMarkViewedMutation(item.id || item.uuid);
        const viewCheckRef = useRef<NodeJS.Timeout | number>(null);
        const {
            liked,
            likesCount,
            handleLike,
        } = useLike({
            isLiked: item.isLiked,
            likesCount: item.likesCount,
            id: item.uuid || item.id,
            likeMutation,
        });

        // Player setup
        const player = useVideoPlayer(item.videoUrl, (p) => {
            p.loop = true;
            p.volume = isMuted ? 0 : 1;
        });

        // Play/pause logic based on active state
        useEffect(() => {
            if (isActive && isFocused) {
                setShowThumbnail(true);
                player.play();
                setIsPlaying(true);

                const timer = setTimeout(() => {
                    setShowThumbnail(false);
                }, 500);
                return () => clearTimeout(timer);
            } else {
                player.pause();
                setIsPlaying(false);

                setShowThumbnail(true);

                if (isFullscreen) {
                    setIsFullscreen(false);
                }
            }
        }, [isActive, isFocused]);

        // Mute/unmute
        useEffect(() => {
            player.volume = isMuted ? 0 : 1;
        }, [isMuted]);

        // Auto-hide controls after 3 seconds
        useEffect(() => {
            if (showControls) {
                const timer = setTimeout(() => {
                    setShowControls(false);
                }, 3000);
                return () => clearTimeout(timer);
            }
        }, [showControls]);

        // const truncateText = (text: string, maxWords: number = 6) => {
        //     const words = text.split(" ");
        //     return {
        //         shortText: words.slice(0, maxWords).join(" "),
        //         isTruncated: words.length > maxWords,
        //     };
        // };

        // const { shortText, isTruncated } = truncateText(item.caption);

        // const handleComment = useCallback(
        //     (id: string) => router.push(`../../../comment/${id}`),
        //     []
        // );

        const handleShare = useCallback(() => {
            // Call addShare to increment share count
            if (addShare) {
                addShare(item.id || item.uuid);
            }

            // Navigate to chat list in share mode
            router.push({
                pathname: `/chat`,
                params: {
                    shareMode: "true",
                    reelId: item.id || item.uuid
                }
            });
        }, [item.id, item.uuid, addShare]);


        useEffect(() => {
            if (!isActive || !isFocused || viewed) {
                if (viewCheckRef.current) {
                    clearInterval(viewCheckRef.current);
                    viewCheckRef.current = null;
                }
                return;
            }

            // Check every second if video has been watched for 10 seconds
            viewCheckRef.current = setInterval(() => {
                try {
                    const currentTime = player.currentTime;
                    if (currentTime >= 10 && !viewed) {
                        setViewed(true);
                        markViewedMutation.mutate(item.uuid || item.id);
                        if (viewCheckRef.current) {
                            clearInterval(viewCheckRef.current);
                            viewCheckRef.current = null;
                        }
                    }
                } catch (error) {
                    console.log("View tracking error:", error);
                }
            }, 1000);

            return () => {
                if (viewCheckRef.current) {
                    clearInterval(viewCheckRef.current);
                    viewCheckRef.current = null;
                }
            };
        }, [isActive, isFocused, viewed, player, item.uuid, item.id]);


        // const handleBookmark = () => {
        //     setBookmarked(prev => !prev);
        // };

        // const handleShareOptions = useCallback(() => {
        //     setShowShareDrawer(true);
        // }, []);

        // Toggle play/pause
        const togglePlayPause = () => {
            if (isPlaying) {
                player.pause();
                setIsPlaying(false);
                // setShowThumbnail(true);
            } else {
                // setShowThumbnail(true);
                player.play();
                setIsPlaying(true);
                setTimeout(() => {
                    setShowThumbnail(false);
                }, 300);
            }
            setShowControls(true);
        };

        // Seek backward 5 seconds
        const seekBackward = () => {
            const currentTime = player.currentTime;
            player.seekBy(-5);
            setShowControls(true);
        };

        // Seek forward 5 seconds
        const seekForward = () => {
            const currentTime = player.currentTime;
            player.seekBy(5);
            setShowControls(true);
        };

        // Toggle fullscreen
        const toggleFullscreen = () => {
            setIsFullscreen(!isFullscreen);
            setShowControls(true);
        };

        // Show controls on video tap
        const handleVideoPress = () => {
            setShowControls(true);
        };
        // console.log('====================================');
        // console.log("reeeeeeeeeelllssssssssssssiiiiidiiiididiididiidididididiiddiid", item || item.uuid);
        // console.log('====================================');


        // 1. Share function ko FeedItem mein add karein:
        const handleSharePlatform = async (platform: string) => {
            const videoUrl = item.videoUrl; // Current playing video URL
            const reelUrl = item.id || item.uuid; // Reel ID
            const encodedUrl = encodeURIComponent(`testing.hithoy.com/reels/${reelUrl}&redirected=true`);

            let url = "";

            switch (platform) {
                case "whatsapp":
                    url = `whatsapp://send?text=${encodedUrl}`;
                    break;
                case "telegram":
                    url = `tg://msg?text=${encodedUrl}`;
                    break;
                case "facebook":
                    url = `fb://facewebmodal/f?href=https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                    break;
                case "instagram":
                    url = `instagram://share?text=${encodedUrl}`;
                    break;
                default:
                    await Share.share({
                        message: `testing.hithoy.com/reels/${reelUrl}&redirected=true`,
                    });
                    return;
            }

            try {
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                    await Linking.openURL(url);
                } else {
                    alert(`${platform} app is not installed!`);
                }
            } catch (error) {
                console.log("Error opening app:", error);
            }
        };

        return (
            <View style={[styles.reel, { backgroundColor: theme.background }]}>
                {/* Header - Always visible */}
                <Pressable
                    onPress={() => router.push(`/profile/${item.user?.username}`)}
                    style={[styles.header,
                        // { backgroundColor: theme.overlay }
                    ]}
                >
                    <Image
                        source={{ uri: item.user?.profilePic }}
                        style={styles.profileImage}
                    />
                    <View style={styles.userInfo}>
                        <Text style={[styles.username, { color: "#fff" }]}>
                            {item.user?.username}
                        </Text>
                    </View>
                </Pressable>

                {/* Video Container */}
                <View style={[
                    styles.videoContainer,
                    isFullscreen && styles.fullscreenVideo
                ]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={handleVideoPress}
                        style={{ flex: 1 }}
                    >

                        {showThumbnail && item.thumbnailUrl && (
                            <Image
                                source={{ uri: item.thumbnailUrl }}
                                style={styles.thumbnail}
                                resizeMode={isFullscreen ? "contain" : "cover"}
                            />
                        )}
                        <VideoView
                            style={{ width: "100%", height: "100%", opacity: showThumbnail ? 0 : 1 }}
                            player={player}
                            contentFit={isFullscreen ? "contain" : "cover"}
                            nativeControls={false}
                        />
                    </TouchableOpacity>

                    {/* Custom Video Controls */}
                    {showControls && (
                        <View style={styles.controlsOverlay}>
                            {/* Center Controls - Backward, Play/Pause, Forward */}
                            <View style={styles.centerControls}>
                                {/* Seek Backward 5s */}
                                <TouchableOpacity onPress={seekBackward} style={styles.centerControlBtn}>
                                    <Icon name="play-back" size={20} color="white" />
                                    <Text style={styles.controlText}>5s</Text>
                                </TouchableOpacity>

                                {/* Play/Pause */}
                                <Pressable onPress={togglePlayPause} style={styles.centerPlayBtn}>
                                    <Icon
                                        name={isPlaying ? "pause" : "play"}
                                        size={30}
                                        color="white"
                                    />
                                </Pressable>

                                {/* Seek Forward 5s */}
                                <Pressable onPress={seekForward} style={styles.centerControlBtn}>
                                    <Icon name="play-forward" size={20} color="white" />
                                    <Text style={styles.controlText}>5s</Text>
                                </Pressable>
                            </View>

                            {/* Fullscreen Toggle - Bottom Right */}
                            <Pressable
                                onPress={toggleFullscreen}
                                style={styles.fullscreenBtn}
                            >
                                <Icon
                                    name={isFullscreen ? "contract" : "expand"}
                                    size={16}
                                    color="white"
                                />
                            </Pressable>
                        </View>
                    )}

                    {/* Volume Button */}
                    <Pressable onPress={toggleMute} style={styles.volumeBtn}>
                        <Icon name={isMuted ? "volume-mute" : "volume-high"} size={16} color="white" />
                    </Pressable>
                </View>

                {/* Bottom Actions - Always visible */}
                <View style={styles.actionsRow}>
                    <View style={styles.leftActions}>
                        <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
                            <Icon
                                name={liked ? "heart" : "heart-outline"}
                                size={20}
                                color={liked ? "red" : theme.text}
                            />
                            <Text style={[styles.countText, { color: theme.text }]}>{likesCount}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => onComment(item.id)} style={styles.actionBtn}>
                            <Icon name="chatbubble-outline" size={20} color={theme.text} />
                            <Text style={[styles.countText, { color: theme.text }]}>{formatCount(item.commentsCount)}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                            <Icon name="paper-plane-outline" size={20} color={theme.text} />
                            <Text style={[styles.countText, { color: theme.text }]}>{formatCount(item.sharesCount || 0)}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleSharePlatform("other")} >
                            <Icon name="share-social-outline" size={20} color={theme.text} />
                            <Text style={[styles.countText, { color: theme.text }]}>{formatCount(item.shares ?? 0)}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* RIGHT SIDE BOOKMARK */}
                    <TouchableOpacity style={styles.actionBtn} onPress={() => openBookmarkPanel(item.id || item.uuid)}>
                        <Icon
                            name="bookmark-outline"
                            size={20}
                            color={theme.text}
                        />
                    </TouchableOpacity>
                </View>

                {/* Caption - Always visible */}
                {/* <View style={{ paddingHorizontal: 10, paddingBottom: 10, flex: 1 }}>
                    <Text style={{ color: theme.text }}
                    // numberOfLines={showFullCaption ? undefined : 5}
                    // onTextLayout={(e) => {
                    //     if (!showFullCaption && captionLayout.lineCount === 0) {
                    //         setCaptionLayout({ lineCount: e.nativeEvent.lines.length });
                    //     }
                    // }}
                    >
                        {showFullCaption ? item.caption : shortText}
                        {!showFullCaption && isTruncated ? "..." : ""}
                    </Text>

                    {isTruncated && (
                        <Pressable onPress={() => setShowFullCaption(prev => !prev)}>
                            <Text style={{ color: "#aaa", marginTop: 4 }}>
                                {showFullCaption ? "less" : "more"}
                            </Text>
                        </Pressable>
                    )}
                </View> */}

                <View style={{ paddingHorizontal: 10, }}>
                    <Text>{item.title || ""}</Text>
                </View>

                {/* Caption - Always visible */}
                <View style={styles.captionWrapper}>
                    {showFullCaption ? (
                        <ScrollView
                            style={styles.captionScrollView}
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                        >
                            <Text style={[styles.captionText, { color: theme.text }]}>
                                {item.caption}
                            </Text>

                            {item.hashtags && item.hashtags.length > 0 && (
                                <Text style={[styles.hashtagText, { marginTop: 4 }]}>
                                    {item.hashtags
                                        .flatMap((tag: string) => tag.split(","))
                                        .map((tag: string) => `#${tag.trim()}`)
                                        .join(" ")}
                                </Text>
                            )}

                            <TouchableOpacity
                                onPress={() => setShowFullCaption(false)}
                                activeOpacity={0.7}
                                style={styles.showLessButton}
                            >
                                <Text style={styles.showLessText}>Show less</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    ) : (
                        <View style={styles.captionCollapsed}>
                            <Text
                                style={[styles.captionText, { color: theme.text }]}
                                numberOfLines={3}
                                onTextLayout={(e) => {
                                    if (captionLayout.lineCount === 0) {
                                        setCaptionLayout({ lineCount: e.nativeEvent.lines.length });
                                    }
                                }}
                            >
                                {item.caption}
                            </Text>

                            {item.hashtags && item.hashtags.length > 0 && (
                                <Text style={[styles.hashtagText, { marginTop: 4 }]} numberOfLines={1}>
                                    {item.hashtags
                                        .flatMap((tag: string) => tag.split(","))
                                        .map((tag: string) => `#${tag.trim()}`)
                                        .join(" ")}
                                </Text>
                            )}


                            {/* "...more" overlay at end of 5th line */}
                            {shouldShowMore && (
                                <TouchableOpacity
                                    onPress={() => setShowFullCaption(true)} style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: theme.background,
                                        paddingLeft: 40,
                                    }}>
                                    <Text style={{ color: theme.text }}>
                                        ...{' '}
                                        <Text style={{ color: '#4A9EFF', fontWeight: '600' }}>
                                            more
                                        </Text>
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Clickable area for "more" */}
                    {shouldShowMore && !showFullCaption && (
                        <TouchableOpacity
                            onPress={() => setShowFullCaption(true)}
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                                left: 10,
                                height: 20,
                            }}
                            activeOpacity={1}
                        />
                    )}
                </View>



                {/* <BottomDrawer
                    visible={showBottomDrawer}
                    onClose={() => setShowBottomDrawer(false)}
                    onSave={() => {
                        openBookmarkPanel(item.id || item.uuid);
                        setShowBottomDrawer(false);
                    }}
                    onReport={() => {
                        setShowReportDrawer(true);
                        setShowBottomDrawer(false);
                    }}
                    onDelete={isOwner ? () => {
                        console.log("Delete video:", item.id || item.uuid);
                        setShowBottomDrawer(false);
                    } : undefined}
                    reelId={item.id || item.uuid}
                    reelUrl={item.id || item.uuid}
                    reelDownloadUrl={item.videoUrl}
                    isOwner={isOwner}
                /> */}

                {/* <ReportDrawer
                    visible={showReportDrawer}
                    onClose={() => setShowReportDrawer(false)}
                    onSelect={(reason: string) => {
                        console.log("User reported for:", reason);
                        setShowReportDrawer(false);
                    }}
                    videoId={item.id || item.uuid}
                /> */}

            </View >
        );
    }
);

const styles = StyleSheet.create({
    reel: {
        height: 700,
        position: "relative",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    userInfo: {
        flex: 1
    },
    username: {
        fontSize: 16,
        fontWeight: "600"
    },
    title: {
        padding: 10,
        fontSize: 16
    },
    videoContainer: {
        width: "100%",
        height: "80%",
        position: "relative",
    },
    drawerContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
    },
    fullscreenVideo: {
        // position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: "100%",
        width: "100%",
        zIndex: 1,
        // backgroundColor: "#5d6166",
    },
    controlsOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 2,
    },
    centerControls: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 25,
    },
    centerControlBtn: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    centerPlayBtn: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    thumbnail: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
    },
    fullscreenBtn: {
        position: "absolute",
        bottom: 15,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 8,
        borderRadius: 20,
        marginRight: 50
    },
    controlText: {
        color: "white",
        fontSize: 11,
        marginTop: 2,
        fontWeight: "600",
    },
    actionsRow: {
        flexDirection: "row",
        gap: 15,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: "center",

        justifyContent: "space-between",
        //   paddingHorizontal: 12,
    },

    leftActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    countText: {
        fontSize: 14,
        fontWeight: "500",
    },
    volumeBtn: {
        position: "absolute",
        bottom: 15,
        right: 15,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 8,
        borderRadius: 20,
        zIndex: 5,
    },

    captionWrapper: {
        paddingHorizontal: 10,
        paddingBottom: 10,
        flex: 1,
    },
    captionScrollView: {
        maxHeight: 250,
    },
    captionCollapsed: {
        position: "relative",
    },
    captionText: {
        lineHeight: 20,
        fontSize: 14,
    },
    hashtagText: {
        color: "#4A9EFF",
        fontWeight: "600",
        fontSize: 14,
    },

    showLessButton: {
        marginTop: 12,
        paddingVertical: 4,
    },
    showLessText: {
        color: "#4A9EFF",
        fontWeight: "600",
        fontSize: 14,
    },

    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#ccc",
        marginBottom: 8,
    },
    closeBtn: {
        position: "absolute",
        right: 16,
        top: 6,
    },

});