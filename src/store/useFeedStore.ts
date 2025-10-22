// import { create } from "zustand";
// export interface Story {
//   id: number;
//   username: string;
//   profilePic: string;
//   viewed: boolean;
// }

// export interface Comment {
//   username: string;
//   text: string;
//   time: string;
//   profilePic?: string;
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
//   comments: Comment[];
// }

// interface PhotoState {
//   photos: Photo[];
//   stories: Story[];
//   page: number;
//   loading: boolean;
//   isMuted: boolean;
//   setPhotos: (updater: (prev: Photo[]) => Photo[]) => void;
//   addPhotos: (newPhotos: Photo[]) => void;
//   setStories: (updater: (prev: Story[]) => Story[]) => void;
//   addStories: (newStories: Story[]) => void;
//   setPage: (page: number) => void;
//   setLoading: (value: boolean) => void;
//   toggleMute: () => void;
//   reset: () => void;
// }

// export const usePhotoStore = create<PhotoState>((set) => ({
//   photos: [],
//   stories: [],
//   page: 0,
//   loading: false,
//   isMuted: false,

//   setPhotos: (updater) => set((state) => ({ photos: updater(state.photos) })),

//   addPhotos: (newPhotos) =>
//     set((state) => ({
//       photos: [
//         ...state.photos,
//         ...newPhotos.filter(
//           (photo) => !state.photos.some((p) => p.id === photo.id)
//         ),
//       ],
//     })),

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

//   setPage: (page) => set({ page }),
//   setLoading: (value) => set({ loading: value }),
//   toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
//   reset: () => set({ photos: [], stories: [], page: 0, loading: false }),
// }));

// ========================================================================================


import { create } from "zustand";

export interface Photo {
  id: number;
  title: string;
  imageUrl: any;
  profilePic: string;
  username: string;
  likes: number;
  liked: boolean;
  saved: boolean;
   comments: number; // add this
  shares: number;   // add this
}

interface FeedState {
  photos: Photo[];
  page: number;
  loading: boolean;
  isMuted: boolean;
  setPhotos: (updater: (prev: Photo[]) => Photo[]) => void;
  addPhotos: (newPhotos: Photo[]) => void;
  setPage: (page: number) => void;
  setLoading: (value: boolean) => void;
  toggleMute: () => void;
  reset: () => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  photos: [],
  page: 0,
  loading: false,
  isMuted: false,

  // setPhotos: (updater) => set((state) => ({ photos: updater(state.photos) })),
  setPhotos: (updater) =>
  set((state) => ({
    photos: updater(state.photos).map(photo => ({
      ...photo,
      comments: photo.comments ?? 0,
      shares: photo.shares ?? 0,
    })),
  })),


  addPhotos: (newPhotos) =>
    set((state) => ({
      photos: [
        ...state.photos,
        ...newPhotos
        .filter((photo) => !state.photos.some((p) => p.id === photo.id))
        .map(photo => ({
          ...photo,
          comments: photo.comments ?? 0,
          shares: photo.shares ?? 0,
        })),
      ],
    })),

  setPage: (page) => set({ page }),
  setLoading: (value) => set({ loading: value }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  reset: () => set({ photos: [], page: 0, loading: false }),
}));
