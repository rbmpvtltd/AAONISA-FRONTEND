import { useAppTheme } from "@/src/constants/themeHelper";
import { useAuthStore } from "@/src/store/useAuthStore";
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

  const handleSendOtp = async () => {
    try {
      const data = await registerUser({ emailOrPhone, username });
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
      const data = await verifyOtpRegisterUser({
        emailOrPhone,
        username,
        password,
        otp: otp.join(""),
      });
      if (data.success) {
        Alert.alert("Success", "Account created successfully!");
        await resetAuth();
        router.push("/auth/login");
      } else {
        Alert.alert("Error", data.message);
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
        <Text style={[styles.logo, { color: theme.text }]}>HitHoy</Text>
        <Text style={[styles.subtitle, { color: theme.subtitle }]}>
          Sign up to see Videos from your friends.
        </Text>

        <TextInput
          placeholder="Phone Number or Email Address"
          placeholderTextColor={theme.placeholder}
          style={[
            styles.input,
            { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text },
          ]}
          value={emailOrPhone}
          onChangeText={(text) => setEmailOrPhone(text.trim().toLocaleLowerCase())}
        />

        {otpSent ? (
          // <View style={styles.otpContainer}>
          //   {otp.map((digit, index) => (
          //     <TextInput
          //       key={index}
          //       style={[
          //         styles.otpInput,
          //         { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text },
          //       ]}
          //       maxLength={1}
          //       keyboardType="numeric"
          //       value={digit}
          //       onChangeText={(text) => {
          //         const newOtp = [...otp];
          //         newOtp[index] = text;
          //         setOtp(newOtp);
          //       }}
          //     />
          //   ))}
          // </View>


          // inside your render
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                // typed callback ref — this removes the TS error
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

                  // Next box auto focus
                  if (text.length === 1 && index < otp.length - 1) {
                    otpRefs.current[index + 1]?.focus();
                  }
                }}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    const newOtp = [...otp];
                    // if current box is empty, move to previous and clear it
                    if (!digit && index > 0) {
                      otpRefs.current[index - 1]?.focus();
                      newOtp[index - 1] = "";
                    } else {
                      // clear current
                      newOtp[index] = "";
                    }
                    setOtp(newOtp);
                  }
                }}
                // helpful props
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
          onChangeText={(text) => setUsername(text.trim().toLocaleLowerCase())}
        />

        <TextInput
          placeholder="Create Password"
          placeholderTextColor={theme.placeholder}
          style={[
            styles.input,
            { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text },
          ]}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={[styles.policy, { color: theme.subtitle }]}>
          By Sign up, you agree to our Terms, Privacy Policy and Cookies Policy
        </Text>

        <TouchableOpacity style={[styles.signUpButton, { backgroundColor: theme.buttonBg }]} onPress={handleSignUp}>
          <Text style={[styles.signUpText, { color: theme.buttonText }]}>Sign Up</Text>
        </TouchableOpacity>

        <Link href="/auth/login" style={[styles.link, { color: theme.link }]}>
          Have an account ? Login
        </Link>
      </View>
    </KeyboardAvoidingView>
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
  policy: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 15,
  },
  signUpButton: {
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  signUpText: { fontSize: 16, fontWeight: "bold" },
  link: { marginTop: 15, textAlign: "center" },
});

