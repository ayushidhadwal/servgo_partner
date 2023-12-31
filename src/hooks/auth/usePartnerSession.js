import SplashScreen from 'react-native-splash-screen';
import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import {I18nManager} from 'react-native';

import {auth, setUserIp, SESSION_ID} from '../../store/actions/auth';
import {LANG_TOKEN, setAppLanguage} from '../../store/actions/lang';
import {registerNotification} from '../../lib/notifee';

export const usePartnerSession = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  const dispatch = useDispatch();

  const restoreSession = useCallback(async () => {
    try {
      const session = await AsyncStorage.getItem(SESSION_ID);

      if (session) {
        const {userId, accessToken, tokenType} = JSON.parse(session);
        dispatch(auth({userId, accessToken, tokenType}));
      }

      const language = await AsyncStorage.getItem(LANG_TOKEN);

      if (language) {
        dispatch(setAppLanguage(language));

        await i18n.changeLanguage(language);
        await AsyncStorage.setItem(LANG_TOKEN, language);
        I18nManager.forceRTL(language === 'ar');
      }
    } catch (e) {
      // Ignore session errors
    }
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        await Promise.all([dispatch(setUserIp()), restoreSession()]);
        setIsAvailable(true);
      } catch (e) {
        setIsAvailable(false);
      } finally {
        setIsLoading(false);
        SplashScreen.hide();
        registerNotification(); // Register notification after splashscreen;
      }
    })();
  }, [dispatch, restoreSession]);

  return {isLoading, isAvailable};
};
