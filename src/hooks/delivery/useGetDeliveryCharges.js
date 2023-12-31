import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useError} from '../useError';
import * as deliveryActions from '../../store/actions/delivery';

export const useGetDeliveryCharges = navigation => {
  const [loading, setLoading] = useState(false);

  const {deliveryCharges} = useSelector(state => state.delivery);

  const dispatch = useDispatch();
  const setError = useError();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(deliveryActions.getDeliveryCharges());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  return {deliveryCharges, loading};
};
