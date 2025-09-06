function createApiUrl(url: string) {
    // __DEV__ is true if we using localhost and false on production
    if (__DEV__) {
        return `${process.env.EXPO_PUBLIC_LOCAL_API_URL}${url}`;
    }
    return `${process.env.EXPO_PUBLIC_PRODUCTION_API_URL}${url}`;
}

const getToken = (name: string) => {
	const token = sessionStorage.getItem(`AAO_NI_SAA_${name}`);
	return token;
};

export { createApiUrl, getToken };