import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import bugReducer from './reducers/bugReducer';
import projectReducer from './reducers/projectReducer';
import userReducer from './reducers/userReducer';

const reducer = combineReducers({
  auth: authReducer,
  bug: bugReducer,
  project: projectReducer,
  user: userReducer,
});

const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

