import React from 'react';
import i18n from 'i18next';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screen/auth/LoginScreen';
import RegisterScreen from '../screen/auth/RegisterScreen';
import OTPScreen from '../screen/auth/OTPScreen';
import ForgotPassword from '../screen/auth/ForgotPassword';
import ResetPassword from '../screen/auth/ResetPassword';
import VerifyAccountScreen from '../screen/auth/VerifyAccountScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
        options={{title: null, headerBackTitle: null}}
      />
      <Stack.Screen
        name="forgot"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="reset"
        component={ResetPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VerifyAccount"
        component={VerifyAccountScreen}
        options={{
          title: i18n.t('langChange:accVerify'),
          headerLeft: null,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
