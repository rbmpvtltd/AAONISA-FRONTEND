import 'dotenv/config';

export default {
  "expo": {
    "name": "Aao-Ni-Sa",
    "slug": "Aao-Ni-Sa",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "justsearchapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.anonymous.AaoNiSa"
    },
    "android": {
       "googleServicesFile": "./google-services.json",
       "useNextNotificationsApi": true,
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ],
      "edgeToEdgeEnabled": true,
      "package": "com.anonymous.AaoNiSa"
    },
    "web": {
      "bundler": "metro",
      "output": "static"
    },
    "plugins": [
      "expo-router",
        "expo-notifications",
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
          "recordAudioAndroid": true
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends.",
          "cameraPermission": "The app accesses your camera to let you take profile pictures."
        }
      ],
      "expo-audio",
      "expo-video"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId":  process.env.EAS_PROJECT_ID,
        "owner" :	"rbm.jodhpur03"
      }
    }
  }
}
