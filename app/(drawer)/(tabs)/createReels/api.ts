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

// Upload reel via FormData
const uploadReel = async (formData: FormData) => {
  const token = await getToken();
  const apiUrl = createApiUrl("/videos/upload");

  const { data } = await axios.post(apiUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 300000,
    withCredentials: true,
  });

  return data;
};

export { uploadReel };

