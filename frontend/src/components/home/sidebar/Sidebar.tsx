import * as React from "react";
import Login from "components/home/sidebar/Login";
import NoteList from "components/home/sidebar/NoteList";
import { NoteType } from "types/api";

export interface ISidebarProps {
	currentNoteID: string | null;
	openNote: (nid: string) => void;
	openShareNote: (note: NoteType) => void;
	refresh: boolean;
}

export default function Sidebar(props: ISidebarProps) {
	return (
		<div className="h-screen max-h-screen overflow-y-auto min-w-0 w-full bg-white block border-r border-gray-300 border-solid sticky top-0">
			<div className="p-5 border-b border-gray-300 shadow-smb">
				<span className="font-sans font-black tracking-tighter text-[1.75rem] py-0.5">
					letsnote.io
				</span>
			</div>
			<Login />
			<NoteList
				openNote={props.openNote}
				shareNote={props.openShareNote}
				currentNote={
					props.currentNoteID !== undefined ? props.currentNoteID : null
				}
				refresh={props.refresh}
			/>
		</div>
	);
}
