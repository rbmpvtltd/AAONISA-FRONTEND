import { Appearance } from "react-native";
import { create } from "zustand";

const systemTheme = Appearance.getColorScheme();

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: systemTheme === "dark" ? "dark" : "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  setTheme: (theme) => set({ theme }),
}));


// import { create } from "zustand";

// type ThemeState = {
//   theme: "light" | "dark";
//   toggleTheme: () => void;
//   setTheme: (theme: "light" | "dark") => void;
// };

// export const useThemeStore = create<ThemeState>((set) => ({
//   theme: "light",
//   toggleTheme: () =>
//     set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
//   setTheme: (theme) => set({ theme }),
// }));
