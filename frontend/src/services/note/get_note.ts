import {BACKEND_SERVER_DOMAIN} from "@/config";
import {NoteType} from "@/types/api";
import axios from "axios";

/**
 *
 * @param {string} note_id
 * @param {string} token
 * @returns {Promise<NoteType>}
 */

export default async function getNoteById(note_id: string) {
	return await axios
		.get(BACKEND_SERVER_DOMAIN + "/api/note/" + note_id + "/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(function (response) {
			// Close the sidebar on mobile if open
			return response.data.data as NoteType;
		});
}
