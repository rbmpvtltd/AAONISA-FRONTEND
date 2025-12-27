// src/queries/storyQuery.ts
import { getAllStories } from "@/src/api/tab-api";
import { useQuery } from "@tanstack/react-query";


export const useStoriesQuery = () => {
  return useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const data = await getAllStories();
      return data || [];
    },
    staleTime: 0,                 
    refetchOnMount: "always",     
    retry: 1,
  });
};
