import { useAppTheme } from "@/src/constants/themeHelper";
// import { useUploadStore } from "@/src/store/reelUploadStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";

import { useUploadStore } from "@/src/store/reelUploadStore";
import { uploadReel } from "./api";
interface FinalUploadProps {
  onCancel: () => void;
  onDiscard: () => void;
}

const FinalUpload: React.FC<FinalUploadProps> = ({
  onCancel,
  onDiscard
}) => {
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();

  const {
    title,
    caption,
    hashtags,
    mentions,
    contentType,
  } = useUploadStore();

  const [localTitle, setLocalTitle] = useState(title);
  const [localCaption, setLocalCaption] = useState(caption);
  const [localHashtags, setLocalHashtags] = useState(hashtags);
  const [localMentions, setLocalMentions] = useState(mentions);
  const [isUploading, setIsUploading] = useState(false);



  function colorNameToHex(color: string): string {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return '#FFFFFF';
    ctx.fillStyle = color;
    return ctx.fillStyle; // always returns hex, e.g., "red" → "#ff0000"
  }

  function filterNameToHex(filter: string): string {
    switch (filter?.toLowerCase()) {
      case "warm": return "#FFA500"; // orange
      case "cool": return "#0000FF"; // blue
      case "grayscale": return "#808080"; // gray
      case "vintage": return "#FFC0CB"; // pink
      case "sepia": return "#704214"; // brown
      case "bright": return "#FFFFFF"; // white
      case "dark": return "#000000"; // black
      default: return "#00000000"; // transparent fallback
    }
  }

  const handleUpload = async () => {
    if (!localTitle.trim() && !localCaption.trim()) {
      alert("Please add a title or caption before posting.");
      return;
    }

    const {
      videoUri,
      trimStart,
      trimEnd,
      selectedMusic,
      overlays,
      filter,
      videoVolume,
      musicVolume,
      contentType,
    } = useUploadStore.getState();

    if (!videoUri) {
      alert("No video selected!");
      return;
    }

    setIsUploading(true);

    // const compressedUri = await VideoCompressor.compress(videoUri, {
    //   compressionMethod: 'auto',
    //   minimumFileSizeForCompress: 0,
    //   maxSize: 1280,
    //   progressDivider: 1,
    // });
    const formData = new FormData();

    // Video file
    const filename = videoUri.split("/").pop();
    const fileType = filename?.split(".").pop();
    formData.append("video", {
      uri: videoUri,
      name: filename,
      type: `video/${fileType}`,
    } as any);
    const hexFilterColor = filterNameToHex(filter);

    // Other metadata
    formData.append("contentType", contentType);
    formData.append("trimStart", trimStart.toString());
    formData.append("trimEnd", trimEnd.toString());
    formData.append("videoVolume", videoVolume.toString());
    formData.append("musicVolume", musicVolume.toString());
    formData.append("filter", hexFilterColor);
    formData.append("title", localTitle);
    formData.append("caption", localCaption);
    formData.append("hashtags", localHashtags);
    formData.append("mentions", localMentions);

    // Selected music
    if (selectedMusic?.uri) {
      formData.append("selectedMusicId", selectedMusic.id ?? "");
      formData.append("selectedMusicUri", selectedMusic.uri ?? "");
      formData.append("selectedMusicStartMs", (selectedMusic.startMs ?? 0).toString());
      formData.append("selectedMusicEndMs", (selectedMusic.endMs ?? 0).toString());
      formData.append("selectedMusicVolume", (selectedMusic.volume ?? 50).toString());
    }


    // Overlays
    formData.append("overlays", JSON.stringify(overlays));

    try {
      const response = await uploadReel(formData);
      console.log("Upload response:", response);
      alert("Upload successful!");
      useUploadStore.getState().resetAll();
      onDiscard()
    } catch (err: any) {
      console.error("Upload failed:", err?.response?.data || err.message);
      alert("Upload failed, check console");
    } finally {
      setIsUploading(false);
    }
  };



  // responsive scale factors
  const fontScale = width / 400; // adjust text size
  const paddingScale = width / 375; // adjust padding/margin

  const handleCaptionChange = (text: string) => {
    const words = text.trim().split(/\s+/);

    if (words.length <= 50) {
      setLocalCaption(text);
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Top bar */}
        <View
          style={[
            styles.topBar,
            { paddingHorizontal: 16 * paddingScale, paddingVertical: 12 * paddingScale },
          ]}
        >
          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="close" size={28 * fontScale} color={theme.text} />
          </TouchableOpacity>
          <Text
            style={[
              styles.topBarTitle,
              { color: theme.text, fontSize: 18 * fontScale },
            ]}
          >
            Upload {contentType}
          </Text>
          <TouchableOpacity onPress={handleUpload}>
            <Ionicons
              name="checkmark-circle"
              size={28 * fontScale}
              color={theme.buttonBg}
            />
          </TouchableOpacity>
        </View>

        {/* Scrollable form */}
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { padding: 16 * paddingScale }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title input */}
          <Text style={[styles.label, { color: theme.text, fontSize: 14 * fontScale }]}>
            Title
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.text,
                fontSize: 14 * fontScale,
                padding: 10 * paddingScale,
              },
            ]}
            placeholder="Enter title"
            placeholderTextColor={theme.placeholder}
            value={localTitle}
            onChangeText={setLocalTitle}
          />

          {/* Caption input */}
          <Text style={[styles.label, { color: theme.text, fontSize: 14 * fontScale }]}>
            Caption
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.captionInput,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.text,
                fontSize: 14 * fontScale,
                padding: 10 * paddingScale,
                height: 100 * (height / 800), // responsive caption box
              },
            ]}
            multiline
            placeholder="Write your caption here..."
            placeholderTextColor={theme.placeholder}
            value={localCaption}
            onChangeText={handleCaptionChange}
          />

          <View style = {{alignItems : "flex-end"}}>
            <Text
              style={{
                color: theme.placeholder,
                fontSize: 12 * fontScale,
                marginBottom: 12,
              }}>
              {localCaption.trim() === ""
                ? "0 / 50 "
                : `${localCaption.trim().split(/\s+/).length} / 50 words`}
            </Text>
          </View>

          {/* Hashtags input */}
          <Text style={[styles.label, { color: theme.text, fontSize: 14 * fontScale }]}>
            Hashtags
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.text,
                fontSize: 14 * fontScale,
                padding: 10 * paddingScale,
              },
            ]}
            placeholder="#example #fun"
            placeholderTextColor={theme.placeholder}
            value={localHashtags}
            onChangeText={setLocalHashtags}
          />

          {/* Mentions input */}
          <Text style={[styles.label, { color: theme.text, fontSize: 14 * fontScale }]}>
            Mentions
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.text,
                fontSize: 14 * fontScale,
                padding: 10 * paddingScale,
              },
            ]}
            placeholder="@user1 @user2"
            placeholderTextColor={theme.placeholder}
            value={localMentions}
            onChangeText={setLocalMentions}
          />

          {/* Upload button */}
          <TouchableOpacity
            style={[
              styles.uploadButton,
              {
                backgroundColor: theme.buttonBg,
                padding: 14 * paddingScale,
                borderRadius: 25 * paddingScale,
              },
            ]}
            onPress={handleUpload}
          >
            <Text
              style={[
                styles.uploadText,
                { color: theme.buttonText, fontSize: 16 * fontScale },
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {isUploading && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingBox, { backgroundColor: theme.background }]}>
            {/* <Ionicons name="cloud-upload-outline" size={50} color={theme.buttonBg} /> */}
            <ActivityIndicator size="large" color={theme.buttonBg} />
            <Text style={[styles.loadingText, { color: theme.text }]}>Uploding...</Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBarTitle: {
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
  },
  label: {
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  captionInput: {
    textAlignVertical: "top",
  },
  uploadButton: {
    alignItems: "center",
    marginTop: 10,
  },
  uploadText: {
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingBox: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FinalUpload;