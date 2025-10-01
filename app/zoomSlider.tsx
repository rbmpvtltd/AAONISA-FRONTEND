import React from 'react';
import { Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';

interface ZoomSliderProps {
    zoom: number; // 0 to 1
    onZoomChange: (value: number) => void;
}

export default function ZoomSlider({ zoom, onZoomChange }: ZoomSliderProps) {
    const sliderWidth = Dimensions.get('window').width - 40;
    const thumbSize = 20;

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                let newZoom = gestureState.dx / sliderWidth + zoom;
                if (newZoom < 0) newZoom = 0;
                if (newZoom > 1) newZoom = 1;
                onZoomChange(newZoom);
            },
        })
    ).current;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Zoom: {(zoom * 100).toFixed(0)}%</Text>
            <View style={styles.sliderTrack}>
                <View style={[styles.sliderFilled, { width: zoom * sliderWidth }]} />
                <View
                    style={[styles.thumb, { left: zoom * sliderWidth - thumbSize / 2 }]}
                    {...panResponder.panHandlers}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginHorizontal: 20, marginBottom: 20 },
    label: { color: 'white', marginBottom: 5 },
    sliderTrack: {
        height: 10,
        backgroundColor: 'gray',
        borderRadius: 5,
        position: 'relative',
    },
    sliderFilled: {
        height: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'red',
        position: 'absolute',
        top: -5,
    },
});

// import React, { useState } from "react";
// import { View, StyleSheet, Text, PanResponder, Dimensions, TextInput } from "react-native";

// const { width } = Dimensions.get("window");

// const ModernLineSlider = ({ totalTime = 30 }) => {
//   const lineWidth = width - 60; // modern padding
//   const lineHeight = 6;

//   const [startPos, setStartPos] = useState(0);
//   const [endPos, setEndPos] = useState(lineWidth);
//   const [customTime, setCustomTime] = useState(totalTime);

//   const panResponderStart = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderMove: (_, gestureState) => {
//       let newPos = Math.max(0, Math.min(gestureState.dx + startPos, endPos - 20));
//       setStartPos(newPos);
//     },
//   });

//   const panResponderEnd = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderMove: (_, gestureState) => {
//       let newPos = Math.max(startPos + 20, Math.min(gestureState.dx + endPos, lineWidth));
//       setEndPos(newPos);
//     },
//   });

//   const getTime = (pos) => {
//     // now uses user-defined totalTime
//     return Math.round((pos / lineWidth) * customTime);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Total Time Input */}
//       <View style={styles.timeInputContainer}>
//         <Text style={{ marginRight: 10 }}>Total Time (sec):</Text>
//         <TextInput
//           style={styles.timeInput}
//           keyboardType="numeric"
//           value={customTime.toString()}
//           onChangeText={(text) => {
//             const num = parseInt(text) || 1;
//             setCustomTime(num);
//           }}
//         />
//       </View>

//       {/* Line */}
//       <View style={[styles.line, { width: lineWidth, height: lineHeight }]} />

//       {/* Highlighted section between points */}
//       <View
//         style={[
//           styles.activeLine,
//           {
//             left: startPos,
//             width: endPos - startPos,
//             height: lineHeight,
//           },
//         ]}
//       />

//       {/* Start Point */}
//       <View
//         {...panResponderStart.panHandlers}
//         style={[styles.point, { left: startPos - 15, backgroundColor: "#4CAF50" }]}
//       >
//         <Text style={styles.timeText}>{getTime(startPos)}s</Text>
//       </View>

//       {/* End Point */}
//       <View
//         {...panResponderEnd.panHandlers}
//         style={[styles.point, { left: endPos - 15, backgroundColor: "#F44336" }]}
//       >
//         <Text style={styles.timeText}>{getTime(endPos)}s</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 100,
//     alignItems: "flex-start",
//     justifyContent: "center",
//     height: 150,
//     paddingHorizontal: 20,
//   },
//   line: {
//     backgroundColor: "#E0E0E0",
//     position: "absolute",
//     top: 80,
//     borderRadius: 3,
//   },
//   activeLine: {
//     position: "absolute",
//     top: 80,
//     backgroundColor: "#2196F3",
//     borderRadius: 3,
//   },
//   point: {
//     position: "absolute",
//     top: 70,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
//   timeText: {
//     position: "absolute",
//     top: -25,
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   timeInputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   timeInput: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     width: 60,
//     padding: 5,
//     textAlign: "center",
//   },
// });

// export default ModernLineSlider;
