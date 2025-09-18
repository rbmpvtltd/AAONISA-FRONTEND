// import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { loginUser } from "./api";


WebBrowser.maybeCompleteAuthSession();

//  Zod Schema
const loginSchema = z.object({
    identifier: z.string().min(1, "Phone/Email/Username required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    // Google Auth
    // const [request, response, promptAsync] = Google.useAuthRequest({
    //     // expoClientId: "320530581975-r73n8nen70n03poe4qm8uvvn01skf7j7.apps.googleusercontent.com",
    //     iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    //     androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    //     webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    // });

    // React.useEffect(() => {
    //     if (response?.type === "success") {
    //         const { authentication } = response;
    //         Alert.alert("Google Login Success", JSON.stringify(authentication));
    //         router.push("/");
    //     }
    // }, [response]);

     const saveToken = async (token: string) => {
  if (!token) return;
  if (Platform.OS === "web") {
    localStorage.setItem("accessToken", token);
  } else {
    await AsyncStorage.setItem("accessToken", token);
  }
};


    const handleLogin = async () => {
  try {
    const data = await loginUser({ identifier, password });
    console.log("login response:", data);

    if (data.message === "Login successful") {
      // 1. save token (response body me aa raha hai)
      if (data.accessToken) {
        await saveToken(data.accessToken);
      }

      Alert.alert("Success", "Logged in successfully!");
      router.push("/");
    } else {
      Alert.alert("Error", data.message);
    }
  } catch (error) {
    console.error("Login error:", error);
    Alert.alert("Error", "Something went wrong");
  }
};


    return (
          <KeyboardAvoidingView
                            style={{ flex: 1 }} // Important: Give it flex: 1
                            behavior={Platform.OS === "ios" ? "padding" : "height"} // Use 'padding' for iOS, 'height' is often better for Android with ScrollView
                            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust offset if needed (e.g., if you have a header)
                        >
        <View style={styles.container}>
            <Text style={styles.logo}>AAO NI SA</Text>
            <Text style={styles.subtitle}>Log in to see Videos from your friends.</Text>

            {/* Identifier Input */}
            <TextInput
                placeholder="Phone Number, username or email address"
                style={styles.input}
                value={identifier}
                onChangeText={setIdentifier}
            />

            {/* Password Input */}
            <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotButton} onPress={() => router.push("/auth/forgot-password")}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>

            {/* Google Sign In */}
            {/* <TouchableOpacity
                style={styles.googleButton}
                disabled={!request}
                onPress={() => promptAsync()}
            >
                <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity> */}

            <Link href="/auth/register" style={styles.link}>
                Don’t have an account ? Sign up
            </Link>
        </View>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
    logo: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
    subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20, color: "#333" },
    input: {
        borderWidth: 1,
        borderColor: "#00CFFF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#E6F9FF",
    },
    forgotButton: { marginBottom: 15 },
    forgotText: { color: "#0066cc", textAlign: "center" },
    loginButton: {
        backgroundColor: "#00CFFF",
        padding: 14,
        borderRadius: 25,
        alignItems: "center",
        marginBottom: 15,
    },
    loginText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    googleButton: {
        backgroundColor: "#DB4437",
        padding: 14,
        borderRadius: 25,
        alignItems: "center",
        marginBottom: 15,
    },
    googleText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    link: { marginTop: 15, color: "#0066cc", textAlign: "center" },
});

