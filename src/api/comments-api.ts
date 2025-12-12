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

// const getCommentsApi = async (reelId: string) => {
//     const token = await getToken();

//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     // withCredentials: true,
//   };

//   const apiUrl = createApiUrl(`/comments/getComments/${reelId}`);

//   let comments;

//   try {
//      comments = await axios.get(apiUrl, config);
//   } catch (e) {
//     console.log("getting comments failed", e);
//   }
//   return comments;
// };


const getCommentsApi = async (reelId: string) => {
  const token = await getToken();
  console.log("bhen k lode", token)
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const apiUrl = createApiUrl(`/comments/getComments/${reelId}`);

  try {
    const response = await axios.get(apiUrl, config);
    console.log("✅ Comments fetched:", response.data?.length || 0);
    return response.data;
  } catch (e) {
    console.error("❌ Getting comments failed:", e);
    return []; // ✅ Return empty array
  }
};
const addCommentApi = async (reelId: string, comment: string, mentions: string[], parentId: string) => {
  const token = await getToken();
  console.log(reelId, comment, mentions, parentId)
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl(`/comments/addComment/`);

  try {
    const data = await axios.post(apiUrl, { content: comment, mentions, postId: reelId, parentId }, config);
    return data
  } catch (e) {
    console.log("adding comment failed", e);
  }
};

const deleteCommentApi = async (commentId: string) => {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl(`/comments/deleteComment/${commentId}`);

  try {
    await axios.delete(apiUrl, config);
  } catch (e) {
    console.log("deleting comment failed", e);
  }
}

const likeCommentApi = async (commentId: string) => {
  const token = await getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl(`/comments/likeUnlikeComment/${commentId}`);

  try {
    await axios.get(apiUrl, config);
  } catch (e) {
    console.log("deleting comment failed", e);
  }
}
export { addCommentApi, deleteCommentApi, getCommentsApi, likeCommentApi };

