// import { create } from "zustand";

// export interface Story {
//   id: number;
//   username: string;
//   profilePic: string;
//   viewed: boolean;
//    videoUrl?: string;
//   duration?: number;
// }

// interface StoryState {
//   stories: Story[];
//   setStories: (updater: (prev: Story[]) => Story[]) => void;
//   addStories: (newStories: Story[]) => void;
//   reset: () => void;
// }

// export const useStoryStore = create<StoryState>((set) => ({
//   stories: [],
//   setStories: (updater) => set((state) => ({ stories: updater(state.stories) })),
//   addStories: (newStories) =>
//     set((state) => ({
//       stories: [
//         ...state.stories,
//         ...newStories.map((story, i) => ({
//           ...story,
//           id: state.stories.length + i + 1,
//         })),
//       ],
//     })),
//   reset: () => set({ stories: [] }),
// }));


import { create } from "zustand";

export interface Story {
  id: string;
  videoUrl: string;
  duration: number;
  viewed: boolean;
}

export interface StoryUser {
  username: string;
  profilePic: string;
  stories: Story[];
  owner: string;
}

interface StoryState {
  userStories: StoryUser[];
  setUserStories: (data: StoryUser[]) => void;
  markStoryViewed: ( storyId: string) => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  userStories: [],

  setUserStories: (data) => set({ userStories: data }),

  markStoryViewed: (storyId) =>
    set((state) => ({
      userStories: state.userStories.map((user) =>
        user.owner
          ? {
              ...user,
              stories: user.stories.map((s) =>
                s.id === storyId ? { ...s, viewed: true } : s
              ),
            }
          : user
      ),
    })),
}));
