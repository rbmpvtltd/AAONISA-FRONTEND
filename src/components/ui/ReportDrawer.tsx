import { report } from "@/src/api/report.api";
import { useAppTheme } from "@/src/constants/themeHelper";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
const SCREEN_HEIGHT = Dimensions.get("window").height;

const reportOptions = [
    "I Just Don't Like It",
    "It's Spam",
    "Nudity Or Sexual activity",
    "Hate Speech Or Symbols",
    "Violence or dangerous organizations",
    "Bullying or harassment",
    "False information",
    "Scam or fraud",
    "Suicide or self-injury",
    "Sale of illegal or regulated goods",
    "Intellectual property violation",
    "Eating Disorders",
    "Something Else",
];

const ReportDrawer = ({ visible, onClose, onSelect, videoId }: any) => {
    const theme = useAppTheme();
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    const [customVisible, setCustomVisible] = useState(false);
    const [customText, setCustomText] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);
    const submitReport = async (text: string) => {
        try {
            setLoading(true);

            await report({
                videoId: videoId,
                description: text,
            });

            Alert.alert("Report Submitted", "Your report has been submitted successfully.");
            onClose();
        } catch (err: any) {
            const msg =
                err?.response?.data?.message || "Something went wrong while reporting";
            Alert.alert("Error", msg);
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
            <TouchableOpacity style={styles.overlayBg} onPress={onClose} />

            <Animated.View
                style={[
                    styles.drawer,
                    {
                        backgroundColor: theme.background,
                        transform: [{ translateY: slideAnim }],
                        borderTopColor: theme.inputBorder,
                    },
                ]}
            >


                <View style={[styles.header]}>
                    <Text style={[styles.title, { color: theme.text }]}>Report</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={reportOptions}

                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.optionBtn}
                            onPress={() => {
                                if (item === "Something Else") {
                                    setCustomVisible(true);
                                    return;
                                }
                                // Confirmation alert
                                Alert.alert(
                                    "Submit Report",
                                    `Are you sure you want to report "${item}"?`,
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => {
                                                console.log("Report canceled");
                                            },
                                            style: "cancel",
                                        },
                                        {
                                            text: "OK",
                                            onPress: () => {
                                                submitReport(item);
                                            },

                                        },
                                    ],
                                    { cancelable: true }
                                );
                            }}
                        >


                            <Text style={[styles.optionText, { color: theme.text }]}>{item}</Text>
                        </TouchableOpacity>

                    )}
                    showsVerticalScrollIndicator={false}
                />
                {/* CUSTOM INPUT BOX */}
                {/* SECOND DRAWER FOR CUSTOM INPUT */}
                <Animated.View
                    style={[
                        styles.customDrawer,
                        {
                            backgroundColor: theme.background,
                            transform: [{ translateY: customVisible ? 0 : 300 }],
                            borderTopColor: theme.inputBorder,
                        },
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>Describe Issue</Text>
                        <TouchableOpacity onPress={() => setCustomVisible(false)}>
                            <Ionicons name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={[
                            styles.input,
                            { color: theme.text, borderColor: theme.inputBorder },
                        ]}
                        placeholder="Write your reason..."
                        placeholderTextColor={theme.placeholder}
                        value={customText}
                        onChangeText={setCustomText}
                        multiline
                    />

                    <TouchableOpacity
                        style={styles.sendBtn}
                        disabled={loading}
                        onPress={async () => {
                            if (!customText.trim()) {
                                Alert.alert("Error", "Please write something first.");
                                return;
                            }

                            await submitReport(customText);
                            setCustomVisible(false);
                            setCustomText("");

                        }}
                    >
                        <Text style={styles.sendText}>{loading ? "Sending..." : "Send"}</Text>
                    </TouchableOpacity>
                </Animated.View>

            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 70,
        justifyContent: "flex-end",
        zIndex: 9999,
    },
    overlayBg: { flex: 1 },
    drawer: {
        paddingHorizontal: 15,
        paddingTop: 20,
        height: "68%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 0.5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        gap: 15,
        justifyContent: "space-between",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
    },
    optionBtn: {
        paddingVertical: 7,
    },
    optionText: {
        fontSize: 16,
    },
    customBox: {
        marginTop: 15,
        padding: 12,
        borderWidth: 0.5,
        borderRadius: 12,
    },
    customTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        minHeight: 60,
        fontSize: 15,
        marginBottom: 12,
    },
    sendBtn: {
        backgroundColor: "#1DA1F2",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    sendText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },
    customDrawer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        paddingTop: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginBottom: 20,

        //  TOP SHADOW
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },  // shadow UPWARDS
        shadowOpacity: 0.15,
        shadowRadius: 8,

        elevation: 15,// Android
    },

});

export default ReportDrawer;
