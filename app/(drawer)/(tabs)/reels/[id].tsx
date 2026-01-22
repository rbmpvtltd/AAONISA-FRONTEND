import { useReelsByCategory } from '@/src/hooks/useReelsByCategory';
import { useReelsStore } from '@/src/store/useReelsStore';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function ReelDetailScreen() {
  const params = useLocalSearchParams();
  const rawParam = params.id as string | undefined;

  let reelId: string | undefined;
  let redirected = false;

  if (rawParam) {
    const [idPart, queryPart] = rawParam.split("&");
    reelId = idPart;
    redirected = queryPart?.includes("redirected=true") ?? false;
  }

  const { reels, setCurrentIndex, setReels, setRedirectedFromShare } = useReelsStore();

  // 🔹 Only fetch if redirected === true
  const { data, isLoading } = useReelsByCategory(
    "explore",
    redirected,  // only true triggers API fetch for single reel
    reelId
  );

  // console.log('====================================');
  // console.log("reelIdreelIdreelIdreelId", reelId);
  // console.log('====================================');
  useEffect(() => {
    if (redirected && data?.pages) {
      const allReels = data.pages.flatMap((page) => page.reels);
      if (redirected && allReels.length > 0) {
        setReels(allReels);
        setCurrentIndex(0);
        setRedirectedFromShare(true);
        router.replace('/reels');
      }
    } else if (!redirected && reelId && reels.length > 0) {
      // only change index, no data fetch
      const index = reels.findIndex((r) => r.id === reelId);
      if (index !== -1) setCurrentIndex(index);
    }
  }, [redirected, data, reelId, reels, setCurrentIndex, setReels]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isLoading && redirected && <Text>Loading Reel...</Text>}
    </View>
  );
}
