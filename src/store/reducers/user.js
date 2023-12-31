import {
  SET_PROFILE,
  SET_TRANSACTION,
  GET_GALLERY,
  GET_COMPLAINTS,
  GET_CALENDER,
  GET_MESSAGE,
  SEND_MESSAGE,
  GET_WITHDRAWAL_LIST,
  SEND_REQUEST,
  MY_REVIEWS,
  MY_PLANS,
  MY_IOS_PLANS,
  MY_IOS_SUBSCRIBED_PLANS,
} from '../actions/user';

import {UPDATE_CALENDER_FIELD} from '../../components/DaySection';
import dayjs from 'dayjs';
import moment from 'moment';

const initialState = {
  partner: {
    name: '',
    email: '',
    phone_code: '',
    mobile: '',
    password: '',
    profession: '',
    company_name: '',
    photo: '',
    address: '',
    location: '',
    experience_text: '',
    business_name: '',
    facebook_link: '',
    twitter_link: '',
    instagram_link: '',
    referral_code: null,
    firstname: '',
    lastname: '',
    country_name: null,
    city_name: null,
    partner_wallet: '',
    country: '',
    city: '',
    trnNumber: '',
  },
  transaction: [],
  getGallery: [],
  complaints: [],
  calender: {
    id: null,
    branch_id: '',
    created_at: '',
    updated_at: '',

    monday: 0,
    monday_end: '',
    monday_end_two: '',
    monday_start: '',
    monday_start_two: '',

    tuesday: 0,
    tuesday_end: '',
    tuesday_end_two: '',
    tuesday_start: '',
    tuesday_start_two: '',

    wednesday: 0,
    wednesday_end: '',
    wednesday_end_two: '',
    wednesday_start: '',
    wednesday_start_two: '',

    thursday: 0,
    thursday_end: '',
    thursday_end_two: '',
    thursday_start: '',
    thursday_start_two: '',

    saturday: 0,
    saturday_end: '',
    saturday_end_two: '',
    saturday_start: '',
    saturday_start_two: '',

    sunday: 0,
    sunday_end: '',
    sunday_end_two: '',
    sunday_start: '',
    sunday_start_two: '',

    friday: 0,
    friday_end: '',
    friday_end_two: '',
    friday_start: '',
    friday_start_two: '',
  },
  getChats: [],
  getWithdrawalList: [],
  myReviews: [],
  myPlans: [],
  myProductId: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE: {
      const data = action.partner;

      return {
        ...state,
        partner: {
          ...state.partner,
          name: data.name,
          email: data.email,
          photo: data.photo,
          company_name: data.company_name,
          address: data.address,
          business_name: data.business_name,
          experience_text: data.experience_text,
          profession: data.profession,
          partner_wallet: data.partner_wallet,
          firstname: data.firstname,
          lastname: data.lastname,
          country_name: data.country_name,
          city_name: data.city_name,
          city: data.city,
          country: data.country,
          mobile: data.mobile,
          phone_code: data.phone_code,
          trnNumber: data.trade_license_number,
        },
      };
    }
    case SET_TRANSACTION: {
      return {
        ...state,
        transaction: [...action.transaction],
      };
    }
    case GET_GALLERY: {
      return {
        ...state,
        getGallery: [...action.getGallery],
      };
    }
    case GET_COMPLAINTS: {
      return {
        ...state,
        complaints: [...action.complaints],
      };
    }
    case GET_CALENDER: {
      const cal = action.calender;
      return {
        ...state,
        calender: {
          id: null,
          branch_id: cal.branch_id,
          created_at: cal.created_at,
          updated_at: cal.updated_at,

          monday: cal.monday,
          monday_end: moment(cal.monday_end, 'HH:mm:ss').format('HH:mm'),
          monday_end_two: moment(cal.monday_end_two, 'HH:mm:ss').format(
            'HH:mm',
          ),
          monday_start: moment(cal.monday_start, 'HH:mm:ss').format('HH:mm'),
          monday_start_two: moment(cal.monday_start_two, 'HH:mm:ss').format(
            'HH:mm',
          ),

          tuesday: cal.tuesday,
          tuesday_end: moment(cal.tuesday_end, 'HH:mm:ss').format('HH:mm'),
          tuesday_end_two: moment(cal.tuesday_end_two, 'HH:mm:ss').format(
            'HH:mm',
          ),
          tuesday_start: moment(cal.tuesday_start, 'HH:mm:ss').format('HH:mm'),
          tuesday_start_two: moment(cal.tuesday_start_two, 'HH:mm:ss').format(
            'HH:mm',
          ),

          wednesday: cal.wednesday,
          wednesday_end: moment(cal.wednesday_end, 'HH:mm:ss').format('HH:mm'),
          wednesday_end_two: moment(cal.wednesday_end_two, 'HH:mm:ss').format(
            'HH:mm',
          ),
          wednesday_start: moment(cal.wednesday_start, 'HH:mm:ss').format(
            'HH:mm',
          ),
          wednesday_start_two: moment(
            cal.wednesday_start_two,
            'HH:mm:ss',
          ).format('HH:mm'),

          thursday: cal.thursday,
          thursday_end: moment(cal.thursday_end, 'HH:mm:ss').format('HH:mm'),
          thursday_end_two: moment(cal.thursday_end_two, 'HH:mm:ss').format(
            'HH:mm',
          ),
          thursday_start: moment(cal.thursday_start, 'HH:mm:ss').format(
            'HH:mm',
          ),
          thursday_start_two: moment(cal.thursday_start_two, 'HH:mm:ss').format(
            'HH:mm',
          ),

          friday: cal.friday,
          friday_end: moment(cal.friday_end, 'HH:mm:ss').format('HH:mm'),
          friday_end_two: moment(cal.friday_end_two, 'HH:mm:ss').format(
            'HH:mm',
          ),
          friday_start: moment(cal.friday_start, 'HH:mm:ss').format('HH:mm'),
          friday_start_two: moment(cal.friday_start_two, 'HH:mm:ss').format(
            'HH:mm',
          ),

          saturday: cal.saturday,
          saturday_end: moment(cal.saturday_end, 'HH:mm:ss').format('HH:mm'),
          saturday_end_two: moment(cal.saturday_end_two, 'HH:mm:ss').format(
            'HH:mm',
          ),
          saturday_start: moment(cal.saturday_start, 'HH:mm:ss').format(
            'HH:mm',
          ),
          saturday_start_two: moment(cal.saturday_start_two, 'HH:mm:ss').format(
            'HH:mm',
          ),

          sunday: cal.sunday,
          sunday_end: moment(cal.sunday_end, 'HH:mm:ss').format('HH:mm'),
          sunday_end_two: moment(cal.sunday_end_two, 'HH:mm:ss').format(
            'HH:mm',
          ),
          sunday_start: moment(cal.sunday_start, 'HH:mm:ss').format('HH:mm'),
          sunday_start_two: moment(cal.sunday_start_two, 'HH:mm:ss').format(
            'HH:mm',
          ),
        },
      };
    }
    case UPDATE_CALENDER_FIELD: {
      const cal = {...state.calender};
      if (action.input.subField) {
        cal[`${action.input.field}_${action.input.subField}`] =
          action.input.value;
      } else {
        cal[`${action.input.field}`] = action.input.value;
      }
      return {
        ...state,
        calender: cal,
      };
    }
    case GET_MESSAGE: {
      return {
        ...state,
        getChats: [...action.getChats],
      };
    }
    case SEND_MESSAGE: {
      const x = [...state.getChats];
      return {
        ...state,
        // getChats: x,
      };
    }
    case GET_WITHDRAWAL_LIST: {
      return {
        ...state,
        getWithdrawalList: [...action.getWithdrawalList],
      };
    }
    case SEND_REQUEST:
      return {
        ...state,
        getWithdrawalList: [
          {
            id: Math.random(),
            wr_user_id: action.request.userId,
            wr_amount: action.request.amount,
            wr_status: 'PENDING',
            wr_payment_status: '0',
            created_at: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            updated_at: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          },
          ...state.getWithdrawalList,
        ],
      };
    case MY_REVIEWS: {
      return {
        ...state,
        myReviews: [...action.myReviews],
      };
    }
    case MY_PLANS: {
      return {
        ...state,
        myPlans: [...action.myPlans],
      };
    }
    case MY_IOS_SUBSCRIBED_PLANS: {
      return {
        ...state,
        myProductId: action.myProductId,
      };
    }
    case MY_IOS_PLANS: {
      return {
        ...state,
        myProductId: action.myProductId,
      };
    }
    default:
      return state;
  }
};
