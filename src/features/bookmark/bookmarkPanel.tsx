// import React, { useState } from 'react';
// import {
//   FlatList,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import Modal from 'react-native-modal';
// import { useBookmarkStore } from '../../store/useBookmarkStore';
// import { addBookmark, addReelToBookmark } from './api';
// const BookmarkPanel = () => {
//   const {
//     panelVisible,
//     closePanel,
//     categories,
//     addCategory,
//     saveToCategory,
//     selectedReel,
//   } = useBookmarkStore();
//   const [newCategory, setNewCategory] = useState('');

//   return (
//     <Modal
//       isVisible={panelVisible}
//       onBackdropPress={closePanel}
//       style={{ justifyContent: 'flex-end', margin: 0 }}
//     >
//       <View style={styles.sheet}>
//         <Text style={styles.title}>Save to Category</Text>

//         <FlatList
//           data={categories}
//           keyExtractor={(item) => item.id}
//           numColumns={3}
//           contentContainerStyle={{ paddingBottom: 20 }}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.categoryCard}
//               onPress={() => {saveToCategory(item.id)
//                 if (selectedReel) {
//                   addReelToBookmark({
//                     reelId: selectedReel.id,
//                     categoryId: item.id,
//                   });
//                 }
//               }}
//               activeOpacity={0.8}
//             >
//               <Text
//                 style={styles.categoryText}
//                 numberOfLines={2}
//                 adjustsFontSizeToFit
//               >
//                 {item.name}
//               </Text>
//             </TouchableOpacity>
//           )}
//         />

//         {/* ADD NEW CATEGORY */}
//         <View style={styles.addSection}>
//           <TextInput
//             placeholder="New category name"
//             value={newCategory}
//             onChangeText={setNewCategory}
//             style={styles.input}
//           />

//           <TouchableOpacity
//             onPress={() => {
//               if (newCategory.trim().length > 0) {
//                 addCategory(newCategory.trim());
//                 setNewCategory('');
//               }
//               addBookmark({name: newCategory.trim()});
//             }}
//             style={styles.addButton}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.addButtonText}>Add</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import { useBookmarkStore } from '../../store/useBookmarkStore';
import { addBookmark, addReelToBookmark } from './api';

const BookmarkPanel = () => {
  const {
    panelVisible,
    closePanel,
    categories,
    addCategory,
    saveToCategory,
    selectedReel,
  } = useBookmarkStore();

  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) return Alert.alert("Error", "Category name can't be empty");
    
    try {
      setLoading(true);
      const res = await addBookmark({ name });
      // backend return se actual category ID lo
      addCategory( name ); 
      setNewCategory('');
    } catch (e) {
      Alert.alert("Error", "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = async (categoryId:any) => {
    if (!selectedReel) return;

    saveToCategory(categoryId); // local store update first for fast UI

    try {
      await addReelToBookmark({
        reelId: selectedReel.uuid,
        categoryId,
      });
    } catch (e) {
      Alert.alert("Error", "Failed to save reel");
    }

    closePanel();
  };

  return (
    <Modal
      isVisible={panelVisible}
      onBackdropPress={closePanel}
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
      <View style={styles.sheet}>
        <Text style={styles.title}>Save to Category</Text>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => handleSelectCategory(item.id)}
              activeOpacity={0.8}
            >
              <Text
                style={styles.categoryText}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.addSection}>
          <TextInput
            placeholder="New category name"
            value={newCategory}
            onChangeText={setNewCategory}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={handleAddCategory}
            style={styles.addButton}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>
              {loading ? "..." : "Add"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BookmarkPanel;

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '75%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoryCard: {
    flex: 1 / 3,
    backgroundColor: '#007bff',
    margin: 6,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    flexShrink: 1,
  },
  addSection: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

