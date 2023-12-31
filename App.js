import React from 'react';
import {StatusBar} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import FlashMessage from 'react-native-flash-message';
import {StripeProvider} from '@stripe/stripe-react-native';

import './src/i18n';
import Colors from './src/constant/Colors';
import {BASE_URL} from './src/constant/base_url';
import AppNavigator from './src/navigation/AppNavigator';
import {store} from './src/store';
import {PACKAGE_NAME, PUBLISHING_KEY} from './src/constant/common';

axios.defaults.baseURL = BASE_URL;

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    accent: Colors.white,
    text: Colors.black,
    underlineColor: 'green',
  },
};

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={Colors.primary}
          />
          <StripeProvider
            publishableKey={PUBLISHING_KEY}
            merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}"
            urlScheme={PACKAGE_NAME}>
            <AppNavigator />
          </StripeProvider>

          <Toast position="bottom" />
          <FlashMessage position="bottom" icon="auto" />
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
