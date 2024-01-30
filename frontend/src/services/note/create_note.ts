import {BACKEND_SERVER_DOMAIN} from "@/config";
import {NoteType} from "@/types/api";
import {SlateDocumentType} from "@/utils/ExampleDocument";
import axios from "axios";

export interface CreateNoteType {
	title: string;
	content: SlateDocumentType;
}

/**
 *
 * @param {string} token
 * @param {string} note_id
 * @param {CreateNoteType} payload
 * @returns {Promise<NoteType>}
 */
export async function createNote(token: string, payload: CreateNoteType) {
	return await axios
		.post(BACKEND_SERVER_DOMAIN + "/api/note/create/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return response.data.data as NoteType;
		});
}
