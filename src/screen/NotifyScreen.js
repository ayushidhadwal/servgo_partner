import React from 'react';
import {StyleSheet, Text, Image} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import i18n from 'i18next';

import Colors from '../constant/Colors';

const NotifyScreen = () => {
  return (
    <SafeAreaView style={styles.screen}>
      <Image
        source={{
          uri: 'https://image.flaticon.com/icons/png/512/4213/4213459.png',
        }}
        style={styles.img}
      />
      <Text style={styles.subHeading}>
        {i18n.t('langChange:alertScreenMsg')}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: RFValue(10),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: RFValue(100),
    height: RFValue(100),
  },
  subHeading: {
    color: Colors.grey,
    paddingVertical: RFValue(15),
    fontSize: RFValue(15),
  },
});

export default NotifyScreen;
