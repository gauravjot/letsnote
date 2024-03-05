import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

export interface ChangeEmailType {
	email: string;
}

/**
 *
 * @param {ChangeEmailType} payload
 * @returns {Promise<any>}
 */
export async function changeEmail(payload: ChangeEmailType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/user/change/email/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(function (response) {
			return response.data;
		});
}
