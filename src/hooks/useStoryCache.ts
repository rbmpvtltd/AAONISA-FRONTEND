import { useQueryClient } from "@tanstack/react-query";

export const useStoriesCache = () => {
  const queryClient = useQueryClient();
const sortUsersByStoryState = (users:any[]) => {
  const selfUser = users.find((u) => u.self);
  const others = users.filter((u) => !u.self);

  const unviewed = [] as any[];
  const viewed = [] as any[];

  others.forEach((user) => {
    const hasUnviewed = user.stories.some((s:any) => !s.viewed);
    if (hasUnviewed) unviewed.push(user);
    else viewed.push(user);
  });

  unviewed.sort((a, b) => {
    const aTime = a.stories.find((s:any) => !s.viewed)?.created_at;
    const bTime = b.stories.find((s:any) => !s.viewed)?.created_at;
    return (new Date(aTime) as any) - (new Date(bTime) as any);
  });

  viewed.sort((a, b) => {
    const aLast = a.stories[a.stories.length - 1]?.created_at;
    const bLast = b.stories[b.stories.length - 1]?.created_at;
    return (new Date(bLast) as any) - (new Date(aLast) as any);
  });

  return selfUser ? [selfUser, ...unviewed, ...viewed] : [...unviewed, ...viewed];
};
const markStoriesViewed = (
  users:any,
  ownerId:any,
  lastViewedIndex:any
) => {
  return users.map((user:any) => {
    if (user.owner !== ownerId) return user;

    return {
      ...user,
      stories: user.stories.map((story:any, index:any) => ({
        ...story,
        viewed: index <= lastViewedIndex ? true : story.viewed,
      })),
    };
  });
};

  const onViewerClose = (ownerId:any, lastViewedIndex:any) => {
    queryClient.setQueryData(["stories"], (old:any) => {
      if (!old) return old;

      const updated = markStoriesViewed(old, ownerId, lastViewedIndex);
      return sortUsersByStoryState(updated);
    });
  };

  return { onViewerClose };
};
