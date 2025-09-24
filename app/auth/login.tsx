// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Link, useRouter } from "expo-router";
// import * as WebBrowser from "expo-web-browser";
// import React, { useState } from "react";
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { z } from "zod";
// import { useAppTheme } from "../themeHelper";
// import { loginUser } from "./api";

// WebBrowser.maybeCompleteAuthSession();

// //  Zod Schema
// const loginSchema = z.object({
//   identifier: z.string().min(1, "Phone/Email/Username required"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// const Login = () => {
//   const router = useRouter();
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");

//   const theme = useAppTheme(); 

//   const saveToken = async (token: string) => {
//     if (!token) return;
//     if (Platform.OS === "web") {
//       localStorage.setItem("accessToken", token);
//     } else {
//       await AsyncStorage.setItem("accessToken", token);
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       const data = await loginUser({ identifier, password });
//       console.log("login response:", data);

//       if (data.message === "Login successful") {
//         if (data.accessToken) {
//           await saveToken(data.accessToken);
//         }
//         Alert.alert("Success", "Logged in successfully!");
//         router.push("/");
//       } else {
//         Alert.alert("Error", data.message);
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       Alert.alert("Error", "Something went wrong");
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
//     >
//       <View style={[styles.container, { backgroundColor: theme.background }]}>
//         <Text style={[styles.logo, { color: theme.text }]}>AAO NI SA</Text>
//         <Text style={[styles.subtitle, { color: theme.subtitle }]}>
//           Log in to see Videos from your friends.
//         </Text>

//         {/* Identifier Input */}
//         <TextInput
//           placeholder="Phone Number, Email Address"
//           placeholderTextColor={theme.placeholder}
//           style={[
//             styles.input,
//             {
//               backgroundColor: theme.inputBg,
//               borderColor: theme.inputBorder,
//               color: theme.text,
//             },
//           ]}
//           value={identifier}
//           onChangeText={setIdentifier}
//         />

//         {/* Password Input */}
//         <TextInput
//           placeholder="Password"
//           placeholderTextColor={theme.placeholder}
//           style={[
//             styles.input,
//             {
//               backgroundColor: theme.inputBg,
//               borderColor: theme.inputBorder,
//               color: theme.text,
//             },
//           ]}
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />

//         {/* Forgot Password */}
//         <TouchableOpacity
//           style={styles.forgotButton}
//           onPress={() => router.push("/auth/forgot-password")}
//         >
//           <Text style={[styles.forgotText, { color: theme.forgot }]}>
//             Forgot Password?
//           </Text>
//         </TouchableOpacity>

//         {/* Login Button */}
//         <TouchableOpacity
//           style={[styles.loginButton, { backgroundColor: theme.buttonBg }]}
//           onPress={handleLogin}
//         >
//           <Text style={[styles.loginText, { color: theme.buttonText }]}>
//             Log in
//           </Text>
//         </TouchableOpacity>

//         {/* Google Sign In */}
//         {/* <TouchableOpacity style={[styles.googleButton, { backgroundColor: theme.googleBg }]}>
//           <Text style={[styles.googleText, { color: theme.buttonText }]}>
//             Sign in with Google
//           </Text>
//         </TouchableOpacity> */}

//         <Link href="/auth/register" style={[styles.link, { color: theme.link }]}>
//           Don’t have an account ? Sign up
//         </Link>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   logo: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
//   subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
//   input: {
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   forgotButton: { marginBottom: 15 },
//   forgotText: { textAlign: "center" },
//   loginButton: {
//     padding: 14,
//     borderRadius: 25,
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   loginText: { fontSize: 16, fontWeight: "bold" },
//   googleButton: {
//     padding: 14,
//     borderRadius: 25,
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   googleText: { fontSize: 16, fontWeight: "bold" },
//   link: { marginTop: 15, textAlign: "center" },
// });

import { useAuthStore } from "@/src/store/useAuthStore";
import { Link, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { useAppTheme } from "../themeHelper";
import { loginUser } from "./api";

const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Required")
    .refine(
      (val) => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10}$/.test(val),
      "Invalid email or phone"
    ),
  password: z.string().min(6, "Password must be at least 6 chars"),
});


const Login = () => {
  const router = useRouter();
  const theme = useAppTheme();

  const {
    emailOrPhone,
    password,
    setEmailOrPhone,
    setPassword,
    saveToken,
    resetAuth
  } = useAuthStore();

useEffect(() => {
  return () => {
    resetAuth();
  };
}, []);

  const handleLogin = async () => {
  const validation = loginSchema.safeParse({ emailOrPhone, password });

  if (!validation.success) {
    Alert.alert("Validation Error", validation.error.issues[0].message);
    return;
  }

    try {
      const data = await loginUser({ identifier: emailOrPhone, password });
      console.log("login response:", data);

      if (data.message === "Login successful") {
        if (data.accessToken) {
          await saveToken(data.accessToken); 
        }
        Alert.alert("Success", "Logged in successfully!");
        await resetAuth();
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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.logo, { color: theme.text }]}>AAO NI SA</Text>
        <Text style={[styles.subtitle, { color: theme.subtitle }]}>
          Log in to see Videos from your friends.
        </Text>

        <TextInput
          placeholder="Phone Number, Email Address"
          placeholderTextColor={theme.placeholder}
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={theme.placeholder}
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => router.push("/auth/forgot-password")}
        >
          <Text style={[styles.forgotText, { color: theme.forgot }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: theme.buttonBg }]}
          onPress={handleLogin}
        >
          <Text style={[styles.loginText, { color: theme.buttonText }]}>
            Log in
          </Text>
        </TouchableOpacity>


  {/* Google Sign In */}
//         {/* <TouchableOpacity style={[styles.googleButton, { backgroundColor: theme.googleBg }]}>
//           <Text style={[styles.googleText, { color: theme.buttonText }]}>
//             Sign in with Google
//           </Text>
//         </TouchableOpacity> */}


        <Link href="/auth/register" style={[styles.link, { color: theme.link }]}>
          Don’t have an account ? Sign up
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  logo: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  forgotButton: { marginBottom: 15 },
  forgotText: { textAlign: "center" },
  loginButton: {
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  loginText: { fontSize: 16, fontWeight: "bold" },
  link: { marginTop: 15, textAlign: "center" },
});

