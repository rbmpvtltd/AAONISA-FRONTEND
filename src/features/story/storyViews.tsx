import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Modal,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type Viewer = {
  id: string;
  name: string;
  username?: string;
  avatar?: string; // uri
  mutual?: boolean; // whether follow back
  time?: string; // e.g. '2h'
};

type Props = {
  visible: boolean;
  onClose: () => void;
  viewers: Viewer[];
  title?: string; // e.g. 'Seen by 24'
};

export default function StoryViewsDrawer({ visible, onClose, viewers, title }: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 60,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, backdropOpacity]);

  // Pan to dismiss
  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120) {
          // dismiss
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 180,
            useNativeDriver: true,
          }).start(() => onClose());
          Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }).start();
          panY.setValue(0);
        } else {
          Animated.timing(panY, {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const combinedTranslateY = Animated.add(translateY, panY).interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [0, SCREEN_HEIGHT],
    extrapolate: 'clamp',
  });

  const renderItem = ({ item }: { item: Viewer }) => (
    <View style={styles.viewerRow}>
      <Image
        source={{ uri: item.avatar || 'https://placehold.co/100x100' }}
        style={styles.avatar}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.nameText}>{item.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {item.username ? <Text style={styles.usernameText}>@{item.username}</Text> : null}
          {item.time ? <Text style={styles.timeText}>{item.time}</Text> : null}
        </View>
      </View>
      <TouchableOpacity style={styles.followBtn}>
        <Text style={styles.followBtnText}>{item.mutual ? 'Following' : 'Follow'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={true} transparent animationType="none">
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />

      <Animated.View
        style={[
          styles.sheetContainer,
          { transform: [{ translateY: combinedTranslateY }] },
        ]}
      >
        <Animated.View {...panResponder.panHandlers} style={styles.sheetHandleArea}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{title || `Seen by ${viewers.length}`}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <FlatList
          data={viewers}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.78,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 20,
  },
  sheetHandleArea: {
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: 'transparent',
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 6,
  },
  viewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 46 / 2,
    backgroundColor: '#eee',
  },
  nameText: {
    fontSize: 15,
    fontWeight: '600',
  },
  usernameText: {
    fontSize: 13,
    color: '#666',
  },
  timeText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 8,
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
