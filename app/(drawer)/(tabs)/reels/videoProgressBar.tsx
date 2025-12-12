// import React, { useEffect, useState } from 'react';
// import { Animated, StyleSheet, View } from 'react-native';

// interface VideoProgressBarProps {
//   player: any;
//   isActive: boolean;
// }

// const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ player, isActive }) => {
//   const [progress] = useState(new Animated.Value(0));
//   const [duration, setDuration] = useState(0);
//   const [animation, setAnimation] = useState<Animated.CompositeAnimation | null>(null);

//   useEffect(() => {
//     if (!player) return;

//     // Get video duration
//     const statusListener = player.addListener('statusChange', () => {
//       if (player.status === 'readyToPlay' && player.duration) {
//         setDuration(player.duration);
//       }
//     });

//     return () => statusListener.remove();
//   }, [player]);

//   useEffect(() => {
//     // Reset progress when not active
//     if (!isActive) {
//       progress.setValue(0);
//       if (animation) {
//         animation.stop();
//         setAnimation(null);
//       }
//       return;
//     }

//     // Start animation when active and duration is available
//     if (isActive && duration > 0 && player) {
//       // Get current position
//       const currentPosition = player.currentTime || 0;
//       const remainingTime = duration - currentPosition;
      
//       // Set initial progress
//       const initialProgress = currentPosition / duration;
//       progress.setValue(initialProgress);

//       // Animate from current position to end based on remaining time
//       const anim = Animated.timing(progress, {
//         toValue: 1,
//         duration: remainingTime * 1000, // Convert to milliseconds
//         useNativeDriver: false,
//       });

//       anim.start();
//       setAnimation(anim);

//       return () => {
//         anim.stop();
//       };
//     }
//   }, [player, isActive, duration]);

//   // Handle video pause/play
//   useEffect(() => {
//     if (!player || !isActive) return;

//     const playbackListener = player.addListener('playbackStatusUpdate', (status: any) => {
//       if (status.isPlaying && duration > 0) {
//         // Resume animation
//         const currentPosition = player.currentTime || 0;
//         const remainingTime = duration - currentPosition;
        
//         if (animation) {
//           animation.stop();
//         }

//         const anim = Animated.timing(progress, {
//           toValue: 1,
//           duration: remainingTime * 1000,
//           useNativeDriver: false,
//         });

//         anim.start();
//         setAnimation(anim);
//       } else if (!status.isPlaying) {
//         // Pause animation
//         if (animation) {
//           animation.stop();
//         }
//       }
//     });

//     return () => playbackListener?.remove();
//   }, [player, isActive, duration, animation]);

//   const progressWidth = progress.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0%', '100%'],
//     extrapolate: 'clamp',
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.progressBarBackground}>
//         <Animated.View 
//           style={[
//             styles.progressBarFill,
//             { width: progressWidth }
//           ]} 
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     bottom: 90,
//     left: 0,
//     right: 0,
//     paddingHorizontal: 4,
//     paddingBottom: 4,
//     zIndex: 10,
//   },
//   progressBarBackground: {
//     height: 2,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     borderRadius: 2,
//     overflow: 'hidden',
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: '#fff',
//     borderRadius: 2,
//   },
// });

// export default VideoProgressBar;

// ============================================

// import React, { useEffect, useRef, useState } from 'react';
// import { Animated, StyleSheet, View } from 'react-native';

// interface VideoProgressBarProps {
//   player: any;
//   isActive: boolean;
// }

// const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ player, isActive }) => {
//   const [progress] = useState(new Animated.Value(0));
//   const [duration, setDuration] = useState(0);
//   const animationRef = useRef<Animated.CompositeAnimation | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const lastPositionRef = useRef(0);

//   useEffect(() => {
//     if (!player) return;

//     // Monitor video status for loading and duration
//     const statusListener = player.addListener('statusChange', () => {
//       // Get duration when ready
//       if (player.status === 'readyToPlay' && player.duration) {
//         setDuration(player.duration);
//         setIsLoading(false);
//       }
      
//       // Handle loading state
//       if (player.status === 'loading') {
//         setIsLoading(true);
//         // Stop animation during loading
//         if (animationRef.current) {
//           animationRef.current.stop();
//         }
//       }
//     });

//     return () => statusListener.remove();
//   }, [player]);

//   // Main animation effect
//   useEffect(() => {
//     if (!player || !isActive || duration <= 0 || isLoading) {
//       return;
//     }

//     const startAnimation = () => {
//       // Get current video position
//       const currentPosition = player.currentTime || 0;
//       lastPositionRef.current = currentPosition;
      
//       // Calculate progress and remaining time
//       const currentProgress = currentPosition / duration;
//       const remainingTime = duration - currentPosition;

//       // Reset if video completed (loop restart)
//       if (currentPosition < 0.1 && currentProgress > 0.9) {
//         progress.setValue(0);
//         lastPositionRef.current = 0;
//       } else {
//         progress.setValue(currentProgress);
//       }

//       // Stop any existing animation
//       if (animationRef.current) {
//         animationRef.current.stop();
//       }

//       // Start new animation for remaining time
//       if (remainingTime > 0) {
//         const anim = Animated.timing(progress, {
//           toValue: 1,
//           duration: remainingTime * 1000,
//           useNativeDriver: false,
//         });

//         animationRef.current = anim;
//         anim.start(({ finished }) => {
//           if (finished) {
//             // Reset to 0 when complete (for looping videos)
//             progress.setValue(0);
//             lastPositionRef.current = 0;
//           }
//         });
//       }
//     };

//     startAnimation();

//     return () => {
//       if (animationRef.current) {
//         animationRef.current.stop();
//       }
//     };
//   }, [player, isActive, duration, isLoading]);

//   // Handle video state changes (play/pause/loading)
//   useEffect(() => {
//     if (!player || !isActive || duration <= 0) return;

//     let intervalId: any;

//     // Check video state every 100ms
//     intervalId  = setInterval(() => {
//       const currentTime = player.currentTime || 0;
//       const isPlaying = player.playing;
//       const status = player.status;

//       // Video is loading
//       if (status === 'loading') {
//         if (!isLoading) {
//           setIsLoading(true);
//           if (animationRef.current) {
//             animationRef.current.stop();
//           }
//         }
//         return;
//       }

//       // Video finished loading
//       if (isLoading && status === 'readyToPlay') {
//         setIsLoading(false);
        
//         // Resume from last position
//         const resumePosition = lastPositionRef.current;
//         const remainingTime = duration - resumePosition;
        
//         progress.setValue(resumePosition / duration);
        
//         if (animationRef.current) {
//           animationRef.current.stop();
//         }

//         const anim = Animated.timing(progress, {
//           toValue: 1,
//           duration: remainingTime * 1000,
//           useNativeDriver: false,
//         });

//         animationRef.current = anim;
//         anim.start();
//         return;
//       }

//       // Video paused (user holding)
//       if (!isPlaying && !isLoading) {
//         lastPositionRef.current = currentTime;
//         if (animationRef.current) {
//           animationRef.current.stop();
//         }
//         progress.setValue(currentTime / duration);
//         return;
//       }

//       // Video resumed playing
//       if (isPlaying && animationRef.current === null) {
//         const remainingTime = duration - currentTime;
//         lastPositionRef.current = currentTime;
        
//         progress.setValue(currentTime / duration);
        
//         const anim = Animated.timing(progress, {
//           toValue: 1,
//           duration: remainingTime * 1000,
//           useNativeDriver: false,
//         });

//         animationRef.current = anim;
//         anim.start(({ finished }) => {
//           if (finished) {
//             progress.setValue(0);
//             lastPositionRef.current = 0;
//           }
//         });
//       }

//       // Video looped (restarted)
//       if (currentTime < lastPositionRef.current - 1) {
//         progress.setValue(0);
//         lastPositionRef.current = 0;
        
//         if (animationRef.current) {
//           animationRef.current.stop();
//         }

//         const anim = Animated.timing(progress, {
//           toValue: 1,
//           duration: duration * 1000,
//           useNativeDriver: false,
//         });

//         animationRef.current = anim;
//         anim.start();
//       }
//     }, 100);

//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [player, isActive, duration, isLoading]);

//   // Reset when video changes
//   useEffect(() => {
//     if (!isActive) {
//       progress.setValue(0);
//       lastPositionRef.current = 0;
//       if (animationRef.current) {
//         animationRef.current.stop();
//         animationRef.current = null;
//       }
//     }
//   }, [isActive]);

//   const progressWidth = progress.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0%', '100%'],
//     extrapolate: 'clamp',
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.progressBarBackground}>
//         <Animated.View 
//           style={[
//             styles.progressBarFill,
//             { width: progressWidth }
//           ]} 
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     bottom: 90,
//     left: 0,
//     right: 0,
//     paddingHorizontal: 4,
//     paddingBottom: 4,
//     zIndex: 10,
//   },
//   progressBarBackground: {
//     height: 2,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     borderRadius: 2,
//     overflow: 'hidden',
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: '#fff',
//     borderRadius: 2,
//   },
// });

// export default VideoProgressBar;

// ============================================

import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface VideoProgressBarProps {
  player: any;
  isActive: boolean;
}

const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ player, isActive }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [duration, setDuration] = useState(0);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const updateIntervalRef = useRef<any>(null);

  // Cleanup function
  const cleanup = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
  };

  // Start smooth animation
  const startProgressAnimation = (fromProgress: number, videoDuration: number) => {
    cleanup();

    const remainingTime = (1 - fromProgress) * videoDuration;
    
    progressAnim.setValue(fromProgress);

    const anim = Animated.timing(progressAnim, {
      toValue: 1,
      duration: remainingTime * 1000,
      useNativeDriver: false,
      isInteraction: false,
    });

    animationRef.current = anim;
    
    anim.start(({ finished }) => {
      if (finished) {
        // Loop ke liye reset
        progressAnim.setValue(0);
        if (isActive && player?.playing) {
          startProgressAnimation(0, videoDuration);
        }
      }
    });
  };

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

  // Main progress sync effect
  useEffect(() => {
    if (!player || !isActive || duration <= 0) {
      cleanup();
      progressAnim.setValue(0);
      return;
    }

    // Initial start
    const currentTime = player.currentTime || 0;
    const currentProgress = Math.min(currentTime / duration, 1);
    startProgressAnimation(currentProgress, duration);

    // Sync every 500ms for accuracy
    updateIntervalRef.current = setInterval(() => {
      if (!player) return;

      const status = player.status;
      const playing = player.playing;
      const time = player.currentTime || 0;
      const calculatedProgress = Math.min(time / duration, 1);

      // Video loading - pause animation
      if (status === 'loading') {
        if (animationRef.current) {
          animationRef.current.stop();
          animationRef.current = null;
        }
        return;
      }

      // Video paused - sync and stop
      if (!playing) {
        if (animationRef.current) {
          animationRef.current.stop();
          animationRef.current = null;
        }
        progressAnim.setValue(calculatedProgress);
        return;
      }

      // Video playing but animation stopped - restart
      if (playing && !animationRef.current) {
        startProgressAnimation(calculatedProgress, duration);
        return;
      }

      // Check if progress is way off (seeking/loop detected)
      const currentAnimProgress = (progressAnim as any)._value || 0;
      const progressDiff = Math.abs(currentAnimProgress - calculatedProgress);
      
      if (progressDiff > 0.1) {
        // Re-sync animation
        startProgressAnimation(calculatedProgress, duration);
      }
    }, 500);

    return cleanup;
  }, [player, isActive, duration]);

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