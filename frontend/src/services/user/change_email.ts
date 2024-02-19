import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

export interface ChangeEmailType {
	email: string;
}

/**
 *
 * @param {string} token
 * @param {ChangeEmailType} payload
 * @returns {Promise<any>}
 */
export async function changeEmail(token: string, payload: ChangeEmailType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/user/change/email/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data;
		});
}
