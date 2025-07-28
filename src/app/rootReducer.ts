
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducers/auth/auth.slice';
import homeReducer from './reducers/dashbord/homeReducer';
import subscriptionReducer from  './reducers/subscription/subscription.slice';
import transactionReducer from  './reducers/TransactionHistory/transaction.slice';
const rootReducers = combineReducers({
  auth: authReducer,
  dashboard: homeReducer, 
  subscription: subscriptionReducer,
  transaction: transactionReducer,


});

export default rootReducers;
