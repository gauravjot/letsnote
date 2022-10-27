import { combineReducers } from "redux";
import { SET_USER, LOGOUT_USER } from "./actions";

const userReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGOUT_USER:
      return (state = {});
    case SET_USER:
      return (state = payload);
    default:
      return state;
  }
};

const allReducers = combineReducers({ user: userReducer });

export default allReducers;
