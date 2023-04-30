import { ApiUserType } from "types/api";

// User Reducer
export const SET_USER = "SET_USER";
export const LOGOUT_USER = "LOGOUT_USER";

export const setUser = (user: ApiUserType) => {
	return {
		type: SET_USER,
		payload: user,
	};
};

export const logoutUser = () => {
	return {
		type: LOGOUT_USER,
	};
};
