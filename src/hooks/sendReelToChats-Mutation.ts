import { sendReelToChats } from "@/src/api/chat-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Toast from "react-native-toast-message";


const queryClient = useQueryClient();

export const sendReelMutation = useMutation({
    mutationFn: ({
        reelId,
        sessionIds,
    }: {
        reelId: string;
        sessionIds: string[];
    }) => sendReelToChats(reelId, sessionIds),

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async ({ sessionIds }) => {
        await queryClient.cancelQueries({ queryKey: ["sessions"] });

        const previousSessions = queryClient.getQueryData<any[]>(["sessions"]);

        queryClient.setQueryData(["sessions"], (old: any[] | undefined) => {
            if (!old) return old;

            return old
                .map((session) => {
                    if (sessionIds.includes(session.sessionId)) {
                        return {
                            ...session,
                            latestMessage: {
                                text: JSON.stringify({ type: "reels" }),
                                createdAt: new Date().toISOString(),
                            },
                        };
                    }
                    return session;
                })
                .sort((a, b) => {
                    const tA = new Date(a.latestMessage?.createdAt || a.createdAt).getTime();
                    const tB = new Date(b.latestMessage?.createdAt || b.createdAt).getTime();
                    return tB - tA;
                });
        });

        return { previousSessions };
    },

    // ❌ ERROR → ROLLBACK
    onError: (_err, _vars, context) => {
        if (context?.previousSessions) {
            queryClient.setQueryData(["sessions"], context.previousSessions);
        }

        Toast.show({
            type: "error",
            text1: "Failed to send reel",
        });
    },

    // ✅ SUCCESS
    onSuccess: () => {
        router.back();
        queryClient.invalidateQueries({ queryKey: ["admin-videos-feed"] });
    },

    // 🔁 SYNC WITH SERVER
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
});
