import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  I18nManager,
  Platform,
} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import i18n from 'i18next';

import Colors from '../constant/Colors';
import * as authActions from '../store/actions/auth';
import {SearchableDropdown} from './SearchableDropdown';
import {GOOGLE_API_KEY} from '../constant/base_url';
import {useError} from '../hooks/useError';

const RegisterForm = ({navigation}) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [mobile, setMobile] = useState('');
  const [company, setCompany] = useState('');
  const [trade_license_number, setTrade_license_number] = useState('');
  const [startdate, setStartdate] = useState(new Date());
  const [expiredate, setExpiredate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [long, setLong] = useState(null);
  const [lat, setLat] = useState(null);
  const [city, setCity] = useState('');
  const [cityList, setCityList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [cityId, setCityId] = useState(0);
  const [countryId, setCountryId] = useState(0);
  const [address, setAddress] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [iOS2, setIOS2] = useState('');
  const [country, setCountry] = useState('');
  console.log(address)

  const dispatch = useDispatch();
  const setError = useError();

  const {countries, cities} = useSelector(state => state.auth);
  const {lang} = useSelector(state => state.lang);

  const [isDatePickerVisible_start, setDatePickerVisibility_start] =
    useState(false);

  const [isDatePickerVisible_expire, setDatePickerVisibility_expire] =
    useState(false);

  const showDatePicker_start = useCallback(() => {
    setDatePickerVisibility_start(true);
  }, []);

  const showDatePicker_expire = useCallback(() => {
    setDatePickerVisibility_expire(true);
  }, []);
  const hideDatePicker_expire = useCallback(() => {
    setDatePickerVisibility_expire(false);
  }, []);

  const hideDatePicker_start = useCallback(() => {
    setDatePickerVisibility_start(false);
  }, []);


  const handleConfirmStart = useCallback(
    date => {
      setStartdate(date);
      hideDatePicker_start();
    },
    [hideDatePicker_start],
  );

  const handleConfirm_expire = useCallback(
    date => {
      setExpiredate(date);
      hideDatePicker_expire();
    },
    [hideDatePicker_expire],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        await dispatch(authActions.setCountries());
      } catch (e) {
        setError(e.message);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const getCities = useCallback(
    async val => {
      setLoading(true);
      try {
        await dispatch(authActions.setCities(val));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    },
    [dispatch, setError],
  );

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
        result.assets.forEach(asset => {
          setImage({
            name: asset.fileName,
            uri: asset.uri,
            type: asset.type,
          });
        });
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const _onRegisterHandler = useCallback(async () => {
    setBtnLoading(true);
    setError(null);

    try {
      await dispatch(
        authActions.register(
          firstname,
          lastname,
          email,
          password,
          passwordConfirmation,
          phoneCode,
          mobile,
          company,
          countryId,
          cityId,
          trade_license_number,
          image,
          startdate,
          expiredate,
          long,
          lat,
          address,
        ),
      );
      setBtnLoading(false);
      navigation.replace('VerifyAccount');
    } catch (e) {
      setError(e.message);
      setBtnLoading(false);
    }
  }, [
    setError,
    dispatch,
    firstname,
    lastname,
    email,
    password,
    passwordConfirmation,
    phoneCode,
    mobile,
    company,
    countryId,
    cityId,
    trade_license_number,
    image,
    startdate,
    expiredate,
    long,
    lat,
    address,
    navigation,
  ]);

  useEffect(() => {
    if (countries) {
      setCountryList(countries);
    }
    if (cities) {
      setCityList(cities);
    }
  }, [cities, countries]);

  const onSelectCountry = id => {
    setCountryId(id);
    getCities(id);
    const item = countryList.find(i => i.id === id);
    if (item) {
      setPhoneCode(item.phonecode);
      setIOS2(item.iso2);
    }
  };

  const onSelectCity = value => {
    setCityId(value);
  };

  const autoCompleteOnPress = (data, details = null) => {
    setAddress(data.description);
    setLat(details.geometry.location.lat);
    setLong(details.geometry.location.lng);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.imgContainer}>
        <Image
          source={require('../assets/Color_logo_no_background.png')}
          style={styles.logoImg}
        />
      </View>
      <Title style={styles.register}>{i18n.t('langChange:reg')}</Title>
      <View style={styles.form}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: RFValue(10),
          }}>
          <TextInput
            left={<TextInput.Icon name="account" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={i18n.t('langChange:fname')}
            style={{width: '48%', backgroundColor: Colors.white}}
            value={firstname}
            onChangeText={setFirstname}
          />
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={i18n.t('langChange:lname')}
            style={{width: '48%', backgroundColor: Colors.white}}
            value={lastname}
            onChangeText={setLastname}
          />
        </View>
        <TextInput
          left={<TextInput.Icon name="email" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={i18n.t('langChange:email')}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          left={<TextInput.Icon name="lock-outline" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={i18n.t('langChange:password')}
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          left={<TextInput.Icon name="lock" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={i18n.t('langChange:confPass')}
          secureTextEntry
          style={styles.input}
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
        />
        <TextInput
          left={
            <TextInput.Icon name="office-building" color={Colors.primary} />
          }
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={i18n.t('langChange:compName')}
          style={styles.input}
          value={company}
          onChangeText={setCompany}
        />
        {/*<TextInput*/}
        {/*  left={<TextInput.Icon name="earth" color={Colors.primary} />}*/}
        {/*  mode={I18nManager.isRTL ? 'outlined' : 'flat'}*/}
        {/*  label={'Country'}*/}
        {/*  style={styles.input}*/}
        {/*  value={country}*/}
        {/*  editable={false}*/}
        {/*/>*/}
        <SearchableDropdown
          data={countryList.map(m => ({
            name: m.name,
            id: m.id,
            value: m.id,
          }))}
          label={'Country'}
          selectedValue={country}
          onSelectValue={onSelectCountry}
          leftIcon={<TextInput.Icon name={'earth'} color={Colors.primary} />}
        />
        <SearchableDropdown
          label={'City'}
          data={cityList.map(m => ({
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
        <GooglePlacesAutocomplete
          placeholder="Add Complete Address"
          minLength={2}
          autoFocus={false}
          returnKeyType={'search'}
          keyboardAppearance={'light'}
          listViewDisplayed="auto"
          fetchDetails={true}
          renderDescription={row => row.description}
          onPress={autoCompleteOnPress}
          getDefaultValue={() => ''}
          query={{
            key: GOOGLE_API_KEY,
            language: lang,
            components: `country:${iOS2}`,
          }}
          styles={styles.mapMarker}
          debounce={200}
          textInputProps={{
            InputComp: TextInput,
            onChangeText:(text)=>setAddress(text),
            value: address,
            label: i18n.t('langChange:statusAddress'),
            mode: I18nManager.isRTL ? 'outlined' : 'flat',
            left: <TextInput.Icon name="home" color={Colors.primary} />,
            style: {
              width: '100%',
              alignSelf: 'center',
              backgroundColor: Colors.white,
            },
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: RFValue(10),
          }}>
          <TextInput
            left={<TextInput.Icon name="phone" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={i18n.t('langChange:code')}
            style={{
              backgroundColor: Colors.white,
              width: '40%',
            }}
            editable={false}
            value={phoneCode}
          />
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={i18n.t('langChange:mob')}
            style={styles.number}
            keyboardType="numeric"
            value={mobile}
            onChangeText={setMobile}
          />
        </View>
        <TextInput
          left={
            <TextInput.Icon name="card-text-outline" color={Colors.primary} />
          }
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={i18n.t('langChange:lic')}
          style={styles.input1}
          value={trade_license_number}
          onChangeText={setTrade_license_number}
        />
        <View style={styles.row}>
          <Text style={styles.text_start}>
            {i18n.t('langChange:issueDate')}
          </Text>
          <Text style={styles.text_expire}>{i18n.t('langChange:expDate')}</Text>
        </View>
        <View style={styles.row1}>
          <Pressable
            style={styles.dateContainer}
            onPress={showDatePicker_start}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={Colors.primary}
              style={{paddingHorizontal: RFValue(10)}}
            />
            <DatePicker
              mode="date"
              modal
              theme={'light'}
              open={isDatePickerVisible_start}
              date={startdate}
              onConfirm={handleConfirmStart}
              onCancel={hideDatePicker_start}
            />
            <Text style={{fontSize: RFValue(12)}}>
              {dayjs(startdate).format('DD/MM/YYYY')}
            </Text>
          </Pressable>
          <Pressable
            style={styles.dateContainer}
            onPress={showDatePicker_expire}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={Colors.primary}
              style={{marginRight: RFValue(12)}}
            />
            <DatePicker
              mode="date"
              modal
              theme={'light'}
              open={isDatePickerVisible_expire}
              date={expiredate}
              onConfirm={handleConfirm_expire}
              onCancel={hideDatePicker_expire}
              minimumDate={new Date()}
            />
            <Text style={{fontSize: RFValue(12)}}>
              {dayjs(expiredate).format('DD/MM/YYYY')}
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            marginTop: RFValue(20),
          }}>
          <Button
            mode="outlined"
            onPress={_pickImageHandler}
            icon={'attachment'}
            style={{width: '70%', alignSelf: 'center'}}
            contentStyle={{height: 40}}>
            {i18n.t('langChange:uploadLic')}
          </Button>
          {image && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: RFValue(10),
              }}>
              <Text
                style={{
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  color: Colors.primary,
                  fontSize: RFValue(12),
                }}>
                uploaded successfully
              </Text>
              <Ionicons
                name="checkmark-done"
                size={24}
                color={Colors.primary}
                style={{paddingHorizontal: RFValue(2)}}
              />
            </View>
          )}
        </View>
        <Button
          mode="contained"
          style={{
            width: '40%',
            alignSelf: 'center',
            marginVertical: RFValue(20),
            borderRadius: RFValue(50),
          }}
          contentStyle={{height: 50}}
          onPress={_onRegisterHandler}
          loading={btnLoading}
          disabled={btnLoading}>
          {i18n.t('langChange:reg')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  heading: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: RFValue(15),
  },
  input: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  input1: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('20%'),
    alignSelf: 'center',
    paddingTop: RFValue(15),
    backgroundColor: Colors.primary,
  },
  register: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: RFValue(22),
    textTransform: 'uppercase',
    paddingTop: RFValue(10),
  },
  logoImg: {
    width: '90%',
    height: '100%',
    resizeMode: 'contain',
  },
  form: {
    padding: RFValue(15),
  },
  mobile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  codeContainer: {
    backgroundColor: 'rgba(255,255,255,1)',
    flexDirection: 'row',
    marginLeft: RFValue(10),
    marginRight: RFValue(10),
    flex: 1,
  },
  mobileIcon: {
    alignSelf: 'center',
    marginLeft: RFValue(15),
  },
  number: {
    width: '55%',
    backgroundColor: Colors.white,
  },
  dropDownStyles: {
    flexDirection: 'row',
  },
  earth: {
    paddingTop: RFValue(3),
    marginLeft: RFValue(12),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: RFValue(10),
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: RFValue(10),
  },
  text_start: {
    paddingLeft: RFValue(40),
    paddingTop: RFValue(8),
    color: Colors.primary,
  },
  text_expire: {
    marginRight: RFValue(45),
    paddingTop: RFValue(8),
    color: Colors.primary,
  },
  dateContainer: {
    flexDirection: 'row',
    borderBottomWidth: RFValue(1),
    paddingBottom: RFValue(12),
    paddingTop: RFValue(10),
    width: '45%',
    borderBottomColor: '#bdbdbd',
    alignItems: 'center',
  },
  ////
  selectedTextStyle: {
    borderColor: 'gray',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    color: 'black',
    fontSize: RFValue(15),
    paddingLeft: 10,
  },
  listTextStyle: {
    color: '#000',
    marginVertical: RFValue(10),
    flex: 0.9,
    marginLeft: RFValue(20),
    marginHorizontal: RFValue(10),
    textAlign: 'left',
  },
  searchBarStyle: {
    marginBottom: 10,
    flexDirection: 'row',
    height: RFValue(40),
    shadowRadius: 1,
    shadowOpacity: 1.0,
    borderWidth: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderColor: '#303030',
    shadowColor: '#303030',
    borderRadius: RFValue(5),
    elevation: 1,
    marginHorizontal: RFValue(10),
  },
  placeHolderTextStyle: {
    padding: RFValue(10),
    textAlign: 'left',
    width: '80%',
    flexDirection: 'row',
  },
  dropDownIconStyle: {
    width: RFValue(12),
    height: RFValue(12),
    left: -20,
  },
  pickerStyle: {
    height: RFValue(30),
    width: '95%',
  },
  pickerContainerStyleIOS: {
    backgroundColor: '#fff',
  },
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

export default RegisterForm;
