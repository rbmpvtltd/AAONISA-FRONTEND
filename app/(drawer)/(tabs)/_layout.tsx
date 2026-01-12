// import { useAppTheme } from "@/src/constants/themeHelper";
// import { Ionicons } from "@expo/vector-icons";
// import { Tabs, useNavigation, useRouter } from "expo-router";
// import { Image, StatusBar, TouchableOpacity, View } from "react-native";

// export default function TabsLayout() {
//   const router = useRouter();
//   const theme = useAppTheme();
//   const navigation = useNavigation();

//   return (
//     <>
//       <StatusBar
//         hidden={false}
//         barStyle={theme.background === "#000" ? "light-content" : "dark-content"}
//         backgroundColor={theme.background}
//       />

//       {/* <Tabs
//         screenOptions={{
//           tabBarShowLabel: false,
//           headerShown: true,
//           headerStyle: { backgroundColor: theme.background },
//           headerTitleStyle: { color: theme.text },
//         }}
//       > */}


//       <Tabs
//         screenOptions={({ route }) => ({
//           tabBarShowLabel: false,
//           headerShown: true,
//           headerStyle: { backgroundColor: theme.background },
//           headerTitleStyle: { color: theme.text },
//           tabBarStyle: { backgroundColor: theme.background },

//           tabBarActiveTintColor: theme.text,
//           tabBarInactiveTintColor: theme.subtitle,

//           tabBarIcon: ({ focused, color, size }) => {
//             let iconName: string = "home-outline";
//             if (route.name === "index") iconName = focused ? "home" : "home-outline";
//             else if (route.name === "search") iconName = focused ? "search" : "search-outline";
//             else if (route.name === "createReels") iconName = focused ? "add-circle" : "add-circle-outline";
//             else if (route.name === "reels") iconName = focused ? "play-circle" : "play-circle-outline";
//             else if (route.name === "profile") iconName = focused ? "person" : "person-outline";

//             return <Ionicons name={iconName as any} size={size} color={focused ? theme.text : theme.subtitle} />;
//           },
//         })}
//       >

//         {/*  Home */}
//         <Tabs.Screen
//           name="index"
//           options={{
//             headerShown: true,
//             // headerTitle: "Aao Ni Sa",
//             headerLeft: () => (
//               <Image
//                 source={require("@/assets/images/name-hithoye.png")}
//                 style={{ width: 100, height: 110, marginLeft: 10, }}
//                 resizeMode="contain"
//               />
//             ),
//             headerTitle: "",
//             headerTitleStyle: {
//               fontWeight: "700",
//               fontSize: 20,
//               color: theme.text,
//             },
//             headerRight: () => (
//               <View style={{ flexDirection: "row", gap: 20, marginRight: 15 }}>
//                 {/* Notifications */}
//                 <TouchableOpacity onPress={() => router.push("/notifications")}>
//                   <Ionicons name="heart-outline" size={24} color={theme.text} />
//                 </TouchableOpacity>

//                 {/* Chat */}
//                 <TouchableOpacity onPress={() => router.push("/chat")}>
//                   <Ionicons
//                     name="chatbubble-ellipses-outline"
//                     size={24}
//                     color={theme.text}
//                   />
//                 </TouchableOpacity>
//               </View>
//             ),
//             tabBarIcon: ({ focused }) => (
//               <Ionicons
//                 name={focused ? "home" : "home-outline"}
//                 size={24}
//                 color={focused ? theme.text : theme.subtitle}
//               />
//             ),
//           }}
//         />

//         {/*  Search */}
//         <Tabs.Screen
//           name="search"
//           options={{
//             headerShown: false,
//             title: "Search",
//             tabBarIcon: ({ focused }) => (
//               <Ionicons
//                 name={focused ? "search" : "search-outline"}
//                 size={24}
//                 color={focused ? theme.text : theme.subtitle}
//               />
//             ),
//           }}
//         />

//         {/*  Create */}
//         <Tabs.Screen
//           name="createReels"
//           options={{
//             headerShown: false,
//             title: "Create",
//             tabBarIcon: ({ focused }) => (
//               <Ionicons
//                 name={focused ? "add-circle" : "add-circle-outline"}
//                 size={28}
//                 color={focused ? theme.text : theme.subtitle}
//               />
//             ),
//           }}
//         />

//         {/*  Reels */}
//         <Tabs.Screen
//           name="reels"
//           options={{
//             headerShown: false,
//             title: "Reels Feed",
//             tabBarIcon: ({ focused }) => (
//               <Ionicons
//                 name={focused ? "play-circle" : "play-circle-outline"}
//                 size={26}
//                 color={focused ? theme.text : theme.subtitle}
//               />
//             ),
//           }}
//         />

//         {/*  Profile */}
//         <Tabs.Screen
//           name="profile"
//           options={{
//             headerShown: false,
//             title: "Profile",
//             tabBarIcon: ({ focused }) => (
//               <Ionicons
//                 name={focused ? "person" : "person-outline"}
//                 size={24}
//                 color={focused ? theme.text : theme.subtitle}
//               />
//             ),
//           }}
//         />
//       </Tabs>
//     </>
//   );
// }

import { useAppTheme } from "@/src/constants/themeHelper";
import { useFeedStore } from "@/src/store/useFeedStore";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useNavigation, useRouter } from "expo-router";
import { useRef } from "react";
import { Image, StatusBar, TouchableOpacity, View } from "react-native";

export default function TabsLayout() {
  const router = useRouter();
  const theme = useAppTheme();
  const navigation = useNavigation();
  const { scrollToTop } = useFeedStore();
  const lastTapRef = useRef(0);

  return (
    <>
      <StatusBar
        hidden={false}
        barStyle={theme.background === "#000" ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <Tabs
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          headerShown: true,
          headerStyle: { backgroundColor: theme.background },
          headerTitleStyle: { color: theme.text },
          tabBarStyle: { backgroundColor: theme.background },

          tabBarActiveTintColor: theme.text,
          tabBarInactiveTintColor: theme.subtitle,

          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = "home-outline";
            if (route.name === "index") iconName = focused ? "home" : "home-outline";
            else if (route.name === "search") iconName = focused ? "search" : "search-outline";
            else if (route.name === "createReels") iconName = focused ? "add-circle" : "add-circle-outline";
            else if (route.name === "reels") iconName = focused ? "play-circle" : "play-circle-outline";
            else if (route.name === "profile") iconName = focused ? "person" : "person-outline";

            return <Ionicons name={iconName as any} size={size} color={focused ? theme.text : theme.subtitle} />;
          },
        })}
      >

        {/*  Home */}
        <Tabs.Screen
          name="index"
          options={{
            headerShown: true,
            headerLeft: () => (
              <Image
                source={require("@/assets/images/name-hithoye.png")}
                style={{ width: 100, height: 110, marginLeft: 10 }}
                resizeMode="contain"
              />
            ),
            headerTitle: "",
            headerTitleStyle: {
              fontWeight: "700",
              fontSize: 20,
              color: theme.text,
            },
            headerRight: () => (
              <View style={{ flexDirection: "row", gap: 20, marginRight: 15 }}>
                {/* Notifications */}
                <TouchableOpacity onPress={() => router.push("/notifications")}>
                  <Ionicons name="heart-outline" size={24} color={theme.text} />
                </TouchableOpacity>

                {/* Chat */}
                <TouchableOpacity onPress={() => router.push("/chat")}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={24}
                    color={theme.text}
                  />
                </TouchableOpacity>
              </View>
            ),
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={focused ? theme.text : theme.subtitle}
              />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              const now = Date.now();
              const DOUBLE_TAP_DELAY = 300;

              // Check if it's a quick double tap or user is already on home
              if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
                // Double tap detected
                e.preventDefault();
                console.log("🏠 Double tap - Scrolling to top");
                scrollToTop();
              } else {
                // Single tap - check if already on home tab
                const state = navigation.getState();
                const routes = state?.routes ?? [];
                // const currentTab = routes[state.index];
                if (state && routes && routes.length > state.index) {
                  const currentTab = routes[state.index];

                  if (currentTab?.state) {
                    const tabState = currentTab.state;
                    const tabRoutes = tabState?.routes || [];
                    const activeRoute = tabRoutes[tabState.index || 0];

                    // If already on index (home), scroll to top
                    if (activeRoute?.name === "index") {
                      e.preventDefault();
                      console.log("🏠 Already on home - Scrolling to top");
                      scrollToTop();
                    }
                  }
                }
              }

              lastTapRef.current = now;
            },
          }}
        />

        {/*  Search */}
        <Tabs.Screen
          name="search"
          options={{
            headerShown: false,
            title: "Search",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={24}
                color={focused ? theme.text : theme.subtitle}
              />
            ),
          }}
        />

        {/*  Create */}
        <Tabs.Screen
          name="createReels"
          options={{
            headerShown: false,
            title: "Create",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                size={28}
                color={focused ? theme.text : theme.subtitle}
              />
            ),
          }}
        />

        {/*  Reels */}
        <Tabs.Screen
          name="reels"
          options={{
            headerShown: false,
            title: "Reels Feed",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "play-circle" : "play-circle-outline"}
                size={26}
                color={focused ? theme.text : theme.subtitle}
              />
            ),
          }}
        />

        {/*  Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? theme.text : theme.subtitle}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}   