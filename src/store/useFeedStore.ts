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
  setPhotos: (updater: (prev: Photo[]) => Photo[]) => void;
  addPhotos: (newPhotos: Photo[]) => void;
    setStories: (updater: (prev: Story[]) => Story[]) => void;  
  addStories: (newStories: Story[]) => void;                
  setPage: (page: number) => void;
  setLoading: (value: boolean) => void;
  reset: () => void;
}

export const usePhotoStore = create<PhotoState>((set) => ({
  photos: [],
   stories: [],
  page: 0,
  loading: false,

  setPhotos: (updater) =>
    set((state) => ({ photos: updater(state.photos) })),

  addPhotos: (newPhotos) =>
    set((state) => ({ photos: [...state.photos, ...newPhotos] })),

  setStories: (updater) =>                        
    set((state) => ({ stories: updater(state.stories) })),

  addStories: (newStories) =>                   
    set((state) => ({ stories: [...state.stories, ...newStories] })),

  setPage: (page) => set({ page }),
  setLoading: (value) => set({ loading: value }),

  reset: () => set({ photos: [],stories: [], page: 0, loading: false }),
}));
