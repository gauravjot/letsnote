import {BACKEND_SERVER_DOMAIN} from "@/config";
import axios from "axios";

/**
 *
 * @param {string} token
 * @param {string} note_id
 * @param {DeleteNoteType} payload
 * @returns {Promise<NoteType>}
 */
export async function deleteNote(token: string, note_id: string) {
	return await axios
		.delete(BACKEND_SERVER_DOMAIN + "/api/note/" + note_id + "/", {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data;
		});
}
