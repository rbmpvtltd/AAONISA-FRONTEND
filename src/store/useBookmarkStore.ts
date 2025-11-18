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
  getReelById: (reelId: string) => Reel | null;
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  categories: [],
  panelVisible: false,
  selectedReel: null,

  openBookmarkPanel: (reel) =>
    set({ selectedReel: reel, panelVisible: true }),

  closePanel: () => set({ panelVisible: false }),

  addCategory: (name) => {
    set((state) => {
      const exists = state.categories.some(
        (c) => c.name.trim().toLowerCase() === name.trim().toLowerCase()
      );

      if (exists) {
        console.warn("Category already exists!");
        return state; // ❌ koi new id nahi banegi
      }

      const newCategory = {
        id: Date.now().toString(),
        name,
        reels: [],
      };

      return {
        categories: [...state.categories, newCategory],
      };
    });
  },

  saveToCategory: (categoryId) => {
    const { selectedReel, categories } = get();
    if (!selectedReel) return;

    const updatedCategories = categories.map((cat) => {
      if (cat.id !== categoryId) return cat;

      // 🔥 check if reel already exists
      const alreadySaved = cat.reels.some(r => r.uuid === selectedReel.uuid);
      if (alreadySaved) {
        console.warn("Reel already exists in this category!");
        return cat; // ❌ dobara add nahi hogi
      }

      return { ...cat, reels: [...cat.reels, selectedReel] };
    });

    set({
      categories: updatedCategories,
      panelVisible: false,
    });
  },

  setCategories: (fn) => {
    set((state) => {
      const updated = fn(state.categories);

      // ✅ remove duplicate category names (safety filter)
      const unique = updated.filter(
        (cat, index, arr) =>
          index === arr.findIndex((c) => c.name.toLowerCase() === cat.name.toLowerCase())
      );

      return { categories: unique };
    });
  },

  getReelById: (reelId) => {
    const { categories } = get();
    for (const cat of categories) {
      const found = cat.reels.find((r) => r.uuid === reelId);
      if (found) return found;
    }
    return null;
  },
}));
