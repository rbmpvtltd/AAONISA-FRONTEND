// src/hooks/useLikeMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeDislike } from "../api/profile-api";

export const useLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn: (storyId: string) => likeDislike(storyId),
    mutationFn: (reelId: string) => likeDislike(reelId),
    onMutate: async (storyId) => {
      await queryClient.cancelQueries({ queryKey: ["userProfile"] });

      const previousData = queryClient.getQueryData<any>(["userProfile"]);

      if (previousData) {
        const updated = {
          ...previousData,
          videos: previousData.videos.map((v: any) =>
            v.uuid === storyId
              ? { ...v, isLiked: !v.isLiked }
              : v
          ),
        };
        queryClient.setQueryData(["userProfile"], updated);
      }

      return { previousData };
    },


    onError: (err, storyId, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(["userProfile"], context.previousData);
      }
      console.log("Like API failed:", err);
    },

    // ✅ On Success — re-fetch fresh profile data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.refetchQueries({ queryKey: ["reels"] });
    },
  });
};
