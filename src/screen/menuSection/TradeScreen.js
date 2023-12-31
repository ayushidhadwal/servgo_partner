import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Image, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
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

import Colors from '../../constant/Colors';
import * as requestAction from '../../store/actions/request';
import {IMG_URL} from '../../constant/base_url';
import {useError} from '../../hooks/useError';
import Loader from '../../components/Loader';
import {successMessage} from '../../utils/success-message';

const TradeScreen = ({navigation}) => {
  const [number, setNumber] = useState('');
  const [startdate, setStartdate] = useState(new Date());
  const [expiredate, setExpiredate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [isDatePickerVisible_start, setDatePickerVisibility_start] =
    useState(false);
  const [isDatePickerVisible_expire, setDatePickerVisibility_expire] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [screenloading, setScreenLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();
  const {trade} = useSelector(state => state.request);

  const showDatePicker_start = () => {
    setDatePickerVisibility_start(true);
  };

  const showDatePicker_expire = () => {
    setDatePickerVisibility_expire(true);
  };

  const hideDatePicker_start = () => {
    setDatePickerVisibility_start(false);
  };

  const hideDatePicker_expire = () => {
    setDatePickerVisibility_expire(false);
  };

  const handleConfirm_start = date => {
    setStartdate(date);
    hideDatePicker_start();
  };

  const handleConfirm_expire = date => {
    setExpiredate(date);
    hideDatePicker_expire();
  };

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setScreenLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getTrade());
      } catch (e) {
        setError(e.message);
      } finally {
        setScreenLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const {
    trade_license_number,
    startdate: tradeStartDate,
    expiredate: tradeExpireDate,
    tradelicense,
  } = trade;

  useEffect(() => {
    setNumber(trade_license_number);
    setStartdate(tradeStartDate);
    setExpiredate(tradeExpireDate);
    setImage({
      uri: IMG_URL + tradelicense,
    });
  }, [trade_license_number, tradeStartDate, tradeExpireDate, tradelicense]);

  const onclickHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(
        requestAction.updateTrade(number, startdate, expiredate, image),
      );
      setLoading(false);
      successMessage('Success', 'Updated Successfully');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  if (screenloading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView>
        <View style={styles.nameContainer}>
          <Text style={styles.label1}>{i18n.t('langChange:tradeLicNo')}</Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input1}
            value={number}
            onChangeText={setNumber}
          />
          <Text style={styles.label1}>{i18n.t('langChange:tradeLicDate')}</Text>
          <Pressable onPress={showDatePicker_start} style={styles.rowContainer}>
            <Text style={styles.date}>
              {dayjs(startdate).format('YYYY-MM-DD')}
            </Text>
          </Pressable>
          <DatePicker
            // date={startdate}
            date={new Date()}
            mode="date"
            modal
            open={isDatePickerVisible_start}
            onConfirm={handleConfirm_start}
            onCancel={hideDatePicker_start}
          />
          <Text style={styles.label1}>
            {i18n.t('langChange:tradeLicExpDate')}
          </Text>
          <Pressable
            style={styles.rowContainer}
            onPress={showDatePicker_expire}>
            <Text style={styles.date}>
              {dayjs(expiredate).format('YYYY-MM-DD')}
            </Text>
          </Pressable>
          <DatePicker
            // date={expiredate}
            date={new Date()}
            mode="date"
            modal
            open={isDatePickerVisible_expire}
            onConfirm={handleConfirm_expire}
            onCancel={hideDatePicker_expire}
            minimumDate={new Date()}
          />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label1}>{i18n.t('langChange:uploadImg')}</Text>
            <Button mode="contained" onPress={_pickImageHandler}>
              {i18n.t('langChange:upload')}
            </Button>
          </View>

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
            loading={loading}
            disabled={loading}
            onPress={onclickHandler}
            style={{alignSelf: 'center'}}>
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
  heading: {
    paddingLeft: RFValue(20),
  },
  nameContainer: {
    padding: RFValue(20),
    backgroundColor: Colors.white,
  },
  label: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  label1: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
    paddingTop: RFValue(5),
  },
  input1: {
    marginBottom: RFValue(15),
    backgroundColor: Colors.white,
  },
  rowContainer: {
    paddingVertical: RFValue(10),
    borderWidth: RFValue(1),
    marginTop: RFValue(8),
    marginBottom: RFValue(12),
  },
  date: {
    fontSize: RFValue(13.5),
    paddingLeft: RFValue(12),
  },
});

export default TradeScreen;
