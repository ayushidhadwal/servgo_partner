import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useError} from '../useError';
import * as deliveryActions from '../../store/actions/delivery';
import {useNavigation} from '@react-navigation/native';

export const useGetDeliveryDetails = itemId => {
  const [loading, setLoading] = useState(false);

  const {deliveryDetails} = useSelector(state => state.delivery);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const setError = useError();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(deliveryActions.getDeliveryDetails(itemId));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, itemId, navigation, setError]);

  return {deliveryDetails, loading};
};
