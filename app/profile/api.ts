
// import { createApiUrl } from '@/util';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { Platform } from 'react-native';
// const getToken = async () => {
//   if (Platform.OS === "web") {
//     return localStorage.getItem("accessToken");
//   } else {
//     return await AsyncStorage.getItem("accessToken");
//   }
// };
// async function updateProfileSendOtp(reqBody: any) {
//   const token = await getToken();
//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     withCredentials: true,
//   };

//   const apiUrl = createApiUrl("/users/update-profile-send-otp");
//   const { data } = await axios.post(apiUrl, reqBody, config);
//   return data;
// }

// // async function updateProfile(reqBody: any) {

// //     const token = await getToken();
// //     const config = {
// //         headers: { 'Content-Type': 'multipart/form-data' ,
// //         ...(token ? { Authorization: `Bearer ${token}` } : {}),},
// //          withCredentials: true,

// //     };
// //     const apiUrl = createApiUrl('/users/update-profile');
// //     const { data } = await axios.post(apiUrl, reqBody, config);
// //     return data;
// // }



//  async function updateProfile(profileData: any) {
//   try {
//     const formData = new FormData();

//     // Agar user ne profile picture select ki hai
//     if (profileData.profilePicture) {
//       formData.append('ProfilePicture', {
//         uri: profileData.profilePicture,
//         type: 'image/jpeg', // ya 'image/png', imagePicker se mimetype check kar sakte ho
//         name: 'profile.jpg', // ya dynamic: profileData.profilePicture.split('/').pop()
//       } as any);
//     }

//     // Baaki fields
//     formData.append('username', profileData.username);
//     formData.append('name', profileData.name);
//     formData.append('bio', profileData.bio);
//     formData.append('url', profileData.url);
//     formData.append('otp', profileData.otp);

//     const token = await getToken();

//     const config = {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       withCredentials: true,
//     };

//     const apiUrl = createApiUrl('/users/update-profile');
//     const { data } = await axios.post(apiUrl, formData, config);
//     return data;
//   } catch (error) {
//     console.log('Update Profile Error:', error);
//     throw error;
//   }
// }

// export {
//     updateProfile, updateProfileSendOtp
// };


import { createApiUrl } from '@/util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import convertToBase64Expo from './base64Converter';


import { Platform } from 'react-native';

const getToken = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem("accessToken");
  } else {
    return await AsyncStorage.getItem("accessToken");
  }
};
// async function updateProfileSendOtp(reqBody: any) {
//   const token = await getToken();
//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     withCredentials: true,
//   };

//   const apiUrl = createApiUrl("/users/update-profile-send-otp");
//   const { data } = await axios.post(apiUrl, reqBody, config);
//   return data;
// }


async function updateProfile(profileData:any, imageChanged:any) {
  try {
    let base64Image = null;
    
    if (imageChanged && profileData.ProfilePicture) {
      base64Image = await convertToBase64Expo(profileData.ProfilePicture);
    }

    const payload = {
      username: profileData.username,
      name: profileData.name,
      bio: profileData.bio,
      url: profileData.url,
      imageChanged,
      ProfilePicture: base64Image, // null if no image
    };

    const token = await getToken();
    console.log("TOKEN FRONT:", token);

    const apiUrl = createApiUrl("/users/update-profile");
    const { data } = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json", // ✅ ADD THIS
        Authorization: `Bearer ${token}`,   // ✅ CORRECT
      },
    });
    
    return data;
  } catch (err) {
    console.log("Update Profile Error:", err);
    throw err;
  }
}




async function GetProfileUsername(username: string) {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl(`/users/profile/${username}`);
  const { data } = await axios.get(apiUrl, config);
  return data;
}

 async function GetCurrentUser() {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const apiUrl = createApiUrl("/users/profile/current");
  const { data } = await axios.get(apiUrl, config);
  console.log(data);
  
  return data?.userProfile; 
  
}
async function SearchUserProfiel(query: string) {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl(`/users/search?q=${query}`);
  const { data } = await axios.get(apiUrl, config);
  return data;
}


async function followUser(followingId: string) {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl('/follow/addfollow');
  console.log('Calling URL:', apiUrl);

  const { data } = await axios.post(apiUrl, { following: followingId }, config);
  console.log('Response:', data);
  return data;
}

async function UnfollowUser(followingId: string) {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
    data: { following: followingId }
  };

  const apiUrl = createApiUrl('/follow/unfollow');
  console.log('Calling URL:', apiUrl);

  const { data } = await axios.delete(apiUrl, config);
  console.log('Response:', data);
  return data;
}

export {
  followUser, GetCurrentUser, GetProfileUsername, SearchUserProfiel,
  UnfollowUser, updateProfile
};

