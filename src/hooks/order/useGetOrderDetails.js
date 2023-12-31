import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useError} from '../useError';
import {useNavigation} from '@react-navigation/native';
import * as orderActions from '../../store/actions/order';

export const useGetOrderDetails = orderId => {
  const [loading, setLoading] = useState(false);

  const {orderDetails} = useSelector(state => state.order);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const setError = useError();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(orderActions.getOrderDetails(orderId));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, orderId, setError]);

  return {orderDetails, loading};
};
