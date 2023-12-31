import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Divider} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import i18n from 'i18next';

import Colors from '../constant/Colors';
import * as userActions from '../store/actions/user';
import Loader from '../components/Loader';
import {useError} from '../hooks/useError';

const WalletScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  const {settings} = useSelector(state => state.auth);
  const {partner} = useSelector(state => state.user);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.set_Profile());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <Pressable style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: RFValue(50), height: RFValue(50)}}>
            <Image
              source={require('../assets/wallet.png')}
              style={{width: '100%', height: '100%', resizeMode: 'contain'}}
            />
          </View>
          <Text style={styles.amt}>

            {i18n.t('langChange:cash')}
            </Text>
        </View>
        <Text style={styles.amt}>
          {settings.currency} {partner.partner_wallet}
        </Text>
      </Pressable>
      <Divider />
      <Pressable
        style={styles.container}
        onPress={() => navigation.navigate('Transaction')}>
        <Text style={styles.title}>{i18n.t('langChange:walletTran')}</Text>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          color="black"
          style={{marginTop: RFValue(5)}}
        />
      </Pressable>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: RFValue(10),
  },
  amt: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
    padding: RFValue(15),
  },
  title: {
    fontSize: RFValue(15),
    paddingVertical: RFValue(8),
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: RFValue(15),
  },
});

export default WalletScreen;
