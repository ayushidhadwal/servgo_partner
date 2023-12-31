import React from 'react';
import {Button, Card} from 'react-native-paper';
import {StyleSheet, Text, View} from 'react-native';
import dayjs from 'dayjs';
import Colors from '../../constant/Colors';
import {useSelector} from 'react-redux';

const RowItem = ({heading, value}) => {
  return (
    <View style={[styles.rowStyles, {alignItems: 'center'}]}>
      <Text style={styles.heading}>{heading} : </Text>
      {heading === 'Order Type' ? (
        <View
          style={{
            backgroundColor:
              value === 'deliver' ? Colors.primary : Colors.darkYellow,
            padding: 5,
            borderRadius: 5,
          }}>
          <Text style={{color: 'white'}}>
            {value === 'deliver' ? 'Deliver' : 'Pickup'}
          </Text>
        </View>
      ) : (
        <Text numberOfLines={3} style={styles.value}>
          {value}
        </Text>
      )}
    </View>
  );
};

export const OrderCard = ({index, item, details, navigation}) => {
  const {settings} = useSelector(state => state.auth);

  return (
    <Card style={[styles.item, {marginTop: index === 0 ? 15 : 0}]}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <RowItem heading={'Order no.'} value={item.order_id} />
        {details && (
          <Text
            onPress={() =>
              navigation.navigate('PendingOrderDetail', {
                orderId: item.id,
                orderStatus: item.status,
                orderType: item.orderType,
              })
            }
            style={{
              color: Colors.primary,
              fontWeight: 'bold',
              textDecorationLine: 'underline',
            }}>
            Show More
          </Text>
        )}
      </View>
      <RowItem heading={'Customer Name'} value={item.userName} />
      <RowItem
        heading={'Price'}
        value={settings.currency + ' ' + item.price_paid}
      />
      <RowItem
        heading={'Date'}
        value={dayjs(item.created_at).format('DD MMM YYYY, hh:mm a')}
      />
      <RowItem heading={'Order Type'} value={item.orderType} />
    </Card>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
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
  value: {
    fontSize: 13,
    width: '55%',
    flexShrink: 1,
  },
});
