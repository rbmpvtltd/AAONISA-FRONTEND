import { create } from "zustand";

export interface Story {
  id: number;
  username: string;
  profilePic: string;
  viewed: boolean;
}

interface StoryState {
  stories: Story[];
  setStories: (updater: (prev: Story[]) => Story[]) => void;
  addStories: (newStories: Story[]) => void;
  reset: () => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  stories: [],
  setStories: (updater) => set((state) => ({ stories: updater(state.stories) })),
  addStories: (newStories) =>
    set((state) => ({
      stories: [
        ...state.stories,
        ...newStories.map((story, i) => ({
          ...story,
          id: state.stories.length + i + 1,
        })),
      ],
    })),
  reset: () => set({ stories: [] }),
}));
