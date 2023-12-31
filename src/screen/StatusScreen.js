import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Table, Row, Rows} from 'react-native-table-component';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import i18n from 'i18next';

import Loader from '../components/Loader';
import {useError} from '../hooks/useError';
import {NotFound} from '../components/NotFound';
import {getBookingDetails} from '../store/actions/request';

const TextRow = ({heading, text, color}) => (
  <Text style={styles.headingStyles}>
    {heading}:{' '}
    <Text style={{fontWeight: 'normal', color: color ? color : 'black'}}>
      {text}
    </Text>
  </Text>
);

const StatusScreen = ({route}) => {
  const {booking_id,service_id,child_service_id} = route.params;

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const setError = useError();
  const {settings} = useSelector(state => state.auth);
  const {getDetailsOfBooking} = useSelector(state => state.request);
  const {lang} = useSelector(state => state.lang);

  const tableHead = [
    i18n.t('langChange:serviceTable'),
    i18n.t('langChange:priceTable'),
    i18n.t('langChange:qtyTable'),
    i18n.t('langChange:totalTable'),
  ];

  const tableData = getDetailsOfBooking?.serviceDetails?.map(m => {
    const service = `${m[`${lang}_service_name`]}, ${
      m[`${lang}_subcategory_name`]
    }, ${m[`${lang}_child_category_name`]},\n(${m.service_desc})`;

    const price = `${settings.currency} ${m.st_service_price}`;
    const qty = Number(m.st_qty);
    const total = (Number(m.st_service_price) * qty).toFixed(2);
    const totalPrice = `${settings.currency} ${total}`;

    return [service, price, qty, totalPrice];
  });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(getBookingDetails(booking_id,service_id,child_service_id));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    };

    fetchBookingDetails();
  }, [booking_id, dispatch, setError]);

  if (loading) {
    return <Loader />;
  }

  if (!getDetailsOfBooking?.booking_details) {
    return <NotFound />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.headingStyles,
            {
              fontSize: RFValue(18),
              textAlign: 'center',
              marginBottom: RFValue(10),
            },
          ]}>
          {i18n.t('langChange:statusScreen')}
        </Text>
        <View style={styles.cardContainer1}>
          <TextRow
            heading={i18n.t('langChange:statusBookId')}
            text={booking_id}
          />
          <TextRow
            heading={i18n.t('langChange:statusBookDate')}
            text={dayjs(
              getDetailsOfBooking.booking_details.booking_date,
            ).format('DD MMM YYYY')}
          />
          <TextRow
            heading={i18n.t('langChange:statusBookTime')}
            text={getDetailsOfBooking.booking_details.booking_time}
          />
          <TextRow
            heading={i18n.t('langChange:statusCustName')}
            text={getDetailsOfBooking.booking_details.user_name}
          />

          <TextRow
            heading={i18n.t('langChange:statusType')}
            text={getDetailsOfBooking.booking_details.status}
          />
          <TextRow
            heading={i18n.t('langChange:statusPayment')}
            text={getDetailsOfBooking.booking_details.payment_status}
          />
          <TextRow
            heading={i18n.t('langChange:statusFees')}
            text={
              `${settings.currency} ` +
              getDetailsOfBooking.booking_details.final_service_price
            }
          />
          {getDetailsOfBooking.booking_details.booking_comment && (
            <TextRow
              heading="Instructions"
              text={getDetailsOfBooking.booking_details.booking_comment}
            />
          )}
          <TextRow
            heading={i18n.t('langChange:statusAddress')}
            text={
              getDetailsOfBooking.booking_details.addr_address +
              ', ' +
              getDetailsOfBooking.booking_details.addr_city +
              ', ' +
              getDetailsOfBooking.booking_details.addr_country
            }
          />
          <TextRow
            heading={i18n.t('langChange:statusCont')}
            text={getDetailsOfBooking.booking_details.addr_phonenumber}
          />
          <Text
            style={{
              marginBottom: RFValue(5),
              fontWeight: 'bold',
              fontSize: 16,
              marginTop: 16,
            }}>
            {i18n.t('langChange:statusDetails')}:
          </Text>
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Row
              flexArr={[2, 1, 0.7, 1]}
              data={tableHead}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows
              flexArr={[2, 1, 0.7, 1]}
              data={tableData}
              textStyle={styles.text}
            />
          </Table>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  headingStyles: {
    marginBottom: RFValue(5),
    fontWeight: 'bold',
  },
  cardContainer1: {
    padding: RFValue(10),
    width: '100%',
    alignSelf: 'center',
    marginBottom: RFValue(10),
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  text: {margin: 6, fontSize: RFValue(11)},
});

export default StatusScreen;
