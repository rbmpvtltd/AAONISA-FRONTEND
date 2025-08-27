import { useAudioPlayer } from 'expo-audio';
import { Button, StyleSheet, View } from 'react-native';

const audioSource = require('../assets/Hello.mp3');

export default function Audio() {
    const player = useAudioPlayer(audioSource);

    return (
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



// import { Audio } from 'expo-av';
// import React, { useEffect, useState } from 'react';
// import { Button, StyleSheet, View } from 'react-native';

// export default function AudioPlayer() {
//     const [sound, setSound] = useState < Audio.Sound | null > (null);

//     async function playSound() {
//         const { sound } = await Audio.Sound.createAsync(
//             require('./assets/Hello.mp3') // your audio file
//         );
//         setSound(sound);
//         await sound.playAsync();
//     }

//     async function replaySound() {
//         if (sound) {
//             await sound.setPositionAsync(0);
//             await sound.playAsync();
//         }
//     }

//     // cleanup when component unmounts
//     useEffect(() => {
//         return sound
//             ? () => {
//                 sound.unloadAsync();
//             }
//             : undefined;
//     }, [sound]);

//     return (
//         <View style={styles.container}>
//             <Button title="Play Sound" onPress={playSound} />
//             <Button title="Replay Sound" onPress={replaySound} />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: '#ecf0f1',
//         padding: 10,
//     },
// });
