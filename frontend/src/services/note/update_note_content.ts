import {BACKEND_SERVER_DOMAIN} from "@/config";
import {NoteType} from "@/types/api";
import {SlateDocumentType} from "@/utils/ExampleDocument";
import axios from "axios";

export interface UpdateNoteContentType {
	title: string;
	content: SlateDocumentType;
}

/**
 *
 * @param {string} token
 * @param {string} note_id
 * @param {UpdateNoteContentType} payload
 * @returns {Promise<NoteType>}
 */
export async function updateNoteContent(
	token: string,
	note_id: string,
	payload: UpdateNoteContentType
) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/note/" + note_id + "/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data.data as NoteType;
		});
}
