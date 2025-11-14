import { useAppTheme } from "@/src/constants/themeHelper";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function UserLayout() {
  const theme = useAppTheme();

  return (
    <>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={theme.background === "#000" ? "light-content" : "dark-content"}
      />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            color: theme.text,
          },
        }}
      >
      
         <Stack.Screen
          name="index"
          options={{
            title: "index",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="followers"
          options={{
            title: "followers",
            headerShown: true,
          }}
        />

          <Stack.Screen
          name="followings"
          options={{
            title: "followings",
            headerShown: true,
          }}
        />
      </Stack>
    </>
  );
}

