import { useUploadStore } from '@/src/store/reelUploadStore';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';
const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const THUMB_SIZE = 24;

const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(val, max));

const TwoPointSlider = ({
    totalTime = 60,
    minTrim = 3,
    startSec = 0,
    endSec = 60,
    style = {},
    onTrimChange = (s: number, e: number) => { },
}) => {
    const [start, setStart] = useState(startSec);
    const [end, setEnd] = useState(endSec);

    const startBasePos = useRef(0);
    const endBasePos = useRef(0);

    const startRef = useRef(start);
    const endRef = useRef(end);

    const getPositionFromSec = (sec: number) =>
        (sec / totalTime) * SLIDER_WIDTH;

    const getSecFromPosition = (pos: number) =>
        clamp(Math.round((pos / SLIDER_WIDTH) * totalTime), 0, totalTime);

    // keep refs in sync
    useEffect(() => {
        startRef.current = start;
        endRef.current = end;
        onTrimChange(start, end);
    }, [start, end]);

    // updateStart with minTrim check
    const updateStart = (pos: number) => {
        const nextStart = getSecFromPosition(pos);
        if (end - nextStart < minTrim) {
            return;
        }
        setStart(nextStart);
        useUploadStore.getState().setTrimRange(nextStart, end);
    };

    const updateEnd = (pos: number) => {
        const nextEnd = getSecFromPosition(pos);
        if (nextEnd - start < minTrim) {
            return;
        }
        setEnd(nextEnd);
        useUploadStore.getState().setTrimRange(start, nextEnd);
    };

    const startPan = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                startBasePos.current = getPositionFromSec(startRef.current);
            },
            onPanResponderMove: (_, gesture) => {
                const pos = clamp(
                    startBasePos.current + gesture.dx,
                    0,
                    getPositionFromSec(endRef.current - minTrim)
                );
                updateStart(pos);
            },
        })
    ).current;

    const endPan = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                endBasePos.current = getPositionFromSec(endRef.current);
            },
            onPanResponderMove: (_, gesture) => {
                const pos = clamp(
                    endBasePos.current + gesture.dx,
                    getPositionFromSec(startRef.current + minTrim),
                    SLIDER_WIDTH
                );
                updateEnd(pos);
            },
        })
    ).current;

    return (
        <View style={[styles.container, style]}>
            <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>{start}s</Text>
                <Text style={styles.timeLabel}>{end}s</Text>
            </View>

            <View style={styles.sliderTrack}>
                {/* Highlighted region */}
                <View
                    style={[
                        styles.trimRegion,
                        {
                            left: getPositionFromSec(start),
                            width: getPositionFromSec(end) - getPositionFromSec(start),
                        },
                    ]}
                />

                <View
                    {...startPan.panHandlers}
                    style={[
                        styles.thumb,
                        { left: getPositionFromSec(start) - THUMB_SIZE / 2 },
                    ]}
                />

                <View
                    {...endPan.panHandlers}
                    style={[
                        styles.thumb,
                        { left: getPositionFromSec(end) - THUMB_SIZE / 2 },
                    ]}
                />
            </View>

            <Text
                style={[
                    styles.trimInfo,
                    {
                        width: SLIDER_WIDTH,
                        textAlign: 'center',
                    }
                ]}
            >
                {`Trim Length: ${end - start}s`}
            </Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 20,
        alignItems: 'center',
        width: SLIDER_WIDTH + 10,
    },
    timeRow: {
        width: SLIDER_WIDTH,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    sliderTrack: {
        width: SLIDER_WIDTH,
        height: 24,
        borderRadius: 12,
        position: 'relative',
        justifyContent: 'center',
        backgroundColor: '#ececec',
        marginBottom: 8,
    },
    trimRegion: {
        position: 'absolute',
        top: 5,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#349afe33',
    },
    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: '#1976d2',
        borderWidth: 2,
        borderColor: 'white',
        position: 'absolute',
        top: 0,
        zIndex: 2,
    },
    timeLabel: { fontSize: 14, color: '#444' },
    trimInfo: { marginTop: 4, color: '#1976d2', fontSize: 10 },
});

export default TwoPointSlider;
