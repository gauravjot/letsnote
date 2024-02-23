import {REGISTER_EP} from "@/config";
import axios from "axios";

export interface UserRegisterInfo {
	name: string;
	email: string;
	password: string;
}

export interface UserRegisterResponse {
	success: boolean;
	data: {
		verifyEmailSent: boolean;
		user: {
			id: string;
			name: string;
			email: string;
			verified: boolean;
			created: string;
			updated: string;
			password_updated: string;
		};
		token: string;
		session: number;
	};
}

/**
 *
 * @param info UserRegisterInfo
 * @returns Promise
 */
export async function userRegister(info: UserRegisterInfo) {
	return await axios
		.post(REGISTER_EP, JSON.stringify(info), {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((res) => {
			return res.data;
		});
}
