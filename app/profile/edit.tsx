import { updateProfile } from "@/src/api/profile-api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useProfileStore } from "@/src/store/userProfileStore";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");


interface ProfileData {
  username: string;
  name: string;
  bio: string;
  ProfilePicture: string | null;
  url: string;
}

function UserEditProfile() {
  const theme = useAppTheme();
  const queryClient = useQueryClient();

  // ✅ Get Zustand store
  const profileStore = useProfileStore();


  // ====================================
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Camera permission is needed to change your profile photo.");
      }
    })();
  }, []);
  // ====================================


  // ✅ Local state initialized from store
  const [profileData, setProfileData] = useState<ProfileData>({
    username: profileStore.username || "",
    name: profileStore.name || "",
    bio: profileStore.bio || "",
    ProfilePicture: profileStore.ProfilePicture || null,
    url: profileStore.url || "",
  });

  const [imageChanged, setImageChanged] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [characterCount, setCharacterCount] = useState({
    bio: profileStore.bio?.length || 0,
    url: profileStore.url?.length || 0,
  });

  // ✅ Pick image
  const pickImage = async (type: "camera" | "gallery") => {
    let result;
    if (type === "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }else {
      console.log("hello")
    } 
    
    
    //  else {
  //     result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [1, 1],
  //       quality: 1,
  //     });
  //   }

    // if (!result.canceled) {
    //   const uri = result.assets[0].uri;
    //   setProfileData((prev) => ({ ...prev, ProfilePicture: uri }));
    //   setImageChanged(true);
    // }
  };

  // ✅ Delete profile picture
  const deleteProfilePicture = () => {
    setProfileData((prev) => ({ ...prev, ProfilePicture: null }));
    setImageChanged(true);
    setShowImageOptions(false);
  };

  // ✅ Mutation to update profile
  const updateMutation = useMutation({
    mutationFn: () => updateProfile(profileData, imageChanged),
    // onSuccess: (data: any) => {
    //   if (!data?.data) {
    //     Alert.alert("Error", "Invalid server response");
    //     return;
    //   }

    //   // ✅ Update Zustand store
    //   useProfileStore.setState({
    //     username: data.data.username,
    //     name: data.data.name,
    //     bio: data.data.bio,
    //     ProfilePicture: data.data.ProfilePicture,
    //     url: data.data.url,
    //   });
     
    // =============================================
onSuccess: (data: any) => {
  const user = data?.data;
  if (!user) {
    Alert.alert("Error", "Invalid server response");
    return;
  }

  useProfileStore.setState({
    username: user.username || "",
    name: user.name || "",
    bio: user.bio || "",
    ProfilePicture: user.ProfilePicture || null,
    url: user.url || "",
  });
// =============================================


      setImageChanged(false);
      setShowImageOptions(false);

      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", data.data.username], });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      Alert.alert("Success", "Profile updated successfully!");
    },
    onError: () => {
      Alert.alert("Error", "Something went wrong while updating profile");
    },
  });

  const handleSave = () => {
    updateMutation.mutate();
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.background }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView style={styles.container}>
          {/* Profile Picture */}
          <View style={styles.ProfilePictureContainer}>
            <TouchableOpacity onPress={() => setShowImageOptions(!showImageOptions)}>
              <View style={styles.profileImageWrapper}>
                {/* <Image
                  source={
                    profileData.ProfilePicture
                      ? { uri: profileData.ProfilePicture }
                      : typeof theme.userImage === "number"
                        ? theme.userImage
                        : { uri: theme.userImage }
                  }
                  style={styles.ProfilePicture}
                /> */}

                <Image
                  source={
                    profileData.ProfilePicture
                      ? { uri: profileData.ProfilePicture }
                      : theme.userImage
                        ? (typeof theme.userImage === "number" ? theme.userImage : { uri: theme.userImage })
                        : require("@/assets/darkThemeUser.jpg") // fallback
                  }
                  style={styles.ProfilePicture}
                />



                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={width * 0.05} color="white" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Image Options */}
            {showImageOptions && (
              <View style={styles.imageOptionsContainer}>
                <TouchableOpacity style={styles.imageOption} onPress={() => pickImage("camera")} >
                  <Text style={styles.imageOptionText} >Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageOption} >
                  <Text style={styles.imageOptionText}>Gallery</Text>
                </TouchableOpacity>
                {profileData.ProfilePicture && (
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
              onChangeText={(text) => setProfileData((prev) => ({ ...prev, username: text }))}
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
              onChangeText={(text) => setProfileData((prev) => ({ ...prev, name: text }))}
            />
          </View>

          {/* Bio */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Write something"
              placeholderTextColor={theme.placeholder}
              value={profileData.bio}
              onChangeText={(text) => {
                setProfileData((prev) => ({ ...prev, bio: text }));
                setCharacterCount((prev) => ({ ...prev, bio: text.length }));
              }}
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
              onChangeText={(text) => {
                setProfileData((prev) => ({ ...prev, url: text }));
                setCharacterCount((prev) => ({ ...prev, url: text.length }));
              }}
              maxLength={60}
              keyboardType="url"
            />
            <Text style={styles.characterCount}>{characterCount.url}/60</Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={updateMutation.isPending}
          >
            <Text style={styles.saveButtonText}>
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Loading Overlay */}
        {updateMutation.isPending && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.buttonText} />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ✅ Styles
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, paddingHorizontal: width * 0.05 },
    ProfilePictureContainer: { alignItems: "center" },
    profileImageWrapper: { position: "relative", marginBottom: height * 0.015 },
    ProfilePicture: { width: width * 0.28, height: width * 0.28, borderRadius: (width * 0.28) / 2, borderWidth: 1, borderColor: theme.inputBorder },
    cameraIcon: { position: "absolute", right: 0, bottom: 0, backgroundColor: theme.buttonBg, borderRadius: width * 0.05, padding: width * 0.015 },
    imageOptionsContainer: { width: "100%", alignItems: "center", marginTop: height * 0.01 },
    imageOption: { backgroundColor: theme.inputBg, padding: height * 0.015, borderRadius: 5, marginVertical: height * 0.005, width: "80%", alignItems: "center" },
    deleteOption: { backgroundColor: "#ff3b30" },
    deleteOptionText: { color: "#fff" },
    imageOptionText: { fontSize: width * 0.045, color: theme.text },
    inputContainer: { marginBottom: height * 0.015 },
    label: { fontSize: width * 0.04, fontWeight: "600", marginBottom: height * 0.005, color: theme.text },
    input: { borderWidth: 1, borderColor: theme.inputBorder, borderRadius: 8, padding: height * 0.015, backgroundColor: theme.inputBg, color: theme.text, fontSize: width * 0.04 },
    bioInput: { height: height * 0.12, textAlignVertical: "top" },
    characterCount: { fontSize: width * 0.03, color: theme.subtitle, alignSelf: "flex-end" },
    saveButton: { backgroundColor: theme.buttonBg, padding: height * 0.02, borderRadius: width * 0.08, alignItems: "center", marginBottom: height * 0.05 },
    saveButtonText: { color: theme.buttonText, fontSize: width * 0.05, fontWeight: "bold" },
    loadingOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center", zIndex: 999 },
  });

export default UserEditProfile;

