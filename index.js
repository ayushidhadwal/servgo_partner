import React from 'react';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import App from './App';
import {name as appName} from './app.json';
import * as authActions from './src/store/actions/auth';
import {store} from './src/store';
import {onMessageReceived} from './src/lib/notifee';

const originalFetch = global.fetch;

const authRoutes = ['partner/send-otp'];

global.fetch = async (input, init) => {
  if (!init) {
    init = {};
  }
  if (!init.headers) {
    init.headers = new Headers();
  }

  const {
    auth: {tokenType, accessToken},
  } = store.getState().auth;

  if (tokenType && accessToken) {
    if (
      init.headers instanceof Headers &&
      authRoutes.find(route => !route.includes(input))
    ) {
      init.headers.append('Authorization', `${tokenType} ${accessToken}`);
    }
  }

  // console.log(input);

  const response = await originalFetch(input, init);

  if (!response.ok) {
    if (response.status === 401) {
      await store.dispatch(authActions.logout());
      throw new Error('Your session has expired!');
    }

    throw new Error(`Server Error: ${response.status} Internal Server Error!`);
  }

  return response;
};

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async () => {});
notifee.onForegroundEvent(async () => {});

const HeadlessCheck = ({isHeadless}) => {
  if (isHeadless) {
    return null;
  }

  return <App />;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
