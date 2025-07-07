import {
  GET_PROJECTS,
  GET_PROJECT,
  ADD_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  PROJECT_ERROR
} from '../actions/types';

const initialState = {
  projects: [],
  project: null,
  loading: true,
  error: null
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROJECTS:
      return {
        ...state,
        projects: payload,
        loading: false,
        error: null
      };
    case GET_PROJECT:
      return {
        ...state,
        project: payload,
        loading: false,
        error: null
      };
    case ADD_PROJECT:
      return {
        ...state,
        projects: [payload, ...state.projects],
        loading: false,
        error: null
      };
    case UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map((project) =>
          project._id === payload._id ? payload : project
        ),
        project: payload,
        loading: false,
        error: null
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter((project) => project._id !== payload),
        loading: false,
        error: null
      };
    case PROJECT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}