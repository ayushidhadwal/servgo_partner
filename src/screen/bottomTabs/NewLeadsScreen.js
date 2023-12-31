import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'react-native-paper';
import i18n from 'i18next';

import Colors from '../../constant/Colors';
import * as requestAction from '../../store/actions/request';
import Loader from '../../components/Loader';
import { useError } from '../../hooks/useError';
import { NewLeadItem } from '../../components/new-leads/NewLeadItem';

const NewLeadsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();

  const { pendingRequest } = useSelector(state => state.request);
  console.log(pendingRequest);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getPendingRequests());
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

      {pendingRequest.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.activity}>No New Requests</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={pendingRequest}
          keyExtractor={item => item.booking_id}
          renderItem={({ item, index }) => {
            return (
              <NewLeadItem
                index={index}
                onPress={() => {
                  navigation.navigate('status', {
                    booking_id: item.booking_id,
                    service_id: item.service_id,
                    child_service_id: item.child_service_id
                  });
                }}
                clientName={item.client_name}
                bookingId={item.booking_id}
                bookingTime={item.booking_time}
                serviceId={item.service_id}
                childServiceId={item.child_service_id}
              />
            );
          }}
        />
      )}

      <Button
        mode="contained"
        style={styles.btn}
        contentStyle={{ height: 50 }}
        icon="phone"
        onPress={() => navigation.navigate('help')}>
        {i18n.t('langChange:help')}
      </Button>
    </View>
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
  btn: {
    width: '30%',
    borderRadius: RFValue(20),
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  activity: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NewLeadsScreen;
