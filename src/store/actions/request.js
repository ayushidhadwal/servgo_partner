// import axios from 'axios';
import dayjs from 'dayjs';
import {BASE_URL} from '../../constant/base_url';
import {logout} from './auth';
export const GET_BOOKING = 'GET_BOOKING';
export const GET_PENDING_REQUEST = 'GET_PENDING_REQUEST';
export const REQUEST_SERVICE_RESPONSE = 'REQUEST_SERVICE_RESPONSE';
export const JOB_COMPLETED = 'JOB_COMPLETED';
export const GET_JOB_HISTORY = 'GET_JOB_HISTORY';
export const GET_SELECTED_SERVICE = 'GET_SELECTED_SERVICE';
export const GET_SUBSERVICE_BY_SERVICE = 'GET_SUBSERVICE_BY_SERVICE';
export const ADD_SERVICE_PRICE = 'ADD_SERVICE_PRICE';
export const GET_SERVICE_LIST = 'GET_SERVICE_LIST';
export const UPDATE_SERVICE_PRICE = 'UPDATE_SERVICE_PRICE';
export const HELP = 'HELP';
export const GET_TRADE = 'GET_TRADE';
export const UPDATE_TRADE = 'UPDATE_TRADE';
export const UPDATE_TXN = 'UPDATE_TXN';
export const GET_TAX = 'GET_TAX';
export const GET_BANK_DETAILS = 'GET_BANK_DETAILS';
export const UPDATE_BANK = 'UPDATE_BANK';
export const GET_SERVICES = 'GET_SERVICES';
export const SELECT_SERVICE = 'SELECT_SERVICE';
export const GET_BOOKING_DETAILS = 'GET_BOOKING_DETAILS';
export const GET_CHILD_SERVICE_BY_SUBSERVICE =
  'GET_CHILD_SERVICE_BY_SUBSERVICE';

export const get_booking_list = () => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const formData = new FormData();
    formData.append('partner_id', userId);
    formData.append('limit', '1000');

    console.log(formData);

    const res = await fetch(`${BASE_URL}partner/get-booking-list`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();

    dispatch({type: GET_BOOKING, bookingList: resData.data});
  };
};

export const getPendingRequests = () => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const formData = new FormData();

    formData.append('partner_id', userId);
    formData.append('limit', '1000');

    const res = await fetch(`${BASE_URL}partner/get-pending-request`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();

    dispatch({
      type: GET_PENDING_REQUEST,
      pendingRequest: resData.data,
    });
  };
};

export const request_service_response = (booking_id, response, reason = '',serviceId,childServiceId) => {
  return async (dispatch, getState) => {
    const {
      auth: {userId, tokenType, accessToken},
    } = getState().auth;

    

    const formData = new FormData();
    formData.append('partner_id', userId);
    formData.append('booking_id', booking_id);
    formData.append('response', response);
    formData.append('reason', reason);
    formData.append('service_id', serviceId);
    formData.append('child_service_id', childServiceId);


    const res = await fetch(`${BASE_URL}partner/request-service-response`, {
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

    if (resData.result) {
      dispatch({type: REQUEST_SERVICE_RESPONSE, booking_id});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const job_completed = (booking_id, image, date, comment) => {
  return async (dispatch, getState) => {
    const {
      auth: {userId, tokenType, accessToken},
    } = getState().auth;

    if (!date) {
      throw new Error('Please clickOn JOB COMPLETED button!');
    }
    if (image.length === 0) {
      throw new Error('Attachment is required!');
    }
    if (!comment) {
      throw new Error('Comment is required!');
    }

    const formData = new FormData();
    formData.append('booking_id', booking_id);
    image.forEach((i, c) => {
      formData.append(`image[${c}]`, {
        name: i.fileName,
        uri: i.uri,
        type: i.type,
      });
    });

    formData.append('date', dayjs(date).format('YYYY-MM-DD'));
    formData.append('time', dayjs(date).format('HH:mm'));
    formData.append('partner_id', userId);
    formData.append('comment', comment);

    const res = await fetch(`${BASE_URL}partner/job-completed`, {
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

    if (resData.result) {
      dispatch({type: JOB_COMPLETED});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const get_job_history = () => {
  return async (dispatch, getState) => {
    const {
      auth: {userId, tokenType, accessToken},
    } = getState().auth;

    const formData = new FormData();
    formData.append('partner_id', userId);
    formData.append('limit', '1000');

    const res = await fetch(`${BASE_URL}partner/get-job-history`, {
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
      dispatch({type: GET_JOB_HISTORY, jobHistoryList: resData.data});
    }
  };
};

export const getSelectedService = () => {
  return async (dispatch, getState) => {
    const {
      auth: {tokenType, accessToken},
    } = getState().auth;

    const res = await fetch(`${BASE_URL}partner/get-selected-service`, {
      method: 'GET',
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
        type: GET_SELECTED_SERVICE,
        selectService: resData.data,
      });
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const getSubServiceByService = serviceId => {
  return async dispatch => {
    const res = await fetch(
      `${BASE_URL}partner/get-subservice-by-service/${serviceId}`,
    );

    const resData = await res.json();

    dispatch({
      type: GET_SUBSERVICE_BY_SERVICE,
      subServiceList: resData.data.subservice,
    });
  };
};

export const getChildCategoryBySubService = (serviceId, childId) => {
  return async dispatch => {
    const res = await fetch(
      `${BASE_URL}partner/get-child-service/${serviceId}/${childId}`,
    );

    const resData = await res.json();

    dispatch({
      type: GET_CHILD_SERVICE_BY_SUBSERVICE,
      childServiceList: resData.data.childservice,
    });
  };
};

export const addServicePricing = ({
  serviceId,
  subServiceId,
  childServiceId,
  servicePrice,
  serviceDesc,
  minimumOrderAmount,
  image,
}) => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('services_id', serviceId);
    formData.append('sub_service_id', subServiceId);
    formData.append('child_service_id', childServiceId);
    formData.append('minimum_order_amount', minimumOrderAmount);
    formData.append('service_price', servicePrice);
    formData.append('service_desc', serviceDesc);

    if (image?.name) {
      formData.append('image', {
        name: image.name,
        uri: image.uri,
        type: image.type,
      });
    }

    const res = await fetch(`${BASE_URL}partner/add-service-pricing`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: ADD_SERVICE_PRICE});
    } else {
      throw new Error(resData.message);
    }
  };
};

export const getServiceList = () => {
  return async dispatch => {
    const res = await fetch(`${BASE_URL}partner/get-services`);

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: GET_SERVICE_LIST, serviceList: resData.data});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const updateServiceStatus = id => {
  return async (dispatch, getState) => {
    const {
      auth: {tokenType, accessToken},
    } = getState().auth;

    const formData = new FormData();
    formData.append('id', id);

    const res = await fetch(`${BASE_URL}partner/update-service-status`, {
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
      dispatch({type: 'UPDATE_SERVICE_STATUS'});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const updateServicePrice = ({
  id,
  serviceId,
  subServiceId,
  childServiceId,
  price,
  minimumOrderAmount,
  desc,
  image,
}) => {
  return async dispatch => {
    const fd = new FormData();

    fd.append('partner_service_id', id);
    fd.append('services_id', serviceId);
    fd.append('sub_service_id', subServiceId);
    fd.append('child_service_id', childServiceId);
    fd.append('minimum_order_amount', minimumOrderAmount);
    fd.append('service_price', price);
    fd.append('service_desc', desc);
    if (image?.name) {
      fd.append('image', {
        name: image.name,
        uri: image.uri,
        type: image.type,
      });
    }

    const res = await fetch(`${BASE_URL}partner/update-service-price`, {
      method: 'POST',
      body: fd,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: UPDATE_SERVICE_PRICE});
    } else {
      throw new Error(resData.message);
    }
  };
};

export const help = (comment, image) => {
  return async (dispatch, getState) => {
    if (!comment) {
      throw new Error('Description is required!');
    }

    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('user_id', userId);
    form.append('description', comment);
    form.append('user_type', 'PARTNER');
    if (image) {
      form.append('file', image);
    }

    const res = await fetch(`${BASE_URL}partner/urgent-services`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: HELP});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const getTrade = () => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const res = await fetch(
      `${BASE_URL}partner/get-trade-license-details/${userId}`,
    );

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: GET_TRADE, trade: resData.data});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const updateTrade = (number, startDate, expireDate, image) => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('trade_license_number', number);
    form.append('issue_date', dayjs(startDate).format('YYYY-MM-DD'));
    form.append('last_date', dayjs(expireDate).format('YYYY-MM-DD'));

    if (image?.name) {
      form.append('trade_license_file', image);
    }

    const res = await fetch(`${BASE_URL}partner/update-trade-license`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: UPDATE_TRADE});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const updateTax = (name, number) => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('name', name);
    form.append('trn_number', number);

    const res = await fetch(
      `${BASE_URL}partner/update-tax-registration-number`,
      {
        method: 'POST',
        body: form,
      },
    );

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: UPDATE_TXN});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const getTax = () => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const res = await fetch(
      `${BASE_URL}partner/get-tax-registration-number/${userId}`,
    );

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: GET_TAX, tax: resData.data});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const getBankDetails = () => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const res = await fetch(`${BASE_URL}partner/get-bank-details/${userId}`);

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: GET_BANK_DETAILS, bank: resData.data});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const updateBankDetails = (bankName, account, iBan, image) => {
  return async (dispatch, getState) => {
    if (!image) {
      throw new Error(' Photo of Cancel Cheque is required !!!');
    }

    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('bank_name', bankName);
    form.append('bank_account_number', account);
    form.append('iban', iBan);
    if (image?.name) {
      form.append('cancel_cheque', image);
    }

    const res = await fetch(`${BASE_URL}partner/update-bank-detail`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: UPDATE_BANK});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const getServices = () => {
  return async dispatch => {
    const res = await fetch(`${BASE_URL}partner/get-service-for-partner`);

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: GET_SERVICES, services: resData.data.services});
    } else {
      throw new Error(resData.message);
    }
  };
};

export const selectServices = number => {
  return async dispatch => {
    if (number.length === 0) {
      throw new Error('Please Select Service First!');
    }

    const form = new FormData();
    number.forEach((n, i) => form.append(`selectedService[${i}]`, n));

    const res = await fetch(`${BASE_URL}partner/update-selected-service`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: SELECT_SERVICE});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export function getBookingDetails(booking_id,service_id,child_service_id) {

  return async (dispatch, getState) => {
    
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('booking_id', booking_id);
    form.append('service_id', service_id);
    form.append('child_service_id', child_service_id);

    const res = await fetch(`${BASE_URL}partner/get-booking-details`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: GET_BOOKING_DETAILS,
        getDetailsOfBooking: resData.data,
      });
    } else {
      dispatch({
        type: GET_BOOKING_DETAILS,
        getDetailsOfBooking: null,
      });
      throw new Error(resData.msg);
    }
  };
}