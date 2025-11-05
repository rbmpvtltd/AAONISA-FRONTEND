import { create } from 'zustand';

interface Reel {
  uuid: string;
  thumbnail: string;
  videoUrl: string;
}

interface Category {
  id: string;
  name: string;
  reels: Reel[];
}

interface BookmarkStore {
  categories: Category[];
  panelVisible: boolean;
  selectedReel: Reel | null;

  openBookmarkPanel: (reel: Reel) => void;
  closePanel: () => void;

  addCategory: (name: string) => void;
  saveToCategory: (categoryId: string) => void;

  setCategories: (fn: (prev: Category[]) => Category[]) => void;
  getReelById: (reelId: string | string) => Reel | null;
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  categories: [

  ],

  panelVisible: false,
  selectedReel: null,

  openBookmarkPanel: (reel) =>
    set({
      selectedReel: reel,
      panelVisible: true,
    }),

  closePanel: () => set({ panelVisible: false }),

  addCategory: (name) => {
    set((state) => {
      const exists = state.categories.some(
        c => c.name.trim().toLowerCase() === name.trim().toLowerCase()
      );

      if (exists) {
        console.warn("Category already exists!");
        return state; // ❌ don't add duplicate
      }

      const newCat = { id: Date.now().toString(), name, reels: [] };

      return {
        categories: [...state.categories, newCat]
      };
    });
  },


  saveToCategory: (categoryId) => {
    const { selectedReel, categories } = get();
    if (!selectedReel) return;

    const updated = categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, reels: [...cat.reels, selectedReel] }  // ✅ correct object
        : cat
    );

    set({
      categories: updated,
      panelVisible: false,
    });
  },

  setCategories: (updateFn) =>
    set((state) => ({
      categories: updateFn(state.categories),
    })),
  getReelById: (reelId: string | undefined) => {
    const { categories } = get();
    for (let c of categories) {
      const found = c.reels.find(r => r.uuid === reelId);
      if (found) return found;
    }
    return null;
  }
}));
