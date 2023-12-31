import * as React from 'react';
import {ActivityIndicator, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import i18n from 'i18next';
import Colors from '../constant/Colors';

const Loader = () => {
  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator animating={true} color={Colors.primary} />
      <Text>{i18n.t('langChange:loading')}</Text>
    </SafeAreaView>
  );
};
export default Loader;
