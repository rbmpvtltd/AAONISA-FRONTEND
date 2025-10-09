// import { Ionicons } from "@expo/vector-icons";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Tabs } from "expo-router";
// import * as React from "react";
// export default function RootLayout() {
//   const Tab = createBottomTabNavigator();
//   return (
//     // <Stack />
//     // <Stack>
//     //   <Stack.Screen name="index" options={{ headerShown: false }} />
//     //   <Stack.Screen name="about" />
//     // </Stack>

//     // <Tab.Navigator>
//     //   <Tab.Screen name="Home" component={ProfileScreen} />
//     // </Tab.Navigator>

//     // <Tabs>
//     //   <Tabs.Screen options={{
//     //     title: "Home", tabBarIcon: ({ color, size }) => (
//     //       <Ionicons name="home-outline" size={size} color={color} />
//     //     ),
//     //   }} />
//     // </Tabs>

//     // <NavigationContainer>
//     //   <Tab.Navigator>
//     //     <Tab.Screen name="Home" component={HomePage} />
//     //   </Tab.Navigator>
//     // </ NavigationContainer>
//     <Tabs>
//       {/* Home Tab */}
//       <Tabs.Screen
//         name="index"
//         options={{
//           // tabBarShowLabel: false,
//           headerShown: false,
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="add-circle-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="auth/login.tsx"
//         options={{
//           title: "Home",
//           tabBarItemStyle: {
//             display: "none"
//           },
//           headerShown: false,
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="add-circle-outline" size={size} color={color} />
//           ),
//         }}
//       />

//       {/* Profile Tab */}
//       {/* <Tabs.Screen
//         name="hi"
//         options={{
//           title: "hi",
//           headerShown: false,
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person-circle-outline" size={size} color={color} />
//           ),
//         }}
//       /> */}
//     </Tabs>
//   )
// }


// import { useAuthStore } from "@/src/store/useAuthStore";
// import { Stack, useRouter, useSegments } from "expo-router";
// import React from "react";

// export default function RootLayout() {
//   const router = useRouter();
//   const segments = useSegments();
//   const { token, getToken, setToken } = useAuthStore();
//   const [loading, setLoading] = React.useState(true);

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

//   React.useEffect(() => {
//     if (!loading) {
//       const inAuth = segments[0] === "auth";

//       if (!token && !inAuth) {
//         router.navigate("/auth/login");
//       }

//       if (token && inAuth) {
//         router.navigate("/(tabs)");
//       }
//     }
//   }, [loading, token, segments]);

//   return <Stack screenOptions={{ headerShown: false }} />;
// }

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
      router.navigate("/(tabs)");
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
