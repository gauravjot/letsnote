import NoteList from "@/components/home/sidebar/NoteList";
import {NoteType} from "@/types/api";
import LoginRegister from "./LoginRegister";
import {NoteListItemType} from "@/types/note";

interface ISidebarProps {
	currentNoteID: NoteType["id"] | null;
	openNote: (nid: NoteType["id"]) => void;
	openShareNote: (note: NoteListItemType) => void;
}

export default function HomeSidebar(props: ISidebarProps) {
	return (
		<>
			<LoginRegister />
			<NoteList
				openNote={props.openNote}
				shareNote={props.openShareNote}
				currentNote={props.currentNoteID !== undefined ? props.currentNoteID : null}
			/>
		</>
	);
}
