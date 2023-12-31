import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  I18nManager,
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SearchableDropdown} from '../../components/SearchableDropdown';
import {Button, TextInput} from 'react-native-paper';
import Colors from '../../constant/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {useError} from '../../hooks/useError';
import * as authAction from '../../store/actions/auth';
import * as deliveryActions from '../../store/actions/delivery';
import Loader from '../../components/Loader';
import {URL} from '../../constant/base_url';
import {NotFound} from '../../components/NotFound';
import {successMessage} from '../../utils/success-message';

const EditDeliveryScreen = ({navigation, route}) => {
  const itemId = route.params.id;

  const {deliveryDetails} = useSelector(state => state.delivery);
  const {countries, cities} = useSelector(state => state.auth);

  const [countryId, setCountryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [address, setAddress] = useState('');
  const [proofId, setProofId] = useState('');
  const [proofSecond, setProofSecond] = useState('');
  const [proofImg1, setProofImg1] = useState({uri: ''});
  const [proofImg2, setProofImg2] = useState({uri: ''});

  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          dispatch(authAction.setCountries()),
          dispatch(deliveryActions.getDeliveryDetails(itemId)),
        ]);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, itemId, navigation, setError]);

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

  const onClickHandler = async () => {
    Keyboard.dismiss();
    setError(null);
    setBtnLoading(true);
    try {
      await dispatch(
        deliveryActions.updateDeliveryBoy(
          itemId,
          name,
          email,
          phoneCode,
          mobile,
          address,
          countryId,
          cityId,
          proofId,
          proofSecond,
          proofImg1,
          proofImg2,
        ),
      );
      successMessage('Delivery', 'Delivery Boy Updated Successfully');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    }

    setBtnLoading(false);
  };

  useEffect(() => {
    if (deliveryDetails) {
      setAddress(deliveryDetails.deliveryAddress);
      setCountryId(deliveryDetails.countryId);
      setCityId(deliveryDetails.cityId);
      setName(deliveryDetails.deliveryName);
      setEmail(deliveryDetails.deliveryEmail);
      setMobile(deliveryDetails.deliveryMobile);
      setPhoneCode(String(deliveryDetails.deliveryCode));
      setProofId(deliveryDetails.deliveryProof1);
      setProofSecond(deliveryDetails.deliveryProof2);
      setProofImg1({
        uri: URL + deliveryDetails.deliveryImage1,
      });
      setProofImg2({
        uri: URL + deliveryDetails.deliveryImage2,
      });
    }
  }, [countries, deliveryDetails]);

  const onSelectCity = value => setCityId(value);

  const onSelectCountry = value => {
    setCountryId(value);
    setCityId('');
    setPhoneCode('');
  };

  if (loading) {
    return <Loader />;
  }

  if (!deliveryDetails) {
    return <NotFound />;
  }

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
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
            {proofImg1.uri ? (
              <Image source={{uri: proofImg1.uri}} style={styles.imgStyles} />
            ) : (
              <MaterialIcons
                name="add-a-photo"
                size={24}
                color="#cdcdcd"
                onPress={() => _pickImageHandler('image1')}
              />
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
            {proofImg2.uri ? (
              <Image source={{uri: proofImg2.uri}} style={styles.imgStyles} />
            ) : (
              <MaterialIcons
                name="add-a-photo"
                size={24}
                color="#cdcdcd"
                onPress={() => _pickImageHandler('image2')}
              />
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
          onPress={onClickHandler}
          loading={btnLoading}
          disabled={btnLoading}>
          Update
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
  id: {
    backgroundColor: Colors.white,
    width: '55%',
    marginRight: 8,
    alignSelf: 'center',
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
  btnStyles: {
    width: '50%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  view: {justifyContent: 'space-between', flexDirection: 'row'},
});

export default EditDeliveryScreen;
