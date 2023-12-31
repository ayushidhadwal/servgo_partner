import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, TextInput} from 'react-native-paper';
import Colors from '../../constant/Colors';
import {SearchableDropdown} from '../../components/SearchableDropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {useError} from '../../hooks/useError';
import * as authAction from '../../store/actions/auth';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import * as deliveryActions from '../../store/actions/delivery';
import Loader from '../../components/Loader';
import {useGetDeliveryDetails} from '../../hooks/delivery/useGetDeliveryDetails';

const DeliveryDetailsScreen = ({route, navigation}) => {
  const {itemId} = route.params;
  const {deliveryDetails} = useGetDeliveryDetails(itemId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [proofId, setProofId] = useState('');
  const [proofSecond, setProofSecond] = useState('');
  const [cityLoading, setCityLoading] = useState(false);
  const [country, setCountry] = useState('');
  const [countryId, setCountryId] = useState(0);
  const [cityId, setCityId] = useState(0);
  const [iOS2, setIOS2] = useState('');
  const {countries, cities} = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');

  const [proofImg1, setProofImg1] = useState({
    name: '',
    uri: null,
    type: '',
  });
  const [proofImg2, setProofImg2] = useState({
    name: '',
    uri: null,
    type: '',
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const dispatch = useDispatch();
  const setError = useError();

  const onSelectCity = value => {
    setCityId(value);
  };
  const onSelectCountry = value => {
    setCountryId(value);
    const a = countries.find(m => m.id === value);
    if (a) {
      setIOS2(a.iso2);
    }
    setCityId('');
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(authAction.setCountries());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const getCity = useCallback(
    async id => {
      setCityLoading(true);
      setError(null);
      try {
        await dispatch(authAction.setCities(id));
      } catch (e) {
        setError(e.message);
      }
      setCityLoading(false);
    },
    [dispatch, setError],
  );

  useEffect(() => {
    if (countryId !== 0) {
      getCity(countryId).then(r => null);
    }
  }, [countryId, getCity]);

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

    let img = {
      name: '',
      uri: '',
      type: '',
    };

    if ('assets' in result) {
      result.assets.forEach(asset => {
        img = {
          name: asset.fileName,
          uri: asset.uri,
          type: asset.type,
        };
        if (image === 'image1') {
          setProofImg1(img);
        } else {
          setProofImg2(img);
        }
      });
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
          selectedValue={country}
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
            selectedValue={city}
            onSelectValue={onSelectCity}
            leftIcon={
              <TextInput.Icon name={'map-marker'} color={Colors.primary} />
            }
          />
        ) : (
          <View style={styles.loader}>
            <ActivityIndicator animating={true} color={Colors.primary} />
            <Text>Loading...</Text>
          </View>
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
            onChangeText={setPhoneCode}
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
          loading={btnLoading}
          disabled={btnLoading}
          // onPress={() => onPressHandler()>>
        >
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
export default DeliveryDetailsScreen;
