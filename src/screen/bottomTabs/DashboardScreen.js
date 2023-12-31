import React from 'react';
import {StyleSheet, Platform, StatusBar, View, ScrollView} from 'react-native';

import Colors from '../../constant/Colors';
import BranchInput from '../../components/branch/BranchInput';
import {useDashboard} from '../../hooks/useDashboard';
import Loader from '../../components/Loader';
import {DashboardCard} from '../../components/dashboard/DashboardCard';
import i18next from 'i18next';

const DashboardScreen = () => {
  const {dashboard, isLoading} = useDashboard();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />

      <BranchInput />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <DashboardCard
            image={require('../../assets/dashboard/booking.png')}
            title={i18next.t('langChange:bookings')}
            count={dashboard.numberOfBooking}
          />
          <DashboardCard
            image={require('../../assets/dashboard/salesVolume.png')}
            title={i18next.t('langChange:sales')}
            count={dashboard?.salesByCity}
            />
        </View>

        <View style={styles.container}>
          <DashboardCard
            image={require('../../assets/dashboard/complaint.png')}
            title={i18next.t('langChange:complaints')}
            count={dashboard?.complaintRaise}
            />
          <DashboardCard
            image={require('../../assets/dashboard/pending.png')}
            title={i18next.t('langChange:pendingRequests')}
            count={dashboard?.pendingBooking}
            />
        </View>

        <View style={styles.container}>
          <DashboardCard
            image={require('../../assets/dashboard/accept.png')}
            title={i18next.t('langChange:acceptedRecievedRequest')}
            count={dashboard.acceptBooking}
            />
          <DashboardCard
            image={require('../../assets/dashboard/sales.png')}
            title={i18next.t('langChange:acceptedRecievedRequest')}
            count={dashboard?.monthlySalesByMonthly}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 6,
  },
});

export default DashboardScreen;
