import {
  GET_BOOKING,
  GET_PENDING_REQUEST,
  GET_JOB_HISTORY,
  REQUEST_SERVICE_RESPONSE,
  GET_SELECTED_SERVICE,
  GET_SUBSERVICE_BY_SERVICE,
  GET_SERVICE_LIST,
  GET_TRADE,
  GET_TAX,
  GET_BANK_DETAILS,
  GET_SERVICES,
  GET_BOOKING_DETAILS,
  GET_CHILD_SERVICE_BY_SUBSERVICE,
} from '../actions/request';

const initialState = {
  bookingList: [],
  pendingRequest: [],
  jobHistoryList: [],
  selectService: [],
  subServiceList: [],
  childServiceList: [],
  serviceList: [],
  services: [],
  trade: {
    trade_license_number: '',
    tradelicense: '',
    startdate: '',
    expiredate: '',
  },
  tax: {
    trn_name: '',
    trn_number: '',
  },
  bank: {
    bank_name: '',
    bank_account_number: '',
    iban: '',
    cancel_cheque: '',
  },
  getDetailsOfBooking: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_BOOKING: {
      return {
        ...state,
        bookingList: [...action.bookingList],
      };
    }
    case GET_PENDING_REQUEST: {
      return {
        ...state,
        pendingRequest: [...action.pendingRequest],
      };
    }
    case GET_JOB_HISTORY: {
      return {
        ...state,
        jobHistoryList: [...action.jobHistoryList],
      };
    }
    case GET_SELECTED_SERVICE: {
      return {
        ...state,
        selectService: [...action.selectService],
      };
    }
    case GET_SUBSERVICE_BY_SERVICE: {
      return {
        ...state,
        subServiceList: [...action.subServiceList],
      };
    }
    case GET_CHILD_SERVICE_BY_SUBSERVICE: {
      return {
        ...state,
        childServiceList: [...action.childServiceList],
      };
    }
    case GET_SERVICE_LIST: {
      return {
        ...state,
        serviceList: [...action.serviceList],
      };
    }
    case GET_SERVICES: {
      return {
        ...state,
        services: [...action.services],
      };
    }
    case REQUEST_SERVICE_RESPONSE: {
      const pendingRequest = state.pendingRequest;
      const index = pendingRequest.findIndex(item => {
        return action.booking_id === item.booking_id;
      });
      if (index > -1) {
        pendingRequest.splice(index, 1);
      }
      return {
        ...state,
        pendingRequest: pendingRequest,
      };
    }
    case GET_TRADE: {
      const data = action.trade;
      return {
        ...state,
        trade: {
          ...state.trade,
          trade_license_number: data.trade_license_number,
          tradelicense: data.tradelicense,
          startdate: data.startdate,
          expiredate: data.expiredate,
        },
      };
    }
    case GET_TAX: {
      const data = action.tax;
      return {
        ...state,
        tax: {
          ...state.tax,
          trn_name: data.trn_name,
          trn_number: data.trn_number,
        },
      };
    }
    case GET_BANK_DETAILS: {
      const data = action.bank;
      return {
        ...state,
        bank: {
          ...state.bank,
          bank_name: data.bank_name,
          bank_account_number: data.bank_account_number
            ? data.bank_account_number.toString()
            : data.bank_account_number,
          iban: data.iban,
          cancel_cheque: data.cancel_cheque,
        },
      };
    }
    case GET_BOOKING_DETAILS: {
      return {
        ...state,
        getDetailsOfBooking:
          typeof action.getDetailsOfBooking === 'object'
            ? {...action.getDetailsOfBooking}
            : null,
      };
    }
    default:
      return state;
  }
};
