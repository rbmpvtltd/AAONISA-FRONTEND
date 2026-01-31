import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "@/src/constants/themeHelper";

const DEFAULT_THUMBNAIL = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const BOTTOM_PADDING = 100;

interface SearchHistoryItem {
    id: string;
    username: string;
    profilePicture?: string;
    name?: string;
    role?: string;
    timestamp: number;
}

interface SearchHistoryProps {
    history: SearchHistoryItem[];
    onItemPress: (item: SearchHistoryItem) => void;
    onRemove: (id: string) => void;
    onClearAll: () => void;
}

export const SearchHistory = ({
    history,
    onItemPress,
    onRemove,
    onClearAll,
}: SearchHistoryProps) => {
    const theme = useAppTheme();

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal: 12,
                paddingBottom: BOTTOM_PADDING,
            }}
        >
            {/* Header */}
            <View style={styles.historyHeader}>
                <Text style={[styles.historyTitle, { color: theme.text }]}>Recent</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={onClearAll}>
                    <Text style={[styles.clearText, { color: theme.buttonBg }]}>
                        Clear All
                    </Text>
                </TouchableOpacity>
            </View>

            {/* History Items */}
            {history.map((item) => (
                <View key={item.id} style={styles.historyItemContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.historyItem}
                        onPress={() => onItemPress(item)}
                    >
                        <Image
                            source={{ uri: item.profilePicture || DEFAULT_THUMBNAIL }}
                            style={styles.avatar}
                        />
                        <View style={styles.textContainer}>
                            <View style={styles.usernameRow}>
                                <Text style={[styles.username, { color: theme.text }]}>
                                    {item.username}
                                </Text>
                                {item.role === "admin" && (
                                    // <MaterialIcons
                                    //     name="verified"
                                    //     size={18}
                                    //     color="#0095F6"
                                    //     style={styles.verifiedIcon}
                                    // />
                                    <Image
                                        source={require("@/assets/images/blue-tick.png")}
                                        style={styles.verifiedBadge}
                                        resizeMode="contain"
                                    />
                                )}
                            </View>
                            {item.name && (
                                <Text style={[styles.name, { color: theme.subtitle }]}>
                                    {item.name}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => onRemove(item.id)}
                        style={styles.removeButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="close" size={20} color={theme.subtitle} />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    historyHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    clearText: {
        fontSize: 14,
        fontWeight: "500",
    },
    historyItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    historyItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    removeButton: {
        padding: 8,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 25,
    },
    textContainer: {
        marginLeft: 12,
    },
    usernameRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    username: {
        fontSize: 16,
        fontWeight: "600",
    },
    verifiedBadge: {
        width: 18,
        height: 18,
        marginLeft: 2,
        marginTop: 2,
    },
    // verifiedIcon: {
    //     marginLeft: 4,
    //     marginTop: 1,
    // },
    name: {
        fontSize: 13,
        marginTop: 2,
    },
});