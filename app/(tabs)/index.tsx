// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

import HomePage from "@/components/FeedPage";





// import {
//   GoogleSignin,
//   isErrorWithCode,
//   isSuccessResponse,
//   statusCodes
// } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
// webClientId: '320530581975-r73n8nen70n03poe4qm8uvvn01skf7j7.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
// scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
// offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
// hostedDomain: '', // specifies a hosted domain restriction
// forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
// accountName: '', // [Android] specifies an account name on the device that should be used
// iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
// googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. "GoogleService-Info-Staging"
// openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
// profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
// });
export default function HomeScreen() {
  // const [userInfo, setUserInfo] = useState<any>(null);
  // const handleGoogleSignIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const response = await GoogleSignin.signIn();
  //     if (isSuccessResponse(response)) {
  //       setUserInfo(response.data);
  //     } else {
  //       // sign in was cancelled by user
  //       console.log("Sign in wascancelled by user");
  //     }
  //   } catch (error) {
  //     if (isErrorWithCode(error)) {
  //       switch (error.code) {
  //         case statusCodes.IN_PROGRESS:
  //           // operation (eg. sign in) already in progress
  //           Alert.alert("sign is in progress");
  //           break;
  //         case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
  //           // Android only, 
  //           Alert.alert("play services not available")
  //           break;
  //         default:
  //         // some other error happened
  //       }
  //     } else {
  //       // an error that's not related to google sign in occurred
  //       Alert.alert("an error that's not related to google sign in occurred")
  //     }
  //   }
  // };
  return (
    <>
      {/* <Text>Hello</Text> */}
      {/* <Text>Hello</Text> */}

      {/* <VideoUploader /> */}

      {/* <Audio /> */}
      {/* <VideoScreen /> */}
      <HomePage />
      {/* <ProfileScreen /> */}
      {/* <LoginScreen /> */}


    </>
  );
}
