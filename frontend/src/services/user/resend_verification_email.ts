import axios from "axios";
import {BACKEND_SERVER_DOMAIN} from "@/config";

export async function resendVerificationEmail() {
	return await axios
		.post(
			BACKEND_SERVER_DOMAIN + "/api/user/verifyemail/resend/",
			{},
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		)
		.then(function (response) {
			return response.data;
		});
}
