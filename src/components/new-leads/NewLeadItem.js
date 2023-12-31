import React, {useCallback, useState} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Card, Divider} from 'react-native-paper';
import i18n from 'i18next';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import Colors from '../../constant/Colors';
import {AcceptLeadModal} from './AcceptLeadModal';
import {RejectLeadModal} from './RejectLeadModal';
import * as requestAction from '../../store/actions/request';
import {useError} from '../../hooks/useError';

export const NewLeadItem = ({
  index,
  bookingId,
  clientName,
  bookingTime,
  onPress,
  serviceId,
  childServiceId
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();
  const navigation = useNavigation();

  const onStatusUpdate = useCallback(
    async (reason, status) => {
      setError(null);
      setIsLoading(true);
      try {
        await dispatch(
          requestAction.request_service_response(bookingId, status, reason,serviceId,childServiceId),
        );
        setIsLoading(false);
        navigation.navigate('Booking');
      } catch (e) {
        setIsLoading(false);
        setError(e.message);
      }
    },
    [bookingId, dispatch, navigation, setError,childServiceId,serviceId],
  );

  return (
    <>
      <Card style={[styles.content, index === 0 && {marginTop: RFValue(10)}]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: RFValue(8),
            alignItems: 'flex-start',
          }}>
          <View style={[styles.row1, {flexShrink: 1, marginRight: 4}]}>
            <Text style={styles.text1} numberOfLines={2}>
              {clientName}
            </Text>
          </View>
          <Button
            icon={'arrow-right'}
            contentStyle={{flexDirection: 'row-reverse'}}
            mode="outlined"
            onPress={onPress}>
            {i18n.t('langChange:seeMore')}
          </Button>
        </View>
        <View style={styles.row1}>
          <Text style={styles.text2}>
            <Text style={{fontWeight: 'bold'}}>
              {i18n.t('langChange:bookingId')}:{' '}
            </Text>
            {bookingId}
          </Text>
        </View>
        <View style={styles.row1}>
          <Text style={styles.text2}>
            <Text style={{fontWeight: 'bold'}}>
              {i18n.t('langChange:time')}:{' '}
            </Text>
            {bookingTime}
          </Text>
        </View>

        <Divider style={{marginTop: RFValue(4)}} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: RFValue(8),
          }}>
          <AcceptLeadModal  isLoading={isLoading} onSubmit={onStatusUpdate} />

          <RejectLeadModal isLoading={isLoading} onSubmit={onStatusUpdate} />
        </View>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heading: {
    fontWeight: 'bold',
  },
  iosHeading: {
    marginTop: RFValue(-18),
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
  },
  text1: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: RFValue(5),
  },
  text2: {
    fontSize: 14,
    paddingBottom: RFValue(5),
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
