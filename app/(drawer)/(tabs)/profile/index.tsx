
// // import { GetCurrentUser } from "@/app/profile/api";
// // import { useQuery } from "@tanstack/react-query";
// // import { useRouter } from "expo-router";
// // import { useEffect } from "react";

// // export default function ProfileTabRedirect() {
// //   const router = useRouter();

// //   const { data: currentUserData, isLoading } = useQuery({
// //     queryKey: ["currentUser"],
// //     queryFn: GetCurrentUser,
// //   });

// //   const currentUser = currentUserData?.userProfile;

// //   //  safe redirect using useEffect
// //   useEffect(() => {
// //     if (currentUser?.username) {
// //       router.replace(`/profile/${currentUser.username}`);
// //     }
// //   }, [currentUser?.username]);

// //   if (isLoading) return null;

// //   return null
// // }


// // app/(drawer)/(tabs)/profile/index.tsx
// import { PostGrid, ProfileHeader, Tabs, TopHeader, UserInfo } from "@/app/profile/[username]";
// import { GetCurrentUser } from "@/app/profile/api";
// import { useAppTheme } from "@/src/constants/themeHelper";
// import { useQuery } from "@tanstack/react-query";
// import { ActivityIndicator, SafeAreaView, View } from "react-native";

// export default function MyProfileScreen() {
//   const theme = useAppTheme();

//   const { data: profile, isLoading } = useQuery({
//     queryKey: ["currentUser"],
//     queryFn: GetCurrentUser,
//   });

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color={theme.text} />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
//       <TopHeader
//         userName={profile?.username}
//         theme={theme}
//         isOwnProfile={true}
//       />
//       <ProfileHeader theme={theme} profile={profile} />
//       <UserInfo theme={theme} profile={profile} isOwnProfile={true} onFollowToggle={() => {}} />
//       <Tabs theme={theme} />
//       <PostGrid videos={profile?.videos ?? []} />
//     </SafeAreaView>
//   );
// }

import { PostGrid, ProfileHeader, Tabs, TopHeader, UserInfo } from "@/app/profile/[username]/index";
import { GetCurrentUser, GetProfileUsername } from "@/app/profile/api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, SafeAreaView, View } from "react-native";

export default function MyProfileScreen() {
  const theme = useAppTheme();

  // Step 1: Get current logged-in user (for username)
  const { data: currentUser, isLoading: currentUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });

  // Step 2: Get full profile using username from currentUser
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile", currentUser?.username],
    queryFn: () => GetProfileUsername(currentUser?.username || ""),
    enabled: !!currentUser?.username, // tabhi chale jab username mil jaaye
  });

  if (currentUserLoading || profileLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <TopHeader
        userName={profile?.username}
        theme={theme}
        isOwnProfile={true}
      />
      <ProfileHeader theme={theme} profile={profile} />
      <UserInfo
        theme={theme}
        profile={profile}
        isOwnProfile={true}
          isFollowing={false} 
        onFollowToggle={() => {}}
      />
      <Tabs theme={theme} />
      <PostGrid videos={profile?.videos ?? []} />
    </SafeAreaView>
  );
}


// kajldffffffffffffffffffffffffffffffffffffffffffffffff