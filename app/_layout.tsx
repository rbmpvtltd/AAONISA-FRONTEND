import { useAuthStore } from "@/src/store/useAuthStore";
import { Stack, useRouter, useSegments } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { token, getToken, setToken } = useAuthStore();
  const [loading, setLoading] = React.useState(true);
  const [navigated, setNavigated] = React.useState(false); 

  // 🔹 Step 1: Load token on app start
  React.useEffect(() => {
    const init = async () => {
      const storedToken = await getToken();
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false);
    };
    init();
  }, []);

  // 🔹 Step 2: Handle navigation only once
  React.useEffect(() => {
    if (loading || navigated) return;

    const inAuth = segments[0] === "auth";

    if (!token && !inAuth) {
      setNavigated(true);
      router.navigate("/auth/login");
    } else if (token && inAuth) {
      setNavigated(true);
      router.navigate("/(drawer)/(tabs)");
    } else if (token && !inAuth) {
      setNavigated(true); // already logged in and on valid page
    }
  }, [loading, token, segments]);

  return (
  <>
<StatusBar  backgroundColor="#fff" />
  <Stack screenOptions={{ headerShown: false }} />
</>
  );
}

