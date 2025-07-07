import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  USER_LOADED,
  AUTH_ERROR
} from './types';
import { setAuthToken } from '../../services/auth';
import { toast } from 'react-toastify';

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/v1/auth/me');
    dispatch({
      type: USER_LOADED,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = (formData, navigate) => async (dispatch) => {
  try {
    const res = await axios.post('/api/v1/auth/register', formData);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
    toast.success('Registration successful!');
    navigate('/dashboard');
  } catch (err) {
    const error = err.response?.data?.error || 'Registration failed';
    dispatch({
      type: REGISTER_FAIL,
      payload: error
    });
    toast.error(error);
  }
};

// Login User
export const login = (formData, navigate) => async (dispatch) => {
  try {
    const res = await axios.post('/api/v1/auth/login', formData);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
    toast.success('Login successful!');
    navigate('/dashboard');
  } catch (err) {
    const error = err.response?.data?.error || 'Login failed';
    dispatch({
      type: LOGIN_FAIL,
      payload: error
    });
    toast.error(error);
  }
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  toast.info('Logged out successfully');
};