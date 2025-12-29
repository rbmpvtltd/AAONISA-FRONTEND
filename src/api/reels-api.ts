import { createApiUrl } from "@/util";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
async function getAllStreamIds() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };

    const apiUrl = createApiUrl('/videos/getAllStreamIds');

    const { data } = await axios.get(apiUrl, config);

    return data;
  } catch (err: any) {
    console.error('Error fetching video IDs:', err.response?.data || err.message);
    throw err;
  }
}


const getToken = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem("accessToken");
  } else {
    return await AsyncStorage.getItem("accessToken");
  }
};

const getCategoryReel = async (type: string, page: number, limit: number, random: boolean = false) => {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl(`/videos/feed?type=${type}&page=${page}&limit=${limit}&random=${random}`);
  const { data } = await axios.get(apiUrl, config);
  console.log(" data iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", data);
  return data;
};


export { getAllStreamIds, getCategoryReel };

