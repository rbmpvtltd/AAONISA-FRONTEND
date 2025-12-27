// import { GetCurrentUser } from "@/src/api/profile-api";
// import { useStoryStore } from "@/src/store/useStoryStore";
// import { Ionicons } from "@expo/vector-icons";
// import { useQuery } from "@tanstack/react-query";
// import { router } from "expo-router";
// import { memo, useCallback, useMemo } from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";

// // Individual Story Item Component - Memoized
// const StoryItem = memo(({
//   user,
//   theme,
//   isCurrentUser = false,
//   onPress
// }: {
//   user: any;
//   theme: any;
//   isCurrentUser?: boolean;
//   onPress: () => void;
// }) => {
//   const seen = !user.stories.some((s: any) => !s.viewed);
//   const hasStories = user.stories && user.stories.length > 0;

//   const { data: currentUser, isLoading: currentUserLoading } = useQuery({
//     queryKey: ["currentUser"],
//     queryFn: GetCurrentUser,
//   });

// console.log("=====================================");
// console.log("Current User in StoryItem:", currentUser);
// console.log("=====================================");


// // const imageUri =
// //   user.profilePic?.length
// //     ? user.profilePic
// //     : currentUser?.userProfile?.ProfilePicture
// //     ? currentUser.userProfile.ProfilePicture
// //     : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

//   return (
//     <TouchableOpacity
//       style={styles.storyContainer}
//       onPress={onPress}
//       activeOpacity={0.7}
//     >
//       {isCurrentUser ? (
//         <>
//           <View style={[
//             styles.storyBorder,
//             {
//               borderColor: hasStories
//                 ? (seen ? "#999" : "#ff8501")
//                 : "transparent"
//             },
//           ]}>
//             <Image
//               source={{ uri: currentUser?.userProfile?.ProfilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}}
//               style={styles.storyImage}
//             />
//             {!hasStories && (
//               <View style={styles.addButton}>
//                 <Ionicons name="add" size={16} color="#fff" />
//               </View>
//             )}
//           </View>
//         </>
//       ) : (
//         // Other users' stories
//         <View
//           style={[
//             styles.storyBorder,
//             { borderColor: seen ? "#999" : "#ff8501" },
//           ]}
//         >
//           <Image
//             source={{ uri: user.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
//             style={styles.storyImage}
//           />
//         </View>
//       )}

//       <Text
//         style={[styles.storyUsername, { color: theme.text }]}
//         numberOfLines={1}
//       >
//         {isCurrentUser ? "Your Story" : user.username}
//       </Text>
//     </TouchableOpacity>
//   );
// });

// StoryItem.displayName = "StoryItem";

// export const StoryList = memo(({
//   theme,
//   // currentUserId,
//   // currentUserProfilePic
// }: {
//   theme: any;
//   // currentUserId: string;
//   // currentUserProfilePic: string;
// }) => {
//   const { userStories } = useStoryStore();

//   // Memoize current user stories using 'self' property
//   const currentUserStories = useMemo(
//     () => userStories?.find(u => u.self === true),
//     [userStories]
//   );

//   // Memoize has own stories check
//   const hasOwnStories = useMemo(
//     () => currentUserStories && currentUserStories.stories.length > 0,
//     [currentUserStories]
//   );

//   // Memoize other users' stories (where self is false)
//   const otherUsersStories = useMemo(
//     () => userStories?.filter(u => u.self === false) || [],
//     [userStories]
//   );

//   // Handler for your story press
//   const handleYourStoryPress = useCallback(() => {
//     if (hasOwnStories && currentUserStories) {
//       const story = currentUserStories.stories.find(s => !s.viewed) || currentUserStories.stories[0];
//       router.push(`/story/${story.id}`);
//     } else {
//       // router.push("/(drawer)/(tabs)/createReels");
//         router.push("/(drawer)/(tabs)/createReels?contentType=story");
//     }
//   }, [hasOwnStories, currentUserStories]);

//   // Handler for other users' story press
//   const handlePress = useCallback((ownerId: string) => {
//     const user = userStories?.find(u => u.owner === ownerId);
//     if (!user) return;

//     const story = user.stories.find(s => !s.viewed) || user.stories[0];
//     router.push(`/story/${story.id}`);
//     console.log('====================================');
//     console.log(`/story/${story.id}`);
//     console.log('====================================');
//   }, [userStories]);

//   // Create current user object for StoryItem
//   const currentUserData = useMemo(() => ({
//     profilePic: currentUserStories?.profilePic,
//     username: currentUserStories?.username || "Your Story",
//     stories: currentUserStories?.stories || [],
//     owner: currentUserStories?.owner, //currentUserId,
//     self: true,
//   }), [currentUserStories]);

//   return (
//       <ScrollView
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       style={styles.container}
//       contentContainerStyle={styles.contentContainer}
//     >
//     {/* // <View style={styles.container}> */}
//       {/* Your Story - Always appears first */}
//       <StoryItem
//         user={currentUserData}
//         theme={theme}
//         isCurrentUser={true}
//         onPress={handleYourStoryPress}
//       />

//       {/* Other users' stories */}
//       {otherUsersStories.map((user) => (
//         <StoryItem
//           key={user.owner}
//           user={user}
//           theme={theme}
//           onPress={() => handlePress(user.owner)}
//         />
//       ))}
//       </ScrollView>
//     // {/* // </View> */}
//   );
// });

// StoryList.displayName = "StoryList";

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },
//    contentContainer: {
//     paddingHorizontal: 10,
//   },
//   storyContainer: {
//     alignItems: "center",
//     marginHorizontal: 10,
//     width: 70,
//   },
//   storyBorder: {
//     borderWidth: 3,
//     padding: 2,
//     borderRadius: 40,
//     marginBottom: 4,
//   },
//   storyImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//   },
//   storyUsername: {
//     fontSize: 12,
//     textAlign: "center",
//   },
//   yourStoryWrapper: {
//     position: "relative",
//     borderWidth: 3,
//     borderColor: "transparent",
//     padding: 2,
//     borderRadius: 40,
//     marginBottom: 4,
//   },
//   addButton: {
//     position: "absolute",
//     bottom: 2,
//     right: 2,
//     backgroundColor: "#0095f6",
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
// });

import { GetCurrentUser } from "@/src/api/profile-api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// Individual Story Item Component - Memoized
const StoryItem = memo(({
  user,
  theme,
  isCurrentUser = false,
  onPress,
  currentUserProfilePic
}: {
  user: any;
  theme: any;
  isCurrentUser?: boolean;
  onPress: () => void;
  currentUserProfilePic?: string;
}) => {
  const seen = !user.stories.some((s: any) => !s.viewed);
  const hasStories = user.stories && user.stories.length > 0;

  return (
    <TouchableOpacity
      style={styles.storyContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isCurrentUser ? (
        <>
          <View style={[
            styles.storyBorder,
            {
              borderColor: hasStories
                ? (seen ? "#999" : "#ff8501")
                : "transparent"
            },
          ]}>
            <Image
              source={{
                uri: currentUserProfilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }}
              style={styles.storyImage}
            />
            {!hasStories && (
              <View style={styles.addButton}>
                <Ionicons name="add" size={16} color="#fff" />
              </View>
            )}
          </View>
        </>
      ) : (
        // Other users' stories
        <View
          style={[
            styles.storyBorder,
            { borderColor: seen ? "#999" : "#ff8501" },
          ]}
        >
          <Image
            source={{ uri: user.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
            style={styles.storyImage}
          />
        </View>
      )}

      <Text
        style={[styles.storyUsername, { color: theme.text }]}
        numberOfLines={1}
      >
        {isCurrentUser ? "Your Story" : user.username}
      </Text>
    </TouchableOpacity>
  );
});

StoryItem.displayName = "StoryItem";

export const StoryList = memo(({
  theme,
  stories
}: {
  theme: any;
  stories?: any[];
}) => {

  const userStories = stories;
  // Get current user for profile picture
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });

  // Memoize current user stories using 'self' property
  const currentUserStories = useMemo(
    () => userStories?.find((u: any) => u.self === true),
    [userStories]
  );

  // Memoize has own stories check
  const hasOwnStories = useMemo(
    () => currentUserStories && currentUserStories.stories.length > 0,
    [currentUserStories]
  );

  // Memoize other users' stories (where self is false)
  const otherUsersStories = useMemo(
    () => userStories?.filter((u: any) => u.self === false) || [],
    [userStories]
  );

  // Handler for your story press
  const handleYourStoryPress = useCallback(() => {
    if (hasOwnStories && currentUserStories) {
      const story = currentUserStories.stories.find((s: any) => !s.viewed) || currentUserStories.stories[0];
      router.push(`/story/${story.id}`);
    } else {
      router.push("/(drawer)/(tabs)/createReels?contentType=story");
    }
  }, [hasOwnStories, currentUserStories]);

  // Handler for other users' story press
  const handlePress = useCallback((ownerId: string) => {
    const user = userStories?.find((u: any) => u.owner === ownerId);
    if (!user) return;

    const story = user.stories.find((s: any) => !s.viewed) || user.stories[0];
    router.push(`/story/${story.id}`);
    console.log('====================================');
    console.log(`/story/${story.id}`);
    console.log('====================================');
  }, [userStories]);

  // Create current user object for StoryItem
  const currentUserData = useMemo(() => ({
    profilePic: currentUserStories?.profilePic || currentUser?.userProfile?.ProfilePicture,
    username: currentUserStories?.username || "Your Story",
    stories: currentUserStories?.stories || [],
    owner: currentUserStories?.owner,
    self: true,
  }), [currentUserStories, currentUser]);

  // Don't show if no stories at all
  if (!userStories || userStories.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Your Story - Always appears first */}
      <StoryItem
        user={currentUserData}
        theme={theme}
        isCurrentUser={true}
        onPress={handleYourStoryPress}
        currentUserProfilePic={currentUser?.userProfile?.ProfilePicture}
      />

      {/* Other users' stories */}
      {otherUsersStories.map((user: any) => (
        <StoryItem
          key={user.owner}
          user={user}
          theme={theme}
          onPress={() => handlePress(user.owner)}
        />
      ))}
    </ScrollView>
  );
});

StoryList.displayName = "StoryList";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  storyContainer: {
    alignItems: "center",
    marginHorizontal: 10,
    width: 70,
  },
  storyBorder: {
    borderWidth: 3,
    padding: 2,
    borderRadius: 40,
    marginBottom: 4,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyUsername: {
    fontSize: 12,
    textAlign: "center",
  },
  yourStoryWrapper: {
    position: "relative",
    borderWidth: 3,
    borderColor: "transparent",
    padding: 2,
    borderRadius: 40,
    marginBottom: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#0095f6",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
});