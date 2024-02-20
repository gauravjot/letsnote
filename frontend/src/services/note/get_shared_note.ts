import {BACKEND_SERVER_DOMAIN} from "@/config";
import {SharedNoteType} from "@/types/note";
import axios from "axios";

export async function getSharedNote(shareid: string, password: string) {
	return await axios
		.post(
			BACKEND_SERVER_DOMAIN + "/api/note/shared/" + shareid + "/",
			JSON.stringify({password: password}),
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
		.then(function (response) {
			return response.data.data as SharedNoteType;
		});
}
