import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  I18nManager,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import i18n from 'i18next';

import Colors from '../../constant/Colors';
import {SearchableDropdown} from '../../components/SearchableDropdown';
import Loader from '../../components/Loader';
import {useError} from '../../hooks/useError';
import {successMessage} from '../../utils/success-message';
import {
  addServicePricing,
  getChildCategoryBySubService,
  getSelectedService,
  getSubServiceByService,
} from '../../store/actions/request';

const AddServiceScreen = ({navigation}) => {
  const {selectService, subServiceList, childServiceList} = useSelector(
    state => state.request,
  );
  const {lang} = useSelector(state => state.lang);

  const [serviceId, setServiceId] = useState('');
  const [subServiceId, setSubServiceId] = useState('');
  const [childServiceId, setChildServiceId] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [subServiceLoading, setSubServiceLoading] = useState(false);
  const [childServiceLoading, setChildServiceLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(getSelectedService());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const onclickHandler = async () => {
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(servicePrice)) {
      setError('Price must be Number');
      return;
    }

    setBtnLoading(true);
    setError(null);
    try {
      await dispatch(
        addServicePricing({
          serviceId: serviceId,
          subServiceId: subServiceId,
          childServiceId: childServiceId,
          servicePrice: servicePrice,
          minimumOrderAmount: minAmount,
          image: image,
          serviceDesc: serviceDesc,
        }),
      );
      successMessage('Success', 'Added Successfully');
      setBtnLoading(false);
      navigation.goBack();
    } catch (e) {
      setBtnLoading(false);
      setError(e.message);
    }
  };

  const onSelectService = async val => {
    setServiceId(val);
    setSubServiceLoading(true);
    setError(null);
    try {
      await dispatch(getSubServiceByService(val));
    } catch (e) {
      setError(e.message);
    } finally {
      setSubServiceLoading(false);
    }
  };

  const onSelectSubService = async val => {
    setSubServiceId(val);
    setChildServiceLoading(true);
    setError(null);
    try {
      await dispatch(getChildCategoryBySubService(serviceId, val));
    } catch (e) {
      setError(e.message);
    } finally {
      setChildServiceLoading(false);
    }
  };

  const onSelectChildService = val => setChildServiceId(val);

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

  const _uploadImageHandler = async () => {
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
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imgContainer}>
          <Image
            source={{
              uri: image?.uri
                ? image.uri
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHnPmUvFLjjmoYWAbLTEmLLIRCPpV_OgxCVA&usqp=CAU',
            }}
            style={styles.imgStyles}
            resizeMode={'cover'}
          />
          <Pressable onPress={_pickImageHandler} style={styles.uploadIcon}>
            <Entypo name={'edit'} size={15} color={Colors.white} />
          </Pressable>
        </View>

        <SearchableDropdown
          label={i18n.t('langChange:selectService')}
          data={selectService.map(m => ({
            name: lang === 'en' ? m.en_service_name : m.ar_service_name,
            key: m.id,
            value: m.service_id,
          }))}
          selectedValue={serviceId}
          onSelectValue={onSelectService}
          leftIcon={
            <TextInput.Icon
              name={'format-list-bulleted'}
              color={Colors.primary}
            />
          }
        />
        {subServiceLoading ? (
          <Loader />
        ) : (
          <SearchableDropdown
            label={i18n.t('langChange:selectSubCategory')}
            data={subServiceList.map(m => ({
              name:
                lang === 'en' ? m.en_subcategory_name : m.ar_subcategory_name,
              key: m.id,
              value: m.id,
            }))}
            selectedValue={subServiceId}
            onSelectValue={onSelectSubService}
            leftIcon={
              <TextInput.Icon
                name={'format-list-text'}
                color={Colors.primary}
              />
            }
          />
        )}

        {childServiceLoading ? (
          <Loader />
        ) : (
          <SearchableDropdown
            label={i18n.t('langChange:selectChildCategory')}
            data={childServiceList.map(m => ({
              name:
                lang === 'en'
                  ? m.en_child_category_name
                  : m.ar_child_category_name,
              key: m.id,
              value: m.id,
            }))}
            selectedValue={childServiceId}
            onSelectValue={onSelectChildService}
            leftIcon={
              <TextInput.Icon
                name={'format-list-checks'}
                color={Colors.primary}
              />
            }
          />
        )}
        <TextInput
          label={i18n.t('langChange:priceOffered')}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          style={styles.input}
          value={servicePrice}
          onChangeText={text => setServicePrice(text)}
          keyboardType="numeric"
          left={<TextInput.Icon name={'offer'} color={Colors.primary} />}
        />
        <TextInput
          label="Minimum amount"
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          style={styles.input}
          value={minAmount}
          onChangeText={setMinAmount}
          keyboardType="numeric"
          left={<TextInput.Icon name={'offer'} color={Colors.primary} />}
        />
        <TextInput
          label={i18n.t('langChange:descService')}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          style={styles.input}
          value={serviceDesc}
          onChangeText={text => setServiceDesc(text)}
          left={<TextInput.Icon name={'information'} color={Colors.primary} />}
        />
        <Button
          mode="outlined"
          icon="check"
          onPress={onclickHandler}
          style={{
            alignSelf: 'center',
            marginVertical: RFValue(25),
          }}
          loading={btnLoading}
          disabled={btnLoading}>
          {i18n.t('langChange:saveBtn')}
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(10),
    justifyContent: 'space-between',
  },
  input: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  chipStyle: {
    marginVertical: RFValue(20),
    alignSelf: 'center',
    height: RFValue(15),
  },
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
  pickerStyle1: {
    height: RFValue(56),
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
    width: '95%',
    alignSelf: 'center',
  },
  pickerStyle2: {
    height: RFValue(56),
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
    width: '95%',
    alignSelf: 'center',
    marginTop: RFValue(-15),
  },

  //

  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  imgContainer: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 15,
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
});

export default AddServiceScreen;
