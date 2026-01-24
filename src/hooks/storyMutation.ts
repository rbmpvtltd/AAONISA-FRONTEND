// src/queries/storyQuery.ts
import { getAllStories } from "@/src/api/tab-api";
import { useQuery } from "@tanstack/react-query";


export const useStoriesQuery = () => {
  const sortUsersByStoryState = (users: any[]) => {
    const selfUser = users.find((u) => u.self);
    const others = users.filter((u) => !u.self);

    const unviewed = [] as any[];
    const viewed = [] as any[];

    others.forEach((user) => {
      const hasUnviewed = user.stories.some((s: any) => !s.viewed);
      if (hasUnviewed) unviewed.push(user);
      else viewed.push(user);
    });

    unviewed.sort((a, b) => {
      const aTime = a.stories.find((s: any) => !s.viewed)?.created_at;
      const bTime = b.stories.find((s: any) => !s.viewed)?.created_at;
      return (new Date(aTime) as any) - (new Date(bTime) as any);
    });

    viewed.sort((a, b) => {
      const aLast = a.stories[a.stories.length - 1]?.created_at;
      const bLast = b.stories[b.stories.length - 1]?.created_at;
      return (new Date(bLast) as any) - (new Date(aLast) as any);
    });

    return selfUser ? [selfUser, ...unviewed, ...viewed] : [...unviewed, ...viewed];
  };
  return useQuery({
    queryKey: ["stories"],
    queryFn: getAllStories,
    staleTime: 1000 * 60 * 5, // ✅ 5 minutes
    gcTime: 1000 * 60 * 10,
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    select: (data) => {
      return sortUsersByStoryState(data);
    },
  });
};

// adnan
