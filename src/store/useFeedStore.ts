import { create } from "zustand";

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
  page: number;
  loading: boolean;
  setPhotos: (updater: (prev: Photo[]) => Photo[]) => void;
  addPhotos: (newPhotos: Photo[]) => void;
  setPage: (page: number) => void;
  setLoading: (value: boolean) => void;
  reset: () => void;
}

export const usePhotoStore = create<PhotoState>((set) => ({
  photos: [],
  page: 0,
  loading: false,

  setPhotos: (updater) =>
    set((state) => ({ photos: updater(state.photos) })),

  addPhotos: (newPhotos) =>
    set((state) => ({ photos: [...state.photos, ...newPhotos] })),

  setPage: (page) => set({ page }),
  setLoading: (value) => set({ loading: value }),

  reset: () => set({ photos: [], page: 0, loading: false }),
}));
