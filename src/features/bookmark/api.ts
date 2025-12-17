
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

async function addBookmark(reqBody: any) {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  };

  const apiUrl = createApiUrl("/bookmarks/createBookmark");
  const { data } = await axios.post(apiUrl, reqBody, config);
  console.log(data)
  return data;
}

async function removeBookmark(reqBody: any) {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  };

  const apiUrl = createApiUrl("/bookmarks/deleteBookmark");
  const { data } = await axios.post(apiUrl, reqBody, config);
  return data;
}

async function getBookmarks() {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  };

  const apiUrl = createApiUrl("/bookmarks/findAllBookmarks");
  const { data } = await axios.get(apiUrl, config);
  return data;
}

async function renameBookmark(reqBody: any) {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  };

  const apiUrl = createApiUrl("/bookmarks/updateBookmark");
  const { data } = await axios.post(apiUrl, reqBody, config);
  return data;
}

async function addReelToBookmark(reqBody: any) {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  };

  const apiUrl = createApiUrl("/bookmarks/addReelToBookmark");
  const { data } = await axios.post(apiUrl, reqBody, config);
  return data;
}

async function removeReelFromBookmark(reqBody: any) {
  console.log(reqBody)
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  };

  const apiUrl = createApiUrl("/bookmarks/removeReelFromBookmark");
  const { data } = await axios.post(apiUrl, {reelId:reqBody}, config);
  return data;
}
export { addBookmark, addReelToBookmark, getBookmarks, removeBookmark, removeReelFromBookmark, renameBookmark };

