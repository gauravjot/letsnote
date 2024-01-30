import {BACKEND_SERVER_DOMAIN} from "@/config";
import {NoteListType} from "@/types/note";
import axios from "axios";

export async function getAllNotes(userToken: string) {
	return await axios
		.get(BACKEND_SERVER_DOMAIN + "/api/note/all", {
			headers: {
				"Content-Type": "application/json",
				Authorization: userToken,
			},
		})
		.then(function (response) {
			return response.data.data.reverse() as NoteListType;
		});
}
