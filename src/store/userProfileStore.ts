import { create } from "zustand";

interface Video {
    id : string,
  uuid: string;
  videoUrl: string;
  caption?: string;
  title?: string;
  created_at?: string;
}

interface ProfileState {
    username: string;
    name: string;
    bio: string;
    profilePicture: string | null;
    url: string;
    likes: number;   
    views: number;  
    followersCount: number;
    followingsCount: number;
    postsCount: number;
    videos : Video[];
     isFollowing: boolean; 
  toggleFollow: () => void; 

    setUsername: (username: string) => void;
    setName: (name: string) => void;
    setBio: (bio: string) => void;
    setProfilePicture: (uri: string | null) => void;
    setUrl: (url: string) => void;
    setLikes: (likes: number) => void;  
    setViews: (views: number) => void;   
    setFollowersCount: (followersCount: number) => void;
    setFollowingsCount: (followingCount: number) => void;
    setPostCount: (postsCount: number) => void;
       setVideos: (videos: Video[]) => void;
    resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set,get) => ({
    username: "",
    name: "",
    bio: "",
    profilePicture: "https://i.pinimg.com/474x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg?nii=t",
    url: "https://www.google.com",
    likes: 0,
    views: 0,
    followersCount: 0,
    followingsCount: 0,
    postsCount: 0,
     videos: [],
    isFollowing: false,
    
    setUsername: (username) => set({ username }),
    setName: (name) => set({ name }),
    setBio: (bio) => set({ bio }),
    setProfilePicture: (profilePicture) => set({ profilePicture }),
    setUrl: (url) => set({ url }),
    setLikes: (likes) => set({ likes }),
    setViews: (views) => set({ views }),
    setFollowersCount: (followersCount) => set({ followersCount }),
    setFollowingsCount: (followingsCount) => set({ followingsCount }),
    setVideos: (videos) => set({ videos }),
    setPostCount: (postsCount) => set({ postsCount }),
       toggleFollow: () => set({ isFollowing: !get().isFollowing }),
    resetProfile: () =>
        set({
            username: "",
            name: "",
            bio: "",
            profilePicture: null,
            url: "",
            likes: 0,   
            views: 0,
            followersCount: 0,
            followingsCount: 0,
            postsCount: 0,
            videos : [],
        }),
}));
