import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProfileData {
    username: string;
    name: string;
    password: string;
    bio: string;
    profilePicture: string | null;
    url: string;
}

const UserEditProfile = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        username: 'adanan-chouhan',
        name: 'adnan',
        password: '',
        bio: 'hello',
        profilePicture: null,
        url: '',
    });

    const [characterCount, setCharacterCount] = useState({
        bio: 5,
        url: 0,
    });

    const [showImageOptions, setShowImageOptions] = useState(false);

    const pickImage = async (source: 'camera' | 'gallery') => {
        let result;

        if (source === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera permissions to make this work!');
                return;
            }
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need gallery permissions to make this work!');
                return;
            }
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
        }

        if (!result.canceled) {
            setProfileData({
                ...profileData,
                profilePicture: result.assets[0].uri,
            });
            setShowImageOptions(false);
        }
    };

    const deleteProfilePicture = () => {
        setProfileData({
            ...profileData,
            profilePicture: null,
        });
        setShowImageOptions(false);
    };

    const handleSave = () => {
        Alert.alert('Profile Saved', 'Your profile has been updated successfully!');
    };

    const handleBioChange = (text: string) => {
        setProfileData({ ...profileData, bio: text });
        setCharacterCount({ ...characterCount, bio: text.length });
    };

    const handleUrlChange = (text: string) => {
        setProfileData({ ...profileData, url: text });
        setCharacterCount({ ...characterCount, url: text.length });
    };

    const toggleImageOptions = () => {
        setShowImageOptions(!showImageOptions);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Edit Profile</Text>

            <View style={styles.profilePictureContainer}>
                <TouchableOpacity onPress={toggleImageOptions}>
                    <View style={styles.profileImageWrapper}>
                        <Image
                            source={
                                profileData.profilePicture
                                    ? { uri: profileData.profilePicture }
                                    : require(`@/assets/user.png`)
                            }
                            style={styles.profilePicture}
                        />
                        <View style={styles.cameraIcon}>
                            <Ionicons name="camera" size={20} color="white" />
                        </View>
                    </View>
                </TouchableOpacity>

                {showImageOptions && (
                    <View style={styles.imageOptionsContainer}>
                        <TouchableOpacity
                            style={styles.imageOption}
                            onPress={() => pickImage('camera')}
                        >
                            <Text style={styles.imageOptionText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.imageOption}
                            onPress={() => pickImage('gallery')}
                        >
                            <Text style={styles.imageOptionText}>Gallery</Text>
                        </TouchableOpacity>
                        {profileData.profilePicture && (
                            <TouchableOpacity
                                style={[styles.imageOption, styles.deleteOption]}
                                onPress={deleteProfilePicture}
                            >
                                <Text style={styles.deleteOptionText}>Delete</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.username}
                    onChangeText={(text) => setProfileData({ ...profileData, username: text })}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.name}
                    onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.password}
                    onChangeText={(text) => setProfileData({ ...profileData, password: text })}
                    secureTextEntry
                    placeholder="Enter new password"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                    style={[styles.input, styles.bioInput]}
                    value={profileData.bio}
                    onChangeText={handleBioChange}
                    multiline
                    maxLength={100}
                />
                <Text style={styles.characterCount}>
                    {characterCount.bio}/100
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Add URL</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.url}
                    onChangeText={handleUrlChange}
                    placeholder="https://example.com"
                    maxLength={20}
                    keyboardType="url"
                />
                <Text style={styles.characterCount}>
                    {characterCount.url}/20
                </Text>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImageWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cameraIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#007AFF',
        borderRadius: 15,
        padding: 5,
    },
    imageOptionsContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    imageOption: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 5,
        marginVertical: 5,
        width: '80%',
        alignItems: 'center',
    },
    imageOptionText: {
        fontSize: 16,
        color: '#007AFF',
    },
    deleteOption: {
        backgroundColor: '#ff3b30',
    },
    deleteOptionText: {
        color: 'white',
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    bioInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    characterCount: {
        fontSize: 12,
        color: '#888',
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UserEditProfile;