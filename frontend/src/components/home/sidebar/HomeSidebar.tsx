import Login from "components/home/sidebar/Login";
import NoteList from "components/home/sidebar/NoteList";
import { NoteType } from "types/api";

interface ISidebarProps {
	currentNoteID: NoteType["id"] | null;
	openNote: (nid: NoteType["id"]) => void;
	openShareNote: (note: NoteType) => void;
	refresh: boolean;
}

export default function HomeSidebar(props: ISidebarProps) {
	return (
		<>
			<Login />
			<NoteList
				openNote={props.openNote}
				shareNote={props.openShareNote}
				currentNote={
					props.currentNoteID !== undefined ? props.currentNoteID : null
				}
				refresh={props.refresh}
			/>
		</>
	);
}
