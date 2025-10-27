import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
  onPress: () => void;
  isBookmarked?: boolean;
}

const BookmarkButton: React.FC<Props> = ({ onPress, isBookmarked }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon
        name={isBookmarked ? 'bookmark' : 'bookmark'}
        size={24}
        color={isBookmarked ? '#ff9900' : '#555'}
      />
    </TouchableOpacity>
  );
};

export default BookmarkButton;
