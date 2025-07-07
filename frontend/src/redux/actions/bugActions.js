import axios from 'axios';
import {
  GET_BUGS,
  GET_BUG,
  ADD_BUG,
  UPDATE_BUG,
  DELETE_BUG,
  BUG_ERROR,
  GET_BUGS_BY_PROJECT
} from './types';
import { toast } from 'react-toastify';

// Get all bugs
export const getBugs = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/v1/bugs');
    dispatch({
      type: GET_BUGS,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: BUG_ERROR,
      payload: err.response?.data?.error || 'Error fetching bugs'
    });
    toast.error('Failed to load bugs');
  }
};

// Get bugs by project
export const getBugsByProject = (projectId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/v1/projects/${projectId}/bugs`);
    dispatch({
      type: GET_BUGS_BY_PROJECT,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: BUG_ERROR,
      payload: err.response?.data?.error || 'Error fetching bugs'
    });
    toast.error('Failed to load bugs for this project');
  }
};

// Get single bug
export const getBug = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/v1/bugs/${id}`);
    dispatch({
      type: GET_BUG,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: BUG_ERROR,
      payload: err.response?.data?.error || 'Error fetching bug'
    });
    toast.error('Failed to load bug details');
  }
};

// Add bug
export const addBug = (formData, navigate) => async (dispatch) => {
  try {
    const res = await axios.post('/api/v1/bugs', formData);
    dispatch({
      type: ADD_BUG,
      payload: res.data.data
    });
    toast.success('Bug created successfully!');
    navigate(`/bugs/${res.data.data._id}`);
  } catch (err) {
    dispatch({
      type: BUG_ERROR,
      payload: err.response?.data?.error || 'Error adding bug'
    });
    toast.error('Failed to create bug');
  }
};

// Update bug
export const updateBug = (id, formData) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/v1/bugs/${id}`, formData);
    dispatch({
      type: UPDATE_BUG,
      payload: res.data.data
    });
    toast.success('Bug updated successfully!');
  } catch (err) {
    dispatch({
      type: BUG_ERROR,
      payload: err.response?.data?.error || 'Error updating bug'
    });
    toast.error('Failed to update bug');
  }
};

// Delete bug
export const deleteBug = (id, navigate) => async (dispatch) => {
  try {
    await axios.delete(`/api/v1/bugs/${id}`);
    dispatch({
      type: DELETE_BUG,
      payload: id
    });
    toast.success('Bug deleted successfully!');
    navigate('/bugs');
  } catch (err) {
    dispatch({
      type: BUG_ERROR,
      payload: err.response?.data?.error || 'Error deleting bug'
    });
    toast.error('Failed to delete bug');
  }
};