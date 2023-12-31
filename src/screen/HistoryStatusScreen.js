import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import i18n from 'i18next';
import {Table, Row, Rows} from 'react-native-table-component';

import * as requestAction from '../store/actions/request';
import {URL} from '../constant/base_url';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import {useError} from '../hooks/useError';
import {NotFound} from '../components/NotFound';

const TextRow = ({heading, text, color}) => (
  <Text style={styles.headingStyles}>
    {heading}:{' '}
    <Text style={{fontWeight: 'normal', color: color ? color : 'black'}}>
      {text}
    </Text>
  </Text>
);

const HistoryStatusScreen = ({route, navigation}) => {
  const {booking_id} = route.params;

  const [loading, setLoading] = useState(true);

  const setError = useError();
  const dispatch = useDispatch();

  const {getDetailsOfBooking} = useSelector(state => state.request);
  const {lang} = useSelector(state => state.lang);
  const {settings} = useSelector(state => state.auth);

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
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getBookingDetails(booking_id));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, [booking_id, dispatch, navigation, setError]);

  if (loading) {
    return <Loader />;
  }

  if (!getDetailsOfBooking?.booking_details) {
    return <NotFound />;
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
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
              heading={i18n.t('langChange:statusInst')}
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
          <Text style={{marginBottom: RFValue(5), fontWeight: 'bold'}}>
            {i18n.t('langChange:statusDetails')}:
          </Text>
          <Table
            borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}
            style={{marginBottom: RFValue(10)}}>
            <Row
              data={tableHead}
              style={styles.head}
              flexArr={[2, 1, 0.7, 1]}
              textStyle={styles.text}
            />
            <Rows
              data={tableData}
              flexArr={[2, 1, 0.7, 1]}
              textStyle={styles.text}
            />
          </Table>
          <Button
            mode="contained"
            style={{marginBottom: RFValue(10)}}
            onPress={() =>
              navigation.navigate('invoice', {booking_id: booking_id})
            }>
            {i18n.t('langChange:invoiceBtn')}
          </Button>
          <TextRow
            heading={i18n.t('langChange:completionDesc')}
            text={getDetailsOfBooking.booking_details.job_completed_comment}
          />
          <TextRow
            text={dayjs(getDetailsOfBooking.booking_details.created_at).format(
              'DD MMM YYYY , hh:mm a',
            )}
            heading={i18n.t('langChange:completionTime')}
          />
          {getDetailsOfBooking.providerReview.length !== 0 && (
            <>
              <Text style={styles.headingStyles}>
                {i18n.t('langChange:attachProvided')}:
              </Text>
              <View
                style={{
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                }}>
                {getDetailsOfBooking.providerReview.map((m, i) => (
                  <Image
                    key={i}
                    source={{uri: URL + m.images}}
                    style={{width: 100, height: 100, margin: 5}}
                  />
                ))}
              </View>
            </>
          )}
          {getDetailsOfBooking.booking_details.confirm_reason && (
            <TextRow
              heading={i18n.t('langChange:serviceConf')}
              text={getDetailsOfBooking.booking_details.confirm_reason}
            />
          )}
          {getDetailsOfBooking.serviceConfirmation.length !== 0 && (
            <>
              <Text style={styles.headingStyles}>
                {i18n.t('langChange:custAttach')}:
              </Text>
              <View
                style={{
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                }}>
                {getDetailsOfBooking.serviceConfirmation.map((m, i) => (
                  <Image
                    key={i}
                    source={{uri: URL + m.sc_images}}
                    style={{width: 100, height: 100, margin: 5}}
                  />
                ))}
              </View>
            </>
          )}
          {/*  COMPLAINTS MUST BE ADDED HERE  */}
          {getDetailsOfBooking.complaints && (
            <View style={[styles.card]}>
              <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
                {i18n.t('langChange:complaintDetails')}
              </Text>
              <Divider style={styles.marginVertical} />
              <TextRow
                heading={i18n.t('langChange:complaintSubj')}
                text={getDetailsOfBooking.complaints.cr_subject}
              />
              <TextRow
                heading={i18n.t('langChange:complaintComment')}
                text={getDetailsOfBooking.complaints.cr_comment}
              />
              {getDetailsOfBooking.complaints.feedback && (
                <TextRow
                  heading={i18n.t('langChange:complaintFeedback')}
                  text={getDetailsOfBooking.complaints.feedback}
                />
              )}
            </View>
          )}
          {/*  REVIEW MUST BE ADDED HERE  */}
          {getDetailsOfBooking.userReviews.map((review, i) => (
            <View style={[styles.card]}>
              <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
                {i18n.t('langChange:review')}
              </Text>
              <Divider style={styles.marginVertical} />
              <Rating
                rating={parseInt(
                  (review.services + review.vofm + review.behaviour) / 3,
                )}
                service={review.services}
                moneyOfValue={review.vofm}
                behaviour={review.behaviour}
              />
              <Text style={{fontWeight: 'normal', color: 'black'}}>
                {/* {review.message} */}
                {i18n.t('langChange:done')}
              </Text>
            </View>
          ))}
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
  bold: {
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
  },
  marginVertical: {
    marginVertical: RFValue(5),
  },
});

export default HistoryStatusScreen;
