import { Stack } from 'expo-router';

export default function ReelsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Reel',
        }}
      />

      <Stack.Screen
        name="bookmark"
        options={{
          title: "Bookmark",
          headerShown: true,
        }}
      />

    </Stack>
  );
}