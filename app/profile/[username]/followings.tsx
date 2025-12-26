import { followUser, GetCurrentUser, GetProfileUsername, UnfollowUser } from '@/src/api/profile-api';
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
  useWindowDimensions,
  View,
} from 'react-native';
import { Pressable, TextInput } from 'react-native-gesture-handler';

interface Following {
  id: string;
  username: string;
  name: string;
  profilepicture: string;
  followedByMe?: boolean;
}

const FollowingScreen = () => {
  const { username } = useLocalSearchParams<{ username?: string }>();
  const theme = useAppTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const searchFontSize = width > 400 ? 16 : 14;

  const avatarSize = width > 400 ? 60 : 50;
  const padding = width > 400 ? 20 : 16;

  const { data, isPending, isError, refetch, isRefetching } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => GetProfileUsername(username!),
    enabled: !!username,
  });

  // Unfollow user mutation
  const unfollowMutation = useMutation({
    mutationFn: (id: string) => UnfollowUser(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile', username] });
      const previousData = queryClient.getQueryData<any>(['userProfile', username]);

      queryClient.setQueryData(['userProfile', username], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          followingsWithFlag: old.followingsWithFlag.map((u: Following) =>
            u.id === id ? { ...u, followedByMe: false } : u
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(['userProfile', username], context?.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
    },
  });

  // Follow user mutation
  const followMutation = useMutation({
    mutationFn: (id: string) => followUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
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
        <Text style={{ color: theme.subtitle }}>Loading followings...</Text>
      </View>
    );

  if (isError)
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: 'red' }}>Failed to load followings</Text>
      </View>
    );

  const followings: Following[] = Array.isArray(data?.followingsWithFlag) ? data.followingsWithFlag : [];

  if (!followings.length) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.subtitle }}>No following users yet</Text>
      </View>
    );
  }

  const sortedFollowings = useMemo(() => {
    if (!followings || !currentUser?.id) return followings;

    return [...followings].sort((a, b) => {
      if (a.id === currentUser.id) return -1;
      if (b.id === currentUser.id) return 1;
      return 0;
    });
  }, [followings, currentUser]);


  const filteredFollowings = useMemo(() => {
    if (!sortedFollowings) return [];

    const query = searchQuery.trim().toLowerCase();

    return sortedFollowings.filter((following) => {
      if (!query) return true;

      return (
        following?.username?.toLowerCase().includes(query) ||
        following?.name?.toLowerCase().includes(query)
      );
    });
  }, [sortedFollowings, searchQuery]);


  const handleFollowToggle = (id: string, isFollowing: boolean) => {
    if (unfollowMutation.isPending || followMutation.isPending) return;

    if (isFollowing) {
      unfollowMutation.mutate(id);
    } else {
      followMutation.mutate(id);
    }
  };

  const handleProfilePress = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const renderFollowing = ({ item }: { item: Following }) => {
    const isFollowing = item.followedByMe ?? false;
    const isLoading = loadingUserId === item.id;
    const isCurrentUser = item.id === currentUser?.id;

    return (
      <TouchableOpacity onPress={() => handleProfilePress(item.username)}>
        <View style={[styles.userRow, { borderBottomColor: theme.inputBorder }]}>
          <Image
            source={{
              uri: item.profilepicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"
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

          {/* Follow/Unfollow Button */}
          {!isCurrentUser && (
            <TouchableOpacity
              onPress={() => handleFollowToggle(item.id, isFollowing)}
              style={[
                styles.followButton,
                {
                  backgroundColor: isFollowing
                    ? theme.inputBorder
                    : theme.buttonBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.followButtonText,
                  {
                    color: isFollowing
                      ? theme.text
                      : theme.buttonText || '#fff',
                  },
                ]}
              >
                {isFollowing ? 'Following' : 'Follow'}
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
          title: "Followings",
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

      <View
        style={[
          styles.container,
          { backgroundColor: theme.background, paddingHorizontal: padding, paddingTop: 10 },
        ]}
      >
        <View style={[styles.searchContainer, { paddingHorizontal: padding, marginBottom: 16 }]}>
          <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
            <Ionicons name="search" size={20} color={theme.subtitle} style={styles.searchIcon} />
            <TextInput
              placeholder="Search followings..."
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

        <FlatList
          data={filteredFollowings}
          renderItem={renderFollowing}
          keyExtractor={(item) => item.id}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{ paddingHorizontal: padding }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.subtitle }]}>
                {searchQuery ? 'No followings found' : 'No followings yet'}
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
    textAlign: 'center',
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  userInfo: { flex: 1 },
  name: { fontWeight: '600', fontSize: 16 },
  username: { fontSize: 14 },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  followButtonText: { fontWeight: '600', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});

export default FollowingScreen;