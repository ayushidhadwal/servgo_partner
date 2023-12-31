import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import Loader from '../../components/Loader';
import {OrderCard} from '../../components/order/OrderCard';
import {useOutForDeliveryList} from '../../hooks/order/useOutForDeliveryList';

const OutOfDeliveryOrderList = ({navigation}) => {
  const [outForDeliveryList, loading] = useOutForDeliveryList();

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

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, paddingHorizontal: 5}}>
      {outForDeliveryList.length === 0 ? (
        <View style={{alignItems: 'center', paddingVertical: 150}}>
          <Text>NO ORDERS !!!</Text>
        </View>
      ) : (
        <FlatList
          data={outForDeliveryList}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default OutOfDeliveryOrderList;
