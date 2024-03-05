import {BACKEND_SERVER_DOMAIN} from "@/config";
import {ShareNote} from "@/types/api";
import axios from "axios";

export async function getNoteShares(note_id: string) {
	return await axios
		.get(BACKEND_SERVER_DOMAIN + "/api/note/share/links/" + note_id + "/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(function (response) {
			return response.data.data as ShareNote[];
		});
}
