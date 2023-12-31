import {BASE_URL} from '../../constant/base_url';

export const SET_PROFILE = 'SET_PROFILE';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_PROFILE_PICTURE = 'UPDATE_PROFILE_PICTURE';
export const SET_TRANSACTION = 'SET_TRANSACTION';
export const GET_GALLERY = 'GET_GALLERY';
export const DELETE_IMAGE = 'DELETE_IMAGE';
export const ADD_IMAGE = 'ADD_IMAGE';
export const GET_COMPLAINTS = 'GET_COMPLAINTS';
export const POST_FEEDBACK = 'POST_FEEDBACK';
export const GET_CALENDER = 'GET_CALENDER';
export const UPDATE_CALENDER = 'UPDATE_CALENDER';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const GET_MESSAGE = 'GET_MESSAGE';
export const GET_WITHDRAWAL_LIST = 'GET_WITHDRAWAL_LIST';
export const SEND_REQUEST = 'SEND_REQUEST';
export const MY_REVIEWS = 'MY_REVIEWS';
export const MY_PLANS = 'MY_PLANS';
export const MY_IOS_PLANS = 'MY_IOS_PLANS';
export const MY_IOS_SUBSCRIBED_PLANS = 'MY_IOS_SUBSCRIBED_PLANS';
export const UPDATE_EMAIL = 'UPDATE_EMAIL';
export const UPDATE_MOBILE = 'UPDATE_MOBILE';

export const set_Profile = () => {
  return async dispatch => {
    const res = await fetch(`${BASE_URL}partner/get-profile`);

    const resData = await res.json();

    if (resData.result) {
      dispatch({type: SET_PROFILE, partner: resData.data});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const updatePassword = (
  user_id,
  old_password,
  password,
  password_confirmation,
) => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    if (!old_password) {
      throw new Error('Old Password is required!');
    }
    if (!password) {
      throw new Error('Password is required!');
    }
    if (!password_confirmation) {
      throw new Error('Confirm Password is required!');
    }
    if (password.length < 5) {
      throw new Error(
        'New Password field must be atleast 6 charaters in length.',
      );
    }
    if (password !== password_confirmation) {
      throw new Error('Passwords must be same.!');
    }
    const formData = new FormData();
    formData.append('partner_id', userId);
    formData.append('old_password', old_password);
    formData.append('password', password);
    formData.append('password_confirmation', password_confirmation);

    const res = await fetch(`${BASE_URL}partner/update-password`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();

    if (resData.result) {
      dispatch({type: 'UPDATE_PASSWORD'});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const updateProfile = (
  firstName,
  lastName,
  address,
  countryCode,
  cityCode,
  companyName,
  overview,
) => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('first_name', firstName);
    form.append('last_name', lastName);
    form.append('address', address);
    form.append('country', countryCode);
    form.append('city', cityCode);
    form.append('company_name', companyName);
    form.append('overview', overview);

    const res = await fetch(`${BASE_URL}partner/partner-profile-update`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: UPDATE_PROFILE});
    } else {
      throw new Error('update Profile', resData.msg);
    }
  };
};

export const updatePicture = image => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    if (image?.fileName) {
      form.append('image', {
        uri: image.uri,
        name: image.fileName,
        type: image.type,
      });
    }

    const res = await fetch(`${BASE_URL}partner/update-profile-image`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.result) {
      dispatch({type: UPDATE_PROFILE_PICTURE});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const set_Transactions = () => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const res = await fetch(
      `${BASE_URL}partner/get-partner-wallet-transaction/${userId}`,
    );

    const resData = await res.json();

    if (resData.result) {
      dispatch({type: SET_TRANSACTION, transaction: resData.data});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export function getGallery() {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);

    const res = await fetch(`${BASE_URL}partner/fetch-gallery`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: GET_GALLERY, getGallery: resData.data.images});
    } else {
      throw new Error(resData.msg);
    }
  };
}

export function deleteImage(imageId) {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('image_id', imageId);

    const res = await fetch(`${BASE_URL}partner/delete-gallery-image`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: DELETE_IMAGE});
    } else {
      throw new Error(resData.msg);
    }
  };
}

export function addImages(img) {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();

    form.append('partner_id', userId);

    img.forEach((i, c) => {
      if (i?.fileName) {
        form.append(`images[${c}]`, {
          name: i.fileName,
          uri: i.uri,
          type: i.type,
        });
      }
    });

    const res = await fetch(`${BASE_URL}partner/add-gallery`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: ADD_IMAGE});
    } else {
      throw new Error(resData.msg);
    }
  };
}

export const getComplaints = () => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);

    const res = await fetch(`${BASE_URL}partner/get-complaints`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: GET_COMPLAINTS, complaints: resData.data});
    } else {
      throw new Error(resData.msg);
    }
  };
};

export function postFeedback(bookingId, complaintId, comment) {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('booking_id', bookingId);
    form.append('complaint_id', complaintId);
    form.append('feedback', comment);

    const res = await fetch(`${BASE_URL}partner/post-feedback`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: POST_FEEDBACK});
    } else {
      throw new Error(resData.msg);
    }
  };
}

export function getCalender() {
  return async dispatch => {
    const res = await fetch(`${BASE_URL}partner/get-calendar`, {
      method: 'GET',
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: GET_CALENDER, calender: resData.data});
    } else {
      throw new Error(resData.message);
    }
  };
}

export function updateCalender() {
  return async (dispatch, getState) => {
    const {calender} = getState().user;

    const form = new FormData();
    form.append('sunday', calender.sunday);
    form.append('sunday_start', calender.sunday_start);
    form.append('sunday_end', calender.sunday_end);
    form.append('sunday_start_two', calender.sunday_start_two);
    form.append('sunday_end_two', calender.sunday_end_two);
    form.append('monday', calender.monday);
    form.append('monday_start', calender.monday_start);
    form.append('monday_end', calender.monday_end);
    form.append('monday_start_two', calender.monday_start_two);
    form.append('monday_end_two', calender.monday_end_two);
    form.append('tuesday', calender.tuesday);
    form.append('tuesday_start', calender.tuesday_start);
    form.append('tuesday_end', calender.tuesday_end);
    form.append('tuesday_start_two', calender.tuesday_start_two);
    form.append('tuesday_end_two', calender.tuesday_end_two);
    form.append('wednesday', calender.wednesday);
    form.append('wednesday_start', calender.wednesday_start);
    form.append('wednesday_end', calender.wednesday_end);
    form.append('wednesday_start_two', calender.wednesday_start_two);
    form.append('wednesday_end_two', calender.wednesday_end_two);
    form.append('thursday', calender.thursday);
    form.append('thursday_start', calender.thursday_start);
    form.append('thursday_end', calender.thursday_end);
    form.append('thursday_start_two', calender.thursday_start_two);
    form.append('thursday_end_two', calender.thursday_end_two);
    form.append('friday', calender.friday);
    form.append('friday_start', calender.friday_start);
    form.append('friday_end', calender.friday_end);
    form.append('friday_start_two', calender.friday_start_two);
    form.append('friday_end_two', calender.friday_end_two);
    form.append('saturday', calender.saturday);
    form.append('saturday_start', calender.saturday_start);
    form.append('saturday_end', calender.saturday_end);
    form.append('saturday_start_two', calender.saturday_start_two);
    form.append('saturday_end_two', calender.saturday_end_two);

    const res = await fetch(`${BASE_URL}partner/insert-update-calendar`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: UPDATE_CALENDER});
    } else {
      throw new Error(resData.message);
    }
  };
}

export const sendMessage = (bookingId, text) => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('booking_id', bookingId);
    form.append('message', text);

    const res = await fetch(`${BASE_URL}partner/send-message`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: SEND_MESSAGE,
        input: text,
        bookingId: bookingId,
        senderId: userId,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

export const getMessage = (bookingId, customerId) => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const formData = new FormData();
    formData.append('partner_id', userId);
    formData.append('booking_id', bookingId);
    formData.append('user_id', customerId);

    const res = await fetch(`${BASE_URL}partner/get-messages`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({type: GET_MESSAGE, getChats: resData.data});
    } else {
      throw new Error(resData.message);
    }
  };
};

export function getWithdrawalRequest() {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const res = await fetch(
      `${BASE_URL}partner/get-withdrawal-request/${userId}`,
    );

    const resData = await res.json();

    if (resData.result) {
      dispatch({
        type: GET_WITHDRAWAL_LIST,
        getWithdrawalList: resData.data,
      });
    } else {
      throw new Error(resData.msg);
    }
  };
}

export function sendRequest(amt) {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('withdrawal_amount', amt);

    const res = await fetch(`${BASE_URL}partner/withdrawal-request`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: SEND_REQUEST,
        request: {
          userId: userId,
          amount: amt,
        },
      });
    } else {
      throw new Error(resData.msg);
    }
  };
}


export function setMyReview() {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);

    const res = await fetch(`${BASE_URL}partner/get-customer-reviews`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: MY_REVIEWS,
        myReviews: resData.data,
      });
    } else {
      throw new Error(resData.msg);
    }
  };
}

export function getmyPlans(currency) {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('currency', currency);

    const res = await fetch(`${BASE_URL}partner/get-subscription-plan`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: MY_PLANS,
        myPlans: resData.data,
      });
    } else {
      throw new Error(resData.msg);
    }
  };
}

export function payForPlan(planId, amount, currency) {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('plan_id', planId);
    form.append('amount', amount);
    form.append('currency', currency);

    const res = await fetch(`${BASE_URL}partner/pay-for-subscription-plan`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (!resData.status) {
      throw new Error(resData.msg);
    }
  };
}

export function getFreePlan(planId) {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('plan_id', planId);

    const res = await fetch(`${BASE_URL}partner/subscribe-free-plan`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    if (!resData.status) {
      throw new Error(resData.msg);
    }
  };
}

export const myIosSubscriptionPay = ({
  productId,
  transactionReceipt,
  transactionId,
}) => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('partner_id', userId);
    form.append('productId', productId);
    form.append('transactionReceipt', transactionReceipt);
    form.append('transactionId', transactionId);

    const res = await fetch(`${BASE_URL}partner/pay-subscription-plan`, {
      method: 'POST',
      body: form,
    });

    const resData = await res.json();

    console.log(resData);

    if (resData.status) {
      dispatch({
        type: MY_IOS_PLANS,
        myProductId: productId,
      });
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const getMySubscribedPlan = () => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const res = await fetch(`${BASE_URL}partner/get-subscribed-plan/${userId}`);

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: MY_IOS_SUBSCRIBED_PLANS,
        myProductId: resData.data.product_id,
      });
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const sendOTPEmail = email => {
  return async dispatch => {
    const fd = new FormData();
    fd.append('email', email);

    const res = await fetch(`${BASE_URL}partner/update-email`, {
      method: 'POST',
      body: fd,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: UPDATE_EMAIL,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

export const verifyOTPEmailUpdate = (email, otp) => {
  return async dispatch => {
    const fd = new FormData();
    fd.append('email', email);
    fd.append('otp', otp);

    const res = await fetch(`${BASE_URL}partner/partner-email-otp-verify`, {
      method: 'POST',
      body: fd,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: UPDATE_EMAIL,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

export const sendOTPMobile = (mobile, phoneCode) => {
  return async dispatch => {
    const fd = new FormData();
    fd.append('mobile', mobile);
    fd.append('phone_code', phoneCode);

    const res = await fetch(`${BASE_URL}partner/update-mobile`, {
      method: 'POST',
      body: fd,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: UPDATE_MOBILE,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

export const verifyOTPMobileUpdate = ({mobile, phoneCode, code}) => {
  return async dispatch => {
    const fd = new FormData();
    fd.append('mobile', mobile);
    fd.append('phone_code', phoneCode);
    fd.append('otp', code);

    const res = await fetch(`${BASE_URL}partner/partner-mobile-otp-verify`, {
      method: 'POST',
      body: fd,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: UPDATE_MOBILE,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};
