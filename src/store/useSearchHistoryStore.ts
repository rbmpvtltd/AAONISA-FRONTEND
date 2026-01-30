// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { create } from 'zustand';
// import { createJSONStorage, persist } from 'zustand/middleware';

// const MAX_HISTORY_ITEMS = 10;
// const SEARCH_HISTORY_KEY = 'search-history';

// interface SearchHistoryItem {
//     id: string;
//     username: string;
//     profilePicture?: string;
//     name?: string;
//     role?: string;
//     timestamp: number;
// }

// interface SearchHistoryStore {
//     history: SearchHistoryItem[];
//     addToHistory: (user: {
//         id: string;
//         username: string;
//         userProfile?: {
//             ProfilePicture?: string;
//             name?: string;
//         };
//         role?: string;
//     }) => void;
//     removeFromHistory: (id: string) => void;
//     clearHistory: () => void;
// }

// export const useSearchHistoryStore = create<SearchHistoryStore>()(
//     persist(
//         (set) => ({
//             history: [],

//             addToHistory: (user) => {
//                 set((state) => {
//                     // Remove if already exists (to move to top)
//                     const filtered = state.history.filter((item) => item.id !== user.id);

//                     // Add new item at the beginning
//                     const newHistory = [
//                         {
//                             id: user.id,
//                             username: user.username,
//                             profilePicture: user.userProfile?.ProfilePicture,
//                             name: user.userProfile?.name,
//                             role: user.role,
//                             timestamp: Date.now(),
//                         },
//                         ...filtered,
//                     ].slice(0, MAX_HISTORY_ITEMS); // Keep only latest 10

//                     return { history: newHistory };
//                 });
//             },

//             removeFromHistory: (id) => {
//                 set((state) => ({
//                     history: state.history.filter((item) => item.id !== id),
//                 }));
//             },

//             clearHistory: () => {
//                 set({ history: [] });
//             },
//         }),
//         {
//             name: SEARCH_HISTORY_KEY,
//             storage: createJSONStorage(() => AsyncStorage),
//         }
//     )
// );

//=======================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const MAX_HISTORY_ITEMS = 10;
const SEARCH_HISTORY_KEY = 'search-history';

interface SearchHistoryItem {
    id: string;
    username: string;
    profilePicture?: string;
    name?: string;
    role?: string;
    timestamp: number;
}

interface SearchHistoryStore {
    history: SearchHistoryItem[];
    addToHistory: (user: {
        id: string;
        username: string;
        userProfile?: {
            ProfilePicture?: string;
            name?: string;
        };
        role?: string;
    }) => void;
    removeFromHistory: (id: string) => void;
    clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryStore>()(
    persist(
        (set, get) => ({
            history: [],

            addToHistory: (user) => {
                set((state) => {
                    // Remove if already exists (to move to top)
                    const filtered = state.history.filter((item) => item.id !== user.id);

                    // Add new item at the beginning
                    const newHistory = [
                        {
                            id: user.id,
                            username: user.username,
                            profilePicture: user.userProfile?.ProfilePicture,
                            name: user.userProfile?.name,
                            role: user.role,
                            timestamp: Date.now(),
                        },
                        ...filtered,
                    ].slice(0, MAX_HISTORY_ITEMS); // Keep only latest 10

                    console.log('Adding to history:', user.username);
                    console.log('New history length:', newHistory.length);

                    return { history: newHistory };
                });
            },

            removeFromHistory: (id) => {
                console.log('Removing from history:', id);
                set((state) => {
                    const newHistory = state.history.filter((item) => item.id !== id);
                    console.log('History after removal:', newHistory.length);
                    return { history: newHistory };
                });
            },

            clearHistory: () => {
                console.log('Clearing all history');
                set({ history: [] });
            },
        }),
        {
            name: SEARCH_HISTORY_KEY,
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);