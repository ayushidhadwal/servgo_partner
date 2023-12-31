import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, Switch, TextInput} from 'react-native-paper';
import i18n from 'i18next';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';

import {SearchableDropdown} from '../../components/SearchableDropdown';
import {useError} from '../../hooks/useError';
import * as branchAction from '../../store/actions/branch';
import Colors from '../../constant/Colors';
import * as authAction from '../../store/actions/auth';
import Loader from '../../components/Loader';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_API_KEY} from '../../constant/base_url';
import MapView, { Marker } from 'react-native-maps';

const EditBranchScreen = ({navigation, route}) => {
  const {countries, cities} = useSelector(state => state.auth);
  const {lang} = useSelector(state => state.lang);
  const item = route.params.item;

  const setError = useError();
  const dispatch = useDispatch();

  const [address, setAddress] = useState(item.partner_address);
  const [mobile, setMobile] = useState(0);
  const [phoneCode, setPhoneCode] = useState(0);
  const [cityId, setCityId] = useState(0);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [countryId, setCountryId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cityLoading, setCityLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [branchStatus, setBranchStatus] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(false);
  const [lat, setLat] = useState(37.78825);
  const [long, setLong] = useState(-122.4324);
  const [iOS2, setIOS2] = useState('');

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
        // setError(e.message);
        console.log(e.message);
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

  const onBranchSwitch = async () => {
    setError(null);
    try {
      await dispatch(branchAction.updateBranchStatus(item.id));
      setBranchStatus(!branchStatus);
    } catch (e) {
      setError(e.message);
    }
  };

  const onAvailabilitySwitch = async () => {
    setError(null);
    try {
      await dispatch(branchAction.updateAvailabilityStatus(item.id));
      setAvailabilityStatus(!availabilityStatus);
    } catch (e) {
      setError(e.message);
    }
  };


  useEffect(() => {
    setAddress(item.partner_address);
    setPhoneCode(item.partner_phonecode);
    setMobile(item.partner_mobile);
    setCountry(item.country_name);
    setCountryId(item.country_id);
    setCity(item.city_name);
    setCityId(item.city_id);
    setLat(Number(item.lat));
    setLong(Number(item.long));
    setAvailabilityStatus(item.available_status !== 0);
    setBranchStatus(item.branch_status !== 0);
    const a = countries.find(m => m.id === item.country_id);
    if (a) {
      setIOS2(a.iso2);
    }
  }, [countries, item, cities]);
  
  

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
        branchAction.UpdateBranch(
          phoneCode,
          mobile,
          address,
          countryId,
          cityId,
          item.id,
          lat,
          long,
        ),
      );
      Alert.alert('Important', 'Branch Updated Successfully.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (e) {
      setError(e.message);
    }
    setBtnLoading(false);
  }, [
    address,
    cityId,
    countryId,
    dispatch,
    item.id,
    mobile,
    navigation,
    phoneCode,
    setError,
    lat,
    long,
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
          getDefaultValue={item.partner_address}
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
        {/*<View style={styles.rowItem}>*/}
        {/*  <Text style={styles.title}>Branch Status</Text>*/}
        {/*  <Switch*/}
        {/*    value={branchStatus}*/}
        {/*    onValueChange={onBranchSwitch}*/}
        {/*    color={Colors.primary}*/}
        {/*  />*/}
        {/*</View>*/}
        <View style={styles.rowItem}>
          <Text style={styles.title}>Availability Status</Text>
          <Switch
            value={availabilityStatus}
            onValueChange={onAvailabilitySwitch}
            color={Colors.primary}
          />
        </View>
        {lat && long ?
            <View style={{marginTop:20}}>

              <MapView
                style={{ width: '100%', height: 170 }}
                region={{
                  latitude: lat,
                  longitude: long,
                  latitudeDelta: 0.006,
                  longitudeDelta: 0.006,
                }}
                provider={'google'}
                mapType="standard"
              >


                <Marker coordinate={{
                  latitude: lat,
                  longitude: long,
                }} />

              </MapView>
            </View>
            : null}

        <Button
          mode={'contained'}
          style={{
            marginVertical: 25,
            width: '60%',
            alignSelf: 'center',
            borderRadius: 100,
          }}
          onPress={onClickHandler}
          loading={btnLoading}
          disabled={btnLoading}
          contentStyle={{height: 50}}>
          Update
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
    textAlign: 'center',
    fontSize: 15,
    color: Colors.primary,
    fontWeight: 'bold',
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
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    width: '93%',
    alignSelf: 'center',
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

export default EditBranchScreen;
