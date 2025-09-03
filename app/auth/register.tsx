// import { Link, useRouter } from "expo-router";
// import React, { useState } from "react";
// import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// const Register = () => {
//     const router = useRouter();
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const handleRegister = () => {
//         if (!name || !email || !password) {
//             alert("Please fill all fields");
//             return;
//         }
//         //  API call
//         alert("Registration successful!");
//         router.push("/auth/login");
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Register</Text>

//             <TextInput
//                 placeholder="Full Name"
//                 style={styles.input}
//                 value={name}
//                 onChangeText={setName}
//             />

//             <TextInput
//                 placeholder="Email"
//                 style={styles.input}
//                 value={email}
//                 onChangeText={setEmail}
//             />

//             <TextInput
//                 placeholder="Password"
//                 style={styles.input}
//                 secureTextEntry
//                 value={password}
//                 onChangeText={setPassword}
//             />

//             <TouchableOpacity style={styles.button} onPress={handleRegister}>
//                 <Text style={styles.buttonText}>Register</Text>
//             </TouchableOpacity>

//             <Link href="/auth/login" style={styles.link}>
//                 Already have an account? Login
//             </Link>
//         </View>
//     );
// };

// export default Register;

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: "center", padding: 20 },
//     title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
//     input: {
//         borderWidth: 1,
//         borderColor: "#ccc",
//         borderRadius: 8,
//         padding: 12,
//         marginBottom: 12,
//     },
//     button: {
//         backgroundColor: "#2196F3",
//         padding: 14,
//         borderRadius: 8,
//         alignItems: "center",
//     },
//     buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//     link: { marginTop: 15, color: "#0066cc", textAlign: "center" },
// });


// import { Link, useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
// import { View } from "react-native-reanimated/lib/typescript/Animated";

// const Register = () => {
//     const router = useRouter();
//     const [emailOrPhone, setEmailOrPhone] = useState("");
//     const [otp, setOtp] = useState(["", "", "", ""]);
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [otpSent, setOtpSent] = useState(false);

//     const validateForm = () => {
//         if (!emailOrPhone) {
//             Alert.alert("Error", "Please enter phone number or email address");
//             return false;
//         }
//         // Simple email/phone validation
//         const emailRegex = /\S+@\S+\.\S+/;
//         const phoneRegex = /^[0-9]{10}$/;
//         if (!(emailRegex.test(emailOrPhone) || phoneRegex.test(emailOrPhone))) {
//             Alert.alert("Error", "Enter valid email or phone number");
//             return false;
//         }
//         if (!username) {
//             Alert.alert("Error", "Please enter username");
//             return false;
//         }
//         if (password.length < 6) {
//             Alert.alert("Error", "Password must be at least 6 characters");
//             return false;
//         }
//         return true;
//     };

//     const handleSendOtp = () => {
//         if (!emailOrPhone) {
//             Alert.alert("Error", "Enter phone number or email first");
//             return;
//         }
//         setOtpSent(true);
//         Alert.alert("OTP Sent", "Check your email/phone for the OTP");
//     };

//     const handleSignUp = () => {
//         if (!validateForm()) return;

//         if (otp.join("").length !== 4) {
//             Alert.alert("Error", "Enter valid 4-digit OTP");
//             return;
//         }

//         //  Backend API call yaha hoga
//         Alert.alert("Success", "Account created successfully!");
//         router.push("/auth/login");
//     };

//     const handleOtpChange = (text: string, index: number) => {
//         const newOtp = [...otp];
//         newOtp[index] = text;
//         setOtp(newOtp);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.logo}>AAO NI SA</Text>
//             <Text style={styles.subtitle}>Sign up to see Videos from your friends.</Text>

//             {/* Phone/Email */}
//             <TextInput
//                 placeholder="Phone Number or email address"
//                 style={styles.input}
//                 value={emailOrPhone}
//                 onChangeText={setEmailOrPhone}
//                 keyboardType="email-address"
//             />

//             {/* OTP Section */}
//             {otpSent ? (
//                 <View style={styles.otpContainer}>
//                     {otp.map((digit, index) => (
//                         <TextInput
//                             key={index}
//                             style={styles.otpInput}
//                             maxLength={1}
//                             keyboardType="numeric"
//                             value={digit}
//                             onChangeText={(text) => handleOtpChange(text, index)}
//                         />
//                     ))}
//                 </View>
//             ) : null}

//             <TouchableOpacity style={styles.verifyButton} onPress={handleSendOtp}>
//                 <Text style={styles.verifyText}>{otpSent ? "Resend OTP" : "Send OTP"}</Text>
//             </TouchableOpacity>

//             {/* Username */}
//             <TextInput
//                 placeholder="User Name"
//                 style={styles.input}
//                 value={username}
//                 onChangeText={setUsername}
//             />

//             {/* Password */}
//             <TextInput
//                 placeholder="Create Password"
//                 style={styles.input}
//                 secureTextEntry
//                 value={password}
//                 onChangeText={setPassword}
//             />

//             <Text style={styles.policy}>
//                 By Sign up, you agree to our Terms, Privacy Policy and Cookies Policy
//             </Text>

//             {/* Sign Up */}
//             <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
//                 <Text style={styles.signUpText}>Sign Up</Text>
//             </TouchableOpacity>

//             <Link href="/auth/login" style={styles.link}>
//                 Have an account ? Login
//             </Link>
//         </View>
//     );
// };

// export default Register;

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
//     policy: { fontSize: 12, textAlign: "center", marginBottom: 15, color: "#666" },
//     signUpButton: {
//         backgroundColor: "#00CFFF",
//         padding: 14,
//         borderRadius: 25,
//         alignItems: "center",
//     },
//     signUpText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//     link: { marginTop: 15, color: "#0066cc", textAlign: "center" },
// });

import * as Clipboard from "expo-clipboard";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";

// Zod Schema
const registerSchema = z.object({
    emailOrPhone: z
        .string()
        .min(1, "Required")
        .refine(
            (val) => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10}$/.test(val),
            "Invalid email or phone"
        ),
    username: z.string().min(3, "Username must be at least 3 chars"),
    password: z.string().min(6, "Password must be at least 6 chars"),
    otp: z.string().length(4, "OTP must be 4 digits"),
});

const Register = () => {
    const router = useRouter();
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    // Auto-fill OTP from clipboard
    useEffect(() => {
        const interval = setInterval(async () => {
            const text = await Clipboard.getStringAsync();
            if (/^\d{4}$/.test(text)) {
                setOtp(text.split(""));
                clearInterval(interval);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleSendOtp = async () => {
        try {
            // Call backend to send OTP
            const res = await fetch("http://localhost:4000/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailOrPhone }),
            });
            const data = await res.json();
            if (data.success) {
                setOtpSent(true);
                Alert.alert("OTP Sent", "Check your email/phone for the OTP");
            } else {
                Alert.alert("Error", data.message);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to send OTP");
        }
    };

    const handleSignUp = async () => {
        const validation = registerSchema.safeParse({
            emailOrPhone,
            username,
            password,
            otp: otp.join(""),
        });

        if (!validation.success) {
            Alert.alert("Validation Error", validation.error.issues[0].message);
            return;
        }

        try {
            //  Call backend to register
            const res = await fetch("http://localhost:4000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailOrPhone,
                    username,
                    password,
                    otp: otp.join(""),
                }),
            });
            const data = await res.json();
            if (data.success) {
                Alert.alert("Success", "Account created successfully!");
                router.push("/auth/login");
            } else {
                Alert.alert("Error", data.message);
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>AAO NI SA</Text>
            <Text style={styles.subtitle}>Sign up to see Videos from your friends.</Text>

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

            <TextInput
                placeholder="User Name"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                placeholder="Create Password"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Text style={styles.policy}>
                By Sign up, you agree to our Terms, Privacy Policy and Cookies Policy
            </Text>

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>

            <Link href="/auth/login" style={styles.link}>
                Have an account ? Login
            </Link>
        </View>
    );
};

export default Register;

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
    policy: { fontSize: 12, textAlign: "center", marginBottom: 15, color: "#666" },
    signUpButton: {
        backgroundColor: "#00CFFF",
        padding: 14,
        borderRadius: 25,
        alignItems: "center",
    },
    signUpText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    link: { marginTop: 15, color: "#0066cc", textAlign: "center" },
});
