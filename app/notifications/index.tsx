import { useAppTheme } from "@/src/constants/themeHelper";
import React from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

type Notification = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: "liked" | "commented" | "followed" | "mentioned";
  time: string;
  isUnread: boolean;
};

const mockNotifications: Notification[] = [
{
        id: '1',
        user: {
            name: 'alis',
            avatar: 'https://lh3.googleusercontent.com/proxy/3QxvOoGFYnR17Oc_K1jOncMLiNQldN0egZWT-PM4yHqekZqRZaSegFY8aSFVwnfpBgfpRQg8GmXAOMQoIIS6q-bW4xtE8dfBGKYQGDIXkJO28ygUeBrAHw',
        },
        action: 'liked',
        time: '2h ago',
        isUnread: true,
    },
    {
        id: '2',
        user: {
            name: 'sara_ahmed',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
        },
        action: 'followed',
        time: '4h ago',
        isUnread: false,
    },
    {
        id: '3',
        user: {
            name: 'Ravi',
            avatar: 'https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=',
        },
        action: 'commented',
        time: '1d ago',
        isUnread: false,
    },
    {
        id: '4',
        user: {
            name: 'Dev',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
        },
        action: 'mentioned',
        time: '2d ago',
        isUnread: true,
    },
    {
        id: '5',
        user: {
            name: 'manoz',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
        },
        action: 'followed',
        time: '4h ago',
        isUnread: false,
    },
    {
        id: '6',
        user: {
            name: 'alfiya',
            avatar: 'https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=',
        },
        action: 'commented',
        time: '1d ago',
        isUnread: false,
    },
    {
        id: '7',
        user: {
            name: 'alis',
            avatar: 'https://lh3.googleusercontent.com/proxy/3QxvOoGFYnR17Oc_K1jOncMLiNQldN0egZWT-PM4yHqekZqRZaSegFY8aSFVwnfpBgfpRQg8GmXAOMQoIIS6q-bW4xtE8dfBGKYQGDIXkJO28ygUeBrAHw',
        },
        action: 'liked',
        time: '2h ago',
        isUnread: true,
    },
    {
        id: '8',
        user: {
            name: 'manoz',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
        },
        action: 'followed',
        time: '4h ago',
        isUnread: false,
    },
    {
        id: '9',
        user: {
            name: 'alfiya',
            avatar: 'https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=',
        },
        action: 'commented',
        time: '1d ago',
        isUnread: false,
    },
    {
        id: '10',
        user: {
            name: 'alis',
            avatar: 'https://lh3.googleusercontent.com/proxy/3QxvOoGFYnR17Oc_K1jOncMLiNQldN0egZWT-PM4yHqekZqRZaSegFY8aSFVwnfpBgfpRQg8GmXAOMQoIIS6q-bW4xtE8dfBGKYQGDIXkJO28ygUeBrAHw',
        },
        action: 'liked',
        time: '2h ago',
        isUnread: true,
    },
];

const NotificationItem: React.FC<{ item: Notification; theme: any; width: number }> = ({
  item,
  theme,
  width,
}) => {
  const getActionText = () => {
    switch (item.action) {
      case "liked":
        return "liked your post";
      case "commented":
        return "commented on your post";
      case "followed":
        return "started following you";
      case "mentioned":
        return "mentioned you in a comment";
      default:
        return "";
    }
  };

  const avatarSize = width * 0.13; 
  const fontSize = width * 0.04;  

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: theme.inputBorder,
          paddingVertical: width * 0.03,
          paddingHorizontal: width * 0.04,
        },
      ]}
    >
      <Image
        source={{ uri: item.user.avatar }}
        style={[
          styles.avatar,
          { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
        ]}
      />
      <View style={styles.content}>
        <Text style={[ { color: theme.text, fontSize }]}>
          <Text style={[styles.bold, { fontSize }]}>{item.user.name}</Text> {getActionText()}
        </Text>
        <Text style={[styles.time, { color: theme.subtitle, fontSize: fontSize * 0.8 }]}>
          {item.time}
        </Text>
      </View>
    </View>
  );
};

const NotificationList = () => {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView
      style={[styles.mainContainer, { backgroundColor: theme.background }]}
    >
      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem item={item} theme={theme} width={width} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    alignItems: "center",
  },
  avatar: {
    marginRight: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
//   text: {
//     // fontSize dynamic
//   },
  bold: {
    fontWeight: "bold",
  },
  time: {
    marginTop: 4,
  },
});

export default NotificationList;
