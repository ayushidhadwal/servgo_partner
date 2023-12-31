import {BASE_URL} from '../../constant/base_url';
import {logout} from './auth';

export const GET_PRODUCT_LIST = 'GET_PRODUCT_LIST';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const GET_PRODUCT_DETAILS = 'GET_PRODUCT_DETAILS';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

export function getProductList() {
  return async dispatch => {
    const res = await fetch(`${BASE_URL}partner/product-list`, {
      method: 'POST',
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: GET_PRODUCT_LIST,
        productList: resData.Data,
      });
    } else {
      throw new Error(resData.message);
    }
  };
}

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const {
      auth: {tokenType, accessToken},
    } = getState().auth;

    const formData = new FormData();
    formData.append('product_id', productId);

    const res = await fetch(`${BASE_URL}partner/product-delete`, {
      method: 'POST',
      body: formData,
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
        type: DELETE_PRODUCT,
        productId: productId,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

export const getProductDetails = productId => {
  return async dispatch => {
    const res = await fetch(
      `${BASE_URL}partner/product-details-view/${productId}`,
    );

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: GET_PRODUCT_DETAILS,
        productDetails: resData.Data,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

export const addProduct = (
  productTitle,
  arabicTitle,
  categoryId,
  subCategoryId,
  inventory,
  mrp,
  sellingPrice,
  discount,
  desc,
  arabicDesc,
  productImg1,
  productImg2,
  productImg3,
  productImg4,
) => {
  return async dispatch => {
    if (productTitle === '') {
      throw new Error('Please add Product Name.');
    }
    if (categoryId === 0) {
      throw new Error('Category is Required.');
    }
    if (subCategoryId === 0) {
      throw new Error('Sub-category is Required.');
    }
    if (inventory === 0) {
      throw new Error('Inventory is Required');
    }
    if (mrp === 0) {
      throw new Error('MRP is Required');
    }
    if (sellingPrice === 0) {
      throw new Error('Selling price is Required');
    }
    if (discount === 0) {
      throw new Error('Discount is Required');
    }

    const formData = new FormData();
    formData.append('product_title', productTitle);
    formData.append('arabic_title', arabicTitle);
    formData.append('selling_price', sellingPrice);
    formData.append('product_mrp', mrp);
    formData.append('inventory', inventory);
    formData.append('discount', discount);
    formData.append('product_desc', desc);
    formData.append('arabic_desc', arabicDesc);
    formData.append('category', categoryId);
    formData.append('sub_category', subCategoryId);

    if (productImg1?.uri) {
      formData.append('productImage1', productImg1);
    }

    if (productImg2?.uri) {
      formData.append('productImage2', productImg2);
    }

    if (productImg3?.uri) {
      formData.append('productImage3', productImg3);
    }

    if (productImg4?.uri) {
      formData.append('productImage4', productImg4);
    }

    const res = await fetch(`${BASE_URL}partner/add-product`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: ADD_PRODUCT,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

export const updateProduct = (
  productId,
  productTitle,
  arabicTitle,
  categoryId,
  subCategoryId,
  inventory,
  mrp,
  sellingPrice,
  discount,
  desc,
  arabicDesc,
  productImg1,
  productImg2,
  productImg3,
  productImg4,
) => {
  return async dispatch => {
    if (productTitle === '') {
      throw new Error('Please add Product Name.');
    }
    if (categoryId === 0) {
      throw new Error('Category is Required.');
    }
    if (subCategoryId === 0) {
      throw new Error('Sub-category is Required.');
    }
    if (inventory === 0) {
      throw new Error('Inventory is Required');
    }
    if (mrp === 0) {
      throw new Error('MRP is Required');
    }
    if (sellingPrice === 0) {
      throw new Error('Selling price is Required');
    }
    if (discount === 0) {
      throw new Error('Discount is Required');
    }

    const formData = new FormData();
    formData.append('id', productId);
    formData.append('product_title', productTitle);
    formData.append('arabic_title', arabicTitle);
    formData.append('selling_price', sellingPrice);
    formData.append('product_mrp', mrp);
    formData.append('inventory', inventory);
    formData.append('discount', discount);
    formData.append('product_desc', desc);
    formData.append('arabic_desc', arabicDesc);
    formData.append('category', categoryId);
    formData.append('sub_category', subCategoryId);

    if (productImg1?.name) {
      formData.append('productImage1', productImg1);
    }

    if (productImg2?.name) {
      formData.append('productImage2', productImg2);
    }

    if (productImg3?.name) {
      formData.append('productImage3', productImg3);
    }

    if (productImg4?.name) {
      formData.append('productImage4', productImg4);
    }

    const res = await fetch(`${BASE_URL}partner/update-product`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: UPDATE_PRODUCT,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};
