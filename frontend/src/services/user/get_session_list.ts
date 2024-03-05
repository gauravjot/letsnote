import {BACKEND_SERVER_DOMAIN} from "@/config";
import {UserSessionType} from "@/types/user";
import axios from "axios";

/**
 *
 * @returns {Promise<UserSessionType[]>}
 */
export async function getUserSessions() {
	return await axios
		.get(BACKEND_SERVER_DOMAIN + "/api/user/sessions/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(function (response) {
			return response.data.data as UserSessionType[];
		});
}
