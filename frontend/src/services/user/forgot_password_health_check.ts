import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

/**
 *
 * @returns {Promise<any>}
 */
export async function passwordResetHealthCheck(token: string) {
	return await axios
		.get(BACKEND_SERVER_DOMAIN + `/api/user/password/reset/health/${token}/`, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(function (response) {
			return response.data;
		});
}
