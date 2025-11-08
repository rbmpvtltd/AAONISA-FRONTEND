// import { useQuery } from "@tanstack/react-query";
// import { getProfile } from "@/src/api/profile-api";
// import { useProfileStore } from "@/src/store/userProfileStore";

// export function useProfileQuery() {
//   return useQuery({
//     queryKey: ["profile"],
//     queryFn: async () => {
//       const res = await getProfile();

//       useProfileStore.setState({
//         username: res.data.username,
//         name: res.data.name,
//         bio: res.data.bio,
//         profilePicture: res.data.ProfilePicture,
//         url: res.data.url,
//       });

//       return res.data;
//     },
//   });
// }
