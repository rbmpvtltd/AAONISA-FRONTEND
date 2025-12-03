// // import { create } from "zustand";

// // export interface Story {
// //   id: number;
// //   username: string;
// //   profilePic: string;
// //   viewed: boolean;
// //    videoUrl?: string;
// //   duration?: number;
// // }

// // interface StoryState {
// //   stories: Story[];
// //   setStories: (updater: (prev: Story[]) => Story[]) => void;
// //   addStories: (newStories: Story[]) => void;
// //   reset: () => void;
// // }

// // export const useStoryStore = create<StoryState>((set) => ({
// //   stories: [],
// //   setStories: (updater) => set((state) => ({ stories: updater(state.stories) })),
// //   addStories: (newStories) =>
// //     set((state) => ({
// //       stories: [
// //         ...state.stories,
// //         ...newStories.map((story, i) => ({
// //           ...story,
// //           id: state.stories.length + i + 1,
// //         })),
// //       ],
// //     })),
// //   reset: () => set({ stories: [] }),
// // }));


// import { create } from "zustand";

// export interface Story {
//   id: string;
//   videoUrl: string;
//   duration: number;
//   viewed: boolean;
// }

// export interface StoryUser {
//   username: string;
//   profilePic: string;
//   stories: Story[];
//   owner: string;

// }

// interface StoryState {
//   userStories: StoryUser[];
//   setUserStories: (data: StoryUser[]) => void;
//   markStoryViewed: ( storyId: string) => void;
// }

// export const useStoryStore = create<StoryState>((set) => ({
//   userStories: [],

//   setUserStories: (data) => set({ userStories: data }),

//   markStoryViewed: (storyId) =>
//     set((state) => ({
//       userStories: state.userStories.map((user) =>
//         user.owner
//           ? {
//               ...user,
//               stories: user.stories.map((s) =>
//                 s.id === storyId ? { ...s, viewed: true } : s
//               ),
//             }
//           : user
//       ),
//     })),
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
  self: boolean;
}

interface StoryState {
  userStories: StoryUser[];
  setUserStories: (data: StoryUser[]) => void;
  markStoryViewed: (storyId: string) => void;
  // getNextStory: (currentStoryId: string) => { userId: string; storyId: string } | null;
  // getPreviousStory: (currentStoryId: string) => { userId: string; storyId: string } | null;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  userStories: [],

  setUserStories: (data) => set({ userStories: data }),

  // Optimized: Sirf wo user update karo jiska story hai
  markStoryViewed: (storyId) =>
    set((state) => {
      const userIndex = state.userStories.findIndex(user =>
        user.stories.some(s => s.id === storyId)
      );

      if (userIndex === -1) return state;

      const updatedStories = [...state.userStories];
      updatedStories[userIndex] = {
        ...updatedStories[userIndex],
        stories: updatedStories[userIndex].stories.map(s =>
          s.id === storyId ? { ...s, viewed: true } : s
        ),
      };

      return { userStories: updatedStories };
    }),

  // Helper: Next story logic
  // getNextStory: (currentStoryId) => {
  //   const state = get();
  //   const userIndex = state.userStories.findIndex(u =>
  //     u.stories.some(s => s.id === currentStoryId)
  //   );

  //   if (userIndex === -1) return null;

  //   const user = state.userStories[userIndex];
  //   const storyIndex = user.stories.findIndex(s => s.id === currentStoryId);

  //   // Same user ke next story
  //   if (storyIndex < user.stories.length - 1) {
  //     return {
  //       userId: user.username,
  //       storyId: user.stories[storyIndex + 1].id,
  //     };
  //   }

  //   // Next user ke first story
  //   if (userIndex < state.userStories.length - 1) {
  //     const nextUser = state.userStories[userIndex + 1];
  //     const nextStory = nextUser.stories.find(s => !s.viewed) || nextUser.stories[0];
  //     return {
  //       userId: nextUser.username,
  //       storyId: nextStory.id,
  //     };
  //   }

  //   return null; // No more stories
  // },

  // // Helper: Previous story logic
  // getPreviousStory: (currentStoryId) => {
  //   const state = get();
  //   const userIndex = state.userStories.findIndex(u =>
  //     u.stories.some(s => s.id === currentStoryId)
  //   );

  //   if (userIndex === -1) return null;

  //   const user = state.userStories[userIndex];
  //   const storyIndex = user.stories.findIndex(s => s.id === currentStoryId);

  //   // Same user ke previous story
  //   if (storyIndex > 0) {
  //     return {
  //       userId: user.username,
  //       storyId: user.stories[storyIndex - 1].id,
  //     };
  //   }

  //   // Previous user ke last story
  //   if (userIndex > 0) {
  //     const prevUser = state.userStories[userIndex - 1];
  //     const lastStory = prevUser.stories[prevUser.stories.length - 1];
  //     return {
  //       userId: prevUser.username,
  //       storyId: lastStory.id,
  //     };
  //   }

  //   return null; // No previous stories
  // },
}));