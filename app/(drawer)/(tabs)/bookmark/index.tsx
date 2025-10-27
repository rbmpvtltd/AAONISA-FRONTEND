import React, { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BookmarkButton from './bookmarkButton';
import BookmarkPanel from './bookmarkPanel';
import CategoryReelGrid from './categoryReelGrid';
import SavedCategories from './savedCategories';

interface Reel {
  id: string;
  thumbnail: string;
}

interface Category {
  id: string;
  name: string;
  reels: Reel[];
}

const BookmarkDemoScreen: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Travel', reels: [] },
    { id: '2', name: 'Funny', reels: [] },
    { id: '3', name: 'Music', reels: [] },
  ]);

  const [activePanel, setActivePanel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [showSavedPage, setShowSavedPage] = useState(false);

  const sampleReels: Reel[] = [
    { id: 'r1', thumbnail: 'https://placekitten.com/200/300' },
    { id: 'r2', thumbnail: 'https://placekitten.com/201/300' },
    { id: 'r3', thumbnail: 'https://placekitten.com/202/300' },
  ];

  const handleAddCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      reels: [],
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleSelectCategoryToSave = (categoryId: string) => {
    if (!selectedReel) return;
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, reels: [...cat.reels, selectedReel] }
          : cat
      )
    );
    setActivePanel(false);
  };

  const handleOpenBookmark = (reel: Reel) => {
    setSelectedReel(reel);
    setActivePanel(true);
  };

  const handleOpenCategory = (cat: Category) => {
    setSelectedCategory(cat);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleBackToMain = () => {
    setShowSavedPage(false);
  };

  // MAIN RENDER
  return (
    <SafeAreaView style={styles.container}>
      {/* 1️⃣ Category detail view */}
      {selectedCategory ? (
        <View style={{ flex: 1 }}>
          <View style={styles.categoryHeader}>
            <TouchableOpacity onPress={handleBackToCategories}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.categoryTitle}>{selectedCategory.name}</Text>
          </View>
          <CategoryReelGrid
            reels={selectedCategory.reels}
            onSelectReel={(id: any) => console.log('Open Reel:', id)}
          />
        </View>
      ) : showSavedPage ? (
        // 2️⃣ Full page Saved Categories view
        <View style={{ flex: 1 }}>
          <View style={styles.categoryHeader}>
            <TouchableOpacity onPress={handleBackToMain}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.categoryTitle}>Saved Categories</Text>
          </View>
          <SavedCategories categories={categories} onSelect={handleOpenCategory} />
        </View>
      ) : (
        // 3️⃣ Main screen with Reels and button
        <>
          <Text style={styles.header}>🎬 Reels</Text>
          <FlatList
            data={sampleReels}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={styles.reelCard}>
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                <BookmarkButton onPress={() => handleOpenBookmark(item)} />
              </View>
            )}
          />

          {/* Button to open Saved Categories full page */}
          <TouchableOpacity
            style={styles.savedButton}
            onPress={() => setShowSavedPage(true)}
          >
            <Text style={styles.savedButtonText}>📚 Watch Saved</Text>
          </TouchableOpacity>
        </>
      )}

      <BookmarkPanel
        visible={activePanel}
        onClose={() => setActivePanel(false)}
        onAddCategory={handleAddCategory}
        onSelectCategory={handleSelectCategoryToSave}
        categories={categories}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12 },
  header: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  reelCard: {
    flex: 1 / 2,
    margin: 6,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  savedButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  savedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButton: { fontSize: 16, color: '#007bff', marginRight: 10 },
  categoryTitle: { fontSize: 18, fontWeight: 'bold' },
});

export default BookmarkDemoScreen;
