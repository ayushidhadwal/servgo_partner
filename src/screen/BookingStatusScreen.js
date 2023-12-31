import dayjs from 'dayjs';
import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, Text, View, ScrollView, Platform} from 'react-native';
import {Button, Subheading, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Row, Rows, Table} from 'react-native-table-component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import i18n from 'i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import Colors from '../constant/Colors';
import * as requestAction from '../store/actions/request';
import Loader from '../components/Loader';
import {NotFound} from '../components/NotFound';
import {useError} from '../hooks/useError';
import {successMessage} from '../utils/success-message';

const TextRow = ({heading, text, color}) => (
  <Text style={styles.headingStyles}>
    {heading}:{' '}
    <Text style={{fontWeight: 'normal', color: color ? color : 'black'}}>
      {text}
    </Text>
  </Text>
);

const BookingStatusScreen = ({route, navigation}) => {
  const {booking_id,service_id,child_service_id} = route.params;

  const [date, setDate] = useState(null);
  const [image, setImage] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  const {settings} = useSelector(state => state.auth);
  const {lang} = useSelector(state => state.lang);
  const {getDetailsOfBooking} = useSelector(state => state.request);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(requestAction.getBookingDetails(booking_id,service_id,child_service_id));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [booking_id, dispatch, navigation, setError]);

  const onclickHandler = () => {
    setDate(new Date());
  };

  const onsubmitHandler = useCallback(async () => {
    setSubmitLoading(true);
    setError(null);

    try {
      await dispatch(
        requestAction.job_completed(booking_id, image, date, comment),
      );
      setSubmitLoading(false);
      successMessage('Bookings', 'Job Completed Successfully!');
      navigation.navigate('job');
    } catch (e) {
      setError(e.message);
      setSubmitLoading(false);
    }
  }, [setError, dispatch, booking_id, image, date, comment, navigation]);

  const _pickImageHandler = async () => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    )
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            _openImagePicker();
            break;
          case RESULTS.UNAVAILABLE:
            setError('This feature is not available on this device!');
            break;
          case RESULTS.DENIED:
            request(
              Platform.OS === 'ios'
                ? PERMISSIONS.IOS.PHOTO_LIBRARY
                : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            ).then(requestResult => {
              if (requestResult === RESULTS.GRANTED) {
                _openImagePicker();
              }
            });
            break;
          case RESULTS.LIMITED:
            _openImagePicker();
            break;
          case RESULTS.BLOCKED:
            setError(
              'The permission is denied! Please enable storage permission.',
            );
            openSettings().catch(settingsErr =>
              setError('Unable to open settings!'),
            );
            break;
        }
      })
      .catch(e => {
        setError(e.message);
      });
  };

  const _openImagePicker = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0,
      });
      setImage(result.assets);
    } catch (e) {
      setError(e.message);
    }
  };

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

  if (loading) {
    return <Loader />;
  }

  if (!getDetailsOfBooking?.booking_details) {
    return <NotFound />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1}}>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
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
            color={
              getDetailsOfBooking.booking_details.status === 'ACCEPTED' ||
              getDetailsOfBooking.booking_details.status === 'COMPLETED'
                ? 'green'
                : getDetailsOfBooking.booking_details.status === 'REFUND'
                ? 'orange'
                : getDetailsOfBooking.booking_details.status === 'PENDING'
                ? 'grey'
                : getDetailsOfBooking.booking_details.status === 'RESCHEDULE'
                ? 'skyblue'
                : 'red'
            }
          />
          <TextRow
            heading={i18n.t('langChange:statusPayment')}
            text={getDetailsOfBooking.booking_details.payment_status}
            color={
              getDetailsOfBooking.booking_details.payment_status === 'SUCCESS'
                ? 'green'
                : getDetailsOfBooking.booking_details.payment_status ===
                  'REFUND'
                ? 'orange'
                : getDetailsOfBooking.booking_details.payment_status ===
                  'PENDING'
                ? 'grey'
                : 'red'
            }
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
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
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
        </View>
        {(getDetailsOfBooking.booking_details.status === 'ACCEPTED' ||
          getDetailsOfBooking.booking_details.status === 'RESCHEDULE') &&
          getDetailsOfBooking.booking_details.payment_status === 'SUCCESS' && (
            <Button
              mode={'contained'}
              style={{
                width: '40%',
                alignSelf: 'flex-end',
                borderRadius: RFValue(20),
                marginHorizontal: 16,
              }}
              icon={'chat'}
              contentStyle={{flexDirection: 'row-reverse'}}
              onPress={() =>
                navigation.navigate('message', {
                  bookingId: booking_id,
                  customerId: getDetailsOfBooking.booking_details.user_id,
                  userName: getDetailsOfBooking.booking_details.addr_username,
                })
              }>
              {i18n.t('langChange:chatBtn')}
            </Button>
          )}
        {getDetailsOfBooking.booking_details.status === 'ACCEPTED' && (
          <View style={{flex: 1, margin: 16}}>
            {date ? (
              <KeyboardAwareScrollView>
                <View style={[styles.completed, {flexDirection: 'column'}]}>
                  <Subheading style={{marginBottom: RFValue(5), color: 'red'}}>
                    {i18n.t('langChange:markJobBtnMsg')}
                  </Subheading>
                  <Button
                    mode="outlined"
                    icon="attachment"
                    onPress={_pickImageHandler}>
                    {i18n.t('langChange:attachBtn')}
                  </Button>
                  {image.length !== 0 && (
                    <View style={styles.row2}>
                      <Text style={styles.text}>
                        {i18n.t('langChange:uploadText')}
                      </Text>
                      <Ionicons name="checkmark-done" size={24} color="black" />
                    </View>
                  )}
                </View>
                <TextInput
                  label={i18n.t('langChange:textInputLabel')}
                  mode="outlined"
                  multiline
                  numberOfLines={8}
                  style={{backgroundColor: 'white'}}
                  value={comment}
                  onChangeText={setComment}
                />
                <Text style={styles.jobs}>
                  {i18n.t('langChange:timeStamp')}:{' '}
                  {dayjs(date).format('DD/MM/YYYY hh:mm A')}
                </Text>
                <Button
                  mode="contained"
                  style={styles.submit}
                  contentStyle={{height: 50}}
                  onPress={onsubmitHandler}
                  loading={submitLoading}
                  disabled={submitLoading}>
                  {i18n.t('langChange:submitBtn')}
                </Button>
              </KeyboardAwareScrollView>
            ) : getDetailsOfBooking.booking_details.payment_status ===
              'SUCCESS' ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  marginTop: RFValue(12),
                }}>
                <Button
                  mode="contained"
                  color="green"
                  onPress={onclickHandler}
                  style={{
                    borderRadius: RFValue(50),
                    marginBottom: RFValue(30),
                  }}
                  contentStyle={{height: 50}}
                  disabled={date !== null}>
                  {i18n.t('langChange:markJobBtn')}
                </Button>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 12,
  },
  cardContainer1: {
    padding: RFValue(10),
    width: '98%',
    alignSelf: 'center',
    marginBottom: 25,
  },
  location: {
    color: Colors.black,
    fontSize: RFValue(13),
    fontWeight: 'bold',
    paddingBottom: RFValue(5),
  },
  address: {
    color: Colors.black,
    paddingBottom: RFValue(10),
    fontSize: RFValue(13),
  },
  contact: {
    fontSize: RFValue(13),
    color: Colors.black,
  },
  name: {
    marginBottom: RFValue(5),
    fontSize: RFValue(15),
    color: Colors.black,
    fontWeight: 'bold',
  },
  service: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  completed: {
    marginVertical: RFValue(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobs: {
    color: Colors.black,
    fontSize: RFValue(15),
    marginTop: RFValue(8),
    fontWeight: 'bold',
    borderBottomWidth: RFValue(1),
    marginBottom: RFValue(2),
  },
  submit: {
    width: '50%',
    borderRadius: RFValue(50),
    alignSelf: 'center',
    marginVertical: RFValue(20),
  },
  row2: {
    flexDirection: 'row',
    paddingTop: RFValue(5),
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  text: {margin: 6, fontSize: RFValue(11)},
  headingStyles: {
    marginBottom: RFValue(5),
    fontWeight: 'bold',
  },
});

export default BookingStatusScreen;
