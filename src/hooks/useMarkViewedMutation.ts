import { useMutation } from "@tanstack/react-query";
import { markViewed } from "../api/profile-api";

export const useMarkViewedMutation = (reelId: string) => {
  return useMutation({
    mutationFn: () => markViewed(reelId),
    onSuccess: () => {
      console.log("✅ View marked successfully!");
    },
    onError: (error) => {
      console.error("❌ Failed to mark view:", error);
    },
  });
};
