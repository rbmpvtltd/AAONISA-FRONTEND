import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { Alert } from "react-native";

export const checkTokenExpire = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      return; // No token means user is already in login screen or will be redirected
    }

    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);

    //  TOKEN EXPIRED?
    if (decoded.exp < now) {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");

      router.replace("/auth/login");

      // Alert thoda delay se
      setTimeout(() => {
        Alert.alert("Session Expired", "Please login again.");
      }, 800);
    }
  } catch (err) {
    console.log("Error decoding token:", err);
  }
};

