import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface VideoProgressBarProps {
  player: any;
  isActive: boolean;
  paused: boolean;
}

const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ player, isActive, paused }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [duration, setDuration] = useState(0);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const updateIntervalRef = useRef<any>(null);
  const playerRef = useRef<any>(null);



  useEffect(() => {
    playerRef.current = player;
    return () => {
      playerRef.current = null;
    };
  }, [player]);

  const cleanup = useCallback(() => {
    animationRef.current?.stop();
    animationRef.current = null;

    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
  }, []);


  // Start smooth animation
  const startProgressAnimation = useCallback(
    (fromProgress: number, videoDuration: number) => {
      cleanup();

      const player = playerRef.current;
      if (!player || !isActive || paused) return;

      const remainingTime = (1 - fromProgress) * videoDuration;

      progressAnim.setValue(fromProgress);

      animationRef.current = Animated.timing(progressAnim, {
        toValue: 1,
        duration: remainingTime * 1000,
        useNativeDriver: false,
        isInteraction: false,
      });

      animationRef.current.start(({ finished }) => {
        if (!finished) return;

        const p = playerRef.current;
        if (!p || !isActive || paused) return;

        if (p.currentTime < 0.1 && p.playing) {
          startProgressAnimation(0, videoDuration);
        }
      });
    },
    [cleanup, isActive, paused]
  );


  // Get video duration
  useEffect(() => {
    if (!player) return;

    const statusListener = player.addListener('statusChange', () => {
      if (player.status === 'readyToPlay' && player.duration) {
        setDuration(player.duration);
      }
    });

    return () => statusListener.remove();
  }, [player]);

  useEffect(() => {
    if (!player || !isActive || duration <= 0) {
      cleanup();
      progressAnim.setValue(0);
      return;
    }

    const p = playerRef.current;
    if (!p) return;

    const currentTime = p.currentTime || 0;
    const progress = Math.min(currentTime / duration, 1);

    if (!paused) {
      startProgressAnimation(progress, duration);

      updateIntervalRef.current = setInterval(() => {
        const pl = playerRef.current;
        if (!pl || paused || !isActive) return;

        if (!pl.playing) {
          cleanup();
          progressAnim.setValue(
            Math.min((pl.currentTime || 0) / duration, 1)
          );
          return;
        }

        if (!animationRef.current) {
          startProgressAnimation(
            Math.min((pl.currentTime || 0) / duration, 1),
            duration
          );
        }
      }, 500);
    }
    else {
      cleanup();
      progressAnim.setValue(progress);
    }

    return cleanup;
  }, [player, isActive, paused, duration]);



  // Reset on inactive
  useEffect(() => {
    if (!isActive) {
      cleanup();
      progressAnim.setValue(0);
    }
  }, [isActive]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarFill,
            { width: progressWidth }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    paddingHorizontal: 4,
    paddingBottom: 4,
    zIndex: 10,
  },
  progressBarBackground: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});

export default VideoProgressBar;