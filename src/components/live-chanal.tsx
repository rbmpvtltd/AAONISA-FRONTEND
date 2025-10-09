import { useAppTheme } from '@/src/constants/themeHelper';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';

type AppItem = {
  id: string;
  name: string;
  icon: any;
};

const apps: AppItem[] = [
  { id: '1', name: 'RBM',         icon: require("../assets/darkThemeUser.jpg") },
  { id: '2', name: 'Just Search', icon: require("../assets/darkThemeUser.jpg") },
  { id: '3', name: 'App Three',   icon: require("../assets/darkThemeUser.jpg") },
  { id: '4', name: 'App Four',    icon: require("../assets/darkThemeUser.jpg") },
  { id: '5', name: 'App Five',    icon: require("../assets/darkThemeUser.jpg") },
];

export default function HomeScreen() {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();

  const numColumns = 3;
  const itemSpacing = 20;
  const availableWidth = width - itemSpacing * (numColumns + 1);
  const iconSize = availableWidth / numColumns;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={apps}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.grid,
          { paddingHorizontal: itemSpacing / 2 },
        ]}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.appItem, { margin: itemSpacing / 2 }]}>
            <Image
              source={theme.userImage}
              style={[styles.iconImage, { width: iconSize, height: iconSize }]}
              resizeMode="contain"
            />
            <Text style={[styles.appLabel, { color: theme.text }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  appItem: {
    alignItems: 'center',
  },
  iconImage: {
    marginBottom: 6,
    borderRadius: 50,
  },
  appLabel: {
    fontSize: 16,
    textAlign: 'center',
  },
});
