import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

export interface DisableShareLinkType {
	id: string;
}

/**
 *
 * @param {string} token
 * @param {DisableShareLinkType} payload
 * @returns {Promise<any>}
 */
export async function disableShareLinkQuery(token: string, payload: DisableShareLinkType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/note/share/links/disable/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data;
		});
}
