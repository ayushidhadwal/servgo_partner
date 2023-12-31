import {applyMiddleware, createStore} from 'redux';
import ReduxThunk from 'redux-thunk';

import {RootReducer} from './RootReducer';

export const store = createStore(RootReducer, applyMiddleware(ReduxThunk));
