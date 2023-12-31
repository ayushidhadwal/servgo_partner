import {
  LOGIN,
  SET_COUNTRIES,
  SET_CITIES,
  FORGOT_PASSWORD,
  VERIFY_OTP,
  REGISTER,
  SET_IP_ADDRESS,
} from '../actions/auth';
import {UPDATE_BRANCH_STATUS} from '../actions/branch';

const initialState = {
  register: {
    isVerified: false,
    mobileNumber: null,
  },
  auth: {
    userId: null,
    accessToken: null,
    tokenType: null,
    activeBranch: null,
  },
  settings: {
    currency: null,
    country: null,
  },
  countries: [],
  cities: [],
  email: '',
  otp: 0,
  token: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER: {
      const {isVerified, mobileNumber} = action.payload;

      return {
        ...state,
        register: {
          isVerified: isVerified,
          mobileNumber: mobileNumber,
        },
      };
    }
    case LOGIN: {
      const {userId, accessToken, tokenType, branchId} = action.payload;

      return {
        ...state,
        register: {
          mobileNumber: null,
        },
        auth: {
          ...state.auth,
          userId,
          accessToken,
          tokenType,
          activeBranch: branchId,
        },
      };
    }
    case FORGOT_PASSWORD: {
      return {
        ...state,
        email: action.email,
        otp: action.otp,
      };
    }
    case VERIFY_OTP: {
      return {
        ...state,
        token: action.token,
      };
    }
    case SET_COUNTRIES: {
      return {
        ...state,
        countries: [...action.countries],
      };
    }
    case SET_CITIES: {
      return {
        ...state,
        cities: [...action.cities],
      };
    }
    case SET_IP_ADDRESS: {
      const {currency, country} = action.payload;

      return {
        ...state,
        settings: {
          currency: currency,
          country: country,
        },
      };
    }
    case UPDATE_BRANCH_STATUS: {
      const {branchId} = action.payload;

      return {
        ...state,
        auth: {
          ...state.auth,
          activeBranch: branchId,
        },
      };
    }
    default:
      return state;
  }
};
