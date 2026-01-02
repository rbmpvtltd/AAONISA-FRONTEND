import { useState } from "react";

interface UseLikeProps {
    isLiked?: boolean;
    likesCount?: number;
    id: string;
    likeMutation: {
        mutateAsync: (id: string) => Promise<any>;
    };
}

export const useLike = ({
    isLiked,
    likesCount = 0,
    id,
    likeMutation,
}: UseLikeProps) => {
    const [liked, setLiked] = useState(isLiked);
    const [count, setCount] = useState(likesCount);

    const handleLike = async () => {
        const newLiked = !liked;

        // optimistic UI update
        setLiked(newLiked);
        setCount((prev) => (newLiked ? prev + 1 : Math.max(0, prev - 1)));

        try {
            await likeMutation.mutateAsync(id);
        } catch (error) {
            // rollback on error
            setLiked(!newLiked);
            setCount((prev) => (newLiked ? prev - 1 : prev + 1));
        }
    };

    return {
        liked,
        likesCount: count,
        handleLike,
    };
};




// import { useQueryClient } from "@tanstack/react-query";
// import { useEffect, useState } from "react";

// interface UseLikeProps {
//     isLiked?: boolean;
//     likesCount?: number;
//     id: string;
//     likeMutation: any;
// }

// export const useLike = ({ isLiked = false, likesCount = 0, id, likeMutation }: UseLikeProps) => {
//     const queryClient = useQueryClient();
//     const [liked, setLiked] = useState(isLiked);
//     const [count, setCount] = useState(likesCount);

//     // 🔄 Auto-sync from query cache
//     useEffect(() => {
//         const unsubscribe = queryClient.getQueryCache().subscribe(() => {
//             // ✅ 1. Check reels queries
//             const reelsQueries = queryClient.getQueriesData({ queryKey: ["reels"] });
//             for (const [_, data] of reelsQueries) {
//                 const reel = (data as any)?.pages
//                     ?.flatMap((p: any) => p.reels || [])
//                     .find((r: any) => r.uuid === id || r.id === id);
//                 if (reel) {
//                     setLiked(reel.isLiked);
//                     setCount(reel.likesCount);
//                     return;
//                 }
//             }

//             // ✅ 2. Check userProfile queries (FOR PROFILE PAGE!)
//             const profileQueries = queryClient.getQueriesData({ queryKey: ["userProfile"] });
//             for (const [_, data] of profileQueries) {
//                 const video = (data as any)?.videos?.find(
//                     (v: any) => v.uuid === id || v.id === id
//                 );
//                 if (video) {
//                     setLiked(video.isLiked);
//                     setCount(video.likesCount);
//                     return;
//                 }
//             }

//             // ✅ 3. Check admin-videos-feed if exists
//             const adminData: any = queryClient.getQueryData(["admin-videos-feed"]);
//             if (adminData?.pages) {
//                 const video = adminData.pages
//                     .flatMap((p: any) => p.videos || [])
//                     .find((v: any) => v.uuid === id || v.id === id);
//                 if (video) {
//                     setLiked(video.isLiked);
//                     setCount(video.likesCount);
//                     return;
//                 }
//             }
//         });

//         return () => unsubscribe();
//     }, [id, queryClient]);

//     const handleLike = () => {
//         if (likeMutation.isPending) return;
//         likeMutation.mutate(id);
//     };

//     return { liked, likesCount: count, handleLike };
// };
