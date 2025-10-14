// import DrawerLayout from "@/src/navigation/drawerLayout";

// export default DrawerLayout;


import { useAppTheme } from "@/src/constants/themeHelper";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { withLayoutContext } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";
import CustomDrawer from "./customedrawer";

const { Navigator, Screen } = createDrawerNavigator(); 
const Drawer = withLayoutContext(Navigator); 

export default function DrawerLayout() {
  const theme = useAppTheme();

  return (
    <>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={theme.background === "#000" ? "light-content" : "dark-content"}
      />
      <Drawer
        screenOptions={{
             drawerPosition: "right",
          headerShown: false,
          drawerStyle: {
            backgroundColor: theme.background,
            width: 260,
          },
          overlayColor: "rgba(0,0,0,0.4)",
        }}
        drawerContent={(props: any) => <CustomDrawer {...props} />}
      >
        <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      </Drawer>
    </>
  );
}
