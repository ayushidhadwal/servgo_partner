import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Text, FlatList, StyleSheet, Alert} from 'react-native';
import {Button, Card} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import {
  endConnection,
  finishTransaction,
  getProducts,
  initConnection,
  requestPurchase,
} from 'react-native-iap';

import Colors from '../../constant/Colors';
import * as userActions from '../../store/actions/user';
import {useError} from '../../hooks/useError';
import Loader from '../../components/Loader';
import {myIosSubscriptionPay} from '../../store/actions/user';

const skus = ['Basic2023', 'Premium2023', 'PremiumPlus2023', 'Standard2023']

const AllPlanIOSScreen = ({navigation}) => {
  const {myProductId} = useSelector(state => state.user);

  const [loading, setLoading] = useState(null);
  const [purchasing, setPurchasing] = useState(null);
  const [list, setList] = useState([]);

  const [productId, setProductId] = useState('FREE');

  const setError = useError();
  const dispatch = useDispatch();

  useEffect(() => {
    if (myProductId) {
      setProductId(myProductId)
    }
  }, [myProductId])

  const getSubscribedPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(userActions.getMySubscribedPlan());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [dispatch, setError]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getSubscribedPlan);

    return unsubscribe;
  }, [getSubscribedPlan, navigation, setError]);

  useEffect(() => {
    (async () => {
      await initConnection();

      const result = await getProducts({skus: skus});
      setList(result)
    })();

    return endConnection;
  }, []);

  const requestSubscription = useCallback(
    async sku => {

      try {
        setPurchasing(sku);
        const purchase = await requestPurchase({
          sku: sku,
          andDangerouslyFinishTransactionAutomaticallyIOS: false,
        });

        await finishTransaction({
          purchase: purchase,
          isConsumable: false,
          developerPayloadAndroid: undefined,
        });

        const {
          transactionId,
          productId: iosProductId,
          transactionReceipt,
        } = purchase;
        await dispatch(
          myIosSubscriptionPay({
            transactionId,
            productId: iosProductId,
            transactionReceipt,
          }),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setPurchasing('');
      }
    },
    [dispatch, setError],
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.screen}>
      <FlatList
        data={list}
        keyExtractor={item => String(item.title)}
        ListHeaderComponent={() => (
          <View
            style={[
              styles.container,
              {
                borderColor:
                  productId.toUpperCase() === 'FREE'
                    ? Colors.primary
                    : Colors.grey,
                backgroundColor:
                  productId.toUpperCase() === 'FREE' ? '#dae6ed' : Colors.white,
              },
            ]}>
            <Text style={styles.planName}>Basic</Text>
            <View style={styles.cardContainer}>
              <View style={styles.details}>
                <Text style={styles.amt}>FREE</Text>
                <Text style={styles.bookings} numberOfLines={2}>
                  5 Bookings/Month (1 Month)
                </Text>
              </View>

              <Button mode="contained" style={styles.btn} disabled>
                {productId.toUpperCase() === 'FREE' ? 'Subscribed' : 'FREE'}
              </Button>
            </View>
          </View>
        )}
        renderItem={({item}) => (
          <Card
            style={[
              styles.container,
              {
                borderColor:
                  productId === item.productId ? Colors.primary : Colors.grey,
                backgroundColor:
                  productId === item.productId ? '#dae6ed' : Colors.white,
              },
            ]}>
            <Text style={styles.planName}>{item.title}</Text>
            <View style={styles.cardContainer}>
              <View style={styles.details}>
                <Text style={styles.amt}>{item.localizedPrice}</Text>
                <Text style={styles.bookings} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
              <Button
                mode="contained"
                style={styles.btn}
                loading={purchasing === item.productId}
                disabled={
                  productId === item.productId || purchasing === item.productId
                }
                onPress={() =>
                  Alert.alert(
                    'Alert',
                    `By clicking OK, your Previous Subscription will be replaced by the ${item.title}`,
                    [
                      {
                        text: 'Cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => requestSubscription(item.productId),
                      },
                    ],
                  )
                }>
                {productId === item.productId
                  ? 'Subscribed'
                  : purchasing === item.productId
                  ? 'Purchasing'
                  : 'Subscribe'}
              </Button>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 12
  },
  container: {
    marginBottom: 12,
    borderRadius: 4,
    borderWidth: 0.5,
    paddingVertical: 12
  },
  selected: {
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: '#dae6ed',
  },
  planName: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: RFValue(16),
    textAlign: 'center',
    marginVertical: RFValue(5),
  },
  amt: {
    fontSize: RFValue(13),
    fontWeight: 'bold',
  },
  bookings: {
    marginTop: 6,
    fontSize: RFValue(12),
    flexShrink: 1,
    marginRight: 12
  },
  btn: {marginVertical: RFValue(10)},
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: RFValue(10),
  },
  details: {
    alignItems: 'flex-start',
    flexShrink: 1,
  },
});

export default AllPlanIOSScreen;
