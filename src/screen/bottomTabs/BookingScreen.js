import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, Card} from 'react-native-paper';
import i18n from 'i18next';

import * as requestAction from '../../store/actions/request';
import Colors from '../../constant/Colors';
import Loader from '../../components/Loader';
import {useError} from '../../hooks/useError';

const BookingScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  const {bookingList} = useSelector(state => state.request);
  console.log(bookingList);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.get_booking_list());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      {bookingList.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.activity}>Bookings are not confirmed yet !</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={bookingList}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            return (
              <Card
                style={[
                  styles.content,
                  index === 0 && {marginTop: RFValue(10)},
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: RFValue(8),
                    alignItems: 'flex-start',
                  }}>
                  <View style={[styles.row1, {flexShrink: 1, marginRight: 12}]}>
                    <Text style={styles.text1}>{item.client_name}</Text>
                  </View>
                  <Button
                    icon={'arrow-right'}
                    contentStyle={{flexDirection: 'row-reverse'}}
                    mode="outlined"
                    onPress={() => {
                      navigation.navigate('BookingStatus', {
                        booking_id: item.booking_id,
                        service_id:item.service_id,
                        child_service_id:item.child_service_id
                      });
                    }}>
                    {i18n.t('langChange:seeMore')}
                  </Button>
                </View>
                <View style={styles.row1}>
                  <Text style={styles.text2}>
                    <Text style={{fontWeight: 'bold'}}>
                      {i18n.t('langChange:bookingId')}:{' '}
                    </Text>
                    {item.booking_id}
                  </Text>
                </View>
                <View style={styles.row1}>
                  <Text style={styles.text2}>
                    <Text style={{fontWeight: 'bold'}}>
                      {i18n.t('langChange:time')}:{' '}
                    </Text>
                    {item.booking_time}
                  </Text>
                </View>

                <View style={[styles.row1, {marginTop: 12}]}>
                  <Text
                    style={
                      item.service_status === 'REJECTED'
                        ? styles.reject
                        : item.service_status === 'CANCELLED'
                        ? styles.cancel
                        : item.service_status === 'ACCEPTED'
                        ? styles.accept
                        : styles.completed
                    }>
                    {i18n.t('langChange:statusType')}: {item.service_status}
                  </Text>
                  <Text
                    style={[
                      styles.reject,
                      {
                        backgroundColor:
                          item.payment_status === 'FAILED'
                            ? 'red'
                            : item.payment_status === 'REFUND'
                            ? 'skyblue'
                            : item.payment_status === 'SUCCESS'
                            ? 'green'
                            : 'gray',
                      },
                    ]}>
                    {i18n.t('langChange:payment')}:{item.payment_status}
                  </Text>
                </View>
              </Card>
            );
          }}
        />
      )}
      <Button
        mode="contained"
        style={styles.btn}
        contentStyle={{flexDirection: 'row-reverse', height: 50}}
        icon="phone"
        onPress={() => navigation.navigate('help')}>
        {i18n.t('langChange:help')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heading: {
    fontWeight: 'bold',
  },
  iosHeading: {
    marginTop: RFValue(-10),
    fontWeight: 'bold',
  },
  btn: {
    width: '30%',
    borderRadius: RFValue(20),
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  content: {
    marginBottom: RFValue(10),
    marginHorizontal: RFValue(10),
    padding: RFValue(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text1: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
    paddingBottom: RFValue(5),
    paddingTop: RFValue(8),
  },
  service: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
    paddingTop: RFValue(8),
  },
  text2: {
    fontSize: RFValue(13),
    paddingBottom: RFValue(5),
    color: Colors.black,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pending: {
    fontSize: RFValue(13),
    color: Colors.primary,
  },
  cancel: {
    fontSize: RFValue(13),
    backgroundColor: Colors.darkYellow,
    color: Colors.white,
    padding: RFValue(5),
    textTransform: 'capitalize',
    borderRadius: RFValue(2),
  },
  accept: {
    fontSize: RFValue(13),
    backgroundColor: 'green',
    color: Colors.white,
    padding: RFValue(5),
    textTransform: 'capitalize',
    borderRadius: RFValue(2),
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reject: {
    fontSize: RFValue(13),
    backgroundColor: 'red',
    color: Colors.white,
    padding: RFValue(5),
    textTransform: 'capitalize',
    borderRadius: RFValue(2),
  },
  completed: {
    fontSize: RFValue(13),
    backgroundColor: Colors.primary,
    color: Colors.white,
    padding: RFValue(5),
    textTransform: 'capitalize',
    borderRadius: RFValue(2),
  },
  activity: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BookingScreen;
