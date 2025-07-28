// FCMInitializer.tsx
// import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import messaging from '@react-native-firebase/messaging';
// import {
//   GET_FCM_TOKEN,
//   handleForegroundNotifications,
//   listenToForegroundFCM,
//   requestNotificationPermission,
// } from 'pushNotification/notification.notifee';

// const FCMInitializer: React.FC = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // 1. Request permission
//     requestNotificationPermission();

//     // 2. Get token directly
//     messaging()
//       .getToken()
//       .then(token => {
//         console.log('FCM Token (direct):', token);
//       });

//     // 3. Setup foreground listeners
//     const unsubscribeForegroundFCM = listenToForegroundFCM(dispatch);
//     const unsubscribeForegroundEvent = handleForegroundNotifications();

//     return () => {
//       unsubscribeForegroundFCM();
//       unsubscribeForegroundEvent();
//     };
//   }, [dispatch]);

//   return null;
// };

// export default FCMInitializer;
