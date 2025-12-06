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


const report = async (reqBody: any) => {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  };

  const apiUrl = createApiUrl("/reports");
  const { data } = await axios.post(apiUrl, reqBody, config);
  return data;
};

const getMyReports = async () => {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  };

  const apiUrl = createApiUrl("/reports/my");
  const { data } = await axios.get(apiUrl, config);
  return data;
};

export { getMyReports, report };
