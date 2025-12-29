

import * as Linking from 'expo-linking';
import { Animated } from 'react-native';
import { create } from 'zustand';

export interface ReelItem {
  id: string;
  uuid: string;
  videoUrl: string;
  user: {
    username: string;
    avatar: string;
  };
  caption?: string;
  // likes?: number;
  // comments?: number;
  shares?: number;
  isLiked?: boolean;
}

interface ReelsState {
  reels: ReelItem[];
  currentIndex: number;
  activeTab: 'Explore' | 'News' | 'Followings';
  isMuted: boolean;
  showIcon: boolean;
  fadeAnim: Animated.Value;
  autoScroll: boolean;                 // NEW: auto scroll toggle

  // Actions
  // toggleLike: (id: string) => void;
  // addComment: (id: string) => void;
  addShare: (id: string) => void;
  setCurrentIndex: (index: number) => void;
  setActiveTab: (tab: 'Explore' | 'News' | 'Followings') => void;
  toggleMute: () => void;
  setShowIcon: (val: boolean) => void;
  setAutoScroll: (value: boolean) => void; // NEW: setter function

  //  fetchReelsByCategory: (category: 'explore' | 'news' | 'followings') => Promise<void>;

  //   NEW: URL Management Functions
  updateReelURL: (reelId: string) => void;
}

export const useReelsStore = create<ReelsState>((set, get) => ({
  reels: [],
  currentIndex: 0,
  activeTab: 'Explore',
  isMuted: false,
  showIcon: false,
  fadeAnim: new Animated.Value(0),
  autoScroll: false,

  addShare: (id: string) =>
    set((state) => ({
      reels: state.reels.map((reel) =>
        // reel.id === id ? { ...reel, shares: reel.shares + 1 } : reel
        reel.uuid === id
          ? { ...reel, shares: (reel.shares ?? 0) + 1 }
          : reel
      ),
    })),

  setCurrentIndex: (index: number) => set({ currentIndex: index }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleMute: () => set({ isMuted: !get().isMuted }),
  setShowIcon: (val: boolean) => set({ showIcon: val }),
  setAutoScroll: (value: boolean) => set({ autoScroll: value }),
  resetReels: () => set({ currentIndex: 0, reels: [] }),


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