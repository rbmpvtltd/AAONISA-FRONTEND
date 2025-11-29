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

//   // ✅ Fetch profile followers
//   const { data, isPending, isError } = useQuery({
//     queryKey: ['userProfile', username],
//     queryFn: () => GetProfileUsername(username),
//     enabled: !!username,
//   });  


//   // ✅ Mutation for follow/unfollow
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

interface Follower {
  id: string;
  username: string;
  name: string;
  profilepicture: string;
}

const FollowersScreen = () => {
  const { username } = useLocalSearchParams<{ username: string }>();
  const theme = useAppTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();

  const avatarSize = width > 400 ? 60 : 50;
  const padding = width > 400 ? 20 : 16;

  // ✅ Fetch profile followers
  const { data, isPending, isError } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => GetProfileUsername(username),
    enabled: !!username,
  });

  // ✅ Mutation for follow/unfollow
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

  const followers: Follower[] = Array.isArray(data?.followers) ? data.followers : [];
console.log("Followers count:", followers?.length ?? 0);

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
              uri : item.profilepicture 
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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingHorizontal: padding, paddingTop: 20 },
      ]}
    >
      <Text style={[styles.header, { color: theme.text }]}>
        Followers ({followers.length})
      </Text>
      <FlatList data={followers} renderItem={renderFollower} keyExtractor={(item) => item.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 22, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5 },
  userInfo: { flex: 1 },
  name: { fontWeight: '600', fontSize: 16 },
  username: { fontSize: 14 },
  followButton: { paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8 },
  followButtonText: { fontWeight: '600', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default FollowersScreen;
