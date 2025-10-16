import { useAppTheme } from "@/src/constants/themeHelper";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function CommentLayout() {
  const theme = useAppTheme(); 

  return (
    <>
      <StatusBar
        hidden={false}
        barStyle={theme.background === "#000" ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            color: theme.text,
            fontWeight: "600",
          },
          headerTintColor: theme.text,
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        {/* Comment */}
        <Stack.Screen
          name="[id]"
          options={{
            title: "Comments",
          }}
        />

      </Stack>
    </>
  );
}
