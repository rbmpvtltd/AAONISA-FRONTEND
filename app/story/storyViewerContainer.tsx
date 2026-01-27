import StoryViewer from "@/app/story/story-viewer";
import { useStoriesQuery } from "@/src/hooks/storyMutation";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
export default function StoryViewerContainer() {
  const router = useRouter();
  const { ownerId, startIndex } = useLocalSearchParams();

  const { data: users = [] } = useStoriesQuery();

  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  // URL → index
  useEffect(() => {
    const idx = users.findIndex(u => u.owner === ownerId);
    if (idx !== -1) setCurrentUserIndex(idx);
  }, [ownerId, users]);

  const prevUser = users[currentUserIndex - 1];
  const currentUser = users[currentUserIndex];
  const nextUser = users[currentUserIndex + 1];

  const goNextUser = () => {
    if (currentUserIndex < users.length - 1) {
      
    } else {
      router.back();
    }
  };

  const goPrevUser = () => {
    if (currentUserIndex > 0) {
        
    } else {
      router.back();
    }
  };

  return (
    <>
      {prevUser && <StoryViewer user={prevUser} isActive={false} />}
      
      {currentUser && (
        <StoryViewer
          user={currentUser}
          isActive
          startIndex={Number(startIndex) || 0}
          onNextUser={goNextUser}
          onPrevUser={goPrevUser}
        />
      )}

      {nextUser && <StoryViewer user={nextUser} isActive={false} />}
    </>
  );
}
