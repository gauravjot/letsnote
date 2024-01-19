import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

export interface EditNoteTitleType {
	title: string;
}

/**
 *
 * @param {string} token
 * @param {string} note_id
 * @param {EditNoteTitleType} payload
 * @returns {Promise<any>}
 */
export async function editNoteTitle(token: string, note_id: string, payload: EditNoteTitleType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/note/" + note_id + "/edit/title/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data;
		});
}
