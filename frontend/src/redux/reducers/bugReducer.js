import {
  GET_BUGS,
  GET_BUG,
  ADD_BUG,
  UPDATE_BUG,
  DELETE_BUG,
  BUG_ERROR,
  GET_BUGS_BY_PROJECT
} from '../actions/types';

const initialState = {
  bugs: [],
  bug: null,
  loading: true,
  error: null
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BUGS:
    case GET_BUGS_BY_PROJECT:
      return {
        ...state,
        bugs: payload,
        loading: false,
        error: null
      };
    case GET_BUG:
      return {
        ...state,
        bug: payload,
        loading: false,
        error: null
      };
    case ADD_BUG:
      return {
        ...state,
        bugs: [payload, ...state.bugs],
        loading: false,
        error: null
      };
    case UPDATE_BUG:
      return {
        ...state,
        bugs: state.bugs.map((bug) =>
          bug._id === payload._id ? payload : bug
        ),
        bug: payload,
        loading: false,
        error: null
      };
    case DELETE_BUG:
      return {
        ...state,
        bugs: state.bugs.filter((bug) => bug._id !== payload),
        loading: false,
        error: null
      };
    case BUG_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}