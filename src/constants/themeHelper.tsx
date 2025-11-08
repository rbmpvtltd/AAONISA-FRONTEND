// import { Appearance } from "react-native";


// const lightTheme = {
//   background: "#fff",
//   text: "#000",
//   subtitle: "#333",
//   inputBg: "#E6F9FF",
//   inputBorder: "#00CFFF",
//   forgot: "#0066cc",
//   buttonBg: "#00CFFF",
//   buttonText: "#fff",
//   googleBg: "#DB4437",
//   link: "#0066cc",
//   placeholder: "#666",
//   overlay: "rgba(0,0,0,0.4)",
//   userImage: "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311jpg",
// };

// const darkTheme = {
//   background: "#000",
//   text: "#fff",
//   subtitle: "#ccc",
//   inputBg: "#1a1a1a",
//   inputBorder: "#00CFFF",
//   forgot: "#66aaff",
//   buttonBg: "#00CFFF",
//   buttonText: "#fff",
//   googleBg: "#DB4437",
//   link: "#66aaff",
//   placeholder: "#aaa",
//   overlay: "rgba(255,255,255,0.15)",
//   userImage: "https://i.pinimg.com/564x/57/00/c0/5700c04197ee9a4372a35ef16eb78f4e.jpg",
// };

// export const useAppTheme = () => {
//   const systemTheme = Appearance.getColorScheme();
//   return systemTheme === "dark" ? darkTheme : lightTheme;
// };

import { useThemeStore } from "../store/useThemeStore";

const lightTheme = {
  background: "#fff",
  text: "#000",
  subtitle: "#333",
  inputBg: "#E6F9FF",
  inputBorder: "#00CFFF",
  forgot: "#0066cc",
  buttonBg: "#00CFFF",
  buttonText: "#fff",
  googleBg: "#DB4437",
  link: "#0066cc",
  placeholder: "#666",
    searchBg : "#66666623",
  overlay: "rgba(0,0,0,0.4)",
  userImage:
    "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311jpg",
};

const darkTheme = {
  background: "#000",
  text: "#fff",
  subtitle: "#ccc",
  inputBg: "#1a1a1a",
  inputBorder: "#00CFFF",
  forgot: "#66aaff",
  buttonBg: "#00CFFF",
  buttonText: "#fff",
  googleBg: "#DB4437",
  link: "#66aaff",
  placeholder: "#aaa",
   searchBg : "#1C1C1C",
  overlay: "rgba(255,255,255,0.15)",
  userImage:
    "https://i.pinimg.com/564x/57/00/c0/5700c04197ee9a4372a35ef16eb78f4e.jpg",
};

export const useAppTheme = () => {
  const { theme } = useThemeStore();
  return theme === "dark" ? darkTheme : lightTheme;
};
