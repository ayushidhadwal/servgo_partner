import * as React from 'react';
import {View, I18nManager, StyleSheet} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import i18n from 'i18next';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch} from 'react-redux';
import {useCallback, useState} from 'react';

import {useError} from '../../hooks/useError';
import Colors from '../../constant/Colors';
import {successMessage} from '../../utils/success-message';
import ResendOtp from '../../components/ResendOtp';
import {sendOTPEmail, verifyOTPEmailUpdate} from '../../store/actions/user';

const UpdateEmailScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [OTP, setOTP] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disableEmail, SetDisableEmail] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();

  const onClickHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(verifyOTPEmailUpdate(email, OTP));
      setLoading(false);
      successMessage('Update Email', 'Email Updated successfully');
      navigation.goBack();
    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
  };

  const sendOTP = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(sendOTPEmail(email));
      setShow(true);
      SetDisableEmail(true);
      successMessage('Success', 'OTP sent successfully');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch, email, setError]);

  return (
    <View style={styles.screen}>
      <TextInput
        disabled={disableEmail}
        left={<TextInput.Icon name="email" color={Colors.primary} />}
        mode={I18nManager.isRTL ? 'outlined' : 'flat'}
        label={i18n.t('langChange:email')}
        style={styles.input1}
        value={email}
        onChangeText={text => setEmail(text)}
      />
      {show && (
        <>
          <TextInput
            left={
              <TextInput.Icon
                name="message-processing-outline"
                color={Colors.primary}
              />
            }
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={i18n.t('langChange:otp')}
            style={styles.input1}
            value={OTP}
            keyboardType={'numeric'}
            maxLength={6}
            onChangeText={text => setOTP(text)}
          />
          <ResendOtp onSubmit={sendOTP} style={{textAlign: 'center'}} />
        </>
      )}
      <Button
        mode="contained"
        style={styles.btnStyles}
        onPress={() => {
          show ? onClickHandler() : sendOTP();
        }}
        loading={loading}
        disabled={loading}>
        {i18n.t('langChange:updBtn')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.white,
  },
  input1: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  btnStyles: {
    width: '60%',
    marginVertical: RFValue(30),
    alignSelf: 'center',
  },
});

export default UpdateEmailScreen;
