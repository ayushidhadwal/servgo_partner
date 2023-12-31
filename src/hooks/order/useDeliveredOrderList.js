import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {useError} from '../useError';
import * as orderActions from '../../store/actions/order';

export const useDeliveredOrderList = () => {
  const [loading, setLoading] = useState(false);

  const {deliveredOrderList} = useSelector(state => state.order);

  const dispatch = useDispatch();
  const setError = useError();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(orderActions.getDeliveredOrderList());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  return [deliveredOrderList, loading];
};
