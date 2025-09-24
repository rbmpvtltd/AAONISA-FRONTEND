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

// 1️⃣ Send OTP for updating email
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

// 2️⃣ Send OTP for updating phone
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

// 3️⃣ Update user email (after OTP verification)
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

// 4️⃣ Update user phone (after OTP verification)
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

export { forgetPassword, loginUser, registerUser, resetPassword, sendOtp, updateEmailSendOtp, updatePhoneSendOtp, updateUserEmail, updateUserPhone, verifyOtpRegisterUser };

