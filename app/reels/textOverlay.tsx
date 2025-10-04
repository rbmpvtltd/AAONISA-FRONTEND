import React from "react";
import { Text } from "react-native";
import {
    Gesture,
    GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";

export interface OverlayMetadata {
  id: string;
  text: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  fontSize: number;
  color: string;
}

interface TextOverlayProps {
  overlay: OverlayMetadata;
  onUpdate: (updated: OverlayMetadata) => void;
}

const TextOverlay: React.FC<TextOverlayProps> = ({ overlay, onUpdate }) => {
  const x = useSharedValue(overlay.x);
  const y = useSharedValue(overlay.y);
  const scale = useSharedValue(overlay.scale);
  const rotation = useSharedValue(overlay.rotation);

  /** MODERN GESTURE API **/
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      x.value = overlay.x + e.translationX;
      y.value = overlay.y + e.translationY;
    })
    .onEnd(() => {
      runOnJS(onUpdate)({ ...overlay, x: x.value, y: y.value });
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = overlay.scale * e.scale;
    })
    .onEnd(() => {
      runOnJS(onUpdate)({ ...overlay, scale: scale.value });
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = overlay.rotation + e.rotation;
    })
    .onEnd(() => {
      runOnJS(onUpdate)({ ...overlay, rotation: rotation.value });
    });

  const combinedGesture = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    rotationGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: x.value,
    top: y.value,
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={animatedStyle}>
        <Text
          style={{
            fontSize: overlay.fontSize,
            color: overlay.color,
            fontWeight: "bold",
          }}
        >
          {overlay.text}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default TextOverlay;
