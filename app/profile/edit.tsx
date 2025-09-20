import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAppTheme } from "../themeHelper";
import { updateProfile } from "./api";

const { width, height } = Dimensions.get("window");

interface ProfileData {
    username: string;
    name: string;
    bio: string;
    profilePicture: string | null;
    url: string;
    otp: string;
}

const UserEditProfile = () => {
    const theme = useAppTheme();
    const [showImageOptions, setShowImageOptions] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        username: "",
        name: "",
        bio: "",
        profilePicture: null,
        url: "",
        otp: "",
    });
    const [characterCount, setCharacterCount] = useState({ bio: 0, url: 0 });

    const pickImage = async (type: "camera" | "gallery") => {
        let result;
        if (type === "camera") {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
        }

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setProfileData((prev) => ({ ...prev, profilePicture: uri }));
        }
    };

    const deleteProfilePicture = () => {
        setProfileData((prev) => ({ ...prev, profilePicture: null }));
        setShowImageOptions(false);
    };

    const handleSave = async () => {
        try {
            const data = await updateProfile(profileData);
            if (data.success) {
                Alert.alert("Success", "Profile updated successfully!");
            } else {
                Alert.alert("Error", data.message || "Failed to update profile");
            }
        } catch {
            Alert.alert("Error", "Something went wrong while updating profile");
        }
    };


    const handleBioChange = (text: string) => {
        setProfileData((prev) => ({ ...prev, bio: text }));
        setCharacterCount((prev) => ({ ...prev, bio: text.length }));
    };

    const handleUrlChange = (text: string) => {
        setProfileData((prev) => ({ ...prev, url: text }));
        setCharacterCount((prev) => ({ ...prev, url: text.length }));
    };

    const styles = createStyles(theme);

    return (

        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: theme.background }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <ScrollView style={styles.container}>
                <Text style={styles.header}>Edit Profile</Text>

                {/* Profile Picture */}
                <View style={styles.profilePictureContainer}>
                    <TouchableOpacity onPress={() => setShowImageOptions(!showImageOptions)}>
                        <View style={styles.profileImageWrapper}>
                            {/* <Image
                source={
                  profileData.profilePicture
                    ? { uri: profileData.profilePicture }
                    : require("@/assets/lightThemeUser.png")
                }
                style={styles.profilePicture}
              /> */}
                            <Image
                                source={
                                    profileData.profilePicture
                                        ? { uri: profileData.profilePicture }
                                        : theme.userImage
                                }
                                style={styles.profilePicture}
                            />
                            <View style={styles.cameraIcon}>
                                <Ionicons name="camera" size={width * 0.05} color="white" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {showImageOptions && (
                        <View style={styles.imageOptionsContainer}>
                            <TouchableOpacity
                                style={styles.imageOption}
                                onPress={() => pickImage("camera")}
                            >
                                <Text style={styles.imageOptionText}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.imageOption}
                                onPress={() => pickImage("gallery")}
                            >
                                <Text style={styles.imageOptionText}>Gallery</Text>
                            </TouchableOpacity>
                            {profileData.profilePicture && (
                                <TouchableOpacity
                                    style={[styles.imageOption, styles.deleteOption]}
                                    onPress={deleteProfilePicture}
                                >
                                    <Text style={styles.deleteOptionText}>Delete</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>

                {/* Username */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter username"
                        placeholderTextColor={theme.placeholder}
                        value={profileData.username}
                        onChangeText={(text) =>
                            setProfileData((prev) => ({ ...prev, username: text }))
                        }
                    />
                </View>

                {/* Name */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter name"
                        placeholderTextColor={theme.placeholder}
                        value={profileData.name}
                        onChangeText={(text) =>
                            setProfileData((prev) => ({ ...prev, name: text }))
                        }
                    />
                </View>

                {/* Bio */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, styles.bioInput]}
                        placeholder="Write something about yourself"
                        placeholderTextColor={theme.placeholder}
                        value={profileData.bio}
                        onChangeText={handleBioChange}
                        multiline
                        maxLength={50}
                    />
                    <Text style={styles.characterCount}>{characterCount.bio}/50</Text>
                </View>

                {/* URL */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Add URL</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="https://example.com"
                        placeholderTextColor={theme.placeholder}
                        value={profileData.url}
                        onChangeText={handleUrlChange}
                        maxLength={60}
                        keyboardType="url"
                    />
                    <Text style={styles.characterCount}>{characterCount.url}/60</Text>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            paddingHorizontal: width * 0.05,
        },
        header: {
            fontSize: width * 0.07,
            fontWeight: "bold",
            marginBottom: height * 0.02,
            textAlign: "center",
            color: theme.text,
        },
        profilePictureContainer: {
            alignItems: "center",
            marginBottom: height * 0.03,
        },
        profileImageWrapper: {
            position: "relative",
            marginBottom: height * 0.015,
        },
        profilePicture: {
            width: width * 0.28,
            height: width * 0.28,
            borderRadius: (width * 0.28) / 2,
            borderWidth: 1,
            borderColor: theme.inputBorder,
        },
        cameraIcon: {
            position: "absolute",
            right: 0,
            bottom: 0,
            backgroundColor: theme.buttonBg,
            borderRadius: width * 0.05,
            padding: width * 0.015,
        },
        imageOptionsContainer: {
            width: "100%",
            alignItems: "center",
            marginTop: height * 0.01,
        },
        imageOption: {
            backgroundColor: theme.inputBg,
            padding: height * 0.015,
            borderRadius: 5,
            marginVertical: height * 0.005,
            width: "80%",
            alignItems: "center",
        },
        imageOptionText: {
            fontSize: width * 0.045,
            color: theme.text,
        },
        deleteOption: {
            backgroundColor: "#ff3b30",
        },
        deleteOptionText: {
            color: "white",
            fontSize: width * 0.045,
        },
        inputContainer: {
            marginBottom: height * 0.015,
        },
        label: {
            fontSize: width * 0.04,
            fontWeight: "600",
            marginBottom: height * 0.005,
            color: theme.text,
        },
        input: {
            borderWidth: 1,
            borderColor: theme.inputBorder,
            borderRadius: 8,
            padding: height * 0.015,
            backgroundColor: theme.inputBg,
            color: theme.text,
            fontSize: width * 0.04,
        },
        bioInput: {
            height: height * 0.12,
            textAlignVertical: "top",
        },
        characterCount: {
            fontSize: width * 0.03,
            color: theme.subtitle,
            alignSelf: "flex-end",
            paddingRight: width * 0.02,
            marginTop: height * 0.005,
        },
        otpContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: height * 0.02,
        },
        otpInput: {
            borderWidth: 1,
            borderColor: theme.inputBorder,
            backgroundColor: theme.inputBg,
            borderRadius: 8,
            padding: height * 0.015,
            textAlign: "center",
            width: width * 0.12,
            color: theme.text,
            fontSize: width * 0.045,
        },
        saveButton: {
            backgroundColor: theme.buttonBg,
            padding: height * 0.02,
            borderRadius: width * 0.08,
            alignItems: "center",
            marginBottom: height * 0.05,
        },
        saveButtonText: {
            color: theme.buttonText,
            fontSize: width * 0.05,
            fontWeight: "bold",
        },
    });
    
export default UserEditProfile;

// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
// import React, { useState } from "react";
// import {
//     Alert,
//     Dimensions,
//     Image,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { useAppTheme } from "../themeHelper";
// import { updateProfile, updateProfileSendOtp } from "./api";

// const { width, height } = Dimensions.get("window");

// interface ProfileData {
//     username: string;
//     name: string;
//     bio: string;
//     profilePicture: string | null;
//     url: string;
//     otp: string; 
// }

// const UserEditProfile = () => {
//     const theme = useAppTheme();
//     const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//     const [otpSent, setOtpSent] = useState(false);
//     const [otpSentSuccessfully, setOtpSentSuccessfully] = useState(false);
//     const [showImageOptions, setShowImageOptions] = useState(false);
//     const [profileData, setProfileData] = useState<ProfileData>({
//         username: "",
//         name: "",
//         bio: "",
//         profilePicture: null,
//         url: "",
//         otp: "", 
//     });
//     const [characterCount, setCharacterCount] = useState({ bio: 0, url: 0 });

  

//     const pickImage = async (type: "camera" | "gallery") => {
//     let result;
//     if (type === "camera") {
//         result = await ImagePicker.launchCameraAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 1,
//         });
//     } else if (type === "gallery") {
//         if (Platform.OS === 'web') {
//             Alert.alert("Not Supported", "Gallery access is not supported on web.");
//             return;
//         }
//         result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 1,
//         });
//     }
// if (result && !result.canceled && result.assets && result.assets[0] && result.assets[0].uri) {
//     const uri = result.assets[0].uri;
//     setProfileData((prev) => ({ ...prev, profilePicture: uri }));
// }
//     setShowImageOptions(false);
// };

//     const deleteProfilePicture = () => {
//         setProfileData((prev) => ({ ...prev, profilePicture: null }));
//         setShowImageOptions(false);
//     };

//     const handleSendOtp = async () => {
//         try {
           
//             const data = await updateProfileSendOtp({ /* ...profileData, */ otp: "123456" });
//             if (data.success) {
//                 setOtpSent(true);
//                 setOtpSentSuccessfully(true);
//                 Alert.alert("OTP Sent", "Check your email/phone for the OTP");
//             } else {
//                 Alert.alert("Error", data.message || "Failed to send OTP");
//             }
//         } catch (error) {
//             console.error("Error sending OTP:", error); // Log for debugging
//             Alert.alert("Error", "Failed to send OTP");
//         }
//     };

//     const handleSave = async () => {

//         const fullOtp = otp.join('');
//         try {
//             const data = await updateProfile({ ...profileData, otp: fullOtp });
//             if (data.success) {
//                 Alert.alert("Success", "Profile updated successfully!");
//             } else {
//                 Alert.alert("Error", data.message || "Failed to update profile");
//             }
//         } catch (error) {
//             console.error("Error updating profile:", error); 
//             Alert.alert("Error", "Something went wrong while updating profile");
//         }
//     };

//     const handleButtonClick = () => {
//         if (!otpSentSuccessfully) {
//             handleSendOtp();
//         } else {
//             handleSave();
//         }
//     };

//     const handleBioChange = (text: string) => {
//         setProfileData((prev) => ({ ...prev, bio: text }));
//         setCharacterCount((prev) => ({ ...prev, bio: text.length }));
//     };

//     const handleUrlChange = (text: string) => {
//         setProfileData((prev) => ({ ...prev, url: text }));
//         setCharacterCount((prev) => ({ ...prev, url: text.length }));
//     };

//     const styles = createStyles(theme);

//     return (
//         <KeyboardAvoidingView
//             style={styles.keyboardAvoidingView}
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
//         >
//             <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//                 <Text style={styles.header}>Edit Profile</Text>

//                 {/* Profile Picture */}
//                 <View style={styles.profilePictureContainer}>
//                     <TouchableOpacity
//                         onPress={() => {
//                             if (Platform.OS !== 'web') {
//                                 setShowImageOptions(!showImageOptions);
//                             } else {
//                                 // Optionally alert or do nothing
//                                 // Alert.alert("Info", "Use camera icon directly on web.");
//                             }
//                         }}
//                         activeOpacity={0.8}
//                     >
//                         <View style={styles.profileImageWrapper}>
//                             <Image
//                                 source={
//                                     profileData.profilePicture
//                                         ? { uri: profileData.profilePicture }
//                                         : theme.userImage
//                                 }
//                                 style={styles.profilePicture}
//                             />
//                             <View style={styles.cameraIcon}>
//                                 {Platform.OS === 'web' ? (
//                                     <TouchableOpacity
//                                         onPress={() => pickImage("camera")}
//                                         style={styles.cameraIconButton} 
//                                         activeOpacity={0.7}
//                                     >
//                                         <Ionicons name="camera" size={width * 0.05} color="white" />
//                                     </TouchableOpacity>
//                                 ) : (
//                                     <Ionicons name="camera" size={width * 0.05} color="white" />
//                                 )}
//                             </View>
//                         </View>
//                     </TouchableOpacity>

//                     {/* Conditionally render image options, hiding on web */}
//                     {showImageOptions && Platform.OS !== 'web' && (
//                         <View style={styles.imageOptionsContainer}>
//                             <TouchableOpacity
//                                 style={styles.imageOption}
//                                 onPress={() => pickImage("camera")}
//                             >
//                                 <Text style={styles.imageOptionText}>Camera</Text>
//                             </TouchableOpacity>
//                             {/* Gallery option hidden on web */}
//                             <TouchableOpacity
//                                 style={styles.imageOption}
//                                 onPress={() => pickImage("gallery")}
//                             >
//                                 <Text style={styles.imageOptionText}>Gallery</Text>
//                             </TouchableOpacity>
//                             {profileData.profilePicture && (
//                                 <TouchableOpacity
//                                     style={[styles.imageOption, styles.deleteOption]}
//                                     onPress={deleteProfilePicture}
//                                 >
//                                     <Text style={styles.deleteOptionText}>Delete</Text>
//                                 </TouchableOpacity>
//                             )}
//                         </View>
//                     )}
//                 </View>

//                 {/* Username */}
//                 <View style={styles.inputContainer}>
//                     <Text style={styles.label}>Username</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter username"
//                         placeholderTextColor={theme.placeholder}
//                         value={profileData.username}
//                         onChangeText={(text) =>
//                             setProfileData((prev) => ({ ...prev, username: text }))
//                         }
//                     />
//                 </View>

//                 {/* Name */}
//                 <View style={styles.inputContainer}>
//                     <Text style={styles.label}>Name</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter name"
//                         placeholderTextColor={theme.placeholder}
//                         value={profileData.name}
//                         onChangeText={(text) =>
//                             setProfileData((prev) => ({ ...prev, name: text }))
//                         }
//                     />
//                 </View>

//                 {/* Bio */}
//                 <View style={styles.inputContainer}>
//                     <Text style={styles.label}>Bio</Text>
//                     <TextInput
//                         style={[styles.input, styles.bioInput]}
//                         placeholder="Write something about yourself"
//                         placeholderTextColor={theme.placeholder}
//                         value={profileData.bio}
//                         onChangeText={handleBioChange}
//                         multiline
//                         maxLength={50}
//                     />
//                     <Text style={styles.characterCount}>{characterCount.bio}/50</Text>
//                 </View>

//                 {/* URL */}
//                 <View style={styles.inputContainer}>
//                     <Text style={styles.label}>Add URL</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="https://example.com"
//                         placeholderTextColor={theme.placeholder}
//                         value={profileData.url}
//                         onChangeText={handleUrlChange}
//                         maxLength={60}
//                         keyboardType="url"
//                     />
//                     <Text style={styles.characterCount}>{characterCount.url}/60</Text>
//                 </View>

//                 {/* OTP - Only shown after Send OTP is clicked */}
//                 {otpSent && (
//                     <View style={styles.otpContainer}>
//                         {otp.map((digit, index) => (
//                             <TextInput
//                                 key={index}
//                                 style={styles.otpInput}
//                                 maxLength={1}
//                                 keyboardType="numeric"
//                                 value={digit}
//                                 placeholder="-"
//                                 placeholderTextColor={theme.placeholder}
//                                 onChangeText={(text) => {
//                                     const newOtp = [...otp];
//                                     newOtp[index] = text;
//                                     setOtp(newOtp);

//                                     if (text && index < otp.length - 1) {
//                                         const nextInput = (index + 1).toString();
//                                     }
//                                 }}
//                             />
//                         ))}
//                     </View>
//                 )}

//                 {/* Save Button */}
//                 <TouchableOpacity style={styles.saveButton} onPress={handleButtonClick}>
//                     <Text style={styles.saveButtonText}>
//                         {otpSentSuccessfully ? "Save Profile" : "Send OTP"}
//                     </Text>
//                 </TouchableOpacity>
//             </ScrollView>
//         </KeyboardAvoidingView>
//     );
// };

// const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
//     StyleSheet.create({
//         keyboardAvoidingView: {
//             flex: 1,
//             backgroundColor: theme.background,
//         },
//         container: {
//             flex: 1,
//         },
//         contentContainer: {
//             backgroundColor: theme.background,
//             paddingHorizontal: width * 0.05,
//             paddingVertical: height * 0.02,
//         },
//         header: {
//             fontSize: width * 0.07,
//             fontWeight: "bold",
//             marginBottom: height * 0.02,
//             textAlign: "center",
//             color: theme.text,
//         },
//         profilePictureContainer: {
//             alignItems: "center",
//             marginBottom: height * 0.03,
//         },
//         profileImageWrapper: {
//             position: "relative",
//             marginBottom: height * 0.015,
//         },
//         profilePicture: {
//             width: width * 0.28,
//             height: width * 0.28,
//             borderRadius: (width * 0.28) / 2,
//             borderWidth: 1,
//             borderColor: theme.inputBorder,
//         },
//         cameraIcon: {
//             position: "absolute",
//             right: 0,
//             bottom: 0,
//             backgroundColor: theme.buttonBg,
//             borderRadius: width * 0.05,
//         },
//         cameraIconButton: { 
//              padding: width * 0.015, 
//         },
//         imageOptionsContainer: {
//             width: "100%",
//             alignItems: "center",
//             marginTop: height * 0.01,
//             backgroundColor: 'transparent', 
//         },
//         imageOption: {
//             backgroundColor: theme.inputBg,
//             padding: height * 0.015,
//             borderRadius: 5,
//             marginVertical: height * 0.005,
//             width: "80%",
//             alignItems: "center",
//         },
//         imageOptionText: {
//             fontSize: width * 0.045,
//             color: theme.text,
//         },
//         deleteOption: {
//             backgroundColor: "#ff3b30",
//         },
//         deleteOptionText: {
//             color: "white",
//             fontSize: width * 0.045,
//         },
//         inputContainer: {
//             marginBottom: height * 0.015,
//         },
//         label: {
//             fontSize: width * 0.04,
//             fontWeight: "600",
//             marginBottom: height * 0.005,
//             color: theme.text,
//         },
//         input: {
//             borderWidth: 1,
//             borderColor: theme.inputBorder,
//             borderRadius: 8,
//             padding: height * 0.015,
//             backgroundColor: theme.inputBg,
//             color: theme.text,
//             fontSize: width * 0.04,
//         },
//         bioInput: {
//             height: height * 0.12,
//             textAlignVertical: "top",
//         },
//         characterCount: {
//             fontSize: width * 0.03,
//             color: theme.subtitle,
//             alignSelf: "flex-end",
//             paddingRight: width * 0.02,
//             marginTop: height * 0.005,
//         },
//         otpContainer: {
//             flexDirection: "row",
//             justifyContent: "space-between",
//             marginBottom: height * 0.02,
//             width: '100%',
//             maxWidth: 300,
//             alignSelf: 'center',
//         },
//         otpInput: {
//             borderWidth: 1,
//             borderColor: theme.inputBorder,
//             backgroundColor: theme.inputBg,
//             borderRadius: 8,
//             padding: height * 0.015,
//             textAlign: "center",
//             width: width * 0.12,
//             color: theme.text,
//             fontSize: width * 0.045,
//         },
//         saveButton: {
//             backgroundColor: theme.buttonBg,
//             padding: height * 0.02,
//             borderRadius: width * 0.08,
//             alignItems: "center",
//             marginBottom: height * 0.05,
//             marginHorizontal: width * 0.05, 
//         },
//         saveButtonText: {
//             color: theme.buttonText,
//             fontSize: width * 0.05,
//             fontWeight: "bold",
//         },
//     });

// export default UserEditProfile;

