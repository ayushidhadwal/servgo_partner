import React from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { Button, Colors, TextInput } from 'react-native-paper';
import i18n from 'i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState, useEffect } from 'react';

import { useError } from '../../hooks/useError';
import * as authActions from '../../store/actions/auth';
import { successMessage } from '../../utils/success-message';
import Loader from '../../components/Loader';
import { sendOTPMobile, verifyOTPMobileUpdate } from '../../store/actions/user';
import { SearchableDropdown } from '../../components/SearchableDropdown';
import ResendOtp from '../../components/ResendOtp';
import * as userActions from "../../store/actions/user";

const UpdateMobileScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');

  const [OTP, setOTP] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [disableNumber, setDisableNumber] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();

  const { countries } = useSelector(state => state.auth);
  const { partner } = useSelector(state => state.user);

  console.log(partner);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.set_Profile());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  useEffect(() => {
    setPhoneCode(partner.phone_code)
  },[partner.phone_code])

  const [phoneCode, setPhoneCode] = useState('');

  console.log(partner);

  const setCountries = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await dispatch(authActions.setCountries());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch, setError]);

  useEffect(() => {
    setCountries();
  }, [setCountries]);

  const onClickHandler = async () => {
    setBtnLoading(true);
    setError(null);
    try {
      await dispatch(
        verifyOTPMobileUpdate({
          mobile: mobile,
          code: OTP,
          phoneCode: phoneCode,
        }),
      );
      setnLoading(false);
      
      
      successMessage('Success', 'Mobile Number updated successfully');
      
      navigation.goBack();
    } catch (e) {
      setBtnLoading(false);
      setError(e.message);
    }
  };

  const sendOTP = useCallback(async () => {
    setBtnLoading(true);
    setError(null);
    try {
      await dispatch(sendOTPMobile(mobile, phoneCode));
      setShow(true);
      setDisableNumber(true);
      successMessage('Success', 'OTP sent successfully');
    } catch (e) {
      setError(e.message);
    } finally {
      setBtnLoading(false);
    }
  }, [dispatch, mobile, phoneCode, setError]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: 6,
        }}>
        <View width={'35%'}>
          <SearchableDropdown
            label={'Code'}
            data={countries.map(m => ({
              name: m.phonecode,
              key: m.phonecode,
              value: m.phonecode,
            }))}
            selectedValue={phoneCode}
            onSelectValue={setPhoneCode}
            isDisabled={disableNumber}
          />
        </View>

        <TextInput
          disabled={disableNumber}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={i18n.t('langChange:mob')}
          style={styles.input1}
          value={mobile}
          onChangeText={text => setMobile(text)}
          keyboardType={'numeric'}
        />
      </View>

      {show && (
        <>
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={i18n.t('langChange:otp')}
            style={styles.input2}
            value={OTP}
            keyboardType={'numeric'}
            maxLength={6}
            onChangeText={text => setOTP(text)}
          />
          <ResendOtp onSubmit={sendOTP} style={{ textAlign: 'center' }} />
        </>
      )}
      <Button
        mode="contained"
        style={styles.btnStyles}
        onPress={() => {
          show ? onClickHandler() : sendOTP();
        }}
        loading={btnLoading}
        disabled={btnLoading}>
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
    width: '73%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  input2: {
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

export default UpdateMobileScreen;
