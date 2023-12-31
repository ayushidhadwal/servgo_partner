import {
  DELETE_DELIVERY_BOY,
  GET_DELIVERY_CHARGES,
  GET_DELIVERY_DETAILS,
  GET_DELIVERY_LIST,
} from '../actions/delivery';

const initialState = {
  deliveryCharges: {
    deliveryChargesId: '',
    deliveryVendorId: '',
    branchId: '',
    deliveryCharges: '',
  },
  deliveryList: [],
  deliveryDetails: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DELIVERY_CHARGES: {
      const data = action.deliveryCharges;
      return {
        ...state,
        deliveryCharges: {
          ...state.deliveryCharges,
          deliveryChargesId: data?.delivery_charges_id,
          deliveryVendorId: data?.delivery_vendor_id,
          branchId: data?.branch_id,
          deliveryCharges: data?.delivery_charges,
        },
      };
    }
    case GET_DELIVERY_LIST: {
      return {
        ...state,
        deliveryList: [...action.deliveryList],
      };
    }
    case DELETE_DELIVERY_BOY: {
      return {
        ...state,
        deliveryList: state.deliveryList.filter(
          item => Number(item.id) !== Number(action.id),
        ),
      };
    }
    case GET_DELIVERY_DETAILS: {
      const data = action.deliveryDetails;

      return {
        ...state,
        deliveryDetails: {
          ...state.deliveryDetails,
          deliveryId: data.id,
          deliveryName: data.name,
          deliveryEmail: data.email,
          deliveryMobile: data.mobile,
          deliveryCode: data.phone_code,
          deliveryProof1: data.proof_id,
          deliveryImage1: data.proof_image,
          deliveryProof2: data.proof_second,
          deliveryImage2: data.image_second,
          deliveryAddress: data.address,
          deliveryPassword: data.password,
          countryId: data.country_id,
          cityId: data.city_id,
          branchId: data.branch_Id,
          countryName: data.country_name,
          cityName: data.city_name,
        },
      };
    }
    default:
      return state;
  }
};
