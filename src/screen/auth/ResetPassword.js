import React, {useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, StatusBar, View, Image, I18nManager} from 'react-native';
import {TextInput, Title, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../../constant/Colors';
import * as authActions from '../../store/actions/auth';
import {useError} from '../../hooks/useError';
import {successMessage} from '../../utils/success-message';

const ResetPassword = ({navigation}) => {
  const {token} = useSelector(state => state.auth);

  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  const onSubmitHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        authActions.set_new_password({token, password, password_confirmation}),
      );
      successMessage('Forgot Password', 'Your password reset successfully.');
      navigation.navigate('login');
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [setError, dispatch, token, password, password_confirmation, navigation]);

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
            style={styles.img}
          />
        </View>
        <Title style={styles.forgot}>Forgot Password</Title>
        <View style={{padding: RFValue(15)}}>
          <TextInput
            left={<TextInput.Icon name="lock-outline" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label="New Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TextInput
            left={<TextInput.Icon name="lock" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label="Confirm New Password"
            style={styles.input}
            secureTextEntry
            value={password_confirmation}
            onChangeText={text => setPassword_confirmation(text)}
          />
          <Button
            mode="contained"
            style={styles.btn}
            labelStyle={{paddingVertical: RFValue(2)}}
            contentStyle={{height: 50}}
            onPress={onSubmitHandler}
            disabled={loading}
            loading={loading}>
            submit
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
  img: {
    width: '90%',
    height: '100%',
    resizeMode: 'contain',
  },
  forgot: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: RFValue(22),
    textTransform: 'uppercase',
    paddingTop: RFValue(30),
  },
  input: {backgroundColor: Colors.white},
  btn: {
    width: '70%',
    height: 50,
    alignSelf: 'center',
    marginTop: RFValue(40),
  },
});

export default ResetPassword;
