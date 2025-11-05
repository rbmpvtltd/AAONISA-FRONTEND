import { useAppTheme } from "@/src/constants/themeHelper";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function NotificationLayout() {
  const  theme  = useAppTheme();

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
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Notifications" }}
      />
      <Stack.Screen
        name="[notificationId]"
        options={{ title: "Notification Detail" }}
      />
    </Stack>
    </>
  );
}
