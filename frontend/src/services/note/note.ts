import axios from "axios";
import { NEW_NOTE_EP, NOTE_EP } from "@/config";
import { handleApiError } from "@/services/handle_error";
import { NoteType } from "@/types/api";
import { ApiError, ResponseType } from "@/types/query";
import ExampleDocument, { SlateDocumentType } from "@/utils/ExampleDocument";

// read a note
// create a note
export function createNote(
	token: string,
	title: string = "Untitled",
	content: SlateDocumentType = ExampleDocument
): Promise<ResponseType<NoteType | ApiError>> {
	return axios
		.post(NEW_NOTE_EP, JSON.stringify({ title: title, content: content }), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return {
				success: true,
				res: response.data.data as NoteType,
			};
		})
		.catch(handleApiError);
}

// update a note
export function updateNoteContent(
	token: string,
	note: string,
	title: string,
	content: SlateDocumentType
): Promise<ResponseType<NoteType | ApiError>> {
	return axios
		.put(NOTE_EP(note), JSON.stringify({ title: title, content: content }), {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		})
		.then(function (response) {
			return {
				success: true,
				res: response.data.data,
			};
		})
		.catch(handleApiError);
}
// rename note title
// get list of user's notes
export {};
