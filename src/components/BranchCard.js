import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../constant/Colors';
import { useTranslation } from 'react-i18next';

const RowItem = ({heading, value}) => {
  return (
    <View style={styles.rowStyles}>
      <Text style={styles.heading}>{heading} : </Text>
      <Text numberOfLines={3} style={{fontSize: 13, width: '80%'}}>
        {value}
      </Text>
    </View>
  );
};


export const BranchCard = ({item, index, navigation}) => {

  const {t} = useTranslation('langChange')

  return (
    <Pressable
      onPress={() => navigation.navigate('EditBranch', {item: item})}
      style={[styles.cardContainer, {marginTop: index === 0 ? 15 : 0}]}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={styles.branchStatus}>
          <Text style={styles.heading}>{t('availabilityStatus')}: </Text>
          {item.available_status === 1 ? (
            <View style={styles.rowBranch}>
              <Feather name="check-circle" size={18} color="green" />
              <Text style={{paddingLeft: 5, color: 'green'}}>Active</Text>
            </View>
          ) : (
            <View style={styles.rowBranch}>
              <MaterialCommunityIcons
                name="close-octagon-outline"
                size={22}
                color="red"
            />
              <Text style={{paddingLeft: 5, color: 'red'}}>InActive</Text>
            </View>
          )}
        </View>
      </View>
      <RowItem
        heading={t('contactNo')}
        value={`${item.partner_phonecode} ${item.partner_mobile}`}
      />
      {item.license_number && (
        <RowItem heading={'Licence'} value={item.license_number} />
      )}
      <RowItem heading={t('address')} value={item.partner_address} />
      <RowItem heading={t('city')} value={item.city_name} />
      <RowItem heading={t('country')} value={item.country_name} />

      {item.start_date && item.expiry_date && (
        <RowItem heading={'Start Date'} value={item.start_date} />
      )}
      {item.start_date && item.expiry_date && (
        <RowItem heading={'Expire Date'} value={item.expiry_date} />
      )}

      {item.trade_license && (
        <View style={{}}>
          <Text
            style={[
              styles.heading,
              {
                marginBottom: 5,
              },
            ]}>
            Trade License
          </Text>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_1j5EelHEOtoLagpQtbwPZdrztpEQL0sJLA&usqp=CAU',
            }}
            style={styles.imgStyles}
            resizeMode={'cover'}
          />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    padding: 10,
    marginBottom: 20,
    marginHorizontal: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  rowBranch: {
    flexDirection: 'row',
    width: '50%',
    alignItems: 'center',
  },
  fabStyle: {
    bottom: 20,
    right: 15,
    position: 'absolute',
  },
  rowStyles: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: 5,
  },
  heading: {
    fontWeight: 'bold',
    color: Colors.primary,
    fontSize: 13,
    textAlign: 'left',
  },
  imgStyles: {
    width: 80,
    height: 80,
  },
  branchStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  imgContainer: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#cdcdcd',
  },
  partnerImgStyles: {
    width: '100%',
    height: '100%',
  },
});
