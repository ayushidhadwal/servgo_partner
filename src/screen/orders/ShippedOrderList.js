import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import Loader from '../../components/Loader';
import {OrderCard} from '../../components/order/OrderCard';
import {useError} from '../../hooks/useError';
import * as orderAction from '../../store/actions/order';

const ShippedOrderList = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {shippedOrderList} = useSelector(state => state.order);

  const dispatch = useDispatch();
  const setError = useError();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setIsLoading(true);
      setError(null);
      try {
        await dispatch(orderAction.getShippedOrderList());
      } catch (e) {
        setError(e.message);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, paddingHorizontal: 5}}>
      {shippedOrderList.length === 0 ? (
        <View style={{alignItems: 'center', paddingVertical: 150}}>
          <Text>NO ORDERS !!!</Text>
        </View>
      ) : (
        <FlatList
          data={shippedOrderList}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default ShippedOrderList;
