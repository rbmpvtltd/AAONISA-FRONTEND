import { Stack } from "expo-router";

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Messages" }} />
      <Stack.Screen name="[chatId]" options={{ title: "Chat Detail" }} />
    </Stack>
  );
}
