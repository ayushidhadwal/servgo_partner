import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {
  StyleSheet,
  StatusBar,
  View,
  Image,
  Text,
  I18nManager,
} from 'react-native';
import {TextInput, Title, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import i18n from 'i18next';

import Colors from '../../constant/Colors';
import * as authActions from '../../store/actions/auth';
import {useError} from '../../hooks/useError';

const ForgotPassword = props => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  const onVerifyhandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(authActions.forgotPassword({email}));
      props.navigation.navigate('OTP');
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [dispatch, email, props.navigation, setError]);

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{backgroundColor: Colors.white}}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={Colors.primary}
        />
        <View style={styles.imgContainer}>
          <Image
            source={require('../../assets/Color_logo_no_background.png')}
            style={styles.logoImg}
          />
        </View>
        <Title style={styles.forgot}>{i18n.t('langChange:reset')}</Title>
        <View style={styles.form}>
          <TextInput
            left={<TextInput.Icon name="email" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={i18n.t('langChange:email')}
            style={styles.input}
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <Text style={styles.info}>{i18n.t('langChange:resetMsg')}</Text>
          <Button
            mode="contained"
            style={styles.btn}
            labelStyle={{paddingVertical: RFValue(2)}}
            contentStyle={{height: 50}}
            // onPress={() => props.navigation.navigate("reset")}
            onPress={onVerifyhandler}
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
    backgroundColor: Colors.primary,
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('20%'),
    alignSelf: 'center',
    paddingTop: RFValue(15),
    backgroundColor: Colors.primary,
  },
  logoImg: {
    width: '90%',
    height: '100%',
    resizeMode: 'contain',
  },
  btn: {
    width: '70%',
    height: 50,
    alignSelf: 'center',
    marginTop: RFValue(40),
  },
  forgot: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: RFValue(22),
    textTransform: 'uppercase',
    paddingTop: RFValue(30),
  },
  form: {
    padding: RFValue(15),
  },
  info: {
    paddingVertical: RFValue(8),
    color: Colors.primary,
  },
  input: {
    backgroundColor: Colors.white,
  },
});

export default ForgotPassword;
