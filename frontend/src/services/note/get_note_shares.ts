import {BACKEND_SERVER_DOMAIN} from "@/config";
import {ShareNote} from "@/types/api";
import axios from "axios";

export async function getNoteShares(userToken: string | undefined, note_id: string) {
	return userToken
		? await axios
				.get(BACKEND_SERVER_DOMAIN + "/api/note/share/links/" + note_id + "/", {
					headers: {
						"Content-Type": "application/json",
						Authorization: userToken,
					},
				})
				.then(function (response) {
					return response.data.data as ShareNote[];
				})
		: Promise.reject("User token is null");
}
