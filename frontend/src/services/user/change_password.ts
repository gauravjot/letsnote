import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

export interface ChangePasswordType {
	old_password: string;
	new_password: string;
}

/**
 *
 * @param {string} token
 * @param {ChangePasswordType} payload
 * @returns {Promise<any>}
 */
export async function changePassword(token: string, payload: ChangePasswordType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/user/change/password/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data;
		});
}
