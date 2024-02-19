import {BACKEND_SERVER_DOMAIN} from "@/config";
import {UserSessionType} from "@/types/user";
import axios from "axios";

/**
 *
 * @param {string} token
 * @returns {Promise<UserSessionType[]>}
 */
export async function getUserSessions(token: string) {
	return await axios
		.get(BACKEND_SERVER_DOMAIN + "/api/user/sessions/", {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data.data as UserSessionType[];
		});
}
