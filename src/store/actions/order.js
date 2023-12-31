import {BASE_URL} from '../../constant/base_url';
import {logout} from './auth';

export const GET_ORDER_PENDING_LIST = 'GET_ORDER_PENDING_LIST';
export const GET_SHIPPED_ORDER_LIST = 'GET_SHIPPED_ORDER_LIST';
export const GET_DELIVERED_ORDER_LIST = 'GET_DELIVERED_ORDER_LIST';
export const GET_ORDER_DETAILS = 'GET_ORDER_DETAILS';
export const GET_OUT_FOR_DELIVERY_ORDER_LIST =
  'GET_OUT_FOR_DELIVERY_ORDER_LIST';
export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS';

export const getOrderDetails = orderId => {
  return async (dispatch, getState) => {
    const {
      auth: {tokenType, accessToken},
    } = getState().auth;

    const res = await fetch(
      `${BASE_URL}partner/order-pending-details/${orderId}`,
      {
        method: 'GET',
      },
    );

    if (!res.ok) {
      if (res.status === 401) {
        dispatch(logout(tokenType, accessToken));
      } else {
        throw new Error(
          'Error Code : ' + res.status + ' Internal Server Error.',
        );
      }
    }

    const response = await res.json();

    if (response.status) {
      dispatch({
        type: GET_ORDER_DETAILS,
        orderDetails: response.Data,
      });
    } else {
      throw new Error(response.message);
    }
  };
};

export const getOrderPendingList = () => {
  return async dispatch => {
    const formData = new FormData();
    // formData.append('branch_id',1);
    

    const res = await fetch(`${BASE_URL}partner/order-pending-list`, {
      method: 'POST',
      // body: formData,
    });

    const response = await res.json();
    console.log(response)

    dispatch({
      type: GET_ORDER_PENDING_LIST,
      orderPendingList: response.Data,
    });
  };
};

export const getShippedOrderList = () => {
  return async dispatch => {
    const formData = new FormData();

    const res = await fetch(`${BASE_URL}partner/shipped-orders`, {
      method: 'POST',
      // body: formData,
    });

    const response = await res.json();

    dispatch({
      type: GET_SHIPPED_ORDER_LIST,
      shippedOrderList: response.Data,
    });
  };
};

export function getDeliveredOrderList() {
  return async dispatch => {
    const formData = new FormData();

    const res = await fetch(`${BASE_URL}partner/delivered-orders`, {
      method: 'POST',
      // body: formData,
    });

    const resData = await res.json();

    dispatch({
      type: GET_DELIVERED_ORDER_LIST,
      deliveredOrderList: resData.Data,
    });
  };
}

export function getOutForDeliveryList() {
  return async (dispatch, getState) => {
    const {
      auth: {tokenType, accessToken},
    } = getState().auth;

    const formData = new FormData();

    formData.append('branch_id', 0);

    const res = await fetch(`${BASE_URL}partner/out-of-delivery-orders`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
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
        type: GET_OUT_FOR_DELIVERY_ORDER_LIST,
        outForDeliveryList: resData.Data,
      });
    } else {
      dispatch({
        type: GET_OUT_FOR_DELIVERY_ORDER_LIST,
        outForDeliveryList: [],
      });
      throw new Error(resData.message);
    }
  };
}

export function updateOrderStatus({id, status}) {
  return async dispatch => {
    const fd = new FormData();

    fd.append('id', id);
    fd.append('status', status);

    const res = await fetch(`${BASE_URL}partner/update-order-status`, {
      method: 'POST',
      body: fd,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: UPDATE_ORDER_STATUS,
        payload: {
          id,
          status,
        },
      });
    } else {
      throw new Error(resData?.message);
    }
  };
}
