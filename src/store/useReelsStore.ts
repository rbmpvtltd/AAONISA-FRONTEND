import { create } from 'zustand';

export interface ReelItem {
  id: string;
  videoUrl: string;
  user: {
    username: string;
    avatar: string;
  };
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
}

interface ReelsState {
  reels: ReelItem[];
  toggleLike: (id: string) => void;
  addComment: (id: string) => void;
  addShare: (id: string) => void;
}

export const useReelsStore = create<ReelsState>((set) => ({
  reels: [
    {
      id: '1',
      videoUrl: require('../../assets/video/videoplayback9.mp4'),
      user: {
        username: 'traveler_jane',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000',
      },
      caption: 'Beautiful sunset at the beach 🌅 #travel #sunset #beach',
      likes: 12500,
      comments: 340,
      shares: 89,
      isLiked: false,
    },
    {
      id: '2',
      videoUrl: require('../../assets/video/videoplayback10.mp4'),
      user: {
        username: 'foodie_mike',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000',
      },
      caption: 'Delicious homemade pasta recipe! 🍝 #food #cooking #pasta',
      likes: 8900,
      comments: 210,
      shares: 45,
      isLiked: false,
    },
    {
      id: '3',
      videoUrl: require('../../assets/video/videoplayback11.mp4'),
      user: {
        username: 'fitness_guru',
        avatar:
          'https://images.unsplash.com/photo-1584999734482-0361aecad844?fm=jpg&q=60&w=3000',
      },
      caption: 'Morning workout routine! 💪 #fitness #workout #health',
      likes: 15600,
      comments: 420,
      shares: 120,
      isLiked: false,
    },

      {
      id: '4',
      videoUrl: require('../../assets/video/videoplayback12.mp4'),
      user: {
        username: 'traveler_jane',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000',
      },
      caption: 'Beautiful sunset at the beach 🌅 #travel #sunset #beach',
      likes: 12500,
      comments: 340,
      shares: 89,
      isLiked: false,
    },
    {
      id: '5',
      videoUrl: require('../../assets/video/videoplayback13.mp4'),
      user: {
        username: 'foodie_mike',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000',
      },
      caption: 'Delicious homemade pasta recipe! 🍝 #food #cooking #pasta',
      likes: 8900,
      comments: 210,
      shares: 45,
      isLiked: false,
    },
    {
      id: '6',
      videoUrl: require('../../assets/video/videoplayback9.mp4') ,
      user: {
        username: 'fitness_guru',
        avatar:
          'https://images.unsplash.com/photo-1584999734482-0361aecad844?fm=jpg&q=60&w=3000',
      },
      caption: 'Morning workout routine! 💪 #fitness #workout #health',
      likes: 15600,
      comments: 420,
      shares: 120,
      isLiked: false,
    },
  ],

  toggleLike: (id: string) =>
    set((state) => ({
      reels: state.reels.map((reel) =>
        reel.id === id
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel
      ),
    })),

  addComment: (id: string) =>
    set((state) => ({
      reels: state.reels.map((reel) =>
        reel.id === id ? { ...reel, comments: reel.comments + 1 } : reel
      ),
    })),

  addShare: (id: string) =>
    set((state) => ({
      reels: state.reels.map((reel) =>
        reel.id === id ? { ...reel, shares: reel.shares + 1 } : reel
      ),
    })),
}));
