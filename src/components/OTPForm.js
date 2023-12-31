import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import Colors from '../constant/Colors';
import * as authActions from '../store/actions/auth';
import {useError} from '../hooks/useError';
import {successMessage} from '../utils/success-message';

const LIMIT = 120;

const OTPForm = props => {
  const {email, otp} = useSelector(state => state.auth);

  const [userOTP, setUserOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOTPLoading] = useState(false);
  const [timer, setTimer] = useState(LIMIT);

  const setError = useError();
  const dispatch = useDispatch();

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

  const otpsendAgain = useCallback(async () => {
    setOTPLoading(true);
    setError(null);
    try {
      await dispatch(authActions.forgotPassword({email}));
      setTimer(LIMIT);
      successMessage('Verification', 'OTP sent successfully.');
      props.navigation.navigate('OTP');
    } catch (e) {
      setError(e.message);
      setOTPLoading(false);
    }
    setOTPLoading(false);
  }, [dispatch, email, props.navigation, setError]);

  const onNexthandler = useCallback(async () => {
    if (Number(otp) !== Number(userOTP)) {
      setError('Wrong OTP');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await dispatch(authActions.verifyOtp({email, userOTP}));
      props.navigation.navigate('reset');
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [dispatch, email, otp, props.navigation, setError, userOTP]);

  return (
    <View style={styles.screen}>
      <View style={styles.form}>
        <Text style={styles.heading}>Enter Verification Code</Text>
        <Text style={styles.heading2}>
          We have sent you a 6-digit Verification code on
        </Text>
        <Text style={styles.heading3}>{email}</Text>
      </View>
      <View style={styles.OTPcontainer}>
        <TextInput
          left={<TextInput.Icon name="lock" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label="Enter OTP"
          style={styles.input}
          value={userOTP}
          onChangeText={text => setUserOTP(text)}
          maxLength={6}
          keyboardType="number-pad"
        />
        <Text style={{marginTop: RFValue(10), fontWeight: 'bold'}}>
          Didn't receive OTP?{' '}
          {timer > 0 ? (
            <Text style={{color: Colors.primary}}>Resend in {timer}</Text>
          ) : otpLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text onPress={otpsendAgain} style={{color: Colors.primary}}>
              Send Again
            </Text>
          )}
        </Text>
      </View>
      <Button
        mode="contained"
        style={styles.btn}
        labelStyle={{paddingVertical: RFValue(2)}}
        contentStyle={{height: 50}}
        onPress={onNexthandler}
        disabled={loading}
        loading={loading}>
        Next
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
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
  form: {
    marginTop: RFValue(50),
    alignItems: 'center',
  },
  input: {
    backgroundColor: Colors.white,
  },
});

export default OTPForm;
