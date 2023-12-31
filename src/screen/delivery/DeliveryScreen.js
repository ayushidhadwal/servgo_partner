import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {AnimatedFAB} from 'react-native-paper';
import i18n from 'i18next';

import {DeliveryCard} from '../../components/delivery/DeliveryCard';
import {useDispatch, useSelector} from 'react-redux';
import {useError} from '../../hooks/useError';
import Loader from '../../components/Loader';
import Colors from '../../constant/Colors';
import * as deliveryAction from '../../store/actions/delivery';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {successMessage} from '../../utils/success-message';

const DeliveryScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();

  const onPressHandler = useCallback(
    id => {
      Alert.alert(
        'Please confirm',
        'Are you sure you want to delete this item?',
        [
          {
            text: 'Yes',
            onPress: async () => {
              setError(null);
              try {
                await dispatch(deliveryAction.deleteDeliveryBoy(id));
                successMessage('Delivery', 'Delivery Deleted Successfully');
                navigation.navigate('Delivery');
              } catch (e) {
                setError(e.msg);
              }
            },
            style: 'destructive',
          },
          {text: 'Cancel'},
        ],
      );
    },
    [dispatch, navigation, setError],
  );

  const {deliveryList} = useSelector(state => state.delivery);

  useEffect(() => {
    navigation.addListener('focus', async () => {
      setIsLoading(true);
      setError(null);
      try {
        await dispatch(deliveryAction.getDeliveryList());
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    });
  }, [dispatch, navigation, setError]);

  const {bottom} = useSafeAreaInsets();

  const renderItem = ({item, index}) => {
    return (
      <DeliveryCard
        item={item}
        index={index}
        navigation={navigation}
        onPressHandler={onPressHandler}
      />
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.screen}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      {deliveryList.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 16}}>No Data</Text>
        </View>
      ) : (
        <FlatList
          data={deliveryList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AnimatedFAB
        icon={'plus'}
        label={i18n.t('langChange:add')}
        extended={true}
        visible={true}
        onPress={() => navigation.navigate('AddDelivery')}
        animateFrom={'right'}
        iconMode={'static'}
        style={[styles.fabStyle, {bottom: bottom || 20}]}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  branchModel: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fabStyle: {
    bottom: 20,
    right: 15,
    position: 'absolute',
    backgroundColor: Colors.primary,
  },
});

export default DeliveryScreen;
