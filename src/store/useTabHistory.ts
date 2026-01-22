// import { create } from "zustand";

// type TabHistoryState = {
//     history: string[];
//     push: (tab: string) => void;
//     pop: () => string | undefined;
//     reset: () => void;
// };

// export const useTabHistory = create<TabHistoryState>((set, get) => ({
//     history: [],

//     push: (tab) =>
//         set((state) => {
//             if (state.history[state.history.length - 1] === tab) {
//                 return state;
//             }
//             return { history: [...state.history, tab] };
//         }),

//     pop: () => {
//         const history = [...get().history];
//         history.pop(); // current tab
//         const prev = history[history.length - 1];
//         set({ history });
//         return prev;
//     },

//     reset: () => set({ history: [] }),
// }));


// =====================


// import { create } from "zustand";

// type TabHistoryState = {
//     history: string[];
//     fromNotification: boolean;
//     push: (tab: string) => void;
//     pop: () => string | undefined;
//     getPrevious: () => string | undefined;
//     setFromNotification: (value: boolean) => void;
//     reset: () => void;
// };

// export const useTabHistory = create<TabHistoryState>((set, get) => ({
//     history: [],
//     fromNotification: false,

//     push: (tab) =>
//         set((state) => {
//             console.log("Pushing tab to history:", tab);
//             // Don't add if it's the same as the last tab
//             if (state.history[state.history.length - 1] === tab) {
//                 return state;
//             }

//             // Limit history to last 10 tabs to prevent memory issues
//             const newHistory = [...state.history, tab];
//             if (newHistory.length > 10) {
//                 newHistory.shift();
//             }

//             return { history: newHistory };
//         }),

//     pop: () => {
//         console.log("Popping tab from history");
//         const history = [...get().history];
//         history.pop(); // Remove current tab
//         const prev = history[history.length - 1];
//         set({ history });
//         return prev;
//     },

//     // Get previous without removing from history (for iOS)
//     getPrevious: () => {
//         const history = get().history;
//         console.log("Getting previous tab from history:", history);
//         if (history.length > 1) {
//             return history[history.length - 2];
//         }
//         return undefined;
//     },

//     setFromNotification: (value: boolean) => {
//         console.log("Setting fromNotification:", value);
//         set({ fromNotification: value });
//     },
//     reset: () => set({ history: [], fromNotification: false }),
// }));

//====================================

import { create } from "zustand";

type TabHistoryState = {
    history: string[];
    fromNotification: boolean;
    push: (tab: string) => void;
    pop: () => string | undefined;
    getPrevious: () => string | undefined;
    setFromNotification: (value: boolean) => void;
    reset: () => void;
};

export const useTabHistory = create<TabHistoryState>((set, get) => ({
    history: [],
    fromNotification: false,

    push: (tab) =>
        set((state) => {
            console.log("Pushing tab to history:", tab);
            // Don't add if it's the same as the last tab
            if (state.history[state.history.length - 1] === tab) {
                return state;
            }

            // Limit history to last 10 tabs to prevent memory issues
            const newHistory = [...state.history, tab];
            if (newHistory.length > 10) {
                newHistory.shift();
            }

            return { history: newHistory };
        }),

    pop: () => {
        console.log("Popping tab from history");
        const history = [...get().history];
        history.pop(); // Remove current tab
        const prev = history[history.length - 1];
        set({ history });
        return prev;
    },

    // Get previous without removing from history (for iOS)
    getPrevious: () => {
        const history = get().history;
        console.log("Getting previous tab from history:", history);
        if (history.length > 1) {
            return history[history.length - 2];
        }
        return undefined;
    },

    setFromNotification: (value: boolean) => {
        console.log("Setting fromNotification:", value);
        set({ fromNotification: value });
    },

    reset: () => set({ history: [], fromNotification: false }),
}));