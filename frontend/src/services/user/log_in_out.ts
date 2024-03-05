import axios from "axios";
import {LOGIN_EP, LOGOUT_EP} from "@/config";
import {handleApiError} from "@/services/handle_error";
import {UserType} from "@/types/user";

export interface UserLoginInfo {
	email: string;
	password: string;
}

export async function userLogin(info: UserLoginInfo) {
	return await axios
		.post(LOGIN_EP, JSON.stringify(info), {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(function (response) {
			return response.data.data as UserType;
		});
}

export function userLogout() {
	return axios
		.delete(LOGOUT_EP, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			withCredentials: true,
		})
		.then(() => {
			return true;
		})
		.catch(handleApiError);
}
