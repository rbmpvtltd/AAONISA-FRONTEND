// import React, { useEffect, useRef } from "react";
// import {
//   Animated,
//   Dimensions,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";

// const SCREEN_HEIGHT = Dimensions.get("window").height;

// const BottomDrawer = ({ visible, onClose, onSave, onReport, onShare }: any) => {
//   const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(slideAnim, {
//         toValue: SCREEN_HEIGHT,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [visible]);

//   if (!visible) return null;

//   return (
//     <View style={styles.overlay}>
//       <TouchableOpacity style={styles.overlayBackground} onPress={onClose} />

//       <Animated.View
//         style={[
//           styles.bottomDrawer,
//           { transform: [{ translateY: slideAnim }] },
//         ]}
//       >
//         <TouchableOpacity style={styles.optionButton} onPress={onSave}>
//           <Ionicons name="bookmark-outline" size={22} color="#fff" />
//           <Text style={styles.optionText}>Save</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.optionButton} onPress={onReport}>
//           <Ionicons name="alert-circle-outline" size={22} color="#fff" />
//           <Text style={styles.optionText}>Report</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.optionButton} onPress={onShare}>
//           <Ionicons name="share-social-outline" size={22} color="#fff" />
//           <Text style={styles.optionText}>Share Video</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 90,
//     justifyContent: "flex-end",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     zIndex: 999,
//   },
//   overlayBackground: { flex: 1 },
//   bottomDrawer: {
//     backgroundColor: "#1a1a1a",
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//   },
//   optionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 0.4,
//     borderBottomColor: "#333",
//   },
//   optionText: {
//     color: "#fff",
//     fontSize: 16,
//     marginLeft: 12,
//   },
// });

// export default BottomDrawer;


import { useAppTheme } from "@/src/constants/themeHelper";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const BottomDrawer = ({ visible, onClose, onSave, onReport, onShare }: any) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const theme = useAppTheme();

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
      <TouchableOpacity style={styles.overlayBackground} onPress={onClose} />

      <Animated.View
        style={[
          styles.bottomDrawer,
          { 
            backgroundColor: theme.background, 
            transform: [{ translateY: slideAnim }],
            borderTopColor: theme.inputBorder
          },
        ]}
      >
        <TouchableOpacity style={styles.optionButton} onPress={onSave}>
          <Ionicons name="bookmark-outline" size={22} color={theme.text} />
          <Text style={[styles.optionText, { color: theme.text }]}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={onReport}>
          <Ionicons name="alert-circle-outline" size={22} color={theme.text} />
          <Text style={[styles.optionText, { color: theme.text }]}>Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={22} color={theme.text} />
          <Text style={[styles.optionText, { color: theme.text }]}>
            Share Video
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 70,
    justifyContent: "flex-end",
    zIndex: 999,
  },
  overlayBackground: { flex: 1 },
  bottomDrawer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.4,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
});

export default BottomDrawer;
