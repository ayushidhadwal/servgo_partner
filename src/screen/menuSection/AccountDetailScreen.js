import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Card, Divider} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import i18n from 'i18next';

import Colors from '../../constant/Colors';

const AccountDetailScreen = props => {
  return (
    <View style={styles.screen}>
      <Card style={styles.cardContainer}>
        <Text style={styles.heading}>{i18n.t('langChange:tradeLic')}</Text>
        <Divider />
        <Text
          style={styles.subHeading}
          onPress={() => props.navigation.navigate('trade')}>
          {i18n.t('langChange:addDetails')}
        </Text>
      </Card>

      <Card style={styles.cardContainer}>
        <Text style={styles.heading}>{i18n.t('langChange:taxReg')}</Text>
        <Divider />
        <Text
          style={styles.subHeading}
          onPress={() => props.navigation.navigate('TXN')}>
          {i18n.t('langChange:addDetails')}
        </Text>
      </Card>
      <Card style={styles.cardContainer}>
        <Text style={styles.heading}>{i18n.t('langChange:bankAcc')}</Text>
        <Divider />
        <Text
          style={styles.subHeading}
          onPress={() => props.navigation.navigate('Bank')}>
          {i18n.t('langChange:addDetails')}
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: RFValue(15),
  },
  cardContainer: {
    padding: RFValue(10),
    marginBottom: RFValue(10),
  },
  heading: {
    color: Colors.black,
    fontSize: RFValue(15),
    paddingBottom: RFValue(10),
    fontWeight: 'bold',
  },
  subHeading: {
    color: Colors.primary,
    fontSize: RFValue(15),
    paddingTop: RFValue(10),
  },
});

export default AccountDetailScreen;
