import { create } from "zustand";

interface ProfileState {
    username: string;
    name: string;
    bio: string;
    profilePicture: string | null;
    url: string;
    otp: string;
    likes: number;   
    views: number;  
    
    setUsername: (username: string) => void;
    setName: (name: string) => void;
    setBio: (bio: string) => void;
    setProfilePicture: (uri: string | null) => void;
    setUrl: (url: string) => void;
    setOtp: (otp: string) => void;
      setLikes: (likes: number) => void;  
    setViews: (views: number) => void;   


    resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
    username: "mr-adnan-47",
    name: "adnan chouhan",
    bio: "hello every one",
    profilePicture: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    url: "https://www.google.com",
    otp: "",
    likes: 0,
    views: 0,

    setUsername: (username) => set({ username }),
    setName: (name) => set({ name }),
    setBio: (bio) => set({ bio }),
    setProfilePicture: (profilePicture) => set({ profilePicture }),
    setUrl: (url) => set({ url }),
    setOtp: (otp) => set({ otp }),
    setLikes: (likes) => set({ likes }),
    setViews: (views) => set({ views }),
    resetProfile: () =>
        set({
            username: "",
            name: "",
            bio: "",
            profilePicture: null,
            url: "",
            otp: "",
            likes: 0,   
            views: 0,
        }),
}));
