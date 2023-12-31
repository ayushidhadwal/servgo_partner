import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import {AppState, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback, useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';

export const NOTIFICATION_CHANNEL = 'serv-go-partner';
export const NOTIFICATION_TOKEN = 'notification:partner_token';

export const getPermissions = async () => {
  await notifee.requestPermission();

  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: NOTIFICATION_CHANNEL,
      name: NOTIFICATION_CHANNEL,
      sound: 'default',
      vibration: true,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });
  } else {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }

  return true;
};

export const registerNotification = async () => {
  try {
    const enabled = await getPermissions();
    if (enabled) {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log({[Platform.OS]: fcmToken});
        await AsyncStorage.setItem(NOTIFICATION_TOKEN, fcmToken);
      }
    }
  } catch (e) {
    console.log(e.message);
  }
};

export const getNotificationToken = async () =>
  AsyncStorage.getItem(NOTIFICATION_TOKEN);

export async function onMessageReceived(remoteMessage) {
  const {data} = remoteMessage;

  try {
    await notifee.displayNotification({
      title: data.title,
      body: data.body,
      data: data?.extra ? JSON.parse(data?.extra) : {},
      android: {
        channelId: NOTIFICATION_CHANNEL,
        visibility: AndroidVisibility.PUBLIC,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  } catch (e) {
    console.log(e.message);
  }
}

export const useNotificationNavigation = () => {
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();

  const autoNavigate = useCallback(() => {
    notifee
      .getInitialNotification()
      .then(initialNotification => {
        if (initialNotification) {
          const {data} = initialNotification?.notification;
          if (data?.screen) {
            navigation.navigate(data?.screen, data?.params);
          }
        }
      })
      .catch(e => {
        console.log(e.message);
      });
  }, [navigation]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        autoNavigate();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [autoNavigate]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      autoNavigate();
    }
  }, [autoNavigate]);

  // For ios onPress handler
  useEffect(() => {
    if (Platform.OS === 'ios') {
      return notifee.onForegroundEvent(({type, detail}) => {
        switch (type) {
          case EventType.PRESS:
            if (detail?.notification) {
              const {data} = detail?.notification;
              if (data?.screen) {
                navigation.navigate(data?.screen, data?.params);
              }
            }
            break;
        }
      });
    }
  }, [navigation]);

  return [];
};
