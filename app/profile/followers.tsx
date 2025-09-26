import { useAppTheme } from '@/src/constants/themeHelper';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

const FollowersScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const theme = useAppTheme();

  const avatarSize = width > 400 ? 60 : 50; 
  const padding = width > 400 ? 20 : 16;
  const fontSizeName = width > 400 ? 18 : 16;
  const fontSizeUsername = width > 400 ? 16 : 14;
  const buttonPaddingHorizontal = width > 400 ? 24 : 20;

  const followers: User[] = [
    { id: '1', name: 'Ali Khan', username: 'alikhan', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
    { id: '2', name: 'Sara Ahmed', username: 'sara_ahmed', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAT4q66YAil__OT_TK7CVRTYT5krSNKa4yAf2po8HXtNYLJsh5bQsHiV7NqcHqe0ook8o&usqp=CAU' },
    { id: '3', name: 'Zain Malik', username: 'zainm', avatar: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVuJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D' },
    { id: '4', name: 'Ayesha Raza', username: 'ayeshar', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnoOvYSATXpIl0wiHkGrgv_ehIW5DoseKc8m9DWwAcSS5RzmT0Ap5YvEAUZxXx85749q0&usqp=CAU' },
    { id: '5', name: 'Omar Farooq', username: 'omar_f', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQENWoNvH6d2lY9VY0akzLZJp2BqW-XY5TXo2y0mvcsbChaviDBWCUnZmjmdhXbQtvVC1k&usqp=CAU' },
  
     { id: '6', name: 'Ali Khan', username: 'alikhan', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
    { id: '7', name: 'Sara Ahmed', username: 'sara_ahmed', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAT4q66YAil__OT_TK7CVRTYT5krSNKa4yAf2po8HXtNYLJsh5bQsHiV7NqcHqe0ook8o&usqp=CAU' },
    { id: '8', name: 'Zain Malik', username: 'zainm', avatar: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVuJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D' },
    { id: '9', name: 'Ayesha Raza', username: 'ayeshar', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnoOvYSATXpIl0wiHkGrgv_ehIW5DoseKc8m9DWwAcSS5RzmT0Ap5YvEAUZxXx85749q0&usqp=CAU' },
    { id: '10', name: 'Omar Farooq', username: 'omar_f', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQENWoNvH6d2lY9VY0akzLZJp2BqW-XY5TXo2y0mvcsbChaviDBWCUnZmjmdhXbQtvVC1k&usqp=CAU' },

  ];

  const renderFollower = ({ item }: { item: User }) => (
    <View style={[styles.userRow, { borderBottomColor: theme.inputBorder }]}>
      <Image
        source={{ uri: item.avatar.trim() }} 
        style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
      />
      <View style={[styles.userInfo, { marginLeft: padding / 2 }]}>
        <Text style={[styles.name, { fontSize: fontSizeName, color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.username, { fontSize: fontSizeUsername, color: theme.subtitle }]}>@{item.username}</Text>
      </View>
      <TouchableOpacity
        style={[styles.followButton, { paddingHorizontal: buttonPaddingHorizontal, backgroundColor: theme.buttonBg }]}
      >
        <Text style={[styles.followButtonText, { color: theme.buttonText }]}>Follow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingHorizontal: padding, paddingTop: 50 }]}>
      <Text style={[styles.header, { fontSize: width > 400 ? 24 : 20, color: theme.text }]}>Followers</Text>
      <FlatList
        data={followers}
        renderItem={renderFollower}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  avatar: {},
  userInfo: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
  },
  username: {},
  followButton: {
    paddingVertical: 6,
    borderRadius: 8,
  },
  followButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FollowersScreen;


