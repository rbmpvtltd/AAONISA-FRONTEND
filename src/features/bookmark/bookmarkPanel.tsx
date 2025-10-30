import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

interface Category {
  id: string;
  name: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddCategory: (name: string) => void;
  onSelectCategory: (categoryId: string) => void;
  categories: Category[];
}

const BookmarkPanel: React.FC<Props> = ({
  visible,
  onClose,
  onAddCategory,
  onSelectCategory,
  categories,
}) => {
  const [newCategory, setNewCategory] = useState('');

  return (
    <>
    {/* <Stack.Screen name="save"/> */}
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
      <View style={styles.sheet}>
        <Text style={styles.title}>Save to Category</Text>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => onSelectCategory(item.id)}
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
            onPress={() => {
              if (newCategory.trim().length > 0) {
                onAddCategory(newCategory.trim());
                setNewCategory('');
              }
            }}
            style={styles.addButton}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
</>
  );
};

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
    backgroundColor: '#007bff', // BLUE background
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

export default BookmarkPanel;
