import { useAppTheme } from "@/src/constants/themeHelper";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Link, useRouter } from "expo-router";
import React, { useEffect } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { registerUser, verifyOtpRegisterUser } from "../../src/api/auth-api";

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
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const Register = () => {
  const router = useRouter();
  const theme = useAppTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [usernameAvailable, setUsernameAvailable] = React.useState(null);

  const {
    emailOrPhone,
    username,
    password,
    otp,
    otpSent,
    setEmailOrPhone,
    setUsername,
    setPassword,
    setOtp,
    setOtpSent,
    resetAuth
  } = useAuthStore();


  // declare refs (same file where TextInput is imported from 'react-native')
  const otpRefs = React.useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const interval = setInterval(async () => {
      const text = await Clipboard.getStringAsync();
      if (/^\d{6}$/.test(text)) {
        setOtp(text.split(""));
        clearInterval(interval);
      }
    }, 2000);
    return () => {
      clearInterval(interval);
      resetAuth();
    };
  }, []);


  // const handleUsernameChange = async (text: string) => {
  //   const value = text.trim().toLowerCase();
  //   setUsername(value); // <-- Ye store me username set karega

  //   if (!value || value.length < 3) {
  //     setUsernameAvailable(null);
  //     return;
  //   }

  //   const res = await checkUsername(value);
  //   console.log('====================================');
  //   console.log('res', res);
  //   console.log('====================================');// <-- API call
  //   setUsernameAvailable(res.available);
  // };

  const handleSendOtp = async () => {
    try {
      const data = await registerUser({ emailOrPhone, username });
      if (data.success) {
        setOtpSent(true);
        // Alert.alert("OTP Sent", "Check your email/phone for the OTP");
        Toast.show({ type: "success", text1: "OTP Sent", text2: "Check your email/phone for the OTP" })
      } else {
        // Alert.alert("Error", data.message);
        Toast.show({ type: "error", text1: "Error", text2: data.message });
      }
    } catch (error) {
      // Alert.alert("Error", "invalid OTP");
      Toast.show({ type: "error", text1: "Error", text2: "invalid OTP" })
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
      // Alert.alert("Validation Error", validation.error.issues[0].message);
      Toast.show({ type: "error", text1: "Validation Error", text2: validation.error.issues[0].message });
      return;
    }

    try {
      const data = await verifyOtpRegisterUser({
        emailOrPhone,
        username,
        password,
        otp: otp.join(""),
      });
      if (data.success) {
        // Alert.alert("Success", "Account created successfully!");
        Toast.show({ type: "success", text1: "Success", text2: "Account created successfully!" });
        await resetAuth();
        router.push("/auth/login");
      } else {
        // Alert.alert("Error", data.message);
        Toast.show({ type: "error", text1: "Error", text2: data.message });
      }
    } catch (error) {
      // Alert.alert("Error", "Signup is unscessful please check your details");
      Toast.show({ type: "error", text1: "Error", text2: "Signup is unscessful please check your details" });
    }
  };

  // FIX: Email/Phone input handler
  const handleEmailPhoneChange = (text: string) => {
    const cleanText = text.toLowerCase().replace(/\s+/g, '');
    setEmailOrPhone(cleanText);
  };

  // FIX: Username input handler
  const handleUsernameChange = (text: string) => {
    const cleanText = text.toLowerCase().replace(/\s+/g, '');
    setUsername(cleanText);
  };

  // FIX: Password input handler
  const handlePasswordChange = (text: string) => {
    const cleanText = text.replace(/\s+/g, '');
    setPassword(cleanText);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.logo, { color: theme.text }]}>HitHoy</Text>
          <Text style={[styles.subtitle, { color: theme.subtitle }]}>
            Express without limits
          </Text>

          <TextInput
            placeholder="Phone Number or Email Address"
            placeholderTextColor={theme.placeholder}
            style={[
              styles.input,
              { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text },
            ]}
            value={emailOrPhone}
            // onChangeText={(text) => setEmailOrPhone(text.trim().toLocaleLowerCase().replace(/\s+/g, ''))}
            onChangeText={handleEmailPhoneChange} // CHANGED
            autoCapitalize="none" // ADD
            autoCorrect={false} // ADD
          />

          {otpSent ? (
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(r: TextInput | null) => {
                    otpRefs.current[index] = r;
                  }}
                  style={[
                    styles.otpInput,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                      color: theme.text,
                    },
                  ]}
                  maxLength={1}
                  keyboardType="numeric"
                  value={digit}
                  onChangeText={(text) => {
                    const newOtp = [...otp];
                    newOtp[index] = text;
                    setOtp(newOtp);

                    if (text.length === 1 && index < otp.length - 1) {
                      otpRefs.current[index + 1]?.focus();
                    }
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace") {
                      const newOtp = [...otp];
                      if (!digit && index > 0) {
                        otpRefs.current[index - 1]?.focus();
                        newOtp[index - 1] = "";
                      } else {
                        newOtp[index] = "";
                      }
                      setOtp(newOtp);
                    }
                  }}
                  textContentType="oneTimeCode"
                  selectTextOnFocus
                />
              ))}
            </View>
          ) : null}

          <TouchableOpacity style={[styles.verifyButton, { backgroundColor: theme.buttonBg }]} onPress={handleSendOtp}>
            <Text style={[styles.verifyText, { color: theme.buttonText }]}>
              {otpSent ? "Resend OTP" : "Send OTP"}
            </Text>
          </TouchableOpacity>

          <TextInput
            placeholder="User Name"
            placeholderTextColor={theme.placeholder}
            style={[
              styles.input,
              { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text },
            ]}
            value={username}
            // onChangeText={(text) => setUsername(text.toLocaleLowerCase().replace(/\s+/g, '').trim())}
            onChangeText={handleUsernameChange} // CHANGED
            autoCapitalize="none" // ADD
            autoCorrect={false} // ADD

          />
          <View style={{ position: "relative" }}>
            <TextInput
              placeholder="Create Password"
              placeholderTextColor={theme.placeholder}
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.text,
                  paddingRight: 45,
                },
              ]}
              secureTextEntry={!showPassword}
              value={password}
              // onChangeText={(text) => setPassword(text.trim().replace(/\s+/g, ''))}
              onChangeText={handlePasswordChange} // CHANGED
              autoCapitalize="none" // ADD
              autoCorrect={false} // ADD
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: 18,
              }}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color={theme.placeholder}
              />
            </TouchableOpacity>
          </View>


          {/* <Text style={[styles.policy, { color: theme.subtitle }]}>
            By Sign up, you agree to our Terms, Privacy Policy and Cookies Policy
          </Text> */}


          {/*  Terms & Privacy Checkbox */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, {
                backgroundColor: acceptTerms ? theme.buttonBg : "transparent",
                borderColor: acceptTerms ? theme.buttonBg : theme.inputBorder,
              }]}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              {acceptTerms && <Ionicons name="checkmark" size={18} color="#fff" />}
            </TouchableOpacity>
            <Text style={[styles.policy, { color: theme.subtitle }]}>
              I agree to{" "}
              <Text
                style={{ color: theme.link }}
                onPress={() => router.push("/terms-&-conditions")}
              >
                Terms
              </Text>{" "}
              &{" "}
              <Text
                style={{ color: theme.link }}
                onPress={() => router.push("/privecy-policy")}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.signUpButton,
              { backgroundColor: acceptTerms ? theme.buttonBg : "#00d0ff76" },
            ]}
            onPress={handleSignUp}
            disabled={!acceptTerms}
          >


            {/* <TouchableOpacity style={[styles.signUpButton, { backgroundColor: theme.buttonBg }]} onPress={handleSignUp}> */}
            <Text style={[styles.signUpText, { color: theme.buttonText }]}>Sign Up</Text>
          </TouchableOpacity>

          <Link href="/auth/login" style={[styles.link, { color: theme.link }]}>
            Have an account ? Login
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
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
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  policy: { fontSize: 12, flex: 1, flexWrap: "wrap" },
  signUpButton: {
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  signUpText: { fontSize: 16, fontWeight: "bold" },
  link: { marginTop: 15, textAlign: "center" },
});

