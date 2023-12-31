import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {useError} from '../useError';
import * as productActions from '../../store/actions/product';

export const useGetProductDetails = productId => {
  const [loading, setLoading] = useState(true);

  const {productDetails} = useSelector(state => state.product);

  const dispatch = useDispatch();
  const setError = useError();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(productActions.getProductDetails(productId));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, productId, setError]);

  return {productDetails, loading};
};
