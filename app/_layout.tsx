// import { useAuthStore } from "@/src/store/useAuthStore";
// import { Stack, useRouter, useSegments } from "expo-router";
// import React from "react";
// import { StatusBar } from "react-native";

// export default function RootLayout() {
//   const router = useRouter();
//   const segments = useSegments();
//   const { token, getToken, setToken } = useAuthStore();
//   const [loading, setLoading] = React.useState(true);
//   const [navigated, setNavigated] = React.useState(false); 

//   // 🔹 Step 1: Load token on app start
//   React.useEffect(() => {
//     const init = async () => {
//       const storedToken = await getToken();
//       if (storedToken) {
//         setToken(storedToken);
//       }
//       setLoading(false);
//     };
//     init();
//   }, []);

//   // 🔹 Step 2: Handle navigation only once
//   React.useEffect(() => {
//     if (loading || navigated) return;

//     const inAuth = segments[0] === "auth";

//     if (!token && !inAuth) {
//       setNavigated(true);
//       router.replace("/auth/login");
//     } else if (token && inAuth) {
//       setNavigated(true);
//       router.replace("/(drawer)/(tabs)");
//     } else if (token && !inAuth) {
//       setNavigated(true); // already logged in and on valid page
//     }
//   }, [loading, token, segments]);

//   return (
//   <>
// <StatusBar  backgroundColor="#fff" />
//   <Stack screenOptions={{ headerShown: false }} />
// </>
//   );
// }

import { useAuthStore } from "@/src/store/useAuthStore";
import { registerForPushNotificationsAsync } from "@/src/utils/notification";
import {
  Stack,
  useNavigationContainerRef,
  useRouter,
  useSegments,
} from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const navigationRef = useNavigationContainerRef();

  const { token, getToken, setToken } = useAuthStore();
  const [loading, setLoading] = React.useState(true);
  const [navigated, setNavigated] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      const storedToken = await getToken();
      if (storedToken) setToken(storedToken);
      setLoading(false);
    };
    init();
  }, []);

  React.useEffect(() => {
    if (loading || navigated) return;

    const inAuth = segments[0] === "auth";

    if (!token && !inAuth) {
      setNavigated(true);
      router.replace("/auth/login");
    } else if (token && inAuth) {
      setNavigated(true);
      router.replace("/(drawer)/(tabs)");
      // clear navigation history so back won't go to login
      setTimeout(() => {
        navigationRef.resetRoot({
          index: 0,
          routes: [{ name: "/(drawer)/(tabs)" }],
        });
      }, 300);
    } else if (token && !inAuth) {
      setNavigated(true);
    }
  }, [loading, token, segments]);

React.useEffect(() => {
    if (token) {
      registerForPushNotificationsAsync()
        .then((pushToken) => {
          if (pushToken) {
            console.log("Expo Push Token:", pushToken);
          }
        })
        .catch((err) => console.log("Notification error:", err));
    }
  }, [token]);

  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
