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
 * @param {string} note_id
 * @param {CreateNoteType} payload
 * @returns {Promise<NoteType>}
 */
export async function createNote(payload: CreateNoteType) {
	return await axios
		.post(BACKEND_SERVER_DOMAIN + "/api/note/create/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(function (response) {
			return response.data.data as NoteType;
		});
}
