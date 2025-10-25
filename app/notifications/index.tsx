// import { useAppTheme } from "@/src/constants/themeHelper";
// import React from "react";
// import {
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   useWindowDimensions,
// } from "react-native";
// import { Notification as NotificationType, useNotificationStore } from "../../src/store/useNotificationStore";

// const DEFAULT_AVATAR = "https://via.placeholder.com/150";

// const NotificationItem: React.FC<{ item: NotificationType; theme: any; width: number }> = ({
//   item,
//   theme,
//   width,
// }) => {
//   const getActionText = () => {
//     switch (item.type) {
//       case "LIKE":
//         return "liked your post";
//       case "COMMENT":
//         return "commented on your post";
//       case "FOLLOW":
//         return "started following you";
//       case "MENTION":
//         return "mentioned you";
//       case "MESSAGE":
//         return "sent you a message";
//       default:
//         return "interacted with you";
//     }
//   };

//   const avatarSize = width * 0.13;
//   const fontSize = width * 0.04;

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           borderBottomColor: theme.inputBorder,
//           paddingVertical: width * 0.03,
//           paddingHorizontal: width * 0.04,
//           backgroundColor: !item.isRead ? theme.primaryOpacity : theme.background,
//         },
//       ]}
//     >
//       <Image
//         source={{ uri: item.sender?.profilePicture || DEFAULT_AVATAR }}
//         style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
//         defaultSource={{ uri: DEFAULT_AVATAR }}
//       />

//       <View style={styles.content}>
//         <Text style={{ color: theme.text, fontSize }}>
//           <Text style={[styles.bold, { fontSize }]}>{item.sender?.name || "Unknown User"}</Text>{" "}
//           {getActionText()}
//         </Text>
//         <Text style={[styles.time, { color: theme.subtitle, fontSize: fontSize * 0.8 }]}>
//           {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : "Just now"}
//         </Text>
//       </View>
//     </View>
//   );
// };


// const NotificationList = () => {
//   const theme = useAppTheme();
//   const { width } = useWindowDimensions();
//   const notifications = useNotificationStore((state) => state.notifications);

//   return (
//     <SafeAreaView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
//       <FlatList
//         data={notifications}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <NotificationItem item={item} theme={theme} width={width} />}
//         ListEmptyComponent={
//           <View style={{ padding: 20 }}>
//             <Text style={{ color: theme.subtitle, textAlign: "center" }}>
//               No notifications yet.
//             </Text>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: { flex: 1 },
//   container: { flexDirection: "row", borderBottomWidth: 1, alignItems: "center" },
//   avatar: { marginRight: 10, backgroundColor: "#ccc" },
//   content: { flex: 1, justifyContent: "center" },
//   bold: { fontWeight: "bold" },
//   time: { marginTop: 4 },
// });

// export default NotificationList;

//========================================================

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Button, Platform, Text, View } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});



async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}


function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =  Constants?.expoConfig?.extra?.eas?.projectId ??Constants?.easConfig?.projectId;
    // const projectId =  Constants?.expoConfig?.extra?.eas?.projectId ??Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

export default function NotificationList() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}
