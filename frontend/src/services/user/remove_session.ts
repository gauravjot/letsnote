import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

export interface RemoveSessionType {
	session_id: number;
}

/**
 *
 * @param {string} token
 * @param {RemoveSessionType} payload
 * @returns {Promise<any>}
 */
export async function closeSession(token: string, payload: RemoveSessionType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/user/session/close/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data;
		});
}
