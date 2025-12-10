// export { default } from "../../src/features/bookmark/reelscard";

import { GetCurrentUser } from "@/src/api/profile-api";
import SingleReel from "@/src/features/bookmark/reelscard";
import { useLikeMutation } from "@/src/hooks/userLikeMutation";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";

export default function ReelsCard() {

    const { data: currentUser, isLoading: currentUserLoading } = useQuery({
        queryKey: ["currentUser"],
        queryFn: GetCurrentUser,
    });

    const currentUserId = currentUser?.userProfile?.id
    const likeMutation = useLikeMutation();
    return (
        <View>
            <SingleReel
                currentUserId={currentUserId}
                likeMutation={likeMutation}
            />
        </View>
    );
}

