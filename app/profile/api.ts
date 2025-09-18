
import { createApiUrl } from '@/util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';
const getToken = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem("accessToken");
  } else {
    return await AsyncStorage.getItem("accessToken");
  }
};
async function updateProfileSendOtp(reqBody: any) {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  };

  const apiUrl = createApiUrl("/users/update-profile-send-otp");
  const { data } = await axios.post(apiUrl, reqBody, config);
  return data;
}

// async function updateProfile(reqBody: any) {
    
//     const token = await getToken();
//     const config = {
//         headers: { 'Content-Type': 'multipart/form-data' ,
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),},
//          withCredentials: true,

//     };
//     const apiUrl = createApiUrl('/users/update-profile');
//     const { data } = await axios.post(apiUrl, reqBody, config);
//     return data;
// }



 async function updateProfile(profileData: any) {
  try {
    const formData = new FormData();

    // Agar user ne profile picture select ki hai
    if (profileData.profilePicture) {
      formData.append('ProfilePicture', {
        uri: profileData.profilePicture,
        type: 'image/jpeg', // ya 'image/png', imagePicker se mimetype check kar sakte ho
        name: 'profile.jpg', // ya dynamic: profileData.profilePicture.split('/').pop()
      } as any);
    }

    // Baaki fields
    formData.append('username', profileData.username);
    formData.append('name', profileData.name);
    formData.append('bio', profileData.bio);
    formData.append('url', profileData.url);
    formData.append('otp', profileData.otp);

    const token = await getToken();

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      withCredentials: true,
    };

    const apiUrl = createApiUrl('/users/update-profile');
    const { data } = await axios.post(apiUrl, formData, config);
    return data;
  } catch (error) {
    console.log('Update Profile Error:', error);
    throw error;
  }
}

export {
    updateProfile, updateProfileSendOtp
};

