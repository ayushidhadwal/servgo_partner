import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Platform, StatusBar, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import Loader from '../../components/Loader';
import {OrderCard} from '../../components/order/OrderCard';
import Colors from '../../constant/Colors';
import {useError} from '../../hooks/useError';
import * as orderAction from '../../store/actions/order';

const DeliveredOrderList = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {deliveredOrderList} = useSelector(state => state.order);

  const dispatch = useDispatch();
  const setError = useError();

  const getRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(orderAction.getDeliveredOrderList());
    } catch (e) {
      setError(e.message);
    }
    setIsLoading(false);
  }, [dispatch, setError]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getRequests);

    return unsubscribe;
  }, [getRequests, navigation]);

  if (isLoading) {
    return <Loader />;
  }

  const renderItem = ({item, index}) => {
    return (
      <OrderCard
        item={item}
        index={index}
        navigation={navigation}
        details={true}
      />
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, paddingHorizontal: 5}}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      {deliveredOrderList.length === 0 ? (
        <View style={{alignItems: 'center', paddingVertical: 150}}>
          <Text>NO ORDERS !!!</Text>
        </View>
      ) : (
        <FlatList
          data={deliveredOrderList}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default DeliveredOrderList;
