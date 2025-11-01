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
  id: number;
  videoUrl: string;
  duration: number;
  viewed: boolean;
}

interface StoryUser {
  username: string;
  profilePic: string;
  stories: Story[];
}

interface StoryState {
  userStory: StoryUser | null;
  setUserStory: (data: StoryUser) => void;
  markStoryViewed: (storyId: number) => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  userStory: null,
  setUserStory: (data) => set({ userStory: data }),
  markStoryViewed: (storyId) =>
    set((state) => {
      if (!state.userStory) return state;
      return {
        userStory: {
          ...state.userStory,
          stories: state.userStory.stories.map((s) =>
            s.id === storyId ? { ...s, viewed: true } : s
          ),
        },
      };
    }),
}));
