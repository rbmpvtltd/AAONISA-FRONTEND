// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Clipboard from "expo-clipboard";
// import { Link, useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { z } from "zod";
// import { forgetPassword, resetPassword, sendOtp } from "./api";

// // Zod Schema
// const forgotSchema = z.object({
//     emailOrPhone: z
//         .string()
//         .min(1, "Required")
//         .refine(
//             (val) => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10}$/.test(val),
//             "Invalid email or phone"
//         ),
//     otp: z.string().length(6, "OTP must be 6 digits"),
//     newPassword: z.string().min(6, "Password must be at least 6 chars"),
// });

// const ForgotPassword = () => {
//     const router = useRouter();
//     const [emailOrPhone, setEmailOrPhone] = useState("");
//     const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//     const [newPassword, setNewPassword] = useState("");
//     const [otpSent, setOtpSent] = useState(false);
//     const [token, setToken] = useState("");

//     // Auto-fill OTP from clipboard
//     useEffect(() => {
//         if(Platform.OS === "web") return;

//         const interval = setInterval(async () => {
//             const text = await Clipboard.getStringAsync();
//             if (/^\d{6}$/.test(text)) {
//                 setOtp(text.split(""));
//                 clearInterval(interval);
//             }
//         }, 2000);
//         return () => clearInterval(interval);
//     }, []);

//     const handleSendOtp = async () => {
//         try {
//             const data = await forgetPassword({ emailOrPhone });
//             console.log(data)
//             if (data.success) {
//                 setOtpSent(true);
//                 Alert.alert("OTP Sent", "Check your email/phone for the OTP");
//             } else {
//                 Alert.alert("Error", data);
//             }
//         } catch (error) {
//             Alert.alert("Error", "Failed to send OTP");
//         }
//     };

// // const verifyOtp = async () => {
// //     try {
// //         const data = await sendOtp({ emailOrPhone: emailOrPhone, code: otp.join("") });
// //         console.log(data);
// //         if (data.success) {
// //             console.log("Received Token:", data.token);

// //           setToken(data.token);  
// //         //     const check = await AsyncStorage.getItem("authToken");
// //         // console.log("Check Saved Token: ", check);

// //             Alert.alert("OTP Verified", "Token saved successfully!");
// //         } else {
// //             Alert.alert("Error", data.message);
// //         }
// //     } catch (error) {
// //         Alert.alert("Error", "Failed to verify OTP");
// //     }
// // };

// const verifyOtp = async () => {
//     try {
//         const data = await sendOtp({ emailOrPhone: emailOrPhone, code: otp.join("") });
//         console.log(data);
//         if (data.success) {
//             console.log("Received Token:", data.token);
//             setToken(data.token);

//             // Save token based on platform
//             if (Platform.OS === "web") {
//                 localStorage.setItem("authToken", data.token);
//                 Alert.alert("OTP Verified", "Token saved to localStorage!");
//             } else {
//                 await AsyncStorage.setItem("authToken", data.token);
//                 Alert.alert("OTP Verified", "Token saved to AsyncStorage!");
//             }
//         } else {
//             Alert.alert("Error", data.message);
//         }
//     } catch (error) {
//         Alert.alert("Error", "Failed to verify OTP");
//     }
// };


//     // const handleResetPassword = async () => {
//     //             try {
//     //         const data = await resetPassword({
//     //             emailOrPhone,
//     //             token,
//     //             newPassword,
//     //         });
//     //         if (data.success) {
//     //             Alert.alert("Success", "Password reset successfully!");
//     //             router.push("/auth/login");
//     //         } else {
//     //             Alert.alert("Error", data.message);
//     //         }
//     //     } catch (error) {
//     //         Alert.alert("Error", "Something went wrong");
//     //     }
//     // };

    
// const handleResetPassword = async () => {
//     try {
//         let storedToken = token;

//         // If token not in state, try reading from storage
//         if (!storedToken) {
//             if (Platform.OS === "web") {
//                 // Check if localStorage is available
//                 if (typeof localStorage !== 'undefined') {
//                     storedToken = localStorage.getItem("authToken");
//                 }
//             } else {
//                 storedToken = await AsyncStorage.getItem("authToken");
//             }
//         }

//         if (!storedToken) {
//             Alert.alert("Error", "No token found. Please verify OTP first.");
//             return;
//         }

//         const data = await resetPassword({
//             emailOrPhone,
//             token: storedToken,
//             newPassword,
//         });

//         if (data.success) {
//             Alert.alert("Success", "Password reset successfully!");

//             // Optional: Clear token after use
//             if (Platform.OS === "web") {
//                 if (typeof localStorage !== 'undefined') {
//                     localStorage.removeItem("authToken");
//                 }
//             } else {
//                 await AsyncStorage.removeItem("authToken");
//             }

//             router.push("/auth/login");
//         } else {
//             Alert.alert("Error", data.message);
//         }
//     } catch (error) {
//         console.error("Reset Password Error:", error);
//         Alert.alert("Error", "Something went wrong");
//     }
// };
    
//     return (
//            <KeyboardAvoidingView
//                     style={{ flex: 1 }} // Important: Give it flex: 1
//                     behavior={Platform.OS === "ios" ? "padding" : "height"} // Use 'padding' for iOS, 'height' is often better for Android with ScrollView
//                     keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust offset if needed (e.g., if you have a header)
//                 >
//         <View style={styles.container}>
//             <Text style={styles.logo}>AAO NI SA</Text>
//             <Text style={styles.subtitle}>Reset your password using OTP</Text>

//             <TextInput
//                 placeholder="Phone Number or Email Address"
//                 style={styles.input}
//                 value={emailOrPhone}
//                 onChangeText={setEmailOrPhone}
//             />

//             {otpSent ? (
//                 <View style={styles.otpContainer}>
//                     {otp.map((digit, index) => (
//                         <TextInput
//                             key={index}
//                             style={styles.otpInput}
//                             maxLength={1}
//                             keyboardType="numeric"
//                             value={digit}
//                             onChangeText={(text) => {
//                                 const newOtp = [...otp];
//                                 newOtp[index] = text;
//                                 setOtp(newOtp);
//                             }}
//                         />
//                     ))}
//                 </View>
//             ) : null}

//             <TouchableOpacity style={styles.verifyButton} onPress={handleSendOtp}>
//                 <Text style={styles.verifyText}>{otpSent ? "Resend OTP" : "Send OTP"}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.verifyButton} onPress={verifyOtp}>
//                 <Text style={styles.verifyText}>Verify Otp</Text>
//             </TouchableOpacity>

//             <TextInput
//                 placeholder="Enter New Password"
//                 style={styles.input}
//                 secureTextEntry
//                 value={newPassword}
//                 onChangeText={setNewPassword}
//             />

//             <TouchableOpacity style={styles.signUpButton} onPress={handleResetPassword}>
//                 <Text style={styles.signUpText}>Reset Password</Text>
//             </TouchableOpacity>

//             <Link href="/auth/login" style={styles.link}>
//                 Back to Login
//             </Link>
//         </View>
//           </KeyboardAvoidingView>
//     );
// };

// export default ForgotPassword;

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
//     logo: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
//     subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20, color: "#333" },
//     input: {
//         borderWidth: 1,
//         borderColor: "#00CFFF",
//         borderRadius: 8,
//         padding: 12,
//         marginBottom: 12,
//         backgroundColor: "#E6F9FF",
//     },
//     otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
//     otpInput: {
//         borderWidth: 1,
//         borderColor: "#00CFFF",
//         backgroundColor: "#E6F9FF",
//         borderRadius: 8,
//         padding: 12,
//         textAlign: "center",
//         width: 50,
//     },
//     verifyButton: {
//         backgroundColor: "#00CFFF",
//         padding: 12,
//         borderRadius: 8,
//         alignItems: "center",
//         marginBottom: 12,
//     },
//     verifyText: { color: "#fff", fontWeight: "bold" },
//     signUpButton: {
//         backgroundColor: "#00CFFF",
//         padding: 14,
//         borderRadius: 25,
//         alignItems: "center",
//     },
//     signUpText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//     link: { marginTop: 15, color: "#0066cc", textAlign: "center" },
// });

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { forgetPassword, resetPassword, sendOtp } from "./api";

const forgotSchema = z.object({
    emailOrPhone: z
        .string()
        .min(1, "Required")
        .refine(
            (val) => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10}$/.test(val),
            "Invalid email or phone"
        ),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 chars"),
});

const saveToken = async (token : string) => {
    if (Platform.OS === "web") {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem("authToken", token);
        }
    } else {
        await AsyncStorage.setItem("authToken", token);
    }
};

const getToken = async () => {
    if (Platform.OS === "web") {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem("authToken");
        }
        return "";
    } else {
        return await AsyncStorage.getItem("authToken");
    }
};

const removeToken = async () => {
    if (Platform.OS === "web") {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem("authToken");
        }
    } else {
        await AsyncStorage.removeItem("authToken");
    }
};

const ForgotPassword = () => {
    const router = useRouter();
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {
        if(Platform.OS === "web") return;
        
        const interval = setInterval(async () => {
            const text = await Clipboard.getStringAsync();
            if (/^\d{6}$/.test(text)) {
                setOtp(text.split(""));
                clearInterval(interval);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleSendOtp = async () => {
        try {
            const data = await forgetPassword({ emailOrPhone });
            console.log(data)
            if (data.success) {
                setOtpSent(true);
                Alert.alert("OTP Sent", "Check your email/phone for the OTP");
            } else {
                Alert.alert("Error", data);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to send OTP");
        }
    };

    const verifyOtp = async () => {
        try {
            const data = await sendOtp({ emailOrPhone: emailOrPhone, code: otp.join("") });
            console.log(data);
            if (data.success) {
                console.log("Received Token:", data.token);
                setToken(data.token);

                await saveToken(data.token);
                
                Alert.alert("OTP Verified", `Token saved to ${Platform.OS === "web" ? "localStorage" : "AsyncStorage"}!`);
            } else {
                Alert.alert("Error", data.message);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to verify OTP");
        }
    };

    const handleResetPassword = async () => {
  try {
    let storedToken = await getToken();

    if (!storedToken) {
      Alert.alert("Error", "No token found. Please verify OTP first.");
      return;
    }

    // Yahi pe resetPassword call karo
    const data = await resetPassword({
      emailOrPhone,
      token: storedToken,
      newPassword,
    });

    if (data.success) {
      Alert.alert("Success", "Password reset successfully!");
      await removeToken(); // clear token after use
      router.push("/auth/login");
    } else {
      Alert.alert("Error", data.message || "Failed to reset password");
    }
  } catch (error) {
    console.error("Reset Password Error:", error);
    Alert.alert("Error", "Something went wrong");
  }
};

    
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <View style={styles.container}>
                <Text style={styles.logo}>AAO NI SA</Text>
                <Text style={styles.subtitle}>Reset your password using OTP</Text>

                <TextInput
                    placeholder="Phone Number or Email Address"
                    style={styles.input}
                    value={emailOrPhone}
                    onChangeText={setEmailOrPhone}
                />

                {otpSent ? (
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                style={styles.otpInput}
                                maxLength={1}
                                keyboardType="numeric"
                                value={digit}
                                onChangeText={(text) => {
                                    const newOtp = [...otp];
                                    newOtp[index] = text;
                                    setOtp(newOtp);
                                }}
                            />
                        ))}
                    </View>
                ) : null}

                <TouchableOpacity style={styles.verifyButton} onPress={handleSendOtp}>
                    <Text style={styles.verifyText}>{otpSent ? "Resend OTP" : "Send OTP"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.verifyButton} onPress={verifyOtp}>
                    <Text style={styles.verifyText}>Verify OTP</Text>
                </TouchableOpacity>

                <TextInput
                    placeholder="Enter New Password"
                    style={styles.input}
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />

                <TouchableOpacity style={styles.signUpButton} onPress={handleResetPassword}>
                    <Text style={styles.signUpText}>Reset Password</Text>
                </TouchableOpacity>

                <Link href="/auth/login" style={styles.link}>
                    Back to Login
                </Link>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ForgotPassword;

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
    otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
    otpInput: {
        borderWidth: 1,
        borderColor: "#00CFFF",
        backgroundColor: "#E6F9FF",
        borderRadius: 8,
        padding: 12,
        textAlign: "center",
        width: 50,
    },
    verifyButton: {
        backgroundColor: "#00CFFF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 12,
    },
    verifyText: { color: "#fff", fontWeight: "bold" },
    signUpButton: {
        backgroundColor: "#00CFFF",
        padding: 14,
        borderRadius: 25,
        alignItems: "center",
    },
    signUpText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    link: { marginTop: 15, color: "#0066cc", textAlign: "center" },
});