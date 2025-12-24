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

import { getCategoryReel } from "@/src/api/reels-api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useReelsByCategory = (category: string) => {
  return useInfiniteQuery({
    queryKey: ["reels", category],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await getCategoryReel(category, pageParam, 20);

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
        // nextPage: parsed.length === 20 ? pageParam + 1 : null,
        nextPage: parsed.length < 20 ? null : pageParam + 1,
        
      };
    },

    getNextPageParam: (lastPage) => lastPage.nextPage,

    // caching off — just like Instagram
    initialPageParam: 1,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
};
