
import * as Clipboard from "expo-clipboard";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { forgetPassword, resetPassword } from "./api";

// Zod Schema
const forgotSchema = z.object({
    emailOrPhone: z
        .string()
        .min(1, "Required")
        .refine(
            (val) => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10}$/.test(val),
            "Invalid email or phone"
        ),
    otp: z.string().length(4, "OTP must be 4 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 chars"),
});

const ForgotPassword = () => {
    const router = useRouter();
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
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
            const data = await forgetPassword({ emailOrPhone });
            console.log(data);
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

    const handleResetPassword = async () => {
        const validation = forgotSchema.safeParse({
            emailOrPhone,
            otp: otp.join(""),
            newPassword,
        });

        if (!validation.success) {
            Alert.alert("Validation Error", validation.error.issues[0].message);
            return;
        }

        try {
            const data = await resetPassword({
                emailOrPhone,
                otp: otp.join(""),
                newPassword,
            });
            if (data.success) {
                Alert.alert("Success", "Password reset successfully!");
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
