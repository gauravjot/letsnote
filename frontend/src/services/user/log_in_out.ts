import axios from "axios";
import {LOGIN_EP, LOGOUT_EP} from "@/config";
import {handleApiError} from "@/services/handle_error";
import {UserSession, UserType} from "@/types/user";

export interface UserLoginInfo {
	email: string;
	password: string;
}

export interface UserReduxType extends UserSession {
	user: UserType;
}

export interface UserLoginResponse {
	success: boolean;
	data: UserReduxType;
}

export async function userLogin(info: UserLoginInfo) {
	return await axios
		.post(LOGIN_EP, JSON.stringify(info), {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(function (response) {
			return response.data;
		});
}

export function userLogout(token: string) {
	return axios
		.delete(LOGOUT_EP, {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: token,
			},
		})
		.then(() => {
			return true;
		})
		.catch(handleApiError);
}
