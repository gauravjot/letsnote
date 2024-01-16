import {SET_USER, LOGOUT_USER} from "./actions";
import {AnyAction, Reducer} from "redux";
import {UserReduxType} from "@/services/user/log_in_out";

const userReducer: Reducer<UserReduxType, AnyAction> = (
	state: UserReduxType | null = null,
	action: any
) => {
	const {type, payload} = action;
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
