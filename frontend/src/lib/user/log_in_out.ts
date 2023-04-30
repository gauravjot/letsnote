import axios from "axios";
import { LOGIN_EP, LOGOUT_EP } from "config";

export function userLogin(email: string, password: string) {
	return axios
		.post(LOGIN_EP, JSON.stringify({ email: email, password: password }), {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(function (response) {
			return { success: true, res: response.data };
		})
		.catch(function (error) {
			return {
				success: false,
				res:
					error.response && error.response.data
						? error.response.data.message[0]
						: error.response?.statusText || "Unable to reach server.",
			};
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
		.catch((err) => {
			return false;
		});
}
