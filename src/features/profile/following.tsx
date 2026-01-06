// import { useAppTheme } from '@/src/constants/themeHelper';
// import { Follow, useFollowStore } from '@/src/store/useFollowerFollowingStore';
// import React from 'react';
// import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

// const FollowingsScreen: React.FC = () => {
//   const { width } = useWindowDimensions();
//   const theme = useAppTheme();

//   const avatarSize = width > 400 ? 60 : 50; 
//   const padding = width > 400 ? 20 : 16;
//   const fontSizeName = width > 400 ? 18 : 16;
//   const fontSizeUsername = width > 400 ? 16 : 14;
//   const buttonPaddingHorizontal = width > 400 ? 24 : 20;

//   const followings = useFollowStore((state) => state.followings);

//   const renderFollowings = ({ item }: { item: Follow }) => (
//     <View style={[styles.userRow, { borderBottomColor: theme.inputBorder }]}>
//       <Image
//         source={{ uri: item.userProfilePicture || 'https://avatar.iran.liara.run/public' }}
//         style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
//       />
//       <View style={[styles.userInfo, { marginLeft: padding / 2 }]}>
//         <Text style={[styles.name, { fontSize: fontSizeName, color: theme.text }]}>{item.name}</Text>
//         <Text style={[styles.username, { fontSize: fontSizeUsername, color: theme.subtitle }]}>@{item.username}</Text>
//       </View>
//       <TouchableOpacity
//         style={[styles.followButton, { paddingHorizontal: buttonPaddingHorizontal, backgroundColor: theme.buttonBg }]}
//       >
//         <Text style={[styles.followButtonText, { color: theme.buttonText }]}>Remove</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background, paddingHorizontal: padding, paddingTop: 50 }]}>
//       <Text style={[styles.header, { fontSize: width > 400 ? 24 : 20, color: theme.text }]}>Followings</Text>
//       <FlatList
//         data={followings} // store se followers
//         renderItem={renderFollowings}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: { fontWeight: '600', marginBottom: 20, textAlign: 'center' },
//   userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5 },
//   avatar: {},
//   userInfo: { flex: 1 },
//   name: { fontWeight: '600' },
//   username: {},
//   followButton: { paddingVertical: 6, borderRadius: 8 },
//   followButtonText: { fontWeight: '600', fontSize: 14 },
// });

// export default FollowingsScreen;
