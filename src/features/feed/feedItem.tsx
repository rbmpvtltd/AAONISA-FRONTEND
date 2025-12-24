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

import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    }: any) => {
        const [isPlaying, setIsPlaying] = useState(false);
        const [isFullscreen, setIsFullscreen] = useState(false);
        const [showControls, setShowControls] = useState(true);

        // Player setup
        const player = useVideoPlayer(item.videoUrl, (p) => {
            p.loop = true;
            p.volume = isMuted ? 0 : 1;
        });

        // Play/pause logic based on active state
        useEffect(() => {
            if (isActive && isFocused) {
                player.play();
                setIsPlaying(true);
            } else {
                player.pause();
                setIsPlaying(false);
                // Jab video inactive ho (user next/previous video par gaya), fullscreen close kar do
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

        // Toggle play/pause
        const togglePlayPause = () => {
            if (isPlaying) {
                player.pause();
                setIsPlaying(false);
            } else {
                player.play();
                setIsPlaying(true);
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

        return (
            <View style={[styles.reel, { backgroundColor: theme.background }]}>
                {/* Header - Always visible */}
                <View style={[styles.header, { backgroundColor: theme.overlay }]}>
                    <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
                    <View style={styles.userInfo}>
                        <Text style={[styles.username, { color: "#fff" }]}>{item.username}</Text>
                        <Text style={{ color: "#fff", fontSize: 10 }}>{item.title.slice(0, 30)}</Text>
                    </View>
                </View>

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
                        <VideoView
                            style={{ width: "100%", height: "100%" }}
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
                                    <Icon name="play-back" size={30} color="white" />
                                    <Text style={styles.controlText}>5s</Text>
                                </TouchableOpacity>

                                {/* Play/Pause */}
                                <TouchableOpacity onPress={togglePlayPause} style={styles.centerPlayBtn}>
                                    <Icon
                                        name={isPlaying ? "pause" : "play"}
                                        size={40}
                                        color="white"
                                    />
                                </TouchableOpacity>

                                {/* Seek Forward 5s */}
                                <TouchableOpacity onPress={seekForward} style={styles.centerControlBtn}>
                                    <Icon name="play-forward" size={30} color="white" />
                                    <Text style={styles.controlText}>5s</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Fullscreen Toggle - Bottom Right */}
                            <Pressable
                                onPress={toggleFullscreen}
                                style={styles.fullscreenBtn}
                            >
                                <Icon
                                    name={isFullscreen ? "contract" : "expand"}
                                    size={24}
                                    color="white"
                                />
                            </Pressable>
                        </View>
                    )}

                    {/* Volume Button */}
                    <TouchableOpacity onPress={toggleMute} style={styles.volumeBtn}>
                        <Icon name={isMuted ? "volume-mute" : "volume-high"} size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Bottom Actions - Always visible */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={() => onLike(item.id)} style={styles.actionBtn}>
                        <Icon
                            name={item.liked ? "heart" : "heart-outline"}
                            size={29}
                            color={item.liked ? "red" : theme.text}
                        />
                        <Text style={[styles.countText, { color: theme.text }]}>{item.likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onComment(item.id)} style={styles.actionBtn}>
                        <Icon name="chatbubble-outline" size={25} color={theme.text} />
                        <Text style={[styles.countText, { color: theme.text }]}>{item.comments ?? 0}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onShare(item.id)} style={styles.actionBtn}>
                        <Icon name="share-social-outline" size={25} color={theme.text} />
                        <Text style={[styles.countText, { color: theme.text }]}>{item.shares ?? 0}</Text>
                    </TouchableOpacity>
                </View>

                {/* Caption - Always visible */}
                <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
            </View>
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
    fullscreenVideo: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: "100%",
        width: "100%",
        zIndex: 5,
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
    },
    centerControls: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
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
    fullscreenBtn: {
        position: "absolute",
        bottom: 20,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 8,
        borderRadius: 20,
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
        paddingHorizontal: 20,
        paddingVertical: 8,
        alignItems: "center",
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    countText: {
        fontSize: 14,
        fontWeight: "500",
    },
    volumeBtn: {
        position: "absolute",
        bottom: 80,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 8,
        borderRadius: 20,
        zIndex: 5,
    },
});