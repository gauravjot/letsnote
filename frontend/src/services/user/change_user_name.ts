import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

export interface ChangeUserNameType {
	name: string;
}

/**
 *
 * @param {string} token
 * @param {ChangeUserNameType} payload
 * @returns {Promise<any>}
 */
export async function changeName(token: string, payload: ChangeUserNameType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/user/change/name/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data;
		});
}
