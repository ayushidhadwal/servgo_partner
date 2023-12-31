import {GET_CATEGORY_LIST, GET_SUBCATEGORY_LIST} from '../actions/category';

const initialState = {
  CategoryList: [],
  subCategoryList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORY_LIST: {
      return {
        ...state,
        CategoryList: [...action.CategoryList],
      };
    }
    case GET_SUBCATEGORY_LIST: {
      return {
        ...state,
        subCategoryList: [...action.subCategoryList],
      };
    }
    default:
      return state;
  }
};
