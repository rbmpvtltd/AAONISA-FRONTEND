// ===========================================================================================

// import { create } from "zustand";

// export interface Story {
//   id: number;
//   username: string;
//   profilePic: string;
//   viewed: boolean;
// }

// export interface Photo {
//   id: number;
//   title: string;
//   imageUrl: string;
//   profilePic: string;
//   username: string;
//   likes: number;
//   liked: boolean;
//   saved: boolean;
//   comments: string[];
// }

// interface PhotoState {
//   photos: Photo[];
//   stories: Story[];
//   page: number;
//   loading: boolean;
//   setPhotos: (updater: (prev: Photo[]) => Photo[]) => void;
//   addPhotos: (newPhotos: Photo[]) => void;
//   setStories: (updater: (prev: Story[]) => Story[]) => void;
//   addStories: (newStories: Story[]) => void;
//   setPage: (page: number) => void;
//   setLoading: (value: boolean) => void;
//   reset: () => void;
// }

// export const usePhotoStore = create<PhotoState>((set) => ({
//   photos: [],
//   stories: [],
//   page: 0,
//   loading: false,

//   // Update photos
//   setPhotos: (updater) =>
//     set((state) => ({ photos: updater(state.photos) })),

//   // Add photos safely without duplicates
//   addPhotos: (newPhotos) =>
//     set((state) => ({
//       photos: [
//         ...state.photos,
//         ...newPhotos.filter(
//           (photo) => !state.photos.some((p) => p.id === photo.id)
//         ),
//       ],
//     })),

//   // Update stories
//   setStories: (updater) =>
//     set((state) => ({ stories: updater(state.stories) })),

//   // Add stories safely and ensure unique ids
//   addStories: (newStories) =>
//     set((state) => ({
//       stories: [
//         ...state.stories,
//         ...newStories.map((story, i) => ({
//           ...story,
//           id: story.id + state.stories.length, // ensures unique id
//         })),
//       ],
//     })),

//   setPage: (page) => set({ page }),
//   setLoading: (value) => set({ loading: value }),

//   reset: () => set({ photos: [], stories: [], page: 0, loading: false }),
// }));

// ===========================================================================================
import { create } from "zustand";

export interface Story {
  id: number;
  username: string;
  profilePic: string;
  viewed: boolean;
}

export interface Photo {
  id: number;
  title: string;
  imageUrl: string;
  profilePic: string;
  username: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  comments: string[];
}

interface PhotoState {
  photos: Photo[];
  stories: Story[];
  page: number;
  loading: boolean;
  isMuted: boolean; 
  setPhotos: (updater: (prev: Photo[]) => Photo[]) => void;
  addPhotos: (newPhotos: Photo[]) => void;
  setStories: (updater: (prev: Story[]) => Story[]) => void;
  addStories: (newStories: Story[]) => void;
  setPage: (page: number) => void;
  setLoading: (value: boolean) => void;
  toggleMute: () => void;
  reset: () => void;
  
}

export const usePhotoStore = create<PhotoState>((set) => ({
  photos: [],            // default empty array
  stories: [],           // default empty array
  page: 0,               // default page 0
  loading: false,        // default false
  isMuted: false,

  // Update photos safely
  setPhotos: (updater) => set((state) => ({ photos: updater(state.photos) })),

  // Add new photos without duplicates
  addPhotos: (newPhotos) =>
    set((state) => ({
      photos: [
        ...state.photos,
        ...newPhotos.filter(
          (photo) => !state.photos.some((p) => p.id === photo.id)
        ),
      ],
    })),

  // Update stories safely
  setStories: (updater) => set((state) => ({ stories: updater(state.stories) })),

  // Add new stories and ensure unique IDs
  addStories: (newStories) =>
    set((state) => ({
      stories: [
        ...state.stories,
        ...newStories.map((story, i) => ({
          ...story,
          id: state.stories.length + i + 1, // unique id
        })),
      ],
    })),

  setPage: (page) => set({ page }),

  setLoading: (value) => set({ loading: value }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  // Reset store completely
  reset: () => set({ photos: [], stories: [], page: 0, loading: false }),
}));