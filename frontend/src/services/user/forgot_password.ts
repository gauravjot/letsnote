import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

export interface ForgotPasswordType {
	email: string;
}

/**
 *
 * @param {ForgotPasswordType} payload
 * @returns {Promise<boolean>}
 */
export async function forgotPassword(payload: ForgotPasswordType) {
	return await axios
		.post(BACKEND_SERVER_DOMAIN + "/api/user/password/forgot/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(() => {
			return true;
		});
}

export interface ResetPasswordType {
	token: string;
	password: string;
}
/**
 *
 * @param {ResetPasswordType} payload
 * @returns {Promise<boolean>}
 */
export async function resetPassword(payload: ResetPasswordType) {
	return await axios
		.post(BACKEND_SERVER_DOMAIN + "/api/user/password/reset/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(() => {
			return true;
		});
}
