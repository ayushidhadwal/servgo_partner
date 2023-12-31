import {BASE_URL} from '../../constant/base_url';

export const GET_DELIVERY_CHARGES = 'GET_DELIVERY_CHARGES';
export const UPDATE_DELIVERY_CHARGES = 'UPDATE_DELIVERY_CHARGES';
export const GET_DELIVERY_LIST = 'GET_DELIVERY_LIST';
export const ADD_DELIVERY_BOY = 'ADD_DELIVERY_BOY';
export const DELETE_DELIVERY_BOY = 'DELETE_DELIVERY_BOY';
export const UPDATE_DELIVERY_BOY = 'UPDATE_DELIVERY_BOY';
export const GET_DELIVERY_DETAILS = 'GET_DELIVERY_DETAILS';

export const getDeliveryCharges = () => {
  return async dispatch => {
    const res = await fetch(`${BASE_URL}partner/get-delivery-data`);

    const response = await res.json();

    if (response.status) {
      dispatch({
        type: GET_DELIVERY_CHARGES,
        deliveryCharges: response.Data,
      });
    } else {
      throw new Error(response.message);
    }
  };
};
export const updateDeliveryCharges = charges => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('delivery_charges', charges);

    const res = await fetch(`${BASE_URL}partner/delivery-charge-update`, {
      method: 'POST',
      body: formData,
    });

    const response = await res.json();

    if (response.status) {
      dispatch({
        type: UPDATE_DELIVERY_CHARGES,
      });
    } else {
      throw new Error(response.message);
    }
  };
};

export const getDeliveryDetails = id => {
  return async dispatch => {
    const res = await fetch(`${BASE_URL}partner/delivery-boy-details/${id}`);

    const response = await res.json();

    if (response.status) {
      dispatch({
        type: GET_DELIVERY_DETAILS,
        deliveryDetails: response.data,
      });
    } else {
      throw new Error(response.message);
    }
  };
};

export const getDeliveryList = () => {
  return async dispatch => {
    const res = await fetch(`${BASE_URL}partner/delivery-boy-list`, {
      method: 'POST',
    });

    const response = await res.json();

    if (response.status) {
      dispatch({
        type: GET_DELIVERY_LIST,
        deliveryList: response.data,
      });
    } else {
      throw new Error(response.message);
    }
  };
};

export const addDeliveryBoy = (
  name,
  email,
  phoneCode,
  mobile,
  password,
  address,
  countryId,
  cityId,
  proofId1,
  proofId2,
  proofImg1,
  proofImg2,
) => {
  return async (dispatch, getState) => {
    if (name === '') {
      throw new Error('Please add name.');
    }
    if (email === '') {
      throw new Error('Email is Required.');
    }
    if (password === '') {
      throw new Error('Password is Required.');
    }
    if (address === '') {
      throw new Error('Address is Required.');
    }
    if (countryId === '') {
      throw new Error('Country Code is Required');
    }
    if (cityId === '') {
      throw new Error('City is Required');
    }
    if (phoneCode === '') {
      throw new Error('Phone Code is Required');
    }
    if (proofId1 === '') {
      throw new Error('Id is Required');
    }
    if (mobile === '') {
      throw new Error('Mobile Number is Required');
    }
    if (proofId2 === '') {
      throw new Error('Id is Required');
    }

    const {branchList} = getState().branch;

    const activeBranch = branchList.find(branch => branch.branch_status);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('branch_id', activeBranch.id);
    formData.append('email', email);
    formData.append('phone_code', phoneCode);
    formData.append('mobile', mobile);
    formData.append('password', password);
    formData.append('address', address);
    formData.append('city', cityId);
    formData.append('country', countryId);
    formData.append('Id_type', proofId1);
    formData.append('Id_type_2', proofId2);

    if (proofImg1?.name) {
      formData.append('Image_id', proofImg1);
    }

    if (proofImg2?.name) {
      formData.append('Image_id_2', proofImg2);
    }

    const res = await fetch(`${BASE_URL}partner/add-delivery-boy`, {
      method: 'POST',
      body: formData,
    });

    const response = await res.json();

    if (response.status) {
      dispatch({
        type: ADD_DELIVERY_BOY,
      });
    } else {
      throw new Error(response.message);
    }
  };
};

export const updateDeliveryBoy = (
  itemId,
  name,
  email,
  phoneCode,
  mobile,
  address,
  countryId,
  cityId,
  proofId1,
  proofId2,
  proofImg1,
  proofImg2,
) => {
  return async dispatch => {
    if (name === '') {
      throw new Error('Please add name.');
    }
    if (email === '') {
      throw new Error('Email is Required.');
    }
    if (address === '') {
      throw new Error('Address is Required.');
    }
    if (countryId === '') {
      throw new Error('Country Code is Required');
    }
    if (cityId === '') {
      throw new Error('City is Required');
    }
    if (phoneCode === '') {
      throw new Error('Phone Code is Required');
    }
    if (proofId1 === '') {
      throw new Error('Id is Required');
    }
    if (mobile === '') {
      throw new Error('Mobile Number is Required');
    }
    if (proofId2 === '') {
      throw new Error('Id is Required');
    }

    const formData = new FormData();
    formData.append('id', itemId);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone_code', phoneCode);
    formData.append('mobile', mobile);
    formData.append('address', address);
    formData.append('city', cityId);
    formData.append('country', countryId);
    formData.append('Id_type', proofId1);
    formData.append('Id_type_2', proofId2);

    if (proofImg1?.name) {
      formData.append('Image_id', proofImg1);
    }

    if (proofImg2?.name) {
      formData.append('Image_id_2', proofImg2);
    }

    const res = await fetch(`${BASE_URL}partner/update-delivery-boy`, {
      method: 'POST',
      body: formData,
    });

    const response = await res.json();

    if (response.status) {
      dispatch({
        type: UPDATE_DELIVERY_BOY,
      });
    } else {
      throw new Error(response.message);
    }
  };
};

export const deleteDeliveryBoy = id => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('id', id);

    const res = await fetch(`${BASE_URL}partner/delete-delivery-boy`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: DELETE_DELIVERY_BOY,
        id: id,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};
