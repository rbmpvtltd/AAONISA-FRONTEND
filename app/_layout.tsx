import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import * as React from "react";
export default function RootLayout() {
  const Tab = createBottomTabNavigator();
  return (
    // <Stack />
    // <Stack>
    //   <Stack.Screen name="index" options={{ headerShown: false }} />
    //   <Stack.Screen name="about" />
    // </Stack>

    // <Tab.Navigator>
    //   <Tab.Screen name="Home" component={ProfileScreen} />
    // </Tab.Navigator>

    // <Tabs>
    //   <Tabs.Screen options={{
    //     title: "Home", tabBarIcon: ({ color, size }) => (
    //       <Ionicons name="home-outline" size={size} color={color} />
    //     ),
    //   }} />
    // </Tabs>

    // <NavigationContainer>
    //   <Tab.Navigator>
    //     <Tab.Screen name="Home" component={HomePage} />
    //   </Tab.Navigator>
    // </ NavigationContainer>
    <Tabs>
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          // tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="auth/login.tsx"
        options={{
          title: "Home",
          tabBarItemStyle: {
            display: "none"
          },
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      {/* <Tabs.Screen
        name="hi"
        options={{
          title: "hi",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  )
}
