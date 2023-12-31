import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'i18next';
import Octicons from 'react-native-vector-icons/Octicons';
import {Platform} from 'react-native';

import NewLeadsScreen from '../screen/bottomTabs/NewLeadsScreen';
import BookingScreen from '../screen/bottomTabs/BookingScreen';
import MenuScreen from '../screen/bottomTabs/MenuScreen';
import Colors from '../constant/Colors';
import JobHistoryScreen from '../screen/bottomTabs/JobHistoryScreen';
import DashboardScreen from '../screen/bottomTabs/DashboardScreen';
import HomeHeader from '../components/Header';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({navigation}) => {
  const screenOptions = {
    headerStyle: {
      backgroundColor: Colors.primary,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      alignSelf: 'flex-start',
    },
    headerRight: () => (
      <Ionicons
        name={Platform.OS === 'ios' ? 'ios-wallet' : 'md-wallet'}
        size={24}
        color={Colors.white}
        onPress={() => navigation.navigate('Wallet')}
        style={{marginRight: 15}}
      />
    ),
  };

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      shifting={false}
      backBehavior={'initialRoute'}
      screenOptions={{
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.primaryLight,
        tabBarStyle: {
          backgroundColor: Colors.primary,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          header: props => <HomeHeader {...props} />,
          tabBarLabel: i18n.t('langChange:dashboardBottomTab'),
          tabBarIcon: tabInfo => (
            <Octicons name="graph" size={24} color={tabInfo.color} />
          ),
        }}
      />
      <Tab.Screen
        name="newlead"
        component={NewLeadsScreen}
        options={{
          ...screenOptions,
          title: i18n.t('langChange:newScreenTitle'),
          tabBarLabel: i18n.t('langChange:newBottomTab'),
          tabBarIcon: tabInfo => (
            <MaterialIcons name="fiber-new" size={24} color={tabInfo.color} />
          ),
        }}
      />
      <Tab.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          ...screenOptions,
          title: i18n.t('langChange:bookScreenTitle'),
          tabBarLabel: i18n.t('langChange:bookBottomTab'),
          tabBarIcon: tabInfo => {
            return <FontAwesome name="bars" size={24} color={tabInfo.color} />;
          },
        }}
      />
      <Tab.Screen
        name="job"
        component={JobHistoryScreen}
        options={{
          ...screenOptions,
          title: i18n.t('langChange:jobScreenTitle'),
          tabBarLabel: i18n.t('langChange:jobBottomTab'),
          tabBarIcon: tabInfo => {
            return (
              <FontAwesome name="history" size={24} color={tabInfo.color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="menu"
        component={MenuScreen}
        options={{
          ...screenOptions,
          title: i18n.t('langChange:settingScreenTitle'),
          tabBarLabel: i18n.t('langChange:settingBottomTab'),
          tabBarIcon: tabInfo => (
            <Ionicons name="settings" size={25} color={tabInfo.color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default BottomTabNavigator;
