// import { Animated } from 'react-native';
// import { create } from 'zustand';

// export interface ReelItem {
//   id: string;
//   videoUrl: string;
//   user: {
//     username: string;
//     avatar: string;
//   };
//   caption: string;
//   likes: number;
//   comments: number;
//   shares: number;
//   isLiked?: boolean;
// }

// interface ReelsState {
//   reels: ReelItem[];
// //  loading: boolean;
//   setReels: (newReels: ReelItem[]) => void;
//   currentIndex: number;
//   activeTab: 'Followings' | 'News' | 'Explore';
//   isMuted: boolean;
//   showIcon: boolean;
//   fadeAnim: Animated.Value;

//   // Actions
//   toggleLike: (id: string) => void;
//   addComment: (id: string) => void;
//   addShare: (id: string) => void;
//   // setLoading: (val: boolean) => void;
//   setCurrentIndex: (index: number) => void;
//   setActiveTab: (tab: 'Followings' | 'News' | 'Explore') => void;
//   toggleMute: () => void;
//   setShowIcon: (val: boolean) => void;
// }

// export const useReelsStore = create<ReelsState>((set, get) => ({
//   reels: [
//     {
//       id: '1',
//       videoUrl: require('../../assets/video/videoplayback11.mp4'),
//       user: {
//         username: 'traveler_jane',
//         avatar:
//           'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000',
//       },
//       caption: 'Beautiful sunset at the beach 🌅 #travel #sunset #beach',
//       likes: 12500,
//       comments: 340,
//       shares: 89,
//       isLiked: false,
//     },
//     {
//       id: '2',
//       videoUrl: require('../../assets/video/videoplayback10.mp4'),
//       user: {
//         username: 'foodie_mike',
//         avatar:
//           'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000',
//       },
//       caption: 'Delicious homemade pasta recipe! 🍝 #food #cooking #pasta',
//       likes: 8900,
//       comments: 210,
//       shares: 45,
//       isLiked: false,
//     },
//     {
//       id: '3',
//       videoUrl: require('../../assets/video/videoplayback11.mp4'),
//       user: {
//         username: 'fitness_guru',
//         avatar:
//           'https://images.unsplash.com/photo-1584999734482-0361aecad844?fm=jpg&q=60&w=3000',
//       },
//       caption: 'Morning workout routine! 💪 #fitness #workout #health',
//       likes: 15600,
//       comments: 420,
//       shares: 120,
//       isLiked: false,
//     },
//     {
//       id: '4',
//       videoUrl: require('../../assets/video/videoplayback12.mp4'),
//       user: {
//         username: 'traveler_jane',
//         avatar:
//           'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000',
//       },
//       caption: 'Beautiful sunset at the beach 🌅 #travel #sunset #beach',
//       likes: 12500,
//       comments: 340,
//       shares: 89,
//       isLiked: false,
//     },
//     {
//       id: '5',
//       videoUrl: require('../../assets/video/videoplayback13.mp4'),
//       user: {
//         username: 'foodie_mike',
//         avatar:
//           'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000',
//       },
//       caption: 'Delicious homemade pasta recipe! 🍝 #food #cooking #pasta',
//       likes: 8900,
//       comments: 210,
//       shares: 45,
//       isLiked: false,
//     },
//     {
//       id: '6',
//       videoUrl: require('../../assets/video/videoplayback9.mp4'),
//       user: {
//         username: 'fitness_guru',
//         avatar:
//           'https://images.unsplash.com/photo-1584999734482-0361aecad844?fm=jpg&q=60&w=3000',
//       },
//       caption: 'Morning workout routine! 💪 #fitness #workout #health',
//       likes: 15600,
//       comments: 420,
//       shares: 120,
//       isLiked: false,
//     },

//     {
//       id: '7',
//       videoUrl: require('../../assets/video/videoplayback11.mp4'),
//       user: {
//         username: 'traveler_jane',
//         avatar:
//           'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000',
//       },
//       caption: 'Beautiful sunset at the beach 🌅 #travel #sunset #beach',
//       likes: 12500,
//       comments: 340,
//       shares: 89,
//       isLiked: false,
//     },
//     {
//       id: '8',
//       videoUrl: require('../../assets/video/videoplayback10.mp4'),
//       user: {
//         username: 'foodie_mike',
//         avatar:
//           'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000',
//       },
//       caption: 'Delicious homemade pasta recipe! 🍝 #food #cooking #pasta',
//       likes: 8900,
//       comments: 210,
//       shares: 45,
//       isLiked: false,
//     },
//     {
//       id: '9',
//       videoUrl: require('../../assets/video/videoplayback11.mp4'),
//       user: {
//         username: 'fitness_guru',
//         avatar:
//           'https://images.unsplash.com/photo-1584999734482-0361aecad844?fm=jpg&q=60&w=3000',
//       },
//       caption: 'Morning workout routine! 💪 #fitness #workout #health',
//       likes: 15600,
//       comments: 420,
//       shares: 120,
//       isLiked: false,
//     },
//     {
//       id: '10',
//       videoUrl: require('../../assets/video/videoplayback12.mp4'),
//       user: {
//         username: 'traveler_jane',
//         avatar:
//           'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000',
//       },
//       caption: 'Beautiful sunset at the beach 🌅 #travel #sunset #beach',
//       likes: 12500,
//       comments: 340,
//       shares: 89,
//       isLiked: false,
//     },
//     {
//       id: '11',
//       videoUrl: require('../../assets/video/videoplayback13.mp4'),
//       user: {
//         username: 'foodie_mike',
//         avatar:
//           'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000',
//       },
//       caption: 'Delicious homemade pasta recipe! 🍝 #food #cooking #pasta',
//       likes: 8900,
//       comments: 210,
//       shares: 45,
//       isLiked: false,
//     },
//     {
//       id: '12',
//       videoUrl: require('../../assets/video/videoplayback9.mp4'),
//       user: {
//         username: 'fitness_guru',
//         avatar:
//           'https://images.unsplash.com/photo-1584999734482-0361aecad844?fm=jpg&q=60&w=3000',
//       },
//       caption: 'Morning workout routine! 💪 #fitness #workout #health',
//       likes: 15600,
//       comments: 420,
//       shares: 120,
//       isLiked: false,
//     },
//   ],
//   loading: false,

//   setReels: (newReels) => set({ reels: newReels }),
//   // setLoading: (val: boolean) => set({ loading: val }),
  
//   currentIndex: 0,
//   activeTab: 'Followings',
//   isMuted: false,
//   showIcon: false,
//   fadeAnim: new Animated.Value(0),

//   toggleLike: (id: string) =>
//     set((state) => ({
//       reels: state.reels.map((reel) =>
//         reel.id === id
//           ? {
//             ...reel,
//             isLiked: !reel.isLiked,
//             likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
//           }
//           : reel
//       ),
//     })),

//   addComment: (id: string) =>
//     set((state) => ({
//       reels: state.reels.map((reel) =>
//         reel.id === id ? { ...reel, comments: reel.comments + 1 } : reel
//       ),
//     })),

//   addShare: (id: string) =>
//     set((state) => ({
//       reels: state.reels.map((reel) =>
//         reel.id === id ? { ...reel, shares: reel.shares + 1 } : reel
//       ),
//     })),

//   setCurrentIndex: (index: number) => set({ currentIndex: index }),
//   setActiveTab: (tab) => set({ activeTab: tab }),
//   toggleMute: () => set({ isMuted: !get().isMuted }),
//   setShowIcon: (val: boolean) => set({ showIcon: val }),
// }));


// ==============================================================

import * as Linking from 'expo-linking';
import { Animated } from 'react-native';
import { create } from 'zustand';
import { getCategoryReel } from '../api/reels-api';

export interface ReelItem {
  id: string;
  videoUrl: string;
  user: {
    username: string;
    avatar: string;
  };
  caption?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
}

interface ReelsState {
  reels: ReelItem[];
  currentIndex: number;
  activeTab: 'Followings' | 'News' | 'Explore';
  isMuted: boolean;
  showIcon: boolean;
  fadeAnim: Animated.Value;
    autoScroll: boolean;                 // NEW: auto scroll toggle

  // Actions
  toggleLike: (id: string) => void;
  addComment: (id: string) => void;
  addShare: (id: string) => void;
  setCurrentIndex: (index: number) => void;
  setActiveTab: (tab: 'Followings' | 'News' | 'Explore') => void;
  toggleMute: () => void;
  setShowIcon: (val: boolean) => void;
  setAutoScroll: (value: boolean) => void; // NEW: setter function

   fetchReelsByCategory: (category: 'followings' | 'news' | 'explore') => Promise<void>;
  //   NEW: URL Management Functions
  updateReelURL: (reelId: string) => void;
}

export const useReelsStore = create<ReelsState>((set, get) => ({
  reels: [
    // {
    //   id: '1',
    //   videoUrl: 
    //     "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2017.mp4",
    //   user: {
    //     username: 'traveler_jane',
    //     avatar:
    //       'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000',
    //   },
    //   caption: 'Beautiful sunset at the beach 🌅 #travel #sunset #beach',
    //   likes: 12500,
    //   comments: 340,
    //   shares: 89,
    //   isLiked: false,
    // },
    // {
    //   id: '2',
    //   videoUrl: 
    //     "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2016.mp4",
    //   user: {
    //     username: 'foodie_mike',
    //     avatar:
    //       'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000',
    //   },
    //   caption: 'Delicious homemade pasta recipe! 🍝 #food #cooking #pasta',
    //   likes: 8900,
    //   comments: 210,
    //   shares: 45,
    //   isLiked: false,
    // },
    // {
    //   id: '3',
    //   videoUrl: 
    //     "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback10.mp4",
    //   user: {
    //     username: 'fitness_guru',
    //     avatar:
    //       'https://images.unsplash.com/photo-1584999734482-0361aecad844?fm=jpg&q=60&w=3000',
    //   },
    //   caption: 'Morning workout routine! 💪 #fitness #workout #health',
    //   likes: 15600,
    //   comments: 420,
    //   shares: 120,
    //   isLiked: false,
    // },
    // {
    //   id: '4',
    //   videoUrl: 
    //     "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
    //   user: {
    //     username: 'traveler_jane',
    //     avatar:
    //       'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000',
    //   },
    //   caption: 'Beautiful sunset at the beach 🌅 #travel #sunset #beach',
    //   likes: 12500,
    //   comments: 340,
    //   shares: 89,
    //   isLiked: false,
    // },
    // {
    //   id: '5',
    //   videoUrl: 
    //     "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback12.mp4",
    //   user: {
    //     username: 'foodie_mike',
    //     avatar:
    //       'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000',
    //   },
    //   caption: 'Delicious homemade pasta recipe! 🍝 #food #cooking #pasta',
    //   likes: 8900,
    //   comments: 210,
    //   shares: 45,
    //   isLiked: false,
    // },
    // {
    //   id: '6',
    //   videoUrl:
    //     "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback13.mp4",
    //   user: {
    //     username: 'fitness_guru',
    //     avatar:
    //       'https://images.unsplash.com/photo-1584999734482-0361aecad844?fm=jpg&q=60&w=3000',
    //   },
    //   caption: 'Morning workout routine! 💪 #fitness #workout #health',
    //   likes: 15600,
    //   comments: 420,
    //   shares: 120,
    //   isLiked: false,
    // },
    // {
    //   id: '7',
    //   videoUrl: 
    //     "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback18.mp4",
    //   user: {
    //     username: 'traveler_jane',
    //     avatar:
    //       'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000',
    //   },
    //   caption: 'Beautiful sunset at the beach 🌅 #travel #sunset #beach',
    //   likes: 12500,
    //   comments: 340,
    //   shares: 89,
    //   isLiked: false,
    // },
    // {
    //   id: '8',
    //   videoUrl: 
    //     "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback3.mp4",
    //   user: {
    //     username: 'foodie_mike',
    //     avatar:
    //       'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000',
    //   },
    //   caption: 'Delicious homemade pasta recipe! 🍝 #food #cooking #pasta',
    //   likes: 8900,
    //   comments: 210,
    //   shares: 45,
    //   isLiked: false,
    // },
    // {
    //   id: '9',
    //   videoUrl: 
    //     "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback5.mp4",
    //   user: {
    //     username: 'fitness_guru',
    //     avatar:
    //       'https://images.unsplash.com/photo-1584999734482-0361aecad844?fm=jpg&q=60&w=3000',
    //   },
    //   caption: 'Morning workout routine! 💪 #fitness #workout #health',
    //   likes: 15600,
    //   comments: 420,
    //   shares: 120,
    //   isLiked: false,
    // },
    // {
    //   id: '10',
    //   videoUrl: 
    //     "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback7.mp4",
    //   user: {
    //     username: 'traveler_jane',
    //     avatar:
    //       'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000',
    //   },
    //   caption: 'Beautiful sunset at the beach 🌅 #travel #sunset #beach',
    //   likes: 12500,
    //   comments: 340,
    //   shares: 89,
    //   isLiked: false,
    // },
    // {
    //   id: '11',
    //   videoUrl: 
    //     "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback9.mp4",
    //   user: {
    //     username: 'foodie_mike',
    //     avatar:
    //       'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000',
    //   },
    //   caption: 'Delicious homemade pasta recipe! 🍝 #food #cooking #pasta',
    //   likes: 8900,
    //   comments: 210,
    //   shares: 45,
    //   isLiked: false,
    // },
    // {
    //   id: '12',
    //   videoUrl: 
    //     "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback%2017.mp4",
    //   user: {
    //     username: 'fitness_guru',
    //     avatar:
    //       'https://images.unsplash.com/photo-1584999734482-0361aecad844?fm=jpg&q=60&w=3000',
    //   },
    //   caption: 'Morning workout routine! 💪 #fitness #workout #health',
    //   likes: 15600,
    //   comments: 420,
    //   shares: 120,
    //   isLiked: false,
    // },
  ],

  currentIndex: 0,
  activeTab: 'Followings',
  isMuted: false,
  showIcon: false,
  fadeAnim: new Animated.Value(0),
   autoScroll: false,    

fetchReelsByCategory: async (category) => {
  try {
    const res = await getCategoryReel(category, 1, 10);
    console.log("API response for", category, ":", res);

    const reelsData = Array.isArray(res?.data) ? res.data : [];
    const cleanData = reelsData
      .filter((item: any) => item && item.id && item.videoUrl)
      .map((item : any) => ({
        ...item,
        likes: item.likesCount || 0,
        comments: item.commentsCount || 0,
        shares: item.sharesCount || 0,
        isLiked: false,
      }));

    console.log("Cleaned Reels Data:", cleanData);
    set({ reels: cleanData });
  } catch (err) {
    console.error("Error fetching reels:", err);
    set({ reels: [] });
  }
},

  toggleLike: (id: string) =>
    set((state) => ({
      reels: state.reels.map((reel) =>
        reel.id === id
          ? {
            ...reel,
            isLiked: !reel.isLiked,
             likes: (reel.likes ?? 0) + (reel.isLiked ? -1 : 1), 
            // likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
          }
          : reel
      ),
    })),

  addComment: (id: string) =>
    set((state) => ({
      reels: state.reels.map((reel) =>
        reel.id === id ? 
      // { ...reel, comments: reel.comments + 1 } : reel
  { ...reel, comments: (reel.comments ?? 0) + 1 } : reel
      ),
    })),

  addShare: (id: string) =>
    set((state) => ({
      reels: state.reels.map((reel) =>
        // reel.id === id ? { ...reel, shares: reel.shares + 1 } : reel
      reel.id === id
        ? { ...reel, shares: (reel.shares ?? 0) + 1 } 
        : reel
      ),
    })),

  setCurrentIndex: (index: number) => set({ currentIndex: index }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleMute: () => set({ isMuted: !get().isMuted }),
  setShowIcon: (val: boolean) => set({ showIcon: val }),
    setAutoScroll: (value: boolean) => set({ autoScroll: value }), 

  //  NEW: URL Update Function
  updateReelURL: (reelId: string) => {
    // Expo Router ke through URL update karo
    const currentState = get();
    // console.log('URL Updated to Reel:', reelId);
    
    // Deep link URL create karo (for sharing purposes)
    const deepLinkUrl = Linking.createURL(`/reels/${reelId}`);
    // console.log('Deep Link:', deepLinkUrl);
  },
}));