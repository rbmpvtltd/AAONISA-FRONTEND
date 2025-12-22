import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { Video as VideoCompressor } from 'react-native-compressor';
import CameraScreen from './recordPage';
import { VideoPreview } from './videoUploadPage';
type ContentType = 'story' | 'reels' | 'news';
type FilterType = 'none' | 'warm' | 'cool' | 'grayscale' | 'vintage';
type MusicOption = {
  id: string;
  title: string;
  artist: string;
  uri: string;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRIM_HANDLE_WIDTH = 40;
const TIMELINE_HEIGHT = 60;

// Sample music options
const musicOptions: MusicOption[] = [
  {
    id: '1',
    title: 'Upbeat Vibe',
    artist: 'Music Pack',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Chill Beat',
    artist: 'Music Pack',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Happy Tune',
    artist: 'Music Pack',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function CreateReel() {
  // const [permission, requestPermission] = useCameraPermissions();
  const [videoUri, setVideoUri] = useState<string | null>(null);
  // const [contentType, setContentType] = useState<ContentType>('reels');
  const params = useLocalSearchParams();
    const [contentType, setContentType] = useState<ContentType>(
    params.contentType === 'story' ? 'story' : 'reels'
  );
  // const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  // const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean | null>(null);


  // useEffect(() => {
  //   // Request all necessary permissions when component mounts
  //   (async () => {
  //     try {
  //       // Request camera permission
  //       const cameraPermission = await requestPermission();
  //       const cameraStatus = cameraPermission.status as PermissionStatus;
  //       setHasCameraPermission(cameraStatus === 'granted');

  //       // Request media library permission
  //       const mediaPermission = await MediaLibrary.requestPermissionsAsync();
  //       const mediaStatus = mediaPermission.status as PermissionStatus;

  //       // Request microphone permission for audio recording
  //       const microphonePermission = await Audio.requestPermissionsAsync();
  //       const microphoneStatus = microphonePermission.granted;
  //       setHasMicrophonePermission(microphoneStatus);

  //       if (cameraStatus !== 'granted' || mediaStatus !== 'granted' || !microphoneStatus) {
  //         Alert.alert(
  //           'Permissions required', 
  //           'Please grant all permissions (camera, media library, and microphone)'
  //         );
  //       }
  //     } catch (error) {
  //       console.error('Permission error:', error);
  //       Alert.alert('Permission Error', 'Failed to request necessary permissions. Please check app settings.');
  //     }
  //   })();

  //   return () => {
  //     // Clean up music sound when component unmounts

  //   };
  // }, []);

  useEffect(() => {
    if (params.contentType === 'story') {
      setContentType('story');
    }
  }, [params.contentType]);

  const discardVideo = () => {
    setVideoUri(null);
  };


  const uploadVideo = async () => {
    if (!videoUri) return;

    try {
      Alert.alert("Processing", "Compressing your video...");

      // Compress the video before uploading
      const compressedUri = await VideoCompressor.compress(videoUri, {
        compressionMethod: 'auto',
        minimumFileSizeForCompress: 0, // Compress even small files
        maxSize: 720, // Maximum resolution
        progressDivider: 1,
      });

      // Simulate upload process
      setTimeout(() => {
        Alert.alert("Uploaded!", `Your ${contentType} is ready.`);

        // Reset all states
        setVideoUri(null);
      }, 2000);

    } catch (error) {
      console.error('Compression error:', error);
      Alert.alert("Error", "Failed to compress video. Please try again.");
    }
  };


  // Show loading while permission is being checked
  // if (hasCameraPermission === null) {
  //   return <View style={styles.container} />;
  // }

  // Show permission UI if needed
  // if (!hasCameraPermission) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.message}>We need your permission to show the camera</Text>
  //       <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
  //         <Text style={styles.permissionButtonText}>Grant Permission</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      {/* Video Preview on the same screen */}
      {videoUri ? (
        <>
          <VideoPreview
            videoUri={videoUri}
            contentType={contentType}
            musicOptions={musicOptions}
            onDiscard={discardVideo}
            onUpload={uploadVideo}
          />
        </>
      )
        : (
          <>
            {/* Content Type Selector */}
            <CameraScreen onImagePick={setVideoUri} setContentType={setContentType} contentType={contentType} />
          </>
        )}
    </View>
  );
}
const styles = StyleSheet.create({
  volumeControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  volumeControl: {
    flex: 1,
    marginHorizontal: 5,
  },
  volumeLabel: {
    color: 'white',
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginHorizontal: 5,
    position: 'relative',
  },
  sliderProgress: {
    height: '100%',
    backgroundColor: '#0095f6',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#0095f6',
    top: -6,
    marginLeft: -7.5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#0095f6',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  // Content Type Selector
  contentTypeContainer: {
    position: 'absolute',
    top: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    zIndex: 10,
    paddingHorizontal: 20,
  },
  contentTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  contentTypeButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#0095f6',
  },
  contentTypeText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: '500',
  },
  contentTypeTextActive: {
    color: '#0095f6',
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
    paddingHorizontal: 80,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 30,
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 4,
    borderColor: 'white',
  },
  recordingButton: {
    backgroundColor: 'red',
    borderColor: 'red',
  },
  // === Preview Styles ===
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    flex: 1,
    width: "100%",
  },
  playPauseButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  previewControls: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0095f6',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  editTools: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 30,
  },
  toolButton: {
    alignItems: 'center',
  },
  toolText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#0095f6",
  },
  discardBtn: {
    backgroundColor: "#ff375b",
  },
  cancelBtn: {
    backgroundColor: "#666",
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  timerContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Vertical Zoom Slider
  zoomSliderContainer: {
    position: 'absolute',
    right: 20,
    top: '30%',
    bottom: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  zoomSliderTrack: {
    width: 4,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    justifyContent: 'flex-end',
  },
  zoomSliderProgress: {
    width: '100%',
    backgroundColor: '#0095f6',
    borderRadius: 2,
  },
  zoomText: {
    color: 'white',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Trim Interface
  trimPrompt: {
    position: 'absolute',
    top: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 10,
  },
  trimPromptText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  trimButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  trimButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  trimInterface: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    maxHeight: '70%',
  },
  trimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  trimTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timelineContainer: {
    width: '100%',
    height: TIMELINE_HEIGHT,
    marginBottom: 15,
    position: 'relative',
  },
  timeline: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    position: 'absolute',
    top: TIMELINE_HEIGHT / 2 - 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0095f6',
    borderRadius: 2,
  },
  trimHandle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: TRIM_HANDLE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  leftHandle: {
    left: 0,
  },
  rightHandle: {
    right: 0,
  },
  handleLine: {
    width: 2,
    backgroundColor: 'white',
    height: '100%',
    position: 'absolute',
  },
  trimWindow: {
    position: 'absolute',
    top: TIMELINE_HEIGHT / 2 - 2,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
  durationText: {
    color: '#0095f6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trimActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  // Filters Panel
  filtersPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    maxHeight: '50%',
  },
  filtersContainer: {
    marginVertical: 15,
  },
  // Music Panel
  musicPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    maxHeight: '70%',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  panelTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  musicList: {
    maxHeight: 200,
    marginBottom: 15,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedMusicItem: {
    backgroundColor: 'rgba(0, 149, 246, 0.2)',
    borderColor: '#0095f6',
    borderWidth: 1,
  },
  musicInfo: {
    flex: 1,
    marginLeft: 12,
  },
  musicTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  musicArtist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  filterSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterOption: {
    alignItems: 'center',
    marginRight: 15,
  },
  selectedFilterOption: {
    borderColor: '#0095f6',
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
  },
  filterPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 5,
  },
  filterText: {
    color: 'white',
    fontSize: 12,
  },
});

