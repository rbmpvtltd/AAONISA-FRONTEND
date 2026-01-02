// import React from 'react';
// import {
//     Dimensions,
//     FlatList,
//     Image,
//     Modal,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// interface VideoItem {
//     id: string;
//     thumbnailUrl: string;
//     viewsCount?: number;
//     likesCount?: number;
//     user?: {
//         username: string;
//         profilePic?: string;
//     };
// }

// interface AudioBottomSheetProps {
//     visible: boolean;
//     onClose: () => void;
//     audioData: {
//         isOriginal: boolean;
//         name?: string;
//         artist?: string;
//         coverImage?: string;
//         duration?: string;
//         usedCount?: number;
//         videos?: VideoItem[];
//     };
//     uploaderInfo: {
//         username: string;
//         profilePic?: string;
//     };
//     onUseAudio?: () => void;
//     onVideoPress?: (videoId: string) => void;
// }

// const AudioBottomSheet: React.FC<AudioBottomSheetProps> = ({
//     visible,
//     onClose,
//     audioData,
//     uploaderInfo,
//     onUseAudio,
//     onVideoPress,
// }) => {
//     const displayName = audioData.isOriginal
//         ? 'Original Sound'
//         : audioData.name || 'Unknown Audio';

//     const displayArtist = audioData.isOriginal
//         ? uploaderInfo.username
//         : audioData.artist || 'Unknown Artist';

//     // Grid layout calculations
//     const numColumns = 3;
//     const spacing = 4;
//     const thumbnailWidth = (SCREEN_WIDTH - 40 - spacing * (numColumns - 1)) / numColumns;

//     const renderVideoItem = ({ item }: { item: VideoItem }) => (
//         <TouchableOpacity
//             activeOpacity={0.9}
//             onPress={() => onVideoPress?.(item.id)}
//             style={[styles.thumbnailItem, { width: thumbnailWidth, height: thumbnailWidth * 1.6 }]}
//         >
//             <Image
//                 source={{ uri: item.thumbnailUrl }}
//                 style={styles.thumbnail}
//                 resizeMode="cover"
//             />
//             {/* Views overlay */}
//             {item.viewsCount !== undefined && (
//                 <View style={styles.viewsOverlay}>
//                     <Ionicons name="play" size={12} color="#fff" />
//                     <Text style={styles.viewsText}>
//                         {item.viewsCount > 1000
//                             ? `${(item.viewsCount / 1000).toFixed(1)}K`
//                             : item.viewsCount}
//                     </Text>
//                 </View>
//             )}
//         </TouchableOpacity>
//     );

//     return (
//         <Modal
//             visible={visible}
//             transparent
//             animationType="slide"
//             onRequestClose={onClose}
//         >
//             <TouchableOpacity
//                 style={styles.overlay}
//                 activeOpacity={1}
//                 onPress={onClose}
//             >
//                 <TouchableOpacity
//                     activeOpacity={1}
//                     style={styles.bottomSheet}
//                     onPress={(e) => e.stopPropagation()}
//                 >
//                     {/* Handle Bar */}
//                     <View style={styles.handleBar} />

//                     <ScrollView showsVerticalScrollIndicator={false}>
//                         {/* Audio Cover & Info */}
//                         <View style={styles.audioHeader}>
//                             <View style={styles.coverContainer}>
//                                 {audioData.coverImage ? (
//                                     <Image
//                                         source={{ uri: audioData.coverImage }}
//                                         style={styles.coverImage}
//                                     />
//                                 ) : (
//                                     <View style={styles.defaultCover}>
//                                         <Ionicons name="musical-notes" size={40} color="#fff" />
//                                     </View>
//                                 )}
//                             </View>

//                             <View style={styles.audioInfo}>
//                                 <Text style={styles.audioName} numberOfLines={2}>
//                                     {displayName}
//                                 </Text>
//                                 <View style={styles.artistRow}>
//                                     <Image
//                                         source={{
//                                             uri: uploaderInfo.profilePic ||
//                                                 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
//                                         }}
//                                         style={styles.artistAvatar}
//                                     />
//                                     <Text style={styles.artistName}>{displayArtist}</Text>
//                                 </View>
//                             </View>
//                         </View>

//                         {/* Stats */}
//                         <View style={styles.statsContainer}>
//                             {audioData.duration && (
//                                 <View style={styles.statItem}>
//                                     <Ionicons name="time-outline" size={16} color="#888" />
//                                     <Text style={styles.statText}>{audioData.duration}</Text>
//                                 </View>
//                             )}
//                             {audioData.usedCount !== undefined && (
//                                 <View style={styles.statItem}>
//                                     <Ionicons name="play-outline" size={16} color="#888" />
//                                     <Text style={styles.statText}>
//                                         {audioData.usedCount > 1000
//                                             ? `${(audioData.usedCount / 1000).toFixed(1)}K videos`
//                                             : `${audioData.usedCount} videos`}
//                                     </Text>
//                                 </View>
//                             )}
//                         </View>

//                         {/* Use Audio Button */}
//                         <TouchableOpacity
//                             style={styles.useAudioButton}
//                             onPress={() => {
//                                 onUseAudio?.();
//                                 onClose();
//                             }}
//                         >
//                             <Ionicons name="add-circle-outline" size={20} color="#fff" />
//                             <Text style={styles.useAudioText}>Use this audio</Text>
//                         </TouchableOpacity>

//                         {/* More Options */}
//                         <View style={styles.optionsContainer}>
//                             <TouchableOpacity style={styles.optionButton}>
//                                 <Ionicons name="bookmark-outline" size={24} color="#fff" />
//                                 <Text style={styles.optionText}>Save</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.optionButton}>
//                                 <Ionicons name="share-outline" size={24} color="#fff" />
//                                 <Text style={styles.optionText}>Share</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.optionButton}>
//                                 <Ionicons name="information-circle-outline" size={24} color="#fff" />
//                                 <Text style={styles.optionText}>Info</Text>
//                             </TouchableOpacity>
//                         </View>

//                         {/* Audio Type Badge */}
//                         <View style={styles.badgeContainer}>
//                             {audioData.isOriginal ? (
//                                 <View style={styles.badge}>
//                                     <Ionicons name="mic" size={14} color="#1d9bf0" />
//                                     <Text style={styles.badgeText}>Original Audio</Text>
//                                 </View>
//                             ) : (
//                                 <View style={styles.badge}>
//                                     <Ionicons name="musical-note" size={14} color="#1d9bf0" />
//                                     <Text style={styles.badgeText}>Added Music</Text>
//                                 </View>
//                             )}
//                         </View>

//                         {/* ✅ VIDEOS GRID - Shows who used this audio */}
//                         {audioData.videos && audioData.videos.length > 0 && (
//                             <View style={styles.videosSection}>
//                                 <Text style={styles.sectionTitle}>
//                                     Videos with this audio
//                                 </Text>
//                                 <FlatList
//                                     data={audioData.videos}
//                                     renderItem={renderVideoItem}
//                                     keyExtractor={(item) => item.id}
//                                     numColumns={numColumns}
//                                     columnWrapperStyle={{ gap: spacing }}
//                                     contentContainerStyle={{ gap: spacing }}
//                                     scrollEnabled={false}
//                                 />
//                             </View>
//                         )}
//                     </ScrollView>
//                 </TouchableOpacity>
//             </TouchableOpacity>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.7)',
//         justifyContent: 'flex-end',
//     },
//     bottomSheet: {
//         backgroundColor: '#1a1a1a',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         paddingBottom: 30,
//         maxHeight: SCREEN_HEIGHT * 0.85,
//     },
//     handleBar: {
//         width: 40,
//         height: 4,
//         backgroundColor: '#555',
//         borderRadius: 2,
//         alignSelf: 'center',
//         marginTop: 10,
//         marginBottom: 20,
//     },
//     audioHeader: {
//         flexDirection: 'row',
//         paddingHorizontal: 20,
//         marginBottom: 20,
//     },
//     coverContainer: {
//         marginRight: 15,
//     },
//     coverImage: {
//         width: 80,
//         height: 80,
//         borderRadius: 10,
//     },
//     defaultCover: {
//         width: 80,
//         height: 80,
//         borderRadius: 10,
//         backgroundColor: '#333',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     audioInfo: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     audioName: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: '700',
//         marginBottom: 8,
//     },
//     artistRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     artistAvatar: {
//         width: 24,
//         height: 24,
//         borderRadius: 12,
//         marginRight: 8,
//     },
//     artistName: {
//         color: '#ccc',
//         fontSize: 14,
//     },
//     statsContainer: {
//         flexDirection: 'row',
//         paddingHorizontal: 20,
//         marginBottom: 20,
//     },
//     statItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginRight: 20,
//     },
//     statText: {
//         color: '#888',
//         fontSize: 13,
//         marginLeft: 5,
//     },
//     useAudioButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#1d9bf0',
//         marginHorizontal: 20,
//         paddingVertical: 14,
//         borderRadius: 25,
//         marginBottom: 20,
//     },
//     useAudioText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//         marginLeft: 8,
//     },
//     optionsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         paddingHorizontal: 20,
//         marginBottom: 20,
//     },
//     optionButton: {
//         alignItems: 'center',
//     },
//     optionText: {
//         color: '#fff',
//         fontSize: 12,
//         marginTop: 6,
//     },
//     badgeContainer: {
//         paddingHorizontal: 20,
//         marginBottom: 20,
//     },
//     badge: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: 'rgba(29, 155, 240, 0.1)',
//         alignSelf: 'flex-start',
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 15,
//     },
//     badgeText: {
//         color: '#1d9bf0',
//         fontSize: 12,
//         fontWeight: '600',
//         marginLeft: 5,
//     },
//     // ✅ NEW: Videos Grid Styles
//     videosSection: {
//         paddingHorizontal: 20,
//     },
//     sectionTitle: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '700',
//         marginBottom: 12,
//     },
//     thumbnailItem: {
//         borderRadius: 8,
//         overflow: 'hidden',
//         backgroundColor: '#000',
//     },
//     thumbnail: {
//         width: '100%',
//         height: '100%',
//     },
//     viewsOverlay: {
//         position: 'absolute',
//         bottom: 4,
//         left: 4,
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.6)',
//         paddingHorizontal: 6,
//         paddingVertical: 2,
//         borderRadius: 4,
//     },
//     viewsText: {
//         color: '#fff',
//         fontSize: 10,
//         fontWeight: '600',
//         marginLeft: 2,
//     },
// });

// export default AudioBottomSheet;



import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface VideoItem {
    id: string;
    thumbnailUrl: string;
    viewsCount?: number;
    likesCount?: number;
    user?: {
        username: string;
        profilePic?: string;
    };
}

interface AudioBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    audioData: {
        isOriginal: boolean;
        name?: string;
        artist?: string;
        coverImage?: string;
        duration?: string;
        usedCount?: number;
        videos?: VideoItem[];
        audioUrl?: string; // ✅ Audio URL for preview
    };
    uploaderInfo: {
        username: string;
        profilePic?: string;
    };
    onUseAudio?: () => void;
    onVideoPress?: (videoId: string) => void;
}

const AudioBottomSheet: React.FC<AudioBottomSheetProps> = ({
    visible,
    onClose,
    audioData,
    uploaderInfo,
    onUseAudio,
    onVideoPress,
}) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const displayName = audioData.isOriginal
        ? 'Original Sound'
        : audioData.name || 'Unknown Audio';

    const displayArtist = audioData.isOriginal
        ? uploaderInfo.username
        : audioData.artist || 'Unknown Artist';

    // Grid layout calculations
    const numColumns = 3;
    const spacing = 4;
    const thumbnailWidth = (SCREEN_WIDTH - 40 - spacing * (numColumns - 1)) / numColumns;

    // ✅ Load audio when sheet opens
    useEffect(() => {
        if (visible && audioData.audioUrl) {
            loadAudio();
        }

        return () => {
            // Cleanup when closing
            if (sound) {
                sound.unloadAsync();
                setSound(null);
                setIsPlaying(false);
            }
        };
    }, [visible, audioData.audioUrl]);

    const loadAudio = async () => {
        try {
            setIsLoading(true);

            // Configure audio mode
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
            });

            const { sound: audioSound } = await Audio.Sound.createAsync(
                { uri: audioData.audioUrl! },
                { shouldPlay: false, isLooping: true },
                onPlaybackStatusUpdate
            );

            setSound(audioSound);
            setIsLoading(false);
            console.log('✅ Audio loaded successfully');
        } catch (error) {
            console.error('❌ Audio load error:', error);
            setIsLoading(false);
        }
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
        }
    };

    const togglePlayPause = async () => {
        if (!sound) return;

        try {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
        } catch (error) {
            console.error('❌ Playback error:', error);
        }
    };

    const handleClose = () => {
        if (sound) {
            sound.stopAsync();
        }
        onClose();
    };

    const renderVideoItem = ({ item }: { item: VideoItem }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onVideoPress?.(item.id)}
            style={[styles.thumbnailItem, { width: thumbnailWidth, height: thumbnailWidth * 1.6 }]}
        >
            <Image
                source={{ uri: item.thumbnailUrl }}
                style={styles.thumbnail}
                resizeMode="cover"
            />
            {item.viewsCount !== undefined && (
                <View style={styles.viewsOverlay}>
                    <Ionicons name="play" size={12} color="#fff" />
                    <Text style={styles.viewsText}>
                        {item.viewsCount > 1000
                            ? `${(item.viewsCount / 1000).toFixed(1)}K`
                            : item.viewsCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={handleClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.bottomSheet}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.handleBar} />

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Audio Cover & Info with Play Button */}
                        <View style={styles.audioHeader}>
                            <View style={styles.coverContainer}>
                                {audioData.coverImage ? (
                                    <View>
                                        <Image
                                            source={{ uri: audioData.coverImage }}
                                            style={styles.coverImage}
                                        />
                                        {/* ✅ PLAY/PAUSE OVERLAY */}
                                        <TouchableOpacity
                                            style={styles.playOverlay}
                                            onPress={togglePlayPause}
                                            disabled={isLoading || !audioData.audioUrl}
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                            ) : (
                                                <Ionicons
                                                    name={isPlaying ? 'pause' : 'play'}
                                                    size={30}
                                                    color="#fff"
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View>
                                        <View style={styles.defaultCover}>
                                            <Ionicons name="musical-notes" size={40} color="#fff" />
                                        </View>
                                        {/* ✅ PLAY/PAUSE OVERLAY */}
                                        <TouchableOpacity
                                            style={styles.playOverlay}
                                            onPress={togglePlayPause}
                                            disabled={isLoading || !audioData.audioUrl}
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                            ) : (
                                                <Ionicons
                                                    name={isPlaying ? 'pause' : 'play'}
                                                    size={30}
                                                    color="#fff"
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            <View style={styles.audioInfo}>
                                <Text style={styles.audioName} numberOfLines={2}>
                                    {displayName}
                                </Text>
                                <View style={styles.artistRow}>
                                    <Image
                                        source={{
                                            uri: uploaderInfo.profilePic ||
                                                'https://cdn-icons-png.flaticon.com/512/847/847969.png',
                                        }}
                                        style={styles.artistAvatar}
                                    />
                                    <Text style={styles.artistName}>{displayArtist}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Stats */}
                        <View style={styles.statsContainer}>
                            {audioData.duration && (
                                <View style={styles.statItem}>
                                    <Ionicons name="time-outline" size={16} color="#888" />
                                    <Text style={styles.statText}>{audioData.duration}</Text>
                                </View>
                            )}
                            {audioData.usedCount !== undefined && (
                                <View style={styles.statItem}>
                                    <Ionicons name="play-outline" size={16} color="#888" />
                                    <Text style={styles.statText}>
                                        {audioData.usedCount > 1000
                                            ? `${(audioData.usedCount / 1000).toFixed(1)}K videos`
                                            : `${audioData.usedCount} videos`}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Use Audio Button */}
                        <TouchableOpacity
                            style={styles.useAudioButton}
                            onPress={() => {
                                onUseAudio?.();
                                handleClose();
                            }}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="#fff" />
                            <Text style={styles.useAudioText}>Use this audio</Text>
                        </TouchableOpacity>

                        {/* More Options */}
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity style={styles.optionButton}>
                                <Ionicons name="bookmark-outline" size={24} color="#fff" />
                                <Text style={styles.optionText}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionButton}>
                                <Ionicons name="share-outline" size={24} color="#fff" />
                                <Text style={styles.optionText}>Share</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionButton}>
                                <Ionicons name="information-circle-outline" size={24} color="#fff" />
                                <Text style={styles.optionText}>Info</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Audio Type Badge */}
                        <View style={styles.badgeContainer}>
                            {audioData.isOriginal ? (
                                <View style={styles.badge}>
                                    <Ionicons name="mic" size={14} color="#1d9bf0" />
                                    <Text style={styles.badgeText}>Original Audio</Text>
                                </View>
                            ) : (
                                <View style={styles.badge}>
                                    <Ionicons name="musical-note" size={14} color="#1d9bf0" />
                                    <Text style={styles.badgeText}>Added Music</Text>
                                </View>
                            )}
                        </View>

                        {/* Videos Grid */}
                        {audioData.videos && audioData.videos.length > 0 && (
                            <View style={styles.videosSection}>
                                <Text style={styles.sectionTitle}>
                                    Videos with this audio
                                </Text>
                                <FlatList
                                    data={audioData.videos}
                                    renderItem={renderVideoItem}
                                    keyExtractor={(item) => item.id}
                                    numColumns={numColumns}
                                    columnWrapperStyle={{ gap: spacing }}
                                    contentContainerStyle={{ gap: spacing }}
                                    scrollEnabled={false}
                                />
                            </View>
                        )}
                    </ScrollView>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
        maxHeight: SCREEN_HEIGHT * 0.85,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#555',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    audioHeader: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    coverContainer: {
        marginRight: 15,
        position: 'relative',
    },
    coverImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    defaultCover: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ✅ NEW: Play/Pause Overlay
    playOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    audioInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    audioName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    artistRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    artistAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
    },
    artistName: {
        color: '#ccc',
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    statText: {
        color: '#888',
        fontSize: 13,
        marginLeft: 5,
    },
    useAudioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1d9bf0',
        marginHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 25,
        marginBottom: 20,
    },
    useAudioText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    optionButton: {
        alignItems: 'center',
    },
    optionText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 6,
    },
    badgeContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(29, 155, 240, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    badgeText: {
        color: '#1d9bf0',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 5,
    },
    videosSection: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    thumbnailItem: {
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    viewsOverlay: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    viewsText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        marginLeft: 2,
    },
});

export default AudioBottomSheet;