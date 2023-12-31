import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {useError} from '../useError';
import * as orderActions from '../../store/actions/order';

export const useOutForDeliveryList = () => {
  const [loading, setLoading] = useState(false);

  const {outForDeliveryList} = useSelector(state => state.order);

  const dispatch = useDispatch();
  const setError = useError();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(orderActions.getOutForDeliveryList());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  return [outForDeliveryList, loading];
};
