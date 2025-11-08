import { expoTokenUnassign } from "@/src/api/auth-api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useReelsStore } from "@/src/store/useReelsStore";
import { useThemeStore } from "@/src/store/useThemeStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function CustomDrawer(props: any) {
  // const theme = useAppTheme();
  // const [darkMode, setDarkMode] = useState(false);


const { theme: themeMode, toggleTheme } = useThemeStore();
const theme = useAppTheme();

  const [onlineStatus, setOnlineStatus] = useState(true);
  const { autoScroll, setAutoScroll } = useReelsStore();

  const router = useRouter();
  
const handleLogout = async () => {
  try {
    const  pushToken = await AsyncStorage.getItem("pushToken");
    if (pushToken) {
      await expoTokenUnassign(pushToken);
    }
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    Alert.alert("Logged out successfully!"); 
    router.replace("/auth/login");
  } catch (error) {
     console.error("Logout Error:", error);
    Alert.alert("Logout failed, please try again!");
  }
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {/*  Scrollable Menu Items */}
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{
            backgroundColor: theme.background,
            paddingTop: 10,
          }}
        >
          <DrawerItem
            label="Edit Profile"
            icon={({ color, size }) => (
              <Ionicons name="create-outline" color={theme.text} size={size} />
            )}
            labelStyle={{ color: theme.text }}
            onPress={() => {
              router.push("/profile/edit")
            }}
          />

          <DrawerItem
            label="Star Details"
            icon={({ color, size }) => (
              <Ionicons name="star-outline" color={theme.text} size={size} />
            )}
            labelStyle={{ color: theme.text }}
            onPress={() => props.navigation.navigate("(tabs)/profile")}
          />

          <DrawerItem
            label="Get Premium"
            icon={({ color, size }) => (
              <MaterialIcons name="workspace-premium" color={theme.text} size={size} />
            )}
            labelStyle={{ color: theme.text }}
            onPress={() => props.navigation.navigate("(tabs)/profile")}
          />

          <DrawerItem
            label="Save"
            icon={({ color, size }) => (
              <Ionicons name="bookmark-outline" color={theme.text} size={size} />
            )}
            labelStyle={{ color: theme.text }}
            onPress={() => {router.push("/(drawer)/(tabs)/profile/savedScreen")}}
          />

          <DrawerItem
            label="Help And Support"
            icon={({ color, size }) => (
              <Ionicons name="help-circle-outline" color={theme.text} size={size} />
            )}
            labelStyle={{ color: theme.text }}
            onPress={() => props.navigation.navigate("(tabs)/profile")}
          />

          {/*Dark Mode */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="moon-outline" size={22} color={theme.text} />
            <Text style={{ color: theme.text, flex: 1, marginLeft: 15 }}>
              Dark Mode
            </Text>
            <Switch value={themeMode === "dark"} onValueChange={toggleTheme} />
          </View>

          {/* Online Status */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="radio-button-on-outline" size={22} color={theme.text} />
            <Text style={{ color: theme.text, flex: 1, marginLeft: 15 }}>
              Online Status
            </Text>
            <Switch value={onlineStatus} onValueChange={setOnlineStatus} />
          </View>

          {/* Auto Scroll */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="sync-outline" size={22} color={theme.text} />
            <Text style={{ color: theme.text, flex: 1, marginLeft: 15 }}>
              Auto Scroll
            </Text>
            <Switch value={autoScroll} onValueChange={setAutoScroll} />
          </View>
        </DrawerContentScrollView>

        {/* Footer Logout */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: theme.inputBorder,
            padding: 20,
          }}
        >
          <TouchableOpacity
            onPress={handleLogout}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="log-out-outline" size={22} color="red" />
            <Text style={{ color: "red", fontSize: 16, marginLeft: 15 }}>
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

