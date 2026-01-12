// import { getCategoryReel } from "@/src/api/reels-api";
// import { useQuery } from "@tanstack/react-query";

// export const useReelsByCategory = (category: string) => {
//   return useQuery({
//     queryKey: ["reels", category],
//     queryFn: async () => {
//       const res = await getCategoryReel(category, 1, 10);

//       const reelsData = Array.isArray(res?.data) ? res.data : [];

//       return reelsData
//         .filter((item: any) => item && item.id && item.videoUrl)
//         .map((item: any) => ({
//           ...item,
//           likes: item.likesCount || 0,
//           comments: item.commentsCount || 0,
//           shares: item.sharesCount || 0,
//           isLiked: false,
//         }));
//     },
//     staleTime: 5 * 60 * 1000, // 5 min
//     refetchOnWindowFocus: false,
//   });
// };

import { getCategoryReel, getReelsByWithMainId } from "@/src/api/reels-api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useReelsByCategory = (
  category: string,
  redirected = false,
  reelId?: string
) => {
  return useInfiniteQuery({
    queryKey: ["reels", category, redirected, reelId],

    queryFn: async ({ pageParam = 1 }) => {

      // 🔗 CASE 1: Deep link se aaye
      if (redirected && reelId) {

        const res = await getReelsByWithMainId(reelId);
        const reelsData = Array.isArray(res?.data) ? res.data : [];

        const parsed = reelsData
          .filter((item: any) => item?.id && item?.videoUrl)
          .map((item: any) => ({
            ...item,
            likes: item.likesCount || 0,
            comments: item.commentsCount || 0,
            shares: item.sharesCount || 0,
            isLiked: item.isLiked || false,
          }));

        return {
          reels: parsed,
          nextPage: 2,
          // nextPage: null,
        };
      }

      // 🎲 CASE 2: Normal behaviour (tumhara existing code)
      console.log("🔥 FETCH reels page:", pageParam);
      const useRandom = pageParam === 1;
      const res = await getCategoryReel(category, pageParam, 20, useRandom);

      const reelsData = Array.isArray(res?.data) ? res.data : [];

      const parsed = reelsData
        .filter((item: any) => item?.id && item?.videoUrl)
        .map((item: any) => ({
          ...item,
          likes: item.likesCount || 0,
          comments: item.commentsCount || 0,
          shares: item.sharesCount || 0,
          isLiked: item.isLiked || false,
        }));

      return {
        reels: parsed,
        nextPage: parsed.length < 20 ? null : pageParam + 1,
      };
    },

    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 0,
    gcTime: 10000,
    refetchOnWindowFocus: false,
  });
};
