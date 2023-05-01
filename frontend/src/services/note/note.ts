import axios from "axios";
import { NEW_NOTE_EP, NOTE_EP } from "config";
import { ResponseType } from "types/query";
import { SlateDocumentType } from "utils/ExampleDocument";

// read a note
// create a note
export function createNote(
	token: string,
	title: string,
	content: SlateDocumentType
): Promise<ResponseType> {
	return axios
		.post(
			NEW_NOTE_EP,
			JSON.stringify({ title: title, content: JSON.stringify(content) }),
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			}
		)
		.then(function (response) {
			return {
				success: true,
				res: response.data,
			};
		})
		.catch(function (error) {
			return {
				success: false,
				res:
					error.response && error.response.data
						? error.response.data.message[0]
						: error.response?.statusText || "Unable to reach server.",
			};
		});
}

// update a note
export function updateNoteContent(
	token: string,
	note: string,
	title: string,
	content: SlateDocumentType
): Promise<ResponseType> {
	return axios
		.put(
			NOTE_EP(note),
			JSON.stringify({ title: title, content: JSON.stringify(content) }),
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			}
		)
		.then(function (response) {
			return {
				success: true,
				res: response.data,
			};
		})
		.catch(function (error) {
			return {
				success: false,
				res:
					error.response && error.response.data
						? error.response.data.message[0]
						: error.response?.statusText || "Unable to reach server.",
			};
		});
}
// rename note title
// get list of user's notes
export {};
