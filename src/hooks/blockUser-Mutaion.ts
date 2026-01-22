import { useQuery } from "@tanstack/react-query";
import { getblockedUsers } from "../api/profile-api";

export const useBlockedUsers = () => {
    return useQuery({
        queryKey: ["blockedUsers"],
        queryFn: getblockedUsers,
    });
};