// src/store/followStore.ts
import { create } from 'zustand';

export interface Follow {
  id: string;
  username: string;
  name: string;
  userProfilePicture: string | null;
}

interface FollowState {
  followers: Follow[];
  followings: Follow[];
  setFollowers: (followers: Follow[]) => void;
  setFollowings: (followings: Follow[]) => void;
  setFollowState: (followers: Follow[], followings: Follow[]) => void;
  resetFollow: () => void;
}

export const useFollowStore = create<FollowState>((set) => ({
  followers: [],
  followings: [],
  setFollowers: (followers) => set({ followers }),
  setFollowings: (followings) => set({ followings }),
  setFollowState: (followers, followings) => set({ followers, followings }),
  resetFollow: () => set({ followers: [], followings: [] }),
}));
