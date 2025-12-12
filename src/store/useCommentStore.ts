import { create } from "zustand";

type UUID = string;

export interface Comment {
  uuid: UUID;
  parentId?: UUID | null;         // null → root comment, value → reply
  username: string;
  content: string;
  mentions: string[];
  userProfile: string;
  time: string;
  replies?: Comment[];
  likedBy: string[];              // usernames of users who liked
}

interface CommentState {
  comments: Record<UUID, Comment[]>; // postId → comments[]

  // CRUD actions
  setComments: (postId: UUID, comments: Comment[]) => void;
  addComment: (postId: UUID, comment: Comment) => void;
  addReply: (postId: UUID, parentId: UUID, reply: Comment) => void;
  deleteComment: (postId: UUID, commentId: UUID) => void;
  toggleLike: (postId: UUID, commentId: UUID, username: string, parentId?: UUID | null) => void;
  clearComments: (postId: UUID) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: {},

  setComments: (postId, comments) =>
    set((state) => ({
      comments: { ...state.comments, [postId]: comments },
    })),

  addComment: (postId, comment) =>{
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: [...(state.comments[postId] || []), comment],
      },
    }))
    },

  addReply: (postId, parentId, reply) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: (state.comments[postId] || []).map((comment) => {
          if (comment.uuid === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply],
            };
          } else {
            return comment;
          }
        }),
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

  // toggleLike: (postId, commentId, username, parentId = null) =>
  //   set((state) => {
  //     const updateLikes = (comment: Comment): Comment => {
  //       const alreadyLiked = comment.likedBy.includes(username);
  //       return {
  //         ...comment,
  //         likedBy: alreadyLiked
  //           ? comment.likedBy.filter((u) => u !== username)
  //           : [...comment.likedBy, username],
  //       };
  //     };

  //     return {
  //       comments: {
  //         ...state.comments,
  //         [postId]: (state.comments[postId] || []).map((comment) => {
  //           if (comment.uuid === commentId && !parentId) {
  //             return updateLikes(comment);
  //           }
  //           if (comment.replies && parentId) {
  //             return {
  //               ...comment,
  //               replies: comment.replies.map((reply) =>
  //                 reply.uuid === commentId ? updateLikes(reply) : reply
  //               ),
  //             };
  //           }
  //           return comment;
  //         }),
  //       },
  //     };
  //   }),

  toggleLike: (postId, commentId, username, parentId = null) =>
  set((state) => {
    console.log("🔥 Toggle Like:", { postId, commentId, username, parentId });
    
    const updateLikes = (comment: Comment): Comment => {
      const alreadyLiked = comment.likedBy.includes(username);
      console.log("  → Comment:", comment.uuid, "Already liked?", alreadyLiked);
      
      return {
        ...comment,
        likedBy: alreadyLiked
          ? comment.likedBy.filter((u) => u !== username)
          : [...comment.likedBy, username],
      };
    };

    return {
      comments: {
        ...state.comments,
        [postId]: (state.comments[postId] || []).map((comment) => {
          if (comment.uuid === commentId && !parentId) {
            console.log("  → Liking main comment");
            return updateLikes(comment);
          }
          
          if (parentId && comment.uuid === parentId) {
            console.log("  → Liking reply in parent:", parentId);
            return {
              ...comment,
              replies: (comment.replies || []).map((reply) => {
                if (reply.uuid === commentId) {
                  console.log("    → Found reply:", commentId);
                  return updateLikes(reply);
                }
                return reply;
              }),
            };
          }
          
          return comment;
        }),
      },
    };
  }),
  clearComments: (postId) =>
    set((state) => {
      const newState = { ...state.comments };
      delete newState[postId];
      return { comments: newState };
    }),
}));
