import {BASE_URL} from '../../constant/base_url';
import {logout} from './auth';

export const GET_ALL_BRANCH = 'GET_ALL_BRANCH';
export const ADD_BRANCH = 'ADD_BRANCH';
export const UPDATE_BRANCH = 'UPDATE_BRANCH';
export const UPDATE_BRANCH_STATUS = 'UPDATE_BRANCH_STATUS';
export const UPDATE_AVAILABILITY_STATUS = 'UPDATE_AVAILABILITY_STATUS';

export const getAllBranches = () => {
  return async (dispatch, getState) => {
    const res = await fetch(`${BASE_URL}partner/get-all-branch`, {
      method: 'GET',
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: GET_ALL_BRANCH,
        branchList: resData.data.branch,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

export const AddBranch = (
  phoneCode,
  mobile,
  address,
  countryId,
  cityId,
  lat,
  long,
) => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('phone_code', phoneCode);
    formData.append('mobile', mobile);
    formData.append('address', address);
    formData.append('country', countryId);
    formData.append('city', cityId);
    formData.append('lat', lat);
    formData.append('long', long);
    console.log(formData)

    const res = await fetch(`${BASE_URL}partner/add-branch`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();
    console.log(resData)

    if (resData.status) {
      dispatch({
        type: ADD_BRANCH,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

export const UpdateBranch = (
  phoneCode,
  mobile,
  address,
  countryId,
  cityId,
  branchId,
  lat,
  long,
) => {
  return async (dispatch, getState) => {
    const {
      auth: {tokenType, accessToken},
    } = getState().auth;

    const formData = new FormData();
    formData.append('branch_id', branchId);
    formData.append('phone_code', phoneCode);
    formData.append('mobile', mobile);
    formData.append('address', address);    
    formData.append('country', countryId);
    formData.append('city', cityId);
    formData.append('lat', lat);
    formData.append('long', long);
    console.log(formData)

    const res = await fetch(`${BASE_URL}partner/update-branch`, {
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
        type: UPDATE_BRANCH,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

export const updateBranchStatus = branchId => {
  return async dispatch => {
    const res = await fetch(
      `${BASE_URL}partner/update-current-branch/${branchId}`,
    );

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: UPDATE_BRANCH_STATUS,
        payload: {
          branchId: branchId,
        },
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

export const updateAvailabilityStatus = id => {
  console.log(id)
  return async dispatch => {
    const res = await fetch(
      `${BASE_URL}partner/update-branch-available-status/${id}`,
    );

    const resData = await res.json();
    console.log(resData)

    if (resData.status) {
      dispatch({
        type: UPDATE_AVAILABILITY_STATUS,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};
