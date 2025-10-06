// import { Ionicons } from "@expo/vector-icons";
// import React, { useState } from "react";
// import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// interface FinalUploadProps {
//     contentType: "story" | "reels" | "news";
//     onUpload: (data: {
//         title: string;
//         caption: string;
//         hashtags: string;
//         mentions: string;
//         contentType: "story" | "reels" | "news";
//     }) => void;
//     onCancel: () => void;
// }

// const FinalUpload: React.FC<FinalUploadProps> = ({ contentType, onUpload, onCancel }) => {
//     const [title, setTitle] = useState("");
//     const [caption, setCaption] = useState("");
//     const [hashtags, setHashtags] = useState("");
//     const [mentions, setMentions] = useState("");

//     const handleUpload = () => {
//         if (!title.trim() && !caption.trim()) {
//             alert("Please add a title or caption before posting.");
//             return;
//         }
//         onUpload({ title, caption, hashtags, mentions, contentType });
//     };

//     return (
//         <View style={{ flex: 1, backgroundColor: "black", paddingTop: 40 }}>
//             {/* Top bar */}
//             <View
//                 style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     paddingHorizontal: 16,
//                     alignItems: "center",
//                     paddingVertical: 12,
//                 }}
//             >
//                 <TouchableOpacity onPress={onCancel}>
//                     <Ionicons name="close" size={32} color="white" />
//                 </TouchableOpacity>
//                 <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
//                     Upload {contentType}
//                 </Text>
//                 <TouchableOpacity onPress={handleUpload}>
//                     <Ionicons name="checkmark-circle" size={32} color="#0095f6" />
//                 </TouchableOpacity>
//             </View>

//             {/* Keyboard-aware scroll view */}
//             <KeyboardAwareScrollView
//                 contentContainerStyle={{ padding: 16, flexGrow: 1 }}
//                 enableOnAndroid={true}
//                 extraScrollHeight={Platform.OS === "ios" ? 20 : 120}
//                 keyboardOpeningTime={0}
//                 enableAutomaticScroll={true}
//             >
//                 {/* Title input */}
//                 <Text style={{ color: "white", marginBottom: 4 }}>Title</Text>
//                 <TextInput
//                     style={{
//                         backgroundColor: "#222",
//                         color: "white",
//                         padding: 10,
//                         borderRadius: 8,
//                         marginBottom: 16,
//                     }}
//                     placeholder="Enter title"
//                     placeholderTextColor="#888"
//                     value={title}
//                     onChangeText={setTitle}
//                 />

//                 {/* Caption input */}
//                 <Text style={{ color: "white", marginBottom: 4 }}>Caption</Text>
//                 <TextInput
//                     style={{
//                         backgroundColor: "#222",
//                         color: "white",
//                         padding: 10,
//                         borderRadius: 8,
//                         marginBottom: 16,
//                         height: 100,
//                         textAlignVertical: "top",
//                     }}
//                     multiline
//                     placeholder="Write your caption here..."
//                     placeholderTextColor="#888"
//                     value={caption}
//                     onChangeText={setCaption}
//                 />

//                 {/* Hashtags input */}
//                 <Text style={{ color: "white", marginBottom: 4 }}>Hashtags</Text>
//                 <TextInput
//                     style={{
//                         backgroundColor: "#222",
//                         color: "white",
//                         padding: 10,
//                         borderRadius: 8,
//                         marginBottom: 16,
//                     }}
//                     placeholder="#example #fun"
//                     placeholderTextColor="#888"
//                     value={hashtags}
//                     onChangeText={setHashtags}
//                 />

//                 {/* Mentions input */}
//                 <Text style={{ color: "white", marginBottom: 4 }}>Mentions</Text>
//                 <TextInput
//                     style={{
//                         backgroundColor: "#222",
//                         color: "white",
//                         padding: 10,
//                         borderRadius: 8,
//                         marginBottom: 16,
//                     }}
//                     placeholder="@user1 @user2"
//                     placeholderTextColor="#888"
//                     value={mentions}
//                     onChangeText={setMentions}
//                 />
//             </KeyboardAwareScrollView>
//         </View>
//     );
// };

// export default FinalUpload;
// FinalUploadZustand.tsx
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
import { useUploadStore } from "../../src/store/reelUploadStore";

interface FinalUploadProps {
  onCancel: () => void;
}

const FinalUpload: React.FC<FinalUploadProps> = ({ onCancel }) => {
  const { width, height } = useWindowDimensions();
  const fontScale = width / 400;
  const paddingScale = width / 375;

  // Zustand state & actions
  const {
    title,
    caption,
    hashtags,
    mentions,
    contentType,
    setUploadMetadata
  } = useUploadStore();

  // Local state to handle input temporarily before committing to store
  const [localTitle, setLocalTitle] = useState(title);
  const [localCaption, setLocalCaption] = useState(caption);
  const [localHashtags, setLocalHashtags] = useState(hashtags);
  const [localMentions, setLocalMentions] = useState(mentions);

  const handleUpload = () => {
  if (!localTitle.trim() && !localCaption.trim()) {
    alert("Please add a title or caption before posting.");
    return;
  }

  // 1️⃣ Update zustand store
  setUploadMetadata({
    title: localTitle,
    caption: localCaption,
    hashtags: localHashtags,
    mentions: localMentions,
  });

  // 2️⃣ Fetch all relevant data from store
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

  // 3️⃣ Console log / ready for API
  console.log({
    contentType,
    videoUri,
    trimStart,
    trimEnd,
    selectedMusic,
    overlays,
    filter,
    videoVolume,
    musicVolume,
    title: localTitle,
    caption: localCaption,
    hashtags: localHashtags,
    mentions: localMentions,
  });

  alert("Check console for upload data!");
};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={[styles.container]}>
        {/* Top bar */}
        <View style={[styles.topBar, { paddingHorizontal: 16 * paddingScale, paddingVertical: 12 * paddingScale }]}>
          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="close" size={28 * fontScale} color="white" />
          </TouchableOpacity>
          <Text style={[styles.topBarTitle, { fontSize: 18 * fontScale }]}>
            Upload {contentType}
          </Text>
          <TouchableOpacity onPress={handleUpload}>
            <Ionicons name="checkmark-circle" size={28 * fontScale} color="#0095f6" />
          </TouchableOpacity>
        </View>

        {/* Scrollable form */}
        <ScrollView contentContainerStyle={[styles.scrollContent, { padding: 16 * paddingScale }]}>
          {/* Title input */}
          <Text style={[styles.label, { fontSize: 14 * fontScale }]}>Title</Text>
          <TextInput
            style={[styles.input, { fontSize: 14 * fontScale, padding: 10 * paddingScale }]}
            placeholder="Enter title"
            placeholderTextColor="#888"
            value={localTitle}
            onChangeText={setLocalTitle}
          />

          {/* Caption input */}
          <Text style={[styles.label, { fontSize: 14 * fontScale }]}>Caption</Text>
          <TextInput
            style={[styles.input, styles.captionInput, { fontSize: 14 * fontScale, padding: 10 * paddingScale, height: 100 * (height / 800) }]}
            multiline
            placeholder="Write your caption here..."
            placeholderTextColor="#888"
            value={localCaption}
            onChangeText={setLocalCaption}
          />

          {/* Hashtags input */}
          <Text style={[styles.label, { fontSize: 14 * fontScale }]}>Hashtags</Text>
          <TextInput
            style={[styles.input, { fontSize: 14 * fontScale, padding: 10 * paddingScale }]}
            placeholder="#example #fun"
            placeholderTextColor="#888"
            value={localHashtags}
            onChangeText={setLocalHashtags}
          />

          {/* Mentions input */}
          <Text style={[styles.label, { fontSize: 14 * fontScale }]}>Mentions</Text>
          <TextInput
            style={[styles.input, { fontSize: 14 * fontScale, padding: 10 * paddingScale }]}
            placeholder="@user1 @user2"
            placeholderTextColor="#888"
            value={localMentions}
            onChangeText={setLocalMentions}
          />

          {/* Upload button */}
          <TouchableOpacity style={[styles.uploadButton, { padding: 14 * paddingScale, borderRadius: 25 * paddingScale }]} onPress={handleUpload}>
            <Text style={[styles.uploadText, { fontSize: 16 * fontScale }]}>Post</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", paddingTop: 40 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  topBarTitle: { fontWeight: "bold", color: "white" },
  scrollContent: { flexGrow: 1 },
  label: { marginBottom: 4, color: "white" },
  input: { borderWidth: 1, borderColor: "#333", borderRadius: 8, marginBottom: 16, color: "white", backgroundColor: "#222" },
  captionInput: { textAlignVertical: "top" },
  uploadButton: { alignItems: "center", marginTop: 10, backgroundColor: "#0095f6" },
  uploadText: { fontWeight: "bold", color: "white" },
});

export default FinalUpload;
