import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../constant/base_url';
import {getNotificationToken} from '../../lib/notifee';

export const SESSION_ID = '"@ServGoPartner:userId"';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SET_COUNTRIES = 'SET_COUNTRIES';
export const SET_CITIES = 'SET_CITIES';
export const REGISTER = 'REGISTER';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const VERIFY_OTP = 'VERIFY_OTP';
export const SET_NEW_PASSWORD = 'SET_NEW_PASSWORD';
export const DELETE_PARTNER_ACCOUNT = 'DELETE_PARTNER_ACCOUNT';
export const SET_IP_ADDRESS = 'SET_IP_ADDRESS';

export const auth = ({userId, accessToken, tokenType, branchId}) => {
  return {
    type: LOGIN,
    payload: {
      userId: userId,
      accessToken: accessToken,
      tokenType: tokenType,
      branchId: branchId,
    },
  };
};

export const logout = () => {
  return async dispatch => {
    await AsyncStorage.removeItem(SESSION_ID);
    dispatch({type: LOGOUT});
  };
};

export const login = ({email, password}) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    if (!password) {
      throw new Error('Password is required!');
    }

    const token = await getNotificationToken();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('token', token);
    formData.append('platform', Platform.OS);


    console.log(formData)

    const res = await fetch(`${BASE_URL}partner/login`, {
      method: 'POST',
      body: formData,
    });



    if (!res.ok) {
      throw new Error('Error Code : ' + res.status + ' Internal Server Error.');
    }

    const resData = await res.json();

    if (resData.result) {
      const {
        mobile: mobileNumber,
        mobile_verified: isVerified,
        user_id: userId,
        access_token: accessToken,
        token_type: tokenType,
        branch,
      } = resData.data;

      if (isVerified === 'Yes') {
        const data = {userId, accessToken, tokenType, branchId: branch.id};

        await saveToStorage(data);
        dispatch(auth(data));
      } else {
        dispatch({
          type: REGISTER,
          payload: {
            isVerified: isVerified === 'Yes',
            mobileNumber,
          },
        });
      }
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const setCountries = () => {
  return async dispatch => {
    const res = await fetch(`${BASE_URL}main/get-countries`);
    
    const resData = await res.json();

    

    dispatch({type: SET_COUNTRIES, countries: resData.data});
  };
};

export const setCities = countryId => {
  return async dispatch => {
    const res = await fetch(`${BASE_URL}main/get-cities/${countryId}`);

    if (!res.ok) {
      throw new Error('Error Codes : ' + res.status + ' Internal Server Error.');
    }

    

    const resData = await res.json();
    console.log(resData);

    dispatch({type: SET_CITIES, cities: resData.data});
  };
};

export const register = (
  firstname,
  lastname,
  emailVal,
  password,
  passwordConfirmation,
  phoneCode,
  mobileVal,
  company,
  countryCode,
  cityId,
  trade_license_number,
  image,
  startdate,
  expiredate,
  long,
  lat,
  address,
) => {
  return async dispatch => {
    if (!firstname) {
      throw new Error('First Name is required!');
    }
    if (!lastname) {
      throw new Error('Last Name is required!');
    }
    if (!emailVal) {
      throw new Error('Email is required!');
    }
    if (!password) {
      throw new Error('Password is required!');
    }
    if (!passwordConfirmation) {
      throw new Error('Confirm Password is required!');
    }
    if (password !== passwordConfirmation) {
      throw new Error('Password Fields must be same!');
    }
    if (!phoneCode) {
      throw new Error('Phone Code is required!');
    }
    if (!mobileVal) {
      throw new Error('Mobile Number is required!');
    }
    if (!company) {
      throw new Error('Company Name is required!');
    }
    if (!countryCode) {
      throw new Error('Country Name is required!');
    }
    if (!cityId) {
      throw new Error('City Name is required!');
    }
    if (!trade_license_number) {
      throw new Error('Trade License Number is required!');
    }
    if (!image) {
      throw new Error('License is required!');
    }
    if (!startdate) {
      throw new Error('License Issue Date is required!');
    }
    if (!expiredate) {
      throw new Error('License Expire Date is required!');
    }
    if (!address) {
      throw new Error('Your Address is required!');
    }

    const token = await getNotificationToken();

    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', emailVal);
    formData.append('password', password);
    formData.append('password_confirmation', passwordConfirmation);
    formData.append('phone_code', phoneCode);
    formData.append('mobile', mobileVal);
    formData.append('company_name', company);
    formData.append('country', countryCode);
    formData.append('city', cityId);
    formData.append('trade_license_number', trade_license_number);
    if (image) {
      formData.append('tradelicense', image);
    }
    formData.append('startdate', startdate.toLocaleDateString());
    formData.append('expiredate', expiredate.toLocaleDateString());
    formData.append('token', token);
    formData.append('platform', Platform.OS);
    formData.append('latitude', lat);
    formData.append('longitude', long);
    formData.append('address', address);

    const response = await fetch(`${BASE_URL}partner/register`, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    const resData = await response.json();

    if (resData.result) {
      const {mobile: mobileNumber} = resData.data;

      dispatch({
        type: REGISTER,
        payload: {
          isVerified: false,
          mobileNumber: mobileNumber,
        },
      });
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const forgotPassword = ({email}) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    const formData = new FormData();
    formData.append('email', email);

    const res = await fetch(`${BASE_URL}partner/send-otp`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();

    if (resData.result) {
      dispatch({
        type: 'FORGOT_PASSWORD',
        email: resData.email,
        otp: resData.otp,
      });
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const verifyOtp = ({email, userOTP}) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }
    if (!userOTP) {
      throw new Error('OTP is required!');
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', userOTP);

    const res = await fetch(`${BASE_URL}partner/verify-otp`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Error Code : ' + res.status + ' Internal Server Error.');
    }

    const resData = await res.json();

    if (resData.result) {
      dispatch({
        type: 'VERIFY_OTP',
        token: resData.token,
      });
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const set_new_password = ({token, password, password_confirmation}) => {
  return async dispatch => {
    if (password.length < 6) {
      throw new Error('Password must contain 6 letters');
    }

    if (!password || !password_confirmation) {
      throw new Error('Fields must be filled!');
    }

    if (password !== password_confirmation) {
      throw new Error('Passwords must be same.');
    }

    const formData = new FormData();
    formData.append('token', token);
    formData.append('password', password);
    formData.append('password_confirmation', password_confirmation);

    const res = await fetch(`${BASE_URL}partner/forgot-password-update`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();

    if (resData.result) {
      dispatch({
        type: 'SET_NEW_PASSWORD',
      });
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const resendRegistrationEmailOtp = email => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    const formData = new FormData();
    formData.append('email', email);

    const res = await fetch(`${BASE_URL}partner/send-otp-again`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Error Code : ' + res.status + ' Internal Server Error.');
    }

    const resData = await res.json();

    if (resData.result) {
      const {otp, email, mobile, mobile_verified, email_verified} =
        resData.data;

      dispatch({
        type: REGISTER,
        register: {
          mobileVerified: mobile_verified.toUpperCase() !== 'NO',
          emailVerified: email_verified.toUpperCase() !== 'NO',
          emailOTP: otp,
          mobileNumber: mobile,
          email: email,
        },
      });
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const resendRegistrationMobileOtp = mobile => {
  return async dispatch => {
    if (!mobile) {
      throw new Error('Mobile Number is required!');
    }

    const formData = new FormData();
    formData.append('mobile', mobile);

    const res = await fetch(`${BASE_URL}partner/send-mobile-otp-again`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Error Code : ' + res.status + ' Internal Server Error.');
    }

    const resData = await res.json();

    if (resData.result) {
      const {mobile_otp, email, mobile, mobile_verified, email_verified} =
        resData.data;

      dispatch({
        type: REGISTER,
        register: {
          mobileVerified: mobile_verified.toUpperCase() !== 'NO',
          emailVerified: email_verified.toUpperCase() !== 'NO',
          mobileOTP: mobile_otp,
          mobileNumber: mobile,
          email: email,
        },
      });
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const verifyUserMobile = (mobile, otp) => {
  return async dispatch => {
    if (!mobile) {
      throw new Error('Mobile Number is required!');
    }

    if (!otp) {
      throw new Error('OTP is required!');
    }

    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('otp', otp);

    const res = await fetch(
      `${BASE_URL}partner/verify-mobile-user-registration`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!res.ok) {
      throw new Error('Error Code : ' + res.status + ' Internal Server Error.');
    }

    const resData = await res.json();

    if (resData.result) {
      const {
        user_id: userId,
        access_token: accessToken,
        token_type: tokenType,
        branch,
      } = resData.data;

      const data = {userId, accessToken, tokenType, branchId: branch.id};

      await saveToStorage(data);
      dispatch(auth(data));
    } else {
      throw new Error(resData.message);
    }
  };
};

export const deletePartnerAccount = () => {
  return async (dispatch, getState) => {
    const {
      auth: {tokenType, accessToken},
    } = getState().auth;

    await fetch(`${BASE_URL}partner/delete-account-partner`, {
      method: 'POST',
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    });
    await AsyncStorage.removeItem(SESSION_ID);
    dispatch({type: DELETE_PARTNER_ACCOUNT});
  };
};

export const setUserIp = () => {
  return async dispatch => {
    const result = await fetch('https://api.ipify.org/?format=json');
    const ipResult = await result.json();
    const ipAddress = ipResult?.ip;

    const formData = new FormData();
    formData.append('ip', ipAddress);

    const res = await fetch(`${BASE_URL}main/get-country-by-ip`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();

    if (resData.status) {
      const {country} = resData.data;

      dispatch({
        type: SET_IP_ADDRESS,
        payload: {
          currency: country.currency,
          country: country.name,
        },
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

const saveToStorage = async data => {
  await AsyncStorage.setItem(SESSION_ID, JSON.stringify(data));
};
