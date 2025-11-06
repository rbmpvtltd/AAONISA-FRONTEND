import { useAppTheme } from "@/src/constants/themeHelper";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
export default function SearchLayout() {
    const theme = useAppTheme()
  return (
    <>

     <StatusBar
            hidden={false}
            barStyle={theme.background === "#000" ? "light-content" : "dark-content"}
            backgroundColor={theme.background}
          />

     <Stack
      screenOptions={{
        headerShown: false, // top header hide
      }}
    />
    </>    
  );
}
