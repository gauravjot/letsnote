import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

export interface ChangeUserNameType {
	name: string;
}

/**
 *
 * @param {ChangeUserNameType} payload
 * @returns {Promise<any>}
 */
export async function changeName(payload: ChangeUserNameType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/user/change/name/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(function (response) {
			return response.data;
		});
}
