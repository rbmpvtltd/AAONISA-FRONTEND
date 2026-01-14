import { queryClient } from "@/app/_layout";
import { useMutation } from "@tanstack/react-query";
import { markViewed } from "../api/profile-api";

export const useMarkViewedMutation = (reelId: string) => {
  return useMutation({
    mutationFn: () => markViewed(reelId),
    onSuccess: (data: any) => {

      if (!data?.viewed) {
        console.log("✅ View marked successfully!");
      }

      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },

    onError: (error) => {
      console.error("❌ Failed to mark view:", error);
    },
  });
};
