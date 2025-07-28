import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {useFocusEffect} from '@react-navigation/native';
// import {GET_USER_NOTIFICATIONS} from '@redux/reducers/authReducers/auth.thunks';
// import {setNotificationStatus} from '@redux/reducers/userReducers/user.slice';
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import { showError, showSuccess } from 'utils/alerts';

export const GET_FCM_TOKEN = async () => {
  const fcmToken = await messaging().getToken();
  console.log('FCM SAVED TOKEN::>', fcmToken);
  return fcmToken;
};

export const requestNotificationPermission = async () => {
  const settings = await notifee.requestPermission();
  if (settings.authorizationStatus === notifee.AuthorizationStatus.DENIED) {
    showSuccess('Success', 'Notification permission granted');
  } else {
    showError('Error', 'Notification permission denied');
  }
};

export const displayNotification = async (title, body) => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
    },
  });
};

/**
 * Handle Foreground Notifications
 */
export const handleForegroundNotifications = () => {
  return notifee.onForegroundEvent(({type, detail}) => {
    switch (type) {
      case EventType.PRESS:
        // console.log('User tapped on foreground notification:', detail.notification);
        break;
      case EventType.DISMISSED:
        // console.log('User dismissed the notification:', detail.notification);
        break;
    }
  });
};

/**
 * Handle Background Notification Clicks
 */
export const handleBackgroundNotifications = () => {
  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      // console.log('User tapped notification in background:', detail.notification);
    }
  });
};

/**
 * Listen to Firebase Foreground Notifications
 */
export const listenToForegroundFCM = dispatch => {
  return messaging().onMessage(async remoteMessage => {
    console.log('Received FCM Message in foreground:', remoteMessage);

    // dispatch(setNotificationStatus(true));

    await displayNotification(
      remoteMessage.notification?.title || 'New Notification',
      remoteMessage.notification?.body || 'You have a new message!',
    );
  });
};

/**
 * Set Firebase Background Notification Handler
 */
export const setupBackgroundFCMHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    // console.log('Received FCM Message in background:', remoteMessage);
  });
};
