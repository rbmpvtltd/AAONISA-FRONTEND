// import React, { useEffect } from "react";
// import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";

// interface Reel {
//   uuid: string;
//   thumbnail?: string;
//   videoUrl: string;
// }

// interface Props {
//   reels: Reel[];
//   onSelectReel: (id: string) => void;
// }

// const CategoryReelGrid: React.FC<Props> = ({ reels, onSelectReel }) => {

//   useEffect(() => {
//     console.log("✅ CategoryReelGrid mounted");
//     console.log("📦 Reels received:", reels);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={reels}
//         numColumns={3}
//         keyExtractor={(item) => item.uuid}
//         ListEmptyComponent={() => (
//           <View style={styles.emptyBox}>
//             <ActivityIndicator />
//           </View>
//         )}
//         renderItem={({ item }) => {
//           console.log("🎞️ Rendering reel:", item);

//           const uri =
//             item.thumbnail && item.thumbnail.trim() !== ""
//               ? item.thumbnail
//               : null; // No thumbnail, we show placeholder box

//           return (
//             <TouchableOpacity onPress={() => onSelectReel(item.uuid)}>
//               {uri ? (
//                 <Image source={{ uri }} style={styles.thumb} />
//               ) : (
//                 <View style={styles.placeholderBox}>
//                   <ActivityIndicator />
//                 </View>
//               )}
//             </TouchableOpacity>
//           );
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },

//   thumb: {
//     width: 120,
//     height: 200,
//     margin: 5,
//     borderRadius: 8,
//   },

//   placeholderBox: {
//     width: 120,
//     height: 200,
//     margin: 5,
//     borderRadius: 8,
//     backgroundColor: "#ccc",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   emptyBox: {
//     padding: 30,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default CategoryReelGrid;
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

  useEffect(() => {
    console.log("✅ CategoryReelGrid mounted");
    console.log("📦 Reels received:", reels);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
        numColumns={3}
        keyExtractor={(item) => item.uuid}
        ListEmptyComponent={() => (
          <View style={{ padding: 30, alignItems: 'center' }}>
            <View style={{ width: 50, height: 50, backgroundColor: '#ccc', borderRadius: 8 }} />
          </View>
        )}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => router.push(`/bookmark/reelscard?reelId=${item.uuid}`)
}
              style={styles.touchBox}
              activeOpacity={0.7}
            >
              <Video
                source={{ uri: item.videoUrl }}
                style={styles.thumb}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}   // No auto play
                isMuted               // no sound
                usePoster             // ensures first frame visible
                posterSource={item.thumbnail ? { uri: item.thumbnail } : undefined}
                onError={() => console.log("❌ video thumbnail load error")}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  touchBox: { margin: 5 },
  thumb: {
    width: 120,
    height: 200,
    borderRadius: 8,
    backgroundColor: "#000",
  },
});

export default CategoryReelGrid;
