import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Card} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import i18n from 'i18next';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';
import * as userActions from '../../store/actions/user';
import Colors from '../../constant/Colors';
import Loader from '../../components/Loader';
import {useError} from '../../hooks/useError';
import {payForPlan} from '../../store/actions/user';
import {successMessage} from '../../utils/success-message';
import {BASE_URL} from '../../constant/base_url';

const AllPlanScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [noError, setNoError] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  const {myPlans} = useSelector(state => state.user);
  const {settings} = useSelector(state => state.auth);
  const {partner} = useSelector(state => state.user);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.getmyPlans(settings.currency));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError, settings.currency]);

  // Purchase free subscription
  const onClickHandler = useCallback(
    async planId => {
      setIsLoading(true);
      setError(null);
      try {
        await dispatch(userActions.getFreePlan(planId));
        navigation.goBack();
      } catch (e) {
        setError(e.message);
      }
      setIsLoading(false);
    },
    [dispatch, navigation, setError],
  );

  // Purchase Plan
  const getStripeKeysAndPurchasePlan = async (planId, amount) => {
    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append('amount', amount);
      fd.append('currency', settings.currency);

      const response = await fetch(
        `${BASE_URL}partner/subscription-plan-paid`,
        {
          method: 'POST',
          body: fd,
        },
      );

      const result = await response.json();
      const {
        data: {paymentIntent, ephemeralKey, customer},
      } = result;

      const {error} = await initPaymentSheet({
        merchantDisplayName: 'Servgo',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: partner.firstname,
          address: {country: settings.country},
        },
      });

      if (!error) {
        const {error: err} = await presentPaymentSheet();

        if (!err) {
          await dispatch(payForPlan(planId, amount, settings.currency));
          successMessage('Purchased successfully.');
          navigation.goBack();
        } else {
          setError(err);
        }
      } else {
        setError('Unable to launch payment gateway.');
      }
    } catch (e) {
      setNoError(false);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={myPlans}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <Card
            style={[
              styles.container,
              item.subscribed === 1 && styles.selected,
            ]}>
            <Text style={styles.planName}>{item.plan_name}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: RFValue(10),
              }}>
              <View>
                <Text style={styles.amt}>
                  {item.amount !== 0
                    ? item.currency +
                      ' ' +
                      item.amount +
                      '  (' +
                      item.plan_term +
                      ')'
                    : i18n.t('langChange:free')}
                </Text>
                <Text style={styles.bookings}>
                  {item.booking + '  ' + i18n.t('langChange:bookPerDay')}
                </Text>
              </View>
              <Button
                mode="contained"
                style={styles.btn}
                loading={item.free === 1 && isLoading}
                disabled={
                  (item.free === 1 && isLoading) || item.subscribed === 1
                }
                onPress={() => {
                  item.free === 1
                    ? onClickHandler(item.id)
                    : getStripeKeysAndPurchasePlan(item.id, item.amount);
                }}>
                {item.subscribed === 0
                  ? i18n.t('langChange:subBtn')
                  : i18n.t('langChange:subscribedBtn')}
              </Button>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
};
export default AllPlanScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    margin: RFValue(10),
    borderRadius: RFValue(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderWidth: 2,
    borderColor: Colors.grey,
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
  },
  bookings: {
    textAlign: 'center',
    fontSize: RFValue(13),
  },
  btn: {marginVertical: RFValue(10)},
});
