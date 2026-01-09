// // import { useAuthStore } from "@/src/store/useAuthStore";
// // import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// // import {
// //   Stack,
// //   useNavigationContainerRef,
// //   useRouter,
// //   useSegments,
// // } from "expo-router";
// // import React from "react";
// // import { StatusBar } from "react-native";

// // const queryClient = new QueryClient({
// //   defaultOptions: {
// //     queries: { retry: 1, staleTime: 5 * 60 * 1000 }, // 5min cache
// //     mutations: { retry: 1 },
// //   },
// // });

// // export default function RootLayout() {
// //   const router = useRouter();
// //   const segments = useSegments();
// //   const navigationRef = useNavigationContainerRef();

// //   const { token, getToken, setToken } = useAuthStore();
// //   const [loading, setLoading] = React.useState(true);
// //   const [navigated, setNavigated] = React.useState(false);

// //   React.useEffect(() => {
// //     const init = async () => {
// //       const storedToken = await getToken();
// //       if (storedToken) setToken(storedToken);
// //       setLoading(false);
// //     };
// //     init();
// //   }, []); 

// //   React.useEffect(() => {
// //     if (loading || navigated) return;

// //     const inAuth = segments[0] === "auth";

// //     if (!token && !inAuth) {
// //       setNavigated(true);
// //       router.replace("/auth/login");
// //     } else if (token && inAuth) {
// //       setNavigated(true);
// //       router.replace("/(drawer)/(tabs)");
// //       // clear navigation history so back won't go to login
// //       setTimeout(() => {
// //         navigationRef.resetRoot({
// //           index: 0,
// //           routes: [{ name: "/(drawer)/(tabs)" }],
// //         });
// //       }, 300);
// //     } else if (token && !inAuth) {
// //       setNavigated(true);
// //     }
// //   }, [loading, token, segments]);

// //   return (
// //     <>
// //     <QueryClientProvider client={queryClient}>
// //       <StatusBar backgroundColor="#fff" barStyle="dark-content" />
// //       <Stack screenOptions={{ headerShown: false }} />
// //       </QueryClientProvider>
// //     </>
// //   );
// // }
// ==================================================================================

import { useAuthStore } from "@/src/store/useAuthStore";
import { registerForPushNotificationsAsync } from "@/src/utils/notification";
import { requestAllPermissions } from "@/src/utils/requestAllPermissions";
import { createApiUrl } from "@/util";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import {
  Stack,
  useNavigationContainerRef,
  useRouter,
  useSegments,
} from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from 'react-native-toast-message';


/* -------------------------------------------------
   1. TanStack Query Client (Global Cache)
   ------------------------------------------------- */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

/* -------------------------------------------------
   2. Root Layout Component
   ------------------------------------------------- */
export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const navigationRef = useNavigationContainerRef();
  const { token, getToken, setToken } = useAuthStore();

  const [initializing, setInitializing] = React.useState(true);
  const [navigated, setNavigated] = React.useState(false);



  const checkTokenExpiry = async (router: any) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");

      if (!accessToken) {
        console.log("❌ No token found");
        router.replace("/auth/login");
        return;
      }

      const decoded: any = jwtDecode(accessToken);
      const now = Date.now() / 1000;

      // console.log("⏳ Time Left:", decoded.exp - now);

      if (decoded.exp < now) {
        console.log("⛔ Token Expired -> Logging out");
        await AsyncStorage.removeItem("accessToken");
        router.replace("/auth/login");
      }
    } catch (err) {
      await AsyncStorage.removeItem("accessToken");
      router.replace("/auth/login");
    }
  };

  useEffect(() => {
    // ✅ Sirf tab check karo jab user auth pages par nahi hai
    const inAuthGroup = segments[0] === "auth";

    if (inAuthGroup) {
      console.log("🚫 Skipping token check on auth pages");
      return; // Auth pages par token check mat karo
    }

    const interval = setInterval(() => {
      checkTokenExpiry(router);
    }, 20000); // 20 sec

    return () => clearInterval(interval);
  }, [segments]); // ✅ segments ko dependency mein add karo


  useEffect(() => {
    (async () => {
      const perms = await requestAllPermissions();

      if (!perms.hasCamera || !perms.hasMic || !perms.hasMedia) {
        // Alert.alert(
        //   "Permissions Required",
        //   "Please allow camera, microphone and gallery permissions in App Settings."
        // );
        Toast.show({ type: "info", text1: 'Please allow camera, microphone and gallery permissions in App Settings.' })
      }
    })();
  }, []);


  const sendToken = async (pushToken: string) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const apiUrl = createApiUrl("/tokens/create");
    console.log("Calling URL:", apiUrl);
    const { data } = await axios.post(apiUrl, { token: pushToken }, config);
    console.log(data);
  }
  /* -------------------------------------------------
     3. Load token from SecureStore
     ------------------------------------------------- */
  React.useEffect(() => {
    (async () => {
      try {
        const storedToken = await getToken();
        if (storedToken) setToken(storedToken);
      } catch (error) {
        console.warn("Failed to load token:", error);
      } finally {
        setInitializing(false);
      }
    })();
  }, [getToken, setToken]);


  /* -------------------------------------------------
     4. Ask Notification Permission After Login
   ------------------------------------------------- */
  React.useEffect(() => {
    (async () => {
      try {
        const pushToken = await registerForPushNotificationsAsync();
        console.log("========================== PushToken =========================");
        console.log("Expo Push Token:", pushToken);
        console.log("============================================");

        if (pushToken) {
          // Save pushToken to AsyncStorage
          await AsyncStorage.setItem("pushToken", pushToken);
          sendToken(pushToken);
        } else {
          console.log("Push token not received");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    })();
  }, []);

  /* -------------------------------------------------
     5. Auth-aware routing
     ------------------------------------------------- */
  React.useEffect(() => {
    if (initializing || navigated) return;

    const inAuthGroup = segments[0] === "auth";

    if (!token && !inAuthGroup) {
      setNavigated(true);
      router.replace("/auth/login");
      return;
    }

    if (token && inAuthGroup) {
      setNavigated(true);
      router.replace("/(drawer)/(tabs)");

      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigationRef.resetRoot({
            index: 0,
            routes: [{ name: "(drawer)/(tabs)" as never }],
          });
        }
      }, 300);
      return;
    }

    if (token && !inAuthGroup) setNavigated(true);
  }, [initializing, token, segments, navigated, router, navigationRef]);

  /* -------------------------------------------------
     6. Splash Screen
     ------------------------------------------------- */
  if (initializing) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#1d9bf0" />
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      </View>
    );
  }

  /* -------------------------------------------------
     7. Main App Wrapped in GestureHandlerRootView
     ------------------------------------------------- */
  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

/* -------------------------------------------------
   8. Styles
   ------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splash: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
