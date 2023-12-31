import {combineReducers} from 'redux';

import {LOGOUT} from './actions/auth';
import authReducer from './reducers/auth';
import userReducer from './reducers/user';
import requestReducer from './reducers/request';
import langReducer from './reducers/lang';
import branchReducer from './reducers/branch';
import productReducer from './reducers/product';
import categoryReducer from './reducers/category';
import deliveryReducer from './reducers/delivery';
import orderReducer from './reducers/order';

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  request: requestReducer,
  lang: langReducer,
  branch: branchReducer,
  product: productReducer,
  category: categoryReducer,
  delivery: deliveryReducer,
  order: orderReducer,
});

export const RootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
