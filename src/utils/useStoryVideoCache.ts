// import * as FileSystem from "expo-file-system";
// import { useCallback, useRef } from "react";

// const VIDEO_DIR = FileSystem.cacheDirectory + "stories/";
// const WINDOW_SIZE = 1; // prev / current / next

// type StoryChangeParams = {
//   userId: string;
//   storyIndex: number;
//   totalStories: number;
//   storyUrls: string[]; // index aligned
// };

// type ViewerCloseParams = {
//   userId: string;
//   storyUrls: string[];
// };

// export function useStoryVideoCache() {
//   const lastStateRef = useRef<{
//     userId: string | null;
//     protectedIndexes: number[];
//   }>({
//     userId: null,
//     protectedIndexes: [],
//   });

//   /** ---------------- UTILS ---------------- */

//   const getFilenameFromUrl = (url: string) => {
//     return url.split("/").pop();
//   };

//   const getLocalPath = (url: string) => {
//     const name = getFilenameFromUrl(url);
//     if (!name) return null;
//     return VIDEO_DIR + name;
//   };

//   const ensureDir = async () => {
//     await FileSystem.makeDirectoryAsync(VIDEO_DIR, {
//       intermediates: true,
//     });
//   };

//   /** ---------------- CORE LOGIC ---------------- */

//   const calculateProtectedIndexes = (
//     index: number,
//     total: number
//   ): number[] => {
//     const result: number[] = [];
//     for (let i = index - WINDOW_SIZE; i <= index + WINDOW_SIZE; i++) {
//       if (i >= 0 && i < total) result.push(i);
//     }
//     return result;
//   };

//   const evictUnprotected = async (
//     storyUrls: string[],
//     protectedIndexes: number[]
//   ) => {
//     await ensureDir();

//     const protectedSet = new Set(protectedIndexes);

//     await Promise.all(
//       storyUrls.map(async (url, index) => {
//         if (protectedSet.has(index)) return;

//         const path = getLocalPath(url);
//         if (!path) return;

//         try {
//           const info = await FileSystem.getInfoAsync(path);
//           if (info.exists) {
//             await FileSystem.deleteAsync(path, { idempotent: true });
//             console.log("🗑 Evicted story cache:", path);
//           }
//         } catch (e) {
//           console.warn("Eviction failed:", path);
//         }
//       })
//     );
//   };

//   /** ---------------- PUBLIC API ---------------- */

//   const onStoryChange = useCallback(
//     async ({
//       userId,
//       storyIndex,
//       totalStories,
//       storyUrls,
//     }: StoryChangeParams) => {
//       const protectedIndexes = calculateProtectedIndexes(
//         storyIndex,
//         totalStories
//       );

//       const last = lastStateRef.current;

//       // Same user, same window → do nothing
//       if (
//         last.userId === userId &&
//         JSON.stringify(last.protectedIndexes) ===
//           JSON.stringify(protectedIndexes)
//       ) {
//         return;
//       }

//       lastStateRef.current = {
//         userId,
//         protectedIndexes,
//       };

//       // Evict safely (async, non-blocking)
//       evictUnprotected(storyUrls, protectedIndexes);
//     },
//     []
//   );

//   const onViewerClose = useCallback(
//     async ({ storyUrls }: ViewerCloseParams) => {
//       // Viewer close = all stories safe to evict
//       await ensureDir();

//       await Promise.all(
//         storyUrls.map(async (url) => {
//           const path = getLocalPath(url);
//           if (!path) return;

//           try {
//             const info = await FileSystem.getInfoAsync(path);
//             if (info.exists) {
//               await FileSystem.deleteAsync(path, { idempotent: true });
//               console.log("🧹 Cleared on viewer close:", path);
//             }
//           } catch {}
//         })
//       );

//       lastStateRef.current = {
//         userId: null,
//         protectedIndexes: [],
//       };
//     },
//     []
//   );

//   return {
//     onStoryChange,
//     onViewerClose,
//   };
// }
import * as FileSystem from "expo-file-system";
import { useCallback, useRef } from "react";

const VIDEO_DIR = FileSystem.cacheDirectory + "stories/";
const STORY_WINDOW = 1; // prev / current / next
const USER_WINDOW = 1; // prev / current / next user

type StoryUrlsMap = Record<string, string[]>; // userId -> storyUrls[]

type StoryChangeParams = {
  currentUserIndex: number;
  currentIndex: number;
  totalUsers: number;
  userIds: string[]; // ordered list of userIds
  storyUrlsMap: StoryUrlsMap;
};

type ViewerCloseParams = {
  userId: string;
  storyUrls: string[];
};

export function useStoryVideoCache() {
  const lastStateRef = useRef<{
    protectedUsers: Record<string, number[]>; // userId -> protected story indexes
  }>({
    protectedUsers: {},
  });

  /** ---------------- UTILS ---------------- */
  const getFilenameFromUrl = (url: string) => url.split("/").pop();
  const getLocalPath = (url: string) => {
    const name = getFilenameFromUrl(url);
    if (!name) return null;
    return VIDEO_DIR + name;
  };
  const ensureDir = async () => {
    await FileSystem.makeDirectoryAsync(VIDEO_DIR, { intermediates: true });
  };

  /** ---------------- CORE LOGIC ---------------- */
  const calculateStoryWindow = (index: number, total: number) => {
    const result: number[] = [];
    for (let i = index - STORY_WINDOW; i <= index + STORY_WINDOW; i++) {
      if (i >= 0 && i < total) result.push(i);
    }
    return result;
  };

  const evictStories = async (storyUrlsMap: StoryUrlsMap, protectedUsers: Record<string, number[]>) => {
    await ensureDir();

    for (const userId in storyUrlsMap) {
      const urls = storyUrlsMap[userId];
      const protectedIndexes = protectedUsers[userId] || [];

      const protectedSet = new Set(protectedIndexes);

      await Promise.all(
        urls.map(async (url, index) => {
          if (protectedSet.has(index)) return;

          const path = getLocalPath(url);
          if (!path) return;

          try {
            const info = await FileSystem.getInfoAsync(path);
            if (info.exists) {
              await FileSystem.deleteAsync(path, { idempotent: true });
              console.log(`🗑 Evicted story cache for user ${userId}:`, path);
            }
          } catch (e) {
            console.warn(`Eviction failed for ${path}`);
          }
        })
      );
    }
  };

  /** ---------------- PUBLIC API ---------------- */

  const onStoryChange = useCallback(
    async ({ currentUserIndex, currentIndex, totalUsers, userIds, storyUrlsMap }: StoryChangeParams) => {
      const protectedUsers: Record<string, number[]> = {};

      // Calculate protected users (current + prev + next)
      const userWindow = [];
      for (let i = currentUserIndex - USER_WINDOW; i <= currentUserIndex + USER_WINDOW; i++) {
        if (i >= 0 && i < totalUsers) userWindow.push(userIds[i]);
      }

      // Calculate protected stories for each protected user
      for (const userId of userWindow) {
        const stories = storyUrlsMap[userId] || [];
        const protectedStoryIndexes = calculateStoryWindow(
          userId === userIds[currentUserIndex] ? currentIndex : 0,
          stories.length
        );
        protectedUsers[userId] = protectedStoryIndexes;
      }

      // Check if same as last state → skip
      const last = lastStateRef.current;
      const lastKeys = Object.keys(last.protectedUsers).sort();
      const newKeys = Object.keys(protectedUsers).sort();
      if (
        JSON.stringify(lastKeys) === JSON.stringify(newKeys) &&
        JSON.stringify(last.protectedUsers) === JSON.stringify(protectedUsers)
      ) {
        return;
      }

      lastStateRef.current = { protectedUsers };

      // Evict stories outside protected window
      evictStories(storyUrlsMap, protectedUsers);
    },
    []
  );

  const onViewerClose = useCallback(
    async ({ userId, storyUrls }: ViewerCloseParams) => {
      await ensureDir();

      await Promise.all(
        storyUrls.map(async (url) => {
          const path = getLocalPath(url);
          if (!path) return;

          try {
            const info = await FileSystem.getInfoAsync(path);
            if (info.exists) {
              await FileSystem.deleteAsync(path, { idempotent: true });
              console.log(`🧹 Cleared all stories on viewer close for user ${userId}:`, path);
            }
          } catch {}
        })
      );

      // Remove user from protectedUsers map
      const last = lastStateRef.current;
      if (last.protectedUsers[userId]) {
        delete last.protectedUsers[userId];
      }
    },
    []
  );

  return {
    onStoryChange,
    onViewerClose,
  };
}
