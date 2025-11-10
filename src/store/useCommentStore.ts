import { create } from "zustand";

interface ReplyComment {
  uuid: string;
  parentId: string;
  username: string;
  content: string;
  mention?: string | null;
  userProfile: string;
  time: string;
}

interface Comment {
  uuid: string;
  username: string;
  content: string;
  mentions?: string[];
  userProfile: string;
  time: string;
  replyCount: number;
  replies?: ReplyComment[];
}

interface CommentState {
  comments: Record<number, Comment[]>;

  setComments: (postId: number, comments: Comment[]) => void;
  addComment: (postId: number, comment: Comment) => void;
  deleteComment: (postId: number, commentId: string) => void;
  addReply: (postId: number, commentId: string, reply: ReplyComment) => void;
  deleteReply: (postId: number, commentId: string, replyId: string) => void;
  clearComments: (postId: number) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: {},

  setComments: (postId, comments) =>
    set((state) => ({
      comments: { ...state.comments, [postId]: comments },
    })),

  addComment: (postId, comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: [...(state.comments[postId] || []), comment],
      },
    })),

  deleteComment: (postId, commentId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: (state.comments[postId] || []).filter(
          (comment) => comment.uuid !== commentId
        ),
      },
    })),

  addReply: (postId, commentId, reply) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: (state.comments[postId] || []).map((comment) =>
          comment.uuid === commentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), reply],
                replyCount: (comment.replyCount || 0) + 1,
              }
            : comment
        ),
      },
    })),

  deleteReply: (postId, commentId, replyId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: (state.comments[postId] || []).map((comment) =>
          comment.uuid === commentId
            ? {
                ...comment,
                replies: (comment.replies || []).filter(
                  (r) => r.uuid !== replyId
                ),
                replyCount: Math.max((comment.replyCount || 1) - 1, 0),
              }
            : comment
        ),
      },
    })),

  clearComments: (postId) =>
    set((state) => {
      const newState = { ...state.comments };
      delete newState[postId];
      return { comments: newState };
    }),
}));
