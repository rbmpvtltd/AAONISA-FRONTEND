
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

// import { PostGrid, ProfileHeader, Tabs, TopHeader, UserInfo } from "@/app/profile/[username]/index";
// import { GetCurrentUser, GetProfileUsername } from "@/src/api/profile-api";
// import { useAppTheme } from "@/src/constants/themeHelper";
// import { useQuery } from "@tanstack/react-query";
// import { ActivityIndicator, View } from "react-native";
// import { RefreshControl, ScrollView } from "react-native-gesture-handler";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function MyProfileScreen() {
//   const theme = useAppTheme();

//   // Step 1: Get current logged-in user (for username)
//   const { data: currentUser, isLoading: currentUserLoading, refetch: refetchCurrentUser, } = useQuery({
//     queryKey: ["currentUser"],
//     queryFn: GetCurrentUser,
//   });

//   // Step 2: Get full profile using username from currentUser
//   const { data: profile, isLoading: profileLoading,  refetch: refetchProfile,} = useQuery({
//     queryKey: ["userProfile", currentUser?.username],
//     queryFn: () => GetProfileUsername(currentUser?.username || ""),
//     enabled: !!currentUser?.username, // tabhi chale jab username mil jaaye
//   });

//   // console.log("user data in current user ", profile);

//   if (currentUserLoading || profileLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color={theme.text} />
//       </View>
//     );
//   }

//   const onRefresh = async () => {
//   await Promise.all([
//     refetchCurrentUser(),
//     refetchProfile(),
//   ]);
// };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
//        <ScrollView
//       showsVerticalScrollIndicator={false}
//       refreshControl={
//         <RefreshControl
//           refreshing={currentUserLoading || profileLoading}
//           onRefresh={onRefresh}
//           tintColor={theme.text} // iOS
//         />
//       }
//     >
//       <TopHeader
//         userName={profile?.username}
//         theme={theme}
//         isOwnProfile={true}
//       />
//       <ProfileHeader theme={theme} profile={profile} />
//       <UserInfo
//         theme={theme}
//         profile={profile}
//         isOwnProfile={true}
//           isFollowing={false} 
//         onFollowToggle={() => {}}
//       />
//       <Tabs theme={theme} />
//             <PostGrid videos={profile?.videos || []} username={profile?.username} />
//             </ScrollView>
//     </SafeAreaView>
//   );
// }


import { ProfileHeader, Tabs, TopHeader, UserInfo, VideoItem } from "@/app/profile/[username]/index";
import { MentionedScreen } from "@/app/profile/[username]/mantionScreen";
import { GetCurrentUser, GetProfileUsername } from "@/src/api/profile-api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyProfileScreen() {
  const theme = useAppTheme();
  const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");


  const { data: currentUser, isLoading: currentUserLoading, refetch: refetchCurrentUser, } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile, } = useQuery({
    queryKey: ["userProfile", currentUser?.username],
    queryFn: () => GetProfileUsername(currentUser?.username || ""),
    enabled: !!currentUser?.username,
  });

  console.log("=============================================");
console.log("profile  AAAAAAAA=======>",profile?.mentionedVideos);
  console.log("=============================================");

  const isOwnProfile =
    currentUser?.username === profile?.username ||
    currentUser?.id === profile?.id;


  if (currentUserLoading || profileLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  const onRefresh = async () => {
    await Promise.all([
      refetchCurrentUser(),
      refetchProfile(),
    ]);
  };

  // const ListHeaderComponent = () => (
  //   <>
  //     <TopHeader
  //       userName={profile?.username}
  //       theme={theme}
  //       isOwnProfile={true}
  //     />
  //     <ProfileHeader theme={theme} profile={profile} />
  //     <UserInfo
  //       theme={theme}
  //       profile={profile}
  //       isOwnProfile={true}
  //       isFollowing={false}
  //       onFollowToggle={() => { }}
  //     />
  //     <Tabs theme={theme}
  //       //  isOwnProfile={isOwnProfile}
  //       activeTab={activeTab}
  //       onChange={setActiveTab} />

  //     {activeTab === "reels" && (
  //       <View style={{ marginTop: 40, alignItems: "center" }}>
  //         <Text style={{ color: theme.text }}>
  //           Mentioned / Tagged Reels yahan aayengi
  //         </Text>
  //       </View>
  //     )}
  //   </>
  // );

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
    //   <FlatList
    //     data={profile?.videos || []}
    //     keyExtractor={(item) => item.uuid}
    //     numColumns={3}
    //     columnWrapperStyle={{ gap: 2, paddingHorizontal: 2, marginBottom: 2 }}
    //     renderItem={({ item, index }) => {
    //       const { VideoItem } = require("@/app/profile/[username]/index");
    //       return (
    //         <VideoItem
    //           image={item.thumbnailUrl}
    //           id={item.uuid}
    //           username={profile?.username}
    //           index={index}
    //           onPressItem={(idx: any) => {
    //             const { router } = require("expo-router");
    //             router.push(`/p/${profile?.username}/${item.uuid}`);
    //           }}
    //         />
    //       );
    //     }}
    //     ListHeaderComponent={ListHeaderComponent}
    //     ListEmptyComponent={() => (
    //       <View style={{ alignItems: "center", marginTop: 50 }}>
    //         <Text style={{ color: theme.text }}>No videos uploaded yet.</Text>
    //       </View>
    //     )}
    //     showsVerticalScrollIndicator={false}
    //     contentContainerStyle={{ paddingBottom: 20, backgroundColor: theme.background }}
    //     refreshControl={
    //       <RefreshControl
    //         refreshing={currentUserLoading || profileLoading}
    //         onRefresh={onRefresh}
    //         tintColor={theme.text}
    //       />
    //     }
    //   />
    // </SafeAreaView>

    // ad 23
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={currentUserLoading || profileLoading}
            onRefresh={onRefresh}
            tintColor={theme.text}
          />
        }
        ListHeaderComponent={
          <>
            <TopHeader userName={profile?.username} theme={theme} isOwnProfile />
            <ProfileHeader theme={theme} profile={profile} />
            <UserInfo
              theme={theme}
              profile={profile}
              isOwnProfile
              isFollowing={false}
              onFollowToggle={() => { }}
            />
            <Tabs
              theme={theme}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </>
        }
        data={activeTab === "posts" ? profile?.videos || [] : []}
        key={activeTab}
        numColumns={activeTab === "posts" ? 3 : 1}
        columnWrapperStyle={
          activeTab === "posts"
            ? { gap: 2, paddingHorizontal: 2, marginBottom: 2 }
            : undefined
        }
        keyExtractor={(item, index) =>
          activeTab === "posts" ? item.uuid : index.toString()
        }
        //  columnWrapperStyle={{ gap: 2, paddingHorizontal: 2, marginBottom: 2 }}
        renderItem={({ item, index }) =>
          activeTab === "posts" ? (
            <VideoItem
              image={item.thumbnailUrl}
              id={item.uuid}
              username={profile?.username}
              index={index}
              onPressItem={() => {
                const { router } = require("expo-router");
                router.push(`/p/${profile?.username}/${item.uuid}`);
              }}
            />
          ) : null
        }
        ListEmptyComponent={
          activeTab === "reels" ? (
            // <View style={{ alignItems: "center", marginTop: 80 }}>
            //   <Ionicons name="person-circle-outline" size={64} color="#777" />
            //   <Text style={{ color: theme.text, fontSize: 16, fontWeight: "600", marginTop: 12 }}>
            //     No tagged reels yet
            //   </Text>
            //   <Text style={{ color: theme.subtitle, fontSize: 13, marginTop: 6 }}>
            //     Reels you’re tagged in will appear here.
            //   </Text>
            // </View>

            <MentionedScreen
              key="reels"
              mentionedVideos={profile?.mentionedVideos || []}
              username={profile?.username}
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>

  );
}