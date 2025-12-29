import { useReelsStore } from '@/src/store/useReelsStore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function ReelDetailScreen() {
  const { id } = useLocalSearchParams();
  const { reels, setCurrentIndex } = useReelsStore();

  useEffect(() => {
    if (id && reels.length > 0) {
      const index = reels.findIndex((reel) => reel.id === id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [id, reels]);

  // Yahan aap directly ReelsFeed component return kar sakte hain
  // ya phir individual reel display kar sakte hain
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading Reel: {id}</Text>

    </View>
  );
}