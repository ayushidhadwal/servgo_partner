import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import PendingListScreen from '../screen/orders/PendingListScreen';
import ShippedOrderList from '../screen/orders/ShippedOrderList';
import DeliveredOrderList from '../screen/orders/DeliveredOrderList';
import OutOfDeliveryOrderList from '../screen/orders/OutOfDeliveryOrderList';
import i18next from 'i18next';

const Tab = createMaterialTopTabNavigator();

function OrderTopTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="PendingList"
      screenOptions={{
        lazy: true,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          textTransform: 'capitalize',
        },
        tabBarActiveTintColor: '#14486b',
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          borderBottomColor: '#14486b',
          borderBottomWidth: 2,
        },
      }}>
      <Tab.Screen
        name="PendingList"
        component={PendingListScreen}
        options={{tabBarLabel: i18next.t('langChange:pending')}}
      />
      <Tab.Screen
        name="ShippedOrderList"
        component={ShippedOrderList}
        options={{tabBarLabel: i18next.t('langChange:shipped')}}
      />
      <Tab.Screen
        name="OutOfDeliveryOrderList"
        component={OutOfDeliveryOrderList}
        options={{tabBarLabel: i18next.t('langChange:outForDelivery')}}
      />
      <Tab.Screen
        name="DeliveredOrderList"
        component={DeliveredOrderList}
        options={{tabBarLabel: i18next.t('langChange:delivered')}}
      />
    </Tab.Navigator>
  );
}

export default OrderTopTabNavigator;
