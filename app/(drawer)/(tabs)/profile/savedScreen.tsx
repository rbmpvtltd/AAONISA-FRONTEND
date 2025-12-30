import { removeBookmark, renameBookmark } from '@/src/features/bookmark/api';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CategoryReelGrid from '../../../../src/features/bookmark/categoryReelGrid';
import SavedCategories from '../../../../src/features/bookmark/savedCategories';
// import { useBookmarkStore } from '../../../../src/store/useBookmarkStore';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from 'react-native-toast-message';
import { useBookmarks } from '../../../../src/features/bookmark/bookmarkPanel';
// import {
//   renameBookmarkCategory,
//   deleteBookmarkCategory,
// } from "./api";

export const BOOKMARKS_KEY = ["bookmarks"];

export const useRenameCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      renameBookmark({ id, name }),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKMARKS_KEY });
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => removeBookmark({ id }),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKMARKS_KEY });
    },
  });
};

const SavedScreen = () => {
  const { data: categories = [], isLoading } = useBookmarks();

  const renameCategory = useRenameCategory();
  const deleteCategory = useDeleteCategory();

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  const selectedCategory = categories.find(
    (c: any) => c.id === selectedCategoryId
  );

  if (isLoading) return null; // loader laga sakte ho

  return (
    <View style={{ flex: 1 }}>
      {selectedCategoryId && selectedCategory ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelectedCategoryId(null)}>
              <Text style={styles.back}>⬅ Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{selectedCategory.name}</Text>
          </View>

          <CategoryReelGrid
            reels={selectedCategory.reels}
            categoryId={selectedCategory.id}
            categoryName={selectedCategory.name}
          />
        </>
      ) : (
        <SavedCategories
          categories={categories}
          onSelect={(cat) => setSelectedCategoryId(cat.id)}
          onRename={(id, newName) =>
            renameCategory.mutate(
              { id, name: newName },
              {
                onError: () =>
                  // alert("Failed to rename category"),
                  Toast.show({ type: "error", text1: "Failed to rename category" })
              }
            )
          }
          onDelete={(id) =>
            deleteCategory.mutate(id, {
              onError: () =>
                // alert("Failed to delete category"),
                Toast.show({ type: "error", text1: "Failed to delete category" })

            })
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  back: {
    fontSize: 18,
    color: "#007bff"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold"
  }
});

export default SavedScreen;
