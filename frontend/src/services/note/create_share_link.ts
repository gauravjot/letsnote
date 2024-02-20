import {BACKEND_SERVER_DOMAIN} from "@/config";
import {ShareNote} from "@/types/api";
import axios from "axios";

export interface ShareNoteQueryType {
	title: string;
	anonymous: boolean;
	active: boolean;
	password: string;
}

interface ShareNoteCreateType extends ShareNote {
	urlkey: string;
	isPasswordProtected: boolean;
}

/**
 *
 * @param {string} token
 * @param {string} note_id
 * @param {ShareNoteQueryType} payload
 * @returns {Promise<NoteType>}
 */
export async function shareNoteQuery(token: string, note_id: string, payload: ShareNoteQueryType) {
	return await axios
		.post(BACKEND_SERVER_DOMAIN + "/api/note/share/" + note_id + "/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data.data as ShareNoteCreateType;
		});
}
