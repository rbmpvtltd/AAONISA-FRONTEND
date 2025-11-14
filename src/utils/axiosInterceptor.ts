// import { useAuthStore } from "@/src/store/useAuthStore";
// import axios from "axios";
// import { router } from "expo-router";

// export const setupAxiosInterceptor = () => {
//   // Request: token attach
//   axios.interceptors.request.use(async (config) => {
//     const token = await useAuthStore.getState().getToken();
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   });

//   // Response: 401 → auto logout
//   axios.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       if (error.response?.status === 401) {
//         console.log("⛔ Token expired! Logging out...");
//         await useAuthStore.getState().logout();
//         router.replace("/auth/login");
//       }
//       return Promise.reject(error);
//     }
//   );
// };
