// import GoogleSignIn from "@/components/GoogleSignIn";
// import React from "react";
// import { StyleSheet, Text, View } from "react-native";

// export default function LoginScreen() {
//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Welcome! Sign in below 👇</Text>
//             <GoogleSignIn />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     title: {
//         fontSize: 20,
//         marginBottom: 20,
//     },
// });



import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function LoginScreen() {
    const [userInfo, setUserInfo] = useState<any>(null);

    // ✅ Configure Google Signin
    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                "320530581975-r73n8nen70n03poe4qm8uvvn01skf7j7.apps.googleusercontent.com", // Google Cloud Console se
            offlineAccess: true,
        });
    }, []);

    // ✅ Handle Sign In
    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices(); // check Google Play Services
            const user = await GoogleSignin.signIn();
            setUserInfo(user);
            console.log("User Info:", user);
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("User cancelled the login flow");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log("Signin in progress");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log("Play services not available");
            } else {
                console.log("Some other error:", error);
            }
        }
    };

    // ✅ Handle Sign Out
    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            setUserInfo(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {userInfo ? (
                <>
                    <Text>Welcome {userInfo.user.name}</Text>
                    <Text>Email: {userInfo.user.email}</Text>
                    <Button title="Logout" onPress={signOut} />
                </>
            ) : (
                <>
                    <GoogleSigninButton
                        style={{ width: 200, height: 50 }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={signIn}
                    />
                    {/* या simple react native button */}
                    {/* <Button title="Google Sign In" onPress={signIn} /> */}
                </>
            )}
        </View>
    );
}
