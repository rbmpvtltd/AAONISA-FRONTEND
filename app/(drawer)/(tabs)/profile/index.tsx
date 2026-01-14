import { ProfileHeader, Tabs, TopHeader, UserInfo, VideoItem } from "@/app/profile/[username]/index";
import { MentionedScreen } from "@/app/profile/[username]/mantionScreen";
import { GetCurrentUser, GetProfileUsername } from "@/src/api/profile-api";
import { CurrentUserInfoSkeleton, CurrentUserTopHeaderSkeleton, PostGridSkeleton, ProfileHeaderSkeleton, TabsSkeleton } from "@/src/components/profilePageSkeleton";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'expo-router';
import { useState } from "react";
import { FlatList } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyProfileScreen() {
  const theme = useAppTheme();
  const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");

  const router = useRouter();

  const { data: currentUser, isLoading: currentUserLoading, refetch: refetchCurrentUser, } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile, isError } = useQuery({
    queryKey: ["userProfile", currentUser?.username],
    queryFn: () => GetProfileUsername(currentUser?.username || ""),
    enabled: !!currentUser?.username,
  });

  console.log("=============================================");
  console.log("profile  AAAAAAAA=======>", profile?.mentionedVideos);
  console.log("=============================================");

  const isOwnProfile =
    currentUser?.username === profile?.username ||
    currentUser?.id === profile?.id;


  if (currentUserLoading || profileLoading) {
    return (
      // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      //   <ActivityIndicator size="large" color={theme.text} />
      // </View>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <CurrentUserTopHeaderSkeleton theme={theme} isOwnProfile={currentUser} />
        <ProfileHeaderSkeleton />
        <CurrentUserInfoSkeleton isOwnProfile={currentUser} />
        <TabsSkeleton theme={theme} />
        <PostGridSkeleton />
      </SafeAreaView>
    );
  }

  const onRefresh = async () => {
    await Promise.all([
      refetchCurrentUser(),
      refetchProfile(),
    ]);
  };


  return (
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

        renderItem={({ item }) =>
          activeTab === "posts" ? (
            <VideoItem
              image={item.thumbnailUrl}
              uuid={item.uuid}
              onPressItem={(uuid) => {
                router.push(`/p/${profile?.username}/${uuid}`);
              }}
            />
          ) : null
        }

        ListEmptyComponent={
          activeTab === "reels" ? (
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