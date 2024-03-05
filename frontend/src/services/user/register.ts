import {REGISTER_EP} from "@/config";
import {UserType} from "@/types/user";
import axios from "axios";

export interface UserRegisterInfo {
	name: string;
	email: string;
	password: string;
}

export interface UserRegisterResponse extends UserType {
	verifyEmailSent: boolean;
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
			withCredentials: true,
		})
		.then((res) => {
			return res.data.data as UserRegisterResponse;
		});
}
