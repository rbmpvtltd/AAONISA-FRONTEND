// themeHelper.ts
import { Appearance } from "react-native";

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
    overlay: "rgba(0,0,0,0.4)", 
     userImage: require("@/assets/lightThemeUser.png"), 
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
  overlay: "rgba(255,255,255,0.15)",
    userImage: require("@/assets/darkThemeUser.jpg"),
};

export const useAppTheme = () => {
  const systemTheme = Appearance.getColorScheme(); 
  return systemTheme === "dark" ? darkTheme : lightTheme;
};
