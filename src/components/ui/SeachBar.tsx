// // @/src/components/SearchBar.tsx
// import { useAppTheme } from '@/src/constants/themeHelper';
// import { Ionicons } from '@expo/vector-icons';
// import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
// import { TextInput } from 'react-native-gesture-handler';

// interface SearchBarProps {
//   value: string;
//   onChangeText: (text: string) => void;
//   placeholder?: string;
//   containerStyle?: any;
// }

// export const SearchBar = ({ 
//   value, 
//   onChangeText, 
//   placeholder = "Search...",
//   containerStyle 
// }: SearchBarProps) => {
//   const theme = useAppTheme();
//   const { width } = useWindowDimensions();
//   const searchFontSize = width > 400 ? 16 : 14;

//   return (
//     <View style={[styles.searchContainer, containerStyle]}>
//       <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
//         <Ionicons name="search" size={20} color={theme.subtitle} style={styles.searchIcon} />
//         <TextInput
//           placeholder={placeholder}
//           placeholderTextColor={theme.placeholder}
//           value={value}
//           onChangeText={(text) => onChangeText(text.toLowerCase().replace(/\s+/g, '').trim())}
//           style={[
//             styles.searchInput,
//             { color: theme.text, fontSize: searchFontSize }
//           ]}
//         />
//         {value.length > 0 && (
//           <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
//             <Ionicons name="close-circle" size={20} color={theme.subtitle} />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   searchContainer: {
//     marginTop: 8,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 10,
//     borderWidth: 1,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 0,
//   },
//   clearButton: {
//     padding: 4,
//   },
// });

// // @/src/components/SearchBar.tsx
import { useAppTheme } from '@/src/constants/themeHelper';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: any;
}

export const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = "Search...",
  containerStyle 
}: SearchBarProps) => {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const searchFontSize = width > 400 ? 16 : 14;

  const handleTextChange = (text: string) => {
    const processedText = text.toLowerCase().replace(/\s+/g, '').trim();
    onChangeText(processedText);
  };

  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
        <Ionicons name="search" size={20} color={theme.subtitle} style={styles.searchIcon} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          value={value}
          onChangeText={handleTextChange}
          style={[
            styles.searchInput,
            { color: theme.text, fontSize: searchFontSize }
          ]}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={theme.subtitle} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
});