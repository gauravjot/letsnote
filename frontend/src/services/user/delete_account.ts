import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

export interface DeleteAccountType {
	password: string;
}

/**
 *
 * @param {string} token
 * @param {ChangeUserNameType} payload
 * @returns {Promise<any>}
 */
export async function deleteAccount(token: string, payload: DeleteAccountType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/user/delete/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data;
		});
}
