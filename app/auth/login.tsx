import { useAppTheme } from "@/src/constants/themeHelper";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useFollowStore } from "@/src/store/useFollowerFollowingStore";
import { Notification, useNotificationStore } from '@/src/store/useNotificationStore';
import { useProfileStore } from "@/src/store/userProfileStore";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { getUserInfoAndFollowState, getUserNotifications, loginUser } from "../../src/api/auth-api";

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
  const [showPassword, setShowPassword] = useState(false);


  const {
    emailOrPhone,
    password,
    setEmailOrPhone,
    setPassword,
    saveToken,
    resetAuth
  } = useAuthStore();
  const {
     setUsername, setBio, setName, setProfilePicture, setViews, setLikes,setFollowersCount,setPostCount, setFollowingsCount,setUrl, resetProfile,setVideos
  } = useProfileStore();
  const {setFollowers, setFollowings, resetFollow} = useFollowStore();
  useEffect(() => {
    return () => {
      resetAuth?.();
      resetProfile?.();
      resetFollow?.()
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
      if (data.message === "Login successful") {
        if (data.accessToken) {
          await saveToken(data.accessToken);
        }
        Alert.alert("Success", "Logged in successfully!");
        await resetAuth();
        router.replace("/(drawer)/(tabs)");
        const userData = await getUserInfoAndFollowState();
        setUsername(userData.userInfo.username);
        setName(userData.userProfileInfo.name);
        setBio(userData.userProfileInfo.bio);
        setProfilePicture(userData.userProfileInfo.ProfilePicture);
        setViews(userData.userInfo.views.length);
        setLikes(userData.userInfo.likes.length);
        setFollowersCount(userData.followers.length)
        setFollowingsCount(userData.followings.length)
        setUrl(userData.userProfileInfo.url);
        setPostCount(userData.userInfo.videos.length);
        console.log("Post count:", userData.userInfo.videos);
        setVideos(userData.userInfo.videos);
        // console.log("===============================",setVideos)
        setFollowers(userData.followers);
        setFollowings(userData.followings);

        const notifications: Notification[]  = await getUserNotifications();
        const addNotification = useNotificationStore.getState().addNotification;
        notifications.forEach((notification: Notification) => {
          addNotification(notification);
        });
        console.log("Notifications:", notifications);
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
        <Text style={[styles.logo, { color: theme.text }]}>HitHoy</Text>
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
          onChangeText={(text) => setEmailOrPhone(text.trim().toLocaleLowerCase())}
        />

        {/* <TextInput
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
        /> */}

        <View style={{ position: "relative" }}>
  <TextInput
    placeholder="Password"
    placeholderTextColor={theme.placeholder}
    style={[
      styles.input,
      {
        backgroundColor: theme.inputBg,
        borderColor: theme.inputBorder,
        color: theme.text,
        paddingRight: 45, // space for eye icon
      },
    ]}
    secureTextEntry={!showPassword} // <-- eye toggle
    value={password}
    onChangeText={setPassword}
  />

  {/* Eye Icon Button */}
  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: 12,
      top: 15,
    }}
  >
   <Ionicons 
  name={showPassword ? "eye-off" : "eye"} 
  size={22} 
  color={theme.placeholder} 
/>
  </TouchableOpacity>
</View>


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
        {/* <TouchableOpacity style={[styles.googleButton, { backgroundColor: theme.googleBg }]}>
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

