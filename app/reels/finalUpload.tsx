import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface FinalUploadProps {
    contentType: "story" | "reels" | "news";
    onUpload: (data: {
        title: string;
        caption: string;
        hashtags: string;
        mentions: string;
        contentType: "story" | "reels" | "news";
    }) => void;
    onCancel: () => void;
}

const FinalUpload: React.FC<FinalUploadProps> = ({ contentType, onUpload, onCancel }) => {
    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [mentions, setMentions] = useState("");

    const handleUpload = () => {
        if (!title.trim() && !caption.trim()) {
            alert("Please add a title or caption before posting.");
            return;
        }
        onUpload({ title, caption, hashtags, mentions, contentType });
    };

    return (
        <View style={{ flex: 1, backgroundColor: "black", paddingTop: 40 }}>
            {/* Top bar */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    alignItems: "center",
                    paddingVertical: 12,
                }}
            >
                <TouchableOpacity onPress={onCancel}>
                    <Ionicons name="close" size={32} color="white" />
                </TouchableOpacity>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                    Upload {contentType}
                </Text>
                <TouchableOpacity onPress={handleUpload}>
                    <Ionicons name="checkmark-circle" size={32} color="#0095f6" />
                </TouchableOpacity>
            </View>

            {/* Keyboard-aware scroll view */}
            <KeyboardAwareScrollView
                contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === "ios" ? 20 : 120}
                keyboardOpeningTime={0}
                enableAutomaticScroll={true}
            >
                {/* Title input */}
                <Text style={{ color: "white", marginBottom: 4 }}>Title</Text>
                <TextInput
                    style={{
                        backgroundColor: "#222",
                        color: "white",
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 16,
                    }}
                    placeholder="Enter title"
                    placeholderTextColor="#888"
                    value={title}
                    onChangeText={setTitle}
                />

                {/* Caption input */}
                <Text style={{ color: "white", marginBottom: 4 }}>Caption</Text>
                <TextInput
                    style={{
                        backgroundColor: "#222",
                        color: "white",
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 16,
                        height: 100,
                        textAlignVertical: "top",
                    }}
                    multiline
                    placeholder="Write your caption here..."
                    placeholderTextColor="#888"
                    value={caption}
                    onChangeText={setCaption}
                />

                {/* Hashtags input */}
                <Text style={{ color: "white", marginBottom: 4 }}>Hashtags</Text>
                <TextInput
                    style={{
                        backgroundColor: "#222",
                        color: "white",
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 16,
                    }}
                    placeholder="#example #fun"
                    placeholderTextColor="#888"
                    value={hashtags}
                    onChangeText={setHashtags}
                />

                {/* Mentions input */}
                <Text style={{ color: "white", marginBottom: 4 }}>Mentions</Text>
                <TextInput
                    style={{
                        backgroundColor: "#222",
                        color: "white",
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 16,
                    }}
                    placeholder="@user1 @user2"
                    placeholderTextColor="#888"
                    value={mentions}
                    onChangeText={setMentions}
                />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default FinalUpload;
