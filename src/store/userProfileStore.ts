// import { create } from "zustand";

// interface Video {
//     id: string,
//     uuid: string;
//     videoUrl: string;
//     caption?: string;
//     title?: string;
//     created_at?: string;
// }


// interface ProfileState {
//     username: string;
//     name: string;
//     bio: string;
//     profilePicture: string | null;
//     url: string;
//     likes: number;
//     views: number;
//     followersCount: number;
//     followingsCount: number;
//     postsCountCount: number;
//     videos: Video[];
//     isFollowing: boolean;
//     toggleFollow: () => void;

//     setUsername: (username: string) => void;
//     setName: (name: string) => void;
//     setBio: (bio: string) => void;
//     setProfilePicture: (uri: string | null) => void;
//     setUrl: (url: string) => void;
//     setLikes: (likes: number) => void;
//     setViews: (views: number) => void;
//     setFollowersCount: (followersCount: number) => void;
//     setFollowingsCountsCount: (followingCount: number) => void;
//     setPostCount: (postsCountCount: number) => void;
//     setVideos: (videos: Video[]) => void;
//     resetProfile: () => void;
// }

// export const useProfileStore = create<ProfileState>((set, get) => ({
//     username: "",
//     name: "",
//     bio: "",
//     profilePicture: "https://i.pinimg.com/474x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg?nii=t",
//     url: "https://www.google.com",
//     likes: 0,
//     views: 0,
//     followersCount: 0,
//     followingsCount: 0,
//     postsCountCount: 0,
//     videos: [],
//     isFollowing: false,

//     setUsername: (username) => set({ username }),
//     setName: (name) => set({ name }),
//     setBio: (bio) => set({ bio }),
//     setProfilePicture: (profilePicture) => set({ profilePicture }),
//     setUrl: (url) => set({ url }),
//     setLikes: (likes) => set({ likes }),
//     setViews: (views) => set({ views }),
//     setFollowersCount: (followersCount) => set({ followersCount }),
//     setFollowingsCountsCount: (followingsCount) => set({ followingsCount }),
//     setVideos: (videos) => set({ videos }),
//     setPostCount: (postsCountCount) => set({ postsCountCount }),
//     toggleFollow: () => set({ isFollowing: !get().isFollowing }),
//     resetProfile: () =>
//         set({
//             username: "",
//             name: "",
//             bio: "",
//             profilePicture: null,
//             url: "",
//             likes: 0,
//             views: 0,
//             followersCount: 0,
//             followingsCount: 0,
//             postsCountCount: 0,
//             videos: [],
//         }),
// }));


// ===========================================

import { create } from "zustand";

interface Video {
  id: string;
  uuid: string;
  videoUrl: string;
  caption?: string;
  title?: string;
  created_at?: string;
  isLiked?: boolean;
  likes?: number;
  comments?: number;
  shares?: number;
  profilePicture?: string;
}

interface ProfileState {
  videos: Video[];
  setVideos: (videos: Video[]) => void;

  userInfo: any;
  userProfileInfo: any;
  setUserInfo: (info: any) => void;
  setUserProfileInfo: (info: any) => void;

  username: string;
  userId: string;
  name: string;
  bio: string;
  url : string,
  isFollowing : boolean,
  profilePicture: string | null;
  followersCount: number;
  followingsCount: number;
  postsCount: number;
  likes : number,
  views : number,

  setUsername: (username: string) => void;
  setUserId: (username: string) => void;
  setName: (name: string) => void;
  setBio: (bio: string) => void;
  setUrl: (url: string) => void;
  setProfilePicture: (url: string) => void;
  setFollowersCount: (count: number) => void;
  setFollowingsCount: (count: number) => void;
  setPostCount: (count: number) => void;
  setLikes : (like : number) => void;
  setViews : (view : number) => void;

  toggleFollow: () => void;
  toggleLike: (id: string) => void;
  addComment: (id: string) => void;
  addShare: (id: string) => void;
      resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  videos: [],
  setVideos: (videos) => set({ videos }),

  userInfo: null,
  userProfileInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),
  setUserProfileInfo: (info) => set({ userProfileInfo: info }),

  username: "",
  userId: "",
  name: "",
  bio: "",
  url : "",
  profilePicture: "",
  followersCount: 0,
  followingsCount: 0,
  postsCount: 0,
  likes : 0,
  views : 0,
  isFollowing: false,

  setUsername: (username) => set({ username }),
  setUserId: (userId) => set({ userId }),
  setName: (name) => set({ name }),
  setBio: (bio) => set({ bio }),
  setProfilePicture: (url) => set({ profilePicture: url }),
  setFollowersCount: (count) => set({ followersCount: count }),
  setFollowingsCount: (count) => set({ followingsCount: count }),
  setPostCount: (count) => set({ postsCount: count }),
  setLikes : (count) => set({likes : count}),
  setViews : (count) => set({views : count}),
     setUrl: (url) => set({ url }),


  // ✅ Follow toggle logic
  toggleFollow: () =>
    set((state) => ({
      followersCount:
        state.followersCount > 0 ? state.followersCount - 1 : state.followersCount + 1,
    })),

  // ✅ Like toggle logic
//   toggleLike: (id) =>
//     set((state) => ({
//       videos: state.videos.map((video) =>
//         video.id === id
//           ? {
//               ...video,
//               isLiked: !video.isLiked,
//               likes: video.isLiked
//                 ? (video.likes || 0) - 1
//                 : (video.likes || 0) + 1,
//             }
//           : video
//       ),
//     })),

// toggleLike: (id) =>
//   set((state) => {
//     // Copy array safely (no reference link)
//     const updatedVideos = state.videos.map((video) => {
//       if (video.id === id) {
//         const isLiked = !video.isLiked;
//         const likesCount = isLiked
//           ? (video.likes || 0) + 1
//           : (video.likes || 0) - 1;
//         return { ...video, isLiked, likes: likesCount };
//       }
//       return { ...video }; // clone others too
//     });

//     return { videos: updatedVideos };
//   }),

  toggleLike: (id) =>
    set((state) => ({
      videos: state.videos.map((video) => {
        if (video.id === id) {
          const isLiked = !video.isLiked;
          const likesCount = Math.max(
            0,
            isLiked ? (video.likes || 0) + 1 : (video.likes || 0) - 1
          );
          return { ...video, isLiked, likes: likesCount };
        }
        return video; // baaki videos unchanged
      }),
    })),


  // ✅ Add comment count
  addComment: (id) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === id
          ? { ...video, comments: (video.comments || 0) + 1 }
          : video
      ),
    })),

    

  // ✅ Add share count
  addShare: (id) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === id
          ? { ...video, shares: (video.shares || 0) + 1 }
          : video
      ),
    })),

    resetProfile: () =>
        set({
            username: "",
            // userId: "",
            name: "",
            bio: "",
            profilePicture: null,
            url: "",
            likes: 0,
            views: 0,
            followersCount: 0,
            followingsCount: 0,
            postsCount: 0,
            videos: [],
        }),
}));
