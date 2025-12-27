import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

export const createReelGesture = ({
    onTap,
    onLongPressIn,
    onLongPressOut,
    longPressDuration = 150,
}: {
    onTap: () => void;
    onLongPressIn: () => void;
    onLongPressOut: () => void;
    longPressDuration?: number;
}) => {
    const tapGesture = Gesture.Tap().onEnd(() => {
        runOnJS(onTap)();
    });

    const longPressGesture = Gesture.LongPress()
        .minDuration(longPressDuration)
        .onStart(() => {
            runOnJS(onLongPressIn)();
        })
        .onEnd(() => {
            runOnJS(onLongPressOut)();
        });

    return Gesture.Simultaneous(tapGesture, longPressGesture);
};
