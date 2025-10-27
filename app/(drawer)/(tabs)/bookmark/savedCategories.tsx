import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Reel {
  id: string;
  thumbnail: string;
}

interface Category {
  id: string;
  name: string;
  reels: Reel[];
}

interface Props {
  categories: Category[];
  onSelect: (category: Category) => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
}

const SavedCategories: React.FC<Props> = ({
  categories,
  onSelect,
  onDelete,
  onRename,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const handleRename = (category: Category) => {
    setEditingId(category.id);
    setNewName(category.name);
  };

  const handleSaveRename = () => {
    if (newName.trim().length === 0) {
      Alert.alert('Invalid name', 'Please enter a valid category name.');
      return;
    }
    if (onRename && editingId) {
      onRename(editingId, newName.trim());
    }
    setEditingId(null);
    setNewName('');
  };

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.categoryBar}
          onPress={() => onSelect(item)}
          activeOpacity={0.8}
        >
          {editingId === item.id ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter new name"
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveRename}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setEditingId(null)}
              >
                <Text style={[styles.btnText, { color: '#000' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.row}>
              <View style={styles.textSection}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.subText}>{item.reels.length} reels saved</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#0056b3' }]}
                  onPress={() => handleRename(item)}
                >
                  <Text style={styles.btnText}>Rename</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#ff4d4f' }]}
                  onPress={() =>
                    onDelete &&
                    Alert.alert(
                      'Delete Category',
                      `Are you sure you want to delete "${item.name}"?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => onDelete(item.id),
                        },
                      ]
                    )
                  }
                >
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
  categoryBar: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    marginVertical: 6,
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textSection: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subText: {
    color: '#e0e0e0',
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 36,
  },
  saveBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});

export default SavedCategories;
