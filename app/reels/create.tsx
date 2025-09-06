// import { Ionicons } from '@expo/vector-icons';
// import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
// import { useState } from 'react';
// import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


// export default function App() {
//     const [facing, setFacing] = useState<CameraType>('back');
//     const [permission, requestPermission] = useCameraPermissions();

//     if (!permission) {
//         // Camera permissions are still loading.
//         return <View />;
//     }

//     if (!permission.granted) {
//         // Camera permissions are not granted yet.
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.message}>We need your permission to show the camera</Text>
//                 <Button onPress={requestPermission} title="grant permission" />
//             </View>
//         );
//     }

//     function toggleCameraFacing() {
//         setFacing(current => (current === 'back' ? 'front' : 'back'));
//     }

//     return (
//         <View style={styles.container}>
//             <CameraView style={styles.camera} facing={facing} />
//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//                     {/* <Text style={styles.text}>Flip Camera</Text> */}
//                     <Ionicons name="camera-reverse-outline" size={42} color="white" />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     message: {
//         textAlign: 'center',
//         paddingBottom: 10,
//     },
//     camera: {
//         flex: 1,
//     },
//     buttonContainer: {
//         position: 'absolute',
//         bottom: 64,
//         flexDirection: 'row',
//         backgroundColor: 'transparent',
//         width: '100%',
//         paddingHorizontal: 64,
//     },
//     button: {
//         flex: 1,
//         alignItems: 'center',
//     },
// });



// import { Ionicons } from '@expo/vector-icons';
// import { Video } from 'expo-av';
// import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
// import * as FileSystem from 'expo-file-system';
// import * as ImagePicker from 'expo-image-picker';
// import { useState } from 'react';
// import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function App() {
//     const [facing, setFacing] = useState<CameraType>('back');
//     const [permission, requestPermission] = useCameraPermissions();
//     const [videoUri, setVideoUri] = useState<string | null>(null);

//     if (!permission) {
//         return <View />;
//     }

//     if (!permission.granted) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.message}>We need your permission to show the camera</Text>
//                 <Button onPress={requestPermission} title="grant permission" />
//             </View>
//         );
//     }

//     function toggleCameraFacing() {
//         setFacing(current => (current === 'back' ? 'front' : 'back'));
//     }

//     // === Pick video from Gallery ===
//     const pickVideo = async () => {
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//             allowsEditing: false,
//             quality: 1,
//         });

//         if (!result.canceled) {
//             const video = result.assets[0];

//             // check video duration
//             if (video.duration && video.duration / 1000 > 30) {
//                 Alert.alert("Error", "Video should not be longer than 30 seconds.");
//                 return;
//             }

//             // === convert video to mp4 (if not already) ===
//             let newUri = video.uri;
//             if (!newUri.endsWith(".mp4")) {
//                 const mp4Uri = FileSystem.documentDirectory + "converted.mp4";
//                 try {
//                     await FileSystem.copyAsync({
//                         from: newUri,
//                         to: mp4Uri,
//                     });
//                     newUri = mp4Uri;
//                 } catch (error) {
//                     console.log("Error converting to mp4:", error);
//                 }
//             }

//             setVideoUri(newUri);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {videoUri ? (
//                 <Video
//                     source={{ uri: videoUri }}
//                     style={styles.video}
//                     useNativeControls
//                 // resizeMode="contain"
//                 />
//             ) : (
//                 <CameraView style={styles.camera} facing={facing} />
//             )}

//             <View style={styles.buttonContainer}>
//                 {/* Flip Camera */}
//                 <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//                     <Ionicons name="camera-reverse-outline" size={42} color="white" />
//                 </TouchableOpacity>

//                 {/* Gallery Icon */}
//                 <TouchableOpacity style={styles.button} onPress={pickVideo}>
//                     <Ionicons name="images-outline" size={42} color="white" />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     message: {
//         textAlign: 'center',
//         paddingBottom: 10,
//     },
//     camera: {
//         flex: 1,
//     },
//     video: {
//         flex: 1,
//     },
//     buttonContainer: {
//         position: 'absolute',
//         bottom: 64,
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         width: '100%',
//         backgroundColor: 'transparent',
//         paddingHorizontal: 32,
//     },
//     button: {
//         alignItems: 'center',
//     },
// });

import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState(false); // new state

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    // === Pick video from Gallery ===
    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            const video = result.assets[0];

            // check video duration
            if (video.duration && video.duration / 1000 > 30) {
                Alert.alert("Error", "Video should not be longer than 30 seconds.");
                return;
            }

            // convert to mp4 (simple copy if not mp4)
            let newUri = video.uri;
            if (!newUri.endsWith(".mp4")) {
                const mp4Uri = FileSystem.documentDirectory + "converted.mp4";
                try {
                    await FileSystem.copyAsync({
                        from: newUri,
                        to: mp4Uri,
                    });
                    newUri = mp4Uri;
                } catch (error) {
                    console.log("Error converting to mp4:", error);
                }
            }

            setVideoUri(newUri);
            setPreviewMode(true); // open preview screen
        }
    };

    // === Preview Screen like Instagram ===
    if (previewMode && videoUri) {
        return (
            <View style={styles.previewContainer}>
                <Video
                    source={{ uri: videoUri }}
                    style={styles.video}
                    useNativeControls
                    // resizeMode="contain"
                    resizeMode={ResizeMode.CONTAIN}
                />

                <View style={styles.previewButtons}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => setPreviewMode(false)}
                    >
                        <Text style={styles.btnText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => Alert.alert("Uploaded!", "Your video is ready.")}
                    >
                        <Text style={styles.btnText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // === Default Camera Screen ===
    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} />

            <View style={styles.buttonContainer}>
                {/* Flip Camera */}
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    <Ionicons name="camera-reverse-outline" size={42} color="white" />
                </TouchableOpacity>

                {/* Gallery Icon */}
                <TouchableOpacity style={styles.button} onPress={pickVideo}>
                    <Ionicons name="images-outline" size={42} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 64,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: 'transparent',
        paddingHorizontal: 32,
    },
    button: {
        alignItems: 'center',
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
        backgroundColor: "#ff0066",
    },
    btnText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
