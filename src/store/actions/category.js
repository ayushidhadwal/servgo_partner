import {BASE_URL} from '../../constant/base_url';
import {logout} from './auth';

export const GET_CATEGORY_LIST = 'GET_CATEGORY_LIST';
export const GET_SUBCATEGORY_LIST = 'GET_SUBCATEGORY_LIST';

export const getCategoryList = () => {
  return async (dispatch, getState) => {
    const {
      auth: {tokenType, accessToken},
    } = getState().auth;

    const res = await fetch(`${BASE_URL}partner/category-list`, {
      method: 'GET',
    });

    if (!res.ok) {
      if (res.status === 401) {
        dispatch(logout(tokenType, accessToken));
      } else {
        throw new Error(
          'Error Code : ' + res.status + ' Internal Server Error.',
        );
      }
    }

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: GET_CATEGORY_LIST,
        CategoryList: resData.data.categories,
      });
    } else {
      dispatch({
        type: GET_CATEGORY_LIST,
        CategoryList: [],
      });
      throw new Error(resData.message);
    }
  };
};

export const getSubCategoryList = id => {
  return async dispatch => {
    const res = await fetch(`${BASE_URL}partner/sub-categories-list/${id}`);

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: GET_SUBCATEGORY_LIST,
        subCategoryList: resData.Data.subCategories,
      });
    } else {
      dispatch({
        type: GET_SUBCATEGORY_LIST,
        subCategoryList: [],
      });
      throw new Error(resData.message);
    }
  };
};
