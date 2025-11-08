import { useAuthStore } from "@/src/store/useAuthStore";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useEffect } from "react";
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
// import { useAppTheme } from "../../src/constants/themeHelper";
import { useAppTheme } from "@/src/constants/themeHelper";
import { updateEmailSendOtp, updatePhoneSendOtp, updateUserEmail, updateUserPhone } from "../../src/api/auth-api";

const changeEmailAndPhoneSchema = z.object({
  email: z
    .string()
    .min(1)
    .refine((val) => /\S+@\S+\.\S+/.test(val), "Invalid email"),
  Phone: z.string()
    .min(10)
    .refine((val) => /^[0-9]{10}$/.test(val), "Invalid Phone No"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const ChangeEmailAndPhone = () => {
  const router = useRouter();
  const theme = useAppTheme();

  const {
    email,
    phone,
    otp,
    emailOtpSent,
    phoneOtpSent,
    verifyingEmail,
    verifyingPhone,
    setEmail,
    setPhone,
    setOtp,
    setEmailOtpSent,
    setPhoneOtpSent,
    setVerifyingEmail,
    setVerifyingPhone,
  } = useAuthStore();

useEffect(() => {
  if (Platform.OS === "web") return;

  const interval = setInterval(async () => {
    const text = await Clipboard.getStringAsync();
    if (/^\d{6}$/.test(text)) {  
      setOtp(text.split(""));
      clearInterval(interval);
    }
  }, 2000);

  return () => clearInterval(interval);
}, []);

   const getOtpString = () => otp.join("");

const handleSendEmailOtp = async () => {
    if (!email) return Alert.alert("Enter email first");
    try {
      const res = await updateEmailSendOtp({ email });
      console.log(res)
      if (res.success) setEmailOtpSent(true);
      Alert.alert(res.message || "OTP sent to email");
    } catch (err: any) {
      Alert.alert(err.response?.data?.message || "Error sending OTP");
    }
  };

    const handleVerifyEmailOtp = async () => {
    const otpValue = getOtpString();
    if (otpValue.length !== 6) return Alert.alert("Enter 6 digit OTP");
    setVerifyingEmail(true);
    try {
      const res = await updateUserEmail({ email, otp: otpValue });
      if (res.success) {
        Alert.alert(res.message || "Email updated successfully");
        setEmailOtpSent(false);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (err: any) {
      Alert.alert(err.response?.data?.message || "OTP verification failed");
    }
    setVerifyingEmail(false);
  };
const handleSendPhoneOtp = async () => {
    if (!phone) return Alert.alert("Enter phone first");
    try {
      const res = await updatePhoneSendOtp({ phone: phone });
      if (res.success) setPhoneOtpSent(true);
      Alert.alert(res.message || "OTP sent to phone");
    } catch (err: any) {
      Alert.alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  const handleVerifyPhoneOtp = async () => {
    const otpValue = getOtpString();
    if (otpValue.length !== 6) return Alert.alert("Enter 6 digit OTP");
    setVerifyingPhone(true);
    try {
      const res = await updateUserPhone({ phone: phone, otp: otpValue });
      if (res.success) {
        Alert.alert(res.message || "Phone updated successfully");
        setPhoneOtpSent(false);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (err: any) {
      Alert.alert(err.response?.data?.message || "OTP verification failed");
    }
    setVerifyingPhone(false);
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
          Change Email and Phone
        </Text>

        {/* Email input */}
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={theme.placeholder}
          value={email}
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          onChangeText={setEmail}
        />

        {/* OTP for email */}
        {emailOtpSent && (
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                maxLength={1}
                keyboardType="numeric"
                style={[styles.otpInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
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

        <TouchableOpacity
          style={[styles.verifyButton, { backgroundColor: theme.buttonBg }]}
          onPress={emailOtpSent ? handleVerifyEmailOtp : handleSendEmailOtp}
        >
          <Text style={[styles.verifyText, { color: theme.buttonText }]}>
            {emailOtpSent ? (verifyingEmail ? "Verifying..." : "Verify OTP") : "Send OTP"}
          </Text>
        </TouchableOpacity>

        {/* Phone input */}
        <TextInput
          placeholder="Enter your Phone Number"
          placeholderTextColor={theme.placeholder}
          value={phone}
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          onChangeText={setPhone}
        />

        {/* OTP for phone */}
        {phoneOtpSent && (
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                maxLength={1}
                keyboardType="numeric"
                style={[styles.otpInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
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

        <TouchableOpacity
          style={[styles.verifyButton, { backgroundColor: theme.buttonBg }]}
          onPress={phoneOtpSent ? handleVerifyPhoneOtp : handleSendPhoneOtp}
        >
          <Text style={[styles.verifyText, { color: theme.buttonText }]}>
            {phoneOtpSent ? (verifyingPhone ? "Verifying..." : "Verify OTP") : "Send OTP"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangeEmailAndPhone;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  logo: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  otpRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 12 },
  otpInput: { borderWidth: 1, borderRadius: 8, padding: 12, textAlign: "center", width: 50 },
  verifyButton: { padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  verifyText: { fontWeight: "bold" },
});


