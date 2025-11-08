import { createApiUrl } from '@/util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';
import { useStoryStore } from "../store/useStoryStore";

const getToken = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem("accessToken");
  } else {
    return await AsyncStorage.getItem("accessToken");
  }
};

const markViewed = async (storyId: string) => {
    const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl('/view/addview');
  const markStoryViewed = useStoryStore.getState().markStoryViewed;

  // local update fast UI
  markStoryViewed(storyId);

  // backend update
  try {
    await axios.post(apiUrl, { storyId }, config);
  } catch (e) {
    console.log("mark viewed failed", e);
  }
};

export { markViewed };

