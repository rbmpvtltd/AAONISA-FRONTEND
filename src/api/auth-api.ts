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

async function forgetPassword(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const apiUrl = createApiUrl('/users/forgot-password');
    const { data } = await axios.post(apiUrl, reqBody, config);
    return data;
}

async function sendOtp(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const apiUrl = createApiUrl('/users/verify-otp');
    const { data } = await axios.post(apiUrl, reqBody, config);
    return data;
}

async function registerUser(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const body = reqBody;
    // console.log(body);
    const apiUrl = createApiUrl('/users/register-check');
    const { data } = await axios.post(apiUrl, body, config);
    console.log(data)
    return data;
}


async function checkUsername(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const apiUrl = createApiUrl('/users/check-username');
    const { data } = await axios.post(apiUrl, reqBody, config);
    return data;
}

async function verifyOtpRegisterUser(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const body = reqBody;
    const apiUrl = createApiUrl('/users/verify-otp-and-register');
    const { data } = await axios.post(apiUrl, body, config);
    return data;
}

async function resetPassword(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const body = reqBody;
    const apiUrl = createApiUrl('/users/reset-password');
    const { data } = await axios.post(apiUrl, body, config);
    return data;
}


async function loginUser(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const body = reqBody;
    const apiUrl = createApiUrl('/users/login');
    const { data } = await axios.post(apiUrl, body, config);
    return data;
}

async function logoutUser() {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl('/users/logout');
  const { data } = await axios.post(apiUrl, {}, config);
  return data;
}


// Send OTP for updating email
async function updateEmailSendOtp(reqBody: any) {
  const token = await getToken();
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      withCredentials: true
    },
  };
  const apiUrl = createApiUrl('/users/update-email-send-otp');
  const { data } = await axios.post(apiUrl, reqBody, config);
  return data;
}

// Send OTP for updating phone
async function updatePhoneSendOtp(reqBody: any) {
  const token = await getToken();
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      withCredentials: true
    },
  };
  const apiUrl = createApiUrl('/users/update-phone-send-otp');
  const { data } = await axios.post(apiUrl, reqBody, config);
  return data;
}

// Update user email (after OTP verification)
async function updateUserEmail(reqBody: any) {
  const token = await getToken();
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      withCredentials: true
    },
  };
  const apiUrl = createApiUrl('/users/update-user-email');
  const { data } = await axios.post(apiUrl, reqBody, config);
  return data;
}

// Update user phone (after OTP verification)
async function updateUserPhone(reqBody: any) {
  const token = await getToken();
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      withCredentials: true
    },
  };
  const apiUrl = createApiUrl('/users/update-user-phone');
  const { data } = await axios.post(apiUrl, reqBody, config);
  return data;
}

async function getUserInfoAndFollowState() {
  const token = await getToken();
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      withCredentials: true
    },
  };
  const apiUrl = createApiUrl('/follow/get-follow-state-and-userInfo');
  const { data } = await axios.post(apiUrl,{}, config);
  return data;
}

async function getUserNotifications() {
  const token = await getToken();
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      withCredentials: true
    },
  };
  const apiUrl = createApiUrl('/notifications/getAll');
  const { data } = await axios.post(apiUrl,{}, config);
  return data;
}

async function expoTokenAssign(reqBody: any) {
  const token = await getToken();
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      withCredentials: true
    },
  };
  const apiUrl = createApiUrl('/tokens/assign');
  const { data } = await axios.post(apiUrl, reqBody, config);
  return data;
}

async function expoTokenUnassign(pushToken:any) {
  const token = await getToken();
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      withCredentials: true
    },
  };
  const apiUrl = createApiUrl('/tokens/unassign/'+pushToken);
  const { data } = await axios.delete(apiUrl, config);
  console.log(data)
  return data;
}

async function sendNotification() {
  const token = await getToken();
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      withCredentials: true
    },
  };
  const apiUrl = createApiUrl('/tokens/send');
  const { data } = await axios.post(apiUrl, config);
  return data;
}
export { checkUsername, expoTokenAssign, expoTokenUnassign, forgetPassword, getUserInfoAndFollowState, getUserNotifications, loginUser, logoutUser, registerUser, resetPassword, sendNotification, sendOtp, updateEmailSendOtp, updatePhoneSendOtp, updateUserEmail, updateUserPhone, verifyOtpRegisterUser };

