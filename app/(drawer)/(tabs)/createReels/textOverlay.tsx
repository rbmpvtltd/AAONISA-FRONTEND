import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
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
  onRemove: (id: string) => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

// Extended fixed palette
const COLORS = [
  "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FF00FF", "#FFA500",
  "#00FFFF", "#800080", "#FFC0CB", "#808080", "#FFD700", "#008000"
];


const TextOverlay: React.FC<TextOverlayProps> = ({ overlay, onUpdate, onRemove }) => {
  const x = useSharedValue(overlay.x);
  const y = useSharedValue(overlay.y);
  const scale = useSharedValue(overlay.scale);
  const rotation = useSharedValue(overlay.rotation);
  const startScale = useSharedValue(overlay.scale);
  const startRotation = useSharedValue(overlay.rotation);
  const startX = useSharedValue(overlay.x);
  const startY = useSharedValue(overlay.y);

  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(overlay.text);

  // ---------- DEBUG: log on overlay prop change ----------
  useEffect(() => {
    x.value = overlay.x;
    y.value = overlay.y;
    scale.value = overlay.scale;
    rotation.value = overlay.rotation;
  }, [overlay]);

  // ---------- debounce function ----------
  function debounce(func: (...args: any[]) => void, delay: number) {
    let timeout: NodeJS.Timeout;   //number;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }

  const updateOverlayToStore = debounce((updated: OverlayMetadata) => {
    onUpdate(updated);
  }, 50);

  // ---------- PAN ----------
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startX.value = x.value;
      startY.value = y.value;
    })
    .onUpdate((e) => {
      if (!isEditing) {
        x.value = startX.value + e.translationX;
        y.value = startY.value + e.translationY;
      }
    })
    .onEnd(() => {
  const finalOverlay = {
    id: overlay.id,
    text: overlay.text,
    color: overlay.color,
    fontSize: overlay.fontSize,
    x: x.value,
    y: y.value,
    scale: scale.value,
    rotation: rotation.value,
  };
  runOnJS(updateOverlayToStore)(finalOverlay);
});

  // ---------- PINCH ----------
  const pinchGesture = Gesture.Pinch()
    .onBegin(() => { startScale.value = scale.value; })
    .onUpdate((e) => {
      if (!isEditing) {
        const newScale = startScale.value * e.scale;
        scale.value = Math.min(Math.max(newScale, 0.3), 5); 
      }
    })
    .onEnd(() => {
  const finalOverlay = {
    id: overlay.id,
    text: overlay.text,
    color: overlay.color,
    fontSize: overlay.fontSize,
    x: x.value,
    y: y.value,
    scale: scale.value,
    rotation: rotation.value,
  };
  runOnJS(updateOverlayToStore)(finalOverlay);
});

  // ---------- ROTATION ----------
  const rotationGesture = Gesture.Rotation()
    .onBegin(() => { startRotation.value = rotation.value; })
    .onUpdate((e) => {
      if (!isEditing) {
        rotation.value = startRotation.value + e.rotation;
      }
    })
    .onEnd(() => {
  const finalOverlay = {
    id: overlay.id,
    text: overlay.text,
    color: overlay.color,
    fontSize: overlay.fontSize,
    x: x.value,
    y: y.value,
    scale: scale.value,
    rotation: rotation.value,
  };
  runOnJS(updateOverlayToStore)(finalOverlay);
});

  const combinedGesture = Gesture.Simultaneous(panGesture, pinchGesture, rotationGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value,
    top: y.value,
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
    zIndex: 100,
  }));

  // ---------- handlers for text ----------
  const applyTextChange = () => {
    if (tempText.trim() === '') return;
    const updatedText = preserveSpecialSymbols(overlay.text, tempText);
    console.log('Text updated:', updatedText);
    onUpdate({ ...overlay, text: updatedText });
    setTempText(updatedText);
    setIsEditing(false);
  };

  const preserveSpecialSymbols = (original: string, edited: string) => {
    if (!original || original.length === 0) return edited;
    if (original[0] === '#' || original[0] === '@') {
      let newText = original[0];
      if (edited[0] === original[0]) edited = edited.slice(1);
      newText += edited;
      return newText;
    }
    return edited;
  };

  const changeColor = (color: string) => {
    console.log('Color changed:', color);
    onUpdate({ ...overlay, color });
  };

  const removeOverlay = () => {
    onRemove(overlay.id);
  };

  const closeEditing = () => setIsEditing(false);

  // ---------- Render ----------
  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity activeOpacity={1} onPress={() => setIsEditing(true)}>
          <Text style={[styles.overlayText, { fontSize: overlay.fontSize, color: overlay.color }]}>
            {overlay.text}
          </Text>
        </TouchableOpacity>

        <Modal visible={isEditing} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.closeButton} onPress={closeEditing}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.colorScroll}
              contentContainerStyle={styles.colorRow}
            >
              {COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorCircle, { backgroundColor: c }]}
                  onPress={() => changeColor(c)}
                />
              ))}
            </ScrollView>

            <TextInput
              style={[styles.dummyInput, { color: overlay.color, maxHeight: 80 }]}
              value={tempText}
              onChangeText={setTempText}
              autoFocus
              multiline
              scrollEnabled
              onSubmitEditing={applyTextChange}
              onBlur={applyTextChange}
              blurOnSubmit
              keyboardAppearance="dark"
              returnKeyType="done"
            />

            <TouchableOpacity style={styles.removeButton} onPress={removeOverlay}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Animated.View>
    </GestureDetector>
  );
};


const styles = StyleSheet.create({
  overlayText: {
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  closeText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  colorScroll: {
    maxHeight: 80,
    marginBottom: 10,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#fff",
  },
  dummyInput: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.1)",
    fontSize: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 20,
  },
  removeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TextOverlay;
