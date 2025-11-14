import { GetProfileUsername, UnfollowUser } from '@/src/api/profile-api';
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

interface Following {
  id: string;
  username: string;
  name: string;
  profilepicture: string;
  isFollowing?: boolean; // optional for future toggle
}

const FollowingScreen = () => {
  const { username } = useLocalSearchParams<{ username?: string }>();
  const theme = useAppTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();

  const avatarSize = width > 400 ? 60 : 50;
  const padding = width > 400 ? 20 : 16;

  // ✅ Fetch profile data (includes followings)
  // const { data, isPending, isError } = useQuery({
  //   queryKey: ['userProfile', username],
  //   queryFn: () => GetProfileUsername(username),
  //   enabled: !!username,
  // });
const { data, isPending, isError } = useQuery({
  queryKey: ['userProfile', username],
  queryFn: () => GetProfileUsername(username!),
  enabled: !!username, // <== ye line important hai!
});
 
  // ✅ Unfollow user mutation
  const unfollowMutation = useMutation({
    mutationFn: (id: string) => UnfollowUser(id),
    onSuccess: async () => {
      // Refresh the profile data after unfollow
      await queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
    },
  });

  if (isPending)
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
        <Text style={{ color: theme.subtitle }}>Loading followings...</Text>
      </View>
    );

  if (isError)
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: 'red' }}>Failed to load followings</Text>
      </View>
    );

  // const followings: Following[] = data?.followings || [];
  const followings: Following[] = Array.isArray(data?.followings) ? data.followings : [];


  if (!followings.length) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.subtitle }}>No following users yet</Text>
      </View>
    );
  }

  const handleUnfollow = (id: string) => {
    if (unfollowMutation.isPending) return;
    unfollowMutation.mutate(id);
  };


  const handleProfilePress = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const renderFollowing = ({ item }: { item: Following }) => (
    <TouchableOpacity onPress={() => handleProfilePress(item.username)}>
      <View style={[styles.userRow, { borderBottomColor: theme.inputBorder }]}>
        <Image
          source={{ uri: item.profilepicture || 'https://via.placeholder.com/150' }}
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
       
        {/* ✅ Unfollow Button */}
        <TouchableOpacity
          onPress={() => handleUnfollow(item.id)}
          disabled={unfollowMutation.isPending}
          style={[
            styles.followButton,
            {
              backgroundColor: theme.buttonBg ,
              opacity: unfollowMutation.isPending ? 0 : 1,
            },
          ]}
        >
          <Text style={[styles.followButtonText, { color: theme.buttonText || '#fff' }]}>
            {unfollowMutation.isPending ? 'Unfollow' : 'Unfollow'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingHorizontal: padding, paddingTop: 10 },
      ]}
    >
      <Text style={[styles.header, { color: theme.text }]}>
        Following ({followings.length})
      </Text>
      <FlatList
        data={followings}
        renderItem={renderFollowing}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  userInfo: { flex: 1 },
  name: { fontWeight: '600', fontSize: 16 },
  username: { fontSize: 14 },
  followButton: { paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8 },
  followButtonText: { fontWeight: '600', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default FollowingScreen;
