export type NoteListItemType = {
	id: string;
	user: string;
	title: string;
	created: string;
	updated: string;
};

export type NoteListType = NoteListItemType[];

/*
	Status toast types
*/
export interface SavingState {
	icon: "ic-cloud" | "ic-cloud-done" | "ic-cloud-fail";
	color: "bg-slate-800" | "bg-green-800" | "bg-sky-600" | "bg-orange-700";
	message: string;
}
export const NOTE_STATUS: {[key: string]: SavingState} = {
	saving: {
		icon: "ic-cloud",
		color: "bg-slate-800",
		message: "Saving",
	},
	saved: {
		icon: "ic-cloud-done",
		color: "bg-green-800",
		message: "Saved",
	},
	created: {
		icon: "ic-cloud-done",
		color: "bg-sky-600",
		message: "Created",
	},
	failed: {
		icon: "ic-cloud-fail",
		color: "bg-orange-700",
		message: "Saving failed",
	},
};
