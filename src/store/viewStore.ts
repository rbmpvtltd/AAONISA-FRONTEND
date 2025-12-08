import { create } from 'zustand';

const useViewStore = create((set, get) => ({
  story_id: null,
  views: [],

  setNewStory: (story_id:any) => {
    set({
      story_id,
      views: [],
    });
  },

  addSingleView: (viewer:any) => {
    const { views } = get() as any;

    const alreadyViewed = views.find((v:any) => v.userId === viewer.userId);
    if (alreadyViewed) return;

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

export default useViewStore;
