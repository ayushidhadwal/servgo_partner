import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import * as categoryActions from '../../store/actions/category';
import {useError} from '../useError';

export const useGetCategoryList = () => {
  const [loading, setLoading] = useState(true);
  const setError = useError();

  const {CategoryList} = useSelector(state => state.category);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(categoryActions.getCategoryList());
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    })();
  }, [dispatch, setError]);

  return {CategoryList, loading};
};
