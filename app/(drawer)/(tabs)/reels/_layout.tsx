// import { Stack } from "expo-router";
// import * as React from "react";
// export default function ReelsLayout() {
//   // const Tab = createBottomTabNavigator();
//   return (
//      <Stack
//       screenOptions={{
//         headerShown: false, // top header hide
//       }}
//     />    
//   );
// }

// app/reels/_layout.tsx
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
    </Stack>
  );
}