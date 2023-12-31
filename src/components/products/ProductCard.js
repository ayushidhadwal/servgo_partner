import React from 'react';
import {Card} from 'react-native-paper';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {URL} from '../../constant/base_url';
import Colors from '../../constant/Colors';
import i18next from 'i18next';

const RowItem = ({heading, value, headingStyles, valueStyles}) => {
  return (
    <View style={styles.rowStyles}>
      <Text style={[styles.heading, headingStyles]}>{heading} : </Text>
      <Text numberOfLines={3} style={[styles.value, valueStyles]}>
        {value}
      </Text>
    </View>
  );
};

export const ProductCard = ({
  index,
  item,
  navigation,
  onPressHandler,
  isLoading,
  value,
}) => {
  const {lang} = useSelector(state => state.lang);

  const onDelete = () => {
    Alert.alert('Please Confirm', 'Are you sure you want to delete this?', [
      {
        text: 'Yes',
        onPress: () => onPressHandler(item.id),
        style: 'destructive',
      },
      {text: 'Cancel'},
    ]);
  };

  return (
    <Card style={[styles.item, {marginTop: index === 0 ? 15 : 0}]}>
      <View style={styles.imgRow}>
        <Image
          source={{uri: URL + item.product_image1}}
          style={styles.imgStyles}
        />
        <View style={styles.productRowStyles}>
          <RowItem
            heading={i18next.t('langChange:product')}
            value={lang === 'en' ? item.title : item.title_Arabic}
          />
          <RowItem heading={i18next.t('langChange:category')}value={item.category_name} />
          <RowItem heading={i18next.t('langChange:subCategory')} value={item.sub_category_name} />
        </View>
        <Feather
          name="edit"
          size={24}
          color={Colors.primary}
          style={{alignSelf: 'flex-start', marginLeft: 5}}
          onPress={() =>
            navigation.navigate('EditProduct', {productId: item.id})
          }
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View style={{width: '95%'}}>
          <RowItem
            heading={i18next.t('langChange:description')}
            value={lang === 'en' ? item.description : item.arabic_description}
          />
          <RowItem
            heading={i18next.t('langChange:mrp')}
            value={item.currency + ' ' + item.MRP}
            valueStyles={{textDecorationLine: 'line-through', color: 'red'}}
          />
          <RowItem
            heading={i18next.t('langChange:discount')}
            value={item.currency + ' ' + item.discount}
          />
          <RowItem
            heading={i18next.t('langChange:sellingPrice')}
            value={item.currency + ' ' + item.Selling_Price}
            valueStyles={{color: 'green'}}
          />
          <RowItem
            heading={i18next.t('langChange:inventory')}
            value={item.inventory + ' ' + 'left'}
          />
        </View>
        {isLoading && value === item.id ? (
          <ActivityIndicator
            style={{alignSelf: 'flex-end'}}
            color={'#bb2f2f'}
            size={'small'}
          />
        ) : (
          <MaterialIcons
            name="delete"
            size={24}
            color={'#bb2f2f'}
            style={{alignSelf: 'flex-end'}}
            onPress={onDelete}
          />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 15,
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: Colors.white,
    width: '95%',
  },
  rowStyles: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  heading: {
    fontWeight: 'bold',
    color: Colors.primary,
    fontSize: 13,
    textAlign: 'left',
  },
  imgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  imgStyles: {
    width: '25%',
    height: 80,
    resizeMode: 'cover',
    borderWidth: 0.5,
    borderColor: '#cdcdcd',
  },
  value: {
    fontSize: 13,
    width: '80%',
    flexShrink: 1,
  },
  productRowStyles: {
    width: '65%',
    marginLeft: 8,
  },
});
