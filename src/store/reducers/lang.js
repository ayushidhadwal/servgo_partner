import {SET_LANGUAGE} from '../actions/lang';

const initialState = {
  lang: 'en',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE: {
      return {
        ...state,
        lang: action.lang,
      };
    }
    default:
      return state;
  }
};
