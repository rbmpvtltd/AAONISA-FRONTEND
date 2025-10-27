import React from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Reel {
  id: string;
  thumbnail: string;
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
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelectReel(item.id)}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  thumb: { width: 120, height: 200, margin: 5, borderRadius: 6 },
});

export default CategoryReelGrid;
