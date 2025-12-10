import { removeBookmark, renameBookmark } from '@/src/features/bookmark/api';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CategoryReelGrid from '../../../../src/features/bookmark/categoryReelGrid';
import SavedCategories from '../../../../src/features/bookmark/savedCategories';
import { useBookmarkStore } from '../../../../src/store/useBookmarkStore';

const SavedScreen = () => {
  const { categories, setCategories } = useBookmarkStore();
  // const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  const handleDelete = (id: string) => {
    removeBookmark({ id });
    setCategories(prev => prev.filter(c => c.id !== id));

  };

  const handleRename = (id: string, newName: string) => {
    renameBookmark({ id, name: newName });
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, name: newName } : c))
    );
  };

  
  return (
    <View style={{ flex: 1 }}>
      {selectedCategoryId ? (
  <>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => setSelectedCategoryId(null)}>
        <Text style={styles.back}>⬅ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{selectedCategory?.name}</Text>
    </View>

    <CategoryReelGrid
      reels={selectedCategory?.reels ?? []}
      onSelectReel={(id) => console.log("Open Reel:", id)}
    />
  </>
) : (
  <SavedCategories
    categories={categories}
    onSelect={(cat) => setSelectedCategoryId(cat.id)}   // 🔥 FIX
    onDelete={handleDelete}
    onRename={handleRename}
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
