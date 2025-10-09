// import { Ionicons } from "@expo/vector-icons";
// import { Tabs, useRouter } from "expo-router";
// import { TouchableOpacity, View } from "react-native";

// export default function TabsLayout() {
//   const router = useRouter();

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: true,
//         tabBarShowLabel: true,
//         tabBarStyle: {
//           backgroundColor: "#fff",
//           borderTopWidth: 0.4,
//           borderTopColor: "#ccc",
//         },
//         headerTitle: "Aao Ni Sa",
//         headerTitleStyle: { fontWeight: "700", fontSize: 20 },
//         headerRight: () => (
//           <View style={{ flexDirection: "row", gap: 20, marginRight: 15 }}>
//             {/* Notifications */}
//             <TouchableOpacity onPress={() => router.push("/notifications")}>
//               <Ionicons name="heart-outline" size={24} color="black" />
//             </TouchableOpacity>

//             {/* Chat */}
//             <TouchableOpacity onPress={() => router.push("/chat")}>
//               <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
//             </TouchableOpacity>
//           </View>
//         ),
//       }}
//     >
//       {/* Home */}
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
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

//       {/* Reels Feed */}
//       <Tabs.Screen
//         name="reels"
//         options={{
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

//       {/* Create Reels */}
//       {/* <Tabs.Screen
//         name="create"
//         options={{
//           title: "Create",
//           tabBarIcon: () => (
//             <Ionicons name="add-circle-outline" size={28} color="black" />
//           ),
//         }}
//       /> */}

//       {/* Profile */}
//       <Tabs.Screen
//         name="profile"
//         options={{
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
//   );
// }


import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function TabsLayout() {
  const router = useRouter();

  return (
    <>
    

    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0.4,
          borderTopColor: "#ccc",
        },
      }}
    >
        
      {/* Home (Feed) */}
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "Aao Ni Sa",
          headerTitleStyle: { fontWeight: "700", fontSize: 20 },
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 20, marginRight: 15 }}>
              {/* Notifications */}
              <TouchableOpacity onPress={() => router.push("/notifications")}>
                <Ionicons name="heart-outline" size={24} color="black" />
              </TouchableOpacity>

              {/* Chat */}
              <TouchableOpacity onPress={() => router.push("/chat")}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color="black"
            />
          ),
        }}
      />

      {/* Search */}
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={24}
              color="black"
            />
          ),
        }}
      />

 {/* Create Reels */}
     <Tabs.Screen
        name="create"
        options={{
            headerShown: false,
          title: "Create",
          tabBarIcon: ({focused}) => (
            <Ionicons
             name={focused ? "add-circle" : "add-circle-outline"}
             size={24} 
             color="black" />
          ),
        }}
      />

      {/* Reels Feed */}
      <Tabs.Screen
        name="reels"
        options={{
          headerShown: false, 
          title: "Reels Feed",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "film" : "film-outline"}
              size={24}
              color="black"
            />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color="black"
            />
          ),
        }}
      />
    </Tabs>
    </>
  );
}
