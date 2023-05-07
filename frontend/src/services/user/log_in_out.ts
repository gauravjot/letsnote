import axios from "axios";
import { LOGIN_EP, LOGOUT_EP } from "config";
import { handleApiError } from "services/handle_error";
import { ApiError, ResponseType } from "types/query";
import { ApiUserType } from "types/api";

export function userLogin(
	email: string,
	password: string
): Promise<ResponseType<ApiUserType | ApiError>> {
	return axios
		.post(LOGIN_EP, JSON.stringify({ email: email, password: password }), {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(function (response) {
			return {
				success: response.data.success,
				res: response.data.data,
			} as ResponseType<ApiUserType>;
		})
		.catch(handleApiError);
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
