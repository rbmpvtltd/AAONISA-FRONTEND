import 'dotenv/config';

export default {
  "expo": {
    "name": "HitHoy",
    "deepLinks": true,
    "slug": "HitHoy",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assests/icon hithoye.png",
    "scheme": "justsearchapp",
    "splash": {
      "image": "./assets/logo-with-name.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.anonymous.AaoNiSa"
    },
    "android": {
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON,
      "useNextNotificationsApi": true,
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ],
      "adaptiveIcon": {
        "foregroundImage": "./assets/logo-with-name.png",
        "backgroundColor": "#FFFFFF"
      },
      "edgeToEdgeEnabled": true,
      "package": "com.anonymous.AaoNiSa",
      "usesCleartextTraffic": true
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/icon hithoye.png",
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
      "EXPO_PUBLIC_LOCAL_API_URL": "https://api.aaonisaa.com/api",
      "eas": {
        "projectId": process.env.EAS_PROJECT_ID,
        "owner": "rbm.jodhpur03"
      }
    }
  }
}
