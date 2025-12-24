// import { GetProfileUsername, followUser } from '@/app/profile/api';
// import { useAppTheme } from '@/src/constants/themeHelper';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useLocalSearchParams } from 'expo-router';
// import React from 'react';
// import {
//     ActivityIndicator,
//     FlatList,
//     Image,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
//     useWindowDimensions,
// } from 'react-native';

// interface Follower {
//   id: string;
//   username: string;
//   name: string;
//   profilepicture: string;
// }

// const FollowersScreen = () => {
//   const { username } = useLocalSearchParams<{ username: string }>();
//   const theme = useAppTheme();
//   const { width } = useWindowDimensions();
//   const queryClient = useQueryClient();



//   const avatarSize = width > 400 ? 60 : 50;
//   const padding = width > 400 ? 20 : 16;

//   //  Fetch profile followers
//   const { data, isPending, isError } = useQuery({
//     queryKey: ['userProfile', username],
//     queryFn: () => GetProfileUsername(username),
//     enabled: !!username,
//   });  


//   //  Mutation for follow/unfollow
//   const followMutation = useMutation({
//     mutationFn: (id: string) => followUser(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
//     },
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


//   const followers: Follower[] = data?.followers || [];
//   console.log('Followers count:', followers.length);

//   const handleFollow = (id: string) => {
//     if (followMutation.isPending) return;
//     followMutation.mutate(id);
//   };

//   const renderFollower = ({ item }: { item: Follower }) => (
//     <View style={[styles.userRow, { borderBottomColor: theme.inputBorder }]}>
//       <Image
//         source={{ uri: item.profilepicture || 'https://via.placeholder.com/150' }}
//         style={{
//           width: avatarSize,
//           height: avatarSize,
//           borderRadius: avatarSize / 2,
//           backgroundColor: '#ccc',
//         }}
//       />
//       <View style={[styles.userInfo, { marginLeft: 10 }]}>
//         <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
//         <Text style={[styles.username, { color: theme.subtitle }]}>@{item.username}</Text>
//       </View>
//       <TouchableOpacity
//         onPress={() => handleFollow(item.id)}
//         disabled={followMutation.isPending}
//         style={[
//           styles.followButton,
//           { backgroundColor: theme.buttonBg, opacity: followMutation.isPending ? 0.6 : 1 },
//         ]}
//       >
//         <Text style={[styles.followButtonText, { color: theme.buttonText }]}>
//           {followMutation.isPending ? '...' : 'Follow'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background, paddingHorizontal: padding, paddingTop: 50 }]}>
//       <Text style={[styles.header, { color: theme.text }]}>Followers ({followers.length})</Text>
//       <FlatList data={followers} renderItem={renderFollower} keyExtractor={(item) => item.id} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: { fontSize: 22, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
//   userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5 },
//   userInfo: { flex: 1 },
//   name: { fontWeight: '600', fontSize: 16 },
//   username: { fontSize: 14 },
//   followButton: { paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8 },
//   followButtonText: { fontWeight: '600', fontSize: 14 },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// });

// export default FollowersScreen;


import { GetProfileUsername, followUser } from '@/src/api/profile-api';
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
}

const FollowersScreen = () => {
  const { username } = useLocalSearchParams<{ username: string }>();
  const theme = useAppTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const searchFontSize = width > 400 ? 16 : 14;

  const avatarSize = width > 400 ? 60 : 50;
  const padding = width > 400 ? 20 : 16;

  //  Fetch profile followers
  const { data, isPending, isError, refetch,
    isRefetching } = useQuery({
      queryKey: ['userProfile', username],
      queryFn: () => GetProfileUsername(username),
      enabled: !!username,
    });

  //  Mutation for follow/unfollow
  const followMutation = useMutation({
    mutationFn: (id: string) => followUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
    },
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

  // const followers: Follower[] = data?.followers || [];
  // console.log('Followers count:', followers.length);

  const followers: Follower[] = Array.isArray(data?.followersWithFlag) ? data.followersWithFlag : [];
  console.log("Followers count:", followers?.length ?? 0);

  const filteredFollowers = useMemo(() => {
    if (!searchQuery.trim()) return followers;

    const query = searchQuery.toLowerCase();
    return followers.filter(
      (follower) =>
        follower?.username.toLowerCase().includes(query) ||
        follower?.name.toLowerCase().includes(query)
    );
  }, [followers, searchQuery]);

  const handleFollow = (id: string) => {
    if (followMutation.isPending) return;
    followMutation.mutate(id);
  };

  // const handleProfilePress = (username: string) => {
  //   router.push(`/profile/${username}`);
  // };

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


  const renderFollower = ({ item }: { item: Follower }) => (
    <TouchableOpacity onPress={() => handleProfilePress(item.username)}>
      <View style={[styles.userRow, { borderBottomColor: theme.inputBorder }]}>
        <Image
          source={
            {
              uri: item.profilepicture
                ? item.profilepicture : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }
          }
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: '#ccc',
          }}
        />
        <View style={[styles.userInfo, { marginLeft: 10 }]}>
          <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.username, { color: theme.subtitle }]}>@{item.username}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleFollow(item.id)}
          disabled={followMutation.isPending}
          style={[
            styles.followButton,
            { backgroundColor: theme.buttonBg, opacity: followMutation.isPending ? 0.6 : 1 },
          ]}
        >
          <Text style={[styles.followButtonText, { color: theme.buttonText }]}>
            {followMutation.isPending ? '...' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // return (
  //   <View
  //     style={[
  //       styles.container,
  //       { backgroundColor: theme.background, paddingHorizontal: padding, paddingTop: 20 },
  //     ]}
  //   >
  //     <Text style={[styles.header, { color: theme.text }]}>
  //       Followers ({followers.length})
  //     </Text>
  //     <FlatList data={followers} renderItem={renderFollower} keyExtractor={(item) => item.id} />
  //   </View>
  // );

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
      {/* Header */}
      {/* <View style={[styles.headerContainer, { paddingHorizontal: padding, paddingTop: 20 }]}>
        <Text style={[styles.header, { color: theme.text }]}>
          Followers ({followers.length})
        </Text>
      </View> */}

      {/* Search Bar */}
      <View style={[styles.searchContainer, { paddingHorizontal: padding, marginBottom: 16 }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
          <Ionicons name="search" size={20} color={theme.subtitle} style={styles.searchIcon} />
          <TextInput
            placeholder="Search followers..."
            placeholderTextColor={theme.placeholder}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text.toLocaleLowerCase().replace(/\s+/g, '').trim())}
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
  header: { fontSize: 22, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  headerContainer: {
    marginBottom: 12,
  },
  searchContainer: {
    marginTop: 8,
  }, searchBar: {
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
  }, clearButton: {
    padding: 4,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5 },
  userInfo: { flex: 1 },

  name: { fontWeight: '600', fontSize: 16 },
  username: { fontSize: 14 },
  followButton: { paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8 },
  followButtonText: { fontWeight: '600', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default FollowersScreen;
