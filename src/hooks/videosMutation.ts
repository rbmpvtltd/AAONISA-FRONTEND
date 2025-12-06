import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteVideoById } from "../api/story-api";

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteVideoById(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      console.log("Video deleted successfully!");
    },

    onError: (err) => {
      console.log("Delete failed:", err);
    },
  });
};
