import {NoteType} from "@/types/api";

export const SET_NOTE = "SET_NOTE";

export const setNote = (note: NoteType) => {
	return {
		type: SET_NOTE,
		payload: note,
	};
};
