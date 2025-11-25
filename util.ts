function createApiUrl(url: string) {
    // __DEV__ is true if we using localhost and false on production
    if (__DEV__) {
      console.log(`https://api.aaonisaa.com/api${url}`);
      
        return `https://api.aaonisaa.com/api${url}`;
        
    }
    return `${process.env.EXPO_PUBLIC_LOCAL_API_URL}${url}`;
}

import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async (name: string) => {
  if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    // Web
    return sessionStorage.getItem(`AAO_NI_SAA_${name}`); // synchronous
  } else {
    // Mobile
    return await AsyncStorage.getItem(`AAO_NI_SAA_${name}`);
  }
};


export { createApiUrl, getToken };

