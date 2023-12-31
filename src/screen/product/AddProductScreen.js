import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  Text,
  View,
  StyleSheet,
  Pressable,
  Platform,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {Button, TextInput} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';

import Loader from '../../components/Loader';
import Colors from '../../constant/Colors';
import {SearchableDropdown} from '../../components/SearchableDropdown';
import {useGetCategoryList} from '../../hooks/category/useGetCategoryList';
import {useError} from '../../hooks/useError';
import {successMessage} from '../../utils/success-message';
import {getSubCategoryList} from '../../store/actions/category';
import {addProduct} from '../../store/actions/product';

const AddProductScreen = ({navigation}) => {
  const {lang} = useSelector(state => state.lang);
  const {subCategoryList} = useSelector(state => state.category);

  const {CategoryList, loading} = useGetCategoryList();

  const setError = useError();
  const dispatch = useDispatch();

  const [productTitle, setProductTitle] = useState('');
  const [arabicTitle, setArabicTitle] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [mrp, setMRP] = useState('');
  const [inventory, setInventory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [discount, setDiscount] = useState('');
  const [desc, setDesc] = useState('');
  const [arabicDesc, setArabicDesc] = useState('');
  const [productImg1, setProductImg1] = useState(null);
  const [productImg2, setProductImg2] = useState(null);
  const [productImg3, setProductImg3] = useState(null);
  const [productImg4, setProductImg4] = useState(null);

  const [cateLoading, setCateLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (categoryId) {
      (async () => {
        setCateLoading(true);
        setError(null);

        try {
          await dispatch(getSubCategoryList(categoryId));
        } catch (e) {
          setError(e.message);
        }

        setCateLoading(false);
      })();
    }
  }, [categoryId, dispatch, setError]);

  const onSelectCategory = value => {
    setCategoryId(value);
    setSubCategoryId('');
  };

  const onSelectSubCategory = value => setSubCategoryId(value);

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
        setProductImg1(img);
      } else if (image === 'image2') {
        setProductImg2(img);
      } else if (image === 'image3') {
        setProductImg3(img);
      } else {
        setProductImg4(img);
      }
    }
  };

  const onPressHandler = async () => {
    setError(null);
    setBtnLoading(true);
    try {
      await dispatch(
        addProduct(
          productTitle,
          arabicTitle,
          categoryId,
          subCategoryId,
          inventory,
          mrp,
          sellingPrice,
          discount,
          desc,
          arabicDesc,
          productImg1,
          productImg2,
          productImg3,
          productImg4,
        ),
      );

      successMessage('Products', 'Product Added Successfully');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    }

    setBtnLoading(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <TextInput
          left={<TextInput.Icon name="subtitles" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={'Product Title'}
          style={styles.input}
          value={productTitle}
          onChangeText={setProductTitle}
        />
        <TextInput
          left={
            <TextInput.Icon name="subtitles-outline" color={Colors.primary} />
          }
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={'Arabic Title'}
          style={styles.input}
          value={arabicTitle}
          onChangeText={setArabicTitle}
        />
        <SearchableDropdown
          label={'Select Category'}
          data={CategoryList.map(m => ({
            name: lang === 'en' ? m.en_category_name : m.ar_category_name,
            key: m.id,
            value: m.id,
          }))}
          selectedValue={categoryId}
          onSelectValue={onSelectCategory}
          leftIcon={
            <TextInput.Icon
              name={'format-list-checkbox'}
              color={Colors.primary}
            />
          }
        />
        {cateLoading ? (
          <Loader />
        ) : (
          <SearchableDropdown
            label={'Select Sub-Category'}
            data={subCategoryList.map(m => ({
              name:
                lang === 'en' ? m.en_sub_category_name : m.ar_sub_category_name,
              key: m.id,
              value: m.id,
            }))}
            selectedValue={subCategoryId}
            onSelectValue={onSelectSubCategory}
            leftIcon={
              <TextInput.Icon
                name={'format-list-checks'}
                color={Colors.primary}
              />
            }
          />
        )}
        <TextInput
          left={
            <TextInput.Icon
              name="order-bool-descending-variant"
              color={Colors.primary}
            />
          }
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={'Inventory'}
          style={styles.input}
          value={inventory}
          onChangeText={setInventory}
          keyboardType={'number-pad'}
        />
        <TextInput
          left={<TextInput.Icon name="tag-outline" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={'MRP'}
          style={styles.input}
          value={mrp}
          onChangeText={setMRP}
          keyboardType={'number-pad'}
        />
        <TextInput
          left={<TextInput.Icon name="alert-octagram" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={'Discount'}
          style={styles.input}
          value={discount}
          onChangeText={setDiscount}
        />
        <TextInput
          left={<TextInput.Icon name="tag" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={'Selling Price'}
          style={styles.input}
          value={sellingPrice}
          onChangeText={setSellingPrice}
          keyboardType={'number-pad'}
        />
        <TextInput
          left={<TextInput.Icon name="note-text" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={'Product Description'}
          style={styles.input}
          value={desc}
          onChangeText={setDesc}
          multiline
        />
        <TextInput
          left={
            <TextInput.Icon name="note-text-outline" color={Colors.primary} />
          }
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={'Arabic Description'}
          style={styles.input}
          value={arabicDesc}
          onChangeText={setArabicDesc}
          multiline
        />
        <Text style={styles.addProduct}>Add Product Images</Text>
        <View style={styles.rowStyles}>
          <Pressable
            style={styles.imgBox}
            onPress={() => _pickImageHandler('image1')}>
            {productImg1?.uri ? (
              <Image
                source={{uri: productImg1?.uri}}
                style={styles.imgStyles}
              />
            ) : (
              <MaterialIcons name="add-a-photo" size={24} color="#cdcdcd" />
            )}
          </Pressable>
          <Pressable
            style={styles.imgBox}
            onPress={() => _pickImageHandler('image2')}>
            {productImg2?.uri ? (
              <Image
                source={{uri: productImg2?.uri}}
                style={styles.imgStyles}
              />
            ) : (
              <MaterialIcons name="add-a-photo" size={24} color="#cdcdcd" />
            )}
          </Pressable>
          <Pressable
            style={styles.imgBox}
            onPress={() => _pickImageHandler('image3')}>
            {productImg3?.uri ? (
              <Image
                source={{uri: productImg3?.uri}}
                style={styles.imgStyles}
              />
            ) : (
              <MaterialIcons name="add-a-photo" size={24} color="#cdcdcd" />
            )}
          </Pressable>
          <Pressable
            style={styles.imgBox}
            onPress={() => _pickImageHandler('image4')}>
            {productImg4?.uri ? (
              <Image
                source={{uri: productImg4?.uri}}
                style={styles.imgStyles}
              />
            ) : (
              <MaterialIcons name="add-a-photo" size={24} color="#cdcdcd" />
            )}
          </Pressable>
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.white,
  },
  input: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  addProduct: {
    marginTop: 15,
    color: Colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  rowStyles: {
    marginVertical: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imgBox: {
    width: 100,
    height: 100,
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
  imgStyles: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default AddProductScreen;
