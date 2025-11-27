
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

async function getAllUsers() {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl('/users/all-users');
  const { data } = await axios.get(apiUrl, config);
  console.log("data", data);

  return data;

}

async function chatSessionId(senderId: string, receiverId: string) {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const apiUrl = createApiUrl('/chat/sessions');

  // Body mein senderId aur receiverId bhejo
  const { data } = await axios.post(apiUrl, {
    senderId,
    receiverId,
  }, config);

  console.log("Session data:", data);

  return data;
}

async function getUserSessionsWithLatestMessage() {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const apiUrl = createApiUrl('/chat/get-all-sessions');

  // Body mein senderId aur receiverId bhejo
  const { data } = await axios.get(apiUrl, config);

  console.log("Session data:", data);

  return data;
}


   async function getSessionMessages(sessionId : string) {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const apiUrl = createApiUrl(`/chat/messages/session/${sessionId}`);
  const { data } = await axios.get(apiUrl,config);
  console.log("getSessionMessages", data);
  return data;
}



// Delete message for me
 const deleteMessageForMeAPI = async (messageId: string) => {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const apiUrl = createApiUrl(`/chat/message/${messageId}/for-me`);
  const data  = await axios.get(apiUrl, config);
  return data;

};

// Delete message for everyone
 const deleteMessageForEveryoneAPI = async (messageId: string) => {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const apiUrl = createApiUrl(`/chat/message/${messageId}/for-everyone`);
  const  data  = await axios.get(apiUrl, config);
  return data;
};


export { chatSessionId, deleteMessageForEveryoneAPI, deleteMessageForMeAPI, getAllUsers, getSessionMessages, getUserSessionsWithLatestMessage };

