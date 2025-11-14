import { Audio } from "expo-av";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export async function requestAllPermissions() {
  try {
    // Camera
    const camera = await Camera.requestCameraPermissionsAsync();
    const hasCamera = camera.status === "granted";

    // Microphone
    const mic = await Audio.requestPermissionsAsync();
    const hasMic = mic.granted;

    // Media Library
    const media = await MediaLibrary.requestPermissionsAsync();
    const hasMedia = media.status === "granted";

    return {
      hasCamera,
      hasMic,
      hasMedia,
    };
  } catch (e) {
    console.log("Permission Error →", e);
    return {
      hasCamera: false,
      hasMic: false,
      hasMedia: false,
    };
  }
}
