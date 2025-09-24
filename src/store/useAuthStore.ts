import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";

interface AuthState {
    // Common auth fields
    emailOrPhone: string;
    email: string;
    phone: string;
    otp: string[];
    otpSent: boolean;
    emailOtpSent: boolean;
    phoneOtpSent: boolean;
    username: string;
    password: string;
    newPassword: string;
    token: string;
    verifyingEmail : boolean
    verifyingPhone : boolean




    // Setters
    setEmailOrPhone: (value: string) => void;
    setEmail: (value: string) => void;
    setPhone: (value: string) => void;
    setOtp: (value: string[]) => void;
    setEmailOtpSent: (val: boolean) => void;
    setPhoneOtpSent: (val: boolean) => void;
    setOtpSent: (value: boolean) => void;
    setUsername: (value: string) => void;
    setPassword: (value: string) => void;
    setNewPassword: (value: string) => void;
    setToken: (value: string) => void;
    setVerifyingEmail : (value : boolean) => void;
    setVerifyingPhone : (value : boolean) => void;

    // Token helpers
    saveToken: (token: string) => Promise<void>;
    getToken: () => Promise<string | null>;
    removeToken: () => Promise<void>;

    resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    emailOrPhone: "",
    email: "",
    phone: "",
    otp: ["", "", "", "", "", ""],
    otpSent: false,
    emailOtpSent: false,
    phoneOtpSent: false,
    username: "",
    password: "",
    newPassword: "",
    token: "",
    verifyingEmail : false,
    verifyingPhone : false,




    setEmailOrPhone: (value) => set({ emailOrPhone: value }),
    setEmail: (value) => set({ email: value }),
    setPhone: (value) => set({ phone: value }),
    setOtp: (value) => set({ otp: value }),
    setEmailOtpSent: (val) => set({ emailOtpSent: val }),
    setPhoneOtpSent: (val) => set({ phoneOtpSent: val }),
    setOtpSent: (value) => set({ otpSent: value }),
    setUsername: (value) => set({ username: value }),
    setPassword: (value) => set({ password: value }),
    setNewPassword: (value) => set({ newPassword: value }),
    setToken: (value) => set({ token: value }),
    setVerifyingEmail : (value) => set({ verifyingEmail : value }),
    setVerifyingPhone : (value) => set({ verifyingPhone : value }),


    saveToken: async (token: string) => {
        set({ token });
        if (Platform.OS === "web") {
            if (typeof localStorage !== "undefined") {
                localStorage.setItem("accessToken", token);
            }
        } else {
            await AsyncStorage.setItem("accessToken", token);
        }
    },

    getToken: async () => {
        if (Platform.OS === "web") {
            if (typeof localStorage !== "undefined") {
                return localStorage.getItem("authToken");
            }
            return null;
        } else {
            return await AsyncStorage.getItem("authToken");
        }
    },

    removeToken: async () => {
        set({ token: "" });
        if (Platform.OS === "web") {
            if (typeof localStorage !== "undefined") {
                localStorage.removeItem("authToken");
            }
        } else {
            await AsyncStorage.removeItem("authToken");
        }
    },

    resetAuth: () =>
        set({
            emailOrPhone: "",
            email: "",
            phone: "",
            otp: ["", "", "", "", "", ""],
            otpSent: false,
            emailOtpSent: false,
            phoneOtpSent: false,
            username: "",
            password: "",
            newPassword: "",
            token: "",
            verifyingEmail : false,
            verifyingPhone : false,
        }),
}));
