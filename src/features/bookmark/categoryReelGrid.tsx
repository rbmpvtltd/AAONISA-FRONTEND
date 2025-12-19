import { useAppTheme } from '@/src/constants/themeHelper';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { removeReelFromBookmark } from './api';

interface Reel {
  uuid: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

interface Props {
  reels: Reel[];
  categoryId: string;
  categoryName: string;
}

export const BOOKMARKS_KEY = ["bookmarks"];

export const useRemoveReelFromCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      reelId,
      categoryName,
    }: {
      reelId: string;
      categoryName: string;
    }) => removeReelFromBookmark({ reelId, categoryName }),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKMARKS_KEY });
    },
  });
};


const CategoryReelGrid: React.FC<Props> = ({
  reels,
  categoryName,
}) => {
  const router = useRouter();
  const theme = useAppTheme();
  const removeReelMutation = useRemoveReelFromCategory();

  const handleDelete = (reelId: string) => {
    Alert.alert(
      "Remove Reel",
      "Are you sure you want to remove this reel from bookmarks?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            removeReelMutation.mutate({ reelId, categoryName }, {
              onError: () =>
                Alert.alert("Error", "Failed to remove reel"),
            }),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={reels}
        numColumns={3}
        keyExtractor={(item) => item.uuid}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.subtitle }]}>
              No bookmarked reels yet
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          console.log("item", item)
          return (
          <TouchableOpacity
            onPress={() =>
              router.push(`/bookmark/reelscard?reelId=${item.uuid}`)
            }
            style={styles.touchBox}
            activeOpacity={0.7}
          >
            <View>
              <Image
                source={
                  item.thumbnailUrl
                    ? { uri: item.thumbnailUrl }
                    : require('@/assets/darkThemeUser.jpg')
                }
                style={[
                  styles.thumb,
                  { backgroundColor: theme.subtitle },
                ]}
                resizeMode="cover"
              />

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.uuid)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )
        }
      }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  touchBox: { margin: 5 },
  thumb: {
    width: 120,
    height: 200,
    borderRadius: 8,
  },
  deleteBtn: {
  position: 'absolute',
  bottom: 8,
  right: 8,
  backgroundColor: 'rgba(0,0,0,0.6)',
  padding: 6,
  borderRadius: 20,
  zIndex: 10,
},
emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 40,
},
emptyText: {
  fontSize: 14,
  opacity: 0.7,
},

});

export default CategoryReelGrid;
