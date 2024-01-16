import NoteList from "@/components/home/sidebar/NoteList";
import {NoteType} from "@/types/api";
import LoginRegister from "./LoginRegister";

interface ISidebarProps {
	currentNoteID: NoteType["id"] | null;
	openNote: (nid: NoteType["id"]) => void;
	openShareNote: (note: NoteType) => void;
	refresh: boolean;
}

export default function HomeSidebar(props: ISidebarProps) {
	return (
		<>
			<LoginRegister />
			<NoteList
				openNote={props.openNote}
				shareNote={props.openShareNote}
				currentNote={props.currentNoteID !== undefined ? props.currentNoteID : null}
				refresh={props.refresh}
			/>
		</>
	);
}
