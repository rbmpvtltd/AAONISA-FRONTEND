// import { useProfileStore } from "@/src/store/userProfileStore";
// import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
// import React from "react";
// import { Image, StyleSheet, Text, View } from "react-native";

// export default function CustomDrawer(props: any) {
//   const { profilePicture, name } = useProfileStore();

//   return (
//     <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
//       <View style={styles.header}>
//         <Image
//           source={
//             profilePicture
//               ? { uri: profilePicture }
//               : require("@/assets/defaultUser.png")
//           }
//           style={styles.profilePic}
//         />
//         <Text style={styles.name}>{name || "Your Name"}</Text>
//       </View>

//       <View style={styles.menu}>
//         <DrawerItem label="Settings" onPress={() => {}} />
//         <DrawerItem label="Saved Posts" onPress={() => {}} />
//         <DrawerItem label="Logout" onPress={() => {}} />
//       </View>
//     </DrawerContentScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     alignItems: "center",
//     paddingVertical: 30,
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//   },
//   profilePic: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   menu: {
//     marginTop: 20,
//   },
// });
