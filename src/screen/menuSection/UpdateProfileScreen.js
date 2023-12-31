import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Platform,
  I18nManager,
  Text,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, TextInput } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import Feather from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import i18n from 'i18next';

import Colors from '../../constant/Colors';
import * as userActions from '../../store/actions/user';
import * as authActions from '../../store/actions/auth';
import { IMG_URL } from '../../constant/base_url';
import { SearchableDropdown } from '../../components/SearchableDropdown';
import { useError } from '../../hooks/useError';
import { successMessage } from '../../utils/success-message';
import { Image } from '../../components/Image';
import Loader from '../../components/Loader';
import { t } from 'i18n-js';
import i18next from 'i18next';

const UpdateProfileScreen = ({ navigation }) => {
  const { partner } = useSelector(state => state.user);
  const { countries, cities } = useSelector(state => state.auth);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [overview, setOverview] = useState('');
  const [countryCode, setCountryCode] = useState(0);
  const [cityCode, setcityCode] = useState(0);

  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  const [image, setImage] = useState(null);

  const setError = useError();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all(
          dispatch(userActions.set_Profile()),
          dispatch(authActions.setCountries()),
        );
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const getCity = useCallback(async () => {
    if (!countryCode || countryCode === 0 || countryCode === null) {
      return;
    }
    setCityLoading(true);
    setError(null);
    try {
      await dispatch(authActions.setCities(countryCode));
    } catch (e) {
      setError(e.message);
    } finally {
      setCityLoading(false);
    }
  }, [countryCode, dispatch, setError]);

  useEffect(() => {
    getCity();
  }, [getCity]);

  useEffect(() => {
    setImage({
      uri: IMG_URL + partner.photo,
    });
    setFirstName(partner.firstname);
    setLastName(partner.lastname);
    setAddress(partner.address);
    setCompanyName(partner.company_name);
    setOverview(partner.experience_text);
    setCountryCode(partner.country);
    setcityCode(partner.city);
  }, [partner]);

  const onClickHandler = useCallback(async () => {
    setBtnLoading(true);
    setError(null);

    try {
      await dispatch(
        userActions.updateProfile(
          firstName,
          lastName,
          address,
          countryCode,
          cityCode,
          companyName,
          overview,
        ),
      );

      successMessage('Profile', 'Profile updated successfully.');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
      setBtnLoading(false);
    }
    setBtnLoading(false);
  }, [
    setError,
    dispatch,
    firstName,
    lastName,
    address,
    countryCode,
    cityCode,
    companyName,
    overview,
    navigation,
  ]);

  const onSelectCity = value => {
    setcityCode(value);
  };
  const onSelectCountry = value => {
    setCountryCode(value);
    setcityCode('');
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
            _uploadImageHandler();
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
                _uploadImageHandler();
              }
            });
            break;
          case RESULTS.LIMITED:
            _uploadImageHandler();
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

  const _uploadImageHandler = async () => {
    try {
      setImgLoading(true);
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.5,
      });

      if ('assets' in result) {
        const [file] = result.assets;

        await dispatch(userActions.updatePicture(file));
        setImage({ uri: file.uri });
        successMessage('Profile', 'Profile image updated successfully.');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setImgLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        {imgLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.imgContainer}
          />
        ) : (
          <View style={styles.imgContainer}>
            <Image source={image} style={[styles.img, { borderRadius: 200 }]} />
            <Feather
              name="edit"
              size={24}
              color={Colors.primary}
              style={styles.edit}
              onPress={_pickImageHandler}
            />
          </View>
        )}
        <View style={{ flex: 1, padding: 15 }}>
          <View style={styles.rowStyle}>
            <TextInput
              left={<TextInput.Icon name="account" color={Colors.primary} />}
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={i18n.t('langChange:fname')}
              style={styles.input}
              value={firstName}
              onChangeText={text => setFirstName(text)}
            />
            <TextInput
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={i18n.t('langChange:lname')}
              style={styles.input}
              value={lastName}
              onChangeText={text => setLastName(text)}
            />
          </View>
          <TextInput
            left={
              <TextInput.Icon name="home-map-marker" color={Colors.primary} />
            }
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={i18n.t('langChange:statusAddress')}
            style={styles.input1}
            value={address}
            onChangeText={text => setAddress(text)}
          />
          <SearchableDropdown
            label={i18next.t('langChange:selectCountry')}
            data={countries.map(m => ({
              name: m.name,
              key: m.id,
              value: m.id,
            }))}
            selectedValue={countryCode}
            onSelectValue={onSelectCountry}
            leftIcon={
              <TextInput.Icon
                name={'map-marker-radius'}
                color={Colors.primary}
              />
            }
          />
          {!cityLoading ? (
            <SearchableDropdown
              label={i18next.t('langChange:selectCity')}
              data={cities.map(m => ({
                name: m.name,
                key: m.id,
                value: m.id,
              }))}
              selectedValue={cityCode}
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
            left={
              <TextInput.Icon name="office-building" color={Colors.primary} />
            }
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={i18n.t('langChange:compName')}
            style={styles.input1}
            value={companyName}
            onChangeText={text => setCompanyName(text)}
          />
          <TextInput
            left={
              <TextInput.Icon name="account-details" color={Colors.primary} />
            }
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={i18n.t('langChange:overview')}
            style={styles.input1}
            value={overview}
            onChangeText={text => setOverview(text)}
          />
          <Button
            mode="contained"
            style={{
              width: '60%',
              marginVertical: RFValue(30),
              alignSelf: 'center',
            }}
            onPress={onClickHandler}
            loading={btnLoading}
            disabled={btnLoading}>
            {i18n.t('langChange:updBtn')}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '93%',
    alignSelf: 'center',
  },
  input: {
    backgroundColor: Colors.white,
    width: '48%',
  },
  input1: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  edit: {
    position: 'absolute',
    margin: 5,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    padding: RFValue(5),
    borderRadius: RFValue(100),
  },
  imgContainer: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 10,
  },
  img: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  selectedTextStyle: {
    borderColor: 'gray',
    backgroundColor: 'transparent',
    color: 'black',
    fontSize: RFValue(13),
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
    height: RFValue(25),
    width: '95%',
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryLight,
  },
  rowDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateHeading: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.black,
    fontWeight: 'bold',
  },
  update: {
    marginLeft: 10,
    fontSize: 12,
    color: '#545454',
  },
});

export default UpdateProfileScreen;
