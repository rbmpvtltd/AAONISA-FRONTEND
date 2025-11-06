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

const getAllStories = async () => {
    console.log("getting story")
    const token = await getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl('/videos/getAllStories');

  // backend update
  try {
    const data =  await axios.get(apiUrl, config);
    return data.data
  } catch (e) {
    console.log("getting story  failed", e);
  }
};

const getAllBookmarks = async () => {
    const token = await getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  };

  const apiUrl = createApiUrl('/bookmarks/findAllBookmarks');

  // backend update
  try {
    const data =  await axios.get(apiUrl, config);
    return data.data
  } catch (e) {
    console.log("getting story  failed", e);
  }
}
export { getAllBookmarks, getAllStories };

