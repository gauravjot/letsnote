import { SET_USER, LOGOUT_USER } from "./actions";
import { ApiUserType } from "../types/api";
import { AnyAction, Reducer } from "redux";

const userReducer: Reducer<ApiUserType, AnyAction> = (
	state: ApiUserType | null = null,
	action: any
) => {
	const { type, payload } = action;
	switch (type) {
		case LOGOUT_USER:
			return (state = null);
		case SET_USER:
			return (state = payload);
		default:
			return state;
	}
};

export default userReducer;
