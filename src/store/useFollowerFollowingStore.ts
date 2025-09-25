import { create } from "zustand";

interface FollowState {
  followersList: string[];
  followingsList: string[];
  setFollowersList: (followers: string[]) => void;
  setFollowingsList: (followings: string[]) => void;
  getFollowersList: () => string[];
  getFollowingsList: () => string[];
  resetFollow: () => void;
}

export const useFollowStore = create<FollowState>((set, get) => ({
  followersList: [],
  followingsList: [],
  
  setFollowersList: (followersList) => set({ followersList }),
  setFollowingsList: (followingsList) => set({ followingsList }),
  
  getFollowersList: () => get().followersList,
  getFollowingsList: () => get().followingsList,

  resetFollow: () => set({ followersList: [], followingsList: [] }),
}));
