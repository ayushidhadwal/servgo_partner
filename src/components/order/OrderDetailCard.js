import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import dayjs from 'dayjs';
import DropDown from 'react-native-paper-dropdown';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../../constant/Colors';
import {useError} from '../../hooks/useError';
import * as orderActions from '../../store/actions/order';
import {showMessage} from 'react-native-flash-message';
import {Row, Rows, Table} from 'react-native-table-component';
import {RFValue} from 'react-native-responsive-fontsize';

const statusList = [
  {
    label: 'Pending',
    value: 'PENDING',
  },
  {
    label: 'Shipped',
    value: 'SHIPPED',
  },
  {
    label: 'Out for Delivery',
    value: 'DELIVER',
  },
  {
    label: 'Delivered',
    value: 'COMPLETE',
  },
];

export const OrderDetailCard = ({
  id,
  orderId,
  createdAt,
  currency,
  pricePaid,
  vatAmount,
  vatPercent,
  deliveryCharges,
  orderItems,
  paymentStatus,
  userName,
  address,
  mobileNumber,
  city,
  orderStatus,
}) => {
  const [status, setStatus] = useState(orderStatus);
  const [showDropDown, setShowDropDown] = useState(false);
  const [loading, setLoading] = useState(false);
  const {settings} = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const setError = useError();

  const branchStatusChange = async value => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(
        orderActions.updateOrderStatus({
          id: id,
          status: value,
        }),
      );
      showMessage({
        type: 'success',
        message: 'Updated successfully.',
      });
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const tableHead = ['Product Name', 'Price'];
  const tableData = orderItems?.map(m => [
    `${m.title}`,
    `${m.order_qty} X ${settings.currency} ${m.order_price}`,
  ]);

  return (
    <KeyboardAwareScrollView>
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          marginTop: 5,
        }}>
        <View style={styles.view1}>
          <Text style={styles.heading}>Order Id:</Text>
          <Text style={styles.value}>{orderId}</Text>
        </View>
        <View style={styles.view1}>
          <Text style={styles.heading}>Total Price:</Text>
          <Text style={styles.value}>
            {settings.currency}
            {pricePaid}
          </Text>
        </View>
        <View style={styles.view1}>
          <Text style={styles.heading}>Payment Status:</Text>
          <Text style={styles.value}>{paymentStatus}</Text>
        </View>
        <View style={styles.view1}>
          <Text style={styles.heading}>Created at:</Text>
          <Text style={styles.value}>
            {dayjs(createdAt).format('DD MMM YYYY, hh:mm a')}
          </Text>
        </View>
      </View>

      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          padding: 2,
          marginTop: 15,
        }}>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={tableData} textStyle={styles.textRows} />
          <Row
            data={[`Vat (${vatPercent}%)`, `${settings.currency} ${vatAmount}`]}
            style={styles.head}
            textStyle={styles.text}
          />
          <Row
            data={[
              'Delivery Charges',
              `${settings.currency} ${deliveryCharges}`,
            ]}
            style={styles.head}
            textStyle={styles.text}
          />
          <Row
            data={['Grand Total', `${settings.currency} ${pricePaid}`]}
            style={styles.head}
            textStyle={styles.text}
          />
        </Table>
      </View>

      <Text
        style={{
          fontWeight: 'bold',
          color: Colors.primary,
          fontSize: 15,
          textAlign: 'left',
          marginTop: 15,
          marginLeft: 8,
        }}>
        Billing Details
      </Text>
      <View style={{marginLeft: 8, flexDirection: 'row'}}>
        <Text>{userName}, </Text>
        <Text>{address}, </Text>
        <Text>{city}, </Text>
        <Text>{mobileNumber}</Text>
      </View>

      <Text
        style={{
          fontWeight: 'bold',
          color: Colors.primary,
          fontSize: 15,
          textAlign: 'left',
          marginVertical: RFValue(12),
          marginLeft: 8,
        }}>
        Update Status
      </Text>
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          marginBottom: RFValue(12),
        }}>
        {loading ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="small" style={{marginRight: 12}} />
            <Text>Updating please wait...</Text>
          </View>
        ) : (
          <DropDown
            label="Status"
            mode="outlined"
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={status}
            setValue={val => {
              setStatus(val);
              branchStatusChange(val);
            }}
            list={statusList}
            dropDownStyle={{
              height: '100%',
            }}
          />
        )}
      </View>
    </KeyboardAwareScrollView>
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
    fontSize: 15,
    textAlign: 'left',
  },
  value: {
    fontSize: 14,
    marginLeft: 5,
    marginTop: 2,
    fontWeight: 'bold',
  },
  view1: {flexDirection: 'row', marginTop: 3, justifyContent: 'space-between'},
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6, fontWeight: 'bold', textAlign: 'center'},
  textRows: {margin: 6, textAlign: 'center'},
});
