import React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Reel {
  id: string;
  thumbnail?: string;
  videoUrl: string; // R2 video URL
}

interface Props {
  reels: Reel[];
  onSelectReel: (id: string) => void;
}

const CategoryReelGrid: React.FC<Props> = ({ reels, onSelectReel }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          // ✅ If saved reel has no thumbnail, generate using R2
          const uri = item.thumbnail && item.thumbnail !== "" 
            ? item.thumbnail 
            : `${item.videoUrl}?thumbnail=1000`;

          return (
            <TouchableOpacity onPress={() => onSelectReel(item.id)}>
              {uri ? (
                <Image source={{ uri }} style={styles.thumb} />
              ) : (
                <View style={styles.placeholder}>
                  <ActivityIndicator />
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  thumb: { width: 120, height: 200, margin: 5, borderRadius: 6 },
  placeholder: { width: 120, height: 200, margin: 5, borderRadius: 6, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
});

export default CategoryReelGrid;
