// import { GetCurrentUser, GetProfileUsername, UnfollowUser, followUser } from '@/src/api/profile-api';
// import { useAppTheme } from '@/src/constants/themeHelper';
// import { Ionicons } from '@expo/vector-icons';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
// import { useMemo, useState } from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   useWindowDimensions,
// } from 'react-native';
// import { Pressable, TextInput } from 'react-native-gesture-handler';

// interface Follower {
//   id: string;
//   username: string;
//   name: string;
//   profilepicture: string;
//   followedByMe?: boolean;
// }


// const FollowersScreen = () => {
//   const { username } = useLocalSearchParams<{ username: string }>();
//   const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
//   const theme = useAppTheme();
//   const router = useRouter();
//   const { width } = useWindowDimensions();
//   const queryClient = useQueryClient();

//   const [searchQuery, setSearchQuery] = useState('');
//   const searchFontSize = width > 400 ? 16 : 14;

//   const avatarSize = width > 400 ? 60 : 50;
//   const padding = width > 400 ? 20 : 16;

//   // Fetch profile followers
//   const { data, isPending, isError, refetch, isRefetching } = useQuery({
//     queryKey: ['userProfile', username],
//     queryFn: () => GetProfileUsername(username),
//     enabled: !!username,
//   });

//   // Follow mutation
//   const followMutation = useMutation({
//     mutationFn: (id: string) => followUser(id),

//     onMutate: async (id) => {
//       await queryClient.cancelQueries({ queryKey: ['userProfile', username] });
//       await queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
//       const previousData = queryClient.getQueryData<any>(['userProfile', username]);

//       queryClient.setQueryData(['userProfile', username], (old: any) => {
//         if (!old) return old;

//         return {
//           ...old,
//           followersWithFlag: old.followersWithFlag.map((u: Follower) =>
//             u.id === id ? { ...u, followedByMe: true } : u
//           ),
//         };
//       });

//       return { previousData };
//     },

//     onError: (_err, _id, context) => {
//       queryClient.setQueryData(['userProfile', username], context?.previousData);
//     },
//   });


//   const unfollowMutation = useMutation({
//     mutationFn: (id: string) => UnfollowUser(id),

//     onMutate: async (id) => {
//       await queryClient.cancelQueries({ queryKey: ['userProfile', username] });

//       const previousData = queryClient.getQueryData<any>(['userProfile', username]);

//       queryClient.setQueryData(['userProfile', username], (old: any) => {
//         if (!old) return old;

//         return {
//           ...old,
//           followersWithFlag: old.followersWithFlag.map((u: Follower) =>
//             u.id === id ? { ...u, followedByMe: false } : u
//           ),
//         };
//       });

//       return { previousData };
//     },

//     onError: (_err, _id, context) => {
//       queryClient.setQueryData(['userProfile', username], context?.previousData);
//     },
//   });


//   const { data: currentUser, isLoading: currentUserLoading, refetch: refetchCurrentUser, } = useQuery({
//     queryKey: ["currentUser"],
//     queryFn: GetCurrentUser,
//   });

//   if (isPending)
//     return (
//       <View style={[styles.center, { backgroundColor: theme.background }]}>
//         <ActivityIndicator size="large" color={theme.text} />
//         <Text style={{ color: theme.subtitle }}>Loading followers...</Text>
//       </View>
//     );

//   if (isError)
//     return (
//       <View style={[styles.center, { backgroundColor: theme.background }]}>
//         <Text style={{ color: 'red' }}>Failed to load followers</Text>
//       </View>
//     );

//   const followers: Follower[] = Array.isArray(data?.followersWithFlag)
//     ? data.followersWithFlag
//     : [];


//   const sortedFollowers = useMemo(() => {
//     if (!followers || !currentUser?.id) return followers;

//     return [...followers].sort((a, b) => {
//       if (a.id === currentUser.id) return -1;
//       if (b.id === currentUser.id) return 1;
//       return 0;
//     });
//   }, [followers, currentUser]);

//   const filteredFollowers = useMemo(() => {
//     if (!sortedFollowers) return [];

//     const query = searchQuery.trim().toLowerCase();

//     return sortedFollowers.filter((follower) => {
//       if (!query) return true;

//       return (
//         follower?.username?.toLowerCase().includes(query) ||
//         follower?.name?.toLowerCase().includes(query)
//       );
//     });

//   }, [followers, searchQuery]);

//   // const handleFollowToggle = (id: string, isFollowing: boolean) => {
//   //   if (followMutation.isPending || unfollowMutation.isPending) return;

//   //   if (isFollowing) {
//   //     unfollowMutation.mutate(id);
//   //   } else {
//   //     followMutation.mutate(id);
//   //   }
//   // };

//   const handleFollowToggle = (id: string, isFollowing: boolean) => {
//     if (loadingUserId) return;

//     setLoadingUserId(id);

//     if (isFollowing) {
//       unfollowMutation.mutate(id, {
//         onSettled: () => setLoadingUserId(null),
//       });
//     } else {
//       followMutation.mutate(id, {
//         onSettled: () => setLoadingUserId(null),
//       });
//     }
//   };


//   const handleProfilePress = (username?: string) => {
//     if (!username) {
//       console.warn("Invalid username for profile navigation");
//       return;
//     }
//     try {
//       router.push(`/profile/${username.toLowerCase()}`);
//     } catch (err) {
//       console.error("Navigation error:", err);
//     }
//   };

//   const renderFollower = ({ item }: { item: Follower }) => {
//     const isFollowing = item.followedByMe ?? false;
//     // const isLoading = followMutation.isPending || unfollowMutation.isPending;
//     const isLoading = loadingUserId === item.id;
//     const isCurrentUser = item.id === currentUser?.id;

//     return (
//       <TouchableOpacity onPress={() => handleProfilePress(item.username)}>
//         <View style={[styles.userRow, { borderBottomColor: theme.inputBorder }]}>
//           <Image
//             source={{
//               uri: item.profilepicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
//             }}
//             style={{
//               width: avatarSize,
//               height: avatarSize,
//               borderRadius: avatarSize / 2,
//               backgroundColor: '#ccc',
//             }}
//           />
//           <View style={[styles.userInfo, { marginLeft: 10 }]}>
//             <Text style={[styles.name, { color: theme.text }]}>
//               {item.name || 'No Name'}
//             </Text>
//             <Text style={[styles.username, { color: theme.subtitle }]}>
//               @{item.username}
//             </Text>
//           </View>

//           {/* Follow/Following Button - Instagram Style */}
//           {!isCurrentUser && (
//             <TouchableOpacity
//               onPress={() => handleFollowToggle(item.id, isFollowing)}
//               disabled={isLoading}
//               style={[
//                 styles.followButton,
//                 {
//                   backgroundColor: isFollowing ? theme.inputBorder : theme.buttonBg,
//                   borderWidth: isFollowing ? 1 : 0,
//                   borderColor: isFollowing ? theme.subtitle : 'transparent',
//                   opacity: isLoading ? 0.6 : 1,
//                 },
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.followButtonText,
//                   {
//                     color: isFollowing ? theme.text : (theme.buttonText || '#fff'),
//                   },
//                 ]}
//               >
//                 {isLoading ? (isFollowing ? 'Following' : 'Follow Back') : (isFollowing ? 'Following' : 'Follow Back')}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <>
//       <Stack.Screen
//         options={{
//           title: "Followers",
//           headerShown: true,
//           headerLeft: () => (
//             <Pressable
//               onPress={() => router.back()}
//               style={{ paddingHorizontal: 12 }}
//             >
//               <Ionicons name="arrow-back" size={24} color={theme.text} />
//             </Pressable>
//           ),
//         }}
//       />

//       <View style={[styles.container, { backgroundColor: theme.background }]}>
//         {/* Search Bar */}
//         <View style={[styles.searchContainer, { paddingHorizontal: padding, marginBottom: 16 }]}>
//           <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
//             <Ionicons name="search" size={20} color={theme.subtitle} style={styles.searchIcon} />
//             <TextInput
//               placeholder="Search followers..."
//               placeholderTextColor={theme.placeholder}
//               value={searchQuery}
//               onChangeText={(text) => setSearchQuery(text.toLocaleLowerCase().replace(/\s+/g, '').trim())}
//               style={[
//                 styles.searchInput,
//                 { color: theme.text, fontSize: searchFontSize }
//               ]}
//             />
//             {searchQuery.length > 0 && (
//               <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
//                 <Ionicons name="close-circle" size={20} color={theme.subtitle} />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* Followers List */}
//         <FlatList
//           data={filteredFollowers}
//           renderItem={renderFollower}
//           keyExtractor={(item) => item.id}
//           refreshing={isRefetching}
//           onRefresh={refetch}
//           contentContainerStyle={{ paddingHorizontal: padding }}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Text style={[styles.emptyText, { color: theme.subtitle }]}>
//                 {searchQuery ? 'No followers found' : 'No followers yet'}
//               </Text>
//             </View>
//           }
//           showsVerticalScrollIndicator={false}
//         />
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginBottom: 20,
//     textAlign: 'center'
//   },
//   headerContainer: {
//     marginBottom: 12,
//   },
//   searchContainer: {
//     marginTop: 8,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 10,
//     borderWidth: 1,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 0,
//   },
//   clearButton: {
//     padding: 4,
//   },
//   emptyContainer: {
//     paddingVertical: 40,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//   },
//   userRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 0.5
//   },
//   userInfo: { flex: 1 },
//   name: { fontWeight: '600', fontSize: 16 },
//   username: { fontSize: 14 },
//   followButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     minWidth: 95,
//     alignItems: 'center',
//   },
//   followButtonText: {
//     fontWeight: '600',
//     fontSize: 14
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
// });

// export default FollowersScreen;

import { GetCurrentUser, GetProfileUsername, UnfollowUser, followUser } from '@/src/api/profile-api';
import { useAppTheme } from '@/src/constants/themeHelper';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Pressable, TextInput } from 'react-native-gesture-handler';

interface Follower {
  id: string;
  username: string;
  name: string;
  profilepicture: string;
  followedByMe?: boolean;
  followsMe?: boolean;
}


const FollowersScreen = () => {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const theme = useAppTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const searchFontSize = width > 400 ? 16 : 14;

  const avatarSize = width > 400 ? 60 : 50;
  const padding = width > 400 ? 20 : 16;

  // Fetch profile followers
  const { data, isPending, isError, refetch, isRefetching } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => GetProfileUsername(username),
    enabled: !!username,
  });

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: (id: string) => followUser(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile', username] });
      const previousData = queryClient.getQueryData<any>(['userProfile', username]);

      queryClient.setQueryData(['userProfile', username], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          followersWithFlag: old.followersWithFlag.map((u: Follower) =>
            u.id === id ? { ...u, followedByMe: true } : u
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(['userProfile', username], context?.previousData);
    },
  });


  const unfollowMutation = useMutation({
    mutationFn: (id: string) => UnfollowUser(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile', username] });

      const previousData = queryClient.getQueryData<any>(['userProfile', username]);

      queryClient.setQueryData(['userProfile', username], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          followersWithFlag: old.followersWithFlag.map((u: Follower) =>
            u.id === id ? { ...u, followedByMe: false } : u
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(['userProfile', username], context?.previousData);
    },
  });


  const { data: currentUser, isLoading: currentUserLoading, refetch: refetchCurrentUser, } = useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
  });

  if (isPending)
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
        <Text style={{ color: theme.subtitle }}>Loading followers...</Text>
      </View>
    );

  if (isError)
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: 'red' }}>Failed to load followers</Text>
      </View>
    );

  const followers: Follower[] = Array.isArray(data?.followersWithFlag)
    ? data.followersWithFlag
    : [];


  const sortedFollowers = useMemo(() => {
    if (!followers || !currentUser?.id) return followers;

    return [...followers].sort((a, b) => {
      if (a.id === currentUser.id) return -1;
      if (b.id === currentUser.id) return 1;
      return 0;
    });
  }, [followers, currentUser]);

  const filteredFollowers = useMemo(() => {
    if (!sortedFollowers) return [];

    const query = searchQuery.trim().toLowerCase();

    return sortedFollowers.filter((follower) => {
      if (!query) return true;

      return (
        follower?.username?.toLowerCase().includes(query) ||
        follower?.name?.toLowerCase().includes(query)
      );
    });

  }, [sortedFollowers, searchQuery]);

  const handleFollowToggle = (id: string, isFollowing: boolean) => {
    if (loadingUserId) return;

    setLoadingUserId(id);

    if (isFollowing) {
      unfollowMutation.mutate(id, {
        onSettled: () => setLoadingUserId(null),
      });
    } else {
      followMutation.mutate(id, {
        onSettled: () => setLoadingUserId(null),
      });
    }
  };


  const handleProfilePress = (username?: string) => {
    if (!username) {
      console.warn("Invalid username for profile navigation");
      return;
    }
    try {
      router.push(`/profile/${username.toLowerCase()}`);
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  const renderFollower = ({ item }: { item: Follower }) => {
    const isFollowing = item.followedByMe ?? false;
    const followsMe = item.followsMe ?? false;
    const isLoading = loadingUserId === item.id;
    const isCurrentUser = item.id === currentUser?.id;

    // Instagram logic for button text
    let buttonText = 'Follow';
    if (isFollowing) {
      buttonText = 'Following';
    } else if (followsMe) {
      buttonText = 'Follow Back';
    }

    return (
      <TouchableOpacity onPress={() => handleProfilePress(item.username)}>
        <View style={[styles.userRow, { borderBottomColor: theme.inputBorder }]}>
          <Image
            source={{
              uri: item.profilepicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: '#ccc',
            }}
          />
          <View style={[styles.userInfo, { marginLeft: 10 }]}>
            <Text style={[styles.name, { color: theme.text }]}>
              {item.name || 'No Name'}
            </Text>
            <Text style={[styles.username, { color: theme.subtitle }]}>
              @{item.username}
            </Text>
          </View>

          {/* Follow/Following Button - Instagram Style */}
          {!isCurrentUser && (
            <TouchableOpacity
              onPress={() => handleFollowToggle(item.id, isFollowing)}
              disabled={isLoading}
              style={[
                styles.followButton,
                {
                  backgroundColor: isFollowing ? theme.inputBorder : theme.buttonBg,
                  borderWidth: isFollowing ? 1 : 0,
                  borderColor: isFollowing ? theme.subtitle : 'transparent',
                  opacity: isLoading ? 0.6 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.followButtonText,
                  {
                    color: isFollowing ? theme.text : (theme.buttonText || '#fff'),
                  },
                ]}
              >
                {buttonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Followers",
          headerShown: true,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={{ paddingHorizontal: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </Pressable>
          ),
        }}
      />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, { paddingHorizontal: padding, marginBottom: 16 }]}>
          <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
            <Ionicons name="search" size={20} color={theme.subtitle} style={styles.searchIcon} />
            <TextInput
              placeholder="Search followers..."
              placeholderTextColor={theme.placeholder}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text.toLowerCase().replace(/\s+/g, ''))}
              style={[
                styles.searchInput,
                { color: theme.text, fontSize: searchFontSize }
              ]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={theme.subtitle} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Followers List */}
        <FlatList
          data={filteredFollowers}
          renderItem={renderFollower}
          keyExtractor={(item) => item.id}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{ paddingHorizontal: padding }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.subtitle }]}>
                {searchQuery ? 'No followers found' : 'No followers yet'}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center'
  },
  headerContainer: {
    marginBottom: 12,
  },
  searchContainer: {
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5
  },
  userInfo: { flex: 1 },
  name: { fontWeight: '600', fontSize: 16 },
  username: { fontSize: 14 },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 95,
    alignItems: 'center',
  },
  followButtonText: {
    fontWeight: '600',
    fontSize: 14
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default FollowersScreen;