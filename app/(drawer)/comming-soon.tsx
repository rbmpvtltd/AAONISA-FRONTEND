import { useAppTheme } from "@/src/constants/themeHelper";
import { Text, View } from "react-native";

export default function ComingSoon() {
    const theme = useAppTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: theme.text,
          textAlign: "center",
        }}
      >
        Coming Soon
      </Text>

      <Text
        style={{
          marginTop: 10,
          fontSize: 16,
          color: theme.text,
          textAlign: "center",
        }}
      >
        Exciting things are on the way!
      </Text>
    </View>
  );
}
