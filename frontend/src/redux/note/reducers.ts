import {AnyAction, Reducer} from "redux";
import {NoteType} from "@/types/api";
import {SET_NOTE} from "./actions";

const noteReducer: Reducer<NoteType, AnyAction> = (
	state: NoteType | null = null,
	action: AnyAction
) => {
	const {type, payload} = action;
	switch (type) {
		case SET_NOTE:
			return (state = payload);
		default:
			return state;
	}
};

export default noteReducer;
