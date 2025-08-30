import { useAudioPlayer } from 'expo-audio';
import { Button, StyleSheet, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


const audioSource = require('../../assets/audios/Hello.mp3');

export default function Audio() {
    const player = useAudioPlayer(audioSource);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Button title="Play Sound" onPress={() => player.play()} />
                <Button
                    title="Replay Sound"
                    onPress={() => {
                        player.seekTo(0);
                        player.play();
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 10,
    },
});
