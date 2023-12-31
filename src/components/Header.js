import React from 'react';
import {StyleSheet, View, Image, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

import Colors from '../constant/Colors';

const HomeHeader = props => {
  return (
    <SafeAreaView edges={['top']} style={{backgroundColor: Colors.primary}}>
      <View style={styles.rowHeader}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../assets/Color_logo_no_background.png')}
            style={styles.imgStyles}
          />
        </View>
        <View style={styles.headerSection}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-wallet' : 'md-wallet'}
            size={24}
            color={Colors.white}
            onPress={() => props.navigation.navigate('Wallet')}
          />

          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
            size={24}
            color={Colors.white}
            onPress={() => props.navigation.navigate('updateProfile')}
            style={{marginLeft: 20}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  headerContainer: {
    width: 170,
    height: 65,
  },
  imgStyles: {
    width: '100%',
    height: '100%',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImg: {width: 40, height: 40},
});

export default HomeHeader;
