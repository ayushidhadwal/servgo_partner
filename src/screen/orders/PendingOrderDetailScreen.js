import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import DropDown from 'react-native-paper-dropdown';
import {showMessage} from 'react-native-flash-message';

import Colors from '../../constant/Colors';
import Loader from '../../components/Loader';
import {OrderDetailCard} from '../../components/order/OrderDetailCard';
import {useGetOrderDetails} from '../../hooks/order/useGetOrderDetails';
import {BASE_URL} from '../../constant/base_url';
import {useError} from '../../hooks/useError';
import {Subheading} from 'react-native-paper';

const PendingOrderDetailScreen = ({route}) => {
  const {orderId, orderStatus, orderType} = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deliveryGuys, setDeliveryGuys] = useState([]);
  const [deliveryBoy, setDeliveryBoy] = useState('');
  const [branch, setBranch] = useState('');
  const [showDropDown, setShowDropDown] = useState(false);

  const {orderDetails, loading} = useGetOrderDetails(orderId);

  const {branchList} = useSelector(state => state.branch);

  const setError = useError();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${BASE_URL}partner/assign-delivery-boy/${orderId}`,
        );
        const resData = await res.json();
        if (resData.status) {
          setDeliveryGuys([...resData.data]);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [orderId, setError]);

  const updateDeliveryBoy = async val => {
    try {
      setUpdateLoading(true);
      const fd = new FormData();
      fd.append('orderId', orderId);
      fd.append('deliveryBoy', val);

      const res = await fetch(`${BASE_URL}partner/update-delivery-boys`, {
        method: 'POST',
        body: fd,
      });
      const resData = await res.json();
      if (resData.status) {
        showMessage({
          type: 'success',
          message: 'Updated successfully.',
        });
      }
      setDeliveryBoy(val);
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const updatePickupBranch = async val => {
    try {
      setUpdateLoading(true);
      const fd = new FormData();
      fd.append('orderid', orderId);
      fd.append('pickupbranch', val);

      const res = await fetch(`${BASE_URL}partner/order-pickup-branch`, {
        method: 'POST',
        body: fd,
      });
      const resData = await res.json();
      if (resData.status) {
        showMessage({
          type: 'success',
          message: 'Updated successfully.',
        });
      }
      setBranch(val);
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading || isLoading) {
    return <Loader />;
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />

      <View style={{margin: 12}}>
        {orderType === 'deliver' ? (
          <View>
            <Text style={styles.heading}>Assign Delivery Boy</Text>
            {updateLoading ? (
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
                label={
                  orderDetails.deliveryAgent != null
                    ? orderDetails.deliveryBoy
                    : 'Assign Delivery Boy'
                }
                mode="outlined"
                visible={showDropDown}
                showDropDown={() => setShowDropDown(true)}
                onDismiss={() => setShowDropDown(false)}
                value={deliveryBoy}
                setValue={updateDeliveryBoy}
                list={deliveryGuys.map(deliveryGuy => ({
                  label: deliveryGuy.name,
                  value: String(deliveryGuy.id),
                }))}
              />
            )}
          </View>
        ) : (
          <>
            {orderDetails.pickUpAddressId > 0 ? (
              <>
                <Subheading style={{fontWeight: 'bold', color: Colors.primary}}>
                  PickUp Address
                </Subheading>
                <Text>{orderDetails.pickUpAddress} </Text>
              </>
            ) : (
              <>
                <Text style={styles.heading}>Select Pickup Branch</Text>
                {updateLoading ? (
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
                    label="Choose Pickup Branch"
                    mode="outlined"
                    visible={showDropDown}
                    showDropDown={() => setShowDropDown(true)}
                    onDismiss={() => setShowDropDown(false)}
                    value={branch}
                    setValue={updatePickupBranch}
                    list={branchList.map(item => ({
                      label: `${item.partner_address}, ${item.city_name}, ${item.country_name}`,
                      value: String(item.id),
                    }))}
                  />
                )}
              </>
            )}
          </>
        )}
      </View>

      <OrderDetailCard
        id={orderId}
        vatAmount={orderDetails.vatAmount}
        vatPercent={orderDetails.vatPercent}
        orderId={orderDetails.orderId}
        quantity={orderDetails.quantity}
        pricePaid={orderDetails.pricePaid}
        dummyPrice={orderDetails.dummyPrice}
        currency={orderDetails.currency}
        createdAt={orderDetails.createdAt}
        orderItems={orderDetails.orderItems}
        title={orderDetails.title}
        deliveryCharges={orderDetails.deliveryCharges}
        orderPrice={orderDetails.orderPrice}
        paymentStatus={orderDetails.paymentStatus}
        userName={orderDetails.userName}
        mobileNumber={orderDetails.mobileNumber}
        address={orderDetails.address}
        orderStatus={orderStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
  },
});

export default PendingOrderDetailScreen;
