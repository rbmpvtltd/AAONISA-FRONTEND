// import { ResizeMode, Video } from 'expo-av';
// import { useRouter } from "expo-router";

// import React, { useEffect } from 'react';
// import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

// interface Reel {
//   uuid: string;
//   videoUrl: string;
//   thumbnail?: string;
// }

// interface Props {
//   reels: Reel[];
//   onSelectReel: (id: string) => void;
// }

// const CategoryReelGrid: React.FC<Props> = ({ reels, onSelectReel }) => {
//   const router = useRouter();

//   useEffect(() => {
//     console.log("CategoryReelGrid mounted");
//     console.log("Reels received:", reels);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={reels}
//         numColumns={3}
//         keyExtractor={(item) => item.uuid}
//         ListEmptyComponent={() => (
//           <View style={{ padding: 30, alignItems: 'center' }}>
//             <View style={{ width: 50, height: 50, backgroundColor: '#ccc', borderRadius: 8 }} />
//           </View>
//         )}
//         renderItem={({ item }) => {
//           return (
//             <TouchableOpacity
//               onPress={() => router.push(`/bookmark/reelscard?reelId=${item.uuid}`)
// }
//               style={styles.touchBox}
//               activeOpacity={0.7}
//             >
//               <Video
//                 source={{ uri: item.videoUrl }}
//                 style={styles.thumb}
//                 resizeMode={ResizeMode.COVER}
//                 shouldPlay={false}   // No auto play
//                 isMuted               // no sound
//                 usePoster             // ensures first frame visible
//                 posterSource={item.thumbnail ? { uri: item.thumbnail } : undefined}
//                 onError={() => console.log(" video thumbnail load error")}
//               />
//             </TouchableOpacity>
//           );
//         }}
//       />
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   touchBox: { margin: 5 },
//   thumb: {
//     width: 120,
//     height: 200,
//     borderRadius: 8,
//     backgroundColor: "#000",
//   },
// });

// export default CategoryReelGrid;


import { useAppTheme } from '@/src/constants/themeHelper'; // 👈 theme import
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from "expo-router";
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBookmarkStore } from '../../store/useBookmarkStore';
import { removeReelFromBookmark } from './api';

interface Reel {
  uuid: string;
  videoUrl: string;
  thumbnail?: string;
}

interface Props {
  reels: Reel[];
  onSelectReel: (id: string) => void;
}

const CategoryReelGrid: React.FC<Props> = ({ reels, onSelectReel }) => {
  const router = useRouter();
  const theme = useAppTheme(); // 👈 use theme here
  const { removeReelFromCategory } = useBookmarkStore();

const handleDelete = async (reelId: string) => {
  try {
    await removeReelFromBookmark(reelId); // 🔥 API call
    removeReelFromCategory(reelId);       // 🔥 Zustand update
  } catch (err) {
    console.log('Failed to remove bookmark', err);
  }
};

  useEffect(() => {
    console.log("CategoryReelGrid mounted");
    console.log("Reels received:", reels);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={reels}
        numColumns={3}
        keyExtractor={(item) => item.uuid}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
    <Text style={[styles.emptyText, { color: theme.subtitle }]}>
      No bookmarked reels yet
    </Text>
  </View>
        )}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
  onPress={() =>
    router.push(`/bookmark/reelscard?reelId=${item.uuid}`)
  }
  style={styles.touchBox}
  activeOpacity={0.7}
>
  <View>
    <Video
      source={{ uri: item.videoUrl }}
      style={[styles.thumb, { backgroundColor: theme.subtitle }]}
      resizeMode={ResizeMode.COVER}
      shouldPlay={false}
      isMuted
      usePoster
      posterSource={item.thumbnail ? { uri: item.thumbnail } : undefined}
    />

    {/* 🗑 DELETE BUTTON */}
    <TouchableOpacity
      style={styles.deleteBtn}
      onPress={() => handleDelete(item.uuid)}
      activeOpacity={0.8}
    >
      <Ionicons name="trash-outline" size={18} color="#fff" />
    </TouchableOpacity>
  </View>
</TouchableOpacity>

          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  touchBox: { margin: 5 },
  thumb: {
    width: 120,
    height: 200,
    borderRadius: 8,
  },
  deleteBtn: {
  position: 'absolute',
  bottom: 8,
  right: 8,
  backgroundColor: 'rgba(0,0,0,0.6)',
  padding: 6,
  borderRadius: 20,
  zIndex: 10,
},
emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 40,
},
emptyText: {
  fontSize: 14,
  opacity: 0.7,
},

});

export default CategoryReelGrid;
