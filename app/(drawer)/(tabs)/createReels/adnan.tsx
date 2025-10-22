// import { Ionicons } from '@expo/vector-icons';
// import { Audio, AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
// import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
// import * as ImagePicker from 'expo-image-picker';
// import * as MediaLibrary from 'expo-media-library';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { Alert, Dimensions, PanResponder, PermissionStatus, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Video as VideoCompressor } from 'react-native-compressor';

// type ContentType = 'story' | 'reels' | 'news';
// type FilterType = 'none' | 'warm' | 'cool' | 'grayscale' | 'vintage';
// type MusicOption = {
//   id: string;
//   title: string;
//   artist: string;
//   uri: string;
// };

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const TRIM_HANDLE_WIDTH = 40;
// const TIMELINE_HEIGHT = 60;

// // Sample music options
// const musicOptions: MusicOption[] = [
//   {
//     id: '1',
//     title: 'Upbeat Vibe',
//     artist: 'Music Pack',
//     uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//   },
//   {
//     id: '2',
//     title: 'Chill Beat',
//     artist: 'Music Pack',
//     uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
//   },
//   {
//     id: '3',
//     title: 'Happy Tune',
//     artist: 'Music Pack',
//     uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
//   },
// ];

// export default function CreateReel() {
//   const [facing, setFacing] = useState<CameraType>('back');
//   const [permission, requestPermission] = useCameraPermissions();
//   const [videoUri, setVideoUri] = useState<string | null>(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordTime, setRecordTime] = useState(0);
//   const [zoom, setZoom] = useState(0);
//   const [contentType, setContentType] = useState<ContentType>('reels');
//   const [isLongVideo, setIsLongVideo] = useState(false);
//   const [trimStart, setTrimStart] = useState(0);
//   const [trimEnd, setTrimEnd] = useState(30);
//   const [videoDuration, setVideoDuration] = useState(0);
//   const [isTrimming, setIsTrimming] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
//   const [selectedMusic, setSelectedMusic] = useState<MusicOption | null>(null);
//   const [showMusicPanel, setShowMusicPanel] = useState(false);
//   const [musicVolume, setMusicVolume] = useState(100);
//   const [originalVideoVolume, setOriginalVideoVolume] = useState(100);
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
//   const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean | null>(null);
  
//   const cameraRef = useRef<CameraView>(null);
//   const timerRef = useRef<number | null>(null);
//   const zoomSliderRef = useRef<View>(null);
//   const videoRef = useRef<Video>(null);
//   const leftHandleRef = useRef<View>(null);
//   const rightHandleRef = useRef<View>(null);
//   const musicSoundRef = useRef<Audio.Sound | null>(null);

//   useEffect(() => {
//     // Request all necessary permissions when component mounts
//     (async () => {
//       try {
//         // Request camera permission
//         const cameraPermission = await requestPermission();
//         const cameraStatus = cameraPermission.status as PermissionStatus;
//         setHasCameraPermission(cameraStatus === 'granted');
        
//         // Request media library permission
//         const mediaPermission = await MediaLibrary.requestPermissionsAsync();
//         const mediaStatus = mediaPermission.status as PermissionStatus;
        
//         // Request microphone permission for audio recording
//         const microphonePermission = await Audio.requestPermissionsAsync();
//         const microphoneStatus = microphonePermission.granted;
//         setHasMicrophonePermission(microphoneStatus);
        
//         if (cameraStatus !== 'granted' || mediaStatus !== 'granted' || !microphoneStatus) {
//           Alert.alert(
//             'Permissions required', 
//             'Please grant all permissions (camera, media library, and microphone)'
//           );
//         }
//       } catch (error) {
//         console.error('Permission error:', error);
//         Alert.alert('Permission Error', 'Failed to request necessary permissions. Please check app settings.');
//       }
//     })();
    
//     return () => {
//       // Clean up music sound when component unmounts
//       if (musicSoundRef.current) {
//         musicSoundRef.current.unloadAsync();
//       }
//       // Clear timer if it exists
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, []);

//   // Function to seek to a specific time in the video
//   const seekToTime = useCallback((time: number) => {
//     if (videoRef.current) {
//       videoRef.current.setPositionAsync(time * 1000);
//     }
//   }, []);

//   // Create pan responder for vertical zoom slider
//   const zoomPanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: (evt, gestureState) => {
//         if (zoomSliderRef.current) {
//           zoomSliderRef.current.measure((x, y, width, height, pageX, pageY) => {
//             const touchY = evt.nativeEvent.pageY;
//             const relativeY = touchY - pageY;
//             const sliderHeight = height;
            
//             const newZoom = Math.max(0, Math.min(1, 1 - (relativeY / sliderHeight)));
//             setZoom(newZoom);
//           });
//         }
//       },
//     })
//   ).current;

//   // Create pan responders for trim handles
//   const leftHandlePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: (evt, gestureState) => {
//         if (videoDuration === 0) return;
        
//         const newStart = Math.max(0, Math.min(trimEnd - 1, trimStart + gestureState.dx / (SCREEN_WIDTH - TRIM_HANDLE_WIDTH * 2) * videoDuration));
//         setTrimStart(newStart);
//         seekToTime(newStart);
//       },
//     })
//   ).current;

//   const rightHandlePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: (evt, gestureState) => {
//         if (videoDuration === 0) return;
        
//         const newEnd = Math.min(videoDuration, Math.max(trimStart + 1, trimEnd + gestureState.dx / (SCREEN_WIDTH - TRIM_HANDLE_WIDTH * 2) * videoDuration));
//         setTrimEnd(newEnd);
//         seekToTime(newEnd);
//       },
//     })
//   ).current;

//   const handleVideoProgress = (status: AVPlaybackStatus) => {
//     if (status.isLoaded) {
//       setCurrentTime(status.positionMillis / 1000);
      
//       // Sync music playback with video playback
//       if (selectedMusic && musicSoundRef.current) {
//         if (status.isPlaying && !isVideoPlaying) {
//           // Video is playing but music isn't - play music
//           musicSoundRef.current.playAsync();
//         } else if (!status.isPlaying && isVideoPlaying) {
//           // Video is paused but music is playing - pause music
//           musicSoundRef.current.pauseAsync();
//         }
//       }
//     }
//   };

//   const toggleVideoPlayback = async () => {
//     if (videoRef.current) {
//       if (isVideoPlaying) {
//         await videoRef.current.pauseAsync();
//         if (selectedMusic && musicSoundRef.current) {
//           await musicSoundRef.current.pauseAsync();
//         }
//       } else {
//         await videoRef.current.playAsync();
//         if (selectedMusic && musicSoundRef.current) {
//           await musicSoundRef.current.playAsync();
//         }
//       }
//       setIsVideoPlaying(!isVideoPlaying);
//     }
//   };

//   function toggleCameraFacing() {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   }

//   // const startRecording = async () => {
//   //   if (!hasCameraPermission || !hasMicrophonePermission) {
//   //     Alert.alert('Permission Required', 'Camera and microphone permissions are needed to record videos');
//   //     return;
//   //   }
    
//   //   if (cameraRef.current) {
//   //     try {
//   //       setIsRecording(true);
//   //       setRecordTime(0);
        
//   //       // Timer for recording duration
//   //       timerRef.current = setInterval(() => {
//   //         setRecordTime(prev => {
//   //           const maxDuration = contentType === 'story' ? 30 : 120; // Story max 30s, Reels/News max 120s
//   //           if (prev >= maxDuration - 1) {
//   //             stopRecording();
//   //             return maxDuration;
//   //           }
//   //           return prev + 1;
//   //         });
//   //       }, 1000);
        
//   //       // Start recording with proper options
//   //       const options = {
//   //         maxDuration: contentType === 'story' ? 30 : 120,
//   //         mute: false,
//   //         quality: '720p',
//   //       };
        
//   //       const videoRecord = await cameraRef.current.recordAsync(options);
        
//   //       if (videoRecord) {
//   //         setVideoUri(videoRecord.uri);
//   //         setIsLongVideo(false);
//   //         setTrimStart(0);
//   //         setTrimEnd(contentType === 'story' ? 30 : 120);
          
//   //         // Get video duration
//   //         const { sound, status } = await Audio.Sound.createAsync(
//   //           { uri: videoRecord.uri },
//   //           { shouldPlay: false }
//   //         );
          
//   //         if (status && status.isLoaded && status.durationMillis !== undefined) {
//   //           setVideoDuration(status.durationMillis / 1000);
//   //           // Set trim end based on content type limits
//   //           const maxDuration = contentType === 'story' ? 30 : 120;
//   //           setTrimEnd(Math.min(maxDuration, status.durationMillis / 1000));
//   //         }
          
//   //         // Unload the sound object we just created
//   //         await sound.unloadAsync();
//   //       }
//   //     } catch (error) {
//   //       console.error('Error recording video:', error);
//   //       Alert.alert('Error', 'Failed to record video: ' + (error as Error).message);
//   //     } finally {
//   //       setIsRecording(false);
//   //       if (timerRef.current) {
//   //         clearInterval(timerRef.current);
//   //         timerRef.current = null;
//   //       }
//   //     }
//   //   }
//   // };

// // Inside CreateReel function

// const startRecording = async () => {
//   if (!hasCameraPermission || !hasMicrophonePermission) {
//     Alert.alert('Permission Required', 'Camera and microphone permissions are needed to record videos');
//     return;
//   }
//   if (cameraRef.current) {
//     try {
//       setIsRecording(true);
//       setRecordTime(0);
      
//       // Clear any existing timer
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }

//       // Start timer for recording duration
//       timerRef.current = setInterval(() => {
//         setRecordTime(prev => {
//           const maxDuration = contentType === 'story' ? 30 : 120;
//           if (prev >= maxDuration - 1) {
//             // Automatically stop when max duration is reached
//             // stopRecording will be called, which triggers the completion of recordAsync
//             stopRecording(); 
//             return maxDuration;
//           }
//           return prev + 1;
//         });
//       }, 1000);

//       const options = {
//         maxDuration: contentType === 'story' ? 30 : 120,
//         mute: false, // Important: Keep mute false to record audio
//         quality: '720p',
//         // videoBitrate: 5 * 1000 * 1000, // Optional: Set bitrate for quality/speed
//       };

//       console.log("Starting recording with options:", options);
      
//       // Start recording - this returns a promise that resolves when recording stops
//       const videoRecord = await cameraRef.current.recordAsync(options);
      
//       console.log("Recording finished, videoRecord object:", videoRecord);

//       if (videoRecord && videoRecord.uri) {
//         // --- This is the key part: Navigate to preview after recording ---
//         setVideoUri(videoRecord.uri);
//         setIsLongVideo(false); // Reset for new video
//         setTrimStart(0);
//         const durationSecs = contentType === 'story' ? 30 : 120; // Default max
//         setTrimEnd(durationSecs); 

//         // Get actual video duration
//         try {
//           const { sound, status } = await Audio.Sound.createAsync(
//             { uri: videoRecord.uri },
//             { shouldPlay: false }
//           );
//           if (status && status.isLoaded && status.durationMillis !== undefined) {
//             const actualDuration = status.durationMillis / 1000;
//             setVideoDuration(actualDuration);
//             const maxDuration = contentType === 'story' ? 30 : 120;
//             setTrimEnd(Math.min(maxDuration, actualDuration));
//           }
//           await sound.unloadAsync();
//         } catch (durationError) {
//            console.error("Error getting video duration:", durationError);
//            // If duration fails, use default
//            setVideoDuration(durationSecs);
//         }

//         // Ensure UI transitions to preview mode
//         // setVideoUri triggers the conditional render to show preview
//         console.log("Navigated to preview with video:", videoRecord.uri);
        
//       } else {
//         console.warn("Recording finished, but no URI received or recording was cancelled.");
//         // Handle cancellation or failure (e.g., user switched apps during recording)
//         Alert.alert("Cancelled", "Video recording was cancelled or failed.");
//       }

//     } catch (error) {
//   if (error instanceof Error) {
//     console.error('Error recording video:', error);
//     Alert.alert('Error', 'Failed to record video: ' + (error.message || error));
//   } else {
//     console.error('Unknown error occurred:', error);
//   }
// }finally {
//       // Ensure recording state is reset regardless of success or failure
//       setIsRecording(false);
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//         timerRef.current = null;
//       }
//       console.log("Recording process finalized.");
//     }
//   } else {
//     Alert.alert("Error", "Camera is not ready. Please try again.");
//     console.error("Camera ref is null when trying to start recording.");
//   }
// };




//   const stopRecording = () => {
//     if (cameraRef.current && isRecording) {
//       cameraRef.current.stopRecording();
//       setIsRecording(false);
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//         timerRef.current = null;
//       }
//     }
//   };

//   // Pick video from Gallery
//   // const pickVideo = async () => {
//   //   // Request media library permissions first
//   //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//   //   if (status !== 'granted') {
//   //     Alert.alert('Permission Required', 'We need access to your media library to pick videos');
//   //     return;
//   //   }

//   //   let result = await ImagePicker.launchImageLibraryAsync({
//   //     mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//   //     allowsEditing: false,
//   //     quality: 1,
//   //   });

//   //   if (!result.canceled) {
//   //     const video = result.assets[0];
//   //     const duration = video.duration ? video.duration / 1000 : 0;
      
//   //     // Validate duration based on content type
//   //     const minDuration = 10; // Minimum 10 seconds for all types
//   //     const maxDuration = contentType === 'story' ? 30 : 120; // Story max 30s, Reels/News max 120s
      
//   //     if (duration < minDuration) {
//   //       Alert.alert('Invalid Video', `Video must be at least ${minDuration} seconds long for ${contentType}`);
//   //       return;
//   //     }
      
//   //     if (duration > maxDuration) {
//   //       setIsLongVideo(true);
//   //       setTrimEnd(maxDuration);
//   //     } else {
//   //       setIsLongVideo(false);
//   //       setTrimEnd(duration);
//   //     }
      
//   //     setVideoDuration(duration);
      
//   //     let newUri = video.uri;
//   //     if (!newUri.endsWith(".mp4")) {
//   //       const mp4Uri = FileSystem.documentDirectory + "converted.mp4";
//   //       try {
//   //         await FileSystem.copyAsync({
//   //           from: newUri,
//   //           to: mp4Uri,
//   //         });
//   //         newUri = mp4Uri;
//   //       } catch (error) {
//   //         console.log("Error converting to mp4:", error);
//   //         // Use original URI if conversion fails
//   //       }
//   //     }

//   //     setVideoUri(newUri);
//   //     setTrimStart(0);
//   //   }
//   // };


// // Inside CreateReel function, pickVideo function

// const pickVideo = async () => {
//   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//   if (status !== 'granted') {
//     Alert.alert('Permission Required', 'We need access to your media library to pick videos');
//     return;
//   }
//   let result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//     allowsEditing: false,
//     quality: 1,
//   });

//   if (!result.canceled && result.assets && result.assets.length > 0) { // Add extra checks
//     const video = result.assets[0];
//     console.log("Picked video:", video); // Debug log
//     const durationMs = video.duration || 0; // Ensure duration exists
//     const durationSecs = durationMs / 1000;

//     const minDuration = 10;
//     const maxDuration = contentType === 'story' ? 30 : 120;

//     if (durationSecs < minDuration) {
//       Alert.alert('Invalid Video', `Video must be at least ${minDuration} seconds long for ${contentType}`);
//       return;
//     }

//     setIsLongVideo(durationSecs > maxDuration);
//     setVideoDuration(durationSecs);
//     const effectiveTrimEnd = Math.min(maxDuration, durationSecs);
//     setTrimEnd(effectiveTrimEnd);

//     let newUri = video.uri;
//     // Optional: Ensure MP4 conversion if needed, though modern phones often pick MP4
//     // if (!newUri.endsWith(".mp4")) { ... }

//     setVideoUri(newUri); // This should trigger the preview UI
//     setTrimStart(0); // Reset trim start
//     console.log("Set videoUri for preview:", newUri); // Debug log
//   } else {
//       console.log("Video picking was cancelled or failed.");
//       // Optionally handle cancellation
//   }
// };

//   const discardVideo = () => {
//     setVideoUri(null);
//     setRecordTime(0);
//     setZoom(0);
//     setIsLongVideo(false);
//     setIsTrimming(false);
//     setSelectedFilter('none');
//     setSelectedMusic(null);
//     setShowMusicPanel(false);
//     setShowFilters(false);
//     setIsVideoPlaying(false);
    
//     // Stop any playing music
//     if (musicSoundRef.current) {
//       musicSoundRef.current.stopAsync();
//       musicSoundRef.current.unloadAsync();
//       musicSoundRef.current = null;
//     }
//   };

//   const startTrimming = () => {
//     if (videoDuration > 0) {
//       setIsTrimming(true);
//       setShowFilters(false); // Close filters when opening trim
//     }
//   };

//   const cancelTrimming = () => {
//     setIsTrimming(false);
//   };

//   const applyFilter = (filter: FilterType) => {
//     setSelectedFilter(filter);
//     // Keep filters panel open after selection
//   };

//   const openFilters = () => {
//     setShowFilters(true);
//     setIsTrimming(false); // Close trim when opening filters
//   };

//   const closeFilters = () => {
//     setShowFilters(false);
//   };

//   // const selectMusic = async (music: MusicOption) => {
//   //   try {
//   //     // Stop any currently playing music
//   //     if (musicSoundRef.current) {
//   //       await musicSoundRef.current.stopAsync();
//   //       await musicSoundRef.current.unloadAsync();
//   //       musicSoundRef.current = null;
//   //     }
      
//   //     // If same music is selected, deselect it
//   //     if (selectedMusic?.id === music.id) {
//   //       setSelectedMusic(null);
//   //       setOriginalVideoVolume(100);
//   //       if (videoRef.current) {
//   //         await videoRef.current.setVolumeAsync(1);
//   //       }
//   //       return;
//   //     }
      
//   //     setSelectedMusic(music);
      
//   //     // Load and play the selected music
//   //     const { sound } = await Audio.Sound.createAsync(
//   //       { uri: music.uri },
//   //       { shouldPlay: isVideoPlaying, volume: musicVolume / 100, isLooping: true }
//   //     );
      
//   //     musicSoundRef.current = sound;
      
//   //     // Mute the original video audio
//   //     setOriginalVideoVolume(0);
//   //     if (videoRef.current) {
//   //       await videoRef.current.setVolumeAsync(0);
//   //     }
      
//   //     // If video is playing, also play music
//   //     if (isVideoPlaying) {
//   //       await sound.playAsync();
//   //     }
//   //   } catch (error) {
//   //     console.error('Error playing music:', error);
//   //     Alert.alert('Error', 'Could not play the selected music');
//   //   }
//   // };


// const selectMusic = async (music: MusicOption) => {
// console.log('Selected music:', selectedMusic?.id, 'Clicked music:', music.id);
//   try {
//     // If same music is selected, deselect it
//     if (selectedMusic?.id === music.id) {
//       // Stop the music
//       if (musicSoundRef.current) {
//         await musicSoundRef.current.stopAsync();
//         await musicSoundRef.current.unloadAsync();
//         musicSoundRef.current = null;
//       }
      
//       setSelectedMusic(null);
//       return;
//     }
    
//     // Stop any currently playing music
//     if (musicSoundRef.current) {
//       await musicSoundRef.current.stopAsync();
//       await musicSoundRef.current.unloadAsync();
//       musicSoundRef.current = null;
//     }
    
//     setSelectedMusic(music);
    
//     // Load and play the selected music
//     const { sound } = await Audio.Sound.createAsync(
//       { uri: music.uri },
//       { shouldPlay: isVideoPlaying, volume: musicVolume / 100, isLooping: true }
//     );
    
//     musicSoundRef.current = sound;
    
//     // If video is playing, also play music
//     if (isVideoPlaying) {
//       await sound.playAsync();
//     }
//   } catch (error) {
//     console.error('Error playing music:', error);
//     Alert.alert('Error', 'Could not play the selected music');
//   }
// };


//   const adjustMusicVolume = async (volume: number) => {
//     const inVolume = Math.round(volume)
//     setMusicVolume(inVolume);
//     if (musicSoundRef.current) {
//       await musicSoundRef.current.setVolumeAsync(volume / 100);
//     }
//   };

//   // const adjustVideoVolume = async (volume: number) => {
//   //    const inVolume = Math.round(volume)
//   //   setMusicVolume(inVolume);
//   //   if (videoRef.current) {
//   //     await videoRef.current.setVolumeAsync(volume / 100);
//   //   }
//   // };

// const adjustVideoVolume = async (volume: number) => {
//   const inVolume = Math.round(volume);
//   // Fix: Update the correct state variable for video volume
//   setOriginalVideoVolume(inVolume); 
//   if (videoRef.current) {
//     await videoRef.current.setVolumeAsync(inVolume / 100);
//   }
// };

//   const trimVideo = async () => {
//     if (!videoUri) return;
    
//     Alert.alert("Processing", "Trimming and compressing your video...");
    
//     try {
//       // In a real app, you would use a video editing library here
//       // For this example, we'll simulate the process and then compress
      
//       // First simulate trimming (in a real app, you'd actually trim)
//       setTimeout(async () => {
//         try {
//           // Compress the "trimmed" video
//           const compressedUri = await VideoCompressor.compress(videoUri, {
//             compressionMethod: 'auto',
//             minimumFileSizeForCompress: 0,
//             maxSize: 720,
//           });
          
//           Alert.alert("Success", "Video trimmed and compressed successfully!");
//           setIsTrimming(false);
          
//           // Apply the selected music if any and it's not already playing
//           if (selectedMusic && musicSoundRef.current && isVideoPlaying) {
//             musicSoundRef.current.playAsync().catch(console.error);
//           }
//         } catch (error) {
//           console.error('Compression error:', error);
//           Alert.alert("Error", "Failed to compress video after trimming.");
//         }
//       }, 2000);
//     } catch (error) {
//       console.error('Trimming error:', error);
//       Alert.alert("Error", "Failed to trim video.");
//     }
//   };

//   const uploadVideo = async () => {
//     if (!videoUri) return;
    
//     try {
//       Alert.alert("Processing", "Compressing your video...");
      
//       // Compress the video before uploading
//       const compressedUri = await VideoCompressor.compress(videoUri, {
//         compressionMethod: 'auto',
//         minimumFileSizeForCompress: 0, // Compress even small files
//         maxSize: 720, // Maximum resolution
//         progressDivider: 1,
//       });
      
//       // Simulate upload process
//       setTimeout(() => {
//         Alert.alert("Uploaded!", `Your ${contentType} is ready.`);
        
//         // Reset all states
//         setVideoUri(null);
//         setZoom(0);
//         setIsLongVideo(false);
//         setIsTrimming(false);
//         setShowFilters(false);
//         setSelectedFilter('none');
//         setSelectedMusic(null);
//         setIsVideoPlaying(false);
        
//         // Stop any playing music
//         if (musicSoundRef.current) {
//           musicSoundRef.current.stopAsync();
//           musicSoundRef.current.unloadAsync();
//           musicSoundRef.current = null;
//         }
//       }, 2000);
      
//     } catch (error) {
//       console.error('Compression error:', error);
//       Alert.alert("Error", "Failed to compress video. Please try again.");
//     }
//   };

//   const getContentTypeIcon = (type: ContentType) => {
//     switch (type) {
//       case 'story': return 'time-outline';
//       case 'reels': return 'play-circle-outline';
//       case 'news': return 'newspaper-outline';
//       default: return 'add-circle-outline';
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const getFilterStyle = (filter: FilterType) => {
//     switch (filter) {
//       case 'warm':
//         return {
//           backgroundColor: 'rgba(255, 153, 0, 0.2)',
//         };
//       case 'cool':
//         return {
//           backgroundColor: 'rgba(0, 153, 255, 0.2)',
//         };
//       case 'grayscale':
//         return {
//           backgroundColor: 'rgba(128, 128, 128, 0.2)',
//         };
//       case 'vintage':
//         return {
//           backgroundColor: 'rgba(165, 42, 42, 0.2)',
//         };
//       default:
//         return { backgroundColor: 'transparent' };
//     }
//   };

//   // Show loading while permission is being checked
//   if (hasCameraPermission === null) {
//     return <View style={styles.container} />;
//   }

//   // Show permission UI if needed
//   if (!hasCameraPermission) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>We need your permission to show the camera</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Video Preview on the same screen */}
//       {videoUri ? (
//         <View style={styles.previewContainer}>
//                 <StatusBar hidden />
//           <Video
//             ref={videoRef}
//             source={{ uri: videoUri }}
//             style={[styles.video, getFilterStyle(selectedFilter)]}
//             useNativeControls={false}
//             resizeMode={ResizeMode.COVER}
//             shouldPlay={false}
//             isLooping={false}
//             volume={originalVideoVolume / 100}
//             onLoad={(status) => {
//               if (status.isLoaded && status.durationMillis !== undefined) {
//                 setVideoDuration(status.durationMillis / 1000);
//                 const maxDuration = contentType === 'story' ? 30 : 120;
//                 setTrimEnd(Math.min(maxDuration, status.durationMillis / 1000));
//               }
//             }}
//             onPlaybackStatusUpdate={handleVideoProgress}
//           />

//           {/* Play/Pause Button */}
//           <TouchableOpacity 
//             style={styles.playPauseButton}
//             onPress={toggleVideoPlayback}
//           >
//             <Ionicons 
//               name={isVideoPlaying ? "pause" : "play"} 
//               size={40} 
//               color="white" 
//             />
//           </TouchableOpacity>

//           {showMusicPanel && (
//             <View style={styles.musicPanel}>
//               <View style={styles.panelHeader}>
//                 <Text style={styles.panelTitle}>Select Music</Text>
//                 <TouchableOpacity onPress={() => setShowMusicPanel(false)}>
//                   <Ionicons name="close" size={24} color="white" />
//                 </TouchableOpacity>
//               </View>
              
//               <ScrollView style={styles.musicList}>
//                 {musicOptions.map(music => (
//                   <TouchableOpacity
//                     key={music.id}
//                     style={[
//                       styles.musicItem,
//                       selectedMusic?.id === music.id && styles.selectedMusicItem
//                     ]}
//                     onPress={() => selectMusic(music)}
//                   >
//                     <Ionicons name="musical-notes" size={24} color="white" />
//                     <View style={styles.musicInfo}>
//                       <Text style={styles.musicTitle}>{music.title}</Text>
//                       <Text style={styles.musicArtist}>{music.artist}</Text>
//                     </View>
//                     {selectedMusic?.id === music.id && (
//                       <Ionicons name="checkmark" size={24} color="#0095f6" />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
              
//               {selectedMusic && (
//                 <View style={styles.volumeControl}>
//                   <Text style={styles.volumeLabel}>Music Volume: {musicVolume}%</Text>
//                   <View style={styles.sliderContainer}>
//                     <Ionicons name="volume-low" size={20} color="white" />
//                     <View style={styles.sliderTrack}>
//                       <View 
//                         style={[
//                           styles.sliderProgress, 
//                           { width: `${musicVolume}%` }
//                         ]} 
//                       />
//                       <View
//                         style={[
//                           styles.sliderThumb,
//                           { left: `${musicVolume}%` }
//                         ]}
//                         {...PanResponder.create({
//                           onMoveShouldSetPanResponder: () => true,
//                           onPanResponderMove: (e, gestureState) => {
//                             const newVolume = Math.max(0, Math.min(100, musicVolume + gestureState.dx / 3));
//                             adjustMusicVolume(newVolume);
//                           }
//                         }).panHandlers}
//                       />
//                     </View>
//                     <Ionicons name="volume-high" size={20} color="white" />
//                   </View>
//                 </View>
//               )}
//             </View>
//           )}

//           {isTrimming && (
//             <View style={styles.trimInterface}>
//               <View style={styles.trimHeader}>
//                 <Text style={styles.trimTitle}>Trim Video</Text>
//                 <TouchableOpacity onPress={cancelTrimming}>
//                   <Ionicons name="close" size={24} color="white" />
//                 </TouchableOpacity>
//               </View>

//               {/* Timeline with current position indicator */}
//               <View style={styles.timelineContainer}>
//                 <View style={styles.timeline}>
//                   <View 
//                     style={[
//                       styles.progressBar,
//                       { width: `${(currentTime / videoDuration) * 100}%` }
//                     ]} 
//                   />
//                 </View>
                
//                 {/* Trim handles */}
//                 <View
//                   ref={leftHandleRef}
//                   style={[
//                     styles.trimHandle,
//                     styles.leftHandle,
//                     { left: (trimStart / videoDuration) * (SCREEN_WIDTH - TRIM_HANDLE_WIDTH * 2) }
//                   ]}
//                   {...leftHandlePanResponder.panHandlers}
//                 >
//                   <View style={styles.handleLine} />
//                   <Ionicons name="caret-back" size={20} color="white" />
//                 </View>
                
//                 <View
//                   ref={rightHandleRef}
//                   style={[
//                     styles.trimHandle,
//                     styles.rightHandle,
//                     { left: (trimEnd / videoDuration) * (SCREEN_WIDTH - TRIM_HANDLE_WIDTH * 2) + TRIM_HANDLE_WIDTH }
//                   ]}
//                   {...rightHandlePanResponder.panHandlers}
//                 >
//                   <View style={styles.handleLine} />
//                   <Ionicons name="caret-forward" size={20} color="white" />
//                 </View>
                
//                 {/* Trim window */}
//                 <View style={[
//                   styles.trimWindow,
//                   {
//                     left: (trimStart / videoDuration) * (SCREEN_WIDTH - TRIM_HANDLE_WIDTH * 2) + TRIM_HANDLE_WIDTH,
//                     width: ((trimEnd - trimStart) / videoDuration) * (SCREEN_WIDTH - TRIM_HANDLE_WIDTH * 2),
//                   }
//                 ]} />
//               </View>

//               {/* Time indicators */}
//               <View style={styles.timeContainer}>
//                 <Text style={styles.timeText}>{formatTime(trimStart)}</Text>
//                 <Text style={styles.durationText}>
//                   {formatTime(trimEnd - trimStart)}
//                 </Text>
//                 <Text style={styles.timeText}>{formatTime(trimEnd)}</Text>
//               </View>

//               <View style={styles.trimActions}>
//                 <TouchableOpacity
//                   style={[styles.actionBtn, styles.cancelBtn]}
//                   onPress={cancelTrimming}
//                 >
//                   <Text style={styles.btnText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.actionBtn}
//                   onPress={trimVideo}
//                 >
//                   <Text style={styles.btnText}>Done</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}

//           {showFilters && (
//             <View style={styles.filtersPanel}>
//               <View style={styles.panelHeader}>
//                 <Text style={styles.panelTitle}>Filters</Text>
//                 <TouchableOpacity onPress={closeFilters}>
//                   <Ionicons name="close" size={24} color="white" />
//                 </TouchableOpacity>
//               </View>
              
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
//                 {(['none', 'warm', 'cool', 'grayscale', 'vintage'] as FilterType[]).map(filter => (
//                   <TouchableOpacity
//                     key={filter}
//                     style={[
//                       styles.filterOption,
//                       selectedFilter === filter && styles.selectedFilterOption
//                     ]}
//                     onPress={() => applyFilter(filter)}
//                   >
//                     <View style={[styles.filterPreview, getFilterStyle(filter)]} />
//                     <Text style={styles.filterText}>
//                       {filter.charAt(0).toUpperCase() + filter.slice(1)} 
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           )}

//           {/* {!isTrimming && !showMusicPanel && !showFilters && (
//             <View style={styles.previewControls}>
//               <View style={styles.topControls}>
//                 <TouchableOpacity
//                   style={styles.controlButton}
//                   onPress={discardVideo}
//                 >
//                   <Ionicons name="close" size={24} color="white" />
//                 </TouchableOpacity>
//               </View>
              
//               <View style={styles.bottomControls}>
//                 <View style={styles.editTools}>
//                   <TouchableOpacity
//                     style={styles.toolButton}
//                     onPress={() => setShowMusicPanel(true)}
//                   >
//                     <Ionicons name="musical-notes" size={24} color="white" />
//                     <Text style={styles.toolText}>Music</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.toolButton}
//                     onPress={startTrimming}
//                   >
//                     <Ionicons name="cut" size={24} color="white" />
//                     <Text style={styles.toolText}>Trim</Text>
//                   </TouchableOpacity>
                  
//                   <TouchableOpacity
//                     style={styles.toolButton}
//                     onPress={openFilters}
//                   >
//                     <Ionicons name="color-filter-outline" size={24} color="white" />
//                     <Text style={styles.toolText}>Filter</Text>
//                   </TouchableOpacity>
//                 </View>
                
//                 <View style={styles.previewButtons}>
//                   <TouchableOpacity
//                     style={[styles.actionBtn, styles.discardBtn]}
//                     onPress={discardVideo}
//                   >
//                     <Text style={styles.btnText}>Discard</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.actionBtn}
//                     onPress={uploadVideo}
//                   >
//                     <Text style={styles.btnText}>Share</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           )} */}
// {!isTrimming && !showMusicPanel && !showFilters && (
//   <View style={styles.previewControls}>
//     <View style={styles.topControls}>
//       <TouchableOpacity
//         style={styles.controlButton}
//         onPress={discardVideo}
//       >
//         <Ionicons name="close" size={24} color="white" />
//       </TouchableOpacity>
//     </View>
    
//     <View style={styles.bottomControls}>
//       <View style={styles.editTools}>
//         <TouchableOpacity
//           style={styles.toolButton}
//           onPress={() => setShowMusicPanel(true)}
//         >
//           <Ionicons name="musical-notes" size={24} color="white" />
//           <Text style={styles.toolText}>Music</Text>
//           {selectedMusic && <View style={styles.musicIndicator} />}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.toolButton}
//           onPress={startTrimming}
//         >
//           <Ionicons name="cut" size={24} color="white" />
//           <Text style={styles.toolText}>Trim</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity
//           style={styles.toolButton}
//           onPress={openFilters}
//         >
//           <Ionicons name="color-filter-outline" size={24} color="white" />
//           <Text style={styles.toolText}>Filter</Text>
//         </TouchableOpacity>
//       </View>
      
//       {/* Add Video Volume Control - Yeh naya section hai */}
//       {selectedMusic && (
//         <View style={styles.volumeControlsRow}>
//           <View style={styles.volumeControl}>
//             <Text style={styles.volumeLabel}>Video Volume: {originalVideoVolume}%</Text>
//             <View style={styles.sliderContainer}>
//               <Ionicons name="volume-low" size={16} color="white" />
//               <View style={styles.sliderTrack}>
//                 <View 
//                   style={[
//                     styles.sliderProgress, 
//                     { width: `${originalVideoVolume}%` }
//                   ]} 
//                 />
//                 <View
//                   style={[
//                     styles.sliderThumb,
//                     { left: `${originalVideoVolume}%` }
//                   ]}
//                   {...PanResponder.create({
//                     onMoveShouldSetPanResponder: () => true,
//                     onPanResponderMove: (e, gestureState) => {
//                       const newVolume = Math.max(0, Math.min(100, originalVideoVolume + gestureState.dx / 3));
//                       adjustVideoVolume(newVolume);
//                     }
//                   }).panHandlers}
//                 />
//               </View>
//               <Ionicons name="volume-high" size={16} color="white" />
//             </View>
//           </View>
          
//           <View style={styles.volumeControl}>
//             <Text style={styles.volumeLabel}>Music Volume: {musicVolume}%</Text>
//             <View style={styles.sliderContainer}>
//               <Ionicons name="volume-low" size={16} color="white" />
//               <View style={styles.sliderTrack}>
//                 <View 
//                   style={[
//                     styles.sliderProgress, 
//                     { width: `${musicVolume}%` }
//                   ]} 
//                 />
//                 <View
//                   style={[
//                     styles.sliderThumb,
//                     { left: `${musicVolume}%` }
//                   ]}
//                   {...PanResponder.create({
//                     onMoveShouldSetPanResponder: () => true,
//                     onPanResponderMove: (e, gestureState) => {
//                       const newVolume = Math.max(0, Math.min(100, musicVolume + gestureState.dx / 3));
//                       adjustMusicVolume(newVolume);
//                     }
//                   }).panHandlers}
//                 />
//               </View>
//               <Ionicons name="volume-high" size={16} color="white" />
//             </View>
//           </View>
//         </View>
//       )}
      
//       <View style={styles.previewButtons}>
//         <TouchableOpacity
//           style={[styles.actionBtn, styles.discardBtn]}
//           onPress={discardVideo}
//         >
//           <Text style={styles.btnText}>Discard</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.actionBtn}
//           onPress={uploadVideo}
//         >
//           <Text style={styles.btnText}>Share</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// )}
//         </View>
//       ) 
//       : (
//         <>
//           {/* Content Type Selector */}
//           <View style={styles.contentTypeContainer}>
//             {(['story', 'reels', 'news'] as ContentType[]).map((type) => (
//               <TouchableOpacity
//                 key={type}
//                 style={[
//                   styles.contentTypeButton,
//                   contentType === type && styles.contentTypeButtonActive
//                 ]}
//                 onPress={() => setContentType(type)}
//               >
//                 <Ionicons 
//                   name={getContentTypeIcon(type)} 
//                   size={20} 
//                   color={contentType === type ? '#0095f6' : 'white'} 
//                 />
//                 <Text style={[
//                   styles.contentTypeText,
//                   contentType === type && styles.contentTypeTextActive
//                 ]}>
//                   {type.charAt(0).toUpperCase() + type.slice(1)}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Camera View */}
//           <CameraView 
//             style={styles.camera} 
//             facing={facing} 
//             ref={cameraRef}
//             zoom={zoom}
//           />
          
//           {/* Timer Display */}
//           {isRecording && (
//             <View style={styles.timerContainer}>
//               <Text style={styles.timerText}>
//                 {recordTime}/{contentType === 'story' ? '30' : '120'}
//               </Text>
//             </View>
//           )}

//           {/* Vertical Zoom Slider */}
//           <View 
//             ref={zoomSliderRef}
//             style={styles.zoomSliderContainer}
//             {...zoomPanResponder.panHandlers}
//           >
//             <View style={styles.zoomSliderTrack}>
//               <View 
//                 style={[
//                   styles.zoomSliderProgress, 
//                   { height: `${zoom * 100}%` }
//                 ]} 
//               />
//             </View>
//             <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
//           </View>

//           <View style={styles.buttonContainer}>
//             {/* Flip Camera */}
//             <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//               <Ionicons name="camera-reverse-outline" size={30} color="white" />
//             </TouchableOpacity>

//             {/* Record Button */}
//             <TouchableOpacity 
//               style={[styles.recordButton, isRecording && styles.recordingButton]} 
//               onPress={isRecording ? stopRecording : startRecording} 
//             />
            
//             {/* Gallery Icon */}
//             <TouchableOpacity style={styles.button} onPress={pickVideo}>
//               <Ionicons name="images-outline" size={30} color="white" />
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </View>
//   );
// }

// // Your styles remain the same...
// const styles = StyleSheet.create({
//   // ... (keep all your existing styles)
//   volumeControlsRow: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   marginBottom: 15,
//   paddingHorizontal: 10,
// },
// volumeControl: {
//   flex: 1,
//   marginHorizontal: 5,
// },
// volumeLabel: {
//   color: 'white',
//   fontSize: 12,
//   marginBottom: 5,
//   textAlign: 'center',
// },
// sliderContainer: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'space-between',
// },
// sliderTrack: {
//   flex: 1,
//   height: 3,
//   backgroundColor: 'rgba(255,255,255,0.3)',
//   borderRadius: 2,
//   marginHorizontal: 5,
//   position: 'relative',
// },
// sliderProgress: {
//   height: '100%',
//   backgroundColor: '#0095f6',
//   borderRadius: 2,
// },
// sliderThumb: {
//   position: 'absolute',
//   width: 15,
//   height: 15,
//   borderRadius: 8,
//   backgroundColor: '#0095f6',
//   top: -6,
//   marginLeft: -7.5,
// },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#000',
//   },
//   message: {
//     textAlign: 'center',
//     paddingBottom: 10,
//     color: 'white',
//     fontSize: 16,
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#0095f6',
//     padding: 15,
//     borderRadius: 10,
//     alignSelf: 'center',
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   camera: {
//     flex: 1,
//   },
//   // Content Type Selector
//   contentTypeContainer: {
//     position: 'absolute',
//     top: 50,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     zIndex: 10,
//     paddingHorizontal: 20,
//   },
//   contentTypeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   contentTypeButtonActive: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderColor: '#0095f6',
//   },
//   contentTypeText: {
//     color: 'white',
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   contentTypeTextActive: {
//     color: '#0095f6',
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 40,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     width: '100%',
//     backgroundColor: 'transparent',
//     paddingHorizontal: 80,
//   },
//   button: {
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     padding: 10,
//     borderRadius: 30,
//   },
//   recordButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderWidth: 4,
//     borderColor: 'white',
//   },
//   recordingButton: {
//     backgroundColor: 'red',
//     borderColor: 'red',
//   },
//   // === Preview Styles ===
//   previewContainer: {
//     flex: 1,
//     backgroundColor: "black",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   video: {
//     flex: 1,
//     width: "100%",
//   },
//   playPauseButton: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   previewControls: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: 'space-between',
//   },
//   topControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 20,
//     paddingTop: 50,
//   },
//   controlButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   musicIndicator: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#0095f6',
//   },
//   bottomControls: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     paddingBottom: 20,
//   },
//   editTools: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 20,
//     gap: 30,
//   },
//   toolButton: {
//     alignItems: 'center',
//   },
//   toolText: {
//     color: 'white',
//     fontSize: 12,
//     marginTop: 5,
//   },
//   previewButtons: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "100%",
//     padding: 16,
//     backgroundColor: "rgba(0,0,0,0.6)",
//   },
//   actionBtn: {
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     backgroundColor: "#0095f6",
//   },
//   discardBtn: {
//     backgroundColor: "#ff375b",
//   },
//   cancelBtn: {
//     backgroundColor: "#666",
//   },
//   btnText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   timerContainer: {
//     position: 'absolute',
//     top: 100,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   timerText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   // Vertical Zoom Slider
//   zoomSliderContainer: {
//     position: 'absolute',
//     right: 20,
//     top: '30%',
//     bottom: '30%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 50,
//   },
//   zoomSliderTrack: {
//     width: 4,
//     height: '100%',
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     borderRadius: 2,
//     justifyContent: 'flex-end',
//   },
//   zoomSliderProgress: {
//     width: '100%',
//     backgroundColor: '#0095f6',
//     borderRadius: 2,
//   },
//   zoomText: {
//     color: 'white',
//     marginTop: 10,
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   // Trim Interface
//   trimPrompt: {
//     position: 'absolute',
//     top: 20,
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     padding: 16,
//     borderRadius: 10,
//   },
//   trimPromptText: {
//     color: 'white',
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   trimButton: {
//     backgroundColor: '#0095f6',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 5,
//   },
//   trimButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   trimInterface: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     padding: 20,
//     maxHeight: '70%',
//   },
//   trimHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   trimTitle: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   timelineContainer: {
//     width: '100%',
//     height: TIMELINE_HEIGHT,
//     marginBottom: 15,
//     position: 'relative',
//   },
//   timeline: {
//     width: '100%',
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     borderRadius: 2,
//     position: 'absolute',
//     top: TIMELINE_HEIGHT / 2 - 2,
//   },
//   progressBar: {
//     height: '100%',
//     backgroundColor: '#0095f6',
//     borderRadius: 2,
//   },
//   trimHandle: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     width: TRIM_HANDLE_WIDTH,
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 10,
//   },
//   leftHandle: {
//     left: 0,
//   },
//   rightHandle: {
//     right: 0,
//   },
//   handleLine: {
//     width: 2,
//     backgroundColor: 'white',
//     height: '100%',
//     position: 'absolute',
//   },
//   trimWindow: {
//     position: 'absolute',
//     top: TIMELINE_HEIGHT / 2 - 2,
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.5)',
//   },
//   timeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   timeText: {
//     color: 'white',
//     fontSize: 14,
//   },
//   durationText: {
//     color: '#0095f6',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   trimActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   // Filters Panel
//   filtersPanel: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     padding: 20,
//     maxHeight: '50%',
//   },
//   filtersContainer: {
//     marginVertical: 15,
//   },
//   // Music Panel
//   musicPanel: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     padding: 20,
//     maxHeight: '70%',
//   },
//   panelHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   panelTitle: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   musicList: {
//     maxHeight: 200,
//     marginBottom: 15,
//   },
//   musicItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   selectedMusicItem: {
//     backgroundColor: 'rgba(0, 149, 246, 0.2)',
//     borderColor: '#0095f6',
//     borderWidth: 1,
//   },
//   musicInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   musicTitle: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   musicArtist: {
//     color: 'rgba(255,255,255,0.7)',
//     fontSize: 14,
//   },
//   // volumeControl: {
//   //   marginTop: 15,
//   // },
//   // volumeLabel: {
//   //   color: 'white',
//   //   marginBottom: 10,
//   //   textAlign: 'center',
//   // },
//   // sliderContainer: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   justifyContent: 'space-between',
//   // },
//   // sliderTrack: {
//   //   flex: 1,
//   //   height: 4,
//   //   backgroundColor: 'rgba(255,255,255,0.3)',
//   //   borderRadius: 2,
//   //   marginHorizontal: 10,
//   //   position: 'relative',
//   // },
//   // sliderProgress: {
//   //   height: '100%',
//   //   backgroundColor: '#0095f6',
//   //   borderRadius: 2,
//   // },
//   // sliderThumb: {
//   //   position: 'absolute',
//   //   width: 20,
//   //   height: 20,
//   //   borderRadius: 10,
//   //   backgroundColor: '#0095f6',
//   //   top: -8,
//   //   marginLeft: -10,
//   // },
//   // Filter Section
//   filterSection: {
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   filterOption: {
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   selectedFilterOption: {
//     borderColor: '#0095f6',
//     borderWidth: 2,
//     borderRadius: 8,
//     padding: 4,
//   },
//   filterPreview: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginBottom: 5,
//   },
//   filterText: {
//     color: 'white',
//     fontSize: 12,
//   },
// });

