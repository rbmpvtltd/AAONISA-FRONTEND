import { useAppTheme } from "@/src/constants/themeHelper";
import { Stack } from "expo-router";
import * as React from "react";
import { StatusBar } from "react-native";

export default function ProfileLayout() {
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
          name="[id]"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="followers"
          options={{
            title: "Followers",
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="followings"
          options={{
            title: "Followings",
            headerShown: true,
          }}
        />
      </Stack>
    </>
  );
}
