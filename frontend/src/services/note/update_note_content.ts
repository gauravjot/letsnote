import {BACKEND_SERVER_DOMAIN} from "@/config";
import {NoteType} from "@/types/api";
import {SlateDocumentType} from "@/utils/ExampleDocument";
import axios from "axios";

export interface UpdateNoteContentType {
	content: SlateDocumentType;
	note_id: string;
}

/**
 *
 * @param {string} token
 * @param {string} note_id
 * @param {UpdateNoteContentType} payload
 * @returns {Promise<NoteType>}
 */
export async function updateNoteContent(token: string, payload: UpdateNoteContentType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/note/" + payload.note_id + "/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data.data as NoteType;
		});
}
