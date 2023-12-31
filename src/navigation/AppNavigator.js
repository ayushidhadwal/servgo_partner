import React from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';

import RootStack from './RootStack';
import AuthNavigator from './AuthNavigator';
import {usePartnerSession} from '../hooks/auth/usePartnerSession';
import {NotAvailable} from '../components/dashboard/NotAvailable';

const AppNavigator = () => {
  const {isAvailable, isLoading} = usePartnerSession();

  const {auth, settings} = useSelector(state => state.auth);
  const isLoggedIn = auth.userId && auth.accessToken && auth.tokenType;

  console.log(auth.userId, JSON.stringify(settings, null, 2));

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <>
        <NotAvailable isNoAvailable={!isAvailable} />
        {isLoggedIn ? <RootStack /> : <AuthNavigator />}
      </>
    </NavigationContainer>
  );
};

export default AppNavigator;
