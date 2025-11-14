// import { addCommentApi, deleteCommentApi, getCommentsApi, likeCommentApi } from "@/src/api/comments-api";
// import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import uuid from "react-native-uuid";
// import { useCommentStore } from "../store/useCommentStore";

// export const useGetComments = (postId: string) => {
//   return useQuery({
//     queryKey: ["comments", postId],
//     queryFn: () => getCommentsApi(postId),
//     enabled: !!postId,
//   });
// };


// export const useAddComment = (postId: string) => {
//   const queryClient = useQueryClient();
//   const { addComment, addReply } = useCommentStore();

//   return useMutation({
//     mutationFn: ({ content, mentions, parentId }: any) =>
//       addCommentApi(postId, content, mentions, parentId),

//     // ⭐ UI me instant comment dikhega
//     onMutate: async ({ content, parentId }) => {
//     //   await queryClient.cancelQueries(["comments", postId]);
//     queryClient.invalidateQueries({ queryKey: ['comments', postId] as QueryKey });

//       const previous = queryClient.getQueryData(["comments", postId]);

//       const tempComment = {
//         uuid: uuid.v4().toString(),
//         content,
//         parentId,
//         username: "you",
//         userProfile: "",
//         replies: [],
//         likedBy: [],
//         time: new Date().toLocaleTimeString(),
//       };

//       queryClient.setQueryData(["comments", postId], (old: any) => {
//         if (!old) return old;

//         return {
//           ...old,
//           data: parentId
//             ? old.data.map((c: any) =>
//                 c.uuid === parentId
//                   ? { ...c, replies: [tempComment, ...c.replies] }
//                   : c
//               )
//             : [tempComment, ...old.data],
//         };
//       });

//       return { previous };
//     },

//     onSuccess: (res, { parentId }) => {
//     //   queryClient.invalidateQueries(["comments", postId]);
//     queryClient.invalidateQueries({ queryKey: ['comments', postId] as QueryKey });

//       const saved = res?.data;

//       const normalized = {
//         uuid: saved.id,
//         content: saved.content,
//         username: saved.author?.username || "Unknown",
//         userProfile: saved.author?.userProfile,
//         replies: [],
//         likedBy: [],
//         time: new Date(saved.createdAt).toLocaleTimeString(),
//           mentions: [],
//       };

//       if (parentId) addReply(postId, parentId, normalized);
//       else addComment(postId, normalized);
//     },

//     onError: (_err, _vars, ctx) => {
//       queryClient.setQueryData(["comments", postId], ctx?.previous);
//     },
//   });
// };



// export const useLikeComment = (postId: string) => {
//   const queryClient = useQueryClient();
//   const { toggleLike } = useCommentStore();

//   return useMutation({
//     mutationFn: (commentId: string) => likeCommentApi(commentId),

//     onSuccess: (_, id) => {
//       toggleLike(postId, id, null);
//     //   queryClient.invalidateQueries(["comments", postId]);
//     queryClient.invalidateQueries({ queryKey: ['comments', postId] as QueryKey });
//     },
//   });
// };




// export const useDeleteComment = (postId: string) => {
//   const queryClient = useQueryClient();
//   const { deleteComment } = useCommentStore();

//   return useMutation({
//     mutationFn: (commentId: string) => deleteCommentApi(commentId),

//     onSuccess: (_, id) => {
//       deleteComment(postId, id);
//     //   queryClient.invalidateQueries(["comments", postId]);
//         queryClient.invalidateQueries({ queryKey: ['comments', postId] as QueryKey });

//     },
//   });
// };
