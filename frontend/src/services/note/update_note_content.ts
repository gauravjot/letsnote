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
 * @param {UpdateNoteContentType} payload
 * @returns {Promise<NoteType>}
 */
export async function updateNoteContent(payload: UpdateNoteContentType) {
	return await axios
		.put(BACKEND_SERVER_DOMAIN + "/api/note/" + payload.note_id + "/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(function (response) {
			return response.data.data as NoteType;
		});
}
