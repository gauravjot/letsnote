import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

export interface DisableShareLinkType {
	id: string;
}

/**
 *
 * @param {DisableShareLinkType} payload
 * @returns {Promise<any>}
 */
export async function disableShareLinkQuery(payload: DisableShareLinkType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/note/share/links/disable/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(function (response) {
			return response.data;
		});
}
