// // // import { useAuthStore } from "@/src/store/useAuthStore";
// // // import { Stack, useRouter, useSegments } from "expo-router";
// // // import React from "react";
// // // import { StatusBar } from "react-native";

// // // export default function RootLayout() {
// // //   const router = useRouter();
// // //   const segments = useSegments();
// // //   const { token, getToken, setToken } = useAuthStore();
// // //   const [loading, setLoading] = React.useState(true);
// // //   const [navigated, setNavigated] = React.useState(false); 

// // //   // 🔹 Step 1: Load token on app start
// // //   React.useEffect(() => {
// // //     const init = async () => {
// // //       const storedToken = await getToken();
// // //       if (storedToken) {
// // //         setToken(storedToken);
// // //       }
// // //       setLoading(false);
// // //     };
// // //     init();
// // //   }, []);

// // //   // 🔹 Step 2: Handle navigation only once
// // //   React.useEffect(() => {
// // //     if (loading || navigated) return;

// // //     const inAuth = segments[0] === "auth";

// // //     if (!token && !inAuth) {
// // //       setNavigated(true);
// // //       router.replace("/auth/login");
// // //     } else if (token && inAuth) {
// // //       setNavigated(true);
// // //       router.replace("/(drawer)/(tabs)");
// // //     } else if (token && !inAuth) {
// // //       setNavigated(true); // already logged in and on valid page
// // //     }
// // //   }, [loading, token, segments]);

// // //   return (
// // //   <>
// // // <StatusBar  backgroundColor="#fff" />
// // //   <Stack screenOptions={{ headerShown: false }} />
// // // </>
// // //   );
// // // }

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


// // app/_layout.tsx
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import {
//   Stack,
//   useNavigationContainerRef,
//   useRouter,
//   useSegments,
// } from "expo-router";
// import React from "react";
// import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";

// import { useAuthStore } from "@/src/store/useAuthStore";

// /* -------------------------------------------------
//    1. TanStack Query Client (Global Cache)
//    ------------------------------------------------- */
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       staleTime: 5 * 60 * 1000,     // 5 min — data fresh
//       gcTime: 10 * 60 * 1000,       // REPLACE cacheTime with gcTime
//       refetchOnMount: false,
//       refetchOnWindowFocus: false,
//     },
//     mutations: {
//       retry: 1,
//     },
//   },
// });

// /* -------------------------------------------------
//    2. Root Layout Component
//    ------------------------------------------------- */
// export default function RootLayout() {
//   const router = useRouter();
//   const segments = useSegments();
//   const navigationRef = useNavigationContainerRef();

//   const { token, getToken, setToken } = useAuthStore();

//   // UI State
//   const [initializing, setInitializing] = React.useState(true);
//   const [navigated, setNavigated] = React.useState(false);

//   /* -------------------------------------------------
//      3. Load token from SecureStore on first mount
//      ------------------------------------------------- */
//   React.useEffect(() => {
//     (async () => {
//       try {
//         const storedToken = await getToken();
//         if (storedToken) {
//           setToken(storedToken);
//         }
//       } catch (error) {
//         console.warn("Failed to load token:", error);
//       } finally {
//         setInitializing(false);
//       }
//     })();
//   }, [getToken, setToken]);

//   /* -------------------------------------------------
//      4. Auth-aware routing (after token loaded)
//      ------------------------------------------------- */
//   React.useEffect(() => {
//     if (initializing || navigated) return;

//     const inAuthGroup = segments[0] === "auth";

//     // CASE 1: No token → Force login
//     if (!token && !inAuthGroup) {
//       setNavigated(true);
//       router.replace("/auth/login");
//       return;
//     }

//     // CASE 2: Token exists but still in auth → Go home
//     if (token && inAuthGroup) {
//       setNavigated(true);
//       router.replace("/(drawer)/(tabs)");

//       // Reset stack so back button can't go to login
//       setTimeout(() => {
//         if (navigationRef.isReady()) {
//           navigationRef.resetRoot({
//             index: 0,
//             routes: [{ name: "(drawer)/(tabs)" as never }],
//           });
//         }
//       }, 300);
//       return;
//     }

//     // CASE 3: Token + not in auth → All good
//     if (token && !inAuthGroup) {
//       setNavigated(true);
//     }
//   }, [initializing, token, segments, navigated, router, navigationRef]);

//   /* -------------------------------------------------
//      5. Render: Splash → App
//      ------------------------------------------------- */
//   if (initializing) {
//     return (
//       <View style={styles.splash}>
//         <ActivityIndicator size="large" color="#1d9bf0" />
//         <StatusBar barStyle="dark-content" backgroundColor="#fff" />
//       </View>
//     );
//   }

//   return (
//     <QueryClientProvider client={queryClient}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
//       <Stack screenOptions={{ headerShown: false }} />
//     </QueryClientProvider>
//   );
// }

// /* -------------------------------------------------
//    6. Splash Screen Styles
//    ------------------------------------------------- */
// const styles = StyleSheet.create({
//   splash: {
//     flex: 1,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });


// app/_layout.tsx
import { useAuthStore } from "@/src/store/useAuthStore";
import { registerForPushNotificationsAsync } from "@/src/utils/notification";
import {
  Stack,
  useNavigationContainerRef,
  useRouter,
  useSegments,
} from "expo-router";
import React from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

/* -------------------------------------------------
   1. TanStack Query Client (Global Cache)
   ------------------------------------------------- */
const queryClient = new QueryClient({
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
     4. Auth-aware routing
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
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

/* -------------------------------------------------
   7. Styles
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
