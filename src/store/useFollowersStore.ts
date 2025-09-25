import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isFollowing: boolean;
}

interface FollowersState {
  followers: User[];
  following: User[];
  toggleFollow: (id: string) => void;
  removeFollowing: (id: string) => void;
  setFollowers: (users: User[]) => void;
  setFollowing: (users: User[]) => void;
}

export const useFollowersStore = create<FollowersState>((set) => ({
  followers: [],
  following: [],
  toggleFollow: (id) =>
    set((state) => {
      // Toggle in followers list if user exists there
      const updatedFollowers = state.followers.map((u) =>
        u.id === id ? { ...u, isFollowing: !u.isFollowing } : u
      );

      // If following list exists, add/remove from it based on toggle
      const user = updatedFollowers.find((u) => u.id === id);
      let updatedFollowing = state.following;
      if (user) {
        if (user.isFollowing) {
          updatedFollowing = [...state.following, user];
        } else {
          updatedFollowing = state.following.filter((f) => f.id !== id);
        }
      }

      return { followers: updatedFollowers, following: updatedFollowing };
    }),
  removeFollowing: (id) =>
    set((state) => ({
      following: state.following.filter((u) => u.id !== id),
      followers: state.followers.map((u) =>
        u.id === id ? { ...u, isFollowing: false } : u
      ),
    })),
  setFollowers: (users) => set({ followers: users }),
  setFollowing: (users) => set({ following: users }),
}));
