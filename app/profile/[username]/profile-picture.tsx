import { useAppTheme } from "@/src/constants/themeHelper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePictureScreen() {
    const theme = useAppTheme();
    const router = useRouter();
    const { imageUrl, username } = useLocalSearchParams();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'black' }]}>
            {/* Close Button */}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.back()}
            >
                <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Full Screen Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl as string }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});