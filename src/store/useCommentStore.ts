import { create } from "zustand";

interface Comment {
  id: number;
  username: string;
  text: string;
  time: string;
  profilePic: string;
}

interface CommentState {
  comments: Record<number, Comment[]>; // comments stored by photo id
  addComment: (photoId: number, comment: Comment) => void;
  deleteComment: (photoId: number, commentId: number) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: {},

  addComment: (photoId, comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [photoId]: [...(state.comments[photoId] || []), comment],
      },
    })),

  deleteComment: (photoId, commentId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [photoId]: (state.comments[photoId] || []).filter(
          (c) => c.id !== commentId
        ),
      },
    })),
}));
