import { combineReducers } from 'redux'; //Root Reducers
import alert from './alert';
import auth from './auth';

export default combineReducers({ alert, auth });
