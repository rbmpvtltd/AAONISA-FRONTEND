import { useAppTheme } from '@/src/constants/themeHelper';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
}

const FollowingScreen: React.FC = () => {
    const { width } = useWindowDimensions();
    const theme = useAppTheme();

    const avatarSize = width > 400 ? 60 : 50;
    const padding = width > 400 ? 20 : 16;
    const fontSizeName = width > 400 ? 18 : 16;
    const fontSizeUsername = width > 400 ? 16 : 14;
    const buttonPaddingHorizontal = width > 400 ? 24 : 20;

    const following: User[] = [
        { id: '1', name: 'Tech With Ali', username: 'techwithali', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
        { id: '2', name: 'Travel Diaries', username: 'traveldiaries', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
        { id: '3', name: 'Foodie Zara', username: 'foodiezara', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
        { id: '4', name: 'Fitness Pro', username: 'fitnesspro', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
         { id: '5', name: 'Tech With Ali', username: 'techwithali', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
        { id: '6', name: 'Travel Diaries', username: 'traveldiaries', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
        { id: '7', name: 'Foodie Zara', username: 'foodiezara', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
        { id: '8', name: 'Fitness Pro', username: 'fitnesspro', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
         { id: '9', name: 'Tech With Ali', username: 'techwithali', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
        { id: '10', name: 'Travel Diaries', username: 'traveldiaries', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
        { id: '11', name: 'Foodie Zara', username: 'foodiezara', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
        { id: '12', name: 'Fitness Pro', username: 'fitnesspro', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
    ];

    const renderFollowing = ({ item }: { item: User }) => (
        <View style={[styles.userRow, { borderBottomColor: theme.inputBorder }]}>
            <Image
                source={{ uri: item.avatar }}
                style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
            />
            <View style={[styles.userInfo, { marginLeft: padding / 2 }]}>
                <Text style={[styles.name, { fontSize: fontSizeName, color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.username, { fontSize: fontSizeUsername, color: theme.subtitle }]}>@{item.username}</Text>
            </View>
            <TouchableOpacity
                style={[styles.removeButton, { paddingHorizontal: buttonPaddingHorizontal, borderColor: theme.buttonBg }]}
            >
                <Text style={[styles.removeButtonText, { color: theme.buttonBg }]}>Remove</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingHorizontal: padding, paddingTop: 50 }]}>
            <Text style={[styles.header, { fontSize: width > 400 ? 24 : 20, color: theme.text }]}>Following</Text>
            <FlatList
                data={following}
                renderItem={renderFollowing}
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
    removeButton: {
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    removeButtonText: {
        fontWeight: '600',
        fontSize: 14,
    },
});

export default FollowingScreen;
