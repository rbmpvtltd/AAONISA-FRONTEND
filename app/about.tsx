import { Link } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function about() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <Link href="/" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Go To Feed</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/profile/[id]" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Go To Profile</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
})