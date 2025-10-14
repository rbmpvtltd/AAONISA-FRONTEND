import { useAuthStore } from "@/src/store/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
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
import { useAppTheme } from "../../src/constants/themeHelper";
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

const ForgotPassword = () => {
  const router = useRouter();
  const theme = useAppTheme();

  const {
    emailOrPhone,
    otp,
    newPassword,
    otpSent,
    token,
    setEmailOrPhone,
    setOtp,
    setNewPassword,
    setOtpSent,
    setToken,
     resetAuth
  } = useAuthStore();

  // Clipboard auto detect OTP
  useEffect(() => {
    if (Platform.OS === "web") return;

    const interval = setInterval(async () => {
      const text = await Clipboard.getStringAsync();
      if (/^\d{6}$/.test(text)) {
        setOtp(text.split(""));
        clearInterval(interval);
      }
    }, 2000);
    return () => { clearInterval(interval);
      resetAuth();
    };
  }, []);

  
const handleSendOtp = async () => {
  const validation = forgotSchema.pick({ emailOrPhone: true }).safeParse({ emailOrPhone });
  if (!validation.success) {
    Alert.alert("Validation Error", validation.error.issues[0].message);
    return;
  }

    try {
      const data = await forgetPassword({ emailOrPhone });
      if (data.success) {
        setOtpSent(true);
        Alert.alert("OTP Sent", "Check your email/phone for the OTP");
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP");
    }
  };

  const verifyOtpHandler = async () => {
  const validation = forgotSchema.pick({ emailOrPhone: true, otp: true }).safeParse({
    emailOrPhone,
    otp: otp.join(""),
  });
  if (!validation.success) {
    Alert.alert("Validation Error", validation.error.issues[0].message);
    return;
  }

    try {
      const data = await sendOtp({ emailOrPhone, code: otp.join("") });
      if (data.success) {
        setToken(data.token);
        // save to localStorage / AsyncStorage
        if (Platform.OS === "web") localStorage.setItem("authToken", data.token);
        else await AsyncStorage.setItem("authToken", data.token);

        Alert.alert(
          "OTP Verified",
          `Token saved to ${Platform.OS === "web" ? "localStorage" : "AsyncStorage"}!`
        );
      } else {
        Alert.alert("Error", data.message || "Invalid OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify OTP");
    }
  };

  const handleResetPassword = async () => {
  const validation = forgotSchema.pick({ newPassword: true }).safeParse({ newPassword });
  if (!validation.success) {
    Alert.alert("Validation Error", validation.error.issues[0].message);
    return;
  }

    try {
      let storedToken = token;
      if (!storedToken) {
        if (Platform.OS === "web") storedToken = localStorage.getItem("authToken") || "";
        else storedToken = (await AsyncStorage.getItem("authToken")) || "";
      }

      if (!storedToken) {
        Alert.alert("Error", "No token found. Please verify OTP first.");
        return;
      }

      const data = await resetPassword({ emailOrPhone, token: storedToken, newPassword });
      if (data.success) {
        Alert.alert("Success", "Password reset successfully!");
        await resetAuth()
        // remove token
        if (Platform.OS === "web") localStorage.removeItem("authToken");
        else await AsyncStorage.removeItem("authToken");
        setToken("");
        router.push("/auth/login");
      } else {
        Alert.alert("Error", data.message || "Failed to reset password");
      }
    } catch (error) {
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
          Reset your password using OTP
        </Text>

        <TextInput
          placeholder="Phone Number or Email Address"
          placeholderTextColor={theme.placeholder}
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
        />

        {otpSent && (
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={[styles.otpInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
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
        )}

        <TouchableOpacity style={[styles.verifyButton, { backgroundColor: theme.buttonBg }]} onPress={handleSendOtp}>
          <Text style={[styles.verifyText, { color: theme.buttonText }]}>{otpSent ? "Resend OTP" : "Send OTP"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.verifyButton, { backgroundColor: theme.buttonBg }]} onPress={verifyOtpHandler}>
          <Text style={[styles.verifyText, { color: theme.buttonText }]}>Verify OTP</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Enter New Password"
          placeholderTextColor={theme.placeholder}
          secureTextEntry
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TouchableOpacity style={[styles.signUpButton, { backgroundColor: theme.buttonBg }]} onPress={handleResetPassword}>
          <Text style={[styles.signUpText, { color: theme.buttonText }]}>Reset Password</Text>
        </TouchableOpacity>

        <Link href="/auth/login" style={[styles.link, { color: theme.link }]}>Back to Login</Link>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

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
  otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  otpInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlign: "center",
    width: 50,
  },
  verifyButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  verifyText: { fontWeight: "bold" },
  signUpButton: {
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  signUpText: { fontSize: 16, fontWeight: "bold" },
  link: { marginTop: 15, textAlign: "center" },
});


