import {
    GoogleSignin,
    GoogleSigninButton,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes
} from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
GoogleSignin.configure({
    webClientId: "886476374094-91eir7pmt76uankmruis7hosn0aao56e.apps.googleusercontent.com",
    // scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
    // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    // forceCodeForRefreshToken: false,
    // iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
});
// import statusCodes along with GoogleSignin



// const GoogleLogin = async () => {
//     // check if users' device has google play services
//     await GoogleSignin.hasPlayServices();

//     // initiates signIn process
//     const userInfo = await GoogleSignin.signIn();
//     return userInfo;
// };

// const googleSignIn = async () => {
//     try {
//         const response = await GoogleLogin();

//         // retrieve user data
//         const { idToken, user } = response.data ?? {};
//         if (idToken) {
//             await processUserData(idToken, user); // Server call to validate the token & process the user data for signing In
//         }
//     } catch (error) {
//         console.log('Error', error);
//     }
// };

// export default function index() {
//     return (
//         <GoogleSigninButton onPress={googleSignIn} />
//     )
// }

// Somewhere in your code


const signIn = async () => {
    const [state, setState] = useState<any>(null);
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
            setState({ userInfo: response.data });
        } else {
            // sign in was cancelled by user
        }
    } catch (error) {
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    // operation (eg. sign in) already in progress
                    console.log("already in progress")
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    // Android only, play services not available or outdated
                    console.log("play services not available or outdated")
                    break;
                default:
                    // some other error happened
                    console.log("some other error happened")
            }
        } else {
            // an error that's not related to google sign in occurred\
            console.log("an error that's not related to google sign in occurred")
        }
    }
};

export default function index() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GoogleSigninButton onPress={signIn} />
            {/* // <Text>Google Sign In</Text> */}
        </SafeAreaView>
    )
}