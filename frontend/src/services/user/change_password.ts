import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

export interface ChangePasswordType {
	old_password: string;
	new_password: string;
}

/**
 *
 * @param {ChangePasswordType} payload
 * @returns {Promise<any>}
 */
export async function changePassword(payload: ChangePasswordType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/user/change/password/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(function (response) {
			return response.data;
		});
}
