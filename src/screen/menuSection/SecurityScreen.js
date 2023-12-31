import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Image, Alert, I18nManager} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../../constant/Colors';
import * as userActions from '../../store/actions/user';
import i18n from 'i18next';

const Security = ({navigation}) => {
  const {user_id} = useSelector(state => state.auth);

  const [old_password, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const onClickHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        userActions.updatePassword(
          user_id,
          old_password,
          password,
          password_confirmation,
        ),
      );
      Alert.alert('Alert', 'Password Updated Successfully', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [user_id, old_password, password, password_confirmation]);

  useEffect(() => {
    if (error) {
      alert(error.toString());
      setError(null);
    }
  }, [error]);

  return (
    <View style={styles.screen}>
      <View style={styles.imgContainer}>
        <Image
          source={require('../../assets/Color_logo_no_background.png')}
          style={styles.logoImg}
        />
      </View>
      <Title style={styles.title}>{i18n.t('langChange:changePass')}</Title>
      <View style={styles.form}>
        <TextInput
          left={<TextInput.Icon name="lock-outline" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={i18n.t('langChange:oldPass')}
          secureTextEntry
          style={styles.input}
          value={old_password}
          onChangeText={text => setOldPassword(text)}
        />
        <TextInput
          left={<TextInput.Icon name="lock-outline" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={i18n.t('langChange:newPass')}
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TextInput
          left={<TextInput.Icon name="lock" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={i18n.t('langChange:confPass')}
          secureTextEntry
          style={styles.input}
          value={password_confirmation}
          onChangeText={text => setPassword_confirmation(text)}
        />
        <Button
          mode="contained"
          style={styles.btn}
          labelStyle={{paddingVertical: RFValue(2)}}
          contentStyle={{height: 50}}
          onPress={onClickHandler}
          loading={loading}
          disabled={loading}>
          {i18n.t('langChange:updBtn')}
        </Button>
      </View>
    </View>
  );
};

export default Security;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heading: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: RFValue(15),
  },
  input: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: RFValue(20),
    backgroundColor: Colors.white,
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('15%'),
    paddingTop: RFValue(15),
    backgroundColor: Colors.primary,
    paddingBottom: RFValue(20),
  },
  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: RFValue(22),
    textTransform: 'uppercase',
    paddingTop: RFValue(10),
  },
  btn: {
    width: '100%',
    height: 50,
    alignSelf: 'center',
    marginTop: RFValue(40),
  },
  form: {
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(15),
  },
});
