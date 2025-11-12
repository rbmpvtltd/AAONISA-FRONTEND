import { useMutation } from "@tanstack/react-query";
import { markViewed } from "../api/profile-api";

export const useMarkViewedMutation = () => {
  return useMutation({
    mutationFn: markViewed,
    onSuccess: () => {
      console.log("✅ View marked successfully!");
    },
    onError: (error) => {
      console.error("❌ Failed to mark view:", error);
    },
  });
};
