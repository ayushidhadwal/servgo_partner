import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  StyleSheet,
  View,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../../constant/Colors';
import {useError} from '../../hooks/useError';
import Loader from '../../components/Loader';
import * as deliveryActions from '../../store/actions/delivery';
import {SearchableDropdown} from '../../components/SearchableDropdown';
import * as authAction from '../../store/actions/auth';
import {successMessage} from '../../utils/success-message';
import {getAllBranches} from '../../store/actions/branch';

const AddDeliveryBoyScreen = ({navigation}) => {
  const [countryId, setCountryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [proofId, setProofId] = useState('');
  const [proofSecond, setProofSecond] = useState('');

  const [proofImg1, setProofImg1] = useState(null);
  const [proofImg2, setProofImg2] = useState(null);

  const [btnLoading, setBtnLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const setError = useError();

  const {countries, cities} = useSelector(state => state.auth);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          dispatch(getAllBranches()),
          dispatch(authAction.setCountries()),
        ]);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  useEffect(() => {
    if (countryId) {
      (async () => {
        setCityLoading(true);
        setError(null);
        try {
          await dispatch(authAction.setCities(countryId));
        } catch (e) {
          setError(e.message);
        } finally {
          setCityLoading(false);
        }
      })();
    }
  }, [countryId, dispatch, setError]);

  const onSelectCity = value => setCityId(value);

  const onSelectCountry = value => {
    setCountryId(value);
    setCityId('');
    setPhoneCode('');
  };

  useEffect(() => {
    if (countryId) {
      const item = countries.find(m => m.id === countryId);
      if (item) {
        setPhoneCode(item.phonecode);
      }
    }
  }, [countries, countryId]);

  const _pickImageHandler = async img => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    )
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            _uploadImageHandler(img);
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
                _uploadImageHandler(img);
              }
            });
            break;
          case RESULTS.LIMITED:
            _uploadImageHandler(img);
            break;
          case RESULTS.BLOCKED:
            setError(
              'The permission is denied! Please enable storage permission.',
            );
            openSettings().catch(err =>
              setError('Unable to open settings!', err),
            );
            break;
        }
      })
      .catch(e => {
        setError(e.message);
      });
  };

  const _uploadImageHandler = async image => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if ('assets' in result) {
      const [asset] = result.assets;

      const img = {
        name: asset.fileName,
        uri: asset.uri,
        type: asset.type,
      };

      if (image === 'image1') {
        setProofImg1(img);
      } else {
        setProofImg2(img);
      }
    }
  };

  const onPressHandler = async () => {
    setError(null);
    setBtnLoading(true);

    try {
      await dispatch(
        deliveryActions.addDeliveryBoy(
          name,
          email,
          phoneCode,
          mobile,
          password,
          address,
          countryId,
          cityId,
          proofId,
          proofSecond,
          proofImg1,
          proofImg2,
        ),
      );

      setBtnLoading(false);
      successMessage('Success', 'Delivery Boy Added Successfully');
      navigation.goBack();
    } catch (e) {
      setBtnLoading(false);
      setError(e.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <KeyboardAwareScrollView>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <TextInput
          left={<TextInput.Icon name="account" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label="Name"
          style={styles.code}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          left={<TextInput.Icon name="email" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label="Email"
          style={styles.code}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          left={<TextInput.Icon name="lock" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label="Password"
          style={styles.code}
          value={password}
          onChangeText={setPassword}
        />
        <SearchableDropdown
          label={'Select Country'}
          data={countries.map(m => ({
            name: m.name,
            key: m.id,
            value: m.id,
          }))}
          selectedValue={countryId}
          onSelectValue={onSelectCountry}
          leftIcon={
            <TextInput.Icon name={'map-marker-radius'} color={Colors.primary} />
          }
        />
        {!cityLoading ? (
          <SearchableDropdown
            label={'Select City'}
            data={cities.map(m => ({
              name: m.name,
              key: m.id,
              value: m.id,
            }))}
            selectedValue={cityId}
            onSelectValue={onSelectCity}
            leftIcon={
              <TextInput.Icon name={'map-marker'} color={Colors.primary} />
            }
          />
        ) : (
          <Loader />
        )}

        <TextInput
          left={<TextInput.Icon name="map-marker" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label="Address"
          style={styles.code}
          value={address}
          onChangeText={setAddress}
        />

        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          <TextInput
            left={<TextInput.Icon name="phone" color={Colors.primary} />}
            editable={false}
            label="Code"
            style={{backgroundColor: Colors.white, width: '30%'}}
            value={phoneCode}
          />
          <TextInput
            label="Mobile Number"
            style={{backgroundColor: Colors.white, width: '60%'}}
            value={mobile}
            onChangeText={setMobile}
          />
        </View>
        <View style={styles.view}>
          <Pressable
            style={styles.imgBox}
            onPress={() => _pickImageHandler('image1')}>
            {proofImg1?.uri ? (
              <Image source={{uri: proofImg1?.uri}} style={styles.imgStyles} />
            ) : (
              <MaterialIcons name="add-a-photo" size={24} color="#cdcdcd" />
            )}
          </Pressable>
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            left={<TextInput.Icon name="id-card" color={Colors.primary} />}
            label="Id Type"
            style={styles.id}
            value={proofId}
            onChangeText={setProofId}
          />
        </View>
        <View style={styles.view}>
          <Pressable
            style={styles.imgBox}
            onPress={() => _pickImageHandler('image2')}>
            {proofImg2?.uri ? (
              <Image source={{uri: proofImg2?.uri}} style={styles.imgStyles} />
            ) : (
              <MaterialIcons name="add-a-photo" size={24} color="#cdcdcd" />
            )}
          </Pressable>

          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            left={<TextInput.Icon name="id-card" color={Colors.primary} />}
            label="Id Type"
            style={styles.id}
            value={proofSecond}
            onChangeText={setProofSecond}
          />
        </View>
        <Button
          mode={'contained'}
          contentStyle={{height: 40}}
          style={styles.btnStyles}
          loading={btnLoading}
          disabled={btnLoading}
          onPress={onPressHandler}>
          Add
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  code: {
    backgroundColor: Colors.white,
    width: '95%',
    alignSelf: 'center',
  },
  imgStyles: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  imgBox: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#cdcdcd',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    marginBottom: 15,
    backgroundColor: Colors.white,
  },
  id: {
    backgroundColor: Colors.white,
    width: '55%',
    marginRight: 8,
    alignSelf: 'center',
  },
  btnStyles: {
    width: '50%',
    alignSelf: 'center',
    marginVertical: 20,
  },

  view: {justifyContent: 'space-between', flexDirection: 'row'},
  mapMarker: {
    textInputContainer: {
      width: '93%',
      alignSelf: 'center',
    },
    textInput: {
      height: 60,
      color: Colors.black,
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
    },
  },
});

export default AddDeliveryBoyScreen;
