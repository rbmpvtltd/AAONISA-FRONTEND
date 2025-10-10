// import { Ionicons } from "@expo/vector-icons";
// import { Tabs, useRouter } from "expo-router";
// import { StatusBar, TouchableOpacity, View } from "react-native";

// export default function TabsLayout() {
//   const router = useRouter();

//   return (
//     <>
    
//   <StatusBar
//         hidden={false}               // show karna hai
//         barStyle="dark-content"      // dark icons (for light background)
//         backgroundColor="#fff"       // white background
//       />

//     <Tabs
//       screenOptions={{
//         tabBarShowLabel: true,
//         tabBarStyle: {
//           backgroundColor: "#fff",
//           borderTopWidth: 0.4,
//           borderTopColor: "#ccc",
//         },
//       }}
//     >
        
//       {/* Home (Feed) */}
//       <Tabs.Screen
//         name="index"
//         options={{
//           headerShown: true,
//           headerTitle: "Aao Ni Sa",
//           headerTitleStyle: { fontWeight: "700", fontSize: 20 },
//           headerRight: () => (
//             <View style={{ flexDirection: "row", gap: 20, marginRight: 15 }}>
//               {/* Notifications */}
//               <TouchableOpacity onPress={() => router.push("/notifications")}>
//                 <Ionicons name="heart-outline" size={24} color="black" />
//               </TouchableOpacity>

//               {/* Chat */}
//               <TouchableOpacity onPress={() => router.push("/chat")}>
//                 <Ionicons
//                   name="chatbubble-ellipses-outline"
//                   size={24}
//                   color="black"
//                 />
//               </TouchableOpacity>
//             </View>
//           ),
//           tabBarIcon: ({ focused }) => (
//             <Ionicons
//               name={focused ? "home" : "home-outline"}
//               size={24}
//               color="black"
//             />
//           ),
//         }}
//       />

//       {/* Search */}
//       <Tabs.Screen
//         name="search"
//         options={{
//           headerShown: false,
//           title: "Search",
//           tabBarIcon: ({ focused }) => (
//             <Ionicons
//               name={focused ? "search" : "search-outline"}
//               size={24}
//               color="black"
//             />
//           ),
//         }}
//       />

//  {/* Create Reels */}
//      <Tabs.Screen
//         name="create"
//         options={{
//             headerShown: false,
//           title: "Create",
//           tabBarIcon: ({focused}) => (
//             <Ionicons
//              name={focused ? "add-circle" : "add-circle-outline"}
//              size={24} 
//              color="black" />
//           ),
//         }}
//       />

//       {/* Reels Feed */}
//       <Tabs.Screen
//         name="reels"
//         options={{
//           headerShown: false, 
//           title: "Reels Feed",
//           tabBarIcon: ({ focused }) => (
//             <Ionicons
//               name={focused ? "film" : "film-outline"}
//               size={24}
//               color="black"
//             />
//           ),
//         }}
//       />

//       {/* Profile */}
//       <Tabs.Screen
//         name="profile"
//         options={{
//           headerShown: false,
//           title: "Profile",
//           tabBarIcon: ({ focused }) => (
//             <Ionicons
//               name={focused ? "person" : "person-outline"}
//               size={24}
//               color="black"
//             />
//           ),
//         }}
//       />
//     </Tabs>
//     </>
//   );
// }

import { useAppTheme } from "@/src/constants/themeHelper";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { StatusBar, TouchableOpacity, View } from "react-native";

export default function TabsLayout() {
  const router = useRouter();
  const theme = useAppTheme(); 

  return (
    <>
      <StatusBar
        hidden={false}
        barStyle={theme.background === "#000" ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopWidth: 0.4,
            borderTopColor: theme.text === "#fff" ? "#444" : "#ccc",
          },
          tabBarActiveTintColor: theme.text,
          tabBarInactiveTintColor: theme.subtitle,
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            color: theme.text,
          },
          headerTintColor: theme.text,
        }}
      >
        {/*  Home */}
        <Tabs.Screen
          name="index"
          options={{
            headerShown: true,
            headerTitle: "Aao Ni Sa",
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
          name="create"
          options={{
            headerShown: false,
            title: "Create",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                size={24}
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
                name={focused ? "film" : "film-outline"}
                size={24}
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
