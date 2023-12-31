import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, Text, View, Image, Platform} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import i18n from 'i18next';

import {IMG_URL} from '../../constant/base_url';
import Colors from '../../constant/Colors';
import * as requestAction from '../../store/actions/request';
import {useError} from '../../hooks/useError';
import {successMessage} from '../../utils/success-message';
import Loader from '../../components/Loader';

const BankDetailScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [screenloading, setScreenLoading] = useState(false);

  const [bankName, setBankName] = useState('');
  const [account, setAccount] = useState(0);
  const [iBan, setIBan] = useState('');
  const [image, setImage] = useState(null);

  const setError = useError();
  const dispatch = useDispatch();
  const {bank} = useSelector(state => state.request);

  const {cancel_cheque, bank_name, bank_account_number, iban} = bank;
  useEffect(() => {
    setBankName(bank_name);
    setAccount(bank_account_number);
    setIBan(iban);
    setImage({uri: IMG_URL + cancel_cheque});
  }, [bank_account_number, bank_name, cancel_cheque, iban]);

  const onclickHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(
        requestAction.updateBankDetails(bankName, account, iBan, image),
      );
      successMessage('Success', 'Updated Successfully');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setScreenLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getBankDetails());
      } catch (e) {
        setError(e.message);
      } finally {
        setScreenLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const _pickImageHandler = async () => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    )
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            _openImagePicker();
            break;
          case RESULTS.UNAVAILABLE:
            setError('This feature is not available on this device!');
            break;
          case RESULTS.DENIED:
            request(
              Platform.OS === 'ios'
                ? PERMISSIONS.IOS.PHOTO_LIBRARY
                : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            ).then(requestResult => {
              if (requestResult === RESULTS.GRANTED) {
                _openImagePicker();
              }
            });
            break;
          case RESULTS.LIMITED:
            _openImagePicker();
            break;
          case RESULTS.BLOCKED:
            setError(
              'The permission is denied! Please enable storage permission.',
            );
            openSettings().catch(settingsErr =>
              setError('Unable to open settings!'),
            );
            break;
        }
      })
      .catch(e => {
        setError(e.message);
      });
  };

  const _openImagePicker = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if ('assets' in result) {
        const [asset] = result.assets;
        setImage({
          name: asset.fileName,
          uri: asset.uri,
          type: asset.type,
        });
      }
    } catch (e) {
      setError(e.message);
    }
  };

  if (screenloading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView>
        <View style={styles.nameContainer}>
          <Text style={styles.label}>{i18n.t('langChange:bankName')}</Text>
          <Text style={{color: Colors.grey}}>
            {i18n.t('langChange:bankNameMsg')}
          </Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input1}
            value={bankName}
            onChangeText={setBankName}
          />
          <Text style={styles.label}>{i18n.t('langChange:bankAccNo')}</Text>
          <Text style={{color: Colors.grey}}>
            {i18n.t('langChange:bankAccNoMsg')}
          </Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input1}
            value={account}
            onChangeText={setAccount}
          />
          <Text style={styles.label}>{i18n.t('langChange:iban')}</Text>
          <Text style={{color: Colors.grey}}>
            {i18n.t('langChange:ibanMsg')}
          </Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input2}
            value={iBan}
            onChangeText={setIBan}
          />
        </View>
        <View style={styles.nameContainer1}>
          <Text style={styles.label}>{i18n.t('langChange:cancelCheque')}</Text>
          <Text style={{color: Colors.grey}}>
            {i18n.t('langChange:cancelChequeMsg')}
          </Text>
          <Button
            mode="outlined"
            icon="plus-box"
            style={{marginTop: RFValue(15), width: '45%'}}
            onPress={_pickImageHandler}>
            {i18n.t('langChange:addImg')}
          </Button>
          {image?.uri ? (
            <Image
              source={{uri: image.uri}}
              style={{
                width: RFValue(100),
                height: RFValue(100),
                marginVertical: RFValue(12),
              }}
            />
          ) : null}

          <Button
            mode="outlined"
            icon="check"
            onPress={onclickHandler}
            loading={loading}
            disabled={loading}
            style={{alignSelf: 'center', marginTop: RFValue(15)}}>
            {i18n.t('langChange:saveBtn')}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(5),
    justifyContent: 'space-between',
  },
  nameContainer: {
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(20),
    marginBottom: RFValue(10),
    backgroundColor: Colors.white,
  },
  nameContainer1: {
    padding: RFValue(20),
    backgroundColor: Colors.white,
  },
  label: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  input1: {
    marginBottom: RFValue(15),
  },
  input2: {
    marginBottom: RFValue(20),
  },
});

export default BankDetailScreen;
