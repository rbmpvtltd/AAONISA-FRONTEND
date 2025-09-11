import { createApiUrl } from '@/util';
import axios from 'axios';

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

export { forgetPassword, loginUser, registerUser, resetPassword, sendOtp, verifyOtpRegisterUser };

