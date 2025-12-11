import { create } from 'zustand';

export const useViewStore = create((set, get) => ({
  story_id: null,
  views: [],

  setNewStory: (story_id:any) => {
    set({
      story_id,
      views: [],
    });
  },

  /** backend se pure views replace karne ke liye */
  setViews: (viewsList:any) => {
    set({ views: viewsList });
  },

  /** Real-time single view push */
  addSingleView: (viewer:any) => {
    const { views } = get() as any;

    const exists = views.find((v:any) => v.view_id === viewer.view_id);
    if (exists) return;

    set({
      views: [
        ...views,
        {
          ...viewer,
          viewedAt: new Date().toISOString(),
        },
      ],
    });
  },

  resetViews: () => set({ views: [] }),
  
}));

// export default useViewStore;
