// src/queries/storyQuery.ts
import { getAllStories } from "@/src/api/tab-api";
import { useQuery } from "@tanstack/react-query";


export const useStoriesQuery = () => {
  return useQuery({
    queryKey: ["stories"],
    queryFn: getAllStories,
    staleTime: 1000 * 60 * 5, // ✅ 5 minutes
    gcTime: 1000 * 60 * 10,
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
  });
};
