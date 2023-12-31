import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Colors from '../../constant/Colors';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import i18next from 'i18next';

const RowItem = ({heading, value}) => {
  return (
    <View style={styles.rowStyles}>
      <Text style={styles.heading}>{heading} : </Text>
      <Text numberOfLines={3} style={styles.text}>
        {value}
      </Text>
    </View>
  );
};

export const DeliveryCard = ({item, index, navigation, onPressHandler}) => {
  return (
    <Pressable
      style={[styles.cardContainer, {marginTop: index === 0 ? 15 : 0}]}>
      <View style={styles.editview}>
        <RowItem heading={'Name'} value={item.name} />
        <Feather
          name="edit"
          size={22}
          color={Colors.primary}
          style={{alignSelf: 'flex-start'}}
          onPress={() =>
            navigation.navigate('EditDelivery', {
              id: item.id,
            })
          }
        />
      </View>

      <RowItem
        heading={i18next.t('langChange:contactNo')}
        value={item.phone_code + ' ' + item.mobile}
      />
      <RowItem heading={i18next.t('langChange:email')} value={item.email} />
      <RowItem heading={i18next.t('langChange:address')} value={item.address} />
      <RowItem heading={i18next.t('langChange:country')} value={item.country_name} />
      <View style={{flexDirection: 'row'}}>
        <RowItem heading={i18next.t('langChange:city')} value={item.city_name} />
        <MaterialIcons
          name="delete"
          size={24}
          color={'#bb2f2f'}
          style={{marginLeft: 10}}
          onPress={() => onPressHandler(item.id)}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    borderRadius: 10,
    width: '92%',
    alignSelf: 'center',
  },
  rowStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  heading: {
    fontWeight: 'bold',
    color: Colors.primary,
    fontSize: 13,
    textAlign: 'left',
  },
  editview: {flexDirection: 'row'},
  text: {fontSize: 13, width: '80%'},
});
