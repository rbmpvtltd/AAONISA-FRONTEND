// src/hooks/useLikeMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeDislike } from "../api/profile-api";

export const useLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn: (storyId: string) => likeDislike(storyId),
    mutationFn: (reelId: string) => likeDislike(reelId),
    // onMutate: async (storyId) => {
    //   await queryClient.cancelQueries({ queryKey: ["userProfile"] });

    //   const previousData = queryClient.getQueryData<any>(["userProfile"]);

    //   if (previousData) {
    //     const updated = {
    //       ...previousData,
    //       videos: previousData.videos.map((v: any) =>
    //         v.uuid === storyId
    //           ? { ...v, isLiked: !v.isLiked }
    //           : v
    //       ),
    //     };
    //     queryClient.setQueryData(["userProfile"], updated);
    //   }

    //   return { previousData };
    // },


    onError: (err, storyId, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(["userProfile"], context.previousData);
      }
      console.log("Like API failed:", err);
    },

    // ✅ On Success — re-fetch fresh profile data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["reels"] });
      queryClient.invalidateQueries({ queryKey: ["admin-videos-feed"] });
    },
  });
};




// // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // import { likeDislike } from "../api/profile-api";

// // export const useLikeMutation = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     // mutationFn: (storyId: string) => likeDislike(storyId),
// //     mutationFn: (reelId: string) => likeDislike(reelId),

// //     // On Success — re-fetch fresh profile data
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["userProfile"] });
// //       queryClient.invalidateQueries({ queryKey: ["reels"] });
// //       queryClient.invalidateQueries({ queryKey: ["admin-videos-feed"] });
// //     },

// //     onError: (err, storyId, context: any) => {
// //       if (context?.previousData) {
// //         queryClient.setQueryData(["userProfile"], context.previousData);
// //       }
// //       console.log("Like API failed:", err);
// //     },
// //   });
// // };

// src/hooks/useLikeMutation.ts
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { likeDislike } from "../api/profile-api";

// export const useLikeMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (reelId: string) => likeDislike(reelId),

//     // ✅ YAHI MISSING THA - Optimistic Update
//     onMutate: async (reelId) => {
//       // 🛑 Cancel outgoing queries
//       await queryClient.cancelQueries({ queryKey: ["reels"] });
//       await queryClient.cancelQueries({ queryKey: ["userProfile"] });
//       await queryClient.cancelQueries({ queryKey: ["admin-videos-feed"] });

//       const previousData: any = {};

//       // 🔄 Toggle like helper
//       const toggleLike = (item: any) => {
//         if (item.uuid === reelId || item.id === reelId) {
//           return {
//             ...item,
//             isLiked: !item.isLiked,
//             likesCount: item.isLiked
//               ? Math.max(0, (item.likesCount || 0) - 1)
//               : (item.likesCount || 0) + 1,
//           };
//         }
//         return item;
//       };

//       // ✅ 1. Update ALL "reels" queries
//       queryClient.getQueriesData({ queryKey: ["reels"] }).forEach(([key, data]: any) => {
//         if (data?.pages) {
//           previousData[JSON.stringify(key)] = data;
//           queryClient.setQueryData(key, {
//             ...data,
//             pages: data.pages.map((page: any) => ({
//               ...page,
//               reels: page.reels?.map(toggleLike) || [],
//             })),
//           });
//         }
//       });

//       // ✅ 2. Update ALL "userProfile" queries (PROFILE PAGE KE LIYE)
//       queryClient.getQueriesData({ queryKey: ["userProfile"] }).forEach(([key, data]: any) => {
//         if (data?.videos) {
//           previousData[JSON.stringify(key)] = data;
//           queryClient.setQueryData(key, {
//             ...data,
//             videos: data.videos.map(toggleLike),
//           });
//         }
//       });

//       // ✅ 3. Update "admin-videos-feed"
//       const adminData: any = queryClient.getQueryData(["admin-videos-feed"]);
//       if (adminData?.pages) {
//         previousData["admin-videos-feed"] = adminData;
//         queryClient.setQueryData(["admin-videos-feed"], {
//           ...adminData,
//           pages: adminData.pages.map((page: any) => ({
//             ...page,
//             videos: page.videos?.map(toggleLike) || [],
//           })),
//         });
//       }

//       console.log("✅ Optimistic update applied");
//       return { previousData };
//     },

//     onError: (err, reelId, context: any) => {
//       // ⏪ Rollback on error
//       if (context?.previousData) {
//         Object.entries(context.previousData).forEach(([key, data]) => {
//           const queryKey = key === "admin-videos-feed"
//             ? ["admin-videos-feed"]
//             : JSON.parse(key);
//           queryClient.setQueryData(queryKey, data);
//         });
//       }
//       console.error("❌ Like API failed:", err);
//     },

//     onSuccess: () => {
//       // ♻️ Refetch for server sync
//       queryClient.invalidateQueries({ queryKey: ["reels"] });
//       queryClient.invalidateQueries({ queryKey: ["userProfile"] });
//       queryClient.invalidateQueries({ queryKey: ["admin-videos-feed"] });

//       console.log("✅ Like synced");
//     },
//   });
// };