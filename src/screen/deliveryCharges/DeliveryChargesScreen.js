import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Colors from '../../constant/Colors';
import {useGetDeliveryCharges} from '../../hooks/delivery/useGetDeliveryCharges';
import Loader from '../../components/Loader';
import {useError} from '../../hooks/useError';
import * as deliveryActions from '../../store/actions/delivery';
import {successMessage} from '../../utils/success-message';
import i18next from 'i18next';

const DeliveryChargesScreen = ({navigation}) => {
  const {deliveryCharges, loading} = useGetDeliveryCharges(navigation);

  const [charges, setCharges] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  useEffect(() => {
    if (deliveryCharges) {
      setCharges(deliveryCharges.deliveryCharges);
    }
  }, [deliveryCharges]);

  const onPressHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await dispatch(deliveryActions.updateDeliveryCharges(charges));
      successMessage('Success', 'Delivery Charges updated Successfully');
    } catch (e) {
      setError(e.message);
    }
    setIsLoading(false);
  }, [charges, dispatch, setError]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>{i18next.t('langChange:deliveryCharges')}</Text>
      <TextInput
        left={<TextInput.Icon name="tag" color={Colors.primary} />}
        mode="outlined"
        label={'Enter Delivery Charges'}
        style={styles.input}
        value={charges}
        onChangeText={setCharges}
      />
      <Button
        style={styles.button}
        mode="contained"
        onPress={onPressHandler}
        loading={isLoading}
        disabled={isLoading}>
        Update
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: 'white'},
  heading: {marginLeft: 8, marginTop: 18, fontSize: 18, fontWeight: 'bold'},
  input: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    marginTop: 5,
  },
  button: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: 50,
  },
});

export default DeliveryChargesScreen;
