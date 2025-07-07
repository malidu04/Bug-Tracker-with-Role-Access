import axios from 'axios';
import {
  GET_PROJECTS,
  GET_PROJECT,
  ADD_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  PROJECT_ERROR
} from './types';
import { toast } from 'react-toastify';

// Get all projects
export const getProjects = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/v1/projects');
    dispatch({
      type: GET_PROJECTS,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: err.response?.data?.error || 'Error fetching projects'
    });
    toast.error('Failed to load projects');
  }
};

// Get single project
export const getProject = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/v1/projects/${id}`);
    dispatch({
      type: GET_PROJECT,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: err.response?.data?.error || 'Error fetching project'
    });
    toast.error('Failed to load project details');
  }
};

// Add project
export const addProject = (formData, navigate) => async (dispatch) => {
  try {
    const res = await axios.post('/api/v1/projects', formData);
    dispatch({
      type: ADD_PROJECT,
      payload: res.data.data
    });
    toast.success('Project created successfully!');
    navigate(`/projects/${res.data.data._id}`);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: err.response?.data?.error || 'Error adding project'
    });
    toast.error('Failed to create project');
  }
};

// Update project
export const updateProject = (id, formData) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/v1/projects/${id}`, formData);
    dispatch({
      type: UPDATE_PROJECT,
      payload: res.data.data
    });
    toast.success('Project updated successfully!');
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: err.response?.data?.error || 'Error updating project'
    });
    toast.error('Failed to update project');
  }
};

// Delete project
export const deleteProject = (id, navigate) => async (dispatch) => {
  try {
    await axios.delete(`/api/v1/projects/${id}`);
    dispatch({
      type: DELETE_PROJECT,
      payload: id
    });
    toast.success('Project deleted successfully!');
    navigate('/projects');
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: err.response?.data?.error || 'Error deleting project'
    });
    toast.error('Failed to delete project');
  }
};