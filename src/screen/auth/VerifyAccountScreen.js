import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Alert,
  I18nManager,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, TextInput} from 'react-native-paper';

import * as authActions from '../../store/actions/auth';
import Colors from '../../constant/Colors';
import i18n from 'i18next';

const VerifyAccountScreen = () => {
  const dispatch = useDispatch();
  const {register} = useSelector(state => state.auth);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(120);
  const [verificationType, setVerificationType] = useState('EMAIL');

  useEffect(() => {
    (async () => {
      if (!register.emailVerified) {
        setOtp('');
        setVerificationType('EMAIL');
      } else if (!register.mobileVerified) {
        setOtp('');
        setVerificationType('MOBILE');
      }
    })();
  }, [register]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimer(prevState => {
        const time = prevState;
        if (time > 0) {
          return time - 1;
        } else {
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const _resendOTP = useCallback(async () => {
    setTimer(120);
    setError(null);
    try {
      // if (verificationType === 'EMAIL') {
      //   await dispatch(authActions.resendRegistrationEmailOtp(register.email));
      // } else {
      await dispatch(authActions.resendRegistrationMobileOtp(register.mobile));
      // }
    } catch (e) {
      setError(e.message);
    }
  }, [dispatch, register.mobile]);

  const _verifyHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // if (verificationType === 'EMAIL') {
      //     await dispatch(authActions.verifyUserEmail(register.email, otp));
      //   } else {
      await dispatch(authActions.verifyUserMobile(register.mobileNumber, otp));
      // }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [dispatch, otp, register.mobileNumber]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
        <View style={styles.container}>
          <View
            style={{
              marginTop: RFValue(50),
              alignItems: 'center',
            }}>
            <Text style={styles.heading}>
              {/*{verificationType === 'EMAIL' ? i18n.t('langChange:emailVerify') :*/}
              {i18n.t('langChange:mobVerify')}
            </Text>
            <Text style={styles.heading2}>
              {/* We have sent you a 6-digit Verification code
               */}
              {i18n.t('langChange:otpMsg')}
            </Text>
            <Text style={styles.heading3}>
              {/*{verificationType === 'EMAIL' ? register.email.toLowerCase() :*/}
              {register.mobile}
            </Text>
          </View>
          <View style={styles.OTPcontainer}>
            <TextInput
              left={<TextInput.Icon name="lock" color={Colors.primary} />}
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={i18n.t('langChange:otp')}
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
              keyboardType="number-pad"
            />
            <Text style={{marginTop: RFValue(10), fontWeight: 'bold'}}>
              {i18n.t('langChange:otpErrMsg')}{' '}
              {timer === 0 ? (
                <Text onPress={_resendOTP} style={{color: Colors.primary}}>
                  Resend OTP
                </Text>
              ) : (
                <Text style={{color: Colors.primary}}>
                  {i18n.t('langChange:otpResend')} {timer}
                </Text>
              )}
            </Text>
          </View>
          <Button
            mode="contained"
            style={styles.btn}
            contentStyle={{paddingVertical: RFValue(10)}}
            onPress={_verifyHandler}
            disabled={loading}
            loading={loading}>
            {i18n.t('langChange:verifyBtn')}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(50),
  },
  heading: {
    fontSize: RFValue(19),
    color: Colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: RFValue(25),
  },
  heading2: {
    fontSize: RFValue(14),
    color: Colors.grey,
    marginVertical: RFValue(8),
    textAlign: 'center',
  },
  heading3: {
    fontSize: RFValue(14),
    color: Colors.black,
    textAlign: 'center',
    marginBottom: RFValue(20),
  },
  btn: {
    width: '80%',
    alignSelf: 'center',
    marginTop: RFValue(30),
  },
  OTPcontainer: {
    // justifyContent: "center",
    // alignItems: "center",
    marginVertical: RFValue(25),
  },
  roundedTextInput: {
    borderWidth: RFValue(4),
  },
  timer: {
    color: Colors.grey,
    textAlign: 'center',
    fontSize: RFValue(15),
  },
  input: {
    backgroundColor: Colors.white,
  },
});

export default VerifyAccountScreen;
