import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import {Divider, Title} from 'react-native-paper';
import {Row, Rows, Table} from 'react-native-table-component';
import i18n from 'i18next';

import * as requestAction from '../store/actions/request';
import * as userActions from '../store/actions/user';
import Colors from '../constant/Colors';
import Loader from '../components/Loader';
import {NotFound} from '../components/NotFound';
import {useError} from '../hooks/useError';

const TextRow = ({heading, text, style}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: RFValue(10),
      marginBottom: RFValue(5),
    }}>
    <Text
      style={{
        flex: 0.8,
        fontWeight: 'bold',
      }}>
      {heading}:{' '}
    </Text>
    <Text style={[{flex: 1, textAlign: 'right'}, style]}>{text}</Text>
  </View>
);

const InvoiceScreen = ({route, navigation}) => {
  const {booking_id} = route.params;

  const [loading, setLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  const {getDetailsOfBooking} = useSelector(state => state.request);
  const {partner} = useSelector(state => state.user);
  const {lang} = useSelector(state => state.lang);
  const {settings} = useSelector(state => state.auth);

  const tableHead = ['Service', 'Price', 'Qty', 'Total Price'];

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
        await Promise.all([
          dispatch(userActions.set_Profile()),
          dispatch(requestAction.getBookingDetails(booking_id)),
        ]);
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [booking_id, dispatch, navigation]);

  const wallet = parseFloat(
    getDetailsOfBooking.booking_details.wallet_pay.replace(',', ''),
  );

  if (loading) {
    return <Loader />;
  }

  if (!getDetailsOfBooking?.booking_details) {
    return <NotFound />;
  }

  return (
    <ScrollView style={styles.screen}>
      <Title style={styles.title}>
        {i18n.t('langChange:invoiceNo')} : #
        {getDetailsOfBooking.booking_details.booking_id}
      </Title>
      <View style={styles.card}>
        {/* <Text style={[styles.bold, { fontSize: RFValue(14) }]}>
          {i18n.t('langChange:serviceProviderInfo')}
        </Text> */}
        {/* <Divider style={styles.marginVertical} /> */}
        {/*<TextRow heading={"Store Name"} text={partner.company_name} />*/}
        {/*<TextRow heading={"Addess"} text={partner.address} />*/}
        {/*<TextRow heading={"Email"} text={partner.email} />*/}
        <Text style={[styles.bold, {fontSize: RFValue(12), marginBottom: 6}]}>
          {getDetailsOfBooking.setting.application_name}
        </Text>
        <Text>{getDetailsOfBooking.setting.address}</Text>
        <Divider style={styles.marginVertical} />
        <Text style={[styles.bold, {fontSize: RFValue(12), marginBottom: 12}]}>
          {i18n.t('langChange:serviceProviderInfo')}
        </Text>

        <View style={styles.providerInfo}>
          <View style={{flex: 1}}>
            <Text>Store name</Text>
            <Text>Store Address</Text>
            <Text>Contact Information</Text>
            <Text>TRN</Text>
          </View>
          <View style={{flex: 1}}>
            <Text>{partner.company_name}</Text>
            <Text>{partner.address}</Text>
            <Text>
              {partner.phone_code}-{partner.mobile}
            </Text>
            <Text>{partner.trnNumber}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.card, {marginVertical: RFValue(10)}]}>
        <Text style={[styles.bold, {fontSize: RFValue(12)}]}>
          {i18n.t('langChange:serviceDesc')} :
        </Text>
        <Divider style={styles.marginVertical} />
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
        <View style={{paddingTop: RFValue(5)}}>
          <TextRow
            heading={i18n.t('langChange:serviceTotal')}
            text={
              `${settings.currency} ` +
              getDetailsOfBooking.booking_details.final_service_price
            }
            style={{fontWeight: 'bold'}}
          />
        </View>
        <Divider />
        {wallet > 0 && (
          <TextRow
            heading={i18n.t('langChange:walletPay')}
            text={' - ' + getDetailsOfBooking.booking_details.wallet_pay}
          />
        )}

        <TextRow
          heading={
            i18n.t('langChange:commission') +
            ' (' +
            getDetailsOfBooking.booking_details.servgo_commission +
            '%)'
          }
          text={' - ' + getDetailsOfBooking.booking_details.commission_cut}
        />
        <TextRow
          heading={
            i18n.t('langChange:vat') +
            '(' +
            getDetailsOfBooking.booking_details.vat_percent +
            '%)'
          }
          text={' + ' + getDetailsOfBooking.booking_details.vat_amount}
        />
        <TextRow
          heading={i18n.t('langChange:totalAmt')}
          text={
            `${settings.currency} ` +
            (getDetailsOfBooking.booking_details.price_paid -
              getDetailsOfBooking.booking_details.commission_cut)
          }
          style={{fontWeight: 'bold'}}
        />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    color: Colors.primary,
    textAlign: 'center',
    paddingVertical: RFValue(10),
  },
  marginVertical: {
    marginVertical: RFValue(8),
  },
  bold: {
    fontWeight: 'bold',
  },
  card: {
    padding: RFValue(12),
    backgroundColor: 'white',
  },
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6, fontSize: RFValue(11)},
  row: {height: 28},
  providerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default InvoiceScreen;
