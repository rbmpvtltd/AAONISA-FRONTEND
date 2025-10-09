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
