// import { create } from 'zustand';

// // Define the types
// export type NotificationType = 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION' | 'MESSAGE';

// export interface Notification {
//   id: string;
//   recipientId: string;
//   sender?: {
//     id: string;
//     name: string;
//     profilePicture: string;
//   };
//   type: NotificationType;
//   message?: string;
//   referenceId?: string;
//   isRead: boolean;
//   createdAt: Date;
// }

// // Define the store interface
// interface NotificationStore {
//   notifications: Notification[];
//   addNotification: (notification: Notification) => void;
//   markAsRead: (id: string) => void;
//   markAllAsRead: () => void;
//   removeNotification: (id: string) => void;
//   clearNotifications: () => void;
// }

// // Create the Zustand store
// export const useNotificationStore = create<NotificationStore>((set) => ({
//   notifications: [],

//   addNotification: (notification) =>
//     set((state) => ({
//       notifications: [notification, ...state.notifications],
//     })),

//   markAsRead: (id) =>
//     set((state) => ({
//       notifications: state.notifications.map((n) =>
//         n.id === id ? { ...n, isRead: true } : n
//       ),
//     })),

//   markAllAsRead: () =>
//     set((state) => ({
//       notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
//     })),

//   removeNotification: (id) =>
//     set((state) => ({
//       notifications: state.notifications.filter((n) => n.id !== id),
//     })),

//   clearNotifications: () =>
//     set({ notifications: [] }),
// }));
