import axios from 'axios';
import { createApiUrl } from '@/util';

async function forgetPassword(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const apiUrl = createApiUrl('/auth/send-forgot-otp');
    const { data } = await axios.post(apiUrl, reqBody, config);
    return data;
}

async function sendOtp(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const apiUrl = createApiUrl('/auth/send-otp');
    const { data } = await axios.post(apiUrl, reqBody, config);
    return data;
}

async function registerUser(reqBody: any) {
    // const token = getToken();
    const config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const body = reqBody;
    const apiUrl = createApiUrl('/auth/register');
    const { data } = await axios.post(apiUrl, body, config);
    return data;
}

export { forgetPassword, sendOtp, registerUser };