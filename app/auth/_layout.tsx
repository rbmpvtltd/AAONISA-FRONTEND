import { useAppTheme } from "@/src/constants/themeHelper";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function AuthLayout() {
  const theme = useAppTheme()
  return (
    <>
    <Stack
      screenOptions={{
        headerShown: false, // top header hide
      }}
    />    

     <StatusBar
            backgroundColor={theme.background}
            barStyle={theme.background === "#000" ? "light-content" : "dark-content"}
          />
    </>
  );
}
