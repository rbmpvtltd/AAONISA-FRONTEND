// import { Stack } from "expo-router";

// export default function ChatLayout() {
//   return (
//     <Stack>
//       <Stack.Screen name="index" options={{ title: "Messages" }} />
//       <Stack.Screen name="[chatId]" options={{ title: "Chat Detail" }} />
//     </Stack>
//   );
// }

import { useAppTheme } from "@/src/constants/themeHelper";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function ChatLayout() {
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
        {/* Chat List */}
        <Stack.Screen
          name="index"
          options={{
            title: "Messages",
          }}
        />

        {/* Chat Detail */}
        <Stack.Screen
          name="[chatId]"
          options={{
            title: "Chat Detail",
          }}
        />
      </Stack>
    </>
  );
}
