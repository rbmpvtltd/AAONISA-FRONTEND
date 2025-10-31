import { create } from "zustand";

export interface Story {
  id: number;
  username: string;
  profilePic: string;
  viewed: boolean;
   videoUrl?: string;
  duration?: number;
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


// import { create } from "zustand";

// export interface Story {
//   id: number;
//   username: string;
//   profilePic: string;
//   viewed: boolean;
//   media: {
//     type: "image" | "video";
//     uri: string;
//     duration?: number; // for auto-next logic
//   }[];
// }

// interface StoryState {
//   stories: Story[];
//   currentStoryIndex: number;
//   currentMediaIndex: number;
//   setStories: (updater: (prev: Story[]) => Story[]) => void;
//   addStories: (newStories: Story[]) => void;
//   markAsViewed: (id: number) => void;
//   setCurrentStory: (index: number) => void;
//   setCurrentMedia: (index: number) => void;
//   nextMedia: () => void;
//   previousMedia: () => void;
//   reset: () => void;
// }

// // ✅ Dummy Data for Testing
// const dummyStories: Story[] = [
//   {
//     id: 1,
//     username: "adnan",
//     profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
//     viewed: false,
//     media: [
//       {
//         type: "video",
//         uri: 
//         "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
//         duration: 10,
//       },
//     ],
//   },
//   // {
//   //   id: 2,
//   //   username: "mahir",
//   //   profilePic: "https://randomuser.me/api/portraits/men/50.jpg",
//   //   viewed: false,
//   //   media: [
//   //     {
//   //       type: "image",
//   //       uri: "https://picsum.photos/500/800?random=2",
//   //     },
//   //   ],
//   // },
//   // {
//   //   id: 3,
//   //   username: "sana",
//   //   profilePic: "https://randomuser.me/api/portraits/women/23.jpg",
//   //   viewed: false,
//   //   media: [
//   //     {
//   //       type: "video",
//   //       uri: "https://www.w3schools.com/html/movie.mp4",
//   //       duration: 8,
//   //     },
//   //     {
//   //       type: "image",
//   //       uri: "https://picsum.photos/500/800?random=3",
//   //     },
//   //   ],
//   // },
// ];

// export const useStoryStore = create<StoryState>((set, get) => ({
//   stories: dummyStories, 
//   currentStoryIndex: 0,
//   currentMediaIndex: 0,

//   setStories: (updater) =>
//     set((state) => ({ stories: updater(state.stories) })),

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

//   markAsViewed: (id) =>
//     set((state) => ({
//       stories: state.stories.map((s) =>
//         s.id === id ? { ...s, viewed: true } : s
//       ),
//     })),

//   setCurrentStory: (index) =>
//     set({ currentStoryIndex: index, currentMediaIndex: 0 }),

//   setCurrentMedia: (index) => set({ currentMediaIndex: index }),

//   nextMedia: () => {
//     const { currentMediaIndex, currentStoryIndex, stories } = get();
//     const story = stories[currentStoryIndex];
//     if (!story) return;

//     if (currentMediaIndex < story.media.length - 1) {
//       set({ currentMediaIndex: currentMediaIndex + 1 });
//     } else if (currentStoryIndex < stories.length - 1) {
//       set({ currentStoryIndex: currentStoryIndex + 1, currentMediaIndex: 0 });
//     }
//   },

//   previousMedia: () => {
//     const { currentMediaIndex, currentStoryIndex } = get();
//     if (currentMediaIndex > 0) {
//       set({ currentMediaIndex: currentMediaIndex - 1 });
//     } else if (currentStoryIndex > 0) {
//       set({ currentStoryIndex: currentStoryIndex - 1, currentMediaIndex: 0 });
//     }
//   },

//   reset: () => set({ stories: dummyStories, currentStoryIndex: 0, currentMediaIndex: 0 }),
// }));
