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
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from "expo-router";
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

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
          <View style={{ padding: 30, alignItems: 'center' }}>
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: theme.subtitle, // 👈 theme color
                borderRadius: 8,
              }}
            />
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
              <Video
                source={{ uri: item.videoUrl }}
                style={[styles.thumb, { backgroundColor: theme.subtitle }]} // 👈 theme apply
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isMuted
                usePoster
                posterSource={item.thumbnail ? { uri: item.thumbnail } : undefined}
                onError={() => console.log("video thumbnail load error")}
              />
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
});

export default CategoryReelGrid;
