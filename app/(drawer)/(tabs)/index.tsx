// import { useAppTheme } from "@/src/constants/themeHelper";
// import { FeedList } from "@/src/features/feed/feedList";
// import { StoryList } from "@/src/features/story/storyList";
// import { useFeedStore } from "@/src/store/useFeedStore";
// import { useStoryStore } from "@/src/store/useStoryStore";
// import { useIsFocused } from "@react-navigation/native";
// import React, { useEffect } from "react";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// const HomePage = () => {
//   const theme = useAppTheme();
//   const isFocused = useIsFocused();
//   const { addStories } = useStoryStore();
//   const { setPhotos, toggleMute } = useFeedStore();

//   useEffect(() => {
//     const arr = Array.from({ length: 20 }).map((_, i) => ({
//       id: i + 1,
//       username: "story_" + (i + 1),
//       profilePic: `https://randomuser.me/api/portraits/men/${(i + 1) * 3 % 100}.jpg`,
//       viewed: false,
//        videoUrl: 
// "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
//     duration: 8000, // ms
//     }));
//     addStories(arr);
//   }, []);

//   useEffect(() => {
//     if (!isFocused) {
//       setPhotos((prev) => prev.map((p) => ({ ...p, isPlaying: false })));
//       toggleMute();
//     }
//   }, [isFocused]);

//   return (
//     <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
//       <StoryList theme={theme} />
//       <FeedList />
//     </GestureHandlerRootView>
//   );
// };

// export default HomePage;

import { useAppTheme } from "@/src/constants/themeHelper";
import { FeedList } from "@/src/features/feed/feedList";
import { StoryList } from "@/src/features/story/storyList";
import { useBookmarkStore } from "@/src/store/useBookmarkStore";
import { useFeedStore } from "@/src/store/useFeedStore";
import { useStoryStore } from "@/src/store/useStoryStore";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getAllBookmarks, getAllStories } from "./api";

interface StoryUser {
  username: string;
  profilePic: string;
  stories: Story[];
  owner: string;
}

interface Story {
  id: string;
  videoUrl: string;
  duration: number;
  viewed: boolean;
}
const HomePage = () => {
  const theme = useAppTheme();
  const isFocused = useIsFocused();
  const { setUserStories} = useStoryStore();
  const { setPhotos, toggleMute } = useFeedStore();
  const { setCategories } = useBookmarkStore();

  // useEffect(() => {
  //   setUserStory({
  //     username: "adnan_dev",
  //     profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
  //     stories: [
  //       {
  //         id: 1,
  //         videoUrl:
  //           "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
  //         duration: 10000,
  //         viewed: false,
  //       },
  //       {
  //         id: 2,
  //         videoUrl:
  //           "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback12.mp4",
  //         duration: 7000,
  //         viewed: false,
  //       },
  //        {
  //         id: 3,
  //         videoUrl:
  //       "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback11.mp4",
  //         duration: 7000,
  //         viewed: false,
  //       },
  //        {
  //         id: 4,
  //         videoUrl:
  //       "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback12.mp4",
  //         duration: 7000,
  //         viewed: false,
  //       },
  //        {
  //         id: 5,
  //         videoUrl:
  //            "https://pub-a258ba4c9bd54cb1b6b94b53d2d61324.r2.dev/dummy/videoplayback13.mp4",
  //         duration: 7000,
  //         viewed: false,
  //       },
  //     ],
  //   });
  // }, []);

  useEffect(() => {
    async function loadStories() {
    try {
      const stories = await getAllStories();
      setUserStories(stories);
    } catch (err) {
      console.log("Stories fetch error", err);
    }

    try {
      const bookmarks = await getAllBookmarks();
      setCategories((prev) => [...prev, ...bookmarks]);
    } catch (err) {
      console.log("Bookmarks fetch error", err);
    }
  }

  loadStories();
    if (!isFocused) {
      setPhotos((prev) => prev.map((p) => ({ ...p, isPlaying: false })));
      toggleMute();
    }
  }, [isFocused, setUserStories]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <StoryList theme={theme} />
      <FeedList />
    </GestureHandlerRootView>
  );
};

export default HomePage;
