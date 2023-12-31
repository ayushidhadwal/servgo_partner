import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  I18nManager,
  Text,
  ActivityIndicator,
  ScrollView,
} from 'react-native';


import i18n from 'i18next';
import { Button, TextInput } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { SearchableDropdown } from '../../components/SearchableDropdown';
import Colors from '../../constant/Colors';
import * as authAction from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';
import { useError } from '../../hooks/useError';
import Loader from '../../components/Loader';
import * as branchAction from '../../store/actions/branch';
import { GOOGLE_API_KEY } from '../../constant/base_url';
import { successMessage } from '../../utils/success-message';
import MapView,{Marker} from 'react-native-maps';

const AddBranchScreen = ({ navigation }) => {
  const { countries, cities } = useSelector(state => state.auth);
  const { lang } = useSelector(state => state.lang);

  const dispatch = useDispatch();
  const setError = useError();

  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [phoneCode, setPhoneCode] = useState(0);
  const [cityId, setCityId] = useState(0);
  const [countryId, setCountryId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [iOS2, setIOS2] = useState('');



  const [pickupLocation, setPickupLocation] = useState({
    value: '',
    latitude: null,
    longitude: null,
  });




  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([dispatch(authAction.setCountries()), dispatch(userActions.set_Profile())])
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
        // setError(e.message);
      }
      setCityLoading(false);
    },
    [dispatch, setError],
  );

  useEffect(() => {
    if (countryId !== 0) {
      getCity(countryId);
    }
  }, [countryId, getCity]);

  const onSelectCity = value => {
    setCityId(value);
  };
  const onSelectCountry = value => {
    setCountryId(value);
    setCityId('');
  };

  useEffect(() => {
    if (countryId !== 0) {
      const item = countries.find(m => m.id === countryId);
      if (item) {
        setPhoneCode(item.phonecode);
        setIOS2(item.iso2);
      }
    }
  }, [countries, countryId]);

  const {partner} = useSelector((state)=>state.user)
  const countryCode = partner.country

  useEffect(() => {
    setCountryId(countryCode)
  }, [countryCode])

  const onClickHandler = useCallback(async () => {
    setBtnLoading(true);
    setError(null);
    try {
      await dispatch(
        branchAction.AddBranch(
          phoneCode,
          mobile,
          address,
          countryId,
          cityId,
          lat,
          long,
        ),
      );
      successMessage('Branch', 'New Branch Added Successfully.');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    }
    setBtnLoading(false);
  }, [
    setError,
    dispatch,
    phoneCode,
    mobile,
    address,
    countryId,
    cityId,
    lat,
    long,
    navigation,
  ]);

  const autoCompleteOnPress = (data, details = null) => {
    setAddress(data.description);
    setLat(details.geometry.location.lat);
    setLong(details.geometry.location.lng);
  };


  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        {/* <SearchableDropdown
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
        /> */}
        {!cityLoading ? (
          <SearchableDropdown
            isDisabled={false}
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
          <View style={styles.loader}>
            <ActivityIndicator animating={true} color={Colors.primary} />
            <Text>Loading...</Text>
          </View>
        )}
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
          onFail={error => console.error(error)}
          query={{
            key: GOOGLE_API_KEY,
            language: lang,
            components: `country:${iOS2}`,
          }}
          styles={styles.mapMarker}
          debounce={200}
          textInputProps={{
            InputComp: TextInput,
            onChangeText: text => {
              setAddress(text);
              setLat('');
              setLong('');
            },
            value: address,
            onBlur: () => {
              if (!lat || !long) {
                setAddress('');
              }
            },
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






        <View style={styles.contact}>
          <TextInput
            left={<TextInput.Icon name="phone" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={i18n.t('langChange:code')}
            style={styles.code}
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

        <View style={{marginTop:20}}>
            <MapView
              style={{ width: '100%', height: 170 }}
              region={{
                latitude: lat ? lat : 37.78825,
                longitude: long ? long : -122.4324,
                latitudeDelta: 0.006,
                longitudeDelta: 0.006,
              }}
              provider={'google'}
              mapType="standard"
            >
              <Marker coordinate={{
                latitude: lat ? lat : 37.78825,
                longitude: long ? long : -122.4324,
              }} />              
            </MapView>
          </View>



        <Button
          mode={'contained'}
          style={{
            marginVertical: 25,
            width: '60%',
            alignSelf: 'center',
          }}
          onPress={onClickHandler}
          loading={btnLoading}
          disabled={btnLoading}
          contentStyle={{ height: 50 }}>
          Add Branch
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  contact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: RFValue(10),
  },
  input: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  number: {
    width: '55%',
    backgroundColor: Colors.white,
  },
  code: {
    backgroundColor: Colors.white,
    width: '40%',
  },
  imgContainer: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: '#cdcdcd',
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: RFValue(10),
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
  imgStyles: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  uploadIcon: {
    padding: 5,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    position: 'absolute',
    bottom: 0,
    right: 0,
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

export default AddBranchScreen;
