import { useState } from 'react';

interface Reel {
  id: string;
  thumbnail: string;
}

interface Category {
  id: string;
  name: string;
  reels: Reel[];
}

export const useBookmarks = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Travel', reels: [] },
    { id: '2', name: 'Funny', reels: [] },
    { id: '3', name: 'Music', reels: [] },
  ]);

  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);

  const openBookmarkPanel = (reel: Reel) => {
    setSelectedReel(reel);
    setPanelVisible(true);
  };

  const closePanel = () => setPanelVisible(false);

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      reels: [],
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const saveToCategory = (categoryId: string) => {
    if (!selectedReel) return;
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, reels: [...cat.reels, selectedReel] }
          : cat
      )
    );
    closePanel();
  };

  return {
    categories,
    panelVisible,
    openBookmarkPanel,
    closePanel,
    addCategory,
    saveToCategory,
    setCategories
  };
};
