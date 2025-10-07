
import { useAppTheme } from "@/src/constants/themeHelper";
import { useUploadStore } from "@/src/store/reelUploadStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Video as VideoCompressor } from 'react-native-compressor';

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
    const compressedUri = await VideoCompressor.compress(videoUri, {
      compressionMethod: 'auto',
      minimumFileSizeForCompress: 0,
      maxSize: 720,
      progressDivider: 1,
    });
    const formData = new FormData();

    // Video file
    const filename = compressedUri.split("/").pop();
    const fileType = filename?.split(".").pop();
    formData.append("video", {
      uri: compressedUri,
      name: filename,
      type: `video/${fileType}`,
    } as any);

    // Other metadata
    formData.append("contentType", contentType);
    formData.append("trimStart", trimStart.toString());
    formData.append("trimEnd", trimEnd.toString());
    formData.append("videoVolume", videoVolume.toString());
    formData.append("musicVolume", musicVolume.toString());
    formData.append("filter", filter);
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
    }
  };



  // responsive scale factors
  const fontScale = width / 400; // adjust text size
  const paddingScale = width / 375; // adjust padding/margin

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
            onChangeText={setLocalCaption}
          />

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
});

export default FinalUpload;