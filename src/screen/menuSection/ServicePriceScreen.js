import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  I18nManager,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import {Button, TextInput, Switch} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import i18n from 'i18next';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';

import Colors from '../../constant/Colors';
import * as requestAction from '../../store/actions/request';
import {useError} from '../../hooks/useError';
import {SearchableDropdown} from '../../components/SearchableDropdown';
import Loader from '../../components/Loader';
import {
  getChildCategoryBySubService,
  getSelectedService,
  getSubServiceByService,
  updateServiceStatus,
} from '../../store/actions/request';
import {successMessage} from '../../utils/success-message';
import {IMG_URL} from '../../constant/base_url';

const ServicePriceScreen = ({route, navigation}) => {
  const {item} = route.params;

  const dispatch = useDispatch();
  const setError = useError();

  const {selectService, subServiceList, childServiceList} = useSelector(
    state => state.request,
  );

  const {lang} = useSelector(state => state.lang);

  const [serviceId, setServiceId] = useState(Number(item.service_name));
  const [subServiceId, setSubServiceId] = useState(
    Number(item.subservice_name),
  );
  const [childServiceId, setChildServiceId] = useState(
    Number(item.child_service_id),
  );
  const [price, setPrice] = useState(item.service_price);
  const [minimumPrice, setMinimumPrice] = useState(item.order_amount);
  const [desc, setDesc] = useState(item.service_desc);
  const [image, setImage] = useState(null);
  const [isSwitchOn, setIsSwitchOn] = React.useState(Number(item.status) === 1);

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [childServiceLoading, setChildServiceLoading] = useState(false);
  const [subServiceLoading, setSubServiceLoading] = useState(false);

  const onToggleSwitch = async () => {
    await dispatch(updateServiceStatus(item.id));
    setIsSwitchOn(!isSwitchOn);
  };

  const onSelectService = async val => setServiceId(val);

  const onSelectSubService = async val => setSubServiceId(val);

  const onSelectChildService = val => setChildServiceId(val);

  useEffect(() => {
    (async () => {
      setSubServiceLoading(true);
      setError(null);
      try {
        await dispatch(getSubServiceByService(serviceId));
      } catch (e) {
        setError(e.message);
      } finally {
        setSubServiceLoading(false);
      }
    })();
  }, [dispatch, serviceId, setError]);

  useEffect(() => {
    if (serviceId && subServiceId) {
      (async () => {
        setChildServiceLoading(true);
        setError(null);
        try {
          await dispatch(getChildCategoryBySubService(serviceId, subServiceId));
        } catch (e) {
          setError(e.message);
        } finally {
          setChildServiceLoading(false);
        }
      })();
    }
  }, [dispatch, serviceId, setError, subServiceId]);

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

  const onSubmit = async () => {
    setBtnLoading(true);
    setError(null);

    try {
      await dispatch(
        requestAction.updateServicePrice({
          id: item.id,
          serviceId: serviceId,
          subServiceId: subServiceId,
          childServiceId: childServiceId,
          price: price,
          minimumOrderAmount: minimumPrice,
          desc: desc,
          image: image,
        }),
      );
      setBtnLoading(false);
      successMessage('Success', 'Successfully Updated!');
    } catch (e) {
      setError(e.message);
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imgContainer}>
          <Image
            source={{
              uri: image?.uri
                ? image?.uri
                : item.image_path
                ? IMG_URL + item.image_path
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
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={i18n.t('langChange:addPrice')}
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          keyboardType="number-pad"
          left={<TextInput.Icon name={'offer'} color={Colors.primary} />}
        />
        <TextInput
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label="Minimum price"
          value={minimumPrice}
          onChangeText={setMinimumPrice}
          style={styles.input}
          keyboardType="number-pad"
          left={<TextInput.Icon name={'offer'} color={Colors.primary} />}
        />
        <TextInput
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={i18n.t('langChange:addDesc')}
          value={desc}
          onChangeText={setDesc}
          style={styles.input}
          left={<TextInput.Icon name={'information'} color={Colors.primary} />}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: RFValue(10),
            width: '93%',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: 15,
              paddingTop: RFValue(6),
              fontWeight: 'bold',
              color: Colors.primary,
            }}>
            {i18n.t('langChange:changeStatus')}
          </Text>
          <Switch
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
            color={Colors.primary}
          />
        </View>
        <Button
          mode="contained"
          contentStyle={{height: 50}}
          style={styles.btn}
          onPress={onSubmit}
          loading={btnLoading}
          disabled={btnLoading}>
          {i18n.t('langChange:updBtn')}
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(12),
    backgroundColor: Colors.white,
  },
  input: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  btn: {
    width: '50%',
    alignSelf: 'center',
    marginVertical: RFValue(20),
    borderRadius: RFValue(50),
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
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

export default ServicePriceScreen;
