import axios from "axios";
import { LOGIN_EP, LOGOUT_EP } from "config";
import { handleApiError } from "services/handle_error";
import { ApiError, ResponseType } from "types/query";
import { ApiUserType, UserType } from "types/api";

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
			return { success: true, res: response.data };
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
